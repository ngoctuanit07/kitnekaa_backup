<?php
/**
 * Magento
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@magentocommerce.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Magento to newer
 * versions in the future. If you wish to customize Magento for your
 * needs please refer to http://www.magentocommerce.com for more information.
 *
 * @category    Mage
 * @package     Mage_Downloadable
 * @copyright   Copyright (c) 2010 Magento Inc. (http://www.magentocommerce.com)
 * @license     http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */


/**
 * Downloadable products Price indexer resource model
 *
 * @category    Mage
 * @package     Mage_Downloadable
 * @author      Magento Core Team <core@magentocommerce.com>
 */
class Unirgy_DropshipMultiPrice_Model_PriceIndexer_CE1410_Downloadable extends Unirgy_DropshipMultiPrice_Model_PriceIndexer_CE1410_Default
{
    /**
     * Reindex temporary (price result data) for all products
     *
     * @return Mage_Downloadable_Model_Mysql4_Indexer_Price
     */
    public function reindexAll()
    {
        $this->useIdxTable(true);
        $this->_prepareFinalPriceData();
        $this->_applyCustomOption();
        $this->_applyDownloadableLink();
        $this->_movePriceDataToIndexTable();

        return $this;
    }

    /**
     * Reindex temporary (price result data) for defined product(s)
     *
     * @param int|array $entityIds
     * @return Mage_Catalog_Model_Resource_Eav_Mysql4_Product_Indexer_Price_Interface
     */
    public function reindexEntity($entityIds)
    {
        $this->_prepareFinalPriceData($entityIds);
        $this->_applyCustomOption();
        $this->_applyDownloadableLink();
        $this->_movePriceDataToIndexTable();

        return $this;
    }

    /**
     * Retrieve downloadable links price temporary index table name
     *
     * @see _prepareDefaultFinalPriceTable()
     * @return string
     */
    protected function _getDownloadableLinkPriceTable()
    {
        if ($this->useIdxTable()) {
            return $this->getTable('downloadable/product_price_indexer_idx');
        }
        return $this->getTable('downloadable/product_price_indexer_tmp');
    }

    /**
     * Prepare downloadable links price temporary index table
     *
     * @return Mage_Downloadable_Model_Mysql4_Indexer_Price
     */
    protected function _prepareDownloadableLinkPriceTable()
    {
        $this->_getWriteAdapter()->delete($this->_getDownloadableLinkPriceTable());
        return $this;
    }

    /**
     * Calculate and apply Downloadable links price to index
     *
     * @return Mage_Downloadable_Model_Mysql4_Indexer_Price
     */
    protected function _applyDownloadableLink()
    {
        $write  = $this->_getWriteAdapter();
        $table  = $this->_getDownloadableLinkPriceTable();

        $this->_prepareDownloadableLinkPriceTable();

        $dlType = $this->_getAttribute('links_purchased_separately');

        $select = $write->select()
            ->from(
                array('i' => $this->_getDefaultFinalPriceTable()),
                array('entity_id', 'customer_group_id', 'website_id'))
            ->join(
                array('dl' => $dlType->getBackend()->getTable()),
                "dl.entity_id = i.entity_id AND dl.attribute_id = {$dlType->getAttributeId()}"
                    . " AND dl.store_id = 0",
                array())
            ->join(
                array('dll' => $this->getTable('downloadable/link')),
                'dll.product_id = i.entity_id',
                array())
            ->join(
                array('dlpd' => $this->getTable('downloadable/link_price')),
                'dll.link_id = dlpd.link_id AND dlpd.website_id = 0',
                array())
            ->joinLeft(
                array('dlpw' => $this->getTable('downloadable/link_price')),
                'dlpd.link_id = dlpw.link_id AND dlpw.website_id = i.website_id',
                array())
            ->where('dl.value = ?', 1)
            ->group(array('i.entity_id', 'i.customer_group_id', 'i.website_id'))
            ->columns(array(
                'min_price' => new Zend_Db_Expr('MIN(IF(dlpw.price_id, dlpw.price, dlpd.price))'),
                'max_price' => new Zend_Db_Expr('SUM(IF(dlpw.price_id, dlpw.price, dlpd.price))')
            ));

        $query = $select->insertFromSelect($table);
        $write->query($query);

        $select = $write->select()
            ->join(
                array('id' => $table),
                'i.entity_id = id.entity_id AND i.customer_group_id = id.customer_group_id'
                    .' AND i.website_id = id.website_id',
                array())
            ->columns(array(
                'min_price'  => new Zend_Db_Expr('i.min_price + id.min_price'),
                'max_price'  => new Zend_Db_Expr('i.max_price + id.max_price'),
                'tier_price' => new Zend_Db_Expr('IF(i.tier_price IS NOT NULL, i.tier_price + id.min_price, NULL)')
            ));

        $canStates = Mage::getSingleton('udmultiprice/source')
            ->setPath('vendor_product_state_canonic')
            ->toOptionHash();
        foreach ($canStates as $csKey=>$csLbl) {
            $select->columns(array(
                'udmp_'.$csKey.'_min_price' => new Zend_Db_Expr('i.udmp_'.$csKey.'_min_price + id.min_price'),
                'udmp_'.$csKey.'_max_price' => new Zend_Db_Expr('i.udmp_'.$csKey.'_max_price + id.max_price'),
            ));
        }

        $query = $select->crossUpdateFromSelect(array('i' => $this->_getDefaultFinalPriceTable()));
        $write->query($query);

        if ($this->useIdxTable()) {
            $write->truncate($table);
        }
        else {
            $write->delete($table);
        }

        return $this;
    }
}

<?php
 
class Kitnekaa_Credittransfer_Model_Resource_Docname_Collection extends Mage_Core_Model_Mysql4_Collection_Abstract
{
    public function _construct()
    {
        //parent::_construct();
        $this->_init('credittransfer/docname');
    }
}
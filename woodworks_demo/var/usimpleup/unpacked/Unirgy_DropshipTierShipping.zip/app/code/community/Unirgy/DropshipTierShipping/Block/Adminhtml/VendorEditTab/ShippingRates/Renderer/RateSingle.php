<?php

class Unirgy_DropshipTierShipping_Block_Adminhtml_VendorEditTab_ShippingRates_Renderer_RateSingle extends Unirgy_DropshipTierShipping_Block_Vendor_RateSingle
{
    public function __construct()
    {
        Mage_Core_Block_Template::__construct();
        if (!$this->getTemplate()) {
            $this->setTemplate('udtiership/vendor/helper/rate_single.phtml');
        }
    }
}
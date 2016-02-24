var windowLoaded=false;Event.observe(window,'load',function(){windowLoaded=true;});Product.Config.prototype.fillSelect=function(element){return;};Product.Config.prototype.resetChildren=function(element){return;};Product.Config.prototype.configureForValues=function(){return;};Product.Config.prototype.origInitialize=Product.Config.prototype.initialize;Product.Config.prototype.initialize=function(config)
{this.origInitialize(config);this.configureObservers=[];this.loadOptions();}
Product.Config.prototype.handleSelectChange=function(element){this.configureElement(element);this.configureObservers.each(function(funct){funct(element);});};Product.Config.prototype.origConfigure=Product.Config.prototype.configure;Product.Config.prototype.configure=function(event){this.origConfigure(event);var element=Event.element(event);this.configureObservers.each(function(funct){funct(element);});};Product.Config.prototype.configureSubscribe=function(funct)
{this.configureObservers.push(funct);};Product.Config.prototype.loadOptions=function(){this.settings.each(function(element){element.disabled=false;element.options[0]=new Option(this.config.chooseText,'');var attributeId=element.id.replace(/[a-z]*/,'');var options=this.getAttributeOptions(attributeId);if(options){var index=1;for(var i=0;i<options.length;i++){options[i].allowedProducts=options[i].products.clone();element.options[index]=new Option(this.getOptionLabel(options[i],options[i].price),options[i].id);if(typeof options[i].price!='undefined'){element.options[index].setAttribute('price',options[i].price);}
element.options[index].setAttribute('data-label',options[i].label.toLowerCase());element.options[index].config=options[i];index++;}}
this.reloadOptionLabels(element);}.bind(this));},Product.ConfigurableSwatches=Class.create();Product.ConfigurableSwatches.prototype={productConfig:false,configurableAttributes:{},_O:{selectFirstOption:false},_F:{currentAction:false,firstOptionSelected:false,nativeSelectChange:true},_N:{resetTimeout:false},_E:{cartBtn:{btn:false,txt:['Add to Cart'],onclick:function(){return false;}},availability:false,optionOver:false,optionOut:false,_last:{optionOver:false},activeConfigurableOptions:[],allConfigurableOptions:[]},initialize:function(productConfig,config){if(config&&typeof(config)=='object'){this.setConfig(config);}
this.productConfig=productConfig;var attributes=[];for(var i in productConfig.config.attributes){attributes.push(productConfig.config.attributes[i]);}
this.configurableAttributes=attributes;this.run();return this;},setConfig:function(config){this._O=Object.extend(this._O,config);},run:function(){this._F.hasPresetValues=(typeof spConfig!="undefined"&&typeof spConfig.values!="undefined");this.setStockData();this.configurableAttributes.each(function(attr,i){this.setAttrData(attr,i);attr.options.each(function(opt,j){this.setOptData(opt,attr,j);this._E.allConfigurableOptions.push(opt);this.attachOptEvents(opt);}.bind(this));}.bind(this));this.productConfig.configureSubscribe(this.onSelectChange.bind(this));if(this._F.hasPresetValues){this.values=spConfig.values;this.configurableAttributes.each(function(attr){var optId=this.values[attr.id];var $break2={};try{attr.options.each(function(opt){if(optId==opt.id){this.selectOption(opt);throw $break2;};}.bind(this))}catch(e){};}.bind(this));this._F.presetValuesSelected=true;}else if(this._O.selectFirstOption){this.selectFirstOption();}
return this;},setStockData:function(){var cartBtn=$$('.add-to-cart button.button');this._E.cartBtn={btn:cartBtn,txt:cartBtn.invoke('readAttribute','title'),onclick:cartBtn.length?cartBtn[0].getAttribute('onclick'):''};this._E.availability=$$('p.availability');this._E.cartBtn.btn.invoke('up').invoke('observe','mouseenter',function(){clearTimeout(this._N.resetTimeout);this.resetAvailableOptions();}.bind(this));},setAttrData:function(attr,i){var optionSelect=$('attribute'+attr.id);attr._f={};attr._f.isCustomOption=false;attr._f.isSwatch=optionSelect.hasClassName('swatch-select');attr._e={optionSelect:optionSelect,attrLabel:this._u.getAttrLabelElement(attr.code),selectedOption:false,_last:{selectedOption:false}};attr._e.optionSelect.attr=attr;if(attr._f.isSwatch){attr._e.ul=$('configurable_swatch_'+attr.code);};return attr;},setOptData:function(opt,attr,j){opt.attr=attr;opt._f={isSwatch:attr._f.isSwatch,enabled:true,active:false};opt._e={option:this._u.getOptionElement(opt,attr,j)};opt._e.option.opt=opt;if(attr._f.isSwatch){opt._e.a=$('swatch'+opt.id);opt._e.li=$('option'+opt.id);opt._e.ul=attr._e.ul;}
return opt;},attachOptEvents:function(opt){var attr=opt.attr;if(opt._f.isSwatch){opt._e.a.observe('click',function(event){Event.stop(event);this._F.currentAction="click";attr._e._last.selectedOption=attr._e.selectedOption;attr._e.selectedOption=opt;this.onOptionClick(attr);return false;}.bind(this)).observe('mouseenter',function(){this._F.currentAction="over-swatch";this._E.optionOver=opt;this.onOptionOver();this._E._last.optionOver=this._E.optionOver;}.bind(this)).observe('mouseleave',function(){this._F.currentAction="out-swatch";this._E.optionOut=opt;this.onOptionOut();}.bind(this));};},selectFirstOption:function(){if(this.configurableAttributes.length){var attr=this.configurableAttributes[0];if(attr.options.length){var opt=attr.options[0];this.selectOption(opt);};};},selectOption:function(opt){var attr=opt.attr;this._F.currentAction="click";attr._e._last.selectedOption=attr._e.selectedOption;attr._e.selectedOption=opt;this.onOptionClick(attr);},onSelectChange:function(select)
{var attr=select.attr;if(this._F.nativeSelectChange){this._F.currentAction='change';var option=select.options[select.selectedIndex];if(option.opt){attr._e._last.selectedOption=attr._e.selectedOption;attr._e.selectedOption=option.opt;if(attr._e._last.selectedOption)attr._e._last.selectedOption._f.active=false;option.opt._f.active=true;var pos=this._E.activeConfigurableOptions.indexOf(attr._e._last.selectedOption);if(pos!==-1)this._E.activeConfigurableOptions.splice(pos,1);this._E.activeConfigurableOptions.push(option.opt);}else{var pos=this._E.activeConfigurableOptions.indexOf(attr._e._last.selectedOption);if(pos!==-1)this._E.activeConfigurableOptions.splice(pos,1);if(attr._e._last.selectedOption)attr._e._last.selectedOption._f.active=false;}
this.setAvailableOptions();this.checkStockStatus();}},onOptionClick:function(attr){var opt=attr._e.selectedOption;if(opt){if(opt!=attr._e._last.selectedOption){attr._e.attrLabel.innerHTML=this.getOptionLabel(opt);if(opt._f.isSwatch){opt._e.ul.select('li').invoke('removeClassName','selected');opt._e.li.addClassName('selected');var inputBox=attr._e.optionSelect.up();if(inputBox.hasClassName('validation-error')){inputBox.removeClassName('validation-error');inputBox.down('.validation-advice').remove();}};if(attr._e._last.selectedOption)attr._e._last.selectedOption._f.active=false;opt._f.active=true;var pos=this._E.activeConfigurableOptions.indexOf(attr._e._last.selectedOption);if(pos!==-1)this._E.activeConfigurableOptions.splice(pos,1);this._E.activeConfigurableOptions.push(opt);this.setAvailableOptions();if(opt._f.isSwatch&&!attr._f.isCustomOption&&this._F.firstOptionSelected){this.previewAvailableOptions();};};}else{var pos=this._E.activeConfigurableOptions.indexOf(attr._e._last.selectedOption);if(pos!==-1)this._E.activeConfigurableOptions.splice(pos,1);if(attr._e._last.selectedOption)attr._e._last.selectedOption._f.active=false;this.setAvailableOptions();}
this.checkStockStatus();this._E.activeConfigurableOptions.each(function(selectedOpt){var oldDisabledValue=selectedOpt._e.option.disabled;selectedOpt._e.option.disabled=false;selectedOpt._e.option.selected=true;selectedOpt._e.option.disabled=oldDisabledValue;});if((this._O.selectFirstOption&&!this._F.firstOptionSelected)||(this._F.hasPresetValues&&!this._F.presetValuesSelected)||(!windowLoaded)){Event.observe(window,'load',function(){window.setTimeout(function(){this.updateSelect(attr);this._F.firstOptionSelected=true;}.bind(this),200);}.bind(this));}else{this.updateSelect(attr);this._F.firstOptionSelected=true;}},onOptionOver:function(){if(PointerManager.getPointer()==PointerManager.TOUCH_POINTER_TYPE){return;}
var opt=this._E.optionOver;var attr=opt.attr;var lastOpt=this._E._last.optionOver;clearTimeout(this._N.resetTimeout);if(lastOpt&&lastOpt._f.isSwatch){lastOpt._e.li.removeClassName('hover');}
if(opt._f.isSwatch){opt._e.li.addClassName('hover');}
attr._e.attrLabel.innerHTML=this.getOptionLabel(opt);if(lastOpt&&lastOpt.attr.id!=opt.attr.id){this.setAvailableOptions();lastOpt.attr._e.attrLabel.innerHTML=lastOpt.attr._e.selectedOption?this.getOptionLabel(lastOpt.attr._e.selectedOption):'';}
if(!attr._f.isCustomOption){this.previewAvailableOptions();var stockCheckOptions=this._E.activeConfigurableOptions;if(!opt._f.active){stockCheckOptions=stockCheckOptions.without(attr._e.selectedOption);stockCheckOptions.push(opt);};this.checkStockStatus(stockCheckOptions);};},onOptionOut:function(){if(PointerManager.getPointer()==PointerManager.TOUCH_POINTER_TYPE){return;}
var opt=this._E.optionOver;this._N.resetTimeout=setTimeout(function(){this.resetAvailableOptions();}.bind(this),300);if(opt&&opt._f.isSwatch){opt._e.li.removeClassName('hover');};},setAvailableOptions:function(){var args=arguments;var loopThroughOptions=args.length?args[0]:this._E.allConfigurableOptions;loopThroughOptions.each(function(loopingOption){var productArrays=[loopingOption.products];if(loopingOption.attr._e.selectedOption){this._E.activeConfigurableOptions.without(loopingOption.attr._e.selectedOption).each(function(selectedOpt){productArrays.push(selectedOpt.products);});}else{this._E.activeConfigurableOptions.each(function(selectedOpt){productArrays.push(selectedOpt.products);});}
var result=this._u.intersectAll(productArrays);this.setOptionStatus(loopingOption,result.length);}.bind(this));},previewAvailableOptions:function(){var opt=this._E.optionOver;if(!opt){return;}
var attr=opt.attr;this._E.allConfigurableOptions.each(function(loopingOption,i){var productArrays=[loopingOption.products,opt.products];if(attr.id==loopingOption.attr.id){return;}
if(!loopingOption.attr._e.selectedOption){this._E.activeConfigurableOptions.each(function(selectedOpt){if(selectedOpt.attr.id!=opt.attr.id){productArrays.push(selectedOpt.products);};});};var result=this._u.intersectAll(productArrays);this.setOptionStatus(loopingOption,result.length);}.bind(this));},resetAvailableOptions:function(){var opt=this._E.optionOver;if(opt){var attr=opt.attr;attr._e.attrLabel.innerHTML=attr._e.selectedOption?this.getOptionLabel(attr._e.selectedOption):'';this._F.currentAction=false;if(!attr._f.isCustomOption){this.setAvailableOptions();this.checkStockStatus();}
this._E._last.optionOver=false;};},checkStockStatus:function(){var inStock=true;var checkOptions=arguments.length?arguments[0]:this._E.activeConfigurableOptions;checkOptions.each(function(selectedOpt){if(!selectedOpt._f.enabled){inStock=false;throw $break;}});this.setStockStatus(inStock);},setStockStatus:function(inStock){if(inStock){this._E.availability.each(function(el){var el=$(el);el.addClassName('in-stock').removeClassName('out-of-stock');el.select('span').invoke('update',Translator.translate('In Stock'));});this._E.cartBtn.btn.each(function(el,index){var el=$(el);el.disabled=false;el.removeClassName('out-of-stock');el.writeAttribute('onclick',this._E.cartBtn.onclick);el.title=''+Translator.translate(this._E.cartBtn.txt[index]);el.select('span span').invoke('update',Translator.translate(this._E.cartBtn.txt[index]));}.bind(this));}else{this._E.availability.each(function(el){var el=$(el);el.addClassName('out-of-stock').removeClassName('in-stock');el.select('span').invoke('update',Translator.translate('Out of Stock'));});this._E.cartBtn.btn.each(function(el){var el=$(el);el.addClassName('out-of-stock');el.disabled=true;el.removeAttribute('onclick');el.observe('click',function(event){Event.stop(event);return false;});el.writeAttribute('title',Translator.translate('Out of Stock'));el.select('span span').invoke('update',Translator.translate('Out of Stock'));});}},setOptionStatus:function(opt,enabled){var attr=opt.attr;var enabled=enabled>0;opt._f.enabled=enabled;if(opt._f.isSwatch){var method=enabled?'removeClassName':'addClassName';opt._e.li[method]('not-available');}else if(this._F.currentAction=="click"||this._F.currentAction=="change"){var attrDisable=enabled?'removeAttribute':'writeAttribute';$(opt._e.option)[attrDisable]('disabled');}
return enabled;},updateSelect:function(attr){if(attr._e.selectedOption!==false&&attr._e.optionSelect){this._F.nativeSelectChange=false;ConfigurableMediaImages.updateImage(attr._e.optionSelect);this.productConfig.handleSelectChange(attr._e.optionSelect);this._F.nativeSelectChange=true;};},getOptionLabel:function(option){return this.productConfig.getOptionLabel(option,option.price);},_u:{getAttrLabelElement:function(attrCode){var spanLabel=$$('#select_label_'+attrCode);if(spanLabel.length){return spanLabel[0];}else{var label=$$('#'+attrCode+'_label');if(label.length){return label[0].insert({'bottom':' <span id="select_label_'+attrCode+'" class="select-label"></span>'}).select('span.select-label')[0];};};return false;},getOptionElement:function(opt,attr,idx){var indexedOption=attr._e.optionSelect.options[idx+1];if(indexedOption&&indexedOption.value==opt.id){return indexedOption;};var optionElement=false;var optionsLen=attr._e.optionSelect.options.length;var option;for(var i=0;i<optionsLen;i++){option=attr._e.optionSelect.options[i];if(option.value==opt.id){optionElement=option;throw $break;};}
return optionElement;},intersectAll:function(lists){if(lists.length==0)return[];else if(lists.length==1)return lists[0];var result=lists[0];for(var i=1;i<lists.length;i++){if(!result.length)break;result=result.intersect(lists[i]);}
return result;}}}
/**
 * Passenger JS
 * @description Passenger JS is a UI/UX helper tool that allows users to create passwords that meet the minimum requirements of a website or web application with greater ease. Multiple indicators help users to identify what is missing by providing direct instantaneous feedback as users type. UX research has show that there is a notable user frustration with user password creation. This tool helps to alleviate that frustration through numerous proven UX principles.
 * @author 	Arthur Khachatryan
 * @beta
 * @version 0.7
 * @date 	05/11/2015
 */

var passengers = {};

/**
 * Passenger main constructor
 * @param 	{object} 		config 				configuration object with all necessary settings and options
 * @param 	{string} 		config.field 		the password field ID
 * @param 	{string} 		config.styles 		the custom CSS classes to be applied to the passenger box  
 * @param 	{array} 		config.contracts 	the custom password contracts  
 * @constructor
 * 
 */
function Passenger(config){
	// not called with config, fail fast
	if (!config || !config.field) {
		return console.log("Error: config, and at minimum the password field ID is required.");
	}
	var _instance          = this;
	_instance.sBoxID = config.field;

	var count = 0
		, ID                 = config.field
		, ElField            = _instance.getElement(ID)
		// if there is a contracts array passed in, use that, otherwise use the default passenger contracts
		, aContracts         = config.contracts || _instance.getContracts()
		, nContracts         = aContracts.length
		, box                = _instance.createBox(ElField, aContracts, config)
		, elInputTypeToggle  = _instance.inputTypeToggle(ElField)
		, elBoxDisplayToggle = _instance.boxDisplayToggle(elInputTypeToggle, box)
	;

	_instance.box        = box;
	_instance.contracts  = aContracts;
	_instance.nContracts = _instance.contracts.length;
	
	_instance.setupBoxEvents(ElField,box);

	// add instance to top-level object that tracks instances, initially with unmet password requirements
	passengers[_instance.sBoxID] = {
		fulfilled : false
	}

	_instance.allPassed  = _instance.isPassFulfilled;

	return _instance;
}

/**
 * Is the password contract requirements met for instance?
 * @this 	instance object
 * @return 	{boolean} 		whether password requirements have been met or not
 */
Passenger.prototype.isPassFulfilled = function() {
	return passengers[this.sBoxID].fulfilled;
}

/**
 * Create Passenger box for user feeback
 * @param   {string} 		elField 	the ID of the specific instance of Passenger implementation
 * @param 	{array} 		aContracts 	array list of contracts
 * @param 	{object} 		config 		the configuration object passenger is instantiated with 
 * @return  {DOMElement}    			the newly created DOM element of the box
 */
Passenger.prototype.createBox = function(elField, aContracts, config) {
	if (!config) {
		return console.log("Error: configuration is required to create passenger box.");
	}
	var i = 0
		, sBoxID = this.sBoxID
		, sCSS = (config.styles) ? ' ' + config.styles : ''
		, nContracts = aContracts.length
		, passboxDIV = _after({
			el: elField
			, selNew: "div"
			, sID: "passbox_" + sBoxID
			, sCSS: "passbox" + sCSS
		})
		, passboxLabel = _appendChild({
			el: passboxDIV
			, selNew: "label"
			, sText: "Password Must:"
		})
		, passboxUL = _after({
			el: passboxLabel
			, selNew: "ul"
		})
		// create doc fragment to append all rule LIs
		, docfrag = document.createDocumentFragment()
		, li
		, sRulePrefix = sBoxID + '-rule-'
	;

	// loop through contracts array and add an LI to docfrag for each...
	for (; i < nContracts; i++) {
		li = document.createElement("li");
  		li.textContent = aContracts[i].label;
  		li.id = sRulePrefix + aContracts[i].name;
		docfrag.appendChild(li);
	}
	
	passboxUL.appendChild(docfrag);
	return passboxDIV;
}

/**
 * Toggles the display of the box
 * @param 	{DOMElement} 	elAfter 	the DOM element to create the toggle link after
 * @param  	{DOMElement} 	box 		the DOM element of the box
 * @return 	{DOMElement}     			the DOM element of the toggle link
 */
Passenger.prototype.boxDisplayToggle = function(elAfter, box) {
	if (!elAfter || !box) {
		return console.log("Error: need both, the element to add box toggle link and the box itself");
	}
	var sBoxID = this.sBoxID;
	var elBoxToggle = _after({
		el: elAfter
		, selNew: "a"
		, sID   : "passbox_guide_toggle_" + sBoxID
		, sCSS  : "toggle_guide_link"
		, sText : "Toggle Guide"
		, aAttr : [{ name: "href", val: "#"}]
	})

	elBoxToggle.addEventListener('click', toggleBoxHandler, false);
	
	/**
	 * Toggles the passenger box to show/hide
	 * @return {boolean} false
	 */
	function toggleBoxHandler() {
		var sClasses = box.className
			, index = sClasses.indexOf("show")
		;
		if (index != -1) {
		    sClasses = sClasses.substr(0,index-1);
		} else {
			sClasses = box.className + " show";
		}
		box.className = sClasses;
		return false;
	}

	return elBoxToggle;
}

/**
 * Toggle input type to password/text
 * @param  	{DOMElement} 	elField 	the DOM element of input
 * @return 	{DOMElement}         		the DOM element of input
 */
Passenger.prototype.inputTypeToggle = function(elField) {
	if (!elField) {
		return console.log("Error: field element required.");
	}
	var sBoxID = this.sBoxID;
	var elToggleLink = _after({
		el: elField
		, selNew: "a"
		, sID   : "passbox_type_toggle_" + sBoxID
		, sText : "Toggle Password"
		, sCSS  : "toggle_input_link"
		, aAttr : [{ name: 'href', val: '#'}]
	});

	elToggleLink.addEventListener('click', toggleHandler, false);

	/**
	 * Toggle event handler
	 * @private
	 * @inner
	 * @return {DOMElement} the input field DOM element 
	 */
	function toggleHandler() {
		var sType = elField.getAttribute('type')
			, sTypeToggled = (sType === 'password') ? 'text' : 'password'
		;
		elField.setAttribute("type", sTypeToggled); // toggle field type to show/hide password
		return elField;
	}

	return elToggleLink;
}

Passenger.prototype.bAllPassed = function(sBoxID,bPassAll) {
	// console.log(_instance);
	// console.log(sBoxID,bPassAll);
}

/**
 * Set up all passbox events
 * @param  	{DOMElement} 	elField 	the DOM element of the input field
 * @param  	{DOMElement} 	box     	the DOM element of the passbox instance for field
 * @return 	{DOMElement}         		the DOM element of the input field
 */
Passenger.prototype.setupBoxEvents = function(elField,box) {
	var keyHandler = 'keyup'
		, _self = this
	;

	// on input focus
	elField.addEventListener('focus', function(e){
		// if not already there, append contracts to element to carry it to the userEntry check
		if (!this.contracts) {
			this.contracts = _self.contracts;
		}
		
		if (box.className) {
			box.className = box.className + ' show';
		} else {
			box.className = 'show';
		}
		return this.addEventListener(keyHandler, _self.userEntry, false);
	}, false);

	// on input blur
	elField.addEventListener('blur', function(e){
		this.removeEventListener(keyHandler, _self.userEntry, false);
	}, false);

	return elField;
}

/**
 * Examine the user input
 * @param  {event} 	e 	the key event 
 * @return {void}     	nothing 
 */
Passenger.prototype.userEntry = function(e) {
	var i = 0
		, sBoxID = this.id
		, sRxRule
		, aContracts = this.contracts
		, nContracts = aContracts.length
		, rxContractRule
		, sContractName
		, bPass
		, bAllPassed = true
		, sRulePrefix = sBoxID + '-rule-'
		, elRuleLI
		, val = e.target.value
	;

	for (; i < nContracts; i++) {
	 	sRxRule        = aContracts[i].rule;
	 	rxContractRule = new RegExp(sRxRule);
	 	sContractName  = aContracts[i].name;
	 	bPass          = rxContractRule.test(val);
	 	elRuleLI       = document.getElementById(sRulePrefix + sContractName);

	 	if (bPass) {
	 		elRuleLI.className = 'met';
	 	} else {
	 		elRuleLI.className = '';
	 		bAllPassed = false; // single failure means the entire instance has failed the requirements
	 	}
	}

	// update top-level Passeger instance fulfilled status
	passengers[sBoxID].fulfilled = bAllPassed;
};

/**
 * Get the password element
 * @param  	{string} 		selector	the string of the password field selector
 * @return 	{DOMElement|Console Error}  the DOM element of the password
 */
Passenger.prototype.getElement = function(selector) {
	if (!selector) {
		return console.log("Error: selector is required.");
	}
	var el = document.getElementById(selector);
	return el || console.log("Error: cannot find selector.");
}

/**
 * Get list of password rule contracts
 * @return {array} array of contracts
 */
Passenger.prototype.getContracts = function() {
	var contracts = [
		  { name: "lowercase",   
		    label: "Have at least one lower case character", 
		  	rule: "[a-z]" }

		, { name: "uppercase",   
		    label: "Have at least one upper case character", 
			rule: "[A-Z]" }

		, { name: "number",      
			label: "Have at least one number", 
			rule: "[0-9]" }

		, { name: "consecutive", 
			label: "Avoid using three or more consecutive identical characters", 
			rule: "^(?!.*(.)\\1\\1)" }

		, { name: "min6",        
			label: "A minimum of 6 characters", 
			rule: "^.{6,}$" }

		, { name: "max12",       
			label: "A maximum of 12 characters", 
			rule: "^.{1,12}$" }

		, { name: "notcommon",   
			label: "Not be a common password", 
			rule: "^((?!(password|abcdefgh|asdflkjh|abcd1234)).)*$" }
	]
	return contracts;
}

/**
 * Create element after another
 * @param  		{DOMElement} 	args.el 	the DOM element to create an element after
 * @param 		{string} 		args.selNew the kind of element to be created
 * @param 		{string} 		args.sID 	the ID of the new element to be created
 * @param 		{string} 		args.sCSS 	the classes to be added to the element to be created separted by spaces
 * @param 		{string} 		args.sText 	the text of the element to be created
 * @param 		{array} 		args.aAttr 	the attributes array of objects with { name: name, val: val } pairs
 * @property 	{DOMElement} 	el 			the localized DOM element to create an element after
 * @property 	{DOMElement} 	elNew 		the new DOM element created
 * @return 		{DOMElement}    			the DOM element newly created
 */
function _after(args) {
	var el = args.el
		, selNew = args.selNew
		, elNew = document.createElement(selNew)
		, sID = args.sID
		, sCSS = args.sCSS
		, sText = args.sText
		, aAttr = args.aAttr // [{ name: name, val: val}]
		, i = 0
	;

	if (sID) {
		elNew.id = sID;
	}

	if (sText) {
		var sContent = document.createTextNode(sText);
		elNew.appendChild(sContent); //add the text node to the newly created div.
	}

	if (sCSS) {
		elNew.className = sCSS;
	}

	if (aAttr) {
		for (;i < aAttr.length; i++) {
			elNew.setAttribute(aAttr[i].name, aAttr[i].val);
		}
	}

	if (el.nextSibling) {
		el.parentNode.insertBefore(elNew, el.nextSibling);
	} else {
		el.parentNode.appendChild(elNew);
	}

	return elNew;
}

/**
 * Append child element to a parent
 * @param  {object} parent
 * @param  {string} el
 * @param  {string} elId
 * @param  {string} elClasses
 * @return {object} newly created element
 */
function _appendChild (args) {
	var el = args.el
		, selNew = args.selNew
		, elNew = document.createElement(selNew)
		, sID = args.sID
		, sCSS = args.sCSS
		, sText = args.sText
		, sStyles = args.sStyes
	;

	if (sID) {
		elNew.id = sID;
	}

	if (sText) {
		var newContent = document.createTextNode(sText);
		elNew.appendChild(newContent); //add the text node to the newly created div.
	}
	if (sCSS) {
		elNew.className = sCSS;
	}

	if (sStyles) {
		var attStyle = document.createAttribute("style");
		attStyle.value = sStyles;
		elNew.setAttributeNode(attStyle); // set style attribute
	}

	el.appendChild(elNew);
	return elNew;
}


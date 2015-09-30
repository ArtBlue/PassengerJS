[![Build Status](https://travis-ci.org/ArtBlue/PassengerJS.svg?branch=master)](https://travis-ci.org/ArtBlue/PassengerJS)

# Passenger JS #

Passenger JS is a UI/UX password helper tool that allows users to create passwords that meet the minimum requirements of a website or web application with greater ease. Instead of multiple page refreshes to indicate to the user what is still missing from the set of password requirements, multiple direct indicators provide instantaneous feedback as users type, to help them come up with passwords that meet the requirements of a website or application. Alongside the password requirement fulfillment feature, there is also a password show toggle ability to allow users to see what they've already typed in the password field.

UX research has show that there is a notable user frustration with user password creation across a wide range of online applications. This tool helps to alleviate that frustration through numerous proven UX principles.

![alt tag](http://www.aspiremedia.net/wp-content/uploads/2015/09/PassengerJS.png)

## Features ##
1. Plug-n-play installation requiring nothing but a password field to be passed in during instantiation
2. Customizable through additional class inclusions
3. Ability to add more than one instance on a page
4. Ability to pass in custom password contract rules

## Support ##
* IE9+, Chrome, Firefox, Safari

## Dependencies ##

Passenger JS has no dependencies. It does not require jQuery or any other library. It can be wrapped in a `jQuery.ready()` for instantiation, as password elements need to be present in the DOM in order for Passenger JS to work. However, this is not required. Plain vanilla JS `document.addEventListener("DOMContentLoaded", instantiationFn);` may also be used.

## How do I get set up? ##

1. clone repository or download ZIP
2. include passenger.js or passenger.min.js in your page
3. instantiate Passenger JS inside a document ready function of your choosing. Here's a sample in vanilla JS:

### HTML ###
```html
<input id="password" name="password" type="password">
<input id="password2" name="password2" type="password">
```

### JS ###
```javascript
(function() {
	var myPwd1Config = {
		field: "password" // password field ID
		, styles: 'round' // custom CSS classes to add to the box (hint: all items inside can be styled by descending into its children)
	};

	var myPwd2Config = {
		field: "password2" // password field ID
            // including contracts in the config automatically triggers custom contracts (default internal contracts are neglected)
		, contracts: [
            // the name of the password contract rule   
		{ name: "lowercase", 
            // the label that will be display for the password contract rule
		    label: "Have at least one lower case character",
            // the regular expression rule that must be met to fulfill the contract
		  	rule: "[a-z]" }

		, { name: "uppercase",   
		    label: "Have at least one upper case character", 
			rule: "[A-Z]" }

		, { name: "number",      
			label: "Have at least one number", 
			rule: "[0-9]" }
		]
	};
	document.addEventListener("DOMContentLoaded", function(event) {
		var myPassword1Checker = new Passenger(myPwd1Config);
		var myPassword2Checker = new Passenger(myPwd2Config);
	});
})();
```

### Check Password Contract Requirements ###
At any point you may check to see if your Passenger instance has the password meeting the contract requirements. This is especially helpful when the user is trying to submit a form without having met the password requirements. Here's how one would check:
```javascript
myPassword2Checker.allPassed()
```

## Usage and Attributions ##

This library was developed by Arthur Khachatryan (http://www.aspiremedia.net). It may be used freely on any website or web application provided that the attribution text is not removed from the top of the JS file utilized. For more details please review the license document.

'use strict';

var chai = require("chai");
var jsdom = require("node-jsdom");
var fs = require("fs");
var Passenger = (function() { return require('../src/passenger.js') });
var expect = chai.expect;

var oConfig = {
	hInput: '<input id="password" name="password" type="password">'
	, scripts: ["http://code.jquery.com/jquery.js"]
	, oPassJS: {
		sFldSimple: {
			field: 'password'
		}
	}
}

describe('Passenger Instantiation', function() {

	it('1. Is virtual DOM available for manipulation', function (done) {
		jsdom.env({
			html: oConfig.hInput
			, done: function(errors, window) {
				expect(window.document).to.be.an('object');
				done();
			}
		});
	});

	it('2. We can instantiate a new Passenger JS instance', function (done) {
		jsdom.env({
			html: oConfig.hInput
			, done: function(errors, window) {
			 	var password1 = new Passenger({ field: 'password' });

				expect(password1).to.exist;
				expect(password1).to.be.an('object');
				done();
		    }
		});
	});

	// @todo write test
	it('3. We get a passenger box created for contract rules', function (done) {
		jsdom.env({
			html: oConfig.hInput
			, scripts: oConfig.scripts
			, done: function(errors, window) {
			 	var password1 = new Passenger({ field: 'password' }); 
			 	var $passinput = window.$("#password");
				expect(1).to.eql(1);
				done();
		    }
		});
	});


});
'use strict';

// Environment specifics
var root = this;
var oRoot = new Object();
var isBrowser = false;
var isNode = false;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = oRoot;
    root.oRoot = oRoot;
    isNode = true;
} else {
    root.oRoot = oRoot;
    isBrowser = true;
}

if (isNode) {
    var chai = require("chai");
    var jsdom = require("node-jsdom");
    var fs = require("fs");
    var Passenger = (function() { return require('../src/passenger.js') });
}

var expect = chai.expect;

var oConfig = {
    hInput: '<input id="password" name="password" type="password">'
    , scripts: ["http://code.jquery.com/jquery.js"]
    , oPassJS: {
        oFldSimple: {
            field: 'password'
        }
        , oFldFull: {
            field: "password" // password field ID
            , contracts: [
                { name: "lowercase",   
                    label: "Have at least one lower case character", 
                    rule: "[a-z]" }

                , { name: "uppercase",   
                    label: "Have at least one upper case character", 
                    rule: "[A-Z]" }

                , { name: "number",      
                    label: "Have at least one number", 
                    rule: "[0-9]" }
            ]
        }
    }
    , aRules: [
        { name: 'password-rule-lowercase', key: 'a' }
        , { name: 'password-rule-uppercase', key: 'B' }
        , { name: 'password-rule-number', key: 5 }
        , { name: 'password-rule-consecutive', key: 'ppppp' }
        , { name: 'password-rule-min6', key: '1a3b5c' }
        , { name: 'password-rule-max12', key: '123456789' }
        , { name: 'password-rule-notcommon', key: 'password' }
    ]
}

// tests to be run only in Node
if (isNode) {
    describe('Passenger Instantiation (Node)', function() {
        it.skip('1. Is virtual DOM available for manipulation', function (done) {
            jsdom.env({
                html: oConfig.hInput
                , done: function(errors, window) {
                    expect(window.document).to.be.an('object');
                    done();
                }
            });
        });

        it.skip('2. We can instantiate a new Passenger JS instance', function (done) {
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
    });
}

// tests to be run only in browsers
if (isBrowser) {

    describe('Passenger Instantiation (Browser)', function() {

        beforeEach(function() {
            setupEls();
        });

        afterEach(function() {
            teardownEls();
        });

        it('1. We can instantiate a new Passenger JS instance', function (done) {
            var password1 = new Passenger({ field: 'password' });

            expect(password1).to.exist;
            expect(password1).to.be.an('object');
            expect(password1).to.be.an.instanceof(Passenger);
            done();
        });

        it('2. We get a passenger box created for contract rules', function (done) {
            var password1 = new Passenger({ field: 'password' })
                , $input = $('#password')
                , $box = $('.passbox')
            ;

            expect($box).to.exist;
            done();
        });

        it('3. We get an input type toggle link created for instance', function (done) {
            var password1 = new Passenger({ field: 'password' })
                , $input = $('#password')
                , $toggleInput = $('.toggle_input_link')
            ;

            expect($toggleInput).to.exist;
            done();
        });

        it('4. We get a guide toggle link created for instance', function (done) {
            var password1 = new Passenger({ field: 'password' })
                , $input = $('#password')
                , $toggleGuide = $('.toggle_guide_link')
            ;

            expect($toggleGuide).to.exist;
            done();
        });

        it('5. Our passenger box should contain the default number of contract rules', function (done) {
            var password1 = new Passenger({ field: 'password' })
                , $input = $('#password')
                , $box = $('.passbox')
                , $rules = $box.find('li')
            ;

            expect($rules.length).to.eql(7);
            done();
        });

        it('6. When custom rules are passed in our passenger box should contain the correct number of custom contract rules', function (done) {

            var password1 = new Passenger(oConfig.oPassJS.oFldFull)
                , $input = $('#password')
                , $box = $('.passbox')
                , $rules = $box.find('li')
            ;

            expect($rules.length).to.eql(3);
            done();
        });

    }); // describe

    describe('Passenger Interactions (Browser)', function() {

        beforeEach(function() {
            setupEls();
        });

        afterEach(function() {
            teardownEls();
        });

        it('1. Toggle password should toggle input type from/to password/text', function (done) {

            var password1 = new Passenger(oConfig.oPassJS.oFldSimple)
                , $input = $('#password')
                , $toggleInput = $('.toggle_input_link')[0]
                , sType = $input.attr('type')
            ;
            
            // toggle to text
            $toggleInput.click();
            expect($input.attr('type')).to.equal('text');

            // toggle back to password
            $toggleInput.click();
            expect($input.attr('type')).to.equal('password');

            done();
        });

        it.skip('2. Focus on password input should show the passbox with rules', function (done) {

            var password1 = new Passenger(oConfig.oPassJS.oFldSimple)
                , $input = $('#password')
                , $passbox = $('#passbox_password')
            ;
            
            $input.focus(); 

            var bPassboxShown = $passbox.hasClass('show');
            expect(bPassboxShown).to.be.true;

            done();
        });

        it.skip('3. Inserting each rule characters passes the rule contract', function (done) {

            var password1 = new Passenger(oConfig.oPassJS.oFldSimple)
                , $input = $('#password')
                , $passbox = $('#passbox_password')
                , i = 0
                , aRules = oConfig.aRules
                , nRulesLen = aRules.length
                , $rule
                , bRulePassed
            ;
            
            $input.focus();

            $input.val('a');

            //$input.keyup();
            
            for (; i < nRulesLen; i++) {
                // var e = $.Event("keyup");
                // e.which = 65; // 'a' key
                // $input.trigger(e);

                // $rule = $('#' + aRules[i].name);
                // bRulePassed = $rule.hasClass('met');

                // //console.log($input.val() );
                // console.log('val: ' + $input.val() , bRulePassed);
                // console.log();
            }

            
            $input.on('keyup', function(e) {
                console.log(e);

                //var bRulePassed = $rule.hasClass('met');
                console.log( e.target.value );
                //console.log(bRulePassed);


                $rule = $('#' + aRules[1].name);

                //return $input;

                // var bPassboxShown = $passbox.hasClass('show');
                var bRulePassed = $rule.hasClass('met');
                console.log(bRulePassed);
                expect(bRulePassed).to.be.true;

                setTimeout(function(){
                    

                    
                    done();
                }, 50);


                //done();

            });

            

            var e = jQuery.Event("keyup");
            e.which = 65; // 'a' key
            $input.trigger(e);

            
        });

    }); // describe 

} // close browser tests

/**
 * Global Functions
 */
function setupEls () {
    $('body').append(oConfig.hInput);
}

function teardownEls () {
    $('#password').remove();
    $('.toggle_input_link').remove();
    $('.toggle_guide_link').remove();
    $('.passbox').remove();
}

function evtCallback (e) {
    console.log(e.type, e);
    var text = e.type;
    var code = e.which ? e.which : e.keyCode;
    if(13 === code){
        text += ': ENTER';
    } else {
        text += ': keycode '+code;
    }
    return text;
}

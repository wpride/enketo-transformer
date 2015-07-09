/* global describe, it*/
"use strict";

var chai = require( "chai" );
var expect = chai.expect;
var language = require( "../src/language" );

describe( 'language', function() {

    describe( 'parser', function() {
        var test;

        test = function( t ) {
            var input = t[ 0 ];
            var expected = t[ 1 ];
            it( 'parses "' + input + '" correctly', function() {
                expect( language.parse( input ) ).to.deep.equal( expected );
            } );
        };

        [
            // non-recommended ways, some half-hearted attempt to determine at least dir correctly
            [ 'Arabic', {
                tag: 'ar',
                desc: 'Arabic',
                dir: 'rtl'
            } ],
            [ 'arabic', {
                tag: 'ar',
                desc: 'arabic',
                dir: 'rtl'
            } ],
            [ 'العربية', {
                tag: 'العربية',
                desc: 'العربية',
                dir: 'rtl'
            } ],
            [ 'English', {
                tag: 'en',
                desc: 'English',
                dir: 'ltr'
            } ],
            // better way, which works well in Enketo (not in ODK Collect), description is automatically set to English description
            [ 'ar', {
                tag: 'ar',
                desc: 'Arabic',
                dir: 'rtl'
            } ],
            [ 'nl', {
                tag: 'nl',
                desc: 'Dutch',
                dir: 'ltr'
            } ],
            // the recommended way
            [ 'ar__ArabicDialect', {
                tag: 'ar',
                desc: 'ArabicDialect',
                dir: 'rtl'
            } ],
            [ 'ar__Arabic_Dialect', {
                tag: 'ar',
                desc: 'Arabic Dialect',
                dir: 'rtl'
            } ],
            [ 'nl__Nederlands', {
                tag: 'nl',
                desc: 'Nederlands',
                dir: 'ltr'
            } ],
            // unmatchable tag
            [ '0a', {
                tag: '0a',
                desc: '0a',
                dir: 'ltr'
            } ],
            // unmatchable description
            [ 'nonexisting', {
                tag: 'nonexisting',
                desc: 'nonexisting',
                dir: 'ltr'
            } ],
            // unmatchable tag and unmatchable description
            [ '0a__nonexisting', {
                tag: '0a',
                desc: 'nonexisting',
                dir: 'ltr'
            } ],
        ].forEach( test );

    } );

} );

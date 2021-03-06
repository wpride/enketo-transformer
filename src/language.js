"use strict";

var tags = require( 'language-tags' );
var stringDirection = require( 'string-direction' );
var debug = require( 'debug' )( 'transformer-languages' );

/**
 * Parses a language string into a language object. Guesses missing properties.
 *
 * @see    http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry
 * @param  {string} lang language strings as included in the XForm
 * @return {{desc: string, tag: string, dir: string, src: string}}      language object
 */
function parse( lang, sample ) {
    var ianaLang;
    var language = {
        desc: lang.trim(),
        tag: lang.trim(),
        dir: _getDirectionality( sample ),
        src: lang
    };
    var parts = lang.match( /^([^(]+)\((.*)\)\s*$/ );

    if ( parts && parts.length > 2 ) {
        language.desc = parts[ 1 ].trim();
        language.tag = parts[ 2 ].trim();
    } else {
        // First check whether lang is a known IANA subtag like 'en' or 'en-GB'
        ianaLang = _getLangWithTag( lang.split( '-' )[ 0 ] );
        if ( ianaLang ) {
            language.desc = ianaLang.descriptions()[ 0 ];
        } else {
            // Check whether IANA language can be found with description
            ianaLang = _getLangWithDesc( language.desc );
            if ( ianaLang ) {
                language.tag = ianaLang.data.subtag;
            }
        }
    }

    return language;
}

/**
 * Performs IANA search to find language object with provided subtag
 * 
 * @param  {string} desc language description
 * @return {<*>}         the first language object result that was found
 */
function _getLangWithDesc( desc ) {
    var results = ( desc ) ? tags.search( desc ).filter( _languagesOnly ) : [];
    var exactMatch = results.filter( function( obj ) {
        return obj.data.record.Description.some( function( description ) {
            return description.toLowerCase() === desc.toLowerCase();
        } );
    } )[ 0 ];

    return exactMatch || results[ 0 ] || '';
}

/**
 * Performs IANA search to find language object with provided subtag
 * 
 * @param  {string} tag  subtag
 * @return {<*>}         the first language object result that was found
 */
function _getLangWithTag( tag ) {
    return ( tag ) ? tags.subtags( tag ).filter( _languagesOnly )[ 0 ] : '';
}

/**
 * filters objects with type "language" from a list of objects
 * 
 * @param  {*} obj language object returned by 'language-tags' library
 * @return {boolean}     whether filter evaluated to true
 */
function _languagesOnly( obj ) {
    return obj.data && obj.data.type === 'language';
}

/**
 * Obtains the directionality of a tag or language description
 * 
 * @param  {string} tag language tag or language description
 * @return {string}     either 'rtl' or the default 'ltr'
 */
function _getDirectionality( sample ) {
    if ( stringDirection.getDirection( sample ) !== 'ltr' ) {
        return 'rtl';
    }
    return 'ltr';
}

module.exports = {
    parse: parse
};

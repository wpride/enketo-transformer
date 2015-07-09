"use strict";

var tags = require( 'language-tags' );
var rtlLangs = require( './right-to-left' );
var debug = require( 'debug' )( 'transformer-languages' );

/**
 * Parses a language string into a language object. Guesses missing properties.
 * 
 * @param  {string} lang language strings as included in the XForm
 * @return {{desc: string, tag: string, dir: string, src: string}}      language object
 */
function parse( lang ) {
    var ianaLang;
    var language = {};
    var parts = lang.split( '__' );

    if ( parts.length > 1 ) {
        language.desc = parts[ 1 ].replace( '_', ' ' );
        language.tag = parts[ 0 ];
    } else if ( lang.length > 3 ) {
        language.desc = lang.replace( '_', ' ' );
        ianaLang = _getLangWithDesc( language.desc );
        language.tag = ianaLang ? ianaLang.data.subtag : lang;
    } else {
        language.tag = lang;
        ianaLang = _getLangWithTag( language.tag );
        language.desc = ianaLang ? ianaLang.descriptions()[ 0 ] : lang.replace( '_', ' ' );
    }

    language.dir = _getDirectionality( language.tag );
    language.src = lang;

    return language;
}

/**
 * Performs IANA search to find language object with provided subtag
 * 
 * @param  {string} desc language description
 * @return {<*>}         the first language object result that was found
 */
function _getLangWithDesc( desc ) {
    return tags.search( desc ).filter( _languagesOnly )[ 0 ];
}

/**
 * Performs IANA search to find language object with provided subtag
 * 
 * @param  {string} tag  subtag
 * @return {<*>}         the first language object result that was found
 */
function _getLangWithTag( tag ) {
    return tags.subtags( tag ).filter( _languagesOnly )[ 0 ];
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
function _getDirectionality( tag ) {
    if ( rtlLangs.some( function( lang ) {
            return ( tag.length > 3 ) ? lang.toLowerCase() === tag.toLowerCase() : new RegExp( '^' + tag ).test( lang );
        } ) ) {
        return 'rtl';
    }
    return 'ltr';
}

module.exports = {
    parse: parse
};

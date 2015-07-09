"use strict";

var tags = require( 'language-tags' );
var rtlLangs = require( './right-to-left' );
var debug = require( 'debug' )( 'transformer-languages' );

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

    return language;
}

function _getLangWithDesc( desc ) {
    return tags.search( desc ).filter( _languagesOnly )[ 0 ];
}

function _getLangWithTag( tag ) {
    return tags.subtags( tag ).filter( _languagesOnly )[ 0 ];
}

function _languagesOnly( obj ) {
    return obj.data && obj.data.type === 'language';
}

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

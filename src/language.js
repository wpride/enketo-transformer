"use strict";

var tags = require( 'language-tags' );
var rtlLangs = require( './right-to-left' );
var debug = require( 'debug' )( 'transformer-languages' );

function parse( lang ) {
    var language = {};
    var parts = lang.split( '__' );

    if ( parts.length > 1 ) {
        language.desc = parts[ 1 ];
        language.tag = parts[ 0 ];
    } else {
        language.desc = parts[ 0 ];
        lang = tags.search( parts[ 0 ] ).filter( function( l ) {
            //debug( 'checking l', l );
            return l.data.type === 'language' && l.data.subtag;
        } )[ 0 ];
        debug( 'lang found', lang );
        language.tag = lang ? lang.data.subtag : parts[ 0 ];
    }

    language.dir = _getDirectionality( language.tag );

    return language;
}

function _getDirectionality( tag ) {
    if ( rtlLangs.some( function( lang ) {
            return ( tag.length > 3 ) ? lang.toLowerCase() === tag.toLowerCase() : new RegExp( '$' + lang ).test( tag );
        } ) ) {
        return 'rtl';
    }
    return 'ltr';
}

module.exports = {
    parse: parse
};

/**
 * TODO
 * amchavan, 06-Dec-2018
 */

/** Utility functions for JWTs */
const jwtHelper = {

    decodeToken: function( token ) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        var decodedToken = JSON.parse( window.atob( base64 ));
        return decodedToken;
    },

    getTokenExpirationDate: function( token ) {
        var decoded = this.decodeToken( token );
        var d = new Date( 0 ); // The 0 here is the key, which sets the date to the epoch
        d.setUTCSeconds( decoded.exp );
        return d;
    },

    isTokenExpired: function( token, offsetSeconds ) {
        const date = this.getTokenExpirationDate( token );
        if (date === null) {
            return false;
        }
        offsetSeconds = offsetSeconds || 0;
        return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
    },

    isTokenValid: function( token ) {
        try {
            const decodedToken = this.decodeToken( token )
            return true
        }
        catch {
            return false
        }
    }
};
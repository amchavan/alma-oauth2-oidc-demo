/**
 * TODO
 * 
 * amchavan, 12-Apr-2017 
 */

const accessTokenKey = 'session-storage-access-token-key'

/** Utility functions for JWTs */
const jwtHelper = {

    decodeToken: function( token ) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        var token = JSON.parse( window.atob( base64 ));
        return token;
    },

    getTokenExpirationDate: function( token ) {
        var decoded = this.decodeToken( token );
        console.log( ">>> ", JSON.stringify( decoded ))
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
    }
};

function authenticate( authServerURL, clientId ) {
    var accessToken = sessionStorage.getItem( accessTokenKey );
    if( accessToken !== null ) {
        console.log( ">>> accessToken: ", accessToken, (accessToken != null) );
    } 

    if( (accessToken != null) && 
        (accessToken != undefined) && 
        (! jwtHelper.isTokenExpired( accessToken ))) {
        return accessToken;
    }

    // Need to authenticate with the Auth server: compute
    // its URL and redirect there
    var authorizeUrl =
        authServerURL + '/oidc/authorize?' +
        'response_type=id_token%20token&' +
        'client_id=' + clientId + '&' +
        'scope=openid%20profile%20profile_full&' +
        'redirect_uri=' + window.location.href
    window.location.replace( authorizeUrl );
}

function extractAccessToken() {
    var fragment = location.hash.replace( '#', '' );
    var accessToken = null;
    if( fragment !== "" ) {
        var params = fragment.split( '&' );
        for( var i = 0; i < params.length; i++ ) {
            if( params[i].indexOf( 'id_token=' ) === 0) {
                accessToken = params[i].split("=")[1];
                break;
            }
        }
    }
    return accessToken;
}

/* 
 * Obtain a valid access token, either from the session storage 
 * or by redirecting to the UAA server.
 * Handles redirection here from the UAA server as well.
 */
function obtainAccessToken( authServerUrl, clientId ) {

    // TEST: force login on page reload
    // sessionStorage.removeItem( accessTokenKey );

    var accessToken = extractAccessToken();
    if( accessToken != null ) {
        sessionStorage.setItem( accessTokenKey, accessToken );
    }
    else {
        accessToken = authenticate( authServerUrl, clientId );
    }
    return accessToken;
};

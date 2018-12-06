/**
 * TODO
 * amchavan, 12-Apr-2017 
 */

const accessTokenKey = 'session-storage-access-token-key'

function extractAccessTokenFromURL() {
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

function getAccessTokenFromStorage() {
    return sessionStorage.getItem( accessTokenKey );
}

function removeAccessTokenFromStorage() {
    sessionStorage.removeItem( accessTokenKey );
}

/* 
 * Obtain a valid access token from the URL, 
 * from the session storage, or by redirecting to the
 * authentication server.
 */
function obtainAccessToken( authServerUrl, clientId ) {

    var accessToken = extractAccessTokenFromURL();
    if( accessToken != null ) {
        sessionStorage.setItem( accessTokenKey, accessToken );
        console.log( ">>> URL accessToken:", accessToken );
        return accessToken
    }

    var accessToken = sessionStorage.getItem( accessTokenKey );
    if( (accessToken != null) && 
        (accessToken != undefined) && 
        (! jwtHelper.isTokenExpired( accessToken ))) {
            console.log( ">>> stored accessToken:", accessToken );
            return accessToken;
    }

   accessToken = authenticate( authServerUrl, clientId );
   return accessToken;
};

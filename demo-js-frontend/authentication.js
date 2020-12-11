/**
 * TODO
 * amchavan, 12-Apr-2017 
 */

const accessTokenKey = 'access-token-key'

function extractUrlParameter(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
       return decodeURIComponent(name[1]);
 }

function extractAuthCodeParamsFromURL() {
    var authCode     = extractUrlParameter( 'code' )
    var codeVerifier = extractUrlParameter( 'code_verifier' )
    return { authCode: authCode, codeVerifier: codeVerifier }
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

    var accessToken;
    var authCodeParams = extractAuthCodeParamsFromURL( authServerUrl, clientId )

    if( authCodeParams.authCode != null ) {
         return authCodeGrantStep2( authServerUrl, clientId, authCodeParams ) 
    }

    accessToken = sessionStorage.getItem( accessTokenKey )
    if( accessToken && jwtHelper.isTokenValid( accessToken ) && (! jwtHelper.isTokenExpired( accessToken ))) {
        console.log( ">>> access token (stored):", accessToken )
        return new Promise( function(resolve, reject) { 
            // reject remains unused
            resolve( { access_token: accessToken } )
        })
    }
    
    sessionStorage.removeItem( accessTokenKey )     // just in case
    authCodeGrant1( authServerUrl, clientId )
};

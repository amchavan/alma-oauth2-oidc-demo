/**
 * Authenticate and obtain an access token
 * amchavan, 12-Apr-2017
 * amchavan, 14-Dec-2020
 */

const accessTokenKey = 'access-token-key'

function extractUrlParameter(parameterName){
    const parameterPattern = '[?&]' + encodeURIComponent( parameterName ) + '=([^&]*)';
    const parameterRegExp = new RegExp( parameterPattern );
    const parameter = parameterRegExp.exec( location.search );
    if( parameter ) {
        return decodeURIComponent(parameter[1]);
    }
    return undefined;
 }

function extractAuthCodeParamsFromURL() {
    const authCode = extractUrlParameter('code');
    const codeVerifier = extractUrlParameter('code_verifier');
    return { authCode: authCode, codeVerifier: codeVerifier }
}

function removeAccessTokenFromStorage() {
    sessionStorage.removeItem( accessTokenKey );
}

/**
 * Obtain a valid access token from the Identity Provider URL
 * or from the session storage. If neither are possible,
 * redirect to the IP
 *
 * @return A promise with the token
 */
function obtainAccessToken( authServerUrl, clientId ) {

    const authCodeParams = extractAuthCodeParamsFromURL(authServerUrl, clientId);
    if( authCodeParams.authCode != null ) {
         return authCodeGrantStep2( authServerUrl, clientId, authCodeParams ) 
    }

    const accessToken = sessionStorage.getItem( accessTokenKey )
    if( accessToken && isTokenValid( accessToken ) && (! isTokenExpired( accessToken ))) {
        console.log( ">>> access token (stored):", accessToken )
        return new Promise( function(resolve, reject) { 
            // reject callback is unused here
            resolve( { access_token: accessToken } )
        })
    }
    
    sessionStorage.removeItem( accessTokenKey )     // just in case
    authCodeGrant1( authServerUrl, clientId )
}

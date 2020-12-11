/**
 * TODO
 * amchavan, 06-Dec-2018 
 */

function authCodeGrant1( authServerURL, clientId ) {
    var loginURl =
        authServerURL + 'auth/realms/ALMA/protocol/openid-connect/auth?' + 
            'response_type=code&' +
            'client_id=' + clientId + '&' +
            'scope=openid+profile&' +
            'redirect_uri=' + window.location.href;
        
    window.location.replace( loginURl );
}

function authCodeGrantStep2( authServerURL, clientId, authCodeParams ) {
    const url = authServerURL + 'auth/realms/ALMA/protocol/openid-connect/token'
    
    // var headers = [ 'Content-Type: application/x-www-form-urlencoded' ]
    var formData = {
        grant_type: 'authorization_code',
        client_id: clientId,
        redirect_uri: redirectURI(),
        code: authCodeParams.authCode,
        code_verifier: authCodeParams.codeVerifier
    }

    return httpService.post( url, null, formData )
}

function redirectURI() {
    return window.location.href.substr( 0, window.location.href.indexOf( '?' ))
}

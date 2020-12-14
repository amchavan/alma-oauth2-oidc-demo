/**
 * Implements some OIDC grants
 * amchavan, 06-Dec-2018
 */

const oidcUrl = 'auth/realms/ALMA/protocol/openid-connect'

/**
 * @return Our base URL (no request parameters), to be used for redirection
 */
function redirectHereURI() {
    return window.location.origin + window.location.pathname
}

/**
 * @return URL of the dead-end page, to be used for redirection
 */
function redirectToEndURI() {
    return window.location.origin + '/demo-spa-end.html';
}

/**
 * Step one of the Authorization Code OIDC grant: redirect to the Identity Provider;
 * the IP will in turn redirect back here adding some extra parameters
 */
function authCodeGrant1( authServerURL, clientId ) {
    const authUrl =
        authServerURL + oidcUrl + '/auth?' +
        'response_type=code&' +
        'client_id=' + clientId + '&' +
        'scope=openid+profile&' +
        'redirect_uri=' + encodeURIComponent( redirectHereURI() )

    window.location.replace( authUrl );
}

/**
 * Step two of the Authorization Code OIDC grant: call the Identity Provider's token
 * endpoint, including the extra parameters we got back from step one.
 *
 * @return A promise
 */
function authCodeGrantStep2( authServerURL, clientId, authCodeParams ) {

    const formData = {
        grant_type: 'authorization_code',
        client_id: clientId,
        redirect_uri: redirectHereURI(),
        code: authCodeParams.authCode,
        code_verifier: authCodeParams.codeVerifier
    };

    const tokenUrl = authServerURL + oidcUrl + '/token'
    return httpService.post( tokenUrl, null, formData )
}

/**
 * Logout protocol: remove the access token from the session storage, then
 * redirect to the Keycloak logout endpoint, which in turn redirects
 * to a dead-end page we indicate
 *
 * See https://www.keycloak.org/docs/latest/securing_apps/index.html#logout
 *
 * @return The function to be invoked when user wants to log out
 */
function logout( authServerURL ) {
    return function() {
        removeAccessTokenFromStorage();
        const logoutURL = authServerURL + oidcUrl + '/logout?' + 'redirect_uri=' + redirectToEndURI();
        window.location.replace( logoutURL );
    }
}

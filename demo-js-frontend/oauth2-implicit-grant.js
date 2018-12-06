/**
 * TODO
 * amchavan, 06-Dec-2018 
 */

function authenticate( authServerURL, clientId ) {

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

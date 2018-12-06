/**
 * Proof of concept, pure JS client for OAuth2 Implicit Grant
 * To run, navigate to localhost:8000 in the browser, will redirect to login page
 * Reload the page to see the interaction with the resource servers
 * 
 * amchavan, 12-Apr-2017 
 */

const authServerUrl = 'https://ma24088.ads.eso.org:8019/cas'
const resourceUrl = 'http://localhost:9000/oidc-resource-server/'
const resource2Url = 'http://localhost:9001/oidc-resource-server/aod-only'
const afterLogoutUrl = 'https://asa.alma.cl'
const clientId = 'demoOIDC'

function start() {

    var accessToken = getAccessTokenFromStorage();
    if( accessToken == null ) {
        return;
    }

    // Populate the "you are logged in as..." field
    var user_profile = jwtHelper.decodeToken(accessToken)
    $( "#user" ).text( user_profile["sub"] + ' (' + user_profile["givenName"] + ' ' + user_profile["lastName"] + ')' );

    $("#get-resources").click( function() {     // Retrieve resources from two servers
        var bearerToken = 'Bearer ' + accessToken;

        // First server: just get the resource and display it, report any error
        httpService.get( resourceUrl, { Authorization: bearerToken })
            .then( 
                function( data, textStatus, jqXHR ) {
                    console.log( ">>> RESOURCE:", JSON.stringify( data ));
                    $( "#resource" ).text( data.content )
                })
            .fail( 
                simpleAjaxErrorHandler( resourceUrl )
                );

        // Second server: get the resource and display it: if the 
        // response status is 401, display a conventional string
        httpService.get( resource2Url, { Authorization: bearerToken })
            .then( 
                function( data, textStatus, jqXHR ) {
                    console.log( ">>> RESOURCE2:", JSON.stringify( data ));
                    $( "#resource2" ).text( data.content )
                })
            .fail( 
                function( response, textStatus, errorThrown  ) {
                    var sResponse = JSON.stringify(response);
                    var oResponse = JSON.parse( sResponse );
                    if( oResponse.status == 401 ) {
                        $( "#resource2" ).text( "(Unauthorized)" )
                    }
                    else {
                        var msg = url + "\n" +
                                sResponse + "\n" +
                                textStatus + "\n" +
                                JSON.stringify( errorThrown );
                        console.log( ">>> ERROR:", msg.replaceAll( '\n', '; '));
                        alert( msg );
                    }
                }
                );
    });

    $("#logout").click( function() {
        // Logout protocol: remove the access token from the session storage, 
        //                  redirect to CAS' logout endpoint, which in turn
        //                  redirects to ALMA
        removeAccessTokenFromStorage();
        window.location.replace( authServerUrl + '/logout?service=' + afterLogoutUrl );
    });
}

// Startup: obtain a valid access token, go on with our business
$(document).ready( function() {
    var accessToken = obtainAccessToken( authServerUrl, clientId );
    console.log( accessToken );
    start();
});

/**
 * Proof of concept, pure JS client for OAuth2 Implicit Grant
 * To run, navigate to localhost:8000 in the browser, will redirect to login page
 * Reload the page to see the interaction with the resource servers
 * 
 * amchavan, 12-Apr-2017 
 */

const authServerUrl = 'https://ma24088.ads.eso.org:8019/cas'
const resourceUrl = 'http://localhost:9000/oidc-resource-server/'
const resource2Url = 'http://localhost:9001/oidc-resource-server/'
const clientId = 'demoOIDC'

function start( accessToken ) {
    console.log( accessToken );

    // Populate the "you are logged in as..." field
    var user_profile = jwtHelper.decodeToken(accessToken)
    $( "#user" ).text( user_profile["sub"] + ' (' + user_profile["givenName"] + ' ' + user_profile["lastName"] + ')' );

    $("#get-resources").click( function() {     // Retrieve resources from two servers
        var bearerToken = 'Bearer ' + accessToken;
        httpService.get( resourceUrl, { Authorization: bearerToken })
            .then( 
                function( data, textStatus, jqXHR ) {
                    console.log( ">>> RESOURCE:", JSON.stringify( data ));
                    $( "#resource" ).text( data.content )
                })
            .fail( 
                simpleAjaxErrorHandler( resourceUrl )
                );

        httpService.get( resource2Url, { Authorization: bearerToken })
            .then( 
                function( data, textStatus, jqXHR ) {
                    console.log( ">>> RESOURCE2:", JSON.stringify( data ));
                    $( "#resource2" ).text( data.content )
                })
            .fail( 
                simpleAjaxErrorHandler( resource2Url )
                );
    });
}

// Startup: obtain a valid access token, go on with our business
$(document).ready( function() {
    var accessToken = obtainAccessToken( authServerUrl, clientId );
    start( accessToken );
});

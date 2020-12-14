/**
 * Proof of concept, pure JS client for OAuth2 Implicit Grant
 * To run, navigate to localhost:8000 in the browser, will redirect to login page
 * Reload the page to see the interaction with the resource servers
 * 
 * amchavan, 12-Apr-2017 
 */

const authServerUrl = 'https://www.eso.org/dev-keycloak/'
const publicResourceUrl = 'http://localhost:9000/oidc-resource-server/'
const protectedResourceUrl = 'http://localhost:9001/oidc-resource-server/arp-only'
const clientId = 'oidc'

function start( accessToken ) {

    const userProfile = decodeToken(accessToken);
    const authorizationHeader = 'Bearer ' + accessToken;

    // Username and full name we get from the access token
    $( "#userID" ).text( userProfile.preferred_username );
    $( "#userFullName" ).text( userProfile.given_name + ' ' + userProfile.family_name );

    // Retrieve and display a public and a protected resource
    // The protected resource will be returned only if we have the OBOPS/ARP role
    $("#get-resources").click( retrieveResources(   publicResourceUrl,    "#publicResource",
                                                    protectedResourceUrl, "#protectedResource",
                                                    authorizationHeader ))
    // The logout button will, ha!, log us out
    $("#logout").click( logout( authServerUrl ));
}

// Startup: obtain a valid access token, then save it and go on with our business
$(document).ready( 
    function() {
        obtainAccessToken( authServerUrl, clientId )
            .then( function( data ) {               
                history.replaceState( {}, '', redirectHereURI() );  // remove code, code_verifier, etc. request...
                                                                    // ...parameters from the URL
                sessionStorage.setItem( accessTokenKey, data.access_token ) // save access token for next time
                start( data.access_token )                      // ...and go!
            })
            .catch(  
                simpleAjaxErrorHandler( authServerUrl )
            ) 
    }
)

/**
 * Proof of concept, pure JS client for OAuth2 Implicit Grant
 * To run, navigate to localhost:8000 in the browser, will redirect to login page
 * Reload the page to see the interaction with the resource servers
 * 
 * amchavan, 12-Apr-2017 
 */

const authServerUrl = 'https://www.eso.org/dev-keycloak/'
const publicResourceUrl = 'http://localhost:9000/oidc-resource-server/'
const arcaResourceUrl = 'http://localhost:9002/oidc-resource-server/protected/arca-only'
// const arcaResourceUrl = 'http://localhost:9003/oidc-resource-server/service/api/datetime'
const arpResourceUrl = 'http://localhost:9003/oidc-resource-server/service/api/secret'
const clientId = 'oidc'

function start( accessToken ) {

    const userProfile = decodeToken(accessToken);
    const authorizationHeader = 'Bearer ' + accessToken;

    // Username and full name we get from the access token
    $( "#userID" ).text( userProfile.preferred_username );
    $( "#userFullName" ).text( userProfile.given_name + ' ' + userProfile.family_name );
    $( "#userRoles" ).text( userProfile.roles )

    // Retrieve and display a public and a protected resource
    // The protected resource will be returned only if we have the OBOPS/ARP role
    $("#get-resources").click(getResources(authorizationHeader))
    // The logout button will, ha!, log us out
    $("#logout").click( logout( authServerUrl ));
}

// Return function to be invoked when clicking on the #get-resources button:
// it will several resources
function getResources( authorizationHeader ) {
    return function () {
        retrieveResource( publicResourceUrl, "#publicResource", authorizationHeader )
        retrieveResource( arcaResourceUrl,   "#arcaResource",   authorizationHeader )
        retrieveResource( arpResourceUrl,    "#arpResource",    authorizationHeader )
    }
}

// Startup: obtain a valid access token, then save it and go on with our business
$(document).ready( 
    function() {
        obtainAccessToken( authServerUrl, clientId )
            .then( function( data ) {
                // Update the URL displayed in the browser:
                // remove code, code_verifier, etc. request parameters
                history.replaceState( {}, '', redirectHereURI() );

                // save access token for next time, and go
                sessionStorage.setItem( accessTokenKey, data.access_token )
                start( data.access_token )
            })
            .catch(  
                simpleAjaxErrorHandler( authServerUrl )
            ) 
    }
)

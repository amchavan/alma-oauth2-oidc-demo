/**
 * Proof of concept, pure JS client for OIDC
 * To run, navigate to localhost:8000 in the browser, will redirect to login page
 *
 * amchavan, 12-Apr-2017 
 */

const authServerUrl = 'https://www.eso.org/dev-keycloak/'
const datetimeUrl = 'http://localhost:9000/oidc-resource-server/datetime'
const arcaResourceUrl = 'http://localhost:9002/oidc-resource-server/protected/arca-only'
const authResourceUrl = 'http://localhost:9002/oidc-resource-server/protected/authenticated'
const arpResourceUrl = 'http://localhost:9003/oidc-resource-server/service/api/secret'
const clientId = 'oidc'

function start( accessToken ) {

    const userProfile = decodeToken(accessToken);
    const authorizationHeader = 'Bearer ' + accessToken;

    // Username and full name we get from the access token
    document.getElementById( 'userID' ).textContent = userProfile['preferred_username']
    document.getElementById( 'userFullName' ).textContent = userProfile['given_name'] + ' ' + userProfile['family_name']
    document.getElementById( 'userRoles' ).textContent = userProfile['roles']

    // Retrieve and display a public and a protected resource
    // The protected resource will be returned only if we have the OBOPS/ARP role
    document.getElementById( 'get-resources' ).onclick = getResources(authorizationHeader)
    // The logout button will, ha!, log us out
    document.getElementById( 'logout' ).onclick = logout( authServerUrl )
}

// Return function to be invoked when clicking on the #get-resources button,
// it will retrieve several resources
function getResources( authorizationHeader ) {
    return function () {
        retrieveResource( authResourceUrl, 'content', 'authResource', authorizationHeader )
        retrieveResource( arcaResourceUrl, 'content', 'arcaResource', authorizationHeader )
        retrieveResource( arpResourceUrl,  'content', 'arpResource',  authorizationHeader )
    }
}

// Startup: obtain a valid access token, then save it and go on with our business
document.addEventListener( 'DOMContentLoaded', () => {
        retrieveResource( datetimeUrl,  'datetime', 'datetime' )
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

/**
 * Proof of concept, pure JS client for OAuth2 Implicit Grant
 * To run, navigate to localhost:8000 in the browser, will redirect to login page
 * Reload the page to see the interaction with the resource servers
 * 
 * amchavan, 12-Apr-2017 
 */

const authServerUrl = 'https://www.eso.org/dev-keycloak/'
const resourceUrl = 'http://localhost:9000/oidc-resource-server/'
const resource2Url = 'http://localhost:9001/oidc-resource-server/arp-only'
const afterLogoutUrl = 'https://asa.alma.cl'
const clientId = 'oidc'

function start( accessToken ) {

    // Populate the "you are logged in as..." field
    const user_profile = jwtHelper.decodeToken(accessToken);
    $( "#userID" ).text( user_profile.preferred_username );
    $( "#userFullName" ).text( user_profile.given_name + ' ' + user_profile.family_name );

    $("#get-resources").click( function() {     // Retrieve resources from two servers
        const bearerToken = 'Bearer ' + accessToken;

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
                    const sResponse = JSON.stringify(response);
                    const oResponse = JSON.parse(sResponse);
                    if( oResponse.status === 401 ) {
                        $( "#resource2" ).text( "(Unauthorized)" )
                    }
                    else {
                        const msg = resource2Url + "\n" +
                            sResponse + "\n" +
                            textStatus + "\n" +
                            JSON.stringify(errorThrown);
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

// Startup: obtain a valid access token, then save it and go on with our business
$(document).ready( 
    function() {
        obtainAccessToken( authServerUrl, clientId )
            .then( function( data ) {               
                history.pushState( {}, '', redirectURI() );     // remove code, code_verifier, etc. request
                                                                // parameters from the URL
                sessionStorage.setItem( accessTokenKey, data.access_token ) // save access token for next time
                start( data.access_token )                      // ...and go!
            })
            .catch(  
                simpleAjaxErrorHandler( authServerUrl )
            ) 
    }
)

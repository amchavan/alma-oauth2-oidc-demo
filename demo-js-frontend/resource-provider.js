/**
 * Resource access and HTTP request error handling
 *
 * @author amchavan, 14-Dec-2020
 */

/**
 * @return The function to be invoked when user requests the resources
 */
function retrieveResources( publicUrl, publicDomElement, protectedUrl, protectedDomElement, authorizationHeader ) {
    return function() {
        retrievePublicResource( publicUrl, publicDomElement, authorizationHeader )
        retrieveProtectedResource( protectedUrl, protectedDomElement, authorizationHeader )
    }
}

function retrievePublicResource( url, domElement, authorizationHeader ) {

    httpService
        .get( url, { Authorization: authorizationHeader })
        .then(
            function( data ) {       // could be function( data, textStatus, jqXHR )
                console.log( ">>> Public resource:", JSON.stringify( data ));
                $( domElement ).text( data.content )
            })
        .fail(
            simpleAjaxErrorHandler( publicResourceUrl )
        );
}

function retrieveProtectedResource( url, domElement, authorizationHeader ) {

    // Second server: get the resource and display it: if the
    // response status is 401, display a conventional string
    httpService
        .get( url, { Authorization: authorizationHeader })
        .then(
            function( data ) {       // could be function( data, textStatus, jqXHR )
                console.log( ">>> Protected resource:", JSON.stringify( data ));
                $( domElement ).text( data.content )
            })
        .fail(
            function( response, textStatus, errorThrown  ) {
                const sResponse = JSON.stringify(response);
                const oResponse = JSON.parse(sResponse);
                if( oResponse.status === 401 || oResponse.status === 403 ) {
                    $( "#protectedResource" ).text( "(Unauthorized)" )
                }
                else {
                    const msg = protectedResourceUrl + "\n" +
                        sResponse + "\n" +
                        textStatus + "\n" +
                        JSON.stringify(errorThrown);
                    console.log( ">>> ERROR:", msg.replaceAll( '\n', '; '));
                    alert( msg );
                }
            }
        )
}

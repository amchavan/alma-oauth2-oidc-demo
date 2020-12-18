/**
 * Resource access and HTTP request error handling
 *
 * @author amchavan, 14-Dec-2020
 */

function retrieveResource( url, domElement, authorizationHeader ) {

    // Second server: get the resource and display it: if the
    // response status is 401/403, display a conventional string
    httpService
        .get( url, { Authorization: authorizationHeader })
        .then(
            function( data ) {       // could be function( data, textStatus, jqXHR )
                console.log( ">>> " + domElement + ":", JSON.stringify( data ));
                $( domElement ).text( data.content )
            })
        .fail(
            function( response, textStatus, errorThrown  ) {
                const sResponse = JSON.stringify(response);
                const oResponse = JSON.parse(sResponse);
                if( oResponse.status === 401 || oResponse.status === 403 ) {
                    $( domElement ).text( "(Unauthorized)" )
                }
                else {
                    const msg = url + "\n" +
                        sResponse + "\n" +
                        textStatus + "\n" +
                        JSON.stringify(errorThrown);
                    console.log( ">>> ERROR:", msg.replaceAll( '\n', '; '));
                    alert( msg );
                }
            }
        )
}

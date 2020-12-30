/**
 * Resource access and HTTP request error handling
 *
 * @author amchavan, 14-Dec-2020
 */


/**
 * Get the resource at the URL and display its dataField in the domElement. If
 * response status is 401/403, display a conventional message instead
 */
function retrieveResource( url, dataField, domElement, authorizationHeader ) {

    const element = document.getElementById( domElement );
    element.textContent = ''

    const retryOptions = {
        retries: 5,
        backoff: 1000,
        backoffFactor: 1.25,
        // callback: log
    }

    getWithRetry( url, { Authorization: authorizationHeader }, retryOptions )

        .then( data => {
            console.log( '>>> ' + domElement + ':', JSON.stringify( data ));
            element.textContent = data[dataField]
            })

        .catch( error => {
                console.error( 'While fetching', url, ':', JSON.stringify( error ))
                if (error.status === 401 || error.status === 403) {
                    element.textContent = '(Unauthorized)'
                }
                else {
                    let errorMessage = 'Error ' + error.status + ': ' + error.message;
                    element
                            .insertAdjacentHTML( 'afterbegin', '<strong>' + errorMessage + '</strong>' );
                }
            })
}

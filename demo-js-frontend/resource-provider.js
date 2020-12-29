/**
 * Resource access and HTTP request error handling
 *
 * @author amchavan, 14-Dec-2020
 */


/**
 * Get the resource at the URL and display it in the DOM element. If
 * response status is 401/403, display a conventional message instead
 */
function retrieveResource( url, domElement, authorizationHeader ) {

    const fetchOptions = {
        headers: {
            Authorization: authorizationHeader
        }
    }

    const retryOptions = {
        retries: 5,
        backoff: 1000,
        backoffFactor: 1.25,
        // callback: log
    }

    document.getElementById( domElement ).textContent = ''

    fetchWithRetry( url, fetchOptions, retryOptions )

        .then( data => {
            console.log( ">>> " + domElement + ":", JSON.stringify( data ));
            document.getElementById( domElement ).textContent = data.content
            })

        .catch( error => {
                console.error("While fetching", url, ":", JSON.stringify(error))
                if (error.status === 401 || error.status === 403) {
                    document.getElementById( domElement ).textContent = '(Unauthorized)'
                }
                else {
                    let errorMessage = 'Error ' + error.status + ': ' + error.message;
                    document.getElementById( domElement )
                            .insertAdjacentHTML( 'afterbegin', '<strong>' + errorMessage + '</strong>' );
                }
            })
}

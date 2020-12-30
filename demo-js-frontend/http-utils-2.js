/**
 * Inspired by https://blog.bearer.sh/add-retry-to-api-calls-javascript-node/ (which does not work)
 * @author amchavan, 22-Dec-2020
 */

/**
 * Local error class
 */
class HttpError extends Error {
    constructor( response ) {
        super( response.message ? response.message : response.status )
        this.status = response.status === undefined ? 0 : response.status
        this.message = response.message
    }
}

/** List of response status values that warrant a retry */
const RETRY_STATUS_VALUES = [
        408,    // Request Timeout
        429,    // Too Many Requests
        500,    // Internal error
        502,    // Bad Gateway
        503,    // Service Unavailable
        504,    // Gateway Timeout
    ]


/**
 * retries:       Number of retries, defaults to zero (fails after first error)
 * backoff:       How long to wait before the next retry, in milliseconds; defaults to 200
 * backoffFactor: How much the backoff increases between retries, should be 1 or greater; default is 1 (no increase)
 * callback:      A function to be called before each retry. It will be given two args: number of remaining retries
 *                (1 or greater) and backoff duration
 */
const DEFAULT_RETRY_OPTIONS = {
    retries: 0,
    backoff: 200,
    backoffFactor: 1,
    callback: undefined
}

/**
 * Use as: await timeout( 200 )
 * @return A promise that resolves after ms milliseconds
 */
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* This function and fetchWithRetry() are mutually recursive */
async function fetchWithRetryInternal(url, fetchOptions, response, retryOptions ) {

    if( response instanceof HttpError ) {
        // Recognize end of recursion
        throw response;
    }

    if( response.ok ) {
        return response.json()
    }
    else {
        let couldRetry = response.status === undefined || RETRY_STATUS_VALUES.includes( response.status )
        if( retryOptions.retries > 0 && couldRetry )  {
            if( retryOptions.callback ) {
                retryOptions.callback( retryOptions.retries, retryOptions.backoff )
            }
            await timeout( retryOptions.backoff );
            const newRetryOptions = Object.assign( {}, retryOptions )
            newRetryOptions.retries = retryOptions.retries - 1
            newRetryOptions.backoff = Math.round( retryOptions.backoff * retryOptions.backoffFactor );
            return fetchWithRetry( url, fetchOptions, newRetryOptions )
        }
        else {
            // Signal end of recursion
            throw new HttpError( response );
        }
    }
}

/**
 * Fetch some resource, retry in case of error
 *
 * @param url       URL of the resource
 * @param fetchOptions Options for fetch, see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch,
 *                     may be undefined, in which case defaults to a simple GET
 * @param retryOptions Options for retry, see DEFAULT_RETRY_OPTIONS
 *
 * @return A Promise
 */
function fetchWithRetry( url, fetchOptions, retryOptions ) {

    // Compute final set of retry options combining the defaults with what was passed in
    retryOptions = retryOptions ? retryOptions : {}
    const finalRetryOptions = Object.assign( {}, DEFAULT_RETRY_OPTIONS, retryOptions )

    return fetch( url, fetchOptions )
        .then( response => fetchWithRetryInternal( url, fetchOptions, response, finalRetryOptions ))
        .catch( reason  => fetchWithRetryInternal( url, fetchOptions, reason,   finalRetryOptions ))
}

/**
 * GET a resource with the given headers -- a trimmed down version of fetchWithRetry()
 */
function getWithRetry( url, headers, retryOptions ) {
    const fetchOptions = headers ? { headers: headers } : undefined
    return fetchWithRetry( url, fetchOptions, retryOptions )
}

/**
 * POST a resource with the given headers and form data -- a trimmed down version of fetchWithRetry()
 */
function postWithRetry( url, headers, data, retryOptions ) {
    const fetchOptions = {
        method: 'POST'
    };
    fetchOptions.headers = headers ? headers : {}

    if( data ) {
        const formBody = Object.keys( data )
                            .map( key => encodeURIComponent( key ) + '=' + encodeURIComponent( data[key] ))
                            .join( '&' );
        fetchOptions.body = JSON.stringify( formBody )
        fetchOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    return fetchWithRetry( url, fetchOptions, retryOptions )
}

function simpleAjaxErrorHandler( url ) {
    return function( response, textStatus, errorThrown  ) {

        const msg = url + "\n" +
            JSON.stringify(response) + "\n" +
            textStatus + "\n" +
            JSON.stringify(errorThrown);
        console.log( ">>> ERROR:", msg.replaceAll( '\n', '; '));
        alert( msg );
    }
}

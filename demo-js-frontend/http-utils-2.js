/**
 * @author amchavan, 22-Dec-2020
 * Adapted from https://blog.bearer.sh/add-retry-to-api-calls-javascript-node
 * (original version does not work; added proper timoeout from
 * https://stackoverflow.com/questions/33289726/combination-of-async-function-await-settimeout/33292942)
 */

/**
 * Use as: await timeout( 200 )
 * @return A promise that resolves after ms milliseconds
 */
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* This function and fetchWithRetry() are mutually recursive */
async function fetchWithRetryInternal(url, fetchOptions, response, retries, backoff, backoffFactor ) {

    if( response.ok ) {
        return response.json()
    }
    else {
        if (retries > 0) {
            console.error( "Request failed, retrying in", backoff, "msec, remaining retries", retries )
            await timeout( backoff );
            return fetchWithRetry( url, fetchOptions, retries - 1, backoff * backoffFactor, backoffFactor )
        } else {
            throw new Error('HTTP error, status = ' + response.status);
        }
    }
}

/**
 * Fetch some resource, retry in case of error
 *
 * @param url       URL of the resource
 * @param fetchOptions Options for fetch, see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch,
 *                     may be undefined, in which case defaults to a simple GET
 * @param retries:       Number of retries, defaults to zero (fails after first error)
 * @param backoff:       How long to wait before the next retry, in milliseconds; defaults to 200
 * @param backoffFactor: How much the backoff increases between retries, should be one or greater; default is 1 (no increase)
 *
 * @return A Promise
 */
function fetchWithRetry( url, fetchOptions, retries = 0, backoff = 200, backoffFactor = 1 ) {
    return fetch( url, fetchOptions )
        .then( response => fetchWithRetryInternal( url, fetchOptions, response, retries, backoff, backoffFactor ))
}

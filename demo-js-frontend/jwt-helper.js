/**
 * Utility functions for JWTs
 * amchavan, 06-Dec-2018
 */

/**
 * @param token A JWT
 * @return A JSON object
 * @throws An error if the token cannot be decoded
 */
function decodeToken( token ) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse( window.atob( base64 ));
}

/**
 * @return The token expiration date, as a Date instance
 *
 * @param token A JWT
 */
function getTokenExpirationDate( token ) {
    const decoded = this.decodeToken(token);
    const d = new Date(0); // The 0 here is the key, which sets the date to the epoch
    d.setUTCSeconds( decoded.exp );
    return d;
}

/**
 * Check if a token has expired, based on its expiration date.
 *
 * @param token A JWT
 * @param offsetSeconds If defined, the check will allow these many extra seconds
 * @return {boolean}
 */
function isTokenExpired( token, offsetSeconds ) {
    const date = this.getTokenExpirationDate( token );
    if (date === null) {
        return false;
    }
    offsetSeconds = offsetSeconds || 0;
    return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
}

/**
 * Token is considered valid if it can be decoded without errors
 *
 * @param token A JWT
 * @return true if token is valid, false otherwise
 */
function isTokenValid( token ) {
    try {
        this.decodeToken( token )
        return true
    }
    catch {
        return false
    }
}


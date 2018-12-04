/**
 * Proof of concept, pure JS client for OAuth2, implements 
 * the Authorization Code grant 
 * (which is nonsense for JavaScript clients -- 
 * use Implicit grant instead)
 * 
 * OBSOLETE -- for reference only.
 * 
 * amchavan, 29-Mar-2017 (in Tokyo!)
 */

const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MjE1OTc1ODMsInVzZXJfbmFtZSI6InVzZXIiLCJhdXRob3JpdGllcyI6WyJST0xFX1VTRVIiLCJST0xFX0FDVFVBVE9SIl0sImp0aSI6IjM1NTZlNWM1LTlhOTgtNDQ0OS04ZjlhLTkzYTU1MzY3ODgxYSIsImNsaWVudF9pZCI6ImFjbWUiLCJzY29wZSI6WyJvcGVuaWQiXX0.RpP4sYSjfRm4sMmVvTWTNctSpeCF0yiBMaKZn5gPMBljlmSaiV-XfGuIwN8Z12ZWAFyxf3JkTCqqoftIZr3mtHMnbVQg-DfpnC2Y1VFoinIjHjzzdRfDj6cODDzLdgBGSHDERzDvw22I--RUS1AuyWXuskuOYeeS3Y5QsDlHggTty1Jvp1DtBGyU2SUlvkcqbCHGa73vd9Y_YRQUr7NA31971HCYWyzg7EADPkpMWM1duvFX_MpGybYxgBxWj6iwEx_z-Ma8cOXHbepHqRfTC-Yta6q-rpJ4E-mvlETGHiog6JZJqbbO2LN_iGc0X3MxTb2EAu_2-fLffrkU900J4geyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MjE1OTc1ODMsInVzZXJfbmFtZSI6InVzZXIiLCJhdXRob3JpdGllcyI6WyJST0xFX1VTRVIiLCJST0xFX0FDVFVBVE9SIl0sImp0aSI6IjM1NTZlNWM1LTlhOTgtNDQ0OS04ZjlhLTkzYTU1MzY3ODgxYSIsImNsaWVudF9pZCI6ImFjbWUiLCJzY29wZSI6WyJvcGVuaWQiXX0.RpP4sYSjfRm4sMmVvTWTNctSpeCF0yiBMaKZn5gPMBljlmSaiV-XfGuIwN8Z12ZWAFyxf3JkTCqqoftIZr3mtHMnbVQg-DfpnC2Y1VFoinIjHjzzdRfDj6cODDzLdgBGSHDERzDvw22I--RUS1AuyWXuskuOYeeS3Y5QsDlHggTty1Jvp1DtBGyU2SUlvkcqbCHGa73vd9Y_YRQUr7NA31971HCYWyzg7EADPkpMWM1duvFX_MpGybYxgBxWj6iwEx_z-Ma8cOXHbepHqRfTC-Yta6q-rpJ4E-mvlETGHiog6JZJqbbO2LN_iGc0X3MxTb2EAu_2-fLffrkU900J4g"
const authUrl = 'http://localhost:9999/uaa/oauth/authorize'
const userUrl = 'http://localhost:9999/uaa/user'
const tokenUrl = 'http://localhost:9999/uaa/oauth/token'
const resourceUrl = 'http://localhost:9000/resource/'
const resource2Url = 'http://localhost:9001/resource2/'
const client = 'acme'
const clientSecret = 'acmesecret'
const accessTokenKey = 'session-storage-access-token-key'
const refreshTokenKey = 'session-storage-refresh-token-key'

var accessToken;

/** Utility functions for JWTs */
const jwtHelper = {

    decodeToken: function( token ) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        var token = JSON.parse( window.atob( base64 ));
        return token;
    },

    getTokenExpirationDate: function( token ) {
        var decoded = this.decodeToken( token );
        console.log( ">>> ", JSON.stringify( decoded ))
        var d = new Date( 0 ); // The 0 here is the key, which sets the date to the epoch
        d.setUTCSeconds( decoded.exp );
        return d;
    },

    isTokenExpired: function( token, offsetSeconds ) {
        const date = this.getTokenExpirationDate( token );
        if (date === null) {
            return false;
        }
        offsetSeconds = offsetSeconds || 0;
        return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
    }
};

function isLoggedIn() {
    const accessToken = sessionStorage.getItem( accessTokenKey );
    // const refreshToken = sessionStorage.getItem( rtKey );
    // return accessToken !== null && refreshToken !== null && !jwtHelper.isTokenExpired(accessToken);
    return accessToken !== null && !jwtHelper.isTokenExpired( accessToken );
};

const httpService = {

    request: function( url, method, headers, data ) {
        
        var ajaxOptions = {
            url : url,
        }

        ajaxOptions.method = method
        
        if( headers !== undefined ) {
            ajaxOptions.headers = headers;
        }

        if( data !== undefined ) {
            ajaxOptions.data = data
        }
        
        return $.ajax( ajaxOptions );
    },

    post: function( url, headers, data ) {
        
        var ajaxOptions = {
            url: url,
            type: 'POST',
            crossDomain: true,
            dataType: "json",
        }

        if( data ) {
            ajaxOptions.data = data
        }
        
        if( headers ) {
            ajaxOptions.headers = headers;
        }
        
        return $.ajax( ajaxOptions );
    },

    get: function( url, headers ) {
        
        var ajaxOptions = {
            url: url,
            type: 'GET',
            // crossDomain: true,
            dataType: "json",
        }
        
        if( headers ) {
            ajaxOptions.headers = headers;
        }
        
        return $.ajax( ajaxOptions );
    },
};


/* Javascript doesn't have a native replaceAll() string method
 * This I found on Stack Overflow at
 * http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
 */
if (typeof String.prototype.replaceAll != 'function') {
    String.prototype.replaceAll = function (find, replace) {
        var str = this;
        return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
    }
};


// If all else fails...
function simpleAjaxErrorHandler( url ) {
    return function( response, textStatus, errorThrown  ) {

        var msg = url + "\n" +
                  JSON.stringify(response) + "\n" +
                  textStatus + "\n" +
                  JSON.stringify( errorThrown );
        console.log( ">>> ERROR:", msg.replaceAll( '\n', '; '));
        alert( msg );
    }
};

// Return the value of the URL parameter called name, or falsy
function urlParam( name ) {
    var results = 
        new RegExp('[\?&]' + name + '=([^&#]*)').exec( window.location.href );
    if( results == null ) {
        return 0;
    }
    return results[1];
}

// Create basic HTTP auth header from input
function make_base_auth( user, password ) {
    var tok = user + ':' + password;
    var hash = btoa(tok);
    return 'Basic ' + hash;
}

var currentURL = window.location.href;
console.log( ">>> starting:", currentURL )

var authCode = urlParam( 'code' )
var accessToken = sessionStorage.getItem( accessTokenKey )
if( accessToken != null && ! jwtHelper.isTokenExpired( accessToken )) {
    var bearerToken = 'Bearer ' + accessToken
    httpService.get( resourceUrl, { Authorization: bearerToken })
        .then( 
            function( data, textStatus, jqXHR ) {
                console.log( ">>> RESOURCE:", JSON.stringify( data ));
                $( "#resource" ).text( data.content )
            })
        .fail( 
            simpleAjaxErrorHandler( resourceUrl )
            );

    httpService.get( resource2Url, { Authorization: bearerToken })
        .then( 
            function( data, textStatus, jqXHR ) {
                console.log( ">>> RESOURCE2:", JSON.stringify( data ));
                $( "#resource2" ).text( data.content )
            })
        .fail( 
            simpleAjaxErrorHandler( resource2Url )
            );
}
else {
    if( ! authCode ) {
        var url = authUrl + '?response_type=code&client_id=acme&redirect_uri=' + currentURL;
        console.log( ">>> redirecting to:", url ); 
        window.location.replace( url );
    }
    else {
        console.log( ">>> authCode:", authCode );

        var i = currentURL.indexOf( '?' )  // should always be positive
        var baseURL = currentURL.substring( 0, i )
        console.log( ">>> baseURL:", baseURL );


        var basicHttpAuth = make_base_auth( client, clientSecret );
        // console.log( ">>> basicHttpAuth:", basicHttpAuth );
        const headers = { "Authorization": basicHttpAuth }
        const data = {
                        grant_type: 'authorization_code',
                        client_id: client,
                        redirect_uri: baseURL,
                        code: authCode,
                    }
        httpService
            .post( tokenUrl, headers, data )
            .then( 
                function( data, textStatus, jqXHR ) {
                    console.log( ">>> SUCCESS:", JSON.stringify( data ));
                    var tmp = data['access_token']
                    sessionStorage.setItem( accessTokenKey, tmp );
                    var accessToken = sessionStorage.getItem( accessTokenKey );
                    console.log( ">>> TOKEN", jwtHelper.decodeToken( accessToken ));
                })
            .fail( 
                simpleAjaxErrorHandler( tokenUrl )
                );
    }
}

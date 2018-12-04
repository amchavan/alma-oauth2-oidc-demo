/**
 * TODO
 * 
 * amchavan, 29-Mar-2017 (in Tokyo!)
 */

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
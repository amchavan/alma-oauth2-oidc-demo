/**
 * Minor utility stuff
 * 
 * amchavan, 29-Mar-2017 (in Tokyo!)
 */

const httpService = {

    post: function( url, headers, data ) {

        const ajaxOptions = {
            url: url,
            type: 'POST',
            crossDomain: true,
            dataType: "json",
        };

        if( data ) {
            ajaxOptions.data = data
        }
        
        if( headers ) {
            ajaxOptions.headers = headers;
        }
        
        return $.ajax( ajaxOptions );
    },

    get: function( url, headers ) {

        const ajaxOptions = {
            url: url,
            type: 'GET',
            // crossDomain: true,
            dataType: "json",
        };

        if( headers ) {
            ajaxOptions.headers = headers;
        }
        
        return $.ajax( ajaxOptions );
    },
};

/**
 * Javascript doesn't have a native replaceAll() string method
 * This I found on Stack Overflow at
 * http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
 */
if (typeof String.prototype.replaceAll != 'function') {
    String.prototype.replaceAll = function (find, replace) {
        const str = this;
        return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
    }
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

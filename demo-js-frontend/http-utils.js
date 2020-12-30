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

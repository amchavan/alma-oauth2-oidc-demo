import { Injectable } from '@angular/core';
import { OAuthStorage } from 'angular-oauth2-oidc';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { OidcAuthInterceptorConfig } from './oicd-auth.interceptor.config';
import { catchError } from 'rxjs/operators';

/**
 * HttpInterceptor adding a 'Bearer' Authorization header to the request with
 * our identity token as value.
 *
 * amchavan, 13-Mar-2020
 */
@Injectable({
    providedIn: 'root',
})
export class OidcOAuthInterceptor implements HttpInterceptor {

    constructor( private authStorage: OAuthStorage,
                 private oidcAuthInterceptorConfig: OidcAuthInterceptorConfig ) {
    }

    /**
     * Returns true if the given URL needs Bearer authentication header,
     * false otherwise
     */
    private needsIdToken(url: string): boolean {
        const securedURLs = this.oidcAuthInterceptorConfig.securedURLs;
        if ( securedURLs.length === 0 ) {
            return false;
        }
        const found = securedURLs.find(u => url.startsWith(u.toLowerCase()));
        return !!found;
    }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (this.needsIdToken(req.url.toLowerCase())) {

            const token = this.authStorage.getItem('access_token');
            const authHeader = 'Bearer ' + token;
            const headers = req.headers.set('Authorization', authHeader);
            req = req.clone({headers});
        }

        return next
            .handle(req)
            .pipe( catchError( (error: HttpErrorResponse) => {

                // Keep just in case:
                // error.headers.keys().map( (key) =>
                //     console.error( '>>> header: ', `${key}: ${error.headers.get(key)}`));

                // Spring Security provides a WWW-Authenticate header with interesting
                // authentication info, will tell you for instance if the JWT used
                // for authentication has expired. If that header is given we provide it
                // to the application via the statusText field

                const wwwAuthHeader = error.headers.get( 'WWW-Authenticate' );
                if ( wwwAuthHeader != null ) {
                    const newError = new HttpErrorResponse(
                       {
                           error,                               // the original error response
                           headers: error.headers,              // the original headers
                           status: error.status,                // the original status code
                           statusText: wwwAuthHeader,           // a more meaningful description (default is 'OK')
                           url: error.url,                      // the original URL
                       });

                    // console.error( '>>> Interceptor (newError):', JSON.stringify( newError ));
                    return throwError( newError );

               } else {
                    return throwError( error );
               }
            })
        );
    }
}

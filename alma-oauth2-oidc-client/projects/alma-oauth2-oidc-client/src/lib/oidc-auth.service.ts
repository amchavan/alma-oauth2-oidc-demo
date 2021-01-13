import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthConfig, NullValidationHandler, OAuthService } from 'angular-oauth2-oidc';
import { OidcOauthConstants } from './oidc-oauth.constants';

/**
 * Configuration parameters for angular-oauth2-oidc.
 * For more configuration options see:
 * https://github.com/manfredsteyer/angular-oauth2-oidc/blob/master/projects/lib/src/auth.config.ts
 *
 * amchavan, 12-Mar-2020
 */
const angularOauth2OidcBasicConfig: AuthConfig = {
    // Url of the Identity Provider
    issuer: undefined,

    // The client ID as registered with the auth server. The SPA is registered with this ID
    clientId: undefined,

    // URL to redirect to after login
    redirectUri: window.location.origin + '/index.html',

    // set the scope for the permissions the client should request
    scope: 'openid profile',

    // Use Authorization Code grant
    responseType: 'code',

    // If true, the lib will try to check whether the user
    // is still logged in on a regular basis as described
    // in http://openid.net/specs/openid-connect-session-1_0.html#ChangeNotification
    sessionChecksEnabled: false,

    // Set to true for development
    showDebugInformation: false,

    // Defines when the token_timeout event should be raised.
    // For instance, if you set this to 0.75 (the default value), the event
    // is triggered after 75% of the token's life time
    timeoutFactor: 0.1,

    // This check needs to be disabled because Keycloak
    // does not include the at_check claim in the ID token
    // See https://ordina-jworks.github.io/security/2019/08/22/Securing-Web-Applications-With-Keycloak.html
    disableAtHashCheck: true,
};

const parseJwt = (token) => {
    return JSON.parse(atob(token.split('.')[1]));
};

/**
 * Wrapper around OAuthService: perform the OIDC authentication process.
 *
 * amchavan, 12-Mar-2020
 */
@Injectable({
    providedIn: 'root',
})
export class OidcAuthService {

    private readonly backgroundLoopID: number;
    private readonly authenticationCompleteSubject: Subject<any>;

    private identityClaims: object = {};
    private usableValidity = 100 - (100 * angularOauth2OidcBasicConfig.timeoutFactor);

    constructor(private http: HttpClient, private oauthService: OAuthService) {

        this.authenticationCompleteSubject = new Subject<any>();

        // Check initial expiration of all tokens, start a background look
        this.backgroundLoopID = this.computeTokenValidityOnInterval( 2500 );

        // Refresh the access token when it expires
        addEventListener( OidcOauthConstants.ACCESS_TOKEN_TIMEOUT_EVENT, () => {
            this.refresh();
        });

        // Stop the background refresh loop when the SSO session has expired
        addEventListener( OidcOauthConstants.SSO_SESSION_EXPIRED_EVENT, () => {
            clearInterval( this.backgroundLoopID );
        });

        // Stop the background refresh loop if something bad happened
        addEventListener( OidcOauthConstants.TOKEN_REFRESH_ERROR_EVENT, () => {
            clearInterval( this.backgroundLoopID );
        });
    }

    /**
     * Returns a set of user-related info, including:
     * givenName (first name)
     * lastName
     * mail
     * preferred_username
     * sub (same as preferred_username)
     * roles (either a single string or an array of strings)
     */
    get userIdentity(): object {
        return this.identityClaims;
    }

    // Keycloak returns no ID token
    // /** Returns the current identity token, if any */
    // get idToken(): string {
    //     return this.oauthService.getIdToken();
    // }

    /** Returns the current refresh token, if any */
    get refreshToken(): string {
        return this.oauthService.getRefreshToken();
    }

    // Keycloak returns no ID token
    // /** Returns the datetime the current access token was obtained */
    // get idTokenObtainedAt(): Date {
    //     const idTokenClaims = JSON.parse( sessionStorage.getItem( 'id_token_claims_obj' ));
    //     return new Date(idTokenClaims.iat * 1000);
    // }

    /** Returns the datetime the current refresh token was obtained */
    get refreshTokenObtainedAt(): Date {
        const parsed = parseJwt( this.refreshToken );
        const iat = parsed.iat;
        return new Date( iat * 1000 );
    }

    // Converts a string like "1587561342712" to a date,taking care of null values
    private static convertToDate(fromStorage: string) {
        if (fromStorage) {
          return new Date(parseInt(fromStorage, 10));
        }
        return null;
    }


    // Keycloak returns no ID token
    // /** Returns the datetime the current identity token will expire */
    // get idTokenExpiresAt(): Date {
    //     const n = this.oauthService.getIdTokenExpiration();
    //     return new Date( n );
    // }

    /** Returns the datetime the current refresh token will expire */
    get refreshTokenExpiresAt(): Date {
        const parsed = parseJwt( this.refreshToken );
        const exp = parsed.exp;
        return new Date( exp * 1000 );
    }

    /** Returns the current access token, if any */
    get accessToken(): string {
        return this.oauthService.getAccessToken();
    }

    /** Returns the datetime the current access token will expire */
    get accessTokenExpiresAt(): Date {
        const n = this.oauthService.getAccessTokenExpiration();
        return new Date( n );
    }

    /**
     * Returns the datetime the current identity token was obtained,
     * or null if that info is not available
     */
    get accessTokenObtainedAt(): Date {
        // Method OAuthService.getAccessTokenStoredAt() is protected (why?)
        // so we need to bypass that and go directly to the source, in
        // the application's session storage.
        const fromStorage = sessionStorage.getItem( 'access_token_stored_at' );
        return OidcAuthService.convertToDate( fromStorage );
    }

    /**
     * Applications can subscribe to the subject to be notified when the
     * authentication process has completed
     */
    public get authenticationComplete(): Subject<any> {
        return this.authenticationCompleteSubject;
    }

    /**
     * Applications call this method to launch the authentication process
     */
    public authenticate(oauthOidcServerURL: string, oauthOidcClientID: string) {

        angularOauth2OidcBasicConfig.issuer = oauthOidcServerURL;
        angularOauth2OidcBasicConfig.clientId = oauthOidcClientID;
        this.oauthService.configure( angularOauth2OidcBasicConfig );
        this.oauthService.tokenValidationHandler = new NullValidationHandler();

        return this.oauthService.loadDiscoveryDocumentAndLogin().then(loggedIn => {
            if (!loggedIn) {
                console.log('ERROR: login failed');   // anything else we can do here?
                return;
            }

            this.identityClaims = this.oauthService.getIdentityClaims();
            console.log('>>> identityClaims:', this.identityClaims);
            this.authenticationComplete.next( this.identityClaims );    // notify we're done with authentication
        });
    }

    /**
     * Perform a log out, removing all local auth info and
     * redirecting to the Identity Provider for final logout
     * there
     */
    public logout(): void {
        this.oauthService.logOut();
    }

    /**
     * Perform a refresh of the access token
     */
    public refresh(): void {
        this.oauthService
          .refreshToken()
          .then( () => {
            // console.log( 'Refreshed access token' );
            // console.log('Refreshed access token', response);
          })
          .catch(err => {
              const errorDesc = err.error.error_description.toLowerCase();
              if ( errorDesc.includes( 'token is not active' ) ||
                   errorDesc.includes( 'session not active' )) {
                  // Token refresh will fail when the SSO session
                  // has expired and the user must log in again. We're checking
                  // against that error description to discriminate against all
                  // alternative error cases
                  console.log( 'Access token refresh failed, SSO session expired:' );
                  dispatchEvent( new CustomEvent( OidcOauthConstants.SSO_SESSION_EXPIRED_EVENT ));
              } else {
                  console.error( 'Access token refresh error: ', err.error.error_description );
                  dispatchEvent(new CustomEvent( OidcOauthConstants.TOKEN_REFRESH_ERROR_EVENT ));
              }
          });
    }

    /**
     * Background task: continuously checks token expiration and emits an _remainingTokenValidity_
     * event with the details.
     * If the access token exceeded its usable validity (as defined by AuthConfig.timeoutFactor)
     * emits an _accessTokenTimeout_ event.
     *
     * @param intervalLength  Wait time in msec between checks
     */
    private computeTokenValidityOnInterval( intervalLength: number ): number {

        function computeRemainingValidity( validityStart, validityEnd, now ) {
            // Compute remaining validity as absolute number of milliseconds and
            // as percentage of the original validity
            const originalValidity = validityEnd - validityStart;
            let remainingValidity  = validityEnd - now;
            if (remainingValidity < 0) {
                // expired is expired! Negative numbers make no sense here
                remainingValidity = 0;
            }
            const remainingValidityPercent = Math.round((remainingValidity / originalValidity) * 100);
            // console.log( '>>>', validityStart, validityEnd, now, remainingValidity, remainingValidityPercent );

            return {
                remaining_validity_msec: remainingValidity,
                remaining_validity_percent: remainingValidityPercent
            };
        }

        // Launch a background loop and return its numerical ID, so our caller can
        // cancel it
        return setInterval( () => {

                const refreshTokenValidityStart = this.refreshTokenObtainedAt.getTime();
                const refreshTokenValidityEnd   = this.refreshTokenExpiresAt.getTime();
                const accessTokenValidityStart  = this.accessTokenObtainedAt.getTime();
                const accessTokenValidityEnd    = this.accessTokenExpiresAt.getTime();
                const now = (new Date()).getTime();

                const validityEvent = {
                    access_token_validity:  computeRemainingValidity(accessTokenValidityStart,  accessTokenValidityEnd, now),
                    refresh_token_validity: computeRemainingValidity(refreshTokenValidityStart, refreshTokenValidityEnd, now)
                };
                dispatchEvent( new CustomEvent( OidcOauthConstants.TOKEN_VALIDITY_EVENT, {detail: validityEvent}));

                if (validityEvent.access_token_validity.remaining_validity_percent < this.usableValidity) {
                    dispatchEvent( new CustomEvent( OidcOauthConstants.ACCESS_TOKEN_TIMEOUT_EVENT, {detail: validityEvent} ));
                }
            },
            intervalLength );
    }
}

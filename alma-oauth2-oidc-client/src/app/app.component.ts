import { Component, OnInit } from '@angular/core';
import { OidcOauthConstants, OidcAuthService } from 'alma-oauth2-oidc-client';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ModalService } from './modal-dialog-box';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    private readonly USERNAME_CLAIM = 'preferred_username';
    private readonly FIRST_NAME_CLAIM = 'given_name';
    private readonly LAST_NAME_CLAIM = 'family_name';

    title = 'Demo application for alma-oauth2-oidc-client';
    authenticated = false;
    remainingAccessTokenValidity: number;
    remainingAccessTokenValidityPercent: number;
    remainingRefreshTokenValidityPercent: number;
    remainingRefreshTokenValidity: number;
    userInfo = 'N/A';
    userSecret = 'N/A';

    constructor( private httpClient: HttpClient, private oidcAuthService: OidcAuthService, private modalService: ModalService ) {
    }

    ngOnInit(): void {
        console.log( '>>> Start:', new Date() );

        // Subscribe to token validity events, reporting up-to-date stats on, well, token validity
        addEventListener( OidcOauthConstants.TOKEN_VALIDITY_EVENT, (e: CustomEvent) => {
            this.remainingAccessTokenValidity         = e.detail.access_token_validity.remaining_validity_msec;
            this.remainingAccessTokenValidityPercent  = e.detail.access_token_validity.remaining_validity_percent;
            this.remainingRefreshTokenValidity        = e.detail.refresh_token_validity.remaining_validity_msec;
            this.remainingRefreshTokenValidityPercent = e.detail.refresh_token_validity.remaining_validity_percent;
        });

        // When the SSO Session expires the user must re-authenticate
        addEventListener( OidcOauthConstants.SSO_SESSION_EXPIRED_EVENT, () => {
            this.openReloadModal();
        });

        this.oidcAuthService.authenticationComplete.subscribe( () => {
            console.log( '>>> Authentication complete' );
            this.authenticated = true;
            this.loadUserInfoFromResourceServer();
            this.loadSecretFromResourceServer();
        });

        this.oidcAuthService.authenticate( environment.oauthOidcServerURL, environment.oauthOidcClientID );
    }

    /**
     * Return the username of the authenticated user, e.g. 'amchavan'
     */
    public get username() {
        return this.oidcAuthService.userIdentity[this.USERNAME_CLAIM];
    }

    /**
     * Return the first and last name of the authenticated user, e.g. 'Maurizio Chavan'
     */
    public get fullname() {
        return this.oidcAuthService.userIdentity[this.FIRST_NAME_CLAIM]
            + ' '
            + this.oidcAuthService.userIdentity[this.LAST_NAME_CLAIM];
    }

    public get refreshToken() {
        return this.oidcAuthService.refreshToken;
    }

    public get refreshTokenObtainedAt(): Date {
        return this.oidcAuthService.refreshTokenObtainedAt;
    }

    public get refreshTokenExpiresAt(): Date {
        return this.oidcAuthService.refreshTokenExpiresAt;
    }

    public get accessToken() {
        return this.oidcAuthService.accessToken;
    }

    public get accessTokenObtainedAt(): Date {
        return this.oidcAuthService.accessTokenObtainedAt;
    }

    public get accessTokenExpiresAt(): Date {
        return this.oidcAuthService.accessTokenExpiresAt;
    }

    // Invoked when clicking on the UI button
    loadUserInfoFromResourceServer(): void {
        this.httpClient
            .get( environment.apiURL + '/authenticated', {observe: 'response'})
            // .pipe(
            //     catchError( this.handleError ))
            .subscribe(
                (response) => {
                    // @ts-ignore
                    this.userInfo = response.body.content;
                },

                (error: HttpErrorResponse) => {
                    if (error.status === 401 &&
                        error.statusText.toLowerCase().includes( OidcOauthConstants.JWT_EXPIRED_STATUS_TEXT )) {

                        // If our JWT has expired we can't really do anything here, but
                        // we should really give the user the option of doing something before reloading
                        // the application -- rudimentary error handling!
                        alert( 'Your session has expired, application will restart' );
                        location.reload ();
                    } else {
                        // Nope, our JWT has not expired, do with what we have
                        alert( error.message );
                        console.error( '>>> error:', JSON.stringify( error ));
                    }
                });
    }

    // Invoked when clicking on the UI button
    loadSecretFromResourceServer(): void {
        this.httpClient
            .get( environment.apiURL + '/arca-only', {observe: 'response'})
            // .pipe(
            //     catchError( this.handleError ))
            .subscribe(
                (response) => {
                    // @ts-ignore
                    this.userSecret = response.body.content;
                },

                (error: HttpErrorResponse) => {
                    if (error.status === 403 ) {
                        this.userSecret = '(not authorized)';

                    } else if (error.status === 401 &&
                        error.statusText.toLowerCase().includes( OidcOauthConstants.JWT_EXPIRED_STATUS_TEXT )) {

                        // If our JWT has expired we can't really do anything here, but
                        // we should really give the user the option of doing something before reloading
                        // the application -- rudimentary error handling!
                        alert( 'Your session has expired, application will restart' );
                        location.reload ();

                    } else {
                        // Nope, our JWT has not expired, do with what we have
                        alert( error.message );
                        console.error( '>>> error:', JSON.stringify( error ));
                    }
                });
    }

    logout(): void {
        this.oidcAuthService.logout();
    }

    refresh(): void {
        this.oidcAuthService.refresh();
    }

    convertMsecToHHMMSS( numMsec ): string {
        const numSecs = Math.floor(numMsec / 1000);
        const hours   = Math.floor(numSecs / 3600);
        const minutes = Math.floor((numSecs - (hours * 3600)) / 60);
        const seconds = numSecs - (hours * 3600) - (minutes * 60);

        return `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
    }

    openReloadModal() {
        this.modalService.open( 'reload-modal' );
    }

    reload() {
        location.reload();
    }
}

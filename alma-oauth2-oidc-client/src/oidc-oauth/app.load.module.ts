import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { OidcAuthService } from 'alma-oauth2-oidc-client';
import { environment } from '../environments/environment';

function authenticate(oidcAuthService: OidcAuthService) {
    return () => oidcAuthService.authenticate( environment.oauthOidcServerURL, environment.oauthOidcClientID );
}

/**
 * Configure code to run before the rest of the app starts loading, see
 * https://medium.com/better-programming/how-to-handle-async-providers-in-angular-51884647366
 * In this case it's the procedure to perform the OIDC authentication routine.
 *
 * amchavan, 12-Mar-2020
 */
@NgModule({
    imports: [HttpClientModule],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: authenticate,
            deps: [OidcAuthService],
            multi: true,
        },
    ],
})
export class AppLoadModule {
}

import { OidcOAuthInterceptor } from './oidc-auth.interceptor';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { OidcAuthInterceptorConfig } from './oicd-auth.interceptor.config';
import { OidcAuthService } from './oidc-auth.service';

/**
 * Call the forRoot() method with an OidcAuthInterceptorConfig instance to
 * initialize this module.
 *
 * amchavan, 19-Mar-2020
 */
@NgModule({
    declarations: [],
    exports:      []
})
export class OidcAuthModule {

    static forRoot( oidcAuthInterceptorConfig: OidcAuthInterceptorConfig ): ModuleWithProviders<OAuthModule> {
        return {
            ngModule: OidcAuthModule,
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: OidcOAuthInterceptor,
                    multi: true
                },
                { provide: OidcAuthInterceptorConfig, useValue: oidcAuthInterceptorConfig },
                { provide: OidcAuthService, useClass: OidcAuthService },
            ]
        };
    }
}

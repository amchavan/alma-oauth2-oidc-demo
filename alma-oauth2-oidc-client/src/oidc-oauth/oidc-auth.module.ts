import {NgModule} from '@angular/core';
import {USER_IDENTITY} from './oidc-auth.injectors';
import {OidcAuthService} from '../../projects/alma-oauth2-oidc-client/src/lib/oidc-auth.service';

/**
 * Provide an InjectionToken called USER_IDENTITY, initialized
 * with info provided by the auth service.
 *
 * amchavan, 12-Mar-2020
 */
@NgModule({
  providers: [
    {
      provide: USER_IDENTITY,
      useFactory: (config: OidcAuthService) => {
        // this factory initializes the USER_IDENTITY token with
        // info from the auth service.
        return config.userIdentity;
      },
      deps: [OidcAuthService],
    },
  ],
})
export class OidcAuthModuleQQQ {
}

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {

    production: false,
    apiURL: 'http://localhost:9002/oidc-resource-server/protected',
    oauthOidcServerURL: 'https://www.eso.org/dev-keycloak/auth/realms/ALMA',
       // oauthOidcServerURL: 'http://localhost:8080/auth/realms/ALMA/protocol/openid-connect',
    oauthOidcClientID: 'oidc',

    get allApiURLs() {
        return [environment.apiURL];
    },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

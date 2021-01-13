# The alma-oauth2-oidc-client library

This is an ALMA-specific OAuth2/OIDC client library based on
[angular-oauth2-oidc](https://github.com/manfredsteyer/angular-oauth2-oidc).
This implementation is for the 
[Keycloak](https://www.keycloak.org/)
Identity Provider as configured for ALMA.

## Development notes

To develop both library and demo application:

1. Open a terminal window, then `cd` to _.../alma-oauth2-oidc-client_
   and launch `ng build alma-oauth2-oidc-client --watch`
   
1. Open another terminal window, then `cd` 
   to _.../alma-oauth2-oidc-client_ and launch `ng serve`

The first step will set up a continuous build of the library, the 
second will rebuild and serve the application as http://localhost:4200

Note that you may need to restart `ng build` and/or `ng serve` from 
time to time, as they occasionally get stuck.

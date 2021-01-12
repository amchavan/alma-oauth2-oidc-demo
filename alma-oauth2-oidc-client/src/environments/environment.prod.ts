export const environment = {

  production: true,
  apiURL: 'http://localhost:9000/demo-server/service/api',
  oauthOidcServerURL: 'http://localhost:8080/auth/realms/ALMA/protocol/openid-connect',
  oauthOidcClientID: 'oidc',

  get allApiURLs() {
    return [environment.apiURL];
  },
};

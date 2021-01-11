# OIDC System Demo

This module includes a number of applications 
demonstrating the integration of OAuth clients and
resource servers with an Identity Provider, in this case
[Keycloak](https://www.keycloak.org/) as installed on https://www.eso.org/dev-keycloak, realm _ALMA_

* _demo-js-frontend_: a pure JavaScript client, see [the README file](demo-js-frontend/README.md)
  
* _demo-cas-client_: obsolete, please ignore

* _demo-oidc-client_: A Java MVC client, see [the README file](demo-oidc-client/README.md)
  
* _oidc-resource-server_: a resource server providing public datetime information, see [the README file](oidc-resource-server/README.md)
  
* _oidc-resource-server-2_: a resource server providing protected information, see [the README file](oidc-resource-server-2/README.md)
  
* _oidc-resource-server-3_: a resource server also providing protected information, see [the README file](oidc-resource-server-3/README.md)

## Quick start

Assuming the Keycloak Identity Provider is up and running:

* Build and launch the three resource servers (preferably in separate terminal windows): 
  ```
  cd .../alma-oauth2-oidc-demo

  cd oidc-resource-server
  mvn clean spring-boot:run &
  cd ..

  cd oidc-resource-server-2
  mvn clean spring-boot:run &
  cd ..

  cd oidc-resource-server-3
  mvn clean spring-boot:run &
  cd ..
  ```
* Launch the Java MVC client:
  ```
  cd demo-oidc-client
  mvn clean spring-boot:run &
  cd ..
  ```
  It will be available at http://localhost:9004

* Serve the JavaScript client:
  ```
  cd demo-js-frontend
  python -m http.server 8000 &
  cd ..
  ```
  It will be available at http://localhost:8000/demo-spa.html

After logging in on one application you should be authenticated on the other one as well (Single Sign-On).

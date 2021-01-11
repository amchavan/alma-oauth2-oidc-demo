# demo-oidc-frontend

A Java MVC client exercising the Authentication Code grant with the _oidc_ keycloak client.  
See _demo-oidc-client/src/main/resources/application.properties_ for the configuration info

## Build and run

To build and run this application:

```
cd .../demo-oidc-frontend
mvn clean spring-boot:run
```

The application will be available at http://localhost:9004.

## Using the application

"OBOPS/ARP"

Upon first use you will be taken to a public page. 
If the user has the _OBOPS/ARP_ role the _Secured page_ 
button will take you to a simple page displaying that user's 
login name; otherwise an error message will be displayed.

The _Logout_ button will log out the user and redirect 
to a dead-end page.

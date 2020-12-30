# oidc-resource-server-2

A resource server providing protected information.

It is configured for JWT authentication, see _application.properties_.  
Configuration class _SecurityConfiguration.java_ is self-contained.

## Build and run

To build and run this application:

```
cd .../oidc-resource-server
mvn clean spring-boot:run
```

The public API will be available at http://localhost:9002/oidc-resource-server/protected:

*  `.../protected/authenticated`: accessible to any authenticated user
*  `.../protected/arca-only`: accessible only if the user has role _OBOPS/ARCA_
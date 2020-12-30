# oidc-resource-server-2

A resource server providing protected information.

It is configured for JWT authentication, see _application.properties_.  
Security configuration is split between a generic abstracty class (_OidcWebSecurityConfig_), potentially shareable 
among multiple similar applications, and an application-specific endpoint security class, _SecurityConfiguration.java_.

## Build and run

To build and run this application:

```
cd .../oidc-resource-server
mvn clean spring-boot:run
```

The public API will be available at http://localhost:9003/oidc-resource-server/service/api:

*  `.../service/api/secret`: accessible only if the user has role _OBOPS/ARP_
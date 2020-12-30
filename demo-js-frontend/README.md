# demo-js-frontend

A pure JavaScript client exercising the Authentication Code grant with the _oidc_ keycloak client.  
See _demo-spa.js_ for the configuration info

## Build and run

No build steps are needed.

To serve this application:
```
cd .../demo-js-frontend
python -m http.server 8000
```

Before accessing the application at http://localhost:8000/demo-spa.html you should start its resource servers (_oidc-resource-server_, _oidc-resource-server-2_ and _oidc-resource-server-3_).

## Using the application

Upon first use you will be redirected to the Keycloak login page, where you can log in with any ALMA Portal user.  
The top section of the page will be showing that user's profile. 

The _Load resources_ button will try to load a number of resources, which may or may not be available depending on the user's roles.

The _Logoout_ button will log out the user and redirect to a dead-end page.
# ALMA CAS/OIDC Demo

A demo setup for the CAS/OAuth2/OIDC authentication server

To set up the demo you'll have to start a number of components:
* Two OIDC-secured resource servers
* A JavaScript front-end, a Single Page Application making use of those servers

**NOTE** In the following examples you'll have to replace _ma24088.ads.eso.org_ with the hostname of your authorization server.

## Resource servers

The demo includes two OIDC-secured resource servers. To launch them:
```
cd oicd-resource-server 
mvn spring-boot:run
cd ../oicd-resource-server-2
mvn spring-boot:run
```

The resource servers are listening to _http://localhost:9000/oidc-resource-server/_ and _http://localhost:9001/oidc-resource-server/aod-only_ 

They are secured by OIDC, meaning that they expect a valid JWT as _Bearer_ token in the _Authorization_ header: without the token the servers will reject any GET request as _Unauthorized_.  
If the token describes a user who does not have the _OBOPS/AOD_ permission, a GET from the second URL will also fail.

### Positive tests

Obtain a valid JWT from the authentication server by navigating to  
`https://ma24088.ads.eso.org:8019/cas/oidc/token?response_type=id_token%20token&grant_type=password&client_id=demoOIDC&username=USERNAME&password=PASSWORD`  
where USERNAME and PASSWORD are the user credentials of a user with the _OBOPS/AOD_ role/authority. (The JWT is a _long_ string like _eyJhbGciOiJSUzI1NiIsImtpZCI6ImFsbWEub2JvcHMuY2FzIn0.eyJqdGkiOiI0NTE5NzEzN ..._.)

Now ask for the resources with an Authorization header including the JWT:
```
JWT='eyJhbGciOiJS....'
curl -H "Authorization: Bearer $JWT" http://localhost:9000/oidc-resource-server/
curl -H "Authorization: Bearer $JWT" http://localhost:9001/oidc-resource-server/aod-only
```
You should get JSON messages like `{"id":"8e14678d-...","content":"Hello, obops!"}` and `{"id":"11b18665-...","content":"OBOPS/AOD"}`, respectively.

### Negative tests

`curl -I http://localhost:9000/oidc-resource-server/` should return _401_

`curl -I http://localhost:9001/oidc-resource-server/aod-only` should also return _401_

Now obtain another valid JWT from the authentication server, this time for a user who does not have the _OBOPS/AOD_ role/authority. With that token:
```
JWT='eyJhbGciO....'
curl -I -H "Authorization: Bearer $JWT" http://localhost:9001/oidc-resource-server/aod-only 
```
Although the JWT is valid, the user is not authorised to get that resource and you should get a _401_ return status.

## JavaScript front-end

A very simple Single Page Application that obtains a JWT access token from
the OIDC authentication server using the _Implicit_ grant, then accesses two resource servers passing that token.
To launch the SPA:
```
cd demo-js-frontend
python -m http.server 8000
```
Navigate to http://localhost:8000/demo-spa.html : you'll be redirected to the login page.  
After successful login the SPA should show your user ID and basic info. Clicking on the
_Load resources_ button will query the resource servers and show the returned info.

## CAS-secured server-side application

A very simple Java server-side application that's secured via the CAS protocol, 
to demonstrate Single Sign-On between CAS-secured and OIDC-secured resources.
To launch the SPA:
```
cd demo-cas-client
mvn clean spring-boot:run
```
Navigate to http://localhost:9002/ . 
The welcome page is public: if you click on the _Login to see..._ button you'll be redirected to the CAS login page, then to a secured page that should show your user ID.
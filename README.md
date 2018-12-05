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

The resource servers are listening to _http://localhost:9000/oidc-resource-server/_ and _http://localhost:9001/oidc-resource-server/_ 

They are secured by OIDC, meaning that they expect a valid JWT as _Bearer_ token in the _Authorization_ header. Without that, they will reject any request as _Unauthorized_.

### Negative test

`curl -I http://localhost:9000/oidc-resource-server/` should show _401_

### Positive test

Obtain a valid JWT from the authentication server by navigating to  
`https://ma24088.ads.eso.org:8019/cas/oidc/token?response_type=id_token%20token&grant_type=password&client_id=demoOIDC&username=USERNAME&password=PASSWORD`  
where USERNAME and PASSWORD are the user credentials. (The JWT is a _long_ string like _eyJhbGciOiJSUzI1NiIsImtpZCI6ImFsbWEub2JvcHMuY2FzIn0.eyJqdGkiOiI0NTE5NzEzN ..._.)

Now ask for the resource with an Authorization header including the JWT:
```
JWT='eyJhbGciOiJS....'
curl -H "Authorization: Bearer $JWT" http://localhost:9000/oidc-resource-server/ 
```
You should get a JSON message like `{"id":"8e14678d-...","content":"Hello, obops!"}`

## JavaScript front-end

A very simple Single Page Application that obtains a JWT access token from
the OIDC authentication server using the _Implicit_ grant, then accesses two resource servers passing that token.
To launch the SPA:
```
cd demo-js-frontend
python -m SimpleHTTPServer 8000
```
Open a new private/incognito browser window and navigate to http://localhost:8000/demo-spa.html : you'll be redirected to the login page.  
After successful login the SPA should show your user's ID and basic info.


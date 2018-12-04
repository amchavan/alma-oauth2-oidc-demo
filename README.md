# ALMA CAS/OIDC Demo

**WIP**

To set up the demo you'll have to start a number of components. **TODO**

## Demo JavaScript front-end

A very simple Single Page Application that obtains a JWT access token from
the OIDC authentication server using the _Implicit_ grant, then accesses two resource servers passing that token.
To launch the SPA:
```
cd demo-js-frontend
python -m SimpleHTTPServer 8000
```
Open a new private/incognito browser window and navigate to http://localhost:8000/demo-spa.html : you'll be redirected to the login page.  
After successful login the SPA should show your user's ID and basic info.


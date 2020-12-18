# Demo OIDC resource server

A simple OIDC-secured resource server. 

## Configuration

Class `SecurityConfiguration` is a subclass of `OidcWebSecurityConfig` and contains only URL matchers.

## Usage

Base URL is http://localhost:9003/oidc-resource-server

The response is always a JSON object with a numeric response _id_ field, and a 
string _content_ field.
```json
{
    "id": 2,
    "content": "..."
}
```

Endpoints have different security levels:
* `/service/api/datetime` 
  Publicly accessible, content is the current date and time (ISO)
* `/service/api/who-am-i`
   Only authenticated users, content is the user's username and full name
* `/service/api/secret` 
  Only authenticated users with the _OBOPS/AOD_ role can access it, 
  content is a 'secret' random string like 
  _1374485a-248..._

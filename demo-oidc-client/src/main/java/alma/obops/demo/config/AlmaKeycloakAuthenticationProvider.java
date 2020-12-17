package alma.obops.demo.config;

import org.keycloak.adapters.springsecurity.authentication.KeycloakAuthenticationProvider;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;

/**
 * @author amchavan, 17-Dec-2020
 * From https://github.com/Smartling/smartling-keycloak-extras/blob/master/keycloak-spring-security-user-details/src/main/java/org/keycloak/adapters/springsecurity/userdetails/authentication/KeycloakUserDetailsAuthenticationProvider.java
 */
public class AlmaKeycloakAuthenticationProvider extends KeycloakAuthenticationProvider {

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        KeycloakAuthenticationToken token = (KeycloakAuthenticationToken) super.authenticate(authentication);
        if (token == null) {
            return null;
        }

        var userDetails = new AlmaKeycloakUserDetails( token );
        return new KeycloakAuthenticationToken( token.getAccount(), true, userDetails.getAuthorities() );
    }
}

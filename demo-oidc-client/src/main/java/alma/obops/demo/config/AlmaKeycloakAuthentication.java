package alma.obops.demo.config;

import org.keycloak.adapters.OidcKeycloakAccount;
import org.keycloak.adapters.spi.KeycloakAccount;
import org.keycloak.adapters.springsecurity.account.SimpleKeycloakAccount;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.springframework.security.authentication.AbstractAuthenticationToken;

/**
 * @author amchavan, 17-Dec-2020
 */
public class AlmaKeycloakAuthentication extends KeycloakAuthenticationToken {

    private final String username;

    public AlmaKeycloakAuthentication(AlmaKeycloakUserDetails userDetails, OidcKeycloakAccount keycloakAccount ) {
        super( keycloakAccount, true, userDetails.getAuthorities() );
        this.username = userDetails.getUsername();
//        this.setAuthenticated( true );
    }

    /** We don't have any passwords or secrets here */
    @Override
    public Object getCredentials() {
        return "";
    }

    @Override
    public Object getPrincipal() {
        return this.username;
    }
}

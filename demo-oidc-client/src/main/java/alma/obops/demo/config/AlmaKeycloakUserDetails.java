package alma.obops.demo.config;

import org.keycloak.adapters.OidcKeycloakAccount;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.keycloak.representations.IDToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author amchavan, 17-Dec-2020
 */
class AlmaKeycloakUserDetails implements UserDetails {

    private static final long serialVersionUID = 1L;
    private final String username;
    private final KeycloakAuthenticationToken token;

    public AlmaKeycloakUserDetails( KeycloakAuthenticationToken token ) {
        this.username = token.getAccount().getPrincipal().getName();
        this.token = token;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        OidcKeycloakAccount account = token.getAccount();
        IDToken idToken = account.getKeycloakSecurityContext().getIdToken();
        var roles = (List<?>) idToken.getOtherClaims().get( "roles" );

        return roles
                .stream()
                .map( role -> new SimpleGrantedAuthority( role.toString()) )
                .collect( Collectors.toList() );
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

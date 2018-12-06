package alma.obops.test.oidcresourceserver;

import java.util.Collection;
import java.util.stream.Collectors;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;

/**
 * Web security configuration, includes extracting authorities from the JWT's
 * "zoneinfo" claim.<p>
 * 
 * See the Spring Security guide, section "6.8.5 Configuring Authorization"
 * (https://docs.spring.io/spring-security/site/docs/current/reference/html/jc.html#oauth2resourceserver-authorization)
 * 
 * @author mchavan 06-Nov-2018
 *
 */
@EnableWebSecurity
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .anyRequest().authenticated()
                .and()
            .oauth2ResourceServer()
                .jwt()
                    .jwtAuthenticationConverter( grantedAuthoritiesExtractor() );
    }

	Converter<Jwt, AbstractAuthenticationToken> grantedAuthoritiesExtractor() {
		return new GrantedAuthoritiesExtractor();
	}
}

/**
 * Extract authorities from the the identity token's "zoneinfo" claim.
 */
class GrantedAuthoritiesExtractor extends JwtAuthenticationConverter {
	
    protected Collection<GrantedAuthority> extractAuthorities(Jwt jwt) {
        @SuppressWarnings("unchecked")
		Collection<String> authorities = 
			(Collection<String>) jwt.getClaims().get( "zoneinfo" );

        return authorities.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }
}
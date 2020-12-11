package alma.obops.test.oidcresourceserver;

import net.minidev.json.JSONArray;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;

import java.util.stream.Collectors;

/**
 * @author amchavan, 11-Dec-2020
 */
@EnableWebSecurity
public class CustomSecurityConfiguration extends WebSecurityConfigurerAdapter {
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests(authorize -> authorize
                        .antMatchers( "/arp-only/**" ).hasAuthority( "OBOPS/ARP" )
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer( oauth2 ->
                        oauth2.jwt( jwt ->
                                jwt.jwtAuthenticationConverter( jwtAuthenticationConverter() )
                        )
                );
    }

    Converter<Jwt, AbstractAuthenticationToken> jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter( jwt -> {
            JSONArray roles = jwt.getClaim( "roles" );
            return roles
                    .stream()
                    .map(Object::toString)
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());
        });
        return converter;
    }
}

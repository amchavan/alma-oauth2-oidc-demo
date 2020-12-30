package alma.obops.resourceserver;

import net.minidev.json.JSONArray;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;

import java.util.stream.Collectors;

/**
 * See https://github.com/spring-projects/spring-security/tree/5.3.2.RELEASE/samples/boot/oauth2resourceserver-jwe/src/main/java/sample
 *
 * Subclasses will need to implement the {@link #addAntMatchers(HttpSecurity)} method.
 *
 * @author amchavan, 06-Mar-2020
 */
public abstract class OidcWebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
    private String key;

    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withJwkSetUri( this.key ).build();
    }

    /**
     * See https://stackoverflow.com/questions/59379645/spring-security-5-populating-authorities-based-on-jwt-claims
     * @return A converter that extracts a user's authorities from the JWT's 'roles' attribute
     */
    Converter<Jwt, AbstractAuthenticationToken> getJwtAuthenticationConverter() {
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

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        // Define common behavior
        http.csrf().disable().cors().and();

        // Add any Ant path matchers -- defined by subclasses
        addAntMatchers( http );

        http.oauth2ResourceServer( oauth2 -> oauth2
                        .jwt( jwt -> jwt
                                .jwtAuthenticationConverter( getJwtAuthenticationConverter() )
                        )
                );
    }

    /**
     * Subclasses should override this method adding Ant path matchers, for instance
     * <pre>
     *     protected void addAntMatchers(HttpSecurity httpSecurity) throws Exception {
     *         httpSecurity.authorizeRequests( urlRegistry -> urlRegistry
     *             .antMatchers(HttpMethod.GET, "/service/api/datetime").permitAll()
     *             .antMatchers(HttpMethod.GET, "/service/api/who-am-i").authenticated()
     *             ...
     *         );
     * </pre>
     */
    protected abstract void addAntMatchers( HttpSecurity httpSecurity ) throws Exception;
}


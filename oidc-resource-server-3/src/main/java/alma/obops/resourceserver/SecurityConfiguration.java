package alma.obops.resourceserver;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

@Configuration
public class SecurityConfiguration extends OidcWebSecurityConfig {

    @Override
    protected void addAntMatchers(HttpSecurity httpSecurity) throws Exception {

        httpSecurity.authorizeRequests( urlRegistry -> urlRegistry
            .antMatchers( HttpMethod.GET, "/service/api/datetime" ).permitAll()
            .antMatchers( HttpMethod.GET, "/service/api/who-am-i" ).authenticated()
            .antMatchers( HttpMethod.GET, "/service/api/secret"   ).hasAuthority("OBOPS/ARP")
        );
    }
}

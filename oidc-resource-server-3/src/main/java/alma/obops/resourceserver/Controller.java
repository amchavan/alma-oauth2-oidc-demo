package alma.obops.resourceserver;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/service/api")
@CrossOrigin(allowCredentials="true")
public class Controller {
    static int nextID = 0;

    @GetMapping("/secret")
    public Map<String,Object> secret( @AuthenticationPrincipal Jwt jwt ) {
        Map<String,Object> model = new HashMap<>();
        model.put( "id", nextID++ );
        model.put( "content", jwt.getClaim( "preferred_username" ) + "-" + UUID.randomUUID() );
        return model;
    }

    @GetMapping("/datetime")
    public Map<String,Object> dateTime() {
        Map<String,Object> model = new HashMap<>();
        model.put( "id", nextID++ );
        model.put( "content", new Date() );
        return model;
    }

    @GetMapping("/who-am-i")
    // See https://github.com/spring-projects/spring-security/blob/master/samples/boot/oauth2resourceserver/src/main/java/sample/OAuth2ResourceServerController.java
    public Map<String,Object> whoAmI( @AuthenticationPrincipal Jwt jwt ) {

        final Map<String, Object> claims = jwt.getClaims();
        final var me =
                claims.getOrDefault( "name", "Unknown" )
                + " ("
                + claims.getOrDefault( "preferred_username", "???" )
                + ")";

        Map<String,Object> model = new HashMap<>();
        model.put( "id", nextID++ );
        model.put( "content", me );

        return model;
    }
}

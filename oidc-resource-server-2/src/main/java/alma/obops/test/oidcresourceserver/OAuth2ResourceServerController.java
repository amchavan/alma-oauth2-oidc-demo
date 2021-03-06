package alma.obops.test.oidcresourceserver;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * @author amchavan from the Spring Security 5.x samples
 */
@RestController
@RequestMapping("/protected")
@CrossOrigin
public class OAuth2ResourceServerController {

	static int nextID = 0;

	@GetMapping( "/arca-only" )
	public Object arcaOnly() {
		Map<String,Object> model = new HashMap<>();
		model.put( "id", nextID++ );
		model.put( "content", UUID.randomUUID() );
		return model;
	}

	@GetMapping( "/authenticated" )
	public Object authenticated( @AuthenticationPrincipal Jwt jwt ) {
		Map<String,Object> model = new HashMap<>();
		model.put( "id", nextID++ );
		model.put( "content", "You are authenticated as " + jwt.getClaim( "preferred_username" ));
		return model;
	}
}

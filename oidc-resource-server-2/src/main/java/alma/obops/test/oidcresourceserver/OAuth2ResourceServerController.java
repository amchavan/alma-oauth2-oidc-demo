package alma.obops.test.oidcresourceserver;


import net.minidev.json.JSONArray;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;
import java.util.stream.Collectors;

/**
 * @author amchavan from the Spring Security 5.x samples
 */
@RestController
public class OAuth2ResourceServerController {

	@GetMapping( "/arp-only" )
	public Object privateMessage( @AuthenticationPrincipal Jwt jwt ) {
		JSONArray roles = jwt.getClaim( "roles" );
		return new Message( roles.stream()
				.map(Object::toString)
				.collect(Collectors.joining( ", " )));
	}
}

class Message {
	private final String id = UUID.randomUUID().toString();
	private final String content;

	public Message(String content) {
		this.content = content;
	}

	public String getId() {
		return id;
	}

	public String getContent() {
		return content;
	}
}

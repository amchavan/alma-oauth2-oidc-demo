package alma.obops.test.oidcresourceserver;


import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author amchavan from the Spring Security 5.x samples
 */
@RestController
public class OAuth2ResourceServerController {

	@GetMapping("/")
	public Object index(@AuthenticationPrincipal Jwt jwt) {
		return new Message( String.format( "Hello, %s!", jwt.getClaims().get( "given_name" )));
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

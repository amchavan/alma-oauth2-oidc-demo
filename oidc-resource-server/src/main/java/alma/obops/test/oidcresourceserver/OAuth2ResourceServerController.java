package alma.obops.test.oidcresourceserver;


import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Josh Cummings
 */
@RestController
public class OAuth2ResourceServerController {

	@GetMapping("/")
	public Object index(@AuthenticationPrincipal Jwt jwt) {
		Message msg = new Message( String.format("Hello, %s!", jwt.getSubject()) );
		return msg;
	}
}

class Message {
	private String id = UUID.randomUUID().toString();
	private String content;

	Message() {
	}

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

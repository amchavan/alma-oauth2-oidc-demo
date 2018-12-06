package alma.obops.test.oidcresourceserver;


import java.util.UUID;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author amchavan from the Spring Security 5.x samples
 */
@RestController
public class OAuth2ResourceServerController {

	@GetMapping( "/aod-only" )
	@PreAuthorize( "hasAuthority('OBOPS/AOD')" )
	public Object privateMessage( @AuthenticationPrincipal Jwt jwt ) {
		return new Message( "OBOPS/AOD" );
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

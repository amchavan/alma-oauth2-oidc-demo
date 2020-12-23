package alma.obops.test.oidcresourceserver;

import java.util.Date;
import java.util.Map;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author amchavan from the Spring Security 5.x samples
 */
@RestController
public class OAuth2ResourceServerController {

	@GetMapping("/now")
	public Object index() {
		var now = new Date();
		return Map.of( "now", now.toString() );
	}
}

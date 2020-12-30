package alma.obops.test.oidcresourceserver;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.util.Map;

/**
 * @author amchavan
 */
@RestController
@CrossOrigin
public class MainController {

	final private TimeService timeService;

	public MainController( @Autowired TimeService timeService ) {
		this.timeService = timeService;
	}

	/**
	 * Return the current datetime in the given timezone, ISO format: {@code 2020-10-09T12:06:31.23133}<br>
	 *     Request parameter {@code timezone} defaults to {@code UTC}.
	 *
	 * Call example:
	 * {@code curl -u user:passwd http://localhost:10020/angular-spring-seed/service/api/datetime?timezone=Europe/Paris}
	 */
	@GetMapping( value = "/datetime" )
	public Object doDatetime( @RequestParam( name = "timezone", defaultValue = "UTC" ) String timeZone,
							  HttpServletResponse response ) {
		try {
			final var datetime = timeService.currentTime(timeZone);
			return Map.of( "datetime", datetime, "timezone", timeZone );
		}
		catch (Exception e) {
			response.setStatus( HttpServletResponse.SC_BAD_REQUEST );
			return "Invalid timezone='" + timeZone + "'";
		}
	}
}

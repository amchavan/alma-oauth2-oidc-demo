package alma.obops.test.oidcresourceserver;

import org.springframework.stereotype.Component;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

/**
 * @author amchavan 09-Oct-2020
 */
@Component
public class TimeService {

    /**
     * @param timeZone A string like <code>Europe/Berlin</code>
     * @return The current system time in the given timezone, ISO format, like {@code 2020-10-09T13:12:58.433693}
     * @throws IllegalArgumentException If timeZone is invalid
     */
    public String currentTime( String timeZone ) {

        try {
            ZoneId zoneId = ZoneId.of( timeZone );
            return ZonedDateTime.now( zoneId )
                                .truncatedTo( ChronoUnit.SECONDS )
                                .format( DateTimeFormatter.ISO_LOCAL_DATE_TIME );
        }
        catch (Exception e) {
            throw new IllegalArgumentException( e.getMessage() );
        }
    }
}

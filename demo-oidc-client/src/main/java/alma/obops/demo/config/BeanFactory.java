package alma.obops.demo.config;

import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.session.HttpSessionEventPublisher;

@Configuration
public class BeanFactory {

	@Bean
	public ServletListenerRegistrationBean<HttpSessionEventPublisher> httpSessionEventPublisher() {
		return new ServletListenerRegistrationBean<>(new HttpSessionEventPublisher());
	}

	@Bean
	public SecurityContextLogoutHandler securityContextLogoutHandler() {
	  return new SecurityContextLogoutHandler();
	}
}



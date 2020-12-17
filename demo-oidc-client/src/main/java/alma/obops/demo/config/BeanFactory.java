package alma.obops.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.session.HttpSessionEventPublisher;

import java.util.ArrayList;
import java.util.Collection;

@Configuration
public class BeanFactory {

	@Autowired
	UserDetailsService userDetailsService;

	@Bean
	public ServletListenerRegistrationBean<HttpSessionEventPublisher> httpSessionEventPublisher() {
		return new ServletListenerRegistrationBean<>(new HttpSessionEventPublisher());
	}

	@Bean
	public UserDetailsService userDetailsService() {
		return SimpleUserDetails::new;
	}

	@Bean
	public SecurityContextLogoutHandler securityContextLogoutHandler() {
	  return new SecurityContextLogoutHandler();
	}
}


class SimpleUserDetails implements UserDetails {

	private static final long serialVersionUID = 1L;
	private final String username;
	
	public SimpleUserDetails( String username ) {
		this.username = username;
	}
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		ArrayList<GrantedAuthority> authorities = new ArrayList<>();
		authorities.add( new SimpleGrantedAuthority( "ROLE_ADMIN" ));
		return authorities;
	}

	@Override
	public String getPassword() {
		return "";
	}

	@Override
	public String getUsername() {
		return this.username;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}
	
}

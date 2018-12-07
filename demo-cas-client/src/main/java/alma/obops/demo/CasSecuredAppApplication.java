package alma.obops.demo;

import java.util.ArrayList;
import java.util.Collection;

import javax.servlet.http.HttpSessionEvent;

import org.jasig.cas.client.session.SingleSignOutFilter;
import org.jasig.cas.client.session.SingleSignOutHttpSessionListener;
import org.jasig.cas.client.validation.Cas30ServiceTicketValidator;
import org.jasig.cas.client.validation.TicketValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.context.event.EventListener;
import org.springframework.security.cas.ServiceProperties;
import org.springframework.security.cas.authentication.CasAssertionAuthenticationToken;
import org.springframework.security.cas.authentication.CasAuthenticationProvider;
import org.springframework.security.cas.web.CasAuthenticationEntryPoint;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsByNameServiceWrapper;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;

@SpringBootApplication
public class CasSecuredAppApplication {

	private static final String CAS_SERVER_URL = "https://ma24088.ads.eso.org:8019";
	@Autowired
	UserDetailsService userDetailsService;
	
	public static void main(String[] args) {
//		System.out.println( ">>> HERE" );
		SpringApplication.run(CasSecuredAppApplication.class, args);
	}

	@Bean
	public ServiceProperties serviceProperties() {
	  ServiceProperties serviceProperties = new ServiceProperties();
	  serviceProperties.setService("http://localhost:9002/login/cas");
	  serviceProperties.setSendRenew(false);
	  return serviceProperties;
	}

	@Bean
	@Primary
	public AuthenticationEntryPoint authenticationEntryPoint(ServiceProperties sP) {
	  CasAuthenticationEntryPoint entryPoint = new CasAuthenticationEntryPoint();
		entryPoint.setLoginUrl(CAS_SERVER_URL + "/cas/login");
		entryPoint.setServiceProperties(sP);
	  return entryPoint;
	}

	@Bean
	public TicketValidator ticketValidator() {
		return new Cas30ServiceTicketValidator(CAS_SERVER_URL + "/cas");
	}

	@Bean
	public CasAuthenticationProvider casAuthenticationProvider() {
		
	  CasAuthenticationProvider provider = new CasAuthenticationProvider();
	  provider.setServiceProperties(serviceProperties());
	  provider.setTicketValidator(ticketValidator());
	  UserDetailsByNameServiceWrapper<CasAssertionAuthenticationToken> t = 
			  new UserDetailsByNameServiceWrapper<CasAssertionAuthenticationToken>(userDetailsService);
	  provider.setAuthenticationUserDetailsService( t );
	  provider.setKey("CAS_PROVIDER_LOCALHOST_9002");
	  return provider;
	}

	@Bean
	public UserDetailsService userDetailsService() {
		return new UserDetailsService() {

			@Override
			public UserDetails loadUserByUsername( String username ) throws UsernameNotFoundException {
				UserDetails ret = new SimpleUserDetails( username );
				return ret;
			}	
		};
	}

	@Bean
	public SecurityContextLogoutHandler securityContextLogoutHandler() {
	  return new SecurityContextLogoutHandler();
	}

	@Bean
	public LogoutFilter logoutFilter() {
	  LogoutFilter logoutFilter = new LogoutFilter(
			  CAS_SERVER_URL + "/cas/logout", securityContextLogoutHandler());
	  logoutFilter.setFilterProcessesUrl("/logout/cas");
	  return logoutFilter;
	}

	@Bean
	public SingleSignOutFilter singleSignOutFilter() {
	  SingleSignOutFilter singleSignOutFilter = new SingleSignOutFilter();
	  singleSignOutFilter.setCasServerUrlPrefix( CAS_SERVER_URL + "/cas" );
	  singleSignOutFilter.setIgnoreInitConfiguration(true);
	  return singleSignOutFilter;
	}

	@EventListener
	public SingleSignOutHttpSessionListener singleSignOutHttpSessionListener(HttpSessionEvent event) {
	  return new SingleSignOutHttpSessionListener();
	}
}


class SimpleUserDetails implements UserDetails {

	private static final long serialVersionUID = 1L;
	private String username;
	
	public SimpleUserDetails( String username ) {
		this.username = username;
	}
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		ArrayList<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
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
package alma.obops.demo.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = "/secured")
public class SecuredPageController {

    @GetMapping
    public String index(ModelMap modelMap) {
      Authentication auth = SecurityContextHolder.getContext().getAuthentication();
      if( auth != null && auth.getPrincipal() != null ) {
        modelMap.put("username", auth.getPrincipal() );
      }
      return "secure/index";
    }
}

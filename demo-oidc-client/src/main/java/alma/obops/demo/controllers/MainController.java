package alma.obops.demo.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;

/**
 * @author amchavan, 17-Dec-2020
 */
@Controller
public class MainController {

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping(value = "/secured")
    public String index(ModelMap modelMap) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if( auth != null && auth.getPrincipal() != null ) {
            modelMap.put("username", auth.getPrincipal() );
        }
        return "secure/index";
    }

    @GetMapping("/logout")
    public String logout( HttpServletRequest request ) throws ServletException {
      request.logout();
      return "auth/logout";
    }
}

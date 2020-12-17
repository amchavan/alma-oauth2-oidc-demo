package alma.obops.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;

/**
 * @author amchavan, 17-Dec-2020
 */
@Controller
public class AuthController {

    @GetMapping("/logout")
    public String logout( HttpServletRequest request ) throws ServletException {
      request.logout();
      return "auth/logout";
    }

    @GetMapping("/login")
    public String login() {
        return "redirect:/secured";
    }

}

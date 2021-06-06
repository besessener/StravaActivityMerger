package me.strava.activitymerger.authentication


import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.view.RedirectView

@RestController()
class AuthenticationApi {

    @Autowired
    AuthentificationHandler authentificationHandler

    @GetMapping("authentification")
    RedirectView getOAuthRedirect() {
        new RedirectView(authentificationHandler.getStravaAuthentificationUrl())
    }

    @GetMapping("exchangeToken")
    RedirectView getExchangeToken(
            @RequestParam(required = false) String state,
            @RequestParam(required = true) String code,
            @RequestParam(required = true) String scope) {
        new RedirectView("activitymerger?token=${authentificationHandler.getAuthToken(code)}")
    }
}

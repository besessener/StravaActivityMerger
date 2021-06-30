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

    @GetMapping("exchangeToken")
    def getExchangeToken(@RequestParam(required = true) String code) {
        //["token": authentificationHandler.getAuthToken(code)]
        ["token": "1234567890"] //TODO
    }
}

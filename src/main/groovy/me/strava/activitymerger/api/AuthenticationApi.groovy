package me.strava.activitymerger.api


import me.strava.activitymerger.handler.AuthentificationHandler
import me.strava.activitymerger.helper.Secrets
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController()
class AuthenticationApi {

    @Autowired
    AuthentificationHandler authentificationHandler

    @Autowired
    Secrets secrets

    @GetMapping("exchangeToken")
    def getExchangeToken(@RequestParam(required = true) String code) {
        ["token": authentificationHandler.getAuthToken(code)]
    }
    @GetMapping("googleApiToken")
    def getGoogleApiKey() {
        ["key": secrets.getSecret('google_api_key')]
    }
}

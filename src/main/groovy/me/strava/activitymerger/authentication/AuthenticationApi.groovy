package me.strava.activitymerger.authentication

import org.openapitools.model.ActivityStats
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController("rest")
class AuthenticationApi {

    @GetMapping("authentification")
    def getMyActivities() {
        new ActivityStats()
    }
}

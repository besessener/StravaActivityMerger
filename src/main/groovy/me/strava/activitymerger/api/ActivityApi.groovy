package me.strava.activitymerger.api


import io.swagger.client.ApiException
import io.swagger.client.api.ActivitiesApi
import me.strava.activitymerger.handler.ActivityHandler
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController()
class ActivityApi extends BaseApiClient {

    @Autowired
    ActivityHandler activityHandler

    @GetMapping("activityList")
    Object getActivities(
            @RequestParam(required = true) String token) {
        return activityHandler.getActivities(getApiClient(token))
    }
}

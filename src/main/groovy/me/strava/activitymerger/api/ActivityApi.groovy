package me.strava.activitymerger.api


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

    @GetMapping("merge")
    Object mergeActivities(
            @RequestParam(required = true) String token,
            @RequestParam(required = true) String mergeIds,
            @RequestParam(required = true) Integer start) {
        return activityHandler.mergeActivities(getApiClient(token), mergeIds.split(',')*.toLong(), start)
    }
}

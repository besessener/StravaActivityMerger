package me.strava.activitymerger.api


import me.strava.activitymerger.handler.ActivityHandler
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
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

    @PostMapping("merge")
    Object mergeActivities(
            @RequestBody Map<String, Object> body) {
        String token = body.token
        HashMap<String, Integer> mergeItems = body.mergeItems as HashMap<String, Integer>
        return activityHandler.mergeActivities(getApiClient(token), mergeItems)
    }
}

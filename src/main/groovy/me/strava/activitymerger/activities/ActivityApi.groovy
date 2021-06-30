package me.strava.activitymerger.activities


import io.swagger.client.ApiClient
import io.swagger.client.api.ActivitiesApi
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController()
class ActivityApi {

    ApiClient getApiClient(String token) {
        ApiClient apiClient = new ApiClient()
        apiClient.setAccessToken(token)
        apiClient
    }

    @GetMapping("activityList")
    Object getActivities(
            @RequestParam(required = true) String token) {
        //new ActivitiesApi(getApiClient(token)).getLoggedInAthleteActivities(System.currentTimeSeconds().toInteger(), 0, 1, 30)
        ["activities": [["id": 1, "type": "ride"], ["id": 2, "type": "walk"]]] //TODO
    }
}

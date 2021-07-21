package me.strava.activitymerger.activities


import io.swagger.client.ApiException
import io.swagger.client.api.ActivitiesApi
import me.strava.activitymerger.base.BaseApiClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController()
class ActivityApi extends BaseApiClient {

    @GetMapping("activityList")
    Object getActivities(
            @RequestParam(required = true) String token) {
        def response
        for (int i = 0; i < 10; i++) {
            try {
                return new ActivitiesApi(getApiClient(token)).getLoggedInAthleteActivities(System.currentTimeSeconds().toInteger(), 0, 1, 30)
            } catch (ApiException e) {
                println(e.message)
                return [message: e.message]
            } catch (exception) {
                exception.printStackTrace()
                sleep(1 * 1000)
            }
        }

        return response
    }
}

package me.strava.activitymerger.handler

import io.swagger.client.ApiClient
import io.swagger.client.ApiException
import io.swagger.client.api.ActivitiesApi
import org.springframework.stereotype.Component

@Component
class ActivityHandler {

    def getActivities(ApiClient apiClient) {
        def response;
        for (int i = 0; i < 10; i++) {
            try {
                return new ActivitiesApi(apiClient).getLoggedInAthleteActivities(System.currentTimeSeconds().toInteger(), 0, 1, 30)
            } catch (ApiException e) {
                println(e.message)
                return [message: e.message]
            } catch (exception) {
                exception.printStackTrace()
                sleep(1 * 1000)
            }
        }

        response
    }
}

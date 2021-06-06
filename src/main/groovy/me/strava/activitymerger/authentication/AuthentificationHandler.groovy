package me.strava.activitymerger.authentication


import groovyx.net.http.HTTPBuilder
import me.strava.activitymerger.helper.AppConstants
import org.springframework.stereotype.Component

@Component
class AuthentificationHandler {

    String getStravaAuthentificationUrl() {
        "${AppConstants.STRAVA_BASE_URL}oauth/authorize?client_id=${AppConstants.getSecret('client_id')}&response_type=code&redirect_uri=${AppConstants.STRAVA_REDIRECT_URL}&approval_prompt=force&scope=activity:read_all"
    }

    String getAuthToken(String exchangeToken) {
        def accessToken = ''
        def http = new HTTPBuilder(AppConstants.STRAVA_BASE_URL)
        http.post(
                path: '/oauth/token',
                body: [
                        client_id    : AppConstants.getSecret('client_id'),
                        client_secret: AppConstants.getSecret('client_secret'),
                        grant_type   : "authorization_code",
                        code         : exchangeToken
                ]) { resp, reader ->
            println resp.status
            accessToken = reader.access_token
        }

        accessToken
    }
}

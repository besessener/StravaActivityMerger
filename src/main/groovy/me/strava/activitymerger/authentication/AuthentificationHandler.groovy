package me.strava.activitymerger.authentication


import groovyx.net.http.HTTPBuilder
import me.strava.activitymerger.helper.AppConstants
import me.strava.activitymerger.helper.Secrets
import org.apache.http.impl.client.HttpClientBuilder
import org.apache.http.impl.client.LaxRedirectStrategy
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class AuthentificationHandler {

    @Autowired
    Secrets secrets

    String getStravaAuthentificationUrl() {
        "${AppConstants.STRAVA_BASE_URL}oauth/authorize?client_id=${secrets.getSecret('client_id')}&response_type=code&redirect_uri=${AppConstants.STRAVA_REDIRECT_URL}&approval_prompt=force&scope=activity:read_all"
    }

    String getAuthToken(String exchangeToken) {
        def accessToken = ''
        def http = new HTTPBuilder(AppConstants.STRAVA_BASE_URL)
        def httpClient = new HttpClientBuilder()
        httpClient.setRedirectStrategy(LaxRedirectStrategy.newInstance())
        http.client = httpClient.build()
        http.post(
                path: '/oauth/token',
                body: [
                        client_id    : secrets.getSecret('client_id'),
                        client_secret: secrets.getSecret('client_secret'),
                        grant_type   : "authorization_code",
                        code         : exchangeToken
                ]) { resp, reader ->
            println resp.status
            accessToken = reader.access_token
        }

        accessToken
    }
}

package me.strava.activitymerger.handler


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

    HTTPBuilder http

    AuthentificationHandler() {
        http = new HTTPBuilder(AppConstants.STRAVA_BASE_URL)
    }

    String getAuthToken(String exchangeToken) {
        def accessToken = ''
        def httpClient = new HttpClientBuilder()
        httpClient.setRedirectStrategy(LaxRedirectStrategy.newInstance())
        http.client = httpClient.build()
        http.post(
                path: '/oauth/token',
                body: [
                        client_id    : secrets.getSecret(AppConstants.SECRET_STRAVA_CLIENT_ID),
                        client_secret: secrets.getSecret(AppConstants.SECRET_STRAVA_CLIENT_SECRET),
                        grant_type   : "authorization_code",
                        code         : exchangeToken
                ]) { resp, reader ->
            println resp.status
            accessToken = reader.access_token
        }

        accessToken
    }
}

package me.strava.activitymerger.api

import io.swagger.client.ApiClient

class BaseApiClient {
    protected ApiClient getApiClient(String token) {
        ApiClient apiClient = new ApiClient()
        apiClient.setAccessToken(token)
        apiClient
    }
}

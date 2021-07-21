package me.strava.activitymerger.gpx

import io.swagger.client.ApiClient
import io.swagger.client.api.ActivitiesApi
import io.swagger.client.api.RoutesApi
import io.swagger.client.model.DetailedActivity
import org.springframework.stereotype.Component

@Component
class GpxHandler {
    DetailedActivity merge(ApiClient apiClient, ArrayList<Integer> routeIds) {
        File tempDir = File.createTempFile("temp", ".scrap")

        routeIds.each { downloadGpx(apiClient, tempDir, it) }
        mergeGpx(tempDir, routeIds)


        tempDir.deleteDir()
    }

    void downloadGpx(ApiClient apiClient, File tempFile, int routeId) {
        new RoutesApi(apiClient).getRouteAsGPX()
    }

    void mergeGpx(File tempFile, ArrayList<Integer> routeIds) {}
}

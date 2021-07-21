package me.strava.activitymerger.gpx

import io.swagger.client.model.DetailedActivity
import me.strava.activitymerger.base.BaseApiClient
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController()
class GpxApi extends BaseApiClient {

    @Autowired
    GpxHandler gpxHandler

    @GetMapping("merge")
    DetailedActivity merge(
    @RequestParam(required = true) String token,
    @RequestParam(required = true) String routeIds) {
        def routes = routeIds.split(',')*.toInteger()
        gpxHandler.merge(getApiClient(token), routes)
    }
}

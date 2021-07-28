package me.strava.activitymerger.api


import me.strava.activitymerger.handler.ActivityHandler
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.io.ByteArrayResource
import org.springframework.core.io.Resource
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths

@RestController()
class ActivityApi extends BaseApiClient {

    @Autowired
    ActivityHandler activityHandler

    @GetMapping("activityList")
    Object getActivities(
            @RequestParam(required = true) String token) {
        return activityHandler.getActivities(getApiClient(token))
    }

    @GetMapping("downloadGpx")
    ResponseEntity<Resource> downloadGpx(
            @RequestParam(required = true) String token,
            @RequestParam(required = true) String name,
            @RequestParam(required = true) String type,
            @RequestParam(required = true) String id,
            @RequestParam(required = true) Integer time) {
        File file = activityHandler.getGpxFile(getApiClient(token), id, name, type, time)
        ByteArrayResource resource = new ByteArrayResource(Files.readAllBytes(file.toPath()))

        HttpHeaders headers = new HttpHeaders()
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=${name}_${id}.gpx")
        headers.add("Cache-Control", "no-cache, no-store, must-revalidate")
        headers.add("Pragma", "no-cache")
        headers.add("Expires", "0")

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(file.length())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource)
    }

    @PostMapping("merge")
    Object mergeActivities(
            @RequestBody Map<String, Object> body) {
        String token = body.token
        String type = body.type
        HashMap<String, Integer> mergeItems = body.mergeItems as HashMap<String, Integer>
        return activityHandler.mergeActivities(getApiClient(token), mergeItems, type)
    }
}

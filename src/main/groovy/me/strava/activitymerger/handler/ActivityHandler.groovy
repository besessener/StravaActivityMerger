package me.strava.activitymerger.handler

import groovy.transform.Canonical
import groovy.xml.MarkupBuilder
import io.swagger.client.ApiClient
import io.swagger.client.ApiException
import io.swagger.client.api.ActivitiesApi
import io.swagger.client.api.StreamsApi
import io.swagger.client.api.UploadsApi
import io.swagger.client.model.StreamSet
import me.strava.activitymerger.api.ActivityApi
import org.springframework.stereotype.Component

import java.time.Instant
import java.time.temporal.ChronoUnit

@Component
class ActivityHandler {

    final static String NEW_ACTIVITY_NAME = 'New Merged Activity'

    @Canonical
    class StreamData {
        long id
        int time
        int startTime
        float latitude
        float longitude
        float altitude
    }

    def getActivities(ApiClient apiClient) {
        def response
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

    Object mergeActivities(ApiClient apiClient, HashMap<String, Integer> mergeItems) {
        def values = createStreamDataMap(new StreamsApi(apiClient), mergeItems)
        def gpx = createGpx(values)
        createNewActivity(new UploadsApi(apiClient), new ActivitiesApi(apiClient), gpx)
        [status: 'OK']
    }

    ArrayList<StreamData> createStreamDataMap(StreamsApi streamsApi, HashMap<String, Integer> mergeItems) {
        ArrayList<StreamData> data = []
        mergeItems.each { activityId, startTime ->
            StreamSet streamSet = streamsApi.getActivityStreams(activityId as long, ['latlng', 'altitude', 'time'], true)

            def altitudes = streamSet.getAltitude().getData()
            def latLong = streamSet.getLatlng().getData()
            def times = streamSet.getTime().getData()

            for (int i = 0; i < times.size(); i++) {
                StreamData streamData = new StreamData()
                streamData.id = activityId as long
                streamData.time = times[i]
                streamData.startTime = startTime
                streamData.altitude = altitudes[i]
                streamData.latitude = latLong[i][0]
                streamData.longitude = latLong[i][1]
                data << streamData
            }
        }

        return data.sort { it.time }
    }

    String createGpx(ArrayList<StreamData> streamData) {
        def stringWriter = new StringWriter()
        def gpxBuilder = new MarkupBuilder(stringWriter)

        gpxBuilder.mkp.xmlDeclaration(version: "1.0", encoding: "utf-8")
        gpxBuilder.gpx() {
            metadata() {
                time(calcTime(0, streamData.isEmpty() ? 0 : streamData.sort{it.startTime}[0].startTime))
            }
            trk() {
                name(NEW_ACTIVITY_NAME)
                type(1)
                trkseg() {
                    for (def item : streamData) {
                        trkpt(lat: item.latitude, lon: item.longitude) {
                            ele(item.altitude)
                            time(calcTime(item.time, item.startTime))
                        }
                    }
                }
            }
        }

        stringWriter.toString()
    }

    private String calcTime(int offset, start) {
        Instant instant = Instant.ofEpochSecond(start).truncatedTo( ChronoUnit.SECONDS )
        instant.plusSeconds(offset.toInteger()).toString()
    }

    def createNewActivity(UploadsApi api, ActivitiesApi activitiesApi, String gpx) {
        File tmpFile = File.createTempFile("merged_activity_gpx_",".gpx")
        tmpFile.write(gpx)
        try {
            api.createUpload(tmpFile, NEW_ACTIVITY_NAME, '', '', '', 'gpx', tmpFile.name)
            boolean created = false
            for (def i : (1..3)) {
                sleep(3 * 1000)
                try {
                    def found = activitiesApi
                            .getLoggedInAthleteActivities(System.currentTimeSeconds().toInteger(), 0, 1, 30)
                            .find{it.getExternalId() == tmpFile.name}
                    if (found) break
                } catch (ApiException e) {
                    println e.responseBody
                }
            }
        } catch (ApiException e) {
            println e.responseBody
        }
    }
}

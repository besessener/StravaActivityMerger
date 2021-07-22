package me.strava.activitymerger.handler

import groovy.transform.Canonical
import groovy.xml.MarkupBuilder
import io.swagger.client.ApiClient
import io.swagger.client.ApiException
import io.swagger.client.api.ActivitiesApi
import io.swagger.client.api.StreamsApi
import io.swagger.client.model.StreamSet
import org.springframework.stereotype.Component

import java.time.Instant
import java.time.temporal.ChronoUnit

@Component
class ActivityHandler {

    @Canonical
    class StreamData {
        int id
        int time
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

    Object mergeActivities(ApiClient apiClient, ArrayList<Long> mergeIds, Integer start) {
        def values = createStreamDataMap(new StreamsApi(apiClient), mergeIds)
        def gpx = createGpx(values, start)
        [status: 'OK']
    }

    ArrayList<StreamData> createStreamDataMap(StreamsApi streamsApi, ArrayList<Long> mergeIds) {
        ArrayList<StreamData> data = []
        mergeIds.collect { activityId ->
            StreamSet streamSet = streamsApi.getActivityStreams(activityId, ['latlng', 'altitude', 'time'], true)

            def altitudes = streamSet.getAltitude().getData()
            def latLong = streamSet.getLatlng().getData()
            def times = streamSet.getTime().getData()

            for (int i = 0; i < times.size(); i++) {
                StreamData streamData = new StreamData()
                streamData.id = activityId
                streamData.time = times[i]
                streamData.altitude = altitudes[i]
                streamData.latitude = latLong[i][0]
                streamData.longitude = latLong[i][1]
                data << streamData
            }
        }

        return data.sort { it.time }
    }

    String createGpx(ArrayList<StreamData> streamData, Integer start) {
        def stringWriter = new StringWriter()
        def gpxBuilder = new MarkupBuilder(stringWriter)

        gpxBuilder.mkp.xmlDeclaration(version: "1.0", encoding: "utf-8")
        gpxBuilder.gpx() {
            trk() {
                trkseg() {
                    for (def item : streamData) {
                        trkpt(lat: item.latitude, lon: item.longitude) {
                            ele(item.altitude)
                            time(calcTime(item.time, start))
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
}

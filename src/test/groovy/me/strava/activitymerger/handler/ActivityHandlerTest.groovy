package me.strava.activitymerger.handler

import io.swagger.client.ApiClient
import io.swagger.client.ApiException
import io.swagger.client.api.ActivitiesApi
import io.swagger.client.api.StreamsApi
import io.swagger.client.api.UploadsApi
import io.swagger.client.model.*
import me.strava.activitymerger.WebService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification

@SpringBootTest(classes = WebService.class)
class ActivityHandlerTest extends Specification {

    @Autowired
    ActivityHandler activityHandler

    def "getActivities : retry on exception"() {
        given:
            def counter = 0
            GroovyStub(ActivitiesApi.class, global: true)
            new ActivitiesApi(_) >> {
                counter++
                throw new Exception()
            }

        when:
            activityHandler.getActivities(new ApiClient())

        then:
            10 == counter
    }

    def "getActivities : error returned on ApiException"() {
        given:
            GroovyStub(ActivitiesApi.class, global: true)
            new ActivitiesApi(_) >> {
                throw new ApiException('some new error')
            }

        when:
            def res = activityHandler.getActivities(new ApiClient())

        then:
            [message: 'some new error'] == res
    }

    def "merge returns 'OK'"() {
        expect:
            activityHandler.mergeActivities(new ApiClient(), [:], 'RIDE') == [status: 'OK']
    }

    def "test get stream data from list of ids with empty input"() {
        expect:
            activityHandler.createStreamDataMap(new StreamsApi(), [:]) == [:] as HashMap<String, ArrayList<ActivityHandler.StreamData>>
    }

    def "get streams with mocked streamset but return data"() {
        given:
            def altMock = Mock(AltitudeStream)
            def latlngMock = Mock(LatLngStream)
            def timeMock = Mock(TimeStream)

            altMock.getData() >> [90.5, 90.6]
            def latlng1 = new LatLng()
            latlng1[0] = 12.0
            latlng1[1] = 9.5
            def latlng2 = new LatLng()
            latlng2[0] = 13.1
            latlng2[1] = 9.5
            latlngMock.getData() >> [latlng1, latlng2]
            timeMock.getData() >> [1, 3]

            def actStreamSet = Mock(StreamSet)
            actStreamSet.getAltitude() >> altMock
            actStreamSet.getLatlng() >> latlngMock
            actStreamSet.getTime() >> timeMock

            StreamsApi streamsApi = Mock(StreamsApi)
            streamsApi.getActivityStreams(_, _, _) >> actStreamSet

        when:
            def result = activityHandler.createStreamDataMap(streamsApi, ['123': 0])

        then:
            result.size() == 1
            result.get('123').size() == 2
            result.get('123')[0].startTime == 0
            result.get('123')[0].id == 123
            result.get('123')[1].id == 123 // to stream entries for one id
            result.get('123')[0].time == 1
            result.get('123')[1].time == 3
            result.get('123')[0].latitude == 12.0 as float
            result.get('123')[1].latitude == 13.1 as float
            result.get('123')[0].longitude == 9.5 as float
            result.get('123')[1].longitude == 9.5 as float
            result.get('123')[0].altitude == 90.5 as float
            result.get('123')[1].altitude == 90.6 as float
    }

    def "test gpx creation"() {
        given:
            def altMock = Mock(AltitudeStream)
            def latlngMock = Mock(LatLngStream)
            def timeMock = Mock(TimeStream)

            altMock.getData() >> [90.5, 90.6]
            def latlng1 = new LatLng()
            latlng1[0] = 12.0
            latlng1[1] = 9.5
            def latlng2 = new LatLng()
            latlng2[0] = 13.1
            latlng2[1] = 9.5
            latlngMock.getData() >> [latlng1, latlng2]
            timeMock.getData() >> [1, 3]

            def actStreamSet = Mock(StreamSet)
            actStreamSet.getAltitude() >> altMock
            actStreamSet.getLatlng() >> latlngMock
            actStreamSet.getTime() >> timeMock

            StreamsApi streamsApi = Mock(StreamsApi)
            streamsApi.getActivityStreams(_, _, _) >> actStreamSet

        when:
            def result = activityHandler.createStreamDataMap(streamsApi, ['123': 60])
            def gpx = activityHandler.createGpx(result, 'RIDE')
            def gpxRoot = new XmlSlurper().parseText(gpx)

        then:
            gpx.contains("<?xml version='1.0' encoding='utf-8'?>")
            gpxRoot
            gpxRoot.trk.size() == 1
            gpxRoot.trk.trkseg.size() == 1
            gpxRoot.trk.trkseg.trkpt.size() == 2

            gpxRoot.metadata.time.text() == "1970-01-01T00:01:00Z"

            gpxRoot.trk.name.text() != ""
            gpxRoot.trk.type.text() == "1"

            gpxRoot.trk.trkseg.trkpt[0].@lat == "12.0"
            gpxRoot.trk.trkseg.trkpt[0].@lon == "9.5"
            gpxRoot.trk.trkseg.trkpt[1].@lat == "13.1"
            gpxRoot.trk.trkseg.trkpt[1].@lon == "9.5"

            gpxRoot.trk.trkseg.trkpt[0].ele.text() == "90.5"
            gpxRoot.trk.trkseg.trkpt[1].ele.text() == "90.6"

            gpxRoot.trk.trkseg.trkpt[0].time.text() == "1970-01-01T00:01:01Z"
            gpxRoot.trk.trkseg.trkpt[1].time.text() == "1970-01-01T00:01:03Z"
    }

    def "test activity creation"() {
        given:
            UploadsApi api = Mock(UploadsApi)
            ActivitiesApi actApi = Mock(ActivitiesApi)
            Upload upload = Mock(Upload)
            upload.setActivityId(1)

        when:
            activityHandler.createNewActivity(api, actApi, '<gpx />')

        then:
            1 * api.createUpload(_, 'New Merged Activity', '', '', '', 'gpx', _) >> { upload }
            1 * actApi.getLoggedInAthleteActivities(_, 0, 1, 30) >> { throw new ApiException() }
            2 * actApi.getLoggedInAthleteActivities(_, 0, 1, 30) >> new ArrayList<SummaryActivity>()
    }
}

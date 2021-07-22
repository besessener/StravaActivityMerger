package me.strava.activitymerger.handler

import io.swagger.client.ApiClient
import io.swagger.client.ApiException
import io.swagger.client.api.ActivitiesApi
import me.strava.activitymerger.WebService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

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
}

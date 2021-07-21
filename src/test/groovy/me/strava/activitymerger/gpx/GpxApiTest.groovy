package me.strava.activitymerger.gpx

import groovy.json.JsonBuilder
import io.swagger.client.api.ActivitiesApi
import io.swagger.client.model.DetailedActivity
import me.strava.activitymerger.WebService
import org.spockframework.spring.SpringBean
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.web.servlet.MockMvc
import spock.lang.Specification

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@AutoConfigureMockMvc
@SpringBootTest(classes = WebService.class)
class GpxApiTest extends Specification {

    @Autowired
    private MockMvc mvc

    @SpringBean
    GpxHandler gpxHandler = Mock()

    def "/merge?token=&routeIds : is accessible and returns 200"() {
        given:
            gpxHandler.merge(_, [54, 68, 101]) >> new DetailedActivity()

        when:
            def response = mvc.perform(get('/merge').param('token', '123').param('routeIds', '54,68,101'))
                    .andExpect(status().isOk())
                    .andReturn()
                    .response
                    .contentAsString

        then:
            new groovy.json.JsonSlurper().parseText(new JsonBuilder(new DetailedActivity()).toString()) == new groovy.json.JsonSlurper().parseText(response)
    }
}

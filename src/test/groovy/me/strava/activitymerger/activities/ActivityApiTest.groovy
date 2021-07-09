package me.strava.activitymerger.activities

import io.swagger.client.api.ActivitiesApi
import me.strava.activitymerger.WebService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.web.servlet.MockMvc
import spock.lang.Specification

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@AutoConfigureMockMvc
@SpringBootTest(classes = WebService.class)
class ActivityApiTest extends Specification {
    @Autowired
    private MockMvc mvc

    def "/activityList?token : is accessible and returns 200"() {
        given:
            GroovyStub(ActivitiesApi.class, global: true) {
                getLoggedInAthleteActivities(_, _, _, _) >> []
            }

        when:
            def response = mvc.perform(get('/activityList').param('token', '123'))
                    .andExpect(status().isOk())
                    .andReturn()
                    .response
                    .contentAsString

        then:
            '[]' == response
    }

    def "/activityList : is accessible but fails with 400 without token parameter"() {
        given:
            GroovyStub(ActivitiesApi.class, global: true) {
                getLoggedInAthleteActivities(_, _, _, _) >> []
            }

        when:
            def res = mvc.perform(get('/activityList'))
                    .andExpect(status().isBadRequest())
                    .andReturn()
                    .response
                    .contentAsString

        then:
            '' == res
    }
}

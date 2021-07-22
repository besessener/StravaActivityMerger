package me.strava.activitymerger.api

import io.swagger.client.ApiClient
import io.swagger.client.ApiException
import io.swagger.client.api.ActivitiesApi
import me.strava.activitymerger.WebService
import me.strava.activitymerger.handler.ActivityHandler
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
class ActivityApiTest extends Specification {
    @Autowired
    private MockMvc mvc

    @SpringBean
    ActivityHandler activityHandler = Mock()

    def "/activityList?token : is accessible and returns 200"() {
        given:
            activityHandler.getActivities(_) >> [data: 'content']

        when:
            def response = mvc.perform(get('/activityList').param('token', '123'))
                    .andExpect(status().isOk())
                    .andReturn()
                    .response
                    .contentAsString

        then:
            '{"data":"content"}' == response
    }

    def "/activityList : is accessible but fails with 400 without token parameter"() {
        given:
            activityHandler.getActivities(null) >> []

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

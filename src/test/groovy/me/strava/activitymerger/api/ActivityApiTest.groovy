package me.strava.activitymerger.api

import groovy.json.JsonOutput
import me.strava.activitymerger.WebService
import me.strava.activitymerger.handler.ActivityHandler
import org.spockframework.spring.SpringBean
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import spock.lang.Specification

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
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


    def "/merge : is accessible and successful"() {
        given:
            def mergeItems = ['5': 1, '3': 0, '99': 2]
            activityHandler.mergeActivities(_, mergeItems, 'ride') >> '5438958345NewId'
            def mergeItemsAsJsonString = JsonOutput.prettyPrint(JsonOutput.toJson([token: '123', mergeItems: mergeItems, type: 'ride']))

        when:
            def res = mvc.perform(post('/merge').contentType(MediaType.APPLICATION_JSON).content(mergeItemsAsJsonString))
                    .andExpect(status().isOk())
                    .andReturn()
                    .response
                    .contentAsString

        then:
            '5438958345NewId' == res
    }

    def "/merge : is accessible but fails with 400 without token parameter"() {
        given:
            activityHandler.mergeActivities(_, _) >> []

        when:
            def res = mvc.perform(post('/merge'))
                    .andExpect(status().isBadRequest())
                    .andReturn()
                    .response
                    .contentAsString

        then:
            '' == res
    }
}

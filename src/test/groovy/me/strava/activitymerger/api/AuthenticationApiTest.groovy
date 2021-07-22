package me.strava.activitymerger.api


import me.strava.activitymerger.WebService
import me.strava.activitymerger.handler.AuthentificationHandler
import me.strava.activitymerger.helper.Secrets
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
class AuthenticationApiTest extends Specification {
    @Autowired
    private MockMvc mvc

    @SpringBean
    AuthentificationHandler authentificationHandler = Stub()

    @SpringBean
    Secrets secrets = Mock()

    def "/exchangeToken?code : is accessible and returns 200"() {
        given:
            def token = '123token'
            authentificationHandler.getAuthToken(_) >> token

        when:
            def response = mvc.perform(get('/exchangeToken').param('code', '123code'))
                    .andExpect(status().isOk())
                    .andReturn()
                    .response
                    .contentAsString

        then:
            "{\"token\":\"$token\"}" == response
    }

    def "/exchangeToken : is accessible but fails with 400 without code parameter"() {
        when:
            def res = mvc.perform(get('/exchangeToken'))
                    .andExpect(status().isBadRequest())
                    .andReturn()
                    .response
                    .contentAsString

        then:
            '' == res
    }

    def "/googleApiToken : is accessible and returns 200"() {
        given:
            secrets.getSecret(_) >> '123'

        when:
            def response = mvc.perform(get('/googleApiToken'))
                    .andExpect(status().isOk())
                    .andReturn()
                    .response
                    .contentAsString

        then:
            "{\"key\":\"123\"}" == response
    }
}

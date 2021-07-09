package me.strava.activitymerger.authentication

import groovyx.net.http.HTTPBuilder
import me.strava.activitymerger.WebService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification

@SpringBootTest(classes = WebService.class)
class AuthentificationHandlerTest extends Specification {

    @Autowired
    AuthentificationHandler authentificationHandler

    def "GetAuthToken"() {
        given:
            GroovyStub(HTTPBuilder.class, global: true) {
                post(_, _) >> { return }
            }

        expect:
            '' == authentificationHandler.getAuthToken("123authtoken")
    }
}

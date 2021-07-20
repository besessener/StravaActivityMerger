package me.strava.activitymerger.authentication

import groovyx.net.http.HTTPBuilder
import groovyx.net.http.HttpResponseException
import me.strava.activitymerger.WebService
import me.strava.activitymerger.helper.Secrets
import org.spockframework.spring.SpringBean
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification

@SpringBootTest(classes = WebService.class)
class AuthentificationHandlerTest extends Specification {

    @Autowired
    AuthentificationHandler authentificationHandler

    @SpringBean
    Secrets secrets = Mock()

    def "GetAuthToken throw exception"() {
        given:
            secrets.getSecret(_) >> 'secret'

        when:
            authentificationHandler.getAuthToken("123authtoken")

        then:
            thrown HttpResponseException // token is invalid
    }

    def "GetAuthToken success"() {
        given:
            secrets.getSecret(_) >> 'secret'
            authentificationHandler.http = Mock(HTTPBuilder)
            def closurePost = { println 'post' }

        when:
            authentificationHandler.getAuthToken("123authtoken")

        then:
            1 * authentificationHandler.http.post(_, _) >> closurePost()
    }
}

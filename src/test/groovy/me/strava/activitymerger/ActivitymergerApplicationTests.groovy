package me.strava.activitymerger


import me.strava.activitymerger.handler.AuthentificationHandler
import me.strava.activitymerger.helper.Secrets
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification

@SpringBootTest(classes = WebService.class)
class ActivitymergerApplicationTests extends Specification {

	@Autowired(required = false)
	AuthentificationHandler authentificationHandler

	@Autowired(required = false)
	Secrets secrets

	def "load context of app"() {
		expect:
			authentificationHandler
			secrets
	}

}

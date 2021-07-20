package me.strava.activitymerger.config

import org.springframework.web.servlet.config.annotation.CorsRegistration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import spock.lang.Specification

class DevCorsConfigurationTest extends Specification {
    def "add cors mapping does not fail"() {
        given:
            def mock = Mock(CorsRegistry)
            def mockReg = Mock(CorsRegistration)
            mockReg.allowedMethods(_) >> {new CorsRegistration('')}
            mock.addMapping(_) >> mockReg
        expect:
            new DevCorsConfiguration().addCorsMappings(mock)
    }
}

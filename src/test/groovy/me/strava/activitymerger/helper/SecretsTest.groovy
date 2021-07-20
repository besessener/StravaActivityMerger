package me.strava.activitymerger.helper

import groovy.json.JsonSlurper
import spock.lang.Specification

class SecretsTest extends Specification {
    def "get secrets"() {
        given:
            def secrets = new Secrets()

        expect:
            Secrets.secrets == null
            secrets.getSecret('confidential') == 'something hidden'
            Secrets.secrets == [confidential: 'something hidden']
    }

    def "get secrets when available"() {
        given:
            def secrets = new Secrets()
            Secrets.secrets = [confidential: 'something hidden']

        expect:
            Secrets.secrets == [confidential: 'something hidden']
            secrets.getSecret('confidential') == 'something hidden'
    }
}

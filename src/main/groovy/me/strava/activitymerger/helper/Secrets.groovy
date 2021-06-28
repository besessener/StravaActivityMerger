package me.strava.activitymerger.helper

import groovy.json.JsonSlurper
import org.springframework.stereotype.Component

@Component
class Secrets {
    static def secrets

    def getSecret(def key) {
        if (!secrets) {
            def secretsFile = new File(getClass().getResource('/.secrets').toURI())
            secrets = new JsonSlurper().parse(secretsFile)
        }

        secrets."$key"
    }
}

package me.strava.activitymerger.helper

import groovy.json.JsonSlurper
import org.springframework.stereotype.Component

@Component
class Secrets {
    static def secrets

    def getSecret(def key) {
        if (!secrets) {
            def secretsFile = new File(getSecretFilePath())
            secrets = new JsonSlurper().parseText(secretsFile.text)
        }

        secrets."$key"
    }

    private URI getSecretFilePath() {
        getClass().getResource('/.secrets').toURI()
    }
}

package me.strava.activitymerger.helper

import groovy.json.JsonSlurper

class AppConstants {
    static final String STRAVA_BASE_URL = 'http://www.strava.com/'
    static final String STRAVA_REDIRECT_URL = 'http://localhost/exchangeToken'

    static def secrets

    static def getSecret(def key) {
        if (!secrets) {
            def secretsFile = new File(getClass().getResource('/.secrets').toURI())
            secrets = new JsonSlurper().parse(secretsFile)
        }

        secrets."$key"
    }
}

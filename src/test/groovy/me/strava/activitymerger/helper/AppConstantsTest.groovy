package me.strava.activitymerger.helper

import spock.lang.Specification

class AppConstantsTest extends Specification {
    def "global variables exist"() {
        expect:
            AppConstants.STRAVA_BASE_URL
    }
}

package com.logikamobile.crm.application.ports.out

import java.time.Instant

interface AuthenticationPort {
    fun getOAuthLoginUrl(): String
    fun exchangeCodeForToken(code: String): AuthToken
}

interface CalendarPort {
    fun scheduleMeeting(title: String, startTime: Instant, endTime: Instant, attendees: List<String>): MeetingDetails
}

interface DrivePort {
    /**
     * Descarga el contenido del archivo de transcripción usando el ID proporcionado por el Webhook.
     */
    suspend fun downloadTranscriptContent(fileId: String): String
}

data class AuthToken(val accessToken: String, val refreshToken: String)
data class MeetingDetails(val eventId: String, val meetLink: String)

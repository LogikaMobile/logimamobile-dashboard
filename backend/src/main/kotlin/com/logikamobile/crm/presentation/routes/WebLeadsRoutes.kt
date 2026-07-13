package com.logikamobile.crm.presentation.routes

import com.logikamobile.crm.domain.models.LmaasWebLeadDto
import com.logikamobile.crm.domain.models.TraditionalWebLeadDto
import com.logikamobile.crm.infrastructure.database.WebLeadsRepository
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.webLeadsRoutes() {
    val repository = WebLeadsRepository()
    
    // In production, this should come from env vars
    val expectedApiKey = System.getenv("WEBHOOK_API_KEY") ?: "logika-web-key-123"

    route("/api/webhooks/leads") {
        
        post("/lmaas") {
            val apiKey = call.request.header("X-API-KEY")
            if (apiKey != expectedApiKey) {
                call.respond(HttpStatusCode.Unauthorized, mapOf("error" to "Invalid API Key"))
                return@post
            }

            val dto = try {
                call.receive<LmaasWebLeadDto>()
            } catch (e: Exception) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Invalid payload format"))
                return@post
            }

            // Honeypot check
            if (dto.websiteUrl.isNotEmpty()) {
                // Pretend it succeeded to fool the bot
                call.respond(HttpStatusCode.OK, mapOf("success" to true))
                return@post
            }

            val id = repository.createLmaasLead(dto)
            if (id != null) {
                call.respond(HttpStatusCode.OK, mapOf("success" to true, "id" to id))
            } else {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to "Failed to save lead"))
            }
        }

        post("/traditional") {
            val apiKey = call.request.header("X-API-KEY")
            if (apiKey != expectedApiKey) {
                call.respond(HttpStatusCode.Unauthorized, mapOf("error" to "Invalid API Key"))
                return@post
            }

            val dto = try {
                call.receive<TraditionalWebLeadDto>()
            } catch (e: Exception) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Invalid payload format"))
                return@post
            }

            // Honeypot check
            if (dto.websiteUrl.isNotEmpty()) {
                // Pretend it succeeded to fool the bot
                call.respond(HttpStatusCode.OK, mapOf("success" to true))
                return@post
            }

            val id = repository.createTraditionalLead(dto)
            if (id != null) {
                call.respond(HttpStatusCode.OK, mapOf("success" to true, "id" to id))
            } else {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to "Failed to save lead"))
            }
        }
    }
}

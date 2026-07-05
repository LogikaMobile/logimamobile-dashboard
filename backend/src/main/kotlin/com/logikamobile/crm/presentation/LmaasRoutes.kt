package com.logikamobile.crm.presentation

import com.logikamobile.crm.application.ports.out.LmaasRepositoryPort
import com.logikamobile.crm.domain.LmaasLead
import com.logikamobile.crm.domain.LmaasSubscription
import com.logikamobile.crm.domain.LmaasTicket
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.util.UUID

@kotlinx.serialization.Serializable
data class CreateLmaasLeadRequest(
    val companyName: String,
    val contactName: String,
    val emails: List<String>,
    val status: String,
    val tier: String,
    val billingCycle: String,
    val monthlyFee: Double,
    val annualizedValue: Double,
    val operatingCosts: Double
)

@kotlinx.serialization.Serializable
data class CreateLmaasTicketRequest(
    val subscriptionId: String,
    val title: String,
    val status: String,
    val estimatedHours: Int
)

@kotlinx.serialization.Serializable
data class LmaasLeadResponse(
    val lead: LmaasLead,
    val subscription: LmaasSubscription?
)

fun Route.lmaasRoutes(repository: LmaasRepositoryPort) {
    route("/api/v1/lmaas") {
        
        get("/leads") {
            val leads = repository.getAllLeads()
            val subscriptions = leads.mapNotNull { repository.getSubscriptionByLeadId(it.id) }
            // Para simplificar al frontend, enviamos los leads junto a sus suscripciones en un DTO
            val response = leads.map { lead ->
                val sub = subscriptions.find { it.leadId == lead.id }
                LmaasLeadResponse(
                    lead = lead,
                    subscription = sub
                )
            }
            call.respond(HttpStatusCode.OK, response)
        }

        post("/leads") {
            val req = call.receive<CreateLmaasLeadRequest>()
            val lead = LmaasLead(
                companyName = req.companyName,
                contactName = req.contactName,
                emails = req.emails,
                status = req.status
            )
            val createdLead = repository.createLead(lead)
            
            val subscription = LmaasSubscription(
                leadId = createdLead.id,
                tier = req.tier,
                billingCycle = req.billingCycle,
                monthlyFee = java.math.BigDecimal(req.monthlyFee),
                annualizedValue = java.math.BigDecimal(req.annualizedValue),
                operatingCosts = java.math.BigDecimal(req.operatingCosts)
            )
            val createdSub = repository.createSubscription(subscription)
            
            call.respond(HttpStatusCode.Created, LmaasLeadResponse(lead = createdLead, subscription = createdSub))
        }

        put("/leads/{id}") {
            val id = UUID.fromString(call.parameters["id"])
            val req = call.receive<LmaasLead>() // En un sistema real usaríamos DTO, aquí reutilizamos por rapidez
            if (req.id != id) {
                call.respond(HttpStatusCode.BadRequest, "ID mismatch")
                return@put
            }
            val updated = repository.updateLead(req)
            if (updated != null) {
                call.respond(HttpStatusCode.OK, updated)
            } else {
                call.respond(HttpStatusCode.NotFound)
            }
        }
        
        put("/subscriptions/{id}") {
            val id = UUID.fromString(call.parameters["id"])
            val req = call.receive<LmaasSubscription>()
            if (req.id != id) {
                call.respond(HttpStatusCode.BadRequest, "ID mismatch")
                return@put
            }
            val updated = repository.updateSubscription(req)
            if (updated != null) {
                call.respond(HttpStatusCode.OK, updated)
            } else {
                call.respond(HttpStatusCode.NotFound)
            }
        }

        get("/tickets") {
            val tickets = repository.getAllTickets()
            call.respond(HttpStatusCode.OK, tickets)
        }

        post("/tickets") {
            val req = call.receive<CreateLmaasTicketRequest>()
            val ticket = LmaasTicket(
                subscriptionId = UUID.fromString(req.subscriptionId),
                title = req.title,
                status = req.status,
                estimatedHours = req.estimatedHours
            )
            val created = repository.createTicket(ticket)
            call.respond(HttpStatusCode.Created, created)
        }

        put("/tickets/{id}") {
            val id = UUID.fromString(call.parameters["id"])
            val req = call.receive<LmaasTicket>()
            if (req.id != id) {
                call.respond(HttpStatusCode.BadRequest, "ID mismatch")
                return@put
            }
            val updated = repository.updateTicket(req)
            if (updated != null) {
                call.respond(HttpStatusCode.OK, updated)
            } else {
                call.respond(HttpStatusCode.NotFound)
            }
        }
    }
}

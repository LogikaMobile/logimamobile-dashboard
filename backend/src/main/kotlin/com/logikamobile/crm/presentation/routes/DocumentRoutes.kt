package com.logikamobile.crm.presentation.routes

import com.logikamobile.crm.domain.models.CreateDocumentDto
import com.logikamobile.crm.domain.models.UpdateDocumentDto
import com.logikamobile.crm.infrastructure.database.DocumentsRepository
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.documentRoutes(repository: DocumentsRepository) {
    route("/api/documents") {
        
        get("/project/{projectId}") {
            val projectId = call.parameters["projectId"] ?: return@get call.respond(HttpStatusCode.BadRequest, "Missing projectId")
            val docs = repository.getDocumentsForProject(projectId)
            call.respond(HttpStatusCode.OK, docs)
        }

        get("/lead/{leadId}") {
            val leadId = call.parameters["leadId"] ?: return@get call.respond(HttpStatusCode.BadRequest, "Missing leadId")
            val docs = repository.getDocumentsForLead(leadId)
            call.respond(HttpStatusCode.OK, docs)
        }

        get("/{id}") {
            val id = call.parameters["id"] ?: return@get call.respond(HttpStatusCode.BadRequest, "Missing id")
            val doc = repository.getDocument(id)
            if (doc != null) {
                call.respond(HttpStatusCode.OK, doc)
            } else {
                call.respond(HttpStatusCode.NotFound, "Document not found")
            }
        }

        post {
            val dto = try {
                call.receive<CreateDocumentDto>()
            } catch (e: Exception) {
                return@post call.respond(HttpStatusCode.BadRequest, "Invalid payload")
            }

            if (dto.projectId == null && dto.leadId == null) {
                return@post call.respond(HttpStatusCode.BadRequest, "Must provide projectId or leadId")
            }

            val id = repository.createDocument(dto)
            if (id != null) {
                val doc = repository.getDocument(id)
                call.respond(HttpStatusCode.Created, doc!!)
            } else {
                call.respond(HttpStatusCode.InternalServerError, "Failed to create document")
            }
        }

        put("/{id}") {
            val id = call.parameters["id"] ?: return@put call.respond(HttpStatusCode.BadRequest, "Missing id")
            val dto = try {
                call.receive<UpdateDocumentDto>()
            } catch (e: Exception) {
                return@put call.respond(HttpStatusCode.BadRequest, "Invalid payload")
            }

            val success = repository.updateDocument(id, dto)
            if (success) {
                val doc = repository.getDocument(id)
                call.respond(HttpStatusCode.OK, doc!!)
            } else {
                call.respond(HttpStatusCode.NotFound, "Document not found or update failed")
            }
        }

        delete("/{id}") {
            val id = call.parameters["id"] ?: return@delete call.respond(HttpStatusCode.BadRequest, "Missing id")
            val success = repository.deleteDocument(id)
            if (success) {
                call.respond(HttpStatusCode.NoContent)
            } else {
                call.respond(HttpStatusCode.NotFound, "Document not found")
            }
        }
    }
}

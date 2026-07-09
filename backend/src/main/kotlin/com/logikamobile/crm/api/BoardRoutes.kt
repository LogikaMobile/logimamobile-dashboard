package com.logikamobile.crm.api

import com.logikamobile.crm.domain.*
import com.logikamobile.crm.infrastructure.database.BoardRepository
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.boardRoutes(repository: BoardRepository) {
    route("/api/board") {
        
        route("/epics") {
            get {
                call.respond(repository.getEpics())
            }
            post {
                val dto = call.receive<CreateEpicDto>()
                if (dto.legacyProjectId == null && dto.lmaasLeadId == null) {
                    return@post call.respondText("Must provide legacyProjectId or lmaasLeadId", status = HttpStatusCode.BadRequest)
                }
                call.respond(HttpStatusCode.Created, repository.createEpic(dto))
            }
        }
        
        route("/issues") {
            get {
                call.respond(repository.getIssues())
            }
            post {
                val userId = call.request.header("X-User-Id")
                val dto = call.receive<CreateIssueDto>()
                call.respond(HttpStatusCode.Created, repository.createIssue(dto, userId))
            }
            put("/{id}") {
                val id = call.parameters["id"] ?: return@put call.respond(HttpStatusCode.BadRequest, "Missing issue id")
                val dto = call.receive<CreateIssueDto>()
                val userId = call.request.header("X-User-Id")
                val updated = repository.updateIssue(id, dto, userId)
                if (updated != null) {
                    call.respond(HttpStatusCode.OK, updated)
                } else {
                    call.respond(HttpStatusCode.NotFound, "Issue not found")
                }
            }
            delete("/{id}") {
                val id = call.parameters["id"] ?: return@delete call.respond(HttpStatusCode.BadRequest, "Missing issue id")
                val success = repository.deleteIssue(id)
                if (success) {
                    call.respond(HttpStatusCode.OK, mapOf("success" to true))
                } else {
                    call.respond(HttpStatusCode.NotFound, "Issue not found")
                }
            }
            put("/{id}/status") {
                val id = call.parameters["id"] ?: return@put call.respond(HttpStatusCode.BadRequest)
                val userId = call.request.header("X-User-Id")
                val dto = call.receive<UpdateIssueStatusDto>()
                // TODO: In a real app, add ownership validation here using DeveloperRepository
                val success = repository.updateIssueStatus(id, dto.status, userId)
                if (success) call.respond(HttpStatusCode.OK)
                else call.respond(HttpStatusCode.NotFound)
            }
            put("/{id}/blocked") {
                val id = call.parameters["id"] ?: return@put call.respond(HttpStatusCode.BadRequest)
                val dto = call.receive<UpdateIssueBlockedDto>()
                val success = repository.updateIssueBlocked(id, dto.isBlocked)
                if (success) call.respond(HttpStatusCode.OK)
                else call.respond(HttpStatusCode.NotFound)
            }
            post("/{id}/log-hours") {
                val id = call.parameters["id"] ?: return@post call.respond(HttpStatusCode.BadRequest)
                val dto = call.receive<LogHoursDto>()
                val success = repository.logHours(id, dto.hours)
                if (success) call.respond(HttpStatusCode.OK)
                else call.respond(HttpStatusCode.NotFound)
            }
            
            // Comments
            get("/{id}/comments") {
                val id = call.parameters["id"] ?: return@get call.respond(HttpStatusCode.BadRequest)
                call.respond(repository.getComments(id))
            }
            post("/{id}/comments") {
                val id = call.parameters["id"] ?: return@post call.respond(HttpStatusCode.BadRequest)
                val userId = call.request.header("X-User-Id")
                val dto = call.receive<CreateCommentDto>()
                call.respond(HttpStatusCode.Created, repository.addComment(id, dto, userId))
            }
        }
    }
}

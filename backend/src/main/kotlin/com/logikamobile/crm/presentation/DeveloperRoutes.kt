package com.logikamobile.crm.presentation

import com.logikamobile.crm.domain.CreateDeveloperDto
import com.logikamobile.crm.domain.CreateProjectAssignmentDto
import com.logikamobile.crm.domain.Developer
import com.logikamobile.crm.infrastructure.database.PostgresDeveloperRepository
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.time.LocalDate

fun Route.developerRoutes(repository: PostgresDeveloperRepository) {
    route("/auth") {
        get("/lookup") {
            val email = call.request.queryParameters["email"]
            if (email.isNullOrBlank()) return@get call.respond(HttpStatusCode.BadRequest, "Email required")
            
            val dev = repository.getDeveloperByEmail(email)
            if (dev == null) {
                call.respond(HttpStatusCode.NotFound, "Developer not found")
            } else {
                call.respond(dev)
            }
        }
    }

    route("/developers") {
        
        get {
            val month = call.request.queryParameters["month"]?.toIntOrNull() ?: LocalDate.now().monthValue
            val year = call.request.queryParameters["year"]?.toIntOrNull() ?: LocalDate.now().year
            val developers = repository.getAllDevelopers(month, year)
            call.respond(developers)
        }
        
        get("{id}") {
            val id = call.parameters["id"] ?: return@get call.respondText("Missing ID", status = HttpStatusCode.BadRequest)
            val month = call.request.queryParameters["month"]?.toIntOrNull() ?: LocalDate.now().monthValue
            val year = call.request.queryParameters["year"]?.toIntOrNull() ?: LocalDate.now().year
            
            val developer = repository.getDeveloperById(id, month, year) ?: return@get call.respondText("Not found", status = HttpStatusCode.NotFound)
            call.respond(developer)
        }
        
        post {
            val dto = call.receive<CreateDeveloperDto>()
            val created = repository.createDeveloper(dto)
            call.respond(HttpStatusCode.Created, created)
        }
        
        put("{id}") {
            val id = call.parameters["id"] ?: return@put call.respondText("Missing ID", status = HttpStatusCode.BadRequest)
            val dto = call.receive<Developer>()
            val updated = repository.updateDeveloper(id, dto)
            if (updated != null) {
                call.respond(updated)
            } else {
                call.respondText("Developer not found", status = HttpStatusCode.NotFound)
            }
        }
    }
    
    route("/assignments") {
        post {
            val dtos = call.receive<List<CreateProjectAssignmentDto>>()
            
            // 1. Validation
            for (dto in dtos) {
                if (dto.legacyProjectId == null && dto.lmaasLeadId == null) {
                    return@post call.respondText("Must provide either legacyProjectId or lmaasLeadId", status = HttpStatusCode.BadRequest)
                }
                if (dto.legacyProjectId != null && dto.lmaasLeadId != null) {
                    return@post call.respondText("Cannot provide both legacyProjectId and lmaasLeadId", status = HttpStatusCode.BadRequest)
                }
            }
            
            // 2. Capacity Validation
            val dtosByDevMonthYear = dtos.groupBy { Triple(it.developerId, it.assignedMonth, it.assignedYear) }
            for ((key, assignments) in dtosByDevMonthYear) {
                val (devId, month, year) = key
                val devWithFinancials = repository.getDeveloperById(devId, month, year)
                    ?: return@post call.respondText("Developer not found: $devId", status = HttpStatusCode.NotFound)
                
                val currentUsed = devWithFinancials.usedHours
                val newHours = assignments.sumOf { it.allocatedHours }
                val limit = devWithFinancials.developer.availableHoursPerMonth
                
                if (currentUsed + newHours > limit) {
                    val available = limit - currentUsed
                    return@post call.respondText("El desarrollador solo tiene $available horas disponibles para $month/$year", status = HttpStatusCode.BadRequest)
                }
            }
            
            // 3. Execution
            val created = dtos.map { repository.createAssignment(it) }
            call.respond(HttpStatusCode.Created, created)
        }
        
        get("legacy_project/{id}") {
            val id = call.parameters["id"] ?: return@get call.respondText("Missing ID", status = HttpStatusCode.BadRequest)
            val assignments = repository.getAssignmentsByLegacyProjectId(id)
            call.respond(assignments)
        }
        
        delete("{id}") {
            val id = call.parameters["id"] ?: return@delete call.respondText("Missing ID", status = HttpStatusCode.BadRequest)
            val deleted = repository.deleteAssignment(id)
            if (deleted) {
                call.respond(HttpStatusCode.NoContent)
            } else {
                call.respondText("Assignment not found", status = HttpStatusCode.NotFound)
            }
        }
    }
}

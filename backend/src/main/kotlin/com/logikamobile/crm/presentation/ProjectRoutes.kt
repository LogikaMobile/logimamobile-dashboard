package com.logikamobile.crm.presentation

import com.logikamobile.crm.application.CreateProjectUseCase
import com.logikamobile.crm.application.GetProjectsUseCase
import com.logikamobile.crm.domain.Project
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.call
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.route
import java.util.UUID

import com.logikamobile.crm.application.UpdateProjectUseCase
import io.ktor.server.routing.put

fun Route.projectRoutes(
    getProjectsUseCase: GetProjectsUseCase,
    createProjectUseCase: CreateProjectUseCase,
    updateProjectUseCase: UpdateProjectUseCase
) {
    route("/projects") {
        get {
            val projects = getProjectsUseCase.execute()
            call.respond(HttpStatusCode.OK, projects)
        }

        get("/{id}") {
            val id = call.parameters["id"]?.let { UUID.fromString(it) }
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, "Missing or invalid id")
                return@get
            }
            val project = getProjectsUseCase.getById(id)
            if (project != null) {
                call.respond(HttpStatusCode.OK, project)
            } else {
                call.respond(HttpStatusCode.NotFound, "Project not found")
            }
        }

        post {
            try {
                val project = call.receive<Project>()
                val createdProject = createProjectUseCase.execute(project)
                call.respond(HttpStatusCode.Created, createdProject)
            } catch (e: Exception) {
                call.respond(HttpStatusCode.BadRequest, e.localizedMessage)
            }
        }

        put("/{id}") {
            val id = call.parameters["id"]?.let { UUID.fromString(it) }
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, "Missing or invalid id")
                return@put
            }
            try {
                val projectUpdate = call.receive<Project>()
                if (projectUpdate.id != id) {
                    call.respond(HttpStatusCode.BadRequest, "ID in path does not match ID in body")
                    return@put
                }
                val updatedProject = updateProjectUseCase.execute(projectUpdate)
                if (updatedProject != null) {
                    call.respond(HttpStatusCode.OK, updatedProject)
                } else {
                    call.respond(HttpStatusCode.NotFound, "Project not found")
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.BadRequest, e.localizedMessage)
            }
        }
    }
}

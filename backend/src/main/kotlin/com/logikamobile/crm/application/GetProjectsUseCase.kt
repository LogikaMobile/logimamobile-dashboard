package com.logikamobile.crm.application

import com.logikamobile.crm.application.ports.out.ProjectRepositoryPort
import com.logikamobile.crm.domain.Project
import java.util.UUID

class GetProjectsUseCase(private val repository: ProjectRepositoryPort) {
    suspend fun execute(): List<Project> {
        return repository.getAllProjects()
    }

    suspend fun getById(id: UUID): Project? {
        return repository.getProjectById(id)
    }
}

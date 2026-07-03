package com.logikamobile.crm.application

import com.logikamobile.crm.application.ports.out.ProjectRepositoryPort
import com.logikamobile.crm.domain.Project

class CreateProjectUseCase(private val repository: ProjectRepositoryPort) {
    suspend fun execute(project: Project): Project {
        // Here we could add validation logic or business rules
        return repository.createProject(project)
    }
}

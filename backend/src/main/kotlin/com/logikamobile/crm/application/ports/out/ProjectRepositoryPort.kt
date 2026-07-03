package com.logikamobile.crm.application.ports.out

import com.logikamobile.crm.domain.Project
import java.util.UUID

interface ProjectRepositoryPort {
    suspend fun createProject(project: Project): Project
    suspend fun getProjectById(id: UUID): Project?
    suspend fun getAllProjects(): List<Project>
    suspend fun updateProject(project: Project): Project?
}

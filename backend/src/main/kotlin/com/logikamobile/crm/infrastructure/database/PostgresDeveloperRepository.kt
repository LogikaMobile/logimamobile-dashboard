package com.logikamobile.crm.infrastructure.database

import com.logikamobile.crm.domain.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import java.time.Instant
import java.util.UUID

class PostgresDeveloperRepository {

    suspend fun getAllDevelopers(month: Int, year: Int): List<DeveloperWithFinancials> = DatabaseFactory.dbQuery {
        val developers = DevelopersTable.selectAll().map { rowToDeveloper(it) }
        
        developers.map { dev ->
            val assignments = ProjectAssignmentsTable
                .join(LmaasLeadsTable, JoinType.LEFT, onColumn = ProjectAssignmentsTable.lmaasLeadId, otherColumn = LmaasLeadsTable.id)
                .join(LmaasSubscriptionsTable, JoinType.LEFT, onColumn = LmaasLeadsTable.id, otherColumn = LmaasSubscriptionsTable.leadId)
                .selectAll()
                .where { 
                    (ProjectAssignmentsTable.developerId eq UUID.fromString(dev.id)) and 
                    (
                        ((ProjectAssignmentsTable.assignedMonth eq month) and (ProjectAssignmentsTable.assignedYear eq year)) or 
                        ((ProjectAssignmentsTable.assignmentType eq "RETAINER") and (LmaasSubscriptionsTable.status eq "ACTIVE"))
                    )
                }
                .map { rowToProjectAssignmentWithDetails(it) }
            
            val usedHours = assignments.sumOf { it.assignment.allocatedHours }
            val remuneration = usedHours * dev.hourlyRate
            
            DeveloperWithFinancials(
                developer = dev,
                month = month,
                year = year,
                usedHours = usedHours,
                remuneration = remuneration,
                assignments = assignments
            )
        }
    }

    suspend fun getDeveloperById(id: String, month: Int, year: Int): DeveloperWithFinancials? = DatabaseFactory.dbQuery {
        val dev = DevelopersTable.selectAll().where { DevelopersTable.id eq UUID.fromString(id) }
            .map { rowToDeveloper(it) }
            .singleOrNull() ?: return@dbQuery null
            
        val assignments = ProjectAssignmentsTable
            .join(LmaasLeadsTable, JoinType.LEFT, onColumn = ProjectAssignmentsTable.lmaasLeadId, otherColumn = LmaasLeadsTable.id)
            .join(LmaasSubscriptionsTable, JoinType.LEFT, onColumn = LmaasLeadsTable.id, otherColumn = LmaasSubscriptionsTable.leadId)
            .selectAll()
            .where { 
                (ProjectAssignmentsTable.developerId eq UUID.fromString(id)) and 
                (
                    ((ProjectAssignmentsTable.assignedMonth eq month) and (ProjectAssignmentsTable.assignedYear eq year)) or 
                    ((ProjectAssignmentsTable.assignmentType eq "RETAINER") and (LmaasSubscriptionsTable.status eq "ACTIVE"))
                )
            }
            .map { rowToProjectAssignmentWithDetails(it) }
            
        val usedHours = assignments.sumOf { it.assignment.allocatedHours }
        val remuneration = usedHours * dev.hourlyRate
        
        DeveloperWithFinancials(
            developer = dev,
            month = month,
            year = year,
            usedHours = usedHours,
            remuneration = remuneration,
            assignments = assignments
        )
    }
    
    suspend fun getDeveloperByEmail(email: String): Developer? = DatabaseFactory.dbQuery {
        DevelopersTable.selectAll().where { DevelopersTable.email eq email }
            .map { rowToDeveloper(it) }
            .singleOrNull()
    }

    suspend fun createDeveloper(dto: CreateDeveloperDto): Developer = DatabaseFactory.dbQuery {
        val insertStatement = DevelopersTable.insert {
            it[name] = dto.name
            it[email] = dto.email
            it[role] = dto.role
            it[developerRole] = dto.jobTitle
            it[hourlyRate] = dto.hourlyRate
            it[availableHoursPerMonth] = dto.availableHoursPerMonth
            it[isActive] = true
            it[createdAt] = Instant.now()
            it[updatedAt] = Instant.now()
        }
        
        insertStatement.resultedValues?.singleOrNull()?.let { rowToDeveloper(it) }
            ?: throw Exception("Failed to create developer")
    }

    suspend fun updateDeveloper(id: String, dto: Developer): Developer? = DatabaseFactory.dbQuery {
        DevelopersTable.update({ DevelopersTable.id eq UUID.fromString(id) }) {
            it[name] = dto.name
            it[email] = dto.email
            it[role] = dto.role
            it[developerRole] = dto.jobTitle
            it[hourlyRate] = dto.hourlyRate
            it[availableHoursPerMonth] = dto.availableHoursPerMonth
            it[isActive] = dto.isActive
            it[updatedAt] = Instant.now()
        }
        
        DevelopersTable.selectAll().where { DevelopersTable.id eq UUID.fromString(id) }
            .map { rowToDeveloper(it) }
            .singleOrNull()
    }

    suspend fun createAssignment(dto: CreateProjectAssignmentDto): ProjectAssignment = DatabaseFactory.dbQuery {
        val insertStatement = ProjectAssignmentsTable.insert {
            it[developerId] = UUID.fromString(dto.developerId)
            
            if (dto.legacyProjectId != null) {
                it[legacyProjectId] = UUID.fromString(dto.legacyProjectId)
            }
            if (dto.lmaasLeadId != null) {
                it[lmaasLeadId] = UUID.fromString(dto.lmaasLeadId)
            }
            
            it[assignmentType] = dto.assignmentType
            it[assignedMonth] = dto.assignedMonth
            it[assignedYear] = dto.assignedYear
            it[allocatedHours] = dto.allocatedHours
            it[createdAt] = Instant.now()
            it[updatedAt] = Instant.now()
        }
        
        insertStatement.resultedValues?.singleOrNull()?.let { rowToProjectAssignment(it) }
            ?: throw Exception("Failed to create assignment")
    }
    
    suspend fun deleteAssignment(id: String): Boolean = DatabaseFactory.dbQuery {
        ProjectAssignmentsTable.deleteWhere { ProjectAssignmentsTable.id eq UUID.fromString(id) } > 0
    }
    
    suspend fun getAssignmentsByLegacyProjectId(projectId: String): List<ProjectAssignmentWithDetails> = DatabaseFactory.dbQuery {
        ProjectAssignmentsTable
            .join(DevelopersTable, JoinType.LEFT, onColumn = ProjectAssignmentsTable.developerId, otherColumn = DevelopersTable.id)
            .join(ProjectsTable, JoinType.LEFT, onColumn = ProjectAssignmentsTable.legacyProjectId, otherColumn = ProjectsTable.id)
            .selectAll()
            .where { ProjectAssignmentsTable.legacyProjectId eq UUID.fromString(projectId) }
            .map { rowToProjectAssignmentWithDetails(it) }
    }

    private fun rowToDeveloper(row: ResultRow): Developer = Developer(
        id = row[DevelopersTable.id].value.toString(),
        name = row[DevelopersTable.name],
        email = row[DevelopersTable.email],
        role = row[DevelopersTable.role],
        jobTitle = row[DevelopersTable.developerRole],
        hourlyRate = row[DevelopersTable.hourlyRate],
        availableHoursPerMonth = row[DevelopersTable.availableHoursPerMonth],
        isActive = row[DevelopersTable.isActive],
        createdAt = row[DevelopersTable.createdAt].toString(),
        updatedAt = row[DevelopersTable.updatedAt].toString()
    )
    
    private fun rowToProjectAssignment(row: ResultRow): ProjectAssignment = ProjectAssignment(
        id = row[ProjectAssignmentsTable.id].value.toString(),
        developerId = row[ProjectAssignmentsTable.developerId].toString(),
        legacyProjectId = row[ProjectAssignmentsTable.legacyProjectId]?.toString(),
        lmaasLeadId = row[ProjectAssignmentsTable.lmaasLeadId]?.toString(),
        assignmentType = row[ProjectAssignmentsTable.assignmentType],
        assignedMonth = row[ProjectAssignmentsTable.assignedMonth],
        assignedYear = row[ProjectAssignmentsTable.assignedYear],
        allocatedHours = row[ProjectAssignmentsTable.allocatedHours],
        createdAt = row[ProjectAssignmentsTable.createdAt].toString(),
        updatedAt = row[ProjectAssignmentsTable.updatedAt].toString()
    )
    
    private fun rowToProjectAssignmentWithDetails(row: ResultRow): ProjectAssignmentWithDetails {
        val assignment = rowToProjectAssignment(row)
        
        val developer = if (row.hasValue(DevelopersTable.id)) {
            try { rowToDeveloper(row) } catch (e: Exception) { null }
        } else null
        
        var projectName = "Unknown"
        var projectType = "UNKNOWN"
        
        if (assignment.legacyProjectId != null) {
            val projectRow = ProjectsTable.selectAll().where { ProjectsTable.id eq UUID.fromString(assignment.legacyProjectId) }.singleOrNull()
            if (projectRow != null) {
                projectName = projectRow[ProjectsTable.projectName] ?: projectRow[ProjectsTable.companyName]
                projectType = "LEGACY"
            }
        } else if (assignment.lmaasLeadId != null) {
            val leadRow = LmaasLeadsTable.selectAll().where { LmaasLeadsTable.id eq UUID.fromString(assignment.lmaasLeadId) }.singleOrNull()
            if (leadRow != null) {
                projectName = leadRow[LmaasLeadsTable.projectName] ?: leadRow[LmaasLeadsTable.companyName]
                projectType = "LMAAS"
            }
        }
        
        return ProjectAssignmentWithDetails(
            assignment = assignment,
            projectName = projectName,
            projectType = projectType,
            developer = developer
        )
    }
}

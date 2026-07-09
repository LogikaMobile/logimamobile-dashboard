package com.logikamobile.crm.infrastructure.database

import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.or
import org.jetbrains.exposed.sql.javatime.timestamp

object DevelopersTable : UUIDTable("developers") {
    val name = varchar("name", 255)
    val email = varchar("email", 255).uniqueIndex().nullable()
    val role = varchar("role", 255).default("ENGINEER")
    val developerRole = varchar("developer_role", 255) // Renamed old role to developerRole or keep it? Wait, old role was probably frontend/backend. Let me check.
    val hourlyRate = double("hourly_rate")
    val availableHoursPerMonth = integer("available_hours_per_month")
    val isActive = bool("is_active").default(true)
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
}

object ProjectAssignmentsTable : UUIDTable("project_assignments") {
    val developerId = uuid("developer_id").references(DevelopersTable.id, onDelete = ReferenceOption.CASCADE)
    val legacyProjectId = uuid("legacy_project_id").references(ProjectsTable.id, onDelete = ReferenceOption.CASCADE).nullable()
    val lmaasLeadId = uuid("lmaas_lead_id").references(LmaasLeadsTable.id, onDelete = ReferenceOption.CASCADE).nullable()
    val assignmentType = varchar("assignment_type", 50).default("FIXED")
    
    val assignedMonth = integer("assigned_month") // 1-12
    val assignedYear = integer("assigned_year")
    val allocatedHours = integer("allocated_hours")
    
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")

    init {
        // Enforce exactly one is not null
        check("check_single_project_reference") {
            (legacyProjectId.isNotNull() and lmaasLeadId.isNull()) or (legacyProjectId.isNull() and lmaasLeadId.isNotNull())
        }
    }
}

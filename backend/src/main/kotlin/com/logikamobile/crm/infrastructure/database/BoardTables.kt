package com.logikamobile.crm.infrastructure.database

import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.javatime.timestamp
import org.jetbrains.exposed.sql.or

object EpicsTable : UUIDTable("epics") {
    val legacyProjectId = uuid("legacy_project_id").references(ProjectsTable.id, onDelete = ReferenceOption.CASCADE).nullable()
    val lmaasLeadId = uuid("lmaas_lead_id").references(LmaasLeadsTable.id, onDelete = ReferenceOption.CASCADE).nullable()
    
    val title = varchar("title", 255)
    val description = text("description").nullable()
    val status = varchar("status", 50).default("OPEN")
    
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")

    init {
        check("check_epic_single_project_reference") {
            (legacyProjectId.isNotNull() and lmaasLeadId.isNull()) or (legacyProjectId.isNull() and lmaasLeadId.isNotNull())
        }
    }
}

object IssuesTable : UUIDTable("issues") {
    val type = varchar("type", 50) // HU, TASK, SUBTASK
    val parentId = uuid("parent_id").references(IssuesTable.id, onDelete = ReferenceOption.CASCADE).nullable()
    val epicId = uuid("epic_id").references(EpicsTable.id, onDelete = ReferenceOption.CASCADE).nullable()
    val assigneeId = uuid("assignee_id").references(DevelopersTable.id, onDelete = ReferenceOption.SET_NULL).nullable()
    
    val title = varchar("title", 255)
    val technicalDescription = text("technical_description").nullable()
    val status = varchar("status", 50).default("GENERAL_BACKLOG")
    val isBlocked = bool("is_blocked").default(false)
    
    val fibonacciScore = integer("fibonacci_score").nullable()
    val estimatedHours = integer("estimated_hours").default(0)
    val loggedHours = integer("logged_hours").default(0)
    
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
}

object IssueHistoryTable : UUIDTable("issue_history") {
    val issueId = uuid("issue_id").references(IssuesTable.id, onDelete = ReferenceOption.CASCADE)
    val fromStatus = varchar("from_status", 50)
    val toStatus = varchar("to_status", 50)
    val changedById = uuid("changed_by_id").references(DevelopersTable.id, onDelete = ReferenceOption.SET_NULL).nullable()
    val timestamp = timestamp("timestamp")
}

object IssueCommentsTable : UUIDTable("issue_comments") {
    val issueId = uuid("issue_id").references(IssuesTable.id, onDelete = ReferenceOption.CASCADE)
    val authorId = uuid("author_id").references(DevelopersTable.id, onDelete = ReferenceOption.SET_NULL).nullable()
    val content = text("content")
    val createdAt = timestamp("created_at")
}

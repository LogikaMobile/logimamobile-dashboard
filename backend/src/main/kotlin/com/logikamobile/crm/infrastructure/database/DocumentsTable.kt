package com.logikamobile.crm.infrastructure.database

import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.javatime.timestamp

object ProjectDocumentsTable : UUIDTable("project_documents") {
    val leadId = uuid("lead_id").references(LmaasLeadsTable.id, onDelete = ReferenceOption.CASCADE).nullable()
    val projectId = uuid("project_id").references(ProjectsTable.id, onDelete = ReferenceOption.CASCADE).nullable()
    val type = varchar("type", 100) // MVP, RFQ_SAAS, RFQ_CUSTOM, RFQ_LMAAS, INVOICE
    val language = varchar("language", 10).default("ES")
    val data = jsonb("data") // Dynamic document data in JSONB
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
}

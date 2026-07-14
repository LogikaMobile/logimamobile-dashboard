package com.logikamobile.crm.infrastructure.database

import com.logikamobile.crm.domain.models.CreateDocumentDto
import com.logikamobile.crm.domain.models.DocumentDto
import com.logikamobile.crm.domain.models.UpdateDocumentDto
import kotlinx.serialization.json.Json
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.Instant
import java.util.UUID
import kotlinx.serialization.encodeToString
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

class DocumentsRepository {
    private val json = Json { ignoreUnknownKeys = true }

    fun getDocumentsForProject(projectId: String): List<DocumentDto> {
        return transaction {
            ProjectDocumentsTable.select { ProjectDocumentsTable.projectId eq UUID.fromString(projectId) }
                .orderBy(ProjectDocumentsTable.createdAt to SortOrder.DESC)
                .map { rowToDto(it) }
        }
    }

    fun getDocumentsForLead(leadId: String): List<DocumentDto> {
        return transaction {
            ProjectDocumentsTable.select { ProjectDocumentsTable.leadId eq UUID.fromString(leadId) }
                .orderBy(ProjectDocumentsTable.createdAt to SortOrder.DESC)
                .map { rowToDto(it) }
        }
    }

    fun getDocument(id: String): DocumentDto? {
        return transaction {
            ProjectDocumentsTable.select { ProjectDocumentsTable.id eq UUID.fromString(id) }
                .map { rowToDto(it) }
                .singleOrNull()
        }
    }

    fun createDocument(dto: CreateDocumentDto): String? {
        return transaction {
            try {
                val id = ProjectDocumentsTable.insert {
                    if (dto.leadId != null) it[leadId] = UUID.fromString(dto.leadId)
                    if (dto.projectId != null) it[projectId] = UUID.fromString(dto.projectId)
                    it[type] = dto.type
                    it[language] = dto.language
                    it[data] = json.encodeToString(dto.data)
                    it[createdAt] = Instant.now()
                    it[updatedAt] = Instant.now()
                }
                id[ProjectDocumentsTable.id].value.toString()
            } catch (e: Exception) {
                e.printStackTrace()
                null
            }
        }
    }

    fun updateDocument(id: String, dto: UpdateDocumentDto): Boolean {
        return transaction {
            val updated = ProjectDocumentsTable.update({ ProjectDocumentsTable.id eq UUID.fromString(id) }) {
                if (dto.language != null) it[language] = dto.language
                if (dto.data != null) it[data] = json.encodeToString(dto.data)
                it[updatedAt] = Instant.now()
            }
            updated > 0
        }
    }

    fun deleteDocument(id: String): Boolean {
        return transaction {
            ProjectDocumentsTable.deleteWhere { ProjectDocumentsTable.id eq UUID.fromString(id) } > 0
        }
    }

    private fun rowToDto(row: ResultRow): DocumentDto {
        return DocumentDto(
            id = row[ProjectDocumentsTable.id].value.toString(),
            leadId = row[ProjectDocumentsTable.leadId]?.toString(),
            projectId = row[ProjectDocumentsTable.projectId]?.toString(),
            type = row[ProjectDocumentsTable.type],
            language = row[ProjectDocumentsTable.language],
            data = json.decodeFromString(row[ProjectDocumentsTable.data]),
            createdAt = row[ProjectDocumentsTable.createdAt].toEpochMilli(),
            updatedAt = row[ProjectDocumentsTable.updatedAt].toEpochMilli()
        )
    }
}

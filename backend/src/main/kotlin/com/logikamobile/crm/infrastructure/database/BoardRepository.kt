package com.logikamobile.crm.infrastructure.database

import com.logikamobile.crm.domain.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.plus
import java.time.Instant
import java.util.UUID

class BoardRepository {

    suspend fun getEpics(): List<Epic> = DatabaseFactory.dbQuery {
        EpicsTable.selectAll().map { rowToEpic(it) }
    }

    suspend fun createEpic(dto: CreateEpicDto): Epic = DatabaseFactory.dbQuery {
        val id = EpicsTable.insert {
            if (dto.legacyProjectId != null) {
                it[legacyProjectId] = UUID.fromString(dto.legacyProjectId)
            }
            if (dto.lmaasLeadId != null) {
                it[lmaasLeadId] = UUID.fromString(dto.lmaasLeadId)
            }
            it[title] = dto.title
            it[description] = dto.description
            it[status] = "OPEN"
            it[createdAt] = Instant.now()
            it[updatedAt] = Instant.now()
        }.resultedValues?.singleOrNull() ?: throw Exception("Failed to create Epic")
        rowToEpic(id)
    }

    suspend fun getIssues(): List<Issue> = DatabaseFactory.dbQuery {
        val allIssues = IssuesTable.selectAll().map { rowToIssue(it) }
        val now = Instant.now().toEpochMilli()
        val fourteenDays = 14L * 24 * 60 * 60 * 1000
        val twentyEightDays = 28L * 24 * 60 * 60 * 1000
        val fiftySixDays = 56L * 24 * 60 * 60 * 1000
        
        // Compute Burned and Frozen states based on timestamps
        allIssues.map { issue ->
            var isBurned = false
            var isFrozen = false
            
            // Burned: more than 14 days in DEVELOPMENT
            if (issue.status == "DEVELOPMENT") {
                val timeInState = now - issue.updatedAt
                if (timeInState > fourteenDays) isBurned = true
            }
            
            // Frozen: isBlocked for more than 28 days, or in BACKLOG variants for > 56 days
            if (issue.isBlocked) {
                val timeBlocked = now - issue.updatedAt
                if (timeBlocked > twentyEightDays) isFrozen = true
            }
            
            if (issue.status.contains("BACKLOG") || issue.status == "REFINED" || issue.status == "ESTIMATED") {
                val timeInState = now - issue.updatedAt
                if (timeInState > fiftySixDays) isFrozen = true
            }
            
            issue.copy(isBurned = isBurned, isFrozen = isFrozen)
        }
    }

    suspend fun createIssue(dto: CreateIssueDto, creatorId: String?): Issue = DatabaseFactory.dbQuery {
        val id = IssuesTable.insert {
            it[type] = dto.type
            if (dto.parentId != null) it[parentId] = UUID.fromString(dto.parentId)
            if (dto.epicId != null) it[epicId] = UUID.fromString(dto.epicId)
            it[title] = dto.title
            it[technicalDescription] = dto.technicalDescription
            it[status] = "GENERAL_BACKLOG"
            it[isBlocked] = false
            it[fibonacciScore] = dto.fibonacciScore
            it[estimatedHours] = dto.estimatedHours
            it[loggedHours] = 0
            it[createdAt] = Instant.now()
            it[updatedAt] = Instant.now()
        }.resultedValues?.singleOrNull() ?: throw Exception("Failed to create Issue")
        
        // Initial history record
        val issueId = id[IssuesTable.id].value
        IssueHistoryTable.insert {
            it[IssueHistoryTable.issueId] = issueId
            it[fromStatus] = "CREATED"
            it[toStatus] = "GENERAL_BACKLOG"
            if (creatorId != null) it[changedById] = UUID.fromString(creatorId)
            it[timestamp] = Instant.now()
        }
        
        rowToIssue(id)
    }

    suspend fun updateIssue(issueId: String, dto: CreateIssueDto, editorId: String?): Issue? = DatabaseFactory.dbQuery {
        val uuid = UUID.fromString(issueId)
        val updatedCount = IssuesTable.update({ IssuesTable.id eq uuid }) {
            if (dto.parentId != null) it[parentId] = UUID.fromString(dto.parentId)
            if (dto.epicId != null) it[epicId] = UUID.fromString(dto.epicId)
            it[title] = dto.title
            it[technicalDescription] = dto.technicalDescription
            it[fibonacciScore] = dto.fibonacciScore
            it[estimatedHours] = dto.estimatedHours
            it[updatedAt] = Instant.now()
        }
        
        if (updatedCount > 0) {
            // Auto log comment for the update
            IssueCommentsTable.insert {
                it[IssueCommentsTable.issueId] = uuid
                if (editorId != null) it[authorId] = UUID.fromString(editorId)
                it[content] = "Sistema: Se ha editado la información de este ticket."
                it[createdAt] = Instant.now()
            }
            
            val row = IssuesTable.select { IssuesTable.id eq uuid }.singleOrNull()
            if (row != null) return@dbQuery rowToIssue(row)
        }
        null
    }

    suspend fun deleteIssue(issueId: String): Boolean = DatabaseFactory.dbQuery {
        IssuesTable.deleteWhere { IssuesTable.id eq UUID.fromString(issueId) } > 0
    }

    suspend fun updateIssueStatus(issueId: String, status: String, changedById: String?): Boolean = DatabaseFactory.dbQuery {
        val issue = IssuesTable.select { IssuesTable.id eq UUID.fromString(issueId) }.singleOrNull() ?: return@dbQuery false
        val currentStatus = issue[IssuesTable.status]
        
        if (currentStatus != status) {
            IssuesTable.update({ IssuesTable.id eq UUID.fromString(issueId) }) {
                it[IssuesTable.status] = status
                it[updatedAt] = Instant.now()
            }
            
            IssueHistoryTable.insert {
                it[IssueHistoryTable.issueId] = UUID.fromString(issueId)
                it[fromStatus] = currentStatus
                it[toStatus] = status
                if (changedById != null) it[IssueHistoryTable.changedById] = UUID.fromString(changedById)
                it[timestamp] = Instant.now()
            }
        }
        true
    }

    suspend fun updateIssueBlocked(issueId: String, isBlocked: Boolean): Boolean = DatabaseFactory.dbQuery {
        IssuesTable.update({ IssuesTable.id eq UUID.fromString(issueId) }) {
            it[IssuesTable.isBlocked] = isBlocked
            it[updatedAt] = Instant.now()
        } > 0
    }

    suspend fun updateEstimatedHours(issueId: String, hours: Int): Boolean = DatabaseFactory.dbQuery {
        IssuesTable.update({ IssuesTable.id eq UUID.fromString(issueId) }) {
            it[estimatedHours] = hours
            it[updatedAt] = Instant.now()
        } > 0
    }

    suspend fun logHours(issueId: String, hours: Int): Boolean = DatabaseFactory.dbQuery {
        IssuesTable.update({ IssuesTable.id eq UUID.fromString(issueId) }) {
            with(SqlExpressionBuilder) {
                it.update(loggedHours, loggedHours + hours)
            }
            it[updatedAt] = Instant.now()
        } > 0
    }

    suspend fun getComments(issueId: String): List<IssueComment> = DatabaseFactory.dbQuery {
        IssueCommentsTable.select { IssueCommentsTable.issueId eq UUID.fromString(issueId) }
            .orderBy(IssueCommentsTable.createdAt to SortOrder.ASC)
            .map { rowToComment(it) }
    }

    suspend fun addComment(issueId: String, dto: CreateCommentDto, authorId: String?): IssueComment = DatabaseFactory.dbQuery {
        val id = IssueCommentsTable.insert {
            it[IssueCommentsTable.issueId] = UUID.fromString(issueId)
            if (authorId != null) it[IssueCommentsTable.authorId] = UUID.fromString(authorId)
            it[content] = dto.content
            it[createdAt] = Instant.now()
        }.resultedValues?.singleOrNull() ?: throw Exception("Failed to add comment")
        rowToComment(id)
    }

    private fun rowToEpic(row: ResultRow): Epic = Epic(
        id = row[EpicsTable.id].value,
        legacyProjectId = row[EpicsTable.legacyProjectId]?.toString(),
        lmaasLeadId = row[EpicsTable.lmaasLeadId]?.toString(),
        title = row[EpicsTable.title],
        description = row[EpicsTable.description],
        status = row[EpicsTable.status],
        createdAt = row[EpicsTable.createdAt].toEpochMilli(),
        updatedAt = row[EpicsTable.updatedAt].toEpochMilli()
    )

    private fun rowToIssue(row: ResultRow): Issue = Issue(
        id = row[IssuesTable.id].value,
        type = row[IssuesTable.type],
        parentId = row[IssuesTable.parentId]?.toString(),
        epicId = row[IssuesTable.epicId]?.toString(),
        assigneeId = row[IssuesTable.assigneeId]?.toString(),
        title = row[IssuesTable.title],
        technicalDescription = row[IssuesTable.technicalDescription],
        status = row[IssuesTable.status],
        isBlocked = row[IssuesTable.isBlocked],
        fibonacciScore = row[IssuesTable.fibonacciScore],
        estimatedHours = row[IssuesTable.estimatedHours],
        loggedHours = row[IssuesTable.loggedHours],
        createdAt = row[IssuesTable.createdAt].toEpochMilli(),
        updatedAt = row[IssuesTable.updatedAt].toEpochMilli()
    )

    private fun rowToComment(row: ResultRow): IssueComment = IssueComment(
        id = row[IssueCommentsTable.id].value,
        issueId = row[IssueCommentsTable.issueId].toString(),
        authorId = row[IssueCommentsTable.authorId]?.toString(),
        content = row[IssueCommentsTable.content],
        createdAt = row[IssueCommentsTable.createdAt].toEpochMilli()
    )
}

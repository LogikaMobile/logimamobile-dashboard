package com.logikamobile.crm.domain

import kotlinx.serialization.Serializable
import java.util.UUID

@Serializable
data class Epic(
    @Serializable(with = UUIDSerializer::class)
    val id: UUID,
    val legacyProjectId: String?,
    val lmaasLeadId: String?,
    val title: String,
    val description: String?,
    val status: String,
    val createdAt: Long,
    val updatedAt: Long
)

@Serializable
data class Issue(
    @Serializable(with = UUIDSerializer::class)
    val id: UUID,
    val type: String, // HU, TASK, SUBTASK
    val parentId: String?,
    val epicId: String?,
    val assigneeId: String?,
    val title: String,
    val technicalDescription: String?,
    val status: String,
    val isBlocked: Boolean,
    val fibonacciScore: Int?,
    val estimatedHours: Int,
    val loggedHours: Int,
    val isBurned: Boolean = false,
    val isFrozen: Boolean = false,
    val createdAt: Long,
    val updatedAt: Long
)

@Serializable
data class IssueHistory(
    @Serializable(with = UUIDSerializer::class)
    val id: UUID,
    val issueId: String,
    val fromStatus: String,
    val toStatus: String,
    val changedById: String?,
    val timestamp: Long
)

@Serializable
data class IssueComment(
    @Serializable(with = UUIDSerializer::class)
    val id: UUID,
    val issueId: String,
    val authorId: String?,
    val content: String,
    val createdAt: Long
)

@Serializable
data class CreateEpicDto(
    val legacyProjectId: String? = null,
    val lmaasLeadId: String? = null,
    val title: String,
    val description: String? = null
)

@Serializable
data class CreateIssueDto(
    val type: String,
    val parentId: String? = null,
    val epicId: String? = null,
    val title: String,
    val technicalDescription: String? = null,
    val fibonacciScore: Int? = null,
    val estimatedHours: Int = 0
)

@Serializable
data class UpdateIssueStatusDto(
    val status: String
)

@Serializable
data class UpdateIssueBlockedDto(
    val isBlocked: Boolean
)

@Serializable
data class LogHoursDto(
    val hours: Int
)

@Serializable
data class CreateCommentDto(
    val content: String
)

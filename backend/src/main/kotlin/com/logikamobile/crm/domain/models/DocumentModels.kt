package com.logikamobile.crm.domain.models

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonObject

@Serializable
data class DocumentDto(
    val id: String,
    val leadId: String?,
    val projectId: String?,
    val type: String,
    val language: String,
    val data: JsonObject,
    val createdAt: Long,
    val updatedAt: Long
)

@Serializable
data class CreateDocumentDto(
    val leadId: String? = null,
    val projectId: String? = null,
    val type: String,
    val language: String,
    val data: JsonObject
)

@Serializable
data class UpdateDocumentDto(
    val language: String? = null,
    val data: JsonObject? = null
)

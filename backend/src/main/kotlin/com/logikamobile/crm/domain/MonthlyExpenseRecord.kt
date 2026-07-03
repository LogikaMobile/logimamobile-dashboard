package com.logikamobile.crm.domain

import kotlinx.serialization.Serializable

@Serializable
data class MonthlyExpenseRecord(
    val id: Int,
    val month: Int,
    val year: Int,
    val concept: String,
    val originalAmount: Double,
    val actualAmount: Double,
    val isModified: Boolean,
    val modificationNote: String?
)

@Serializable
data class UpdateExpenseRecordDto(
    val actualAmount: Double,
    val modificationNote: String
)

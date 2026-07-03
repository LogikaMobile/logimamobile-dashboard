package com.logikamobile.crm.domain

import kotlinx.serialization.Serializable

@Serializable
data class ConstantExpense(
    val id: Int,
    val concept: String,
    val amount: Double,
    val frequency: String,
    val expectedEvents: Int? = null,
    val type: String = "EXPENSE"
)

@Serializable
data class CreateConstantExpenseDto(
    val concept: String,
    val amount: Double,
    val frequency: String,
    val expectedEvents: Int? = null,
    val type: String = "EXPENSE"
)

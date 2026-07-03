package com.logikamobile.crm.application

import com.logikamobile.crm.domain.ConstantExpense
import com.logikamobile.crm.domain.CreateConstantExpenseDto
import com.logikamobile.crm.infrastructure.database.PostgresConstantExpenseRepository

class CreateConstantExpenseUseCase(private val repository: PostgresConstantExpenseRepository) {
    fun execute(dto: CreateConstantExpenseDto): ConstantExpense? {
        return repository.create(dto)
    }
}

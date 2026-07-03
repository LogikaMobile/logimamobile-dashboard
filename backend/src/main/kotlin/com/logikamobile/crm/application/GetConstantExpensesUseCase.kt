package com.logikamobile.crm.application

import com.logikamobile.crm.domain.ConstantExpense
import com.logikamobile.crm.infrastructure.database.PostgresConstantExpenseRepository

class GetConstantExpensesUseCase(private val repository: PostgresConstantExpenseRepository) {
    fun execute(): List<ConstantExpense> {
        return repository.getAll()
    }
}

package com.logikamobile.crm.application

import com.logikamobile.crm.infrastructure.database.PostgresConstantExpenseRepository

class DeleteConstantExpenseUseCase(private val repository: PostgresConstantExpenseRepository) {
    fun execute(id: Int): Boolean {
        return repository.delete(id)
    }
}

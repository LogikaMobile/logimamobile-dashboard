package com.logikamobile.crm.application

import com.logikamobile.crm.domain.MonthlyExpenseRecord
import com.logikamobile.crm.infrastructure.database.PostgresConstantExpenseRepository
import com.logikamobile.crm.infrastructure.database.PostgresMonthlyExpenseRecordRepository
import java.time.LocalDate

class FinancialReportUseCases(
    private val expenseRecordRepository: PostgresMonthlyExpenseRecordRepository,
    private val constantExpenseRepository: PostgresConstantExpenseRepository
) {
    suspend fun getMonthlyExpenseRecords(year: Int, month: Int): List<MonthlyExpenseRecord> {
        val existingRecords = expenseRecordRepository.getRecordsForMonth(year, month)
        if (existingRecords.isNotEmpty()) {
            return existingRecords
        }

        // Lazy generation: If records don't exist, generate them from ConstantExpenses
        val currentConstantExpenses = constantExpenseRepository.getAll()
        if (currentConstantExpenses.isEmpty()) {
            return emptyList()
        }

        val newRecords = currentConstantExpenses.map { expense ->
            val amount = when (expense.frequency) {
                "mensual" -> expense.amount
                "anual" -> expense.amount / 12.0
                "evento" -> (expense.amount * (expense.expectedEvents ?: 1)) / 12.0
                else -> expense.amount
            }
            
            MonthlyExpenseRecord(
                id = 0,
                month = month,
                year = year,
                concept = expense.concept,
                originalAmount = amount,
                actualAmount = amount,
                isModified = false,
                modificationNote = null
            )
        }
        
        return expenseRecordRepository.createRecords(newRecords)
    }

    suspend fun updateMonthlyExpenseRecord(id: Int, newAmount: Double, note: String): Boolean {
        val record = expenseRecordRepository.getRecordById(id) ?: return false
        
        if (record.isModified) {
            throw IllegalStateException("Record has already been modified.")
        }
        
        val today = LocalDate.now()
        // Allow editing if today is within the first 3 business days of the *next* month
        val expectedMonthToEdit = today.minusMonths(1)
        if (expectedMonthToEdit.year == record.year && expectedMonthToEdit.monthValue == record.month) {
            if (!BusinessDaysCalculator.isWithinFirstBusinessDaysOfMonth(today, 3)) {
                throw IllegalStateException("Modifications are only allowed within the first 3 business days of the following month.")
            }
        } else if (today.year == record.year && today.monthValue == record.month) {
            // Or allow editing during the current month itself
        } else {
            throw IllegalStateException("Cannot modify records for this month at this time.")
        }

        return expenseRecordRepository.updateRecord(id, newAmount, note)
    }
}

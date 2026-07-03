package com.logikamobile.crm.infrastructure.database

import com.logikamobile.crm.domain.ConstantExpense
import com.logikamobile.crm.domain.CreateConstantExpenseDto
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

class PostgresConstantExpenseRepository {

    private fun resultRowToConstantExpense(row: ResultRow) = ConstantExpense(
        id = row[ConstantExpensesTable.id],
        concept = row[ConstantExpensesTable.concept],
        amount = row[ConstantExpensesTable.amount],
        frequency = row[ConstantExpensesTable.frequency],
        expectedEvents = row[ConstantExpensesTable.expectedEvents],
        type = row[ConstantExpensesTable.type]
    )

    fun create(expense: CreateConstantExpenseDto): ConstantExpense? {
        return transaction {
            val insertStatement = ConstantExpensesTable.insert {
                it[concept] = expense.concept
                it[amount] = expense.amount
                it[frequency] = expense.frequency
                it[expectedEvents] = expense.expectedEvents
                it[type] = expense.type
            }
            insertStatement.resultedValues?.singleOrNull()?.let(::resultRowToConstantExpense)
        }
    }

    fun getAll(): List<ConstantExpense> {
        return transaction {
            ConstantExpensesTable.selectAll().map(::resultRowToConstantExpense)
        }
    }

    fun delete(id: Int): Boolean {
        return transaction {
            ConstantExpensesTable.deleteWhere { ConstantExpensesTable.id eq id } > 0
        }
    }
}

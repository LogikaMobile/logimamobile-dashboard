package com.logikamobile.crm.infrastructure.database

import com.logikamobile.crm.domain.MonthlyExpenseRecord
import com.logikamobile.crm.infrastructure.database.DatabaseFactory.dbQuery
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

class PostgresMonthlyExpenseRecordRepository {

    private fun resultRowToRecord(row: ResultRow) = MonthlyExpenseRecord(
        id = row[MonthlyExpenseRecordsTable.id],
        month = row[MonthlyExpenseRecordsTable.month],
        year = row[MonthlyExpenseRecordsTable.year],
        concept = row[MonthlyExpenseRecordsTable.concept],
        originalAmount = row[MonthlyExpenseRecordsTable.originalAmount],
        actualAmount = row[MonthlyExpenseRecordsTable.actualAmount],
        isModified = row[MonthlyExpenseRecordsTable.isModified],
        modificationNote = row[MonthlyExpenseRecordsTable.modificationNote]
    )

    suspend fun getRecordsForMonth(year: Int, month: Int): List<MonthlyExpenseRecord> = dbQuery {
        MonthlyExpenseRecordsTable
            .selectAll()
            .where { (MonthlyExpenseRecordsTable.year eq year) and (MonthlyExpenseRecordsTable.month eq month) }
            .map(::resultRowToRecord)
    }

    suspend fun createRecords(records: List<MonthlyExpenseRecord>): List<MonthlyExpenseRecord> = dbQuery {
        MonthlyExpenseRecordsTable.batchInsert(records) { record ->
            this[MonthlyExpenseRecordsTable.month] = record.month
            this[MonthlyExpenseRecordsTable.year] = record.year
            this[MonthlyExpenseRecordsTable.concept] = record.concept
            this[MonthlyExpenseRecordsTable.originalAmount] = record.originalAmount
            this[MonthlyExpenseRecordsTable.actualAmount] = record.actualAmount
            this[MonthlyExpenseRecordsTable.isModified] = record.isModified
            this[MonthlyExpenseRecordsTable.modificationNote] = record.modificationNote
        }
        // Retornamos getRecordsForMonth para asegurar que tienen los IDs autogenerados
        MonthlyExpenseRecordsTable
            .selectAll()
            .where { (MonthlyExpenseRecordsTable.year eq records.first().year) and (MonthlyExpenseRecordsTable.month eq records.first().month) }
            .map(::resultRowToRecord)
    }

    suspend fun updateRecord(id: Int, newAmount: Double, note: String): Boolean = dbQuery {
        val updatedRows = MonthlyExpenseRecordsTable.update({ MonthlyExpenseRecordsTable.id eq id }) {
            it[actualAmount] = newAmount
            it[isModified] = true
            it[modificationNote] = note
        }
        updatedRows > 0
    }

    suspend fun getRecordById(id: Int): MonthlyExpenseRecord? = dbQuery {
        MonthlyExpenseRecordsTable
            .selectAll()
            .where { MonthlyExpenseRecordsTable.id eq id }
            .map(::resultRowToRecord)
            .singleOrNull()
    }
}

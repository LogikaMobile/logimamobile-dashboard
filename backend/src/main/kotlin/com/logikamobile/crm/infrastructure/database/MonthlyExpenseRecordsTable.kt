package com.logikamobile.crm.infrastructure.database

import org.jetbrains.exposed.sql.Table

object MonthlyExpenseRecordsTable : Table("monthly_expense_records") {
    val id = integer("id").autoIncrement()
    val month = integer("month")
    val year = integer("year")
    val concept = varchar("concept", 255)
    val originalAmount = double("original_amount")
    val actualAmount = double("actual_amount")
    val isModified = bool("is_modified").default(false)
    val modificationNote = text("modification_note").nullable()

    override val primaryKey = PrimaryKey(id)
}

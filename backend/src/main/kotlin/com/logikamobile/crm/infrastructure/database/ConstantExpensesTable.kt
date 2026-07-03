package com.logikamobile.crm.infrastructure.database

import org.jetbrains.exposed.sql.Table

object ConstantExpensesTable : Table("constant_expenses") {
    val id = integer("id").autoIncrement()
    val concept = varchar("concept", 255)
    val amount = double("amount")
    val frequency = varchar("frequency", 50)
    val expectedEvents = integer("expected_events").nullable()
    val type = varchar("type", 50).default("EXPENSE")

    override val primaryKey = PrimaryKey(id)
}

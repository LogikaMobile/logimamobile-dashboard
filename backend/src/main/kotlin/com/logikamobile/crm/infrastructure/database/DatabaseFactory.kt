package com.logikamobile.crm.infrastructure.database

import com.logikamobile.crm.domain.Project
import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.StdOutSqlLogger
import org.jetbrains.exposed.sql.addLogger
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction

object DatabaseFactory {
    fun init() {
        val driverClassName = "org.postgresql.Driver"
        // In production, these should come from environment variables.
        val jdbcURL = System.getenv("JDBC_URL") ?: "jdbc:postgresql://localhost:5432/crm_db"
        val user = System.getenv("DB_USER") ?: "postgres"
        val password = System.getenv("DB_PASSWORD") ?: "postgres"
        
        val pool = hikari(jdbcURL, user, password, driverClassName)
        val database = Database.connect(pool)
        
        transaction(database) {
            addLogger(StdOutSqlLogger)
            SchemaUtils.createMissingTablesAndColumns(ProjectsTable, ConstantExpensesTable, MonthlyExpenseRecordsTable)
        }
    }

    private fun hikari(url: String, user: String, pass: String, driver: String): HikariDataSource {
        val config = HikariConfig().apply {
            driverClassName = driver
            jdbcUrl = url
            username = user
            password = pass
            maximumPoolSize = 3
            isAutoCommit = false
            transactionIsolation = "TRANSACTION_REPEATABLE_READ"
            validate()
        }
        return HikariDataSource(config)
    }

    suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }
}

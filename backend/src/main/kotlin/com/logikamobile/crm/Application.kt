package com.logikamobile.crm

import com.logikamobile.crm.application.CreateProjectUseCase
import com.logikamobile.crm.application.GetProjectsUseCase
import com.logikamobile.crm.infrastructure.database.DatabaseFactory
import com.logikamobile.crm.infrastructure.database.PostgresProjectRepository
import com.logikamobile.crm.presentation.projectRoutes
import com.logikamobile.crm.presentation.constantExpenseRoutes
import com.logikamobile.crm.presentation.financialReportRoutes
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.plugins.cors.routing.CORS
import io.ktor.server.routing.routing
import kotlinx.serialization.json.Json

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0", module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    DatabaseFactory.init()

    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
            ignoreUnknownKeys = true
        })
    }
    
    install(CORS) {
        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowMethod(HttpMethod.Patch)
        allowHeader(HttpHeaders.Authorization)
        allowHeader(HttpHeaders.ContentType)
        anyHost() // Allow all for development
    }

    val repository = PostgresProjectRepository()
    val getProjectsUseCase = GetProjectsUseCase(repository)
    val createProjectUseCase = CreateProjectUseCase(repository)
    val expenseRepository = com.logikamobile.crm.infrastructure.database.PostgresConstantExpenseRepository()
    val updateProjectUseCase = com.logikamobile.crm.application.UpdateProjectUseCase(repository, expenseRepository)
    val getExpensesUseCase = com.logikamobile.crm.application.GetConstantExpensesUseCase(expenseRepository)
    val createExpenseUseCase = com.logikamobile.crm.application.CreateConstantExpenseUseCase(expenseRepository)
    val deleteExpenseUseCase = com.logikamobile.crm.application.DeleteConstantExpenseUseCase(expenseRepository)

    val reportRepository = com.logikamobile.crm.infrastructure.database.PostgresMonthlyExpenseRecordRepository()
    val financialReportUseCases = com.logikamobile.crm.application.FinancialReportUseCases(reportRepository, expenseRepository)

    routing {
        projectRoutes(getProjectsUseCase, createProjectUseCase, updateProjectUseCase)
        constantExpenseRoutes(getExpensesUseCase, createExpenseUseCase, deleteExpenseUseCase)
        financialReportRoutes(financialReportUseCases)
    }
}

package com.logikamobile.crm.presentation

import com.logikamobile.crm.application.FinancialReportUseCases
import com.logikamobile.crm.domain.UpdateExpenseRecordDto
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.call
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.put
import io.ktor.server.routing.route

fun Route.financialReportRoutes(
    financialReportUseCases: FinancialReportUseCases
) {
    route("/reports") {
        get("/monthly/{year}/{month}") {
            val year = call.parameters["year"]?.toIntOrNull()
            val month = call.parameters["month"]?.toIntOrNull()

            if (year == null || month == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Invalid year or month"))
                return@get
            }

            val records = financialReportUseCases.getMonthlyExpenseRecords(year, month)
            call.respond(records)
        }

        put("/monthly/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Invalid ID"))
                return@put
            }

            val dto = call.receive<UpdateExpenseRecordDto>()
            try {
                val success = financialReportUseCases.updateMonthlyExpenseRecord(id, dto.actualAmount, dto.modificationNote)
                if (success) {
                    call.respond(HttpStatusCode.OK, mapOf("success" to true))
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Record not found"))
                }
            } catch (e: IllegalStateException) {
                call.respond(HttpStatusCode.Forbidden, mapOf("error" to e.message))
            }
        }
    }
}

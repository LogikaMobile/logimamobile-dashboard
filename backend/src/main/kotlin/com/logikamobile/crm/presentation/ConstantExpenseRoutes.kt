package com.logikamobile.crm.presentation

import com.logikamobile.crm.application.CreateConstantExpenseUseCase
import com.logikamobile.crm.application.DeleteConstantExpenseUseCase
import com.logikamobile.crm.application.GetConstantExpensesUseCase
import com.logikamobile.crm.domain.CreateConstantExpenseDto
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.call
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.delete
import io.ktor.server.routing.route

fun Route.constantExpenseRoutes(
    getConstantExpensesUseCase: GetConstantExpensesUseCase,
    createConstantExpenseUseCase: CreateConstantExpenseUseCase,
    deleteConstantExpenseUseCase: DeleteConstantExpenseUseCase
) {
    route("/api/expenses") {
        get {
            val expenses = getConstantExpensesUseCase.execute()
            call.respond(expenses)
        }

        post {
            val expenseToCreate = call.receive<CreateConstantExpenseDto>()
            val createdExpense = createConstantExpenseUseCase.execute(expenseToCreate)
            if (createdExpense != null) {
                call.respond(HttpStatusCode.Created, createdExpense)
            } else {
                call.respond(HttpStatusCode.InternalServerError, mapOf("error" to "Error creating expense"))
            }
        }
        
        delete("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Invalid ID"))
                return@delete
            }
            
            val success = deleteConstantExpenseUseCase.execute(id)
            if (success) {
                call.respond(HttpStatusCode.OK, mapOf("success" to true))
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Expense not found"))
            }
        }
    }
}

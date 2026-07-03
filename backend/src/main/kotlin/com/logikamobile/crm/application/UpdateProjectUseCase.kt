package com.logikamobile.crm.application

import com.logikamobile.crm.application.ports.out.ProjectRepositoryPort
import com.logikamobile.crm.domain.Project

import com.logikamobile.crm.domain.CreateConstantExpenseDto
import com.logikamobile.crm.infrastructure.database.PostgresConstantExpenseRepository
import java.math.BigDecimal

class UpdateProjectUseCase(
    private val repository: ProjectRepositoryPort,
    private val expenseRepository: PostgresConstantExpenseRepository
) {
    suspend fun execute(projectUpdate: Project): Project? {
        // Fetch current project to compare state
        val currentProject = repository.getProjectById(projectUpdate.id) ?: return null
        
        var generatedRevenue = projectUpdate.generatedRevenue
        var isSetupFeeFirstHalfPaid = projectUpdate.isSetupFeeFirstHalfPaid
        var isSetupFeeSecondHalfPaid = projectUpdate.isSetupFeeSecondHalfPaid
        
        val setupFee = projectUpdate.finalPrice ?: projectUpdate.quotedPrice ?: BigDecimal.ZERO
        val halfSetupFee = setupFee.divide(BigDecimal(2), 2, java.math.RoundingMode.HALF_UP)

        // Status >= STEP_4 logic
        val step4Index = 4 // STEP_4
        val step10Index = 10 // STEP_10
        
        // Extract step number roughly from status string (e.g. "STEP_5" -> 5)
        fun getStepIndex(status: String): Int {
            if (status.startsWith("STEP_")) {
                return status.substringAfter("STEP_").toIntOrNull() ?: -1
            }
            if (status == "DELIVERED") return 11
            return -1
        }
        
        val currentStep = getStepIndex(projectUpdate.status)
        
        // If moved to step >= 4 and first half not paid
        if (currentStep >= step4Index && !isSetupFeeFirstHalfPaid && halfSetupFee > BigDecimal.ZERO) {
            generatedRevenue = generatedRevenue.add(halfSetupFee)
            isSetupFeeFirstHalfPaid = true
        }
        
        // If moved to step >= 10 and second half not paid
        if (currentStep >= step10Index && !isSetupFeeSecondHalfPaid && halfSetupFee > BigDecimal.ZERO) {
            generatedRevenue = generatedRevenue.add(halfSetupFee)
            isSetupFeeSecondHalfPaid = true
            
            // Generate SaaS Subscription if applicable
            if (projectUpdate.projectType == "SAAS" && projectUpdate.recurringRevenue != null && projectUpdate.recurringRevenue > BigDecimal.ZERO) {
                // Ensure we don't create multiple subscriptions if it was already paid
                val expenseDto = CreateConstantExpenseDto(
                    concept = "Licencia SaaS - ${projectUpdate.companyName}",
                    amount = projectUpdate.recurringRevenue.toDouble(),
                    frequency = projectUpdate.recurringFrequency?.lowercase() ?: "mensual",
                    expectedEvents = null,
                    type = "INCOME"
                )
                expenseRepository.create(expenseDto)
            }
        }
        
        val projectToSave = projectUpdate.copy(
            generatedRevenue = generatedRevenue,
            isSetupFeeFirstHalfPaid = isSetupFeeFirstHalfPaid,
            isSetupFeeSecondHalfPaid = isSetupFeeSecondHalfPaid
        )
        
        return repository.updateProject(projectToSave)
    }
}

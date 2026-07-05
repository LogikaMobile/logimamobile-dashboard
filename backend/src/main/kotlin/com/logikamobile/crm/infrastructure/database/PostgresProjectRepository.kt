package com.logikamobile.crm.infrastructure.database

import com.logikamobile.crm.application.ports.out.ProjectRepositoryPort
import com.logikamobile.crm.domain.Project
import com.logikamobile.crm.infrastructure.database.DatabaseFactory.dbQuery
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import java.util.UUID

class PostgresProjectRepository : ProjectRepositoryPort {

    private fun resultRowToProject(row: ResultRow) = Project(
        id = row[ProjectsTable.id].value,
        companyName = row[ProjectsTable.companyName],
        projectName = row[ProjectsTable.projectName],
        companySize = row[ProjectsTable.companySize],
        industry = row[ProjectsTable.industry],
        contactName = row[ProjectsTable.contactName],
        contactEmail = row[ProjectsTable.contactEmail],
        contactChannel = row[ProjectsTable.contactChannel],
        status = row[ProjectsTable.status],
        firstContactDate = row[ProjectsTable.firstContactDate],
        lastContactDate = row[ProjectsTable.lastContactDate],
        nextMeetingDate = row[ProjectsTable.nextMeetingDate],
        closedDate = row[ProjectsTable.closedDate],
        quotedPrice = row[ProjectsTable.quotedPrice],
        counterOfferPrice = row[ProjectsTable.counterOfferPrice],
        finalPrice = row[ProjectsTable.finalPrice],
        generatedRevenue = row[ProjectsTable.generatedRevenue],
        projectedRevenue = row[ProjectsTable.projectedRevenue],
        operationalCosts = row[ProjectsTable.operationalCosts],
        
        projectType = row[ProjectsTable.projectType],
        recurringRevenue = row[ProjectsTable.recurringRevenue],
        recurringFrequency = row[ProjectsTable.recurringFrequency],
        isSetupFeeFirstHalfPaid = row[ProjectsTable.isSetupFeeFirstHalfPaid],
        isSetupFeeSecondHalfPaid = row[ProjectsTable.isSetupFeeSecondHalfPaid],
        
        billingYear = row[ProjectsTable.billingYear],
        completionYear = row[ProjectsTable.completionYear],

        projectNotes = row[ProjectsTable.projectNotes]
    )

    override suspend fun createProject(project: Project): Project = dbQuery {
        ProjectsTable.insert {
            it[id] = project.id
            it[companyName] = project.companyName
            it[projectName] = project.projectName
            it[companySize] = project.companySize
            it[industry] = project.industry
            it[contactName] = project.contactName
            it[contactEmail] = project.contactEmail
            it[contactChannel] = project.contactChannel
            it[status] = project.status
            it[firstContactDate] = project.firstContactDate
            it[lastContactDate] = project.lastContactDate
            it[nextMeetingDate] = project.nextMeetingDate
            it[closedDate] = project.closedDate
            it[quotedPrice] = project.quotedPrice
            it[counterOfferPrice] = project.counterOfferPrice
            it[finalPrice] = project.finalPrice
            it[generatedRevenue] = project.generatedRevenue
            it[projectedRevenue] = project.projectedRevenue
            it[operationalCosts] = project.operationalCosts
            
            it[projectType] = project.projectType
            it[recurringRevenue] = project.recurringRevenue
            it[recurringFrequency] = project.recurringFrequency
            it[isSetupFeeFirstHalfPaid] = project.isSetupFeeFirstHalfPaid
            it[isSetupFeeSecondHalfPaid] = project.isSetupFeeSecondHalfPaid
            
            it[billingYear] = project.billingYear
            it[completionYear] = project.completionYear

            it[projectNotes] = project.projectNotes
        }
        project
    }

    override suspend fun getProjectById(id: UUID): Project? = dbQuery {
        ProjectsTable
            .selectAll()
            .where { ProjectsTable.id eq id }
            .map(::resultRowToProject)
            .singleOrNull()
    }

    override suspend fun getAllProjects(): List<Project> = dbQuery {
        ProjectsTable.selectAll().map(::resultRowToProject)
    }

    override suspend fun updateProject(project: Project): Project? = dbQuery {
        val updatedRows = ProjectsTable.update({ ProjectsTable.id eq project.id }) {
            it[companyName] = project.companyName
            it[projectName] = project.projectName
            it[companySize] = project.companySize
            it[industry] = project.industry
            it[contactName] = project.contactName
            it[contactEmail] = project.contactEmail
            it[contactChannel] = project.contactChannel
            it[status] = project.status
            it[firstContactDate] = project.firstContactDate
            it[lastContactDate] = project.lastContactDate
            it[nextMeetingDate] = project.nextMeetingDate
            it[closedDate] = project.closedDate
            it[quotedPrice] = project.quotedPrice
            it[counterOfferPrice] = project.counterOfferPrice
            it[finalPrice] = project.finalPrice
            it[generatedRevenue] = project.generatedRevenue
            it[projectedRevenue] = project.projectedRevenue
            it[operationalCosts] = project.operationalCosts
            
            it[projectType] = project.projectType
            it[recurringRevenue] = project.recurringRevenue
            it[recurringFrequency] = project.recurringFrequency
            it[isSetupFeeFirstHalfPaid] = project.isSetupFeeFirstHalfPaid
            it[isSetupFeeSecondHalfPaid] = project.isSetupFeeSecondHalfPaid
            
            it[billingYear] = project.billingYear
            it[completionYear] = project.completionYear

            it[projectNotes] = project.projectNotes
        }
        if (updatedRows > 0) project else null
    }
}

package com.logikamobile.crm.infrastructure.database

import com.logikamobile.crm.application.ports.out.ProjectRepositoryPort
import com.logikamobile.crm.domain.Project
import com.logikamobile.crm.infrastructure.database.DatabaseFactory.dbQuery
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import java.util.UUID
import java.math.BigDecimal

class MultiplyOp(val expr1: Expression<*>, val expr2: Expression<*>) : ExpressionWithColumnType<Double>() {
    override val columnType = DoubleColumnType()
    override fun toQueryBuilder(queryBuilder: QueryBuilder) {
        queryBuilder.append("(")
        expr1.toQueryBuilder(queryBuilder)
        queryBuilder.append(" * ")
        expr2.toQueryBuilder(queryBuilder)
        queryBuilder.append(")")
    }
}

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

        isLegacy = row[ProjectsTable.isLegacy],
        developerCosts = try { row[Expression.build { Sum(MultiplyOp(ProjectAssignmentsTable.allocatedHours, DevelopersTable.hourlyRate), DoubleColumnType()) }]?.let { BigDecimal(it.toString()) } ?: BigDecimal.ZERO } catch (e: Exception) { BigDecimal.ZERO },

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

            it[isLegacy] = project.isLegacy

            it[projectNotes] = project.projectNotes
        }
        project
    }

    override suspend fun getProjectById(id: UUID): Project? = dbQuery {
        ProjectsTable
            .join(ProjectAssignmentsTable, JoinType.LEFT, onColumn = ProjectsTable.id, otherColumn = ProjectAssignmentsTable.legacyProjectId)
            .join(DevelopersTable, JoinType.LEFT, onColumn = ProjectAssignmentsTable.developerId, otherColumn = DevelopersTable.id)
            .select(ProjectsTable.columns + Sum(MultiplyOp(ProjectAssignmentsTable.allocatedHours, DevelopersTable.hourlyRate), DoubleColumnType()))
            .where { ProjectsTable.id eq id }
            .groupBy(*ProjectsTable.columns.toTypedArray())
            .map(::resultRowToProject)
            .singleOrNull()
    }

    override suspend fun getAllProjects(): List<Project> = dbQuery {
        ProjectsTable
            .join(ProjectAssignmentsTable, JoinType.LEFT, onColumn = ProjectsTable.id, otherColumn = ProjectAssignmentsTable.legacyProjectId)
            .join(DevelopersTable, JoinType.LEFT, onColumn = ProjectAssignmentsTable.developerId, otherColumn = DevelopersTable.id)
            .select(ProjectsTable.columns + Sum(MultiplyOp(ProjectAssignmentsTable.allocatedHours, DevelopersTable.hourlyRate), DoubleColumnType()))
            .groupBy(*ProjectsTable.columns.toTypedArray())
            .map(::resultRowToProject)
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
            
            it[isLegacy] = project.isLegacy

            it[projectNotes] = project.projectNotes
        }
        if (updatedRows > 0) project else null
    }
}

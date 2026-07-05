package com.logikamobile.crm.infrastructure.database

import com.logikamobile.crm.application.ports.out.LmaasRepositoryPort
import com.logikamobile.crm.domain.LmaasLead
import com.logikamobile.crm.domain.LmaasSubscription
import com.logikamobile.crm.domain.LmaasTicket
import com.logikamobile.crm.infrastructure.database.DatabaseFactory.dbQuery
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import java.util.UUID

class PostgresLmaasRepository : LmaasRepositoryPort {

    private fun resultRowToLead(row: ResultRow) = LmaasLead(
        id = row[LmaasLeadsTable.id],
        companyName = row[LmaasLeadsTable.companyName],
        contactName = row[LmaasLeadsTable.contactName],
        emails = row[LmaasLeadsTable.emails].split(",").filter { it.isNotBlank() },
        status = row[LmaasLeadsTable.status],
        createdAt = row[LmaasLeadsTable.createdAt],
        updatedAt = row[LmaasLeadsTable.updatedAt]
    )

    private fun resultRowToSubscription(row: ResultRow) = LmaasSubscription(
        id = row[LmaasSubscriptionsTable.id],
        leadId = row[LmaasSubscriptionsTable.leadId],
        tier = row[LmaasSubscriptionsTable.tier],
        billingCycle = row[LmaasSubscriptionsTable.billingCycle],
        monthlyFee = row[LmaasSubscriptionsTable.monthlyFee],
        annualizedValue = row[LmaasSubscriptionsTable.annualizedValue],
        generatedRevenue = row[LmaasSubscriptionsTable.generatedRevenue],
        operatingCosts = row[LmaasSubscriptionsTable.operatingCosts]
    )

    private fun resultRowToTicket(row: ResultRow) = LmaasTicket(
        id = row[LmaasTicketsTable.id],
        subscriptionId = row[LmaasTicketsTable.subscriptionId],
        title = row[LmaasTicketsTable.title],
        status = row[LmaasTicketsTable.status],
        estimatedHours = row[LmaasTicketsTable.estimatedHours],
        createdAt = row[LmaasTicketsTable.createdAt],
        deliveredAt = row[LmaasTicketsTable.deliveredAt]
    )

    override suspend fun createLead(lead: LmaasLead): LmaasLead = dbQuery {
        LmaasLeadsTable.insert {
            it[id] = lead.id
            it[companyName] = lead.companyName
            it[contactName] = lead.contactName
            it[emails] = lead.emails.joinToString(",")
            it[status] = lead.status
            it[createdAt] = lead.createdAt
            it[updatedAt] = lead.updatedAt
        }
        lead
    }

    override suspend fun getLeadById(id: UUID): LmaasLead? = dbQuery {
        LmaasLeadsTable.selectAll().where { LmaasLeadsTable.id eq id }.map(::resultRowToLead).singleOrNull()
    }

    override suspend fun getAllLeads(): List<LmaasLead> = dbQuery {
        LmaasLeadsTable.selectAll().map(::resultRowToLead)
    }

    override suspend fun updateLead(lead: LmaasLead): LmaasLead? = dbQuery {
        val updatedRows = LmaasLeadsTable.update({ LmaasLeadsTable.id eq lead.id }) {
            it[companyName] = lead.companyName
            it[contactName] = lead.contactName
            it[emails] = lead.emails.joinToString(",")
            it[status] = lead.status
            it[updatedAt] = lead.updatedAt
        }
        if (updatedRows > 0) lead else null
    }

    override suspend fun createSubscription(subscription: LmaasSubscription): LmaasSubscription = dbQuery {
        LmaasSubscriptionsTable.insert {
            it[id] = subscription.id
            it[leadId] = subscription.leadId
            it[tier] = subscription.tier
            it[billingCycle] = subscription.billingCycle
            it[monthlyFee] = subscription.monthlyFee
            it[annualizedValue] = subscription.annualizedValue
            it[generatedRevenue] = subscription.generatedRevenue
            it[operatingCosts] = subscription.operatingCosts
        }
        subscription
    }

    override suspend fun getSubscriptionByLeadId(leadId: UUID): LmaasSubscription? = dbQuery {
        LmaasSubscriptionsTable.selectAll().where { LmaasSubscriptionsTable.leadId eq leadId }.map(::resultRowToSubscription).singleOrNull()
    }

    override suspend fun updateSubscription(subscription: LmaasSubscription): LmaasSubscription? = dbQuery {
        val updatedRows = LmaasSubscriptionsTable.update({ LmaasSubscriptionsTable.id eq subscription.id }) {
            it[tier] = subscription.tier
            it[billingCycle] = subscription.billingCycle
            it[monthlyFee] = subscription.monthlyFee
            it[annualizedValue] = subscription.annualizedValue
            it[generatedRevenue] = subscription.generatedRevenue
            it[operatingCosts] = subscription.operatingCosts
        }
        if (updatedRows > 0) subscription else null
    }

    override suspend fun createTicket(ticket: LmaasTicket): LmaasTicket = dbQuery {
        LmaasTicketsTable.insert {
            it[id] = ticket.id
            it[subscriptionId] = ticket.subscriptionId
            it[title] = ticket.title
            it[status] = ticket.status
            it[estimatedHours] = ticket.estimatedHours
            it[createdAt] = ticket.createdAt
            it[deliveredAt] = ticket.deliveredAt
        }
        ticket
    }

    override suspend fun getTicketsBySubscriptionId(subscriptionId: UUID): List<LmaasTicket> = dbQuery {
        LmaasTicketsTable.selectAll().where { LmaasTicketsTable.subscriptionId eq subscriptionId }.map(::resultRowToTicket)
    }

    override suspend fun getAllTickets(): List<LmaasTicket> = dbQuery {
        LmaasTicketsTable.selectAll().map(::resultRowToTicket)
    }

    override suspend fun updateTicket(ticket: LmaasTicket): LmaasTicket? = dbQuery {
        val updatedRows = LmaasTicketsTable.update({ LmaasTicketsTable.id eq ticket.id }) {
            it[title] = ticket.title
            it[status] = ticket.status
            it[estimatedHours] = ticket.estimatedHours
            it[deliveredAt] = ticket.deliveredAt
        }
        if (updatedRows > 0) ticket else null
    }
}

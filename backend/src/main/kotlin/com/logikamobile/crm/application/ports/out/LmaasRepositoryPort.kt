package com.logikamobile.crm.application.ports.out

import com.logikamobile.crm.domain.LmaasLead
import com.logikamobile.crm.domain.LmaasSubscription
import com.logikamobile.crm.domain.LmaasTicket
import java.util.UUID

interface LmaasRepositoryPort {
    suspend fun createLead(lead: LmaasLead): LmaasLead
    suspend fun getLeadById(id: UUID): LmaasLead?
    suspend fun getAllLeads(): List<LmaasLead>
    suspend fun updateLead(lead: LmaasLead): LmaasLead?
    
    suspend fun createSubscription(subscription: LmaasSubscription): LmaasSubscription
    suspend fun getSubscriptionByLeadId(leadId: UUID): LmaasSubscription?
    suspend fun updateSubscription(subscription: LmaasSubscription): LmaasSubscription?
    
    suspend fun createTicket(ticket: LmaasTicket): LmaasTicket
    suspend fun getTicketsBySubscriptionId(subscriptionId: UUID): List<LmaasTicket>
    suspend fun getAllTickets(): List<LmaasTicket>
    suspend fun updateTicket(ticket: LmaasTicket): LmaasTicket?
}

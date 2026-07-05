package com.logikamobile.crm.infrastructure.database

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.timestamp

object LmaasLeadsTable : Table("lmaas_leads") {
    val id = uuid("id")
    val companyName = varchar("company_name", 255)
    val contactName = varchar("contact_name", 255)
    val emails = text("emails") // Comma-separated or JSON
    val status = varchar("status", 50)
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")

    override val primaryKey = PrimaryKey(id)
}

object LmaasSubscriptionsTable : Table("lmaas_subscriptions") {
    val id = uuid("id")
    val leadId = uuid("lead_id").references(LmaasLeadsTable.id)
    val tier = varchar("tier", 50)
    val billingCycle = varchar("billing_cycle", 50)
    val monthlyFee = decimal("monthly_fee", 15, 2)
    val annualizedValue = decimal("annualized_value", 15, 2)
    val generatedRevenue = decimal("generated_revenue", 15, 2)
    val operatingCosts = decimal("operating_costs", 15, 2).default(java.math.BigDecimal.ZERO)

    override val primaryKey = PrimaryKey(id)
}

object LmaasTicketsTable : Table("lmaas_tickets") {
    val id = uuid("id")
    val subscriptionId = uuid("subscription_id").references(LmaasSubscriptionsTable.id)
    val title = varchar("title", 255)
    val status = varchar("status", 50)
    val estimatedHours = integer("estimated_hours")
    val createdAt = timestamp("created_at")
    val deliveredAt = timestamp("delivered_at").nullable()

    override val primaryKey = PrimaryKey(id)
}

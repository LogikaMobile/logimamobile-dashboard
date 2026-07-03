package com.logikamobile.crm.infrastructure.database

import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.Column
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.timestamp
import org.postgresql.util.PGobject

// Extension for jsonb support in Exposed
fun Table.jsonb(name: String): Column<String> {
    return registerColumn(name, JsonbColumnType())
}

class JsonbColumnType : org.jetbrains.exposed.sql.ColumnType<String>() {
    override fun sqlType(): String = "jsonb"

    override fun setParameter(stmt: org.jetbrains.exposed.sql.statements.api.PreparedStatementApi, index: Int, value: Any?) {
        val obj = org.postgresql.util.PGobject()
        obj.type = "jsonb"
        obj.value = value as String?
        stmt[index] = obj
    }

    override fun valueFromDB(value: Any): String {
        if (value is org.postgresql.util.PGobject) {
            return value.value ?: ""
        }
        return value.toString()
    }
}


object ProjectsTable : UUIDTable("projects") {
    // Empresa
    val companyName = varchar("company_name", 255)
    val companySize = varchar("company_size", 50).nullable()
    val industry = varchar("industry", 100).nullable()
    
    // Contacto
    val contactName = varchar("contact_name", 255)
    val contactChannel = varchar("contact_channel", 50)
    
    // Estado Operativo
    val status = varchar("status", 50) // Prospectado, Contactado, Demo, Cerrado, Rechazado, Entregado
    
    // Fechas
    val firstContactDate = timestamp("first_contact_date")
    val lastContactDate = timestamp("last_contact_date")
    val nextMeetingDate = timestamp("next_meeting_date").nullable()
    val closedDate = timestamp("closed_date").nullable()
    
    // Finanzas
    val quotedPrice = decimal("quoted_price", 12, 2).nullable()
    val counterOfferPrice = decimal("counter_offer_price", 12, 2).nullable()
    val finalPrice = decimal("final_price", 12, 2).nullable()
    val generatedRevenue = decimal("generated_revenue", 12, 2).default(java.math.BigDecimal.ZERO)
    val projectedRevenue = decimal("projected_revenue", 12, 2).default(java.math.BigDecimal.ZERO)
    val operationalCosts = decimal("operational_costs", 12, 2).default(java.math.BigDecimal.ZERO)
    
    // SaaS / Business Logic
    val projectType = varchar("project_type", 50).nullable() // SAAS or ONE_TIME
    val recurringRevenue = decimal("recurring_revenue", 12, 2).nullable()
    val recurringFrequency = varchar("recurring_frequency", 50).nullable() // MONTHLY or ANNUAL
    val isSetupFeeFirstHalfPaid = bool("is_setup_fee_first_half_paid").default(false)
    val isSetupFeeSecondHalfPaid = bool("is_setup_fee_second_half_paid").default(false)
    
    // Filtros de reportes
    val billingYear = integer("billing_year").nullable()
    val completionYear = integer("completion_year").nullable()

    
    // Contexto (jsonb para queries analíticas en PostgreSQL)
    val projectNotes = jsonb("project_notes").nullable()
}

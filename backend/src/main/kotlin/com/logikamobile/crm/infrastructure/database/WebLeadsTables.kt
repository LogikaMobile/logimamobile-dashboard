package com.logikamobile.crm.infrastructure.database

import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.javatime.timestamp

object WebLeadsLmaasTable : UUIDTable("web_leads_lmaas") {
    val contactName = varchar("contact_name", 255)
    val contactEmail = varchar("contact_email", 255)
    val contactPhone = varchar("contact_phone", 50).nullable()
    val contactPreference = varchar("contact_preference", 50).nullable()
    val companySizeText = varchar("company_size_text", 100).nullable()
    val infraAddon = bool("infra_addon").default(false)
    val billingCycle = varchar("billing_cycle", 50).nullable()
    val finalPrice = integer("final_price").nullable()
    val gclid = varchar("gclid", 255).nullable()
    
    val status = varchar("status", 50).default("NEW")
    val createdAt = timestamp("created_at")
}

object WebLeadsTraditionalTable : UUIDTable("web_leads_traditional") {
    val contactName = varchar("contact_name", 255)
    val contactEmail = varchar("contact_email", 255)
    val contactPhone = varchar("contact_phone", 50).nullable()
    val contactPreference = varchar("contact_preference", 50).nullable()
    
    val projectDescription = text("project_description").nullable()
    val typesText = varchar("types_text", 255).nullable()
    val originText = varchar("origin_text", 255).nullable()
    val companySizeText = varchar("company_size_text", 100).nullable()
    val complexityText = varchar("complexity_text", 100).nullable()
    val uxuiText = varchar("uxui_text", 100).nullable()
    val integrationsText = varchar("integrations_text", 100).nullable()
    val urgencyText = varchar("urgency_text", 100).nullable()
    val rangeText = varchar("range_text", 100).nullable()
    val gclid = varchar("gclid", 255).nullable()
    
    val status = varchar("status", 50).default("NEW")
    val createdAt = timestamp("created_at")
}

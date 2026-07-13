package com.logikamobile.crm.infrastructure.database

import com.logikamobile.crm.domain.models.LmaasWebLeadDto
import com.logikamobile.crm.domain.models.TraditionalWebLeadDto
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.Instant

class WebLeadsRepository {

    fun createLmaasLead(dto: LmaasWebLeadDto): String? {
        return transaction {
            try {
                val id = WebLeadsLmaasTable.insert {
                    it[contactName] = dto.contactName
                    it[contactEmail] = dto.contactEmail
                    it[contactPhone] = dto.contactPhone
                    it[contactPreference] = dto.contactPreference
                    it[companySizeText] = dto.companySizeText
                    it[infraAddon] = dto.infraAddon
                    it[billingCycle] = dto.billingCycle
                    it[finalPrice] = dto.finalPrice
                    it[gclid] = dto.gclid
                    it[status] = "NEW"
                    it[createdAt] = Instant.now()
                }
                id[WebLeadsLmaasTable.id].value.toString()
            } catch (e: Exception) {
                e.printStackTrace()
                null
            }
        }
    }

    fun createTraditionalLead(dto: TraditionalWebLeadDto): String? {
        return transaction {
            try {
                val id = WebLeadsTraditionalTable.insert {
                    it[contactName] = dto.contactName
                    it[contactEmail] = dto.contactEmail
                    it[contactPhone] = dto.contactPhone
                    it[contactPreference] = dto.contactPreference
                    it[projectDescription] = dto.projectDescription
                    it[typesText] = dto.typesText
                    it[originText] = dto.originText
                    it[companySizeText] = dto.companySizeText
                    it[complexityText] = dto.complexityText
                    it[uxuiText] = dto.uxuiText
                    it[integrationsText] = dto.integrationsText
                    it[urgencyText] = dto.urgencyText
                    it[rangeText] = dto.rangeText
                    it[gclid] = dto.gclid
                    it[status] = "NEW"
                    it[createdAt] = Instant.now()
                }
                id[WebLeadsTraditionalTable.id].value.toString()
            } catch (e: Exception) {
                e.printStackTrace()
                null
            }
        }
    }
}

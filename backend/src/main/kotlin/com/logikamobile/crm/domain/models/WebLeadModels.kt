package com.logikamobile.crm.domain.models

import kotlinx.serialization.Serializable

@Serializable
data class LmaasWebLeadDto(
    val contactName: String,
    val contactEmail: String,
    val contactPhone: String? = null,
    val contactPreference: String? = null,
    val companySizeText: String? = null,
    val infraAddon: Boolean = false,
    val billingCycle: String? = null,
    val finalPrice: Int? = null,
    val websiteUrl: String = "", // Honeypot
    val gclid: String? = null
)

@Serializable
data class TraditionalWebLeadDto(
    val contactName: String,
    val contactEmail: String,
    val contactPhone: String? = null,
    val contactPreference: String? = null,
    val projectDescription: String? = null,
    val typesText: String? = null,
    val originText: String? = null,
    val companySizeText: String? = null,
    val complexityText: String? = null,
    val uxuiText: String? = null,
    val integrationsText: String? = null,
    val urgencyText: String? = null,
    val rangeText: String? = null,
    val websiteUrl: String = "", // Honeypot
    val gclid: String? = null
)

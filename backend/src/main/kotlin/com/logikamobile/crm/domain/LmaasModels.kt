package com.logikamobile.crm.domain

import java.math.BigDecimal
import java.time.Instant
import java.util.UUID
import kotlinx.serialization.Serializable
import kotlinx.serialization.KSerializer
import kotlinx.serialization.descriptors.PrimitiveKind
import kotlinx.serialization.descriptors.PrimitiveSerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder

enum class LmaasStatus {
    STEP_0, STEP_1, STEP_2, STEP_3, STEP_4, STEP_5, STEP_6, STEP_7, STEP_8
}

enum class LmaasTier {
    TIER_1, TIER_2, TIER_3
}

enum class BillingCycle {
    MONTHLY, ANNUAL
}

enum class TicketStatus {
    BACKLOG, DEVELOPMENT, QA, COOLDOWN, DELIVERED
}

@Serializable
data class LmaasLead(
    @Serializable(with = UUIDSerializer::class)
    val id: UUID = UUID.randomUUID(),
    val companyName: String,
    val projectName: String? = null,
    val contactName: String,
    val emails: List<String>,
    val status: String, // String representation of LmaasStatus
    @Serializable(with = InstantSerializer::class)
    val createdAt: Instant = Instant.now(),
    @Serializable(with = InstantSerializer::class)
    val updatedAt: Instant = Instant.now()
)

@Serializable
data class LmaasSubscription(
    @Serializable(with = UUIDSerializer::class)
    val id: UUID = UUID.randomUUID(),
    @Serializable(with = UUIDSerializer::class)
    val leadId: UUID,
    val tier: String,
    val billingCycle: String,
    @Serializable(with = BigDecimalSerializer::class)
    val monthlyFee: BigDecimal,
    @Serializable(with = BigDecimalSerializer::class)
    val annualizedValue: BigDecimal,
    @Serializable(with = BigDecimalSerializer::class)
    val generatedRevenue: BigDecimal = BigDecimal.ZERO,
    @Serializable(with = BigDecimalSerializer::class)
    val operatingCosts: BigDecimal = BigDecimal.ZERO
)

@Serializable
data class LmaasTicket(
    @Serializable(with = UUIDSerializer::class)
    val id: UUID = UUID.randomUUID(),
    @Serializable(with = UUIDSerializer::class)
    val subscriptionId: UUID,
    val title: String,
    val status: String,
    val estimatedHours: Int,
    @Serializable(with = InstantSerializer::class)
    val createdAt: Instant = Instant.now(),
    @Serializable(with = InstantSerializer::class)
    val deliveredAt: Instant? = null
)

package com.logikamobile.crm.domain

import java.math.BigDecimal
import java.time.Instant
import java.util.UUID
import kotlinx.serialization.Serializable
import kotlinx.serialization.KSerializer
import kotlinx.serialization.descriptors.PrimitiveKind
import kotlinx.serialization.descriptors.PrimitiveSerialDescriptor
import kotlinx.serialization.descriptors.SerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder

// Custom serializers for standard java types missing in kotlinx.serialization
object UUIDSerializer : KSerializer<UUID> {
    override val descriptor = PrimitiveSerialDescriptor("UUID", PrimitiveKind.STRING)
    override fun deserialize(decoder: Decoder): UUID = UUID.fromString(decoder.decodeString())
    override fun serialize(encoder: Encoder, value: UUID) = encoder.encodeString(value.toString())
}

object InstantSerializer : KSerializer<Instant> {
    override val descriptor = PrimitiveSerialDescriptor("Instant", PrimitiveKind.STRING)
    override fun deserialize(decoder: Decoder): Instant = Instant.parse(decoder.decodeString())
    override fun serialize(encoder: Encoder, value: Instant) = encoder.encodeString(value.toString())
}

object BigDecimalSerializer : KSerializer<BigDecimal> {
    override val descriptor = PrimitiveSerialDescriptor("BigDecimal", PrimitiveKind.STRING)
    override fun deserialize(decoder: Decoder): BigDecimal = BigDecimal(decoder.decodeString())
    override fun serialize(encoder: Encoder, value: BigDecimal) = encoder.encodeString(value.toPlainString())
}

@Serializable
data class Project(
    @Serializable(with = UUIDSerializer::class)
    val id: UUID = UUID.randomUUID(),
    
    val companyName: String,
    val companySize: String? = null,
    val industry: String? = null,
    
    val contactName: String,
    val contactEmail: String? = null,
    val contactChannel: String,
    
    val status: String,
    
    @Serializable(with = InstantSerializer::class)
    val firstContactDate: Instant,
    @Serializable(with = InstantSerializer::class)
    val lastContactDate: Instant,
    @Serializable(with = InstantSerializer::class)
    val nextMeetingDate: Instant? = null,
    @Serializable(with = InstantSerializer::class)
    val closedDate: Instant? = null,
    
    @Serializable(with = BigDecimalSerializer::class)
    val quotedPrice: BigDecimal? = null,
    @Serializable(with = BigDecimalSerializer::class)
    val counterOfferPrice: BigDecimal? = null,
    @Serializable(with = BigDecimalSerializer::class)
    val finalPrice: BigDecimal? = null,
    @Serializable(with = BigDecimalSerializer::class)
    val generatedRevenue: BigDecimal = BigDecimal.ZERO,
    @Serializable(with = BigDecimalSerializer::class)
    val projectedRevenue: BigDecimal = BigDecimal.ZERO,
    @Serializable(with = BigDecimalSerializer::class)
    val operationalCosts: BigDecimal = BigDecimal.ZERO,
    
    val projectType: String? = null,
    @Serializable(with = BigDecimalSerializer::class)
    val recurringRevenue: BigDecimal? = null,
    val recurringFrequency: String? = null,
    val isSetupFeeFirstHalfPaid: Boolean = false,
    val isSetupFeeSecondHalfPaid: Boolean = false,
    
    val billingYear: Int? = null,
    val completionYear: Int? = null,
    
    val projectNotes: String? = null // Jsonb stored as string in domain for simplicity, parsed when needed
)

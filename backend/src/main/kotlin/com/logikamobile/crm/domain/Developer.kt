package com.logikamobile.crm.domain

import kotlinx.serialization.Serializable

@Serializable
data class Developer(
    val id: String = "",
    val name: String,
    val email: String? = null,
    val role: String = "ENGINEER", // ADMIN or ENGINEER
    val jobTitle: String, // e.g. "Senior Android Dev"
    val hourlyRate: Double,
    val availableHoursPerMonth: Int,
    val isActive: Boolean = true,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

@Serializable
data class ProjectAssignment(
    val id: String = "",
    val developerId: String,
    val legacyProjectId: String? = null,
    val lmaasLeadId: String? = null,
    val assignmentType: String = "FIXED",
    val assignedMonth: Int,
    val assignedYear: Int,
    val allocatedHours: Int,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

@Serializable
data class ProjectAssignmentWithDetails(
    val assignment: ProjectAssignment,
    val projectName: String,
    val projectType: String, // "LEGACY" or "LMAAS"
    val developer: Developer? = null
)

@Serializable
data class DeveloperWithFinancials(
    val developer: Developer,
    val month: Int,
    val year: Int,
    val usedHours: Int,
    val remuneration: Double,
    val assignments: List<ProjectAssignmentWithDetails> = emptyList()
)

@Serializable
data class CreateDeveloperDto(
    val name: String,
    val email: String? = null,
    val role: String = "ENGINEER",
    val jobTitle: String,
    val hourlyRate: Double,
    val availableHoursPerMonth: Int
)

@Serializable
data class CreateProjectAssignmentDto(
    val developerId: String,
    val legacyProjectId: String? = null,
    val lmaasLeadId: String? = null,
    val assignmentType: String = "FIXED",
    val assignedMonth: Int,
    val assignedYear: Int,
    val allocatedHours: Int
)

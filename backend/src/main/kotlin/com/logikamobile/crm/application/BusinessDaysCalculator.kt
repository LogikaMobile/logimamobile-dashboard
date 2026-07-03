package com.logikamobile.crm.application

import java.time.DayOfWeek
import java.time.LocalDate

object BusinessDaysCalculator {
    /**
     * Checks if the given date is within the first N business days of its month.
     * Business days are Monday through Friday.
     */
    fun isWithinFirstBusinessDaysOfMonth(date: LocalDate, maxBusinessDays: Int): Boolean {
        val firstDayOfMonth = date.withDayOfMonth(1)
        var businessDaysCount = 0
        var currentDay = firstDayOfMonth

        while (currentDay.isBefore(date) || currentDay.isEqual(date)) {
            if (currentDay.dayOfWeek != DayOfWeek.SATURDAY && currentDay.dayOfWeek != DayOfWeek.SUNDAY) {
                businessDaysCount++
            }
            if (currentDay.isEqual(date)) {
                break
            }
            currentDay = currentDay.plusDays(1)
        }

        return businessDaysCount <= maxBusinessDays
    }
}

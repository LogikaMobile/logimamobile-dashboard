package com.logikamobile.crm

import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlin.test.*

class ApplicationTest {
    @Test
    fun testRoot() = testApplication {
        application {
            module()
        }
        val response = client.get("/projects")
        assertEquals(HttpStatusCode.OK, response.status)
        // Se espera un array JSON (vacío al inicio)
        assertTrue(response.bodyAsText().startsWith("["))
    }
}

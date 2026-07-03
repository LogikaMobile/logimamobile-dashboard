package com.logikamobile.crm.application.ports.`in`

/**
 * Puerto de entrada (Use Case) que será expuesto como un Webhook
 * para recibir notificaciones Push de Google Drive.
 */
interface GoogleDriveWebhookUseCase {
    /**
     * Procesa la notificación push de Drive cuando se genera una nueva transcripción.
     * 
     * @param resourceId ID del recurso de Google que generó el evento.
     * @param fileId ID del archivo de transcripción generado.
     */
    suspend fun handleTranscriptPushNotification(resourceId: String, fileId: String)
}

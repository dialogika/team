/**
 * Centralized WhatsApp Message Builder
 * Builds all WhatsApp messages using centralized template system
 */

import {
    getStoredTemplates,
    interpolateTemplate,
    buildMessageFromTemplate,
    getTemplateIdForStageMode
} from "./template-manager.js";

/**
 * Build interview WhatsApp message
 * @param {Object} options - Build options
 * @param {string} options.candidateName - Candidate name
 * @param {string} options.positionName - Position name
 * @param {string} options.interviewDate - Formatted interview date
 * @param {string} options.interviewTime - Interview time
 * @param {string} options.mode - 'online' or 'offline'
 * @param {string} options.meetingLink - Meeting link (for online)
 * @param {string} options.interviewLocation - Interview location (for offline)
 * @returns {string|null} Generated WhatsApp message
 */
export function buildInterviewMessage(options = {}) {
    const {
        candidateName = "Kandidat",
        positionName = "Admin Marketing Intern",
        interviewDate = "-",
        interviewTime = "-",
        mode = "online",
        meetingLink = "",
        interviewLocation = ""
    } = options;

    const templateId = getTemplateIdForStageMode("interview", mode);
    if (!templateId) {
        console.warn("No template found for interview mode:", mode);
        return null;
    }

    const tokens = {
        candidate_name: candidateName,
        position_name: positionName,
        interview_date: interviewDate,
        interview_time: interviewTime,
        meeting_link: meetingLink,
        interview_location: interviewLocation
    };

    return buildMessageFromTemplate(templateId, tokens);
}

/**
 * Build micro teaching WhatsApp message
 * @param {Object} options - Build options
 * @param {string} options.candidateName - Candidate name
 * @param {string} options.microTeachingDate - Formatted micro teaching date
 * @param {string} options.microTeachingTime - Micro teaching time
 * @param {string} options.mode - 'online' or 'offline'
 * @param {string} options.meetingLink - Meeting link (for online)
 * @param {string} options.microTeachingLocation - Micro teaching location (for offline)
 * @returns {string|null} Generated WhatsApp message
 */
export function buildMicroTeachingMessage(options = {}) {
    const {
        candidateName = "Kandidat",
        microTeachingDate = "-",
        microTeachingTime = "-",
        mode = "online",
        meetingLink = "",
        microTeachingLocation = ""
    } = options;

    const templateId = getTemplateIdForStageMode("micro_teaching", mode);
    if (!templateId) {
        console.warn("No template found for micro teaching mode:", mode);
        return null;
    }

    const tokens = {
        candidate_name: candidateName,
        micro_teaching_date: microTeachingDate,
        micro_teaching_time: microTeachingTime,
        meeting_link: meetingLink,
        micro_teaching_location: microTeachingLocation
    };

    return buildMessageFromTemplate(templateId, tokens);
}

/**
 * Build accepted WhatsApp message
 * @param {Object} options - Build options
 * @param {string} options.candidateName - Candidate name
 * @returns {string|null} Generated WhatsApp message
 */
export function buildAcceptedMessage(options = {}) {
    const { candidateName = "Kandidat" } = options;

    const tokens = {
        candidate_name: candidateName
    };

    return buildMessageFromTemplate("accepted", tokens);
}

/**
 * Build rejected WhatsApp message
 * @param {Object} options - Build options
 * @param {string} options.candidateName - Candidate name
 * @returns {string|null} Generated WhatsApp message
 */
export function buildRejectedMessage(options = {}) {
    const { candidateName = "Kandidat" } = options;

    const tokens = {
        candidate_name: candidateName
    };

    return buildMessageFromTemplate("rejected", tokens);
}

/**
 * Build any template message with custom tokens
 * @param {string} templateId - Template ID
 * @param {Object} tokens - Custom token values
 * @returns {string|null} Generated message
 */
export function buildCustomMessage(templateId, tokens = {}) {
    return buildMessageFromTemplate(templateId, tokens);
}

/**
 * Get all available message builders
 * Returns object with builder functions for each template type
 * @returns {Object} Builders map
 */
export function getMessageBuilders() {
    return {
        interview_online: (options) => buildInterviewMessage({ ...options, mode: "online" }),
        interview_offline: (options) => buildInterviewMessage({ ...options, mode: "offline" }),
        micro_teaching_online: (options) => buildMicroTeachingMessage({ ...options, mode: "online" }),
        micro_teaching_offline: (options) => buildMicroTeachingMessage({ ...options, mode: "offline" }),
        accepted: buildAcceptedMessage,
        rejected: buildRejectedMessage,
        custom: buildCustomMessage
    };
}

/**
 * Preview template with sample tokens
 * Useful for template editor previews
 * @param {string} templateId - Template ID
 * @param {Object} sampleTokens - Sample token values
 * @returns {string|null} Preview message
 */
export function previewTemplate(templateId, sampleTokens = {}) {
    const defaults = {
        candidate_name: "Nama Kandidat",
        position_name: "Posisi",
        interview_date: "Hari, Tanggal Bulan Tahun",
        interview_time: "HH:MM",
        interview_location: "Alamat Lokasi",
        meeting_link: "https://meet.example.com/xyz",
        micro_teaching_date: "Hari, Tanggal Bulan Tahun",
        micro_teaching_time: "HH:MM",
        micro_teaching_location: "Alamat Lokasi"
    };

    const tokens = { ...defaults, ...sampleTokens };
    return buildMessageFromTemplate(templateId, tokens);
}

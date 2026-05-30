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
 * Build On Job Training (OJT) WhatsApp message
 * @param {Object} options - Build options
 * @param {string} options.candidateName - Candidate name
 * @param {string} options.ojtDate - Formatted OJT date (range)
 * @param {string} options.ojtTime - OJT time
 * @param {string} options.mode - 'online' or 'offline'
 * @param {string} options.meetingLink - Meeting link (for online)
 * @param {string} options.ojtLocation - OJT location (for offline)
 * @returns {string|null} Generated WhatsApp message
 */
export function buildOnJobTrainingMessage(options = {}) {
    const {
        candidateName = "Kandidat",
        ojtDate = "-",
        ojtTime = "-",
        mode = "online",
        meetingLink = "",
        ojtLocation = ""
    } = options;

    const templateId = getTemplateIdForStageMode("on_job_training", mode);
    if (!templateId) {
        console.warn("No template found for On Job Training mode:", mode);
        return null;
    }

    const tokens = {
        candidate_name: candidateName,
        ojt_date: ojtDate,
        ojt_time: ojtTime,
        meeting_link: meetingLink,
        ojt_location: ojtLocation
    };

    return buildMessageFromTemplate(templateId, tokens);
}

/**
 * Build micro teaching WhatsApp message (backward-compatible wrapper)
 * @param {Object} options - Build options
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

    return buildOnJobTrainingMessage({
        candidateName,
        ojtDate: microTeachingDate,
        ojtTime: microTeachingTime,
        mode,
        meetingLink,
        ojtLocation: microTeachingLocation
    });
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
        micro_teaching_online: (options) => buildOnJobTrainingMessage({ ...options, mode: "online" }),
        micro_teaching_offline: (options) => buildOnJobTrainingMessage({ ...options, mode: "offline" }),
        on_job_training_online: (options) => buildOnJobTrainingMessage({ ...options, mode: "online" }),
        on_job_training_offline: (options) => buildOnJobTrainingMessage({ ...options, mode: "offline" }),
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
        ojt_date: "Hari, Tanggal Bulan Tahun",
        ojt_time: "HH:MM",
        ojt_location: "Alamat Lokasi",
        micro_teaching_date: "Hari, Tanggal Bulan Tahun",
        micro_teaching_time: "HH:MM",
        micro_teaching_location: "Alamat Lokasi"
    };

    const tokens = { ...defaults, ...sampleTokens };
    return buildMessageFromTemplate(templateId, tokens);
}

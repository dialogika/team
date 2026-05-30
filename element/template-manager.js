/**
 * Centralized Template Manager for Recruitment WhatsApp System
 * Handles template definitions, storage, interpolation, and persistence
 * Compatible with both internship and mentor recruitment workflows
 */

/**
 * Template definitions with metadata for all recruitment stages
 */
export const TEMPLATE_DEFINITIONS = [
    {
        id: "interview_online",
        title: "Interview Online",
        description: "Template untuk undangan interview online.",
        stage: "interview",
        mode: "online",
        requiredTokens: ["{candidate_name}", "{interview_date}", "{interview_time}", "{meeting_link}"],
        defaultTemplate: "*[REKRUTMEN DIALOGIKA]*\n\nHalo Kak {candidate_name}!\n\nTerima kasih sudah mengikuti tahapan rekrutmen di Dialogika dengan antusias. Selanjutnya, kami ucapkan selamat karena Kakak telah lolos pada tahap screening!\n\nMaka dari itu, kami mengundang Kakak untuk mengikuti tahapan selanjutnya, yaitu wawancara secara online dan verifikasi jadwal yang akan dilaksanakan pada:\n\n*Tanggal* : {interview_date}\n*Waktu*   : {interview_time} WIB\n*Link Meeting* : {meeting_link}\n\nKandidat dimohon untuk bergabung maksimal 5 menit sebelum jadwal wawancara, menggunakan pakaian yang sopan dan rapi, serta memastikan koneksi internet dalam kondisi stabil.\n\nTerima kasih atas perhatiannya.\n\nSalam,\nHuman Resource Dialogika"
    },
    {
        id: "interview_offline",
        title: "Interview Offline",
        description: "Template untuk undangan interview offline.",
        stage: "interview",
        mode: "offline",
        requiredTokens: ["{candidate_name}", "{interview_date}", "{interview_time}", "{interview_location}"],
        defaultTemplate: "*[REKRUTMEN DIALOGIKA]*\n\nHalo Kak {candidate_name}!\n\nTerima kasih sudah mengikuti tahapan rekrutmen di Dialogika dengan antusias. Selanjutnya kami ucapkan selamat karena telah lolos pada tahap screening!\n\nMaka dari itu, kami akan mengundang kakak untuk mengikuti tahapan selanjutnya, yaitu tahap wawancara dan verifikasi jadwal. Pelaksanaan wawancara akan dilakukan secara offline pada:\n\n*Tanggal* : {interview_date}\n*Waktu*   : {interview_time} WIB\n*Lokasi*  : {interview_location}\n\nKandidat dimohon untuk hadir maksimal 5 menit sebelum jadwal wawancara serta menggunakan pakaian yang sopan dan rapi, serta membawa laptop.\n\nTerima kasih atas perhatiannya\n\nSalam,\nHuman Resource Dialogika\n\nMohon untuk konfirmasi kehadiran dengan membalas pesan ini. Terima kasih.\n*reschedule hanya bisa dilakukan 1x maksimal H-1"
    },
    {
        id: "on_job_training_online",
        title: "On Job Training Online",
        description: "Template untuk undangan On Job Training online.",
        stage: "on_job_training",
        mode: "online",
        requiredTokens: ["{candidate_name}", "{ojt_date}", "{ojt_time}", "{meeting_link}"],
        defaultTemplate: "*[REKRUTMEN DIALOGIKA]*\n\nHalo Kak {candidate_name}!\n\nTerima kasih telah mengikuti seluruh tahapan rekrutmen Mentor di Dialogika dengan antusias. Kami mengucapkan selamat karena Kakak telah dinyatakan lolos ke tahap berikutnya, yaitu *On Job Training (OJT)*.\n\nMelalui pesan ini, kami mengundang Kakak untuk mengikuti program OJT yang akan dilaksanakan selama *3 hari* sebagai bagian dari proses penilaian dan pengenalan lingkungan kerja di Dialogika.\n\n*Periode OJT* : {ojt_date}\n*Waktu*       : {ojt_time} WIB\n*Lokasi*      : {meeting_link}\n\nSelama pelaksanaan OJT, peserta diharapkan hadir tepat waktu, menggunakan pakaian yang sopan dan rapi, serta membawa laptop untuk mendukung kegiatan pelatihan dan praktik kerja.\n\nKehadiran dan performa selama OJT akan menjadi salah satu pertimbangan dalam proses evaluasi akhir rekrutmen.\n\nTerima kasih atas perhatian dan kerja samanya.\n\nSalam,\nHuman Resource Dialogika\n\nMohon untuk mengonfirmasi kehadiran dengan membalas pesan ini.\n\n*Reschedule  maksimal H-1 sebelum hari pertama OJT.*"
    },
    {
        id: "on_job_training_offline",
        title: "On Job Training Offline",
        description: "Template untuk undangan On Job Training offline.",
        stage: "on_job_training",
        mode: "offline",
        requiredTokens: ["{candidate_name}", "{ojt_date}", "{ojt_time}", "{ojt_location}"],
        defaultTemplate: "*[REKRUTMEN DIALOGIKA]*\n\nHalo Kak {candidate_name}!\n\nTerima kasih telah mengikuti seluruh tahapan rekrutmen Mentor di Dialogika dengan antusias. Kami mengucapkan selamat karena Kakak telah dinyatakan lolos ke tahap berikutnya, yaitu *On Job Training (OJT)*.\n\nMelalui pesan ini, kami mengundang Kakak untuk mengikuti program OJT yang akan dilaksanakan selama *3 hari* sebagai bagian dari proses penilaian dan pengenalan lingkungan kerja di Dialogika.\n\n*Periode OJT* : {ojt_date}\n*Waktu*       : {ojt_time} WIB\n*Lokasi*      : {ojt_location}\n\nSelama pelaksanaan OJT, peserta diharapkan hadir tepat waktu, menggunakan pakaian yang sopan dan rapi, serta membawa laptop untuk mendukung kegiatan pelatihan dan praktik kerja.\n\nKehadiran dan performa selama OJT akan menjadi salah satu pertimbangan dalam proses evaluasi akhir rekrutmen.\n\nTerima kasih atas perhatian dan kerja samanya.\n\nSalam,\nHuman Resource Dialogika\n\nMohon untuk mengonfirmasi kehadiran dengan membalas pesan ini.\n\n*Reschedule  maksimal H-1 sebelum hari pertama OJT.*"
    },
    {
        id: "accepted",
        title: "Accepted",
        description: "Template untuk notifikasi kandidat diterima.",
        stage: "decision",
        requiredTokens: ["{candidate_name}"],
        defaultTemplate: "*[Acceptance Letter]*\n\nHalo {candidate_name}!\n\nTerima kasih atas partisipasi dan antusiasmenya dalam mengikuti proses rekrutmen Tim Dialogika.\n\nSetelah melalui proses seleksi dan evaluasi, kami dengan senang hati menginformasikan bahwa Kakak diterima sebagai Tim di Dialogika.\nSelamat bergabung bersama tim!\n\nInformasi mengenai jadwal On Job Training dan kelengkapan administrasi akan kami kirimkan dalam waktu dekat.\n\nTerima kasih dan sampai jumpa di hari pertama magang.\n\nSalam hormat,\nHR Dialogika"
    },
    {
        id: "rejected",
        title: "Rejected",
        description: "Template untuk notifikasi kandidat ditolak.",
        stage: "decision",
        requiredTokens: ["{candidate_name}"],
        defaultTemplate: "[Recruitment Dialogika Team - UPDATE]\nHalo Kak {candidate_name}!!\n\nTerima kasih banyak atas waktu dan antusiasme yang telah Kakak berikan selama proses seleksi Tim di Dialogika. Kami sangat mengapresiasi usaha dan ketertarikan Kakak untuk bergabung bersama kami.\n\nSetelah melalui proses pertimbangan yang cukup panjang, dengan berat hati kami menginformasikan bahwa saat ini Kakak belum dapat kami lanjutkan ke tahap berikutnya. Keputusan ini tidak mengurangi nilai dan potensi yang Kakak miliki, karena banyak sekali kandidat hebat yang turut berpartisipasi dalam proses seleksi ini.\n\nKami berharap Kakak tetap semangat dalam mengejar kesempatan lainnya, dan semoga di lain waktu kita bisa dipertemukan kembali dalam kesempatan yang berbeda.\n\nTerima kasih sekali lagi atas ketertarikan Kakak kepada Dialogika.\n\nSalam hangat,\nHR Dialogika"
    }
];

/**
 * Default storage key for template persistence
 */
export const TEMPLATE_STORAGE_KEY = "dialogika_internship_chat_templates_v1";

/**
 * Build default templates map from definitions
 */
function buildDefaultTemplatesMap() {
    const defaults = {};
    TEMPLATE_DEFINITIONS.forEach(def => {
        defaults[def.id] = def.defaultTemplate;
    });
    return defaults;
}

/**
 * Get template definition by ID
 * @param {string} templateId - Template ID
 * @returns {Object|null} Template definition or null
 */
export function getTemplateDefinition(templateId) {
    return TEMPLATE_DEFINITIONS.find(def => def.id === templateId) || null;
}

/**
 * Get all stored templates with fallback to defaults
 * @returns {Object} Templates map with all template types
 */
export function getStoredTemplates() {
    const defaults = buildDefaultTemplatesMap();
    try {
        const raw = window.localStorage.getItem(TEMPLATE_STORAGE_KEY);
        if (!raw) return defaults;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") return defaults;
        
        // Migrate legacy micro_teaching templates to on_job_training if present
        if (parsed.micro_teaching_online && !parsed.on_job_training_online) {
            parsed.on_job_training_online = parsed.micro_teaching_online;
        }
        if (parsed.micro_teaching_offline && !parsed.on_job_training_offline) {
            parsed.on_job_training_offline = parsed.micro_teaching_offline;
        }

        Object.keys(defaults).forEach((key) => {
            const value = (parsed[key] || "").toString().trim();
            if (value) defaults[key] = value;
        });
        return defaults;
    } catch (error) {
        console.warn("Failed to load templates from storage, using defaults", error);
        return defaults;
    }
}

/**
 * Save templates to localStorage
 * @param {Object} templates - Templates map to save
 * @returns {boolean} Success status
 */
export function saveTemplates(templates) {
    try {
        window.localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
        return true;
    } catch (error) {
        console.error("Failed to save templates to storage", error);
        return false;
    }
}

/**
 * Get templates with metadata for editor
 * @returns {Array} Template definitions with stored values
 */
export function getTemplatesWithMetadata() {
    const stored = getStoredTemplates();
    return TEMPLATE_DEFINITIONS.map(def => ({
        ...def,
        currentValue: stored[def.id] || def.defaultTemplate
    }));
}

/**
 * Reset templates to defaults
 * @returns {boolean} Success status
 */
export function resetTemplatesToDefaults() {
    const defaults = buildDefaultTemplatesMap();
    return saveTemplates(defaults);
}

/**
 * Interpolate template with token values
 * Replaces {token_name} with provided values
 * @param {string} templateText - Template text with {token} placeholders
 * @param {Object} tokens - Token values map
 * @returns {string} Interpolated text
 */
export function interpolateTemplate(templateText, tokens) {
    const source = (templateText || "").toString();
    return source.replace(/\{([a-z_]+)\}/gi, (fullMatch, tokenName) => {
        const replacement = tokens && Object.prototype.hasOwnProperty.call(tokens, tokenName)
            ? tokens[tokenName]
            : "";
        const nextValue = (replacement || "").toString().trim();
        return nextValue || fullMatch;
    });
}

/**
 * Build WhatsApp message from template ID and tokens
 * @param {string} templateId - Template ID
 * @param {Object} tokens - Token values map
 * @returns {string|null} Generated message or null if template not found
 */
export function buildMessageFromTemplate(templateId, tokens) {
    const stored = getStoredTemplates();
    const template = stored[templateId];
    if (!template) {
        console.warn(`Template ${templateId} not found, returning null`);
        return null;
    }
    return interpolateTemplate(template, tokens);
}

/**
 * Get template for specific stage and mode
 * @param {string} stage - Stage name (interview, micro_teaching, on_job_training, decision)
 * @param {string} mode - Mode name (online, offline) - optional
 * @returns {string|null} Template ID or null
 */
export function getTemplateIdForStageMode(stage, mode) {
    if (stage === "interview" && mode === "online") return "interview_online";
    if (stage === "interview" && mode === "offline") return "interview_offline";
    if ((stage === "on_job_training" || stage === "micro_teaching") && mode === "online") return "on_job_training_online";
    if ((stage === "on_job_training" || stage === "micro_teaching") && mode === "offline") return "on_job_training_offline";
    if (stage === "decision" && mode === "accepted") return "accepted";
    if (stage === "decision" && mode === "rejected") return "rejected";
    return null;
}

/**
 * List all template IDs
 * @returns {Array} Array of template IDs
 */
export function getAllTemplateIds() {
    return TEMPLATE_DEFINITIONS.map(def => def.id);
}

/**
 * List templates by stage
 * @param {string} stage - Stage name
 * @returns {Array} Template definitions for stage
 */
export function getTemplatesByStage(stage) {
    return TEMPLATE_DEFINITIONS.filter(def => def.stage === stage);
}

/**
 * Check if template has all required tokens provided
 * @param {string} templateId - Template ID
 * @param {Object} tokens - Provided tokens
 * @returns {Object} {isValid, missingTokens}
 */
export function validateTemplateTokens(templateId, tokens) {
    const def = getTemplateDefinition(templateId);
    if (!def) {
        return { isValid: false, missingTokens: [], error: "Template not found" };
    }
    
    const providedTokens = new Set(Object.keys(tokens || {}));
    const missingTokens = def.requiredTokens.filter(requiredToken => {
        const tokenName = requiredToken.slice(1, -1); // Remove { and }
        return !providedTokens.has(tokenName);
    });
    
    return {
        isValid: missingTokens.length === 0,
        missingTokens,
        requiredTokens: def.requiredTokens
    };
}

/**
 * Get last modified timestamp of templates
 * @returns {number|null} Timestamp or null if never saved
 */
export function getTemplatesLastModified() {
    try {
        const timestamp = window.localStorage.getItem(TEMPLATE_STORAGE_KEY + "_updated_at");
        return timestamp ? parseInt(timestamp, 10) : null;
    } catch (error) {
        return null;
    }
}

/**
 * Set last modified timestamp of templates
 * Called when templates are updated
 */
export function setTemplatesLastModified() {
    try {
        window.localStorage.setItem(TEMPLATE_STORAGE_KEY + "_updated_at", Date.now().toString());
    } catch (error) {
        console.warn("Failed to save template modification timestamp", error);
    }
}

/**
 * Export templates as JSON string
 * @returns {string} JSON string of templates
 */
export function exportTemplates() {
    const templates = getStoredTemplates();
    return JSON.stringify(templates, null, 2);
}

/**
 * Import templates from JSON string
 * @param {string} jsonString - JSON string of templates
 * @returns {Object} {success, message, templates}
 */
export function importTemplates(jsonString) {
    try {
        const parsed = JSON.parse(jsonString);
        if (!parsed || typeof parsed !== "object") {
            return { success: false, message: "Invalid JSON format" };
        }
        const result = saveTemplates(parsed);
        if (result) {
            setTemplatesLastModified();
            return { success: true, message: "Templates imported successfully", templates: parsed };
        }
        return { success: false, message: "Failed to save imported templates" };
    } catch (error) {
        return { success: false, message: `Import error: ${error.message}` };
    }
}

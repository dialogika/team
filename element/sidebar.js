export function renderSidebar(target) {
    if (!target) return;

    // --- INITIALIZE GLOBAL DATA ---
    if (typeof window !== 'undefined') {
        if (!window.questTasksById) window.questTasksById = {};
        if (!window.questUsersById) window.questUsersById = {};
        
        // Expose helper to fetch users once and share it
        window.initGlobalUsers = async function() {
            var w = window.parent && window.parent.db ? window.parent : window;
            if (!w.db || !w.getDocs || !w.collection) return;
            try {
                const snap = await w.getDocs(w.collection(w.db, 'users'));
                var usersMap = {};
                snap.forEach(docSnap => {
                    var d = docSnap.data() || {};
                    usersMap[docSnap.id] = {
                        uid: docSnap.id,
                        name: d.name || d.email || 'Unknown',
                        email: d.email || '',
                        photo: d.photo || ''
                    };
                });
                window.questUsersById = usersMap;
                if (window.parent && window.parent !== window) {
                    window.parent.questUsersById = usersMap;
                }
                console.log('Global users initialized:', Object.keys(usersMap).length);
            } catch (e) {
                console.error('Failed to init global users:', e);
            }
        };

        // Trigger initialization immediately
        window.initGlobalUsers();
    }

    target.innerHTML = `
        <style>
            #questBoardModal,
            #reportBoardModal {
                padding: 0;
                pointer-events: none;
            }
            #questBoardModal .modal-dialog,
            #reportBoardModal .modal-dialog {
                position: fixed;
                top: 70px;
                left: 290px;
                right: 0;
                margin: 0;
                width: auto;
                margin : 20px;
                max-width: none;
                height: calc(100vh - 120px);
                pointer-events: auto;
            }
            #questBoardModal .modal-content,
            #reportBoardModal .modal-content {
                height: 100%;
                border-radius: 16px;
                background: #ffffff;
                box-shadow: 0px 7px 9px -6px rgba(114, 4, 207, 1);
                border: 0;
            }
            #questBoardModal .modal-body,
            #reportBoardModal .modal-body {
                height: 100%;
                padding: 0;
            }
            #questBoardModal #questBoardFrame,
            #reportBoardModal #reportBoardFrame {
                width: 100%;
                height: 100%;
                border: 0;
            }
            #questBoardOverlay {
                position: fixed;
                inset: 0;
                
                z-index: 1049;
                display: none;
                pointer-events: none;
            }
            #questBoardOverlay.show {
                display: block;
            }
            .rich-editor {
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                overflow: hidden;
                background: #ffffff;
            }
            .rich-toolbar {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 8px 12px;
                background: #f9fafb;
                border-bottom: 1px solid #e2e8f0;
            }
            .rich-toolbar-left {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .rich-btn {
                border: none;
                background: transparent;
                padding: 4px;
                border-radius: 4px;
                color: #64748b;
                font-size: 1.1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            .rich-btn:hover {
                background: #f1f5f9;
                color: #0f172a;
            }
            .rich-btn.active {
                background: #e2e8f0;
                color: #2563eb;
            }
            .rich-editor-body {
                min-height: 120px;
                padding: 12px 16px;
                background: #ffffff;
                outline: none;
                font-size: 0.95rem;
                color: #334155;
                line-height: 1.5;
            }
            .rich-editor-body[contenteditable="true"]:empty:before {
                content: attr(data-placeholder);
                color: #94a3b8;
            }
            .sidebar-submenu {
                padding-left: 45px;
                display: none;
                margin-bottom: 10px;
            }
            .sidebar-submenu.show {
                display: block;
            }
            .sidebar-submenu-link {
                display: block;
                padding: 6px 0;
                color: #64748b;
                text-decoration: none;
                font-size: 13px;
                transition: color 0.2s;
            }
            .sidebar-submenu-link:hover {
                color: #2563eb;
            }

            #logoutModal {
                z-index: 5001 !important;
                pointer-events: auto !important;
            }

            #logoutModal * {
                pointer-events: auto !important;
            }

            .modal {
                z-index: 5000 !important;
            }

            .modal-backdrop {
                z-index: 4999 !important;
            }

        </style>
        <!-- 2. SIDEBAR (Light, Smart Filters, Pending Widget) -->
        <aside class="sidebar" id="sidebarNav">
            
            <!-- WRAPPER UNTUK AREA YANG BISA DI-SCROLL -->
            <div class="sidebar-scroll-wrapper">
                
                <!-- Smart Filters (4 Kotak Besar) -->
                <div class="smart-filters-grid">
                    <a href="#" class="filter-card">
                        <div class="filter-top"><div class="filter-icon" style="background-color: var(--dlg-blue);"><i class="bi bi-archive-fill"></i></div><div class="filter-count" id="mainQuestCount">0</div></div>
                        <div class="filter-label">Main Quest</div>
                    </a>
                    <a href="#" class="filter-card">
                        <div class="filter-top"><div class="filter-icon" style="background-color: var(--dlg-yellow);"><i class="bi bi-archive-fill"></i></div><div class="filter-count" id="sideQuestCount">0</div></div>
                        <div class="filter-label">Side Quest</div>
                    </a>
                    <a href="/home.html" class="filter-card">
                        <div class="filter-top"><div class="filter-icon" style="background-color: var(--dlg-purple);"><i class="bi bi-calendar-event-fill"></i></div><div class="filter-count" id="projectTasksTotalCount">0</div></div>
                        <div class="filter-label">Project</div>
                    </a>
                    <a href="#" class="filter-card" id="reportFilterCard">
                        <div class="filter-top"><div class="filter-icon" style="background-color: var(--dlg-green);"><i class="bi bi-calendar-event-fill"></i></div><div class="filter-count" id="reportPendingApprovalCount">0</div></div>
                        <div class="filter-label">Report</div>
                    </a>
                    
                </div>

                <!-- Navigation Links -->
                <div class="nav-category">Main Navigation</div>
                <a href="javascript:void(0)" class="sidebar-link active" onclick="window.toggleDashboardMenu(this)">
                    <i class="bi bi-columns-gap"></i> Dashboard 
                    <span class="sidebar-badge">
                        <i class="bi bi-arrow-left-square-fill" id="dashboardIcon"></i>
                    </span>
                </a>
                <div class="sidebar-submenu">
                    <a href="javascript:void(0)" class="sidebar-submenu-link">Closing</a>
                    <a href="javascript:void(0)" class="sidebar-submenu-link">Rebuy</a>
                    <a href="javascript:void(0)" class="sidebar-submenu-link">Happy</a>
                    <a href="javascript:void(0)" class="sidebar-submenu-link">Branding</a>
                </div>
                <a href="#" class="sidebar-link"><i class="bi bi-list-columns-reverse"></i> Shortcut 
                <a href="javascript:void(0)" class="sidebar-link" onclick="alert('Under Development')"><i class="bi bi-chat-dots"></i> Pings</a>
                <a href="javascript:void(0)" class="sidebar-link" onclick="alert('Under Development')"><i class="bi bi-bell"></i> Hey!</a>
                <a href="javascript:void(0)" class="sidebar-link" onclick="alert('Under Development')"><i class="bi bi-activity"></i> Activity</a>
                <a href="javascript:void(0)" class="sidebar-link" onclick="alert('Under Development')"><i class="bi bi-person-circle"></i> My Stuff</a>

                <div class="nav-category mt-4">System</div>
                <a href="javascript:void(0)" class="sidebar-link" onclick="alert('Under Development')"><i class="bi bi-gear"></i>System Settings</a>
                <a href="javascript:void(0)" class="sidebar-link text-danger" id="logoutBtn">
                <i class="bi bi-box-arrow-right"></i> Logout</a>

            </div> <!-- End Scroll Wrapper -->

            <!-- Logout Confirmation Modal -->
<div class="modal fade" id="logoutModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title text-danger">
                    <i class="bi bi-exclamation-triangle"></i> Konfirmasi Logout
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                Apakah Anda yakin ingin logout?
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    Batal
                </button>
                <button type="button" class="btn btn-danger" id="confirmLogout">
                    Ya, Logout
                </button>
            </div>
        </div>
    </div>
</div>


            <!-- PENDING WIDGET (Pinned di Bawah, di luar scroll wrapper) -->
            <div class="pending-widget" style="background-color: #1c83e368; color:#fff;margin-bottom: -17px;">
                <div class="fire-icon-wrapper shadow-purple" style="border: 0.4px solid rgba(114, 4, 207, 1);"><i class="bi bi-fire fire-icon"></i></div>
                <h6 class="fw-bold" style="color:#0B2B6A; margin-bottom: 5px;">Pending Reports</h6>
                <p class="small text-muted mb-3">You have <span id="reportPendingApprovalCount">0</span> reports waiting.</p>
                <button class="btn-review btn-dlg-blue shadow-none" style="margin-bottom:14px;">Review Now</button>
                
                <!-- COPYRIGHT (Muncul hanya saat scroll mentok bawah) -->
                <div class="sidebarCopyright fw-semibold" style="font-size: 12px;">
                    &copy; Copyright 2025<br/> PT Dialogika Persona Indonesia
                </div>
            </div>

        </aside>

        <div id="questBoardOverlay"></div>

        <div class="modal fade" id="questBoardModal" data-bs-backdrop="false" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content border-0 rounded-4">
                    <div class="modal-body p-0">
                        <iframe id="questBoardFrame"></iframe>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="reportBoardModal" data-bs-backdrop="false" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content border-0 rounded-4">
                    <div class="modal-body p-0">
                        <iframe id="reportBoardFrame"></iframe>
                    </div>
                </div>
            </div>
        </div>
        `;

    var cachedTasks = null;
    var cachedTasksTime = 0;

    async function getTasksCached(w) {
        var now = Date.now();
        if (cachedTasks && (now - cachedTasksTime < 5000)) {
            return cachedTasks;
        }
        var snap = await w.getDocs(w.collection(w.db, 'tasks'));
        cachedTasks = snap;
        cachedTasksTime = now;
        return snap;
    }
    window.getTasksCached = getTasksCached;

    async function refreshSidebarCounts(snapshotOrAttempt) {
        var mainCountEl = document.getElementById('mainQuestCount');
        var sideCountEl = document.getElementById('sideQuestCount');
        var reportCountEl = document.getElementById('reportPendingApprovalCount');
        
        var w = window;
        if (!w || !w.db || !w.collection || !w.getDocs) {
            var attempt = typeof snapshotOrAttempt === 'number' ? snapshotOrAttempt : 0;
            var nextAttempt = attempt + 1;
            if (nextAttempt <= 30) {
                setTimeout(function () { refreshSidebarCounts(nextAttempt); }, 500);
            }
            return;
        }

        try {
            var tasksSnap;
            if (snapshotOrAttempt && typeof snapshotOrAttempt === 'object' && typeof snapshotOrAttempt.forEach === 'function') {
                tasksSnap = snapshotOrAttempt;
                // Update cache
                cachedTasks = tasksSnap;
                cachedTasksTime = Date.now();
            } else {
                tasksSnap = await getTasksCached(w);
            }

            var totalMain = 0;
            var totalSide = 0;
            var completeIds = [];
            var completeSet = {};

            tasksSnap.forEach(function (docSnap) {
                var data = docSnap.data() || {};
                // Projects have project_id, Quests do not.
                if (data.project_id || data.projectId) return;

                var archived = !!(data.archived || data.is_archived);
                
                // Status normalization
                var statusRaw = '';
                if (typeof data.status === 'string') statusRaw = data.status;
                else if (data.status && typeof data.status === 'object') statusRaw = data.status.name || data.status.label || '';
                var normStatus = String(statusRaw || '').trim().toLowerCase().replace(/[\s_]/g, '');
                
                // Task Status normalization
                var tsRaw = '';
                if (typeof data.task_status === 'string') tsRaw = data.task_status;
                else if (data.task_status && typeof data.task_status === 'object') tsRaw = data.task_status.name || data.task_status.label || '';
                var normTaskStatus = String(tsRaw || '').trim().toLowerCase().replace(/[\s_]/g, '');

                var isComplete = normStatus === 'complete' || normStatus === 'done' || normTaskStatus === 'complete' || normTaskStatus === 'done';

                // Count Main Quest (Recurring tasks that are not complete/archived)
                if (data.recur && !isComplete && !archived) {
                    totalMain++;
                }

                // Count Side Quest (Tasks with type sidequest OR has task_status, and not complete/archived)
                var rawType = String(data.type || '').toLowerCase();
                var isSideQuest = rawType === 'sidequest' || rawType === 'side-quest' || normStatus === 'sidequest' || !!data.task_status;
                if (isSideQuest && !isComplete && !archived) {
                    totalSide++;
                }

                if (isComplete && !archived) {
                    completeIds.push(docSnap.id);
                    completeSet[docSnap.id] = true;
                }
            });

            if (mainCountEl) mainCountEl.innerText = String(totalMain);
            if (sideCountEl) sideCountEl.innerText = String(totalSide);

            // Report Pending Approval Logic
            if (reportCountEl) {
                function timeKey(v) {
                    if (!v) return '';
                    if (v.toDate && typeof v.toDate === 'function') {
                        var d = v.toDate();
                        if (!isNaN(d.getTime())) return d.toISOString();
                        return '';
                    }
                    if (typeof v === 'number') {
                        var d2 = new Date(v);
                        if (!isNaN(d2.getTime())) return d2.toISOString();
                        return '';
                    }
                    return String(v);
                }

                var rootSnap = await w.getDocs(w.collection(w.db, 'quest_reports'));
                var latestByTaskId = {};
                rootSnap.forEach(function (repSnap) {
                    var rdataRoot = repSnap.data() || {};
                    var taskIdRoot = rdataRoot.taskId || rdataRoot.task_id || '';
                    if (!taskIdRoot || !completeSet[taskIdRoot]) return;
                    var prevRoot = latestByTaskId[taskIdRoot];
                    var prevTimeRoot = prevRoot ? String(prevRoot._time || '') : '';
                    var currTimeRoot = timeKey(rdataRoot.submittedAt || rdataRoot.createdAt || rdataRoot.timestamp || '');
                    if (!prevRoot || currTimeRoot > prevTimeRoot) {
                        latestByTaskId[taskIdRoot] = { data: rdataRoot, _time: currTimeRoot };
                    }
                });

                var tasksToFetchSub = completeIds.filter(id => !latestByTaskId[id]);
                if (tasksToFetchSub.length > 0) {
                    const batchSize = 10;
                    for (let i = 0; i < tasksToFetchSub.length; i += batchSize) {
                        const batch = tasksToFetchSub.slice(i, i + batchSize);
                        await Promise.all(batch.map(async (taskId) => {
                            try {
                                var repSnap0 = await w.getDocs(w.collection(w.db, 'tasks', taskId, 'reports'));
                                repSnap0.forEach(function (docRep) {
                                    var rdata = docRep.data() || {};
                                    var prev = latestByTaskId[taskId];
                                    var prevTime = prev ? String(prev._time || '') : '';
                                    var currTime = timeKey(rdata.submittedAt || rdata.createdAt || rdata.timestamp || '');
                                    if (!prev || currTime > prevTime) {
                                        latestByTaskId[taskId] = { data: rdata, _time: currTime };
                                    }
                                });
                            } catch (eSub) {}
                        }));
                    }
                }

                var pendingCount = 0;
                for (var j = 0; j < completeIds.length; j++) {
                    var tid = completeIds[j];
                    var entry = latestByTaskId[tid];
                    if (!entry || !entry.data) continue;
                    var appr = (entry.data.approval_status || entry.data.approvalStatus || '').toLowerCase();
                    if (appr !== 'approved') pendingCount++;
                }
                reportCountEl.innerText = String(pendingCount);
            }
        } catch (e) {
            console.error('Error refreshing sidebar counts:', e);
        }
    }

    window.refreshSidebarCounts = refreshSidebarCounts;

    refreshSidebarCounts(0);

    const questCard = target.querySelector('.smart-filters-grid .filter-card');
    if (questCard) {
        questCard.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof window.closeReportBoardModal === 'function') {
                try { window.closeReportBoardModal(); } catch (err) {}
            } else {
                try {
                    var rbm = document.getElementById('reportBoardModal');
                    if (rbm && typeof bootstrap !== "undefined" && bootstrap.Modal) {
                        bootstrap.Modal.getOrCreateInstance(rbm).hide();
                    }
                    var ov0 = document.getElementById('questBoardOverlay');
                    if (ov0) ov0.classList.remove('show');
                } catch (err2) {}
            }
            const modalEl = document.getElementById('questBoardModal');
            const frame = document.getElementById('questBoardFrame');
            window.closeQuestBoardModal = function () {
                const overlay = document.getElementById('questBoardOverlay');
                if (overlay) {
                    overlay.classList.remove('show');
                }
                if (modalEl && typeof bootstrap !== "undefined" && bootstrap.Modal) {
                    const instance = bootstrap.Modal.getOrCreateInstance(modalEl);
                    instance.hide();
                }
            };
            const html = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quest Board - Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <link rel="stylesheet" href="/assets/css/style.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        body { font-family: 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        
        .description-truncate {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .nav-card {
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            border: 2px solid transparent;
        }
        .nav-card:hover { transform: translateY(-4px); }
        .nav-card.active {
            border-color: rgba(0,0,0,0.05);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), inset 0 0 0 2px rgba(255,255,255,0.5);
            ring: 2px;
        }

        .icon-box {
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(4px);
        }
        .btn-dlg-red {
            background: linear-gradient(to bottom, #e7181b 5%, #a31818 100%);
            box-shadow: 0px 5px 16px -6px rgba(114, 4, 207, 1);
            color: #fff;
            border: none;
            transition: 0.3s;
        }
        .btn-dlg-red:hover {
            background: linear-gradient(to bottom, #a31818 5%, #e7181b 100%);
            color: #fff;
            box-shadow: 0px 0px 4px 2px rgba(114, 4, 207, 0.75);
        }
        .btn-dlg-yellow {
            background: linear-gradient(to top, #f1ac15 22%, #fcf221 100%);
            box-shadow: 0px 5px 16px -6px rgba(114, 4, 207, 1);
            color: black;
            border: none;
            transition: 0.3s;
        }
        .btn-dlg-yellow:hover {
            background: linear-gradient(to top,#fcf221 22%, #f1ac15 100%);
            box-shadow: 0px 0px 4px 2px rgba(114, 4, 207, 0.75);
        }
        .tag-selector {
            position: relative;
            width: 100%;
        }
        .tag-selector-control {
            display: flex;
            align-items: center;
            min-height: 34px;
            border-radius: 8px;
            padding: 4px 10px;
            border: 1px solid #e5e7eb;
            background: #f9fafb;
            cursor: text;
            width: 100%;
            gap: 6px;
        }
        .tag-selector-control:hover {
            background: #f3f4f6;
        }
        .tag-selected-list {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            flex: 1;
        }
        .tag-placeholder {
            color: #9ca3af;
            font-size: 0.75rem;
        }
        .tag-pill {
            display: inline-flex;
            align-items: center;
            padding: 2px 8px;
            border-radius: 999px;
            font-size: 0.75rem;
            background: #e5e7eb;
            color: #111827;
        }
        .tag-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            margin-top: 4px;
            background: #ffffff;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 18px 45px rgba(15, 23, 42, 0.15);
            padding: 6px 0 4px 0;
            z-index: 40;
            display: none;
        }
        .tag-search-input {
            width: 100%;
            border: none;
            outline: none;
            padding: 6px 12px 8px 12px;
            font-size: 0.85rem;
        }
        .tag-options {
            max-height: 220px;
            overflow-y: auto;
            padding: 0 4px 4px 4px;
        }
        .tag-option {
            display: flex;
            align-items: center;
            padding: 4px 8px;
            cursor: pointer;
            gap: 6px;
        }
        .tag-option:hover {
            background: #f3f4f6;
        }
        .tag-option-selected .tag-pill {
            background: #4338ca;
            color: #eef2ff;
        }
        .tag-create {
            display: flex;
            align-items: center;
            padding: 6px 12px 8px 12px;
            border-top: 1px solid #e5e7eb;
            font-size: 0.8rem;
            color: #6b7280;
            cursor: pointer;
        }
        .tag-create:hover {
            background: #f3f4f6;
        }
        .tag-create-label {
            margin-left: 4px;
            padding: 2px 6px;
            border-radius: 999px;
            background: #e0e7ff;
            color: #4338ca;
        }
        .tag-remove {
            margin-left: 4px;
            cursor: pointer;
            font-size: 0.7rem;
            color: #6b7280;
        }
        .tag-remove:hover {
            color: #111827;
        }
        .tooltip .tooltip-inner {
            background-color: #0f172a;
            color: #e5e7eb;
            font-size: 11px;
            line-height: 1.3;
            padding: 4px 8px;
            border-radius: 999px;
            box-shadow: 0 8px 20px rgba(15, 23, 42, 0.35);
        }
        .tooltip.bs-tooltip-top .tooltip-arrow::before,
        .tooltip.bs-tooltip-auto[data-popper-placement^="top"] .tooltip-arrow::before {
            border-top-color: #0f172a;
        }
        .tooltip.bs-tooltip-bottom .tooltip-arrow::before,
        .tooltip.bs-tooltip-auto[data-popper-placement^="bottom"] .tooltip-arrow::before {
            border-bottom-color: #0f172a;
        }
        .tooltip.bs-tooltip-start .tooltip-arrow::before,
        .tooltip.bs-tooltip-auto[data-popper-placement^="left"] .tooltip-arrow::before {
            border-left-color: #0f172a;
        }
        .tooltip.bs-tooltip-end .tooltip-arrow::before,
        .tooltip.bs-tooltip-auto[data-popper-placement^="right"] .tooltip-arrow::before {
            border-right-color: #0f172a;
        }
        .rich-editor {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            background: #ffffff;
            transition: border-color 0.2s;
        }
        .rich-editor:focus-within {
            border-color: #94a3b8;
        }
        .rich-toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px 10px;
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
        }
        .rich-toolbar-left {
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .rich-btn {
            border: none;
            background: transparent;
            width: 32px;
            height: 32px;
            border-radius: 6px;
            color: #475569;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            cursor: pointer;
        }
        .rich-btn:hover {
            background: #f1f5f9;
            color: #0f172a;
        }
        .rich-btn.active {
            background: #e2e8f0;
            color: #2563eb;
        }
        .rich-editor-body {
            min-height: 140px;
            padding: 12px 16px;
            background: #ffffff;
            outline: none;
            font-size: 0.95rem;
            color: #334155;
            line-height: 1.6;
        }
        .rich-editor-body:empty:before {
            content: attr(data-placeholder);
            color: #94a3b8;
        }
        .rich-toolbar-right {
            display: flex;
            align-items: center;
        }
    </style>
</head>
<body class="min-h-screen p-6 md:p-12" style="background: #fff;">

    <div class="max-w-4xl mx-auto">
        
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-4xl font-extrabold tracking-tight">Main Quest</h1>
    
            <div class="flex items-center gap-3">
                <div class="relative">
                    <button id="questHeaderToggleButton" type="button"
                        class="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm"
                        onclick="toggleQuestHeaderMenu(event)">
                        <i data-lucide="more-vertical" class="w-4 h-4 text-gray-600"></i>
                    </button>
                    <div id="questHeaderMenu"
                        class="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-xl shadow-lg py-1 text-sm text-gray-700 hidden z-40">
                        <button type="button" class="w-full text-left px-3 py-1.5 hover:bg-gray-100"
                            onclick="questHeaderEdit()">
                            Edit
                        </button>
                        <button type="button" class="w-full text-left px-3 py-1.5 hover:bg-gray-100 text-red-600"
                            onclick="questHeaderDelete()">
                            Delete
                        </button>
                    </div>
                </div>
                <button class="btn-dlg-yellow rounded-full px-6 py-2.5 text-sm font-semibold shadow-md"
                    onclick="toggleQuestForm()">
                    Add Quest
                </button>
                <button class="btn-dlg-red rounded-full px-5 py-2 text-sm font-semibold shadow-md"
                    onclick="if (window.parent && window.parent.closeQuestBoardModal) { window.parent.closeQuestBoardModal(); }">
                    Close
                </button>
            </div>
        </div>

        <div class="relative flex py-10 items-center">
            <div class="flex-grow border-t border-gray-200"></div>
            <span class="flex-shrink mx-6 text-gray-500 text-xs font-black uppercase tracking-[0.4em]">Main Quest</span>
            <div class="flex-grow border-t border-gray-200"></div>
        </div>

        <div id="questCreateForm" class="mb-10 rounded-3xl border border-gray-200 bg-white shadow-sm p-6 md:p-8 hidden">
            <div class="mb-6">
                <input id="questNameInput" type="text" placeholder="Quest Name"
                    class="w-full text-2xl md:text-3xl font-semibold text-gray-900 border-none focus:ring-0 focus:outline-none placeholder-gray-400" />
            </div>
            <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div class="space-y-4 text-sm">
                    <div class="flex items-center gap-3">
                        <div class="font-medium text-gray-500 w-24">Department</div>
                        <div class="flex-1">
                            <div class="relative">
                                <button type="button"
                                    class="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-left text-gray-700"
                                    onclick="document.getElementById('questDepartmentDropdown').classList.toggle('hidden')">
                                    <span class="flex items-center gap-2">
                                        <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200">
                                            <span class="text-xs font-semibold text-gray-500">D</span>
                                        </span>
                                        <span id="questDepartmentButtonLabel" class="text-xs md:text-sm">Select departments...</span>
                                    </span>
                                    <span class="text-gray-400 text-xs md:text-sm">&#9662;</span>
                                </button>
                                <div id="questDepartmentDropdown"
                                    class="absolute top-full left-0 right-0 mt-2 rounded-xl border border-gray-200 bg-white shadow-lg p-3 hidden max-h-60 overflow-y-auto text-xs md:text-sm z-20">
                                    <span class="text-gray-400 text-xs">Loading departments...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="font-medium text-gray-500 w-24">Assign to</div>
                        <div class="flex-1">
                            <div class="relative">
                                <button type="button"
                                    class="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-left text-gray-700"
                                    onclick="document.getElementById('questAssignDropdown').classList.toggle('hidden')">
                                    <span class="flex items-center gap-2">
                                        <span id="questAssignAvatars" class="flex -space-x-1"></span>
                                        <span id="questAssignButtonLabel" class="text-xs md:text-sm">Select user...</span>
                                    </span>
                                    <span class="text-gray-400 text-xs md:text-sm">&#9662;</span>
                                </button>
                                <div id="questAssignDropdown"
                                    class="absolute top-full left-0 mt-2 w-72 md:w-80 rounded-2xl bg-slate-900 text-white shadow-2xl p-3 hidden text-xs md:text-sm z-40">
                                    <div class="mb-3">
                                        <div class="relative">
                                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                                                &#128269;
                                            </span>
                                            <input id="questAssignSearch" type="text"
                                                class="w-full rounded-full bg-slate-800 text-xs md:text-sm text-white placeholder-slate-500 pl-8 pr-3 py-1.5 outline-none border border-slate-700 focus:border-sky-500 focus:ring-0"
                                                placeholder="Search..." />
                                        </div>
                                    </div>
                                    <div class="text-[10px] tracking-[0.18em] text-slate-400 font-semibold mb-2">
                                        PEOPLE
                                    </div>
                                    <div id="questAssignList" class="max-h-56 overflow-y-auto flex flex-col gap-1">
                                        <div class="text-slate-500 text-xs">Loading users...</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="font-medium text-gray-500 w-24">Dates</div>
                        <div class="flex-1 flex flex-wrap items-center gap-2">
                            <div class="relative">
                                <input id="questDueDate" type="text" placeholder="dd/mm/yyyy"
                                    class="w-28 md:w-32 rounded-xl border border-gray-200 px-3 py-2 text-xs md:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    onclick="toggleQuestDueDropdown()" />
                                <div id="questDueDropdown"
                                    class="absolute left-0 mt-2 w-[420px] md:w-[460px] rounded-2xl bg-white border border-gray-200 shadow-2xl p-4 text-xs md:text-sm text-gray-800 hidden z-30">
                                    <div class="flex gap-4">
                                        <div class="w-40 md:w-44 border-r border-gray-100 pr-4">
                                            <div class="font-semibold text-sm mb-2">Due date</div>
                                            <div class="flex flex-col gap-1">
                                                <button type="button" class="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-50"
                                                    onclick="questDueQuickSelect('today')">
                                                    <span>Today</span>
                                                </button>
                                                <button type="button" class="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-50"
                                                    onclick="questDueQuickSelect('later')">
                                                    <span>Later</span>
                                                </button>
                                                <button type="button" class="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-50"
                                                    onclick="questDueQuickSelect('tomorrow')">
                                                    <span>Tomorrow</span>
                                                </button>
                                                <button type="button" class="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-50"
                                                    onclick="questDueQuickSelect('this-weekend')">
                                                    <span>This weekend</span>
                                                </button>
                                                <button type="button" class="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-50"
                                                    onclick="questDueQuickSelect('next-week')">
                                                    <span>Next week</span>
                                                </button>
                                                <button type="button" class="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-50"
                                                    onclick="questDueQuickSelect('next-weekend')">
                                                    <span>Next weekend</span>
                                                </button>
                                                <button type="button" class="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-50"
                                                    onclick="questDueQuickSelect('two-weeks')">
                                                    <span>2 weeks</span>
                                                </button>
                                                <button type="button" class="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-50"
                                                    onclick="questDueQuickSelect('four-weeks')">
                                                    <span>4 weeks</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="flex-1 pl-2">
                                            <div class="flex items-center justify-between mb-2">
                                                <button type="button"
                                                    class="text-[11px] text-gray-500 hover:text-gray-700"
                                                    onclick="questDueGoToday()">
                                                    Today
                                                </button>
                                                <div class="flex items-center gap-1">
                                                    <button type="button"
                                                        class="p-1 text-gray-400 hover:text-gray-600"
                                                        onclick="questDueChangeMonth(-1)">
                                                        &#10094;
                                                    </button>
                                                    <div id="questDueMonthLabel"
                                                        class="text-[11px] font-semibold text-gray-700 min-w-[90px] text-center">
                                                    </div>
                                                    <button type="button"
                                                        class="p-1 text-gray-400 hover:text-gray-600"
                                                        onclick="questDueChangeMonth(1)">
                                                        &#10095;
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-7 gap-1 text-[10px] text-gray-400 mb-1">
                                                <div class="text-center">Su</div>
                                                <div class="text-center">Mo</div>
                                                <div class="text-center">Tu</div>
                                                <div class="text-center">We</div>
                                                <div class="text-center">Th</div>
                                                <div class="text-center">Fr</div>
                                                <div class="text-center">Sa</div>
                                            </div>
                                            <div id="questDueCalendarGrid"
                                                class="grid grid-cols-7 gap-1 text-[11px] text-gray-500">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="relative">
                                <button type="button"
                                    class="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-xs md:text-sm font-medium text-gray-700 bg-white"
                                    onclick="toggleQuestRecurDropdown()">
                                    <span class="w-3 h-3 rounded-full border border-gray-400 flex items-center justify-center text-[8px] text-gray-500">&#8635;</span>
                                    <span>Recur</span>
                                </button>
                                <div id="questRecurDropdown"
                                    class="absolute right-0 mt-2 w-[420px] md:w-[460px] rounded-2xl bg-white border border-gray-200 shadow-2xl p-4 text-xs md:text-sm text-gray-800 hidden z-30">
                                    <div class="flex gap-4">
                                        <div class="flex-1">
                                            <div class="flex items-center justify-between mb-3">
                                                <div class="font-semibold text-sm">Recurring</div>
                                                <button type="button" class="text-gray-400 text-lg leading-none"
                                                    onclick="document.getElementById('questRecurDropdown').classList.add('hidden')">
                                                    &times;
                                                </button>
                                            </div>
                                            <div class="space-y-3">
                                                <div>
                                                    <label class="block text-[10px] uppercase tracking-[0.16em] text-gray-400 mb-1">Pattern</label>
                                                    <select id="questRecurPattern"
                                                        class="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs md:text-sm text-gray-800 bg-white"
                                                        onchange="questRecurApplyPattern()">
                                                        <option value="weekly">Weekly</option>
                                                        <option value="daily">Daily</option>
                                                        <option value="monthly">Monthly</option>
                                                        <option value="yearly">Yearly</option>
                                                    </select>
                                                </div>
                                                <div class="flex items-center gap-2">
                                                    <span class="text-gray-500">Every</span>
                                                    <input id="questRecurIntervalInput" type="number" min="1" value="1"
                                                        class="w-14 rounded-lg border border-gray-200 px-2 py-1.5 text-xs md:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                                        oninput="questRecurUpdateInterval()" />
                                                    <select id="questRecurUnitSelect"
                                                        class="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs md:text-sm text-gray-800 bg-white"
                                                        onchange="questRecurUpdateUnit()">
                                                        <option value="day">day</option>
                                                        <option value="week" selected>week</option>
                                                        <option value="month">month</option>
                                                        <option value="year">year</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <div class="text-[10px] uppercase tracking-[0.16em] text-gray-400 mb-1">Repeat on</div>
                                                    <div class="grid grid-cols-7 gap-1">
                                                        <button type="button" data-day="0"
                                                            class="quest-recur-day px-1.5 py-1 rounded-md text-[10px] font-medium"
                                                            onclick="questRecurToggleWeekday(0)">Su</button>
                                                        <button type="button" data-day="1"
                                                            class="quest-recur-day px-1.5 py-1 rounded-md text-[10px] font-medium"
                                                            onclick="questRecurToggleWeekday(1)">Mo</button>
                                                        <button type="button" data-day="2"
                                                            class="quest-recur-day px-1.5 py-1 rounded-md text-[10px] font-medium"
                                                            onclick="questRecurToggleWeekday(2)">Tu</button>
                                                        <button type="button" data-day="3"
                                                            class="quest-recur-day px-1.5 py-1 rounded-md text-[10px] font-medium"
                                                            onclick="questRecurToggleWeekday(3)">We</button>
                                                        <button type="button" data-day="4"
                                                            class="quest-recur-day px-1.5 py-1 rounded-md text-[10px] font-medium"
                                                            onclick="questRecurToggleWeekday(4)">Th</button>
                                                        <button type="button" data-day="5"
                                                            class="quest-recur-day px-1.5 py-1 rounded-md text-[10px] font-medium"
                                                            onclick="questRecurToggleWeekday(5)">Fr</button>
                                                        <button type="button" data-day="6"
                                                            class="quest-recur-day px-1.5 py-1 rounded-md text-[10px] font-medium"
                                                            onclick="questRecurToggleWeekday(6)">Sa</button>
                                                    </div>
                                                </div>
                                                <div id="questRecurMonthlyModeWrapper" class="mt-2 hidden">
                                                    <div class="text-[10px] uppercase tracking-[0.16em] text-gray-400 mb-1">Monthly pattern</div>
                                                    <select id="questRecurMonthlyMode"
                                                        class="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs md:text-sm text-gray-800 bg-white"
                                                        onchange="questRecurUpdateMonthlyMode()">
                                                        <option value="same-day">Same day each month</option>
                                                        <option value="first-day">First day of the month</option>
                                                        <option value="last-day">Last day of the month</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="flex items-center justify-between mt-4">
                                                <div class="flex items-center gap-2">
                                                    <button type="button"
                                                        class="rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold text-gray-600 bg-white border border-gray-200"
                                                        onclick="questRecurCancel()">
                                                        Cancel
                                                    </button>
                                                    <button type="button"
                                                        class="rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold text-white btn-dlg-blue"
                                                        onclick="questRecurSave()">
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="w-48 md:w-56 border-l border-gray-100 pl-4">
                                            <div class="flex items-center justify-between mb-2">
                                                <button type="button"
                                                    class="text-[11px] text-gray-500 hover:text-gray-700"
                                                    onclick="questRecurGoToday()">
                                                    Today
                                                </button>
                                                <div class="flex items-center gap-1">
                                                    <button type="button"
                                                        class="p-1 text-gray-400 hover:text-gray-600"
                                                        onclick="questRecurChangeMonth(-1)">
                                                        &#10094;
                                                    </button>
                                                    <div id="questRecurMonthLabel"
                                                        class="text-[11px] font-semibold text-gray-700 min-w-[90px] text-center">
                                                    </div>
                                                    <button type="button"
                                                        class="p-1 text-gray-400 hover:text-gray-600"
                                                        onclick="questRecurChangeMonth(1)">
                                                        &#10095;
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-7 gap-1 text-[10px] text-gray-400 mb-1">
                                                <div class="text-center">Su</div>
                                                <div class="text-center">Mo</div>
                                                <div class="text-center">Tu</div>
                                                <div class="text-center">We</div>
                                                <div class="text-center">Th</div>
                                                <div class="text-center">Fr</div>
                                                <div class="text-center">Sa</div>
                                            </div>
                                            <div id="questRecurCalendarGrid"
                                                class="grid grid-cols-7 gap-1 text-[11px] text-gray-500">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="font-medium text-gray-500 w-24">Reminder</div>
                        <div class="flex-1">
                            <div class="relative">
                                <button type="button"
                                    class="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-left text-gray-700"
                                    onclick="toggleQuestReminderDropdown()">
                                    <span id="questReminderButtonLabel" class="text-xs md:text-sm">No reminder</span>
                                    <span class="text-gray-400 text-xs md:text-sm">&#9662;</span>
                                </button>
                                <div id="questReminderDropdown"
                                    class="absolute left-0 mt-2 w-[420px] md:w-[460px] rounded-2xl bg-white border border-gray-200 shadow-2xl p-4 text-xs md:text-sm text-gray-800 hidden z-30">
                                    <div class="flex gap-4">
                                        <div class="w-40 md:w-44 border-r border-gray-100 pr-4">
                                            <div class="font-semibold text-sm mb-2">Reminder</div>
                                            <div class="flex flex-col gap-1">
                                                <button type="button" class="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-50"
                                                    onclick="questReminderQuickSelect('day-before')">
                                                    <span>A Day Before</span>
                                                </button>
                                                <button type="button" class="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-50"
                                                    onclick="questReminderQuickSelect('two-days-before')">
                                                    <span>Two Days Before</span>
                                                </button>
                                                <button type="button" class="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-50"
                                                    onclick="questReminderQuickSelect('three-days-before')">
                                                    <span>Three Days Before</span>
                                                </button>
                                                <button type="button" class="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-50"
                                                    onclick="questReminderQuickSelect('weekend-before')">
                                                    <span>At Weekend Before</span>
                                                </button>
                                                <button type="button" class="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-50"
                                                    onclick="questReminderQuickSelect('everyday-before')">
                                                    <span>Everyday Before</span>
                                                </button>
                                                <hr/>
                                                <button type="button" class="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-50"
                                                    onclick="questReminderQuickSelect('early-month')">
                                                    <span>Early Day in Every Month</span>
                                                </button>
                                                <button type="button" class="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-50"
                                                    onclick="questReminderQuickSelect('final-month')">
                                                    <span>Final Day in Every Month</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="flex-1 pl-2">
                                            <div class="flex items-center justify-between mb-2">
                                                <div id="questReminderSummary"
                                                    class="text-[11px] text-gray-500">
                                                </div>
                                                <div class="flex items-center gap-1">
                                                    <button type="button"
                                                        class="p-1 text-gray-400 hover:text-gray-600"
                                                        onclick="questReminderChangeMonth(-1)">
                                                        &#10094;
                                                    </button>
                                                    <div id="questReminderMonthLabel"
                                                        class="text-[11px] font-semibold text-gray-700 min-w-[90px] text-center">
                                                    </div>
                                                    <button type="button"
                                                        class="p-1 text-gray-400 hover:text-gray-600"
                                                        onclick="questReminderChangeMonth(1)">
                                                        &#10095;
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-7 gap-1 text-[10px] text-gray-400 mb-1">
                                                <div class="text-center">Su</div>
                                                <div class="text-center">Mo</div>
                                                <div class="text-center">Tu</div>
                                                <div class="text-center">We</div>
                                                <div class="text-center">Th</div>
                                                <div class="text-center">Fr</div>
                                                <div class="text-center">Sa</div>
                                            </div>
                                            <div id="questReminderCalendarGrid"
                                                class="grid grid-cols-7 gap-1 text-[11px] text-gray-500">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="space-y-4 text-sm">
                    <div class="flex items-center gap-3">
                        <div class="font-medium text-gray-500 w-24">Positions</div>
                        <div class="flex-1">
                            <div class="relative">
                                <button type="button"
                                    class="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-left text-gray-700"
                                    onclick="document.getElementById('questPositionDropdown').classList.toggle('hidden')">
                                    <span id="questPositionButtonLabel" class="text-xs md:text-sm">Select positions...</span>
                                    <span class="text-gray-400 text-xs md:text-sm">&#9662;</span>
                                </button>
                                <div id="questPositionDropdown"
                                    class="absolute top-full left-0 right-0 mt-2 rounded-xl border border-gray-200 bg-white shadow-lg p-3 hidden max-h-60 overflow-y-auto text-xs md:text-sm z-20">
                                    <span class="text-gray-400 text-xs">Loading positions...</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-3">
                        <div class="font-medium text-gray-500 w-24">Notify to</div>
                        <div class="flex-1">
                            <div class="relative">
                                <button type="button"
                                    class="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-left text-gray-700"
                                    onclick="document.getElementById('questNotifyDropdown').classList.toggle('hidden')">
                                    <span class="flex items-center gap-2">
                                        <span id="questNotifyAvatars" class="flex -space-x-1"></span>
                                        <span id="questNotifyButtonLabel" class="text-xs md:text-sm">Select user...</span>
                                    </span>
                                    <span class="text-gray-400 text-xs md:text-sm">&#9662;</span>
                                </button>
                                <div id="questNotifyDropdown"
                                    class="absolute top-full left-0 mt-2 w-72 md:w-80 rounded-2xl bg-slate-900 text-white shadow-2xl p-3 hidden text-xs md:text-sm z-40">
                                    <div class="mb-3">
                                        <div class="relative">
                                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                                                &#128269;
                                            </span>
                                            <input id="questNotifySearch" type="text"
                                                class="w-full rounded-full bg-slate-800 text-xs md:text-sm text-white placeholder-slate-500 pl-8 pr-3 py-1.5 outline-none border border-slate-700 focus:border-sky-500 focus:ring-0"
                                                placeholder="Search..." />
                                        </div>
                                    </div>
                                    <div class="text-[10px] tracking-[0.18em] text-slate-400 font-semibold mb-2">
                                        PEOPLE
                                    </div>
                                    <div id="questNotifyList" class="max-h-56 overflow-y-auto flex flex-col gap-1">
                                        <div class="text-slate-500 text-xs">Loading users...</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="font-medium text-gray-500 w-24">Task point</div>
                        <input id="questPointInput" type="number" min="0" placeholder="0"
                            class="w-24 rounded-xl border border-gray-200 px-3 py-2 text-xs md:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="font-medium text-gray-500 w-24">Tags</div>
                        <div class="flex-1">
                            <div class="tag-selector w-full" id="tag-selector-quest">
                                <div class="tag-selector-control" onclick="toggleQuestTagDropdown()">
                                    <div class="tag-selected-list" id="quest-tag-selected">
                                        <span class="tag-placeholder">Search or add tags...</span>
                                    </div>
                                    <span class="text-gray-400 text-xs md:text-sm">&#9662;</span>
                                </div>
                                <div class="tag-dropdown" id="quest-tag-dropdown">
                                    <input type="text" id="quest-tag-input" class="tag-search-input" placeholder="Search or add tags..." oninput="filterQuestTagOptions()">
                                    <div class="tag-options" id="quest-tag-options"></div>
                                    <div class="tag-create" id="quest-tag-create" style="display:none;" onclick="createQuestTagFromInput()">
                                        <span>Create</span>
                                        <span class="tag-create-label" id="quest-tag-create-label"></span>
                                    </div>
                                </div>
                                <input type="hidden" id="quest-tags" value="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="rich-editor mb-6">
                <div class="rich-toolbar">
                    <div class="rich-toolbar-left">
                        <button type="button" class="rich-btn" title="Bold" onclick="questApplyFormat('questDescEditor','bold')"><i class="bi bi-type-bold"></i></button>
                        <button type="button" class="rich-btn" title="Italic" onclick="questApplyFormat('questDescEditor','italic')"><i class="bi bi-type-italic"></i></button>
                        <button type="button" class="rich-btn" title="Underline" onclick="questApplyFormat('questDescEditor','underline')"><i class="bi bi-type-underline"></i></button>
                        <div class="w-px h-4 bg-gray-300 mx-1"></div>
                        <button type="button" class="rich-btn" title="Bullet List" onclick="questApplyFormat('questDescEditor','insertUnorderedList')"><i class="bi bi-list-ul"></i></button>
                        <button type="button" class="rich-btn" title="Numbered List" onclick="questApplyFormat('questDescEditor','insertOrderedList')"><i class="bi bi-list-ol"></i></button>
                        <div class="w-px h-4 bg-gray-300 mx-1"></div>
                        <button type="button" class="rich-btn" title="Add Link" onclick="addLinkToEditor('questDescEditor')"><i class="bi bi-link-45deg"></i></button>
                    </div>
                    <div class="rich-toolbar-right">
                        <button type="button" class="rich-btn" title="Add Files" onclick="document.getElementById('quest-desc-file-input').click()"><i class="bi bi-paperclip"></i></button>
                        <input type="file" id="quest-desc-file-input" class="hidden" multiple onchange="questHandleDescFiles(this)" />
                    </div>
                </div>
                <div id="questDescEditor" class="rich-editor-body outline-none" contenteditable="true" data-placeholder="Task description or notes..."></div>
            </div>
            <div class="flex flex-col md:flex-row items-stretch md:items-center justify-end gap-3">
                <button type="button"
                    class="rounded-full px-7 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200"
                    onclick="toggleQuestForm()">
                    Cancel
                </button>
                <button type="button"
                    id="questSaveButton"
                    class="rounded-full px-8 py-2.5 text-sm font-semibold text-white btn-dlg-blue"
                    box-shadow: 0 10px 25px rgba(59,130,246,0.35);"
                    onclick="saveQuest()">
                    Create Quest    
                </button>
            </div>
        </div>

        <section class="mb-12">
            <div class="flex items-center gap-2 mb-6">
                <h2 class="text-2xl font-bold text-red-600">Overdue</h2>
            </div>
            
            <div class="space-y-8" id="questOverdueList">
            </div>
        </section>

        <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 text-blue-600">Todays</h2>
            <div class="space-y-6" id="questTodayList">
            </div>
        </section>

        <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 text-green-600">Upcoming</h2>
            <div class="space-y-6" id="questUpcomingList">
            </div>
        </section>

    </div>

    <div id="questReminderAlert"
        class="fixed inset-0 flex items-center justify-center bg-black/40 z-40 hidden">
        <div class="bg-white rounded-2xl shadow-xl px-6 py-5 max-w-sm w-full mx-4">
            <div class="text-sm font-semibold text-gray-900 mb-2">Reminder unavailable</div>
            <div class="text-xs text-gray-600 mb-4">
                Please select Dates before setting a reminder.
            </div>
            <div class="flex justify-end gap-2">
                <button type="button"
                    class="rounded-full px-4 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200"
                    onclick="document.getElementById('questReminderAlert').classList.add('hidden')">
                    OK
                </button>
            </div>
        </div>
    </div>

    <div id="questUniversalAlert"
        class="fixed inset-0 flex items-center justify-center bg-black/40 z-40 hidden">
        <div class="bg-white rounded-2xl shadow-xl px-6 py-5 max-w-sm w-full mx-4">
            <div id="questAlertTitle" class="text-sm font-semibold text-gray-900 mb-2"></div>
            <div id="questAlertMessage" class="text-xs text-gray-600 mb-4"></div>
            <div class="flex justify-end gap-2">
                <button type="button" id="questAlertCancelButton"
                    class="rounded-full px-4 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 hidden"
                    onclick="questAlertCancel()">
                    Cancel
                </button>
                <button type="button" id="questAlertOkButton"
                    class="rounded-full px-4 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200"
                    onclick="questAlertOk()">
                    OK
                </button>
            </div>
        </div>
    </div>

    <div id="sideQuestDescModal"
        class="fixed inset-0 flex items-center justify-center bg-black/40 z-40 hidden">
        <div class="bg-white rounded-2xl shadow-xl px-6 py-5 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-3">
                <div class="text-sm font-semibold text-gray-900">Task Description</div>
                <button type="button"
                    class="text-gray-400 hover:text-gray-600"
                    onclick="closeSideQuestDescModal()">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div id="sideQuestDescModalBody" class="text-sm text-gray-700 leading-relaxed"></div>
        </div>
    </div>

    <script>
        var questTasksById = {};
        var questUsersById = {};
        var questActionMode = null;
        var questEditingTaskId = null;
        var questCurrentPriority = 'urgent';
        var sideQuestCurrentPriority = 'normal';

        function applyFormat(editorId, command) {
            var editor = document.getElementById(editorId);
            if (!editor) return;
            editor.focus();
            document.execCommand(command, false, null);

            // Update button states
            var toolbar = editor.previousElementSibling;
            if (toolbar && toolbar.classList.contains('rich-toolbar')) {
                var btns = toolbar.querySelectorAll('.rich-btn');
                btns.forEach(function (btn) {
                    var cmd = btn.getAttribute('onclick');
                    if (cmd && (cmd.indexOf('applyFormat') !== -1 || cmd.indexOf('questApplyFormat') !== -1)) {
                        var parts = cmd.split("'");
                        var part = parts[3];
                        if (part && document.queryCommandState(part)) {
                            btn.classList.add('active');
                        } else {
                            btn.classList.remove('active');
                        }
                    }
                });
            }
        }

        function handleSideQuestFiles(input) {
            if (input.files && input.files.length > 0) {
                var container = input.closest('.rich-editor');
                // Jika input file berada di luar rich-editor (seperti "Optional : Attach files")
                // maka kita cari container terdekat yang menaungi area laporan
                if (!container) {
                    container = input.closest('#report-accordion-' + input.id.split('-')[1]);
                }
                if (!container) return;

                var fileList = container.querySelector('.rich-file-list');
                if (!fileList) {
                    fileList = document.createElement('div');
                    fileList.className = 'rich-file-list px-4 py-2 border-t border-gray-100 flex flex-wrap gap-2';
                    container.appendChild(fileList);
                }

                Array.from(input.files).forEach(function (file) {
                    var item = document.createElement('div');
                    item.className = 'flex items-center gap-2 bg-gray-50 px-2 py-1 rounded text-xs text-gray-600 border border-gray-200';
                    item.innerHTML = '<i class="bi bi-file-earmark"></i> <span>' + file.name + '</span><button type="button" class="text-gray-400 hover:text-red-500" onclick="this.parentElement.remove()"><i class="bi bi-x"></i></button>';
                    fileList.appendChild(item);
                });
            }
        }

        function toggleReportAccordion(taskId) {
            var accordion = document.getElementById('report-accordion-' + taskId);
            var card = document.querySelector('[data-task-id="' + taskId + '"]');
            var btn = card.querySelector('.quest-card-check-btn');
            var icon = btn.querySelector('i');

            if (accordion.classList.contains('hidden')) {
                accordion.classList.remove('hidden');
                btn.classList.add('bg-emerald-500', 'border-emerald-500', 'text-white');
                if (icon) {
                    icon.classList.remove('text-gray-400');
                    icon.classList.add('text-white');
                }
            } else {
                accordion.classList.add('hidden');
                btn.classList.remove('bg-emerald-500', 'border-emerald-500', 'text-white');
                if (icon) {
                    icon.classList.add('text-gray-400');
                    icon.classList.remove('text-white');
                }
            }
        }

        async function submitSideQuestReport(taskId) {
            var editor = document.getElementById('reportEditor-' + taskId);
            var reportContent = editor.innerHTML;
            if (!reportContent || reportContent.trim() === '' || editor.textContent.trim() === '') {
                alert('Please enter your report before submitting.');
                return;
            }

            var notifySelected = [];
            Array.prototype.slice.call(
                document.querySelectorAll('#sideQuestNotifyDropdown input[type="checkbox"]:checked')
            ).forEach(function (cb) {
                var uid = cb.getAttribute('data-user-id') || '';
                if (uid) notifySelected.push(uid);
            });
            if (notifySelected.length === 0) {
                showQuestAlert('Information', 'This Task Complete Without Anyone to Report.');
                return;
            }

            var parentWin = window.parent;
            if (!parentWin || !parentWin.db || !parentWin.collection || !parentWin.addDoc || !parentWin.doc || !parentWin.updateDoc) {
                alert('Database connection not available.');
                return;
            }

            try {
                var fileInput = document.getElementById('reportFileInput-' + taskId);
                var files = fileInput.files;
                var attachedFiles = [];

                var refFn = parentWin.ref || parentWin.storageRef;
                if (files && files.length > 0) {
                    if (!(parentWin.storage && refFn && parentWin.uploadBytes && parentWin.getDownloadURL)) {
                        alert('Upload file belum tersedia. Silakan refresh halaman lalu coba lagi.');
                        return;
                    }
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        var path = 'reports/' + taskId + '/' + Date.now() + '_' + file.name;
                        var sRef = refFn(parentWin.storage, path);
                        await parentWin.uploadBytes(sRef, file);
                        var url = await parentWin.getDownloadURL(sRef);
                        attachedFiles.push({
                            name: file.name,
                            url: url,
                            type: file.type
                        });
                    }
                }

                var reportData = {
                    taskId: taskId,
                    content: reportContent,
                    files: attachedFiles,
                    submittedAt: new Date().toISOString(),
                    submittedBy: parentWin.auth && parentWin.auth.currentUser ? parentWin.auth.currentUser.uid : 'unknown'
                };
                var reportPayload = reportData;
                if (parentWin.JSON && parentWin.JSON.stringify && parentWin.JSON.parse) {
                    try {
                        reportPayload = parentWin.JSON.parse(parentWin.JSON.stringify(reportData));
                    } catch (err) {
                        reportPayload = reportData;
                    }
                }
                
                await parentWin.addDoc(parentWin.collection(parentWin.db, 'quest_reports'), reportPayload);

                // Update task status to complete if not already
                if (questTasksById[taskId] && (questTasksById[taskId].status || questTasksById[taskId].Status) !== 'Complete') {
                    await parentWin.updateDoc(parentWin.doc(parentWin.db, 'tasks', taskId), { status: 'Complete' });
                    questTasksById[taskId].status = 'Complete';
                }

                alert('Report submitted successfully!');
                toggleReportAccordion(taskId);
                if (typeof loadSideQuestTasks === 'function') {
                    loadSideQuestTasks();
                }
            } catch (e) {
                console.error('Failed to submit report', e);
                alert('Failed to submit report: ' + e.message);
            }
        }



        function questOpenTask(taskId) {
            if (!taskId) return;
            if (!questTasksById || !questTasksById[taskId]) {
                showQuestAlert('Perhatian', 'Tidak dapat menemukan data Side Quest untuk diedit.');
                return;
            }
            var data = questTasksById[taskId] || {};
            sideQuestEditingTaskId = taskId;
            var dropdown = document.getElementById('sideQuestCreateDropdown');
            var headerToggle = document.getElementById('sideQuestHeaderToggleButton');
            var headerMenu = document.getElementById('sideQuestHeaderMenu');
            if (dropdown) {
                dropdown.classList.remove('hidden');
                if (dropdown.scrollIntoView) {
                    dropdown.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
            if (headerToggle) {
                headerToggle.classList.add('hidden');
            }
            if (headerMenu) {
                headerMenu.classList.add('hidden');
            }
            var saveBtn = document.getElementById('sideQuestSaveButton');
            if (saveBtn) {
                saveBtn.textContent = 'Update Side Quest';
            }
            var input = document.getElementById('sideQuestNameInput');
            if (input) {
                input.value = data.title || '';
                if (input.focus) {
                    input.focus();
                }
            }
            var startEl = document.getElementById('sideQuestStartInput');
            if (startEl) {
                var startVal = data.start_date || data.startDate || '';
                startEl.value = startVal;
            }
            var dueEl = document.getElementById('sideQuestDueInput');
            if (dueEl) {
                var dueVal = data.due_date || data.dueDate || '';
                dueEl.value = dueVal;
            }
            var pointsEl = document.getElementById('sideQuestPointsInput');
            if (pointsEl) {
                var pointsVal = typeof data.points === 'number' ? data.points : (data.points ? Number(data.points) || 0 : 0);
                pointsEl.value = pointsVal ? String(pointsVal) : '';
            }
            var descEl = document.getElementById('sideQuestDesc');
            if (descEl) {
                descEl.innerHTML = data.description || '';
            }
            var tags = [];
            if (Array.isArray(data.tags)) {
                tags = data.tags.slice();
            }
            setSideQuestTags(tags);
            var departmentsMap = {};
            if (Array.isArray(data.departments)) {
                data.departments.forEach(function (d) {
                    if (d && d.id) {
                        departmentsMap[d.id] = true;
                    }
                });
            }
            Array.prototype.slice.call(
                document.querySelectorAll('#sideQuestDepartmentDropdown input[type="checkbox"]')
            ).forEach(function (cb) {
                var id = cb.getAttribute('data-dept-id') || '';
                cb.checked = !!departmentsMap[id];
            });
            updateSideQuestDepartmentLabel();
            var positionsMap = {};
            if (Array.isArray(data.positions)) {
                data.positions.forEach(function (p) {
                    if (p && p.id) {
                        positionsMap[p.id] = true;
                    }
                });
            }
            Array.prototype.slice.call(
                document.querySelectorAll('#sideQuestPositionDropdown input[type="checkbox"]')
            ).forEach(function (cb) {
                var id = cb.getAttribute('data-position-id') || '';
                cb.checked = !!positionsMap[id];
            });
            updateSideQuestPositionLabel();
            var assignSet = {};
            if (Array.isArray(data.assign_to)) {
                data.assign_to.forEach(function (uid) {
                    if (uid) {
                        assignSet[String(uid)] = true;
                    }
                });
            } else if (data.assign_to) {
                assignSet[String(data.assign_to)] = true;
            }
            Array.prototype.slice.call(
                document.querySelectorAll('#sideQuestAssignDropdown input[type="checkbox"]')
            ).forEach(function (cb) {
                var uid = cb.getAttribute('data-user-id') || '';
                cb.checked = !!assignSet[uid];
            });
            updateSideQuestUserLabel('sideQuestAssignDropdown', 'sideQuestAssignButtonLabel', 'Select user...', 'sideQuestAssignAvatars');
            var notifySet = {};
            if (Array.isArray(data.notify_to)) {
                data.notify_to.forEach(function (uid) {
                    if (uid) {
                        notifySet[String(uid)] = true;
                    }
                });
            } else if (data.notify_to) {
                notifySet[String(data.notify_to)] = true;
            }
            Array.prototype.slice.call(
                document.querySelectorAll('#sideQuestNotifyDropdown input[type="checkbox"]')
            ).forEach(function (cb) {
                var uid = cb.getAttribute('data-user-id') || '';
                cb.checked = !!notifySet[uid];
            });
            updateSideQuestUserLabel('sideQuestNotifyDropdown', 'sideQuestNotifyButtonLabel', 'Select user...', 'sideQuestNotifyAvatars');
            var priority = String(data.priority || 'normal').toLowerCase();
            sideQuestCurrentPriority = priority;
            var buttons = document.querySelectorAll('.side-quest-priority-btn');
            Array.prototype.slice.call(buttons).forEach(function (btn) {
                var p = btn.getAttribute('data-priority') || '';
                if (p === priority) {
                    btn.classList.add('border-slate-900', 'bg-slate-900', 'text-white');
                } else {
                    btn.classList.remove('border-slate-900', 'bg-slate-900', 'text-white');
                }
            });
            
            // Populate files
            sideQuestCurrentFiles = Array.isArray(data.files) ? JSON.parse(JSON.stringify(data.files)) : [];
            var fileInput = document.getElementById('sideQuestFileInput');
            if (fileInput) fileInput.value = '';
            
            var richEditor = document.querySelector('#sideQuestCreateDropdown .rich-editor');
            if (richEditor) {
                var fileList = richEditor.querySelector('.rich-file-list');
                if (!fileList) {
                    fileList = document.createElement('div');
                    fileList.className = 'rich-file-list px-4 py-2 border-t border-gray-100 flex flex-wrap gap-2';
                    richEditor.appendChild(fileList);
                }
                fileList.innerHTML = '';
                sideQuestCurrentFiles.forEach(function(file, idx) {
                    var item = document.createElement('div');
                    item.className = 'flex items-center gap-2 bg-gray-50 px-2 py-1 rounded text-xs text-gray-600 border border-gray-200';
                    item.innerHTML = '<i class="bi bi-file-earmark"></i> <span class="truncate max-w-[150px]">' + (file.name || 'File') + '</span>' +
                                   '<button type="button" class="text-gray-400 hover:text-red-500" onclick="sideQuestRemoveFile(' + idx + ')"><i class="bi bi-x"></i></button>';
                    fileList.appendChild(item);
                });
            }
        }
        
        window.sideQuestRemoveFile = function(idx) {
            if (idx >= 0 && idx < sideQuestCurrentFiles.length) {
                sideQuestCurrentFiles.splice(idx, 1);
                // Refresh UI
                var richEditor = document.querySelector('#sideQuestCreateDropdown .rich-editor');
                if (richEditor) {
                    var fileList = richEditor.querySelector('.rich-file-list');
                    if (fileList) {
                        fileList.innerHTML = '';
                        sideQuestCurrentFiles.forEach(function(file, i) {
                            var item = document.createElement('div');
                            item.className = 'flex items-center gap-2 bg-gray-50 px-2 py-1 rounded text-xs text-gray-600 border border-gray-200';
                            item.innerHTML = '<i class="bi bi-file-earmark"></i> <span class="truncate max-w-[150px]">' + (file.name || 'File') + '</span>' +
                                           '<button type="button" class="text-gray-400 hover:text-red-500" onclick="sideQuestRemoveFile(' + i + ')"><i class="bi bi-x"></i></button>';
                            fileList.appendChild(item);
                        });
                    }
                }
            }
        };

        if (window.lucide && window.lucide.createIcons) {
            window.lucide.createIcons();
        }
        var questAlertOkHandler = null;
        var questAlertCancelHandler = null;

        function initQuestTooltips() {
            if (typeof bootstrap === 'undefined' || !bootstrap.Tooltip) return;
            var triggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            triggerList.forEach(function (el) {
                try {
                    new bootstrap.Tooltip(el);
                } catch (e) {}
            });
        }

        function showQuestAlert(title, message) {
            var modal = document.getElementById('questUniversalAlert');
            var titleEl = document.getElementById('questAlertTitle');
            var messageEl = document.getElementById('questAlertMessage');
            var okBtn = document.getElementById('questAlertOkButton');
            var cancelBtn = document.getElementById('questAlertCancelButton');
            if (!modal || !titleEl || !messageEl || !okBtn || !cancelBtn) {
                alert((title ? title + ': ' : '') + message);
                return;
            }
            questAlertOkHandler = null;
            questAlertCancelHandler = null;
            cancelBtn.classList.add('hidden');
            okBtn.textContent = 'OK';
            titleEl.textContent = title;
            messageEl.textContent = message;
            modal.classList.remove('hidden');
        }

        function showQuestConfirm(title, message, onOk, onCancel) {
            var modal = document.getElementById('questUniversalAlert');
            var titleEl = document.getElementById('questAlertTitle');
            var messageEl = document.getElementById('questAlertMessage');
            var okBtn = document.getElementById('questAlertOkButton');
            var cancelBtn = document.getElementById('questAlertCancelButton');
            if (!modal || !titleEl || !messageEl || !okBtn || !cancelBtn) {
                var text = message;
                if (title) {
                    text = title + ': ' + message;
                }
                if (window.confirm(text)) {
                    if (typeof onOk === 'function') {
                        onOk();
                    }
                } else {
                    if (typeof onCancel === 'function') {
                        onCancel();
                    }
                }
                return;
            }
            questAlertOkHandler = typeof onOk === 'function' ? onOk : null;
            questAlertCancelHandler = typeof onCancel === 'function' ? onCancel : null;
            cancelBtn.classList.remove('hidden');
            okBtn.textContent = 'OK';
            titleEl.textContent = title;
            messageEl.textContent = message;
            modal.classList.remove('hidden');
        }

        function questAlertOk() {
            var modal = document.getElementById('questUniversalAlert');
            if (modal) {
                modal.classList.add('hidden');
            }
            if (questAlertOkHandler) {
                var handler = questAlertOkHandler;
                questAlertOkHandler = null;
                questAlertCancelHandler = null;
                handler();
            }
        }

        function questAlertCancel() {
            var modal = document.getElementById('questUniversalAlert');
            if (modal) {
                modal.classList.add('hidden');
            }
            if (questAlertCancelHandler) {
                var handler = questAlertCancelHandler;
                questAlertOkHandler = null;
                questAlertCancelHandler = null;
                handler();
            }
        }

        function openSideQuestDescription(taskId, descHtml) {
            console.log('openSideQuestDescription called for taskId:', taskId);
            // Try to find the modal in the current window or parent
            var modal = document.getElementById('sideQuestDescModal');
            var body = document.getElementById('sideQuestDescModalBody');
            
            if (!modal || !body) {
                // Try parent if not found locally
                if (window.parent && window.parent.document) {
                    modal = window.parent.document.getElementById('sideQuestDescModal');
                    body = window.parent.document.getElementById('sideQuestDescModalBody');
                }
            }

            if (modal && body) {
                body.innerHTML = descHtml || 'No description available.';
                modal.classList.remove('hidden');
            } else {
                console.warn('Could not find sideQuestDescModal or body, falling back to alert');
                if (descHtml) {
                    // Strip HTML for alert
                    var plainText = descHtml.replace(/<[^>]*>/g, '');
                    alert(plainText);
                } else {
                    alert('No description available.');
                }
            }
        }
        window.openSideQuestDescription = openSideQuestDescription;
        window.closeSideQuestDescModal = closeSideQuestDescModal;

        function closeSideQuestDescModal() {
            var modal = document.getElementById('sideQuestDescModal');
            if (modal) {
                modal.classList.add('hidden');
            }
        }
        if (typeof window !== 'undefined') {
            window.openSideQuestDescription = openSideQuestDescription;
            window.closeSideQuestDescModal = closeSideQuestDescModal;
        }

        function switchTab(priority, element) {
            document.querySelectorAll('.nav-card').forEach(function (card) {
                card.classList.remove('active');
                card.classList.remove('shadow-lg', '-translate-y-1');
            });
            if (element) {
                element.classList.add('active');
                element.classList.add('shadow-lg', '-translate-y-1');
            }
            questCurrentPriority = priority;
            document.querySelectorAll('.tab-pane').forEach(function (pane) { pane.classList.add('hidden'); });
            var pane = document.getElementById(priority + '-content');
            if (pane) {
                pane.classList.remove('hidden');
            }
        }
        if (typeof window !== 'undefined') {
            window.switchTab = switchTab;
        }
        function toggleQuestForm() {
            var el = document.getElementById('questCreateForm');
            if (!el) return;
            var headerToggle = document.getElementById('questHeaderToggleButton');
            var headerMenu = document.getElementById('questHeaderMenu');
            var willShow = el.classList.contains('hidden');
            if (willShow) {
                el.classList.remove('hidden');
                if (headerToggle) headerToggle.classList.add('hidden');
                if (headerMenu) headerMenu.classList.add('hidden');
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                el.classList.add('hidden');
                if (headerToggle) headerToggle.classList.remove('hidden');
                if (headerMenu) headerMenu.classList.add('hidden');
            }
        }
        function setSideQuestPriority(priority, element) {
            sideQuestCurrentPriority = priority || 'normal';
            var buttons = document.querySelectorAll('.side-quest-priority-btn');
            Array.prototype.slice.call(buttons).forEach(function (btn) {
                btn.classList.remove('border-slate-900', 'bg-slate-900', 'text-white');
            });
            if (element) {
                element.classList.add('border-slate-900', 'bg-slate-900', 'text-white');
            }
        }
        function toggleSideQuestUserDropdown(field) {
            var dropdownId = field === 'assign' ? 'sideQuestAssignDropdown' : 'sideQuestNotifyDropdown';
            var searchId = field === 'assign' ? 'sideQuestAssignSearch' : 'sideQuestNotifySearch';
            var dropdown = document.getElementById(dropdownId);
            if (!dropdown) return;
            var isHidden = dropdown.classList.contains('hidden');
            if (isHidden) {
                dropdown.classList.remove('hidden');
                var search = document.getElementById(searchId);
                if (search && search.focus) {
                    search.focus();
                    if (search.select) search.select();
                }
            } else {
                dropdown.classList.add('hidden');
            }
        }
        function toggleSideQuestDropdown(event) {
            var dropdown = document.getElementById('sideQuestCreateDropdown');
            if (!dropdown) return;
            if (event && event.stopPropagation) {
                event.stopPropagation();
            }
            var headerToggle = document.getElementById('sideQuestHeaderToggleButton');
            var headerMenu = document.getElementById('sideQuestHeaderMenu');
            var willShow = dropdown.classList.contains('hidden');
            if (willShow) {
                dropdown.classList.remove('hidden');
                if (headerToggle) headerToggle.classList.add('hidden');
                if (headerMenu) headerMenu.classList.add('hidden');
                sideQuestEditingTaskId = null;
                var saveBtn = document.getElementById('sideQuestSaveButton');
                if (saveBtn) {
                    saveBtn.textContent = 'Add Side Quest';
                }
                var input = document.getElementById('sideQuestNameInput');
                if (input && input.focus) {
                    input.focus();
                }
                if (!sideQuestCurrentPriority) {
                    setSideQuestPriority('normal');
                } else {
                    var buttons = document.querySelectorAll('.side-quest-priority-btn');
                    Array.prototype.slice.call(buttons).forEach(function (btn) {
                        if (btn.getAttribute('data-priority') === sideQuestCurrentPriority) {
                            btn.classList.add('border-slate-900', 'bg-slate-900', 'text-white');
                        } else {
                            btn.classList.remove('border-slate-900', 'bg-slate-900', 'text-white');
                        }
                    });
                }
            } else {
                dropdown.classList.add('hidden');
                if (headerToggle) headerToggle.classList.remove('hidden');
                if (headerMenu) headerMenu.classList.add('hidden');
            }
        }
        function toggleSideQuestUserDropdown(field) {
            var dropdownId = field === 'assign' ? 'sideQuestAssignDropdown' : 'sideQuestNotifyDropdown';
            var searchId = field === 'assign' ? 'sideQuestAssignSearch' : 'sideQuestNotifySearch';
            var dropdown = document.getElementById(dropdownId);
            if (!dropdown) return;
            var isHidden = dropdown.classList.contains('hidden');
            if (isHidden) {
                dropdown.classList.remove('hidden');
                var search = document.getElementById(searchId);
                if (search && search.focus) {
                    search.focus();
                    if (search.select) search.select();
                }
            } else {
                dropdown.classList.add('hidden');
            }
        }
        function updateSideQuestUserLabel(dropdownId, labelId, placeholderText, avatarsId) {
            var dropdown = document.getElementById(dropdownId);
            var labelEl = document.getElementById(labelId);
            var avatarsEl = avatarsId ? document.getElementById(avatarsId) : null;
            if (!dropdown) return;
            var selected = Array.prototype.slice.call(
                dropdown.querySelectorAll('input[type="checkbox"]:checked')
            );
            if (!selected.length) {
                if (labelEl) {
                    labelEl.textContent = placeholderText;
                }
                if (avatarsEl) {
                    avatarsEl.innerHTML = '';
                }
                return;
            }
            var names = selected.map(function (cb) {
                var row = cb.closest('.quest-user-option');
                if (!row) return '';
                var nameEl = row.querySelector('.quest-user-name');
                return nameEl ? nameEl.textContent.trim() : '';
            }).filter(function (v) { return v; });
            if (avatarsEl) {
                avatarsEl.innerHTML = '';
                var maxAvatars = 4;
                selected.forEach(function (cb, index) {
                    if (index >= maxAvatars) return;
                    var row = cb.closest('.quest-user-option');
                    var imgEl = row ? row.querySelector('img') : null;
                    var name = names[index] || '';
                    var uid = cb.getAttribute('data-user-id') || '';
                    var source = name || uid;
                    var initials = 'U';
                    if (source) {
                        var parts = String(source).trim().split(/\s+/);
                        var tmp = parts.map(function (p) { return p[0]; }).join('');
                        initials = tmp.substring(0, 2).toUpperCase();
                    }
                    var avatarNode;
                    if (imgEl && imgEl.getAttribute('src')) {
                        avatarNode = document.createElement('img');
                        avatarNode.src = imgEl.getAttribute('src');
                        avatarNode.alt = name || '';
                        avatarNode.className = 'w-6 h-6 rounded-full object-cover border border-gray-200';
                    } else {
                        avatarNode = document.createElement('span');
                        avatarNode.className = 'w-6 h-6 rounded-full bg-slate-700 text-slate-100 text-[10px] font-semibold flex items-center justify-center';
                        avatarNode.textContent = initials;
                    }
                    avatarsEl.appendChild(avatarNode);
                });
                if (selected.length > maxAvatars) {
                    var more = document.createElement('span');
                    more.className = 'w-6 h-6 rounded-full bg-slate-800 text-slate-100 text-[10px] font-semibold flex items-center justify-center';
                    more.textContent = '+' + (selected.length - maxAvatars);
                    avatarsEl.appendChild(more);
                }
            }
            if (labelEl) {
                labelEl.textContent = '';
            }
        }
        function getSideQuestTags() {
            var hidden = document.getElementById('sideQuest-tags');
            if (!hidden || !hidden.value) return [];
            return hidden.value.split(',').map(function (t) { return t.trim(); }).filter(function (t) { return t; });
        }
        function setSideQuestTags(tags) {
            var hidden = document.getElementById('sideQuest-tags');
            if (!hidden) return;
            var clean = Array.from(new Set(tags.map(function (t) { return String(t || '').trim(); }).filter(function (t) { return t; })));
            hidden.value = clean.join(',');
            updateSideQuestSelectedTagUI();
            var optionsContainer = document.getElementById('sideQuest-tag-options');
            if (!optionsContainer) return;
            Array.prototype.slice.call(optionsContainer.children).forEach(function (opt) {
                var tag = opt.getAttribute('data-tag') || '';
                if (!tag) return;
                if (clean.indexOf(tag) !== -1) {
                    opt.classList.add('tag-option-selected');
                } else {
                    opt.classList.remove('tag-option-selected');
                }
            });
        }
        function updateSideQuestSelectedTagUI() {
            var selectedContainer = document.getElementById('sideQuest-tag-selected');
            if (!selectedContainer) return;
            var tags = getSideQuestTags();
            selectedContainer.innerHTML = '';
            if (!tags.length) {
                var span = document.createElement('span');
                span.className = 'tag-placeholder';
                span.textContent = 'Search or add tags...';
                selectedContainer.appendChild(span);
                return;
            }
            tags.forEach(function (tag) {
                var pill = document.createElement('span');
                pill.className = 'tag-pill';
                pill.textContent = tag;
                var remove = document.createElement('span');
                remove.className = 'tag-remove';
                remove.textContent = '×';
                remove.onclick = function (event) {
                    event.stopPropagation();
                    removeSideQuestTagFromSelection(tag);
                };
                pill.appendChild(remove);
                selectedContainer.appendChild(pill);
            });
        }
        function toggleSideQuestTagDropdown() {
            var dropdown = document.getElementById('sideQuest-tag-dropdown');
            if (!dropdown) return;
            var isOpen = dropdown.style.display === 'block';
            dropdown.style.display = isOpen ? 'none' : 'block';
            if (!isOpen) {
                var input = document.getElementById('sideQuest-tag-input');
                if (input) {
                    input.focus();
                    input.select();
                }
                filterSideQuestTagOptions();
            }
        }
        function filterSideQuestTagOptions() {
            var input = document.getElementById('sideQuest-tag-input');
            var optionsContainer = document.getElementById('sideQuest-tag-options');
            var createRow = document.getElementById('sideQuest-tag-create');
            var createLabel = document.getElementById('sideQuest-tag-create-label');
            if (!input || !optionsContainer || !createRow || !createLabel) return;
            var query = input.value.trim().toLowerCase();
            var hasVisible = false;
            var hasExact = false;
            Array.prototype.slice.call(optionsContainer.children).forEach(function (opt) {
                var tag = String(opt.getAttribute('data-tag') || '').toLowerCase();
                var visible = !query || tag.indexOf(query) !== -1;
                opt.style.display = visible ? 'flex' : 'none';
                if (visible) {
                    hasVisible = true;
                }
                if (tag === query && query) {
                    hasExact = true;
                }
            });
            if (query && !hasExact) {
                createRow.style.display = 'flex';
                createLabel.textContent = input.value.trim();
            } else {
                createRow.style.display = 'none';
                createLabel.textContent = '';
            }
            if (!query && !hasVisible) {
                createRow.style.display = 'none';
                createLabel.textContent = '';
            }
        }
        function toggleSideQuestTagFromOption(tag) {
            var current = getSideQuestTags();
            var index = current.indexOf(tag);
            if (index >= 0) {
                current.splice(index, 1);
            } else {
                current.push(tag);
            }
            setSideQuestTags(current);
        }
        function createSideQuestTagFromInput() {
            var input = document.getElementById('sideQuest-tag-input');
            if (!input) return;
            var value = input.value.trim();
            if (!value) return;
            var current = getSideQuestTags();
            if (current.indexOf(value) === -1) {
                current.push(value);
            }
            var optionsContainer = document.getElementById('sideQuest-tag-options');
            if (optionsContainer) {
                var exists = Array.prototype.slice.call(optionsContainer.children).some(function (opt) {
                    return String(opt.getAttribute('data-tag') || '') === value;
                });
                if (!exists) {
                    var opt = document.createElement('div');
                    opt.className = 'tag-option';
                    opt.setAttribute('data-tag', value);
                    opt.onclick = function () {
                        toggleSideQuestTagFromOption(value);
                    };
                    var pill = document.createElement('span');
                    pill.className = 'tag-pill';
                    pill.textContent = value;
                    opt.appendChild(pill);
                    optionsContainer.insertBefore(opt, optionsContainer.firstChild || null);
                }
            }
            setSideQuestTags(current);
            input.value = '';
            filterSideQuestTagOptions();
        }
        function removeSideQuestTagFromSelection(tag) {
            var current = getSideQuestTags();
            var index = current.indexOf(tag);
            if (index >= 0) {
                current.splice(index, 1);
                setSideQuestTags(current);
            }
        }
        function updateSideQuestDepartmentLabel() {
            var dropdown = document.getElementById('sideQuestDepartmentDropdown');
            var labelEl = document.getElementById('sideQuestDepartmentButtonLabel');
            if (!dropdown || !labelEl) return;
            var selected = Array.prototype.slice.call(
                dropdown.querySelectorAll('input[type="checkbox"]:checked')
            );
            if (!selected.length) {
                labelEl.textContent = 'Select departments...';
                return;
            }
            var names = selected.map(function (cb) {
                var row = cb.closest('.sidequest-dept-option');
                if (!row) return '';
                var nameEl = row.querySelector('.sidequest-dept-name');
                return nameEl ? nameEl.textContent.trim() : '';
            }).filter(function (v) { return v; });
            if (!names.length) {
                labelEl.textContent = 'Select departments...';
            } else if (names.length === 1) {
                labelEl.textContent = names[0];
            } else if (names.length === 2) {
                labelEl.textContent = names[0] + ', ' + names[1];
            } else {
                labelEl.textContent = names[0] + ' and ' + (names.length - 1) + ' more';
            }
        }
        function updateSideQuestPositionLabel() {
            var dropdown = document.getElementById('sideQuestPositionDropdown');
            var labelEl = document.getElementById('sideQuestPositionButtonLabel');
            if (!dropdown || !labelEl) return;
            var selected = Array.prototype.slice.call(
                dropdown.querySelectorAll('input[type="checkbox"]:checked')
            );
            if (!selected.length) {
                labelEl.textContent = 'Select positions...';
                return;
            }
            var names = selected.map(function (cb) {
                var row = cb.closest('.sidequest-position-option');
                if (!row) return '';
                var nameEl = row.querySelector('.sidequest-position-name');
                return nameEl ? nameEl.textContent.trim() : '';
            }).filter(function (v) { return v; });
            if (!names.length) {
                labelEl.textContent = 'Select positions...';
            } else if (names.length === 1) {
                labelEl.textContent = names[0];
            } else if (names.length === 2) {
                labelEl.textContent = names[0] + ', ' + names[1];
            } else {
                labelEl.textContent = names[0] + ' and ' + (names.length - 1) + ' more';
            }
        }
        async function loadSideQuestDepartments() {
            var dropdown = document.getElementById('sideQuestDepartmentDropdown');
            if (!dropdown) return;
            dropdown.innerHTML = '<span class="text-gray-400 text-xs">Loading departments...</span>';
            try {
                var parentWin = window.parent;
                if (!parentWin || !parentWin.db || !parentWin.collection || !parentWin.getDocs) {
                    dropdown.innerHTML = '<span class="text-red-500 text-xs">Departments not available.</span>';
                    return;
                }
                var snap = await parentWin.getDocs(parentWin.collection(parentWin.db, "departments"));
                dropdown.innerHTML = '';
                snap.forEach(function (docSnap) {
                    var d = docSnap.data() || {};
                    var name = d.name || "Untitled";
                    var color = d.color || "#0B2B6A";
                    var row = document.createElement('div');
                    row.className = 'sidequest-dept-option flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer';
                    row.innerHTML =
                        '<span class="inline-flex w-2.5 h-2.5 rounded-full" style="background:' + color + ';"></span>' +
                        '<span class="sidequest-dept-name flex-1 text-xs md:text-sm text-gray-700">' + name + '</span>' +
                        '<input type="checkbox" class="ml-2 accent-blue-600" data-dept-id="' + docSnap.id + '">';
                    dropdown.appendChild(row);
                    var checkbox = row.querySelector('input[type="checkbox"]');
                    checkbox.addEventListener('change', updateSideQuestDepartmentLabel);
                    row.addEventListener('click', function (e) {
                        if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'input') {
                            return;
                        }
                        checkbox.checked = !checkbox.checked;
                        updateSideQuestDepartmentLabel();
                    });
                });
                if (!dropdown.innerHTML.trim()) {
                    dropdown.innerHTML = '<span class="text-gray-400 text-xs">No departments available.</span>';
                } else {
                    updateSideQuestDepartmentLabel();
                }
            } catch (e) {
                console.error('Failed to load departments for side quest', e);
                dropdown.innerHTML = '<span class="text-red-500 text-xs">Failed to load departments.</span>';
            }
        }
        async function loadSideQuestPositions() {
            var dropdown = document.getElementById('sideQuestPositionDropdown');
            if (!dropdown) return;
            dropdown.innerHTML = '<span class="text-gray-400 text-xs">Loading positions...</span>';
            try {
                var parentWin = window.parent;
                if (!parentWin || !parentWin.db || !parentWin.collection || !parentWin.getDocs) {
                    dropdown.innerHTML = '<span class="text-red-500 text-xs">Positions not available.</span>';
                    return;
                }
                var snap = await parentWin.getDocs(parentWin.collection(parentWin.db, "positions"));
                dropdown.innerHTML = '';
                snap.forEach(function (docSnap) {
                    var d = docSnap.data() || {};
                    var name = d.name || "Untitled";
                    var row = document.createElement('div');
                    row.className = 'sidequest-position-option flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer';
                    row.innerHTML =
                        '<span class="sidequest-position-name flex-1 text-xs md:text-sm text-gray-700">' + name + '</span>' +
                        '<input type="checkbox" class="ml-2 accent-blue-600" data-position-id="' + docSnap.id + '">';
                    dropdown.appendChild(row);
                    var checkbox = row.querySelector('input[type="checkbox"]');
                    checkbox.addEventListener('change', updateSideQuestPositionLabel);
                    row.addEventListener('click', function (e) {
                        if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'input') {
                            return;
                        }
                        checkbox.checked = !checkbox.checked;
                        updateSideQuestPositionLabel();
                    });
                });
                if (!dropdown.innerHTML.trim()) {
                    dropdown.innerHTML = '<span class="text-gray-400 text-xs">No positions available.</span>';
                } else {
                    updateSideQuestPositionLabel();
                }
            } catch (e) {
                console.error('Failed to load positions for side quest', e);
                dropdown.innerHTML = '<span class="text-red-500 text-xs">Failed to load positions.</span>';
            }
        }
        async function saveSideQuest() {
            var parentWin = window.parent;
            if (!parentWin || !parentWin.db || !parentWin.collection || !parentWin.addDoc || !parentWin.serverTimestamp) {
                alert('Tidak dapat menyimpan side quest: koneksi database tidak tersedia.');
                return;
            }
            var input = document.getElementById('sideQuestNameInput');
            var title = input ? String(input.value || '').trim() : '';
            if (!title) {
                alert('Silakan isi Side Quest Name terlebih dahulu.');
                return;
            }
            var statusEl = document.getElementById('sideQuestStatusInput');
            var statusValue = statusEl && statusEl.value ? String(statusEl.value) : '';
            var startEl = document.getElementById('sideQuestStartInput');
            var startValue = startEl && startEl.value ? String(startEl.value) : '';
            var startEl = document.getElementById('sideQuestStartInput');
            var startValue = startEl && startEl.value ? String(startEl.value) : '';
            var dueEl = document.getElementById('sideQuestDueInput');
            var dueValue = dueEl && dueEl.value ? String(dueEl.value) : '';
            var pointsEl = document.getElementById('sideQuestPointsInput');
            var pointsValue = pointsEl && pointsEl.value ? Number(pointsEl.value) || 0 : 0;
            var assignSelected = [];
            Array.prototype.slice.call(
                document.querySelectorAll('#sideQuestAssignDropdown input[type="checkbox"]:checked')
            ).forEach(function (cb) {
                var uid = cb.getAttribute('data-user-id') || '';
                if (uid) assignSelected.push(uid);
            });
            var notifySelected = [];
            Array.prototype.slice.call(
                document.querySelectorAll('#sideQuestNotifyDropdown input[type="checkbox"]:checked')
            ).forEach(function (cb) {
                var uid = cb.getAttribute('data-user-id') || '';
                if (uid) notifySelected.push(uid);
            });
            var tagsInput = document.getElementById('sideQuestTagsInput');
            var rawTags = tagsInput && tagsInput.value ? String(tagsInput.value) : '';
            var tags = rawTags
                ? rawTags.split(',').map(function (t) { return t.trim(); }).filter(function (t) { return t; })
                : [];
            var descEl = document.getElementById('sideQuestDesc');
            var description = descEl ? String(descEl.innerHTML || '').trim() : '';
            var deptSelected = [];
            Array.prototype.slice.call(
                document.querySelectorAll('#sideQuestDepartmentDropdown input[type=\"checkbox\"]:checked')
            ).forEach(function (cb) {
                var id = cb.getAttribute('data-dept-id') || '';
                var row = cb.closest('.sidequest-dept-option');
                var nameEl = row ? row.querySelector('.sidequest-dept-name') : null;
                var name = nameEl ? nameEl.textContent.trim() : '';
                if (id) {
                    deptSelected.push({ id: id, name: name });
                }
            });
            var positionSelected = [];
            Array.prototype.slice.call(
                document.querySelectorAll('#sideQuestPositionDropdown input[type=\"checkbox\"]:checked')
            ).forEach(function (cb) {
                var id = cb.getAttribute('data-position-id') || '';
                var row = cb.closest('.sidequest-position-option');
                var nameEl = row ? row.querySelector('.sidequest-position-name') : null;
                var name = nameEl ? nameEl.textContent.trim() : '';
                if (id) {
                    positionSelected.push({ id: id, name: name });
                }
            });
            try {
                var localData = null;
                try {
                    localData = JSON.parse(localStorage.getItem('userData') || 'null');
                } catch (e) {
                    localData = null;
                }
                var createdBy = localData && localData.uid ? localData.uid : '';
                var createdByName = localData && localData.name ? localData.name : '';
                var basePayload = {
                    title: title,
                    description: description,
                    priority: sideQuestCurrentPriority || 'normal',
                    start_date: startValue,
                    due_date: dueValue,
                    points: pointsValue,
                    departments: deptSelected,
                    positions: positionSelected,
                    assign_to: assignSelected,
                    notify_to: notifySelected,
                    tags: tags,
                    reminder_mode: null,
                    reminder_dates: [],
                    recur: null,
                    status: 'SideQuest',
                    task_status: statusValue || 'Initiate',
                    created_by: createdBy,
                    created_by_name: createdByName,
                    type: 'side-quest'
                };
                var payload = basePayload;
                if (parentWin.JSON && parentWin.JSON.parse && parentWin.JSON.stringify) {
                    try {
                        payload = parentWin.JSON.parse(parentWin.JSON.stringify(basePayload));
                    } catch (e) {
                        payload = basePayload;
                    }
                }
                payload.created_at = parentWin.serverTimestamp();
                await parentWin.addDoc(parentWin.collection(parentWin.db, 'tasks'), payload);
                if (typeof loadQuestTasks === 'function') {
                    loadQuestTasks();
                }
                if (typeof loadSideQuestTasks === 'function') {
                    loadSideQuestTasks();
                }
                if (input) {
                    input.value = '';
                }
                var dropdown = document.getElementById('sideQuestCreateDropdown');
                if (dropdown) {
                    dropdown.classList.add('hidden');
                }
                alert('Side Quest berhasil disimpan.');
            } catch (err) {
                console.error('Gagal menyimpan side quest', err);
                alert('Gagal menyimpan side quest: ' + (err && err.message ? err.message : String(err)));
            }
        }
        function questDueParseDate(val) {
            var today = new Date();
            var s = String(val || '').trim();
            if (!s) return today;
            var parts = s.split('/');
            if (parts.length !== 3) return today;
            var d = parseInt(parts[0], 10);
            var m = parseInt(parts[1], 10) - 1;
            var y = parseInt(parts[2], 10);
            if (isNaN(d) || isNaN(m) || isNaN(y)) return today;
            var date = new Date(y, m, d);
            if (isNaN(date.getTime())) return today;
            if (date.getDate() !== d || date.getMonth() !== m || date.getFullYear() !== y) return today;
            return date;
        }
        function questDueFormatDate(date) {
            var d = date.getDate();
            var m = date.getMonth() + 1;
            var y = date.getFullYear();
            var dd = d < 10 ? '0' + d : String(d);
            var mm = m < 10 ? '0' + m : String(m);
            return dd + '/' + mm + '/' + y;
        }
        function questDueEnsureState() {
            var input = document.getElementById('questDueDate');
            var base = questDueParseDate(input ? input.value : '');
            if (!questDueState) {
                questDueState = {
                    month: base.getMonth(),
                    year: base.getFullYear(),
                    selectedDate: base
                };
            }
        }
        function toggleQuestDueDropdown() {
            var panel = document.getElementById('questDueDropdown');
            if (!panel) return;
            if (panel.classList.contains('hidden')) {
                questDueState = null;
                questDueEnsureState();
                panel.classList.remove('hidden');
                renderQuestDueCalendar();
            } else {
                panel.classList.add('hidden');
            }
        }
        function questDueQuickSelect(type) {
            questDueEnsureState();
            if (!questDueState) return;
            var today = new Date();
            var selected = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            if (type === 'tomorrow') {
                selected.setDate(selected.getDate() + 1);
            } else if (type === 'this-weekend') {
                var day = selected.getDay();
                var offset = 6 - day;
                if (offset <= 0) offset += 7;
                selected.setDate(selected.getDate() + offset);
            } else if (type === 'next-week') {
                selected.setDate(selected.getDate() + 7);
            } else if (type === 'next-weekend') {
                var d2 = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate());
                var day2 = d2.getDay();
                var offset2 = 6 - day2;
                if (offset2 <= 0) offset2 += 7;
                d2.setDate(d2.getDate() + offset2 + 7);
                selected = d2;
            } else if (type === 'two-weeks') {
                selected.setDate(selected.getDate() + 14);
            } else if (type === 'four-weeks') {
                selected.setDate(selected.getDate() + 28);
            }
            questDueState.selectedDate = selected;
            questDueState.month = selected.getMonth();
            questDueState.year = selected.getFullYear();
            var input = document.getElementById('questDueDate');
            if (input) {
                input.value = questDueFormatDate(selected);
            }
            renderQuestDueCalendar();
        }
        function questDueGoToday() {
            questDueEnsureState();
            if (!questDueState) return;
            var today = new Date();
            questDueState.month = today.getMonth();
            questDueState.year = today.getFullYear();
            renderQuestDueCalendar();
        }
        function questDueChangeMonth(delta) {
            questDueEnsureState();
            if (!questDueState) return;
            var m = questDueState.month + delta;
            var y = questDueState.year;
            if (m < 0) {
                m = 11;
                y -= 1;
            } else if (m > 11) {
                m = 0;
                y += 1;
            }
            questDueState.month = m;
            questDueState.year = y;
            renderQuestDueCalendar();
        }
        function questDueSelectDate(y, m, d) {
            var date = new Date(y, m, d);
            questDueEnsureState();
            if (!questDueState) return;
            questDueState.selectedDate = date;
            questDueState.month = m;
            questDueState.year = y;
            var input = document.getElementById('questDueDate');
            if (input) {
                input.value = questDueFormatDate(date);
            }
            renderQuestDueCalendar();
            var panel = document.getElementById('questDueDropdown');
            if (panel) {
                panel.classList.add('hidden');
            }
        }
        function renderQuestDueCalendar() {
            var labelEl = document.getElementById('questDueMonthLabel');
            var grid = document.getElementById('questDueCalendarGrid');
            if (!labelEl || !grid) return;
            questDueEnsureState();
            if (!questDueState) return;
            var month = questDueState.month;
            var year = questDueState.year;
            var selected = questDueState.selectedDate;
            var today = new Date();
            var monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            labelEl.textContent = monthNames[month] + ' ' + year;
            grid.innerHTML = '';
            var first = new Date(year, month, 1);
            var startWeekday = first.getDay();
            var daysInMonth = new Date(year, month + 1, 0).getDate();
            for (var i = 0; i < startWeekday; i++) {
                var emptyCell = document.createElement('div');
                grid.appendChild(emptyCell);
            }
            for (var d = 1; d <= daysInMonth; d++) {
                var cellDate = new Date(year, month, d);
                var cell = document.createElement('button');
                cell.type = 'button';
                cell.textContent = String(d);
                var classes = ['w-7', 'h-7', 'flex', 'items-center', 'justify-center', 'rounded-full', 'text-[11px]'];
                var isToday = cellDate.getFullYear() === today.getFullYear() &&
                    cellDate.getMonth() === today.getMonth() &&
                    cellDate.getDate() === today.getDate();
                var isSelected = selected &&
                    cellDate.getFullYear() === selected.getFullYear() &&
                    cellDate.getMonth() === selected.getMonth() &&
                    cellDate.getDate() === selected.getDate();
                if (isSelected) {
                    classes.push('bg-red-500', 'text-white');
                } else if (isToday) {
                    classes.push('border', 'border-red-300', 'text-red-500');
                } else {
                    classes.push('text-gray-500', 'hover:bg-gray-100');
                }
                cell.className = classes.join(' ');
                (function (yy, mm, dd) {
                    cell.addEventListener('click', function () {
                        questDueSelectDate(yy, mm, dd);
                    });
                })(year, month, d);
                grid.appendChild(cell);
            }
        }
        function questReminderEnsureDue() {
            var input = document.getElementById('questDueDate');
            if (!input || !input.value || !String(input.value).trim()) {
                var modal = document.getElementById('questReminderAlert');
                if (modal) {
                    modal.classList.remove('hidden');
                } else {
                    alert('Please set Dates before choosing a reminder.');
                }
                return false;
            }
            return true;
        }
        function toggleQuestReminderDropdown() {
            if (!questReminderEnsureDue()) return;
            var panel = document.getElementById('questReminderDropdown');
            if (!panel) return;
            if (panel.classList.contains('hidden')) {
                questReminderState = null;
                questReminderEnsureState();
                panel.classList.remove('hidden');
                renderQuestReminderCalendar();
            } else {
                panel.classList.add('hidden');
            }
        }
        function questReminderEnsureState() {
            var input = document.getElementById('questDueDate');
            var base = questDueParseDate(input ? input.value : '');
            if (!questReminderState) {
                questReminderState = {
                    baseDate: base,
                    month: base.getMonth(),
                    year: base.getFullYear(),
                    mode: null
                };
            }
        }
        function questReminderQuickSelect(mode) {
            if (!questReminderEnsureDue()) return;
            questReminderEnsureState();
            if (!questReminderState) return;
            questReminderState.mode = mode;
            questReminderState.month = questReminderState.baseDate.getMonth();
            questReminderState.year = questReminderState.baseDate.getFullYear();
            var label = document.getElementById('questReminderButtonLabel');
            if (label) {
                if (mode === 'day-before') label.textContent = 'A Day Before';
                else if (mode === 'two-days-before') label.textContent = 'Two Days Before';
                else if (mode === 'three-days-before') label.textContent = 'Three Days Before';
                else if (mode === 'weekend-before') label.textContent = 'At Weekend Before';
                else if (mode === 'everyday-before') label.textContent = 'Everyday Before';
                else if (mode === 'early-month') label.textContent = 'Early Day in Every Month';
                else if (mode === 'final-month') label.textContent = 'Final Day in Every Month';
                else label.textContent = 'No reminder';
            }
            renderQuestReminderCalendar();
        }
        function questReminderChangeMonth(delta) {
            questReminderEnsureState();
            if (!questReminderState) return;
            var m = questReminderState.month + delta;
            var y = questReminderState.year;
            if (m < 0) {
                m = 11;
                y -= 1;
            } else if (m > 11) {
                m = 0;
                y += 1;
            }
            questReminderState.month = m;
            questReminderState.year = y;
            renderQuestReminderCalendar();
        }
        function questReminderComputeDates() {
            if (!questReminderState || !questReminderState.baseDate || !questReminderState.mode) return [];
            var base = new Date(questReminderState.baseDate.getFullYear(), questReminderState.baseDate.getMonth(), questReminderState.baseDate.getDate());
            var mode = questReminderState.mode;
            var dates = [];
            if (mode === 'day-before') {
                var d1 = new Date(base.getTime());
                d1.setDate(d1.getDate() - 1);
                dates.push(d1);
            } else if (mode === 'two-days-before') {
                var d2 = new Date(base.getTime());
                d2.setDate(d2.getDate() - 2);
                dates.push(d2);
            } else if (mode === 'three-days-before') {
                var d3 = new Date(base.getTime());
                d3.setDate(d3.getDate() - 3);
                dates.push(d3);
            } else if (mode === 'weekend-before') {
                var w = new Date(base.getTime());
                var day = w.getDay();
                var offset = day >= 6 ? 7 : day + 1;
                w.setDate(w.getDate() - offset);
                dates.push(w);
            } else if (mode === 'everyday-before') {
                for (var i = 1; i <= 7; i++) {
                    var d = new Date(base.getTime());
                    d.setDate(d.getDate() - i);
                    dates.push(d);
                }
            } else if (mode === 'early-month') {
                var em = new Date(base.getFullYear(), base.getMonth(), 1);
                dates.push(em);
            } else if (mode === 'final-month') {
                var fm = new Date(base.getFullYear(), base.getMonth() + 1, 0);
                dates.push(fm);
            }
            return dates;
        }
        function renderQuestReminderCalendar() {
            var labelEl = document.getElementById('questReminderMonthLabel');
            var grid = document.getElementById('questReminderCalendarGrid');
            var summaryEl = document.getElementById('questReminderSummary');
            if (!labelEl || !grid) return;
            questReminderEnsureState();
            if (!questReminderState) return;
            var month = questReminderState.month;
            var year = questReminderState.year;
            var base = questReminderState.baseDate;
            var highlightDates = questReminderComputeDates();
            var today = new Date();
            var monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            labelEl.textContent = monthNames[month] + ' ' + year;
            if (summaryEl && base) {
                summaryEl.textContent = 'Due: ' + questDueFormatDate(base);
            }
            grid.innerHTML = '';
            var first = new Date(year, month, 1);
            var startWeekday = first.getDay();
            var daysInMonth = new Date(year, month + 1, 0).getDate();
            for (var i = 0; i < startWeekday; i++) {
                var emptyCell = document.createElement('div');
                grid.appendChild(emptyCell);
            }
            function dateKey(d) {
                return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
            }
            var highlightMap = {};
            highlightDates.forEach(function (d) {
                highlightMap[dateKey(d)] = true;
            });
            var baseKey = base ? dateKey(base) : null;
            for (var d = 1; d <= daysInMonth; d++) {
                var cellDate = new Date(year, month, d);
                var cell = document.createElement('div');
                cell.textContent = String(d);
                var classes = ['w-7', 'h-7', 'flex', 'items-center', 'justify-center', 'rounded-full', 'text-[11px]'];
                var isToday = cellDate.getFullYear() === today.getFullYear() &&
                    cellDate.getMonth() === today.getMonth() &&
                    cellDate.getDate() === today.getDate();
                var key = dateKey(cellDate);
                var isHighlight = highlightMap[key];
                var isDue = baseKey && key === baseKey;
                if (isDue) {
                    classes.push('bg-red-500', 'text-white');
                } else if (isHighlight) {
                    classes.push('bg-blue-100', 'text-blue-700');
                } else if (isToday) {
                    classes.push('border', 'border-red-300', 'text-red-500');
                } else {
                    classes.push('text-gray-500');
                }
                cell.className = classes.join(' ');
                grid.appendChild(cell);
            }
        }
        var questRecurState = null;
        var questRecurPrevState = null;
        var questDueState = null;
        var questReminderState = null;
        function toggleQuestRecurDropdown() {
            var panel = document.getElementById('questRecurDropdown');
            if (!panel) return;
            if (panel.classList.contains('hidden')) {
                openQuestRecur();
            } else {
                panel.classList.add('hidden');
            }
        }
        function getQuestRecurBaseDate() {
            var input = document.getElementById('questDueDate');
            var today = new Date();
            if (!input) return today;
            var val = String(input.value || '').trim();
            if (!val) return today;
            var parts = val.split('/');
            if (parts.length !== 3) return today;
            var d = parseInt(parts[0], 10);
            var m = parseInt(parts[1], 10) - 1;
            var y = parseInt(parts[2], 10);
            if (isNaN(d) || isNaN(m) || isNaN(y)) return today;
            var date = new Date(y, m, d);
            if (isNaN(date.getTime())) return today;
            if (date.getDate() !== d || date.getMonth() !== m || date.getFullYear() !== y) return today;
            return date;
        }
        function questRecurSyncControls() {
            if (!questRecurState) return;
            var intervalInput = document.getElementById('questRecurIntervalInput');
            var unitSelect = document.getElementById('questRecurUnitSelect');
            var patternSelect = document.getElementById('questRecurPattern');
            var monthlyWrapper = document.getElementById('questRecurMonthlyModeWrapper');
            var monthlySelect = document.getElementById('questRecurMonthlyMode');
            if (intervalInput) {
                intervalInput.value = String(questRecurState.interval || 1);
            }
            if (unitSelect) {
                unitSelect.value = questRecurState.unit || 'week';
            }
            if (patternSelect) {
                var patternValue = 'weekly';
                if (questRecurState.unit === 'day') patternValue = 'daily';
                else if (questRecurState.unit === 'week') patternValue = 'weekly';
                else if (questRecurState.unit === 'month') patternValue = 'monthly';
                else if (questRecurState.unit === 'year') patternValue = 'yearly';
                patternSelect.value = patternValue;
            }
            if (monthlyWrapper) {
                if (questRecurState.unit === 'month') {
                    monthlyWrapper.classList.remove('hidden');
                    if (monthlySelect) {
                        if (!questRecurState.monthlyMode) {
                            questRecurState.monthlyMode = monthlySelect.value || 'same-day';
                        } else {
                            monthlySelect.value = questRecurState.monthlyMode;
                        }
                    }
                } else {
                    monthlyWrapper.classList.add('hidden');
                }
            }
        }
        function openQuestRecur() {
            var panel = document.getElementById('questRecurDropdown');
            if (!panel) return;
            var base = getQuestRecurBaseDate();
            var intervalInput = document.getElementById('questRecurIntervalInput');
            var unitSelect = document.getElementById('questRecurUnitSelect');
            var interval = 1;
            if (intervalInput) {
                var iv = parseInt(intervalInput.value, 10);
                if (!isNaN(iv) && iv > 0) {
                    interval = iv;
                }
            }
            var unit = 'week';
            if (unitSelect && unitSelect.value) {
                unit = unitSelect.value;
            }
            questRecurState = {
                baseDate: base,
                month: base.getMonth(),
                year: base.getFullYear(),
                interval: interval,
                unit: unit,
                weekdays: [base.getDay()],
                monthlyMode: 'same-day'
            };
            questRecurPrevState = {
                baseDate: new Date(questRecurState.baseDate.getTime()),
                month: questRecurState.month,
                year: questRecurState.year,
                interval: questRecurState.interval,
                unit: questRecurState.unit,
                weekdays: questRecurState.weekdays.slice(),
                monthlyMode: questRecurState.monthlyMode
            };
            panel.classList.remove('hidden');
            questRecurSyncControls();
            renderQuestRecurWeekdays();
            renderQuestRecurCalendar();
        }
        function questRecurApplyPattern() {
            var select = document.getElementById('questRecurPattern');
            if (!select) return;
            if (!questRecurState) {
                openQuestRecur();
            }
            if (!questRecurState) return;
            var val = select.value || 'weekly';
            if (val === 'daily') {
                questRecurState.unit = 'day';
            } else if (val === 'weekly') {
                questRecurState.unit = 'week';
            } else if (val === 'monthly') {
                questRecurState.unit = 'month';
                if (!questRecurState.monthlyMode) {
                    questRecurState.monthlyMode = 'same-day';
                }
            } else if (val === 'yearly') {
                questRecurState.unit = 'year';
            }
            questRecurSyncControls();
            renderQuestRecurWeekdays();
            renderQuestRecurCalendar();
        }
        function questRecurCancel() {
            var panel = document.getElementById('questRecurDropdown');
            if (!panel) return;
            if (questRecurPrevState) {
                questRecurState = {
                    baseDate: new Date(questRecurPrevState.baseDate.getTime()),
                    month: questRecurPrevState.month,
                    year: questRecurPrevState.year,
                    interval: questRecurPrevState.interval,
                    unit: questRecurPrevState.unit,
                    weekdays: questRecurPrevState.weekdays.slice(),
                    monthlyMode: questRecurPrevState.monthlyMode
                };
                questRecurSyncControls();
                renderQuestRecurWeekdays();
                renderQuestRecurCalendar();
            }
            panel.classList.add('hidden');
        }
        function questRecurSave() {
            var panel = document.getElementById('questRecurDropdown');
            if (!panel) return;
            panel.classList.add('hidden');
        }
        function questRecurUpdateInterval() {
            var input = document.getElementById('questRecurIntervalInput');
            if (!input) return;
            var v = parseInt(input.value, 10);
            if (!questRecurState) {
                openQuestRecur();
            }
            if (!questRecurState) return;
            if (isNaN(v) || v <= 0) {
                questRecurState.interval = 1;
                input.value = '1';
            } else {
                questRecurState.interval = v;
            }
            renderQuestRecurCalendar();
        }
        function questRecurUpdateUnit() {
            var select = document.getElementById('questRecurUnitSelect');
            if (!select) return;
            if (!questRecurState) {
                openQuestRecur();
            }
            if (!questRecurState) return;
            questRecurState.unit = select.value || 'week';
            questRecurSyncControls();
            renderQuestRecurCalendar();
        }
        function questRecurUpdateMonthlyMode() {
            var select = document.getElementById('questRecurMonthlyMode');
            if (!select) return;
            if (!questRecurState) {
                openQuestRecur();
            }
            if (!questRecurState) return;
            questRecurState.monthlyMode = select.value || 'same-day';
            renderQuestRecurCalendar();
        }
        function questRecurToggleWeekday(day) {
            if (!questRecurState) {
                openQuestRecur();
            }
            if (!questRecurState) return;
            var idx = questRecurState.weekdays.indexOf(day);
            if (idx === -1) {
                questRecurState.weekdays.push(day);
            } else if (questRecurState.weekdays.length > 1) {
                questRecurState.weekdays.splice(idx, 1);
            }
            renderQuestRecurWeekdays();
            renderQuestRecurCalendar();
        }
        function renderQuestRecurWeekdays() {
            var buttons = document.querySelectorAll('#questRecurDropdown .quest-recur-day');
            if (!buttons || !buttons.length) return;
            buttons.forEach(function (btn) {
                var dayAttr = btn.getAttribute('data-day');
                var day = parseInt(dayAttr, 10);
                var active = questRecurState && questRecurState.weekdays.indexOf(day) !== -1;
                btn.classList.remove('bg-blue-600', 'text-white', 'bg-gray-100', 'text-gray-700');
                if (active) {
                    btn.classList.add('bg-blue-600', 'text-white');
                } else {
                    btn.classList.add('bg-gray-100', 'text-gray-700');
                }
            });
        }
        function questRecurGoToday() {
            if (!questRecurState) {
                openQuestRecur();
            }
            if (!questRecurState) return;
            var today = new Date();
            questRecurState.month = today.getMonth();
            questRecurState.year = today.getFullYear();
            renderQuestRecurCalendar();
        }
        function questRecurChangeMonth(delta) {
            if (!questRecurState) {
                openQuestRecur();
            }
            if (!questRecurState) return;
            var m = questRecurState.month + delta;
            var y = questRecurState.year;
            if (m < 0) {
                m = 11;
                y -= 1;
            } else if (m > 11) {
                m = 0;
                y += 1;
            }
            questRecurState.month = m;
            questRecurState.year = y;
            renderQuestRecurCalendar();
        }
        function questRecurIsOccurrence(date) {
            if (!questRecurState || !questRecurState.baseDate) return false;
            var base = new Date(questRecurState.baseDate.getFullYear(), questRecurState.baseDate.getMonth(), questRecurState.baseDate.getDate());
            var current = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            var diffMs = current.getTime() - base.getTime();
            if (diffMs < 0) return false;
            var oneDay = 24 * 60 * 60 * 1000;
            var diffDays = Math.floor(diffMs / oneDay);
            if (questRecurState.unit === 'day') {
                if (diffDays === 0) return true;
                return diffDays % questRecurState.interval === 0;
            }
            if (questRecurState.unit === 'week') {
                var weekday = current.getDay();
                if (questRecurState.weekdays.indexOf(weekday) === -1) return false;
                var diffWeeks = Math.floor(diffDays / 7);
                return diffWeeks % questRecurState.interval === 0;
            }
            if (questRecurState.unit === 'month') {
                var monthsDiff = (current.getFullYear() - base.getFullYear()) * 12 + (current.getMonth() - base.getMonth());
                if (monthsDiff < 0) return false;
                if (monthsDiff % questRecurState.interval !== 0) return false;
                var mode = questRecurState.monthlyMode || 'same-day';
                if (mode === 'first-day') {
                    return current.getDate() === 1;
                }
                if (mode === 'last-day') {
                    var lastDay = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
                    return current.getDate() === lastDay;
                }
                return current.getDate() === base.getDate();
            }
            if (questRecurState.unit === 'year') {
                var yearDiff = current.getFullYear() - base.getFullYear();
                if (yearDiff < 0) return false;
                if (yearDiff % questRecurState.interval !== 0) return false;
                return current.getMonth() === base.getMonth() && current.getDate() === base.getDate();
            }
            return false;
        }
        function renderQuestRecurCalendar() {
            var labelEl = document.getElementById('questRecurMonthLabel');
            var grid = document.getElementById('questRecurCalendarGrid');
            if (!labelEl || !grid) return;
            if (!questRecurState) {
                openQuestRecur();
            }
            if (!questRecurState) return;
            var month = questRecurState.month;
            var year = questRecurState.year;
            var base = questRecurState.baseDate || new Date();
            var today = new Date();
            var monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            labelEl.textContent = monthNames[month] + ' ' + year;
            grid.innerHTML = '';
            var first = new Date(year, month, 1);
            var startWeekday = first.getDay();
            var daysInMonth = new Date(year, month + 1, 0).getDate();
            for (var i = 0; i < startWeekday; i++) {
                var emptyCell = document.createElement('div');
                grid.appendChild(emptyCell);
            }
            for (var d = 1; d <= daysInMonth; d++) {
                var cellDate = new Date(year, month, d);
                var cell = document.createElement('button');
                cell.type = 'button';
                cell.textContent = String(d);
                var classes = ['w-7', 'h-7', 'flex', 'items-center', 'justify-center', 'rounded-full', 'text-[11px]'];
                var isToday = cellDate.getFullYear() === today.getFullYear() &&
                    cellDate.getMonth() === today.getMonth() &&
                    cellDate.getDate() === today.getDate();
                var isBase = cellDate.getFullYear() === base.getFullYear() &&
                    cellDate.getMonth() === base.getMonth() &&
                    cellDate.getDate() === base.getDate();
                var isOccur = questRecurIsOccurrence(cellDate);
                if (isBase) {
                    classes.push('bg-red-500', 'text-white');
                } else if (isOccur) {
                    classes.push('bg-blue-100', 'text-blue-700');
                } else if (isToday) {
                    classes.push('border', 'border-red-300', 'text-red-500');
                } else {
                    classes.push('text-gray-500');
                }
                cell.className = classes.join(' ');
                grid.appendChild(cell);
            }
        }
        function updateQuestDepartmentLabel() {
            var dropdown = document.getElementById('questDepartmentDropdown');
            var labelEl = document.getElementById('questDepartmentButtonLabel');
            if (!dropdown || !labelEl) return;
            var selected = Array.prototype.slice.call(
                dropdown.querySelectorAll('input[type="checkbox"]:checked')
            );
            if (!selected.length) {
                labelEl.textContent = 'Select departments...';
                return;
            }
            var names = selected.map(function (cb) {
                var row = cb.closest('.quest-dept-option');
                if (!row) return '';
                var nameEl = row.querySelector('.quest-dept-name');
                return nameEl ? nameEl.textContent.trim() : '';
            }).filter(function (v) { return v; });
            if (!names.length) {
                labelEl.textContent = 'Select departments...';
            } else if (names.length === 1) {
                labelEl.textContent = names[0];
            } else if (names.length === 2) {
                labelEl.textContent = names[0] + ', ' + names[1];
            } else {
                labelEl.textContent = names[0] + ' and ' + (names.length - 1) + ' more';
            }
        }
        function updateQuestPositionLabel() {
            var dropdown = document.getElementById('questPositionDropdown');
            var labelEl = document.getElementById('questPositionButtonLabel');
            if (!dropdown || !labelEl) return;
            var selected = Array.prototype.slice.call(
                dropdown.querySelectorAll('input[type="checkbox"]:checked')
            );
            if (!selected.length) {
                labelEl.textContent = 'Select positions...';
                return;
            }
            var names = selected.map(function (cb) {
                var row = cb.closest('.quest-position-option');
                if (!row) return '';
                var nameEl = row.querySelector('.quest-position-name');
                return nameEl ? nameEl.textContent.trim() : '';
            }).filter(function (v) { return v; });
            if (!names.length) {
                labelEl.textContent = 'Select positions...';
            } else if (names.length === 1) {
                labelEl.textContent = names[0];
            } else if (names.length === 2) {
                labelEl.textContent = names[0] + ', ' + names[1];
            } else {
                labelEl.textContent = names[0] + ' and ' + (names.length - 1) + ' more';
            }
        }
        function updateQuestUserLabel(dropdownId, labelId, placeholderText, avatarsId) {
            var dropdown = document.getElementById(dropdownId);
            var labelEl = document.getElementById(labelId);
            var avatarsEl = avatarsId ? document.getElementById(avatarsId) : null;
            if (!dropdown) return;
            var selected = Array.prototype.slice.call(
                dropdown.querySelectorAll('input[type="checkbox"]:checked')
            );
            if (!selected.length) {
                if (labelEl) {
                    labelEl.textContent = placeholderText;
                }
                if (avatarsEl) {
                    avatarsEl.innerHTML = '';
                }
                return;
            }
            var names = selected.map(function (cb) {
                var row = cb.closest('.quest-user-option');
                if (!row) return '';
                var nameEl = row.querySelector('.quest-user-name');
                return nameEl ? nameEl.textContent.trim() : '';
            }).filter(function (v) { return v; });
            if (avatarsEl) {
                avatarsEl.innerHTML = '';
                var maxAvatars = 4;
                selected.forEach(function (cb, index) {
                    if (index >= maxAvatars) return;
                    var row = cb.closest('.quest-user-option');
                    var imgEl = row ? row.querySelector('img') : null;
                    var name = names[index] || '';
                    var uid = cb.getAttribute('data-user-id') || '';
                    var initials = getQuestUserInitials({ name: name, uid: uid });
                    var avatarNode;
                    if (imgEl && imgEl.getAttribute('src')) {
                        avatarNode = document.createElement('img');
                        avatarNode.src = imgEl.getAttribute('src');
                        avatarNode.alt = name || '';
                        avatarNode.className = 'w-6 h-6 rounded-full object-cover border border-gray-200';
                    } else {
                        avatarNode = document.createElement('span');
                        avatarNode.className = 'w-6 h-6 rounded-full bg-slate-700 text-slate-100 text-[10px] font-semibold flex items-center justify-center';
                        avatarNode.textContent = initials;
                    }
                    avatarsEl.appendChild(avatarNode);
                });
                if (selected.length > maxAvatars) {
                    var more = document.createElement('span');
                    more.className = 'w-6 h-6 rounded-full bg-slate-800 text-slate-100 text-[10px] font-semibold flex items-center justify-center';
                    more.textContent = '+' + (selected.length - maxAvatars);
                    avatarsEl.appendChild(more);
                }
            }
            if (labelEl) {
                labelEl.textContent = '';
            }
        }
        function getQuestUserInitials(user) {
            var source = user.name || user.email || user.uid || '';
            if (!source) return 'U';
            var parts = source.trim().split(/\s+/);
            var initials = parts.map(function (p) { return p[0]; }).join('');
            return initials.substring(0, 2).toUpperCase();
        }
        function filterQuestUsers(users, query) {
            var q = String(query || '').trim().toLowerCase();
            if (!q) return users.slice();
            return users.filter(function (u) {
                var name = String(u.name || '').toLowerCase();
                var email = String(u.email || '').toLowerCase();
                return name.indexOf(q) !== -1 || email.indexOf(q) !== -1;
            });
        }
        function questApplyFormat(editorId, command) {
            var editor = document.getElementById(editorId);
            if (!editor) return;
            editor.focus();
            document.execCommand(command, false, null);

            // Update button states
            var toolbar = editor.previousElementSibling;
            if (toolbar && toolbar.classList.contains('rich-toolbar')) {
                var btns = toolbar.querySelectorAll('.rich-btn');
                btns.forEach(function (btn) {
                    var cmd = btn.getAttribute('onclick');
                    if (cmd && cmd.indexOf('questApplyFormat') !== -1) {
                        var part = cmd.split("'")[3];
                        if (part && document.queryCommandState(part)) {
                            btn.classList.add('active');
                        } else {
                            btn.classList.remove('active');
                        }
                    }
                });
            }
        }
        function addLinkToEditor(editorId) {
            var url = prompt("Enter URL:", "https://");
            if (url) {
                var editor = document.getElementById(editorId);
                if (!editor) return;
                editor.focus();
                document.execCommand("createLink", false, url);
            }
        }
        function questTriggerDescFileInput() {
            var input = document.getElementById('quest-desc-file-input');
            if (input) input.click();
        }
        async function questUploadDescriptionFiles(editorId, files) {
            if (!files || files.length === 0) return;
            var parentWin = window.parent;
            if (!parentWin || !parentWin.storage || !parentWin.ref || !parentWin.uploadBytes || !parentWin.getDownloadURL) {
                return;
            }
            var editor = document.getElementById(editorId);
            if (!editor) return;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                try {
                    var path = 'quest_descriptions/' + Date.now() + '_' + file.name;
                    var sRef = parentWin.ref(parentWin.storage, path);
                    await parentWin.uploadBytes(sRef, file);
                    var url = await parentWin.getDownloadURL(sRef);
                    var isImage = file.type && file.type.indexOf('image/') === 0;
                    var html = isImage
                        ? '<div><img src=\"' + url + '\" alt=\"' + file.name + '\" style=\"max-width:100%; border-radius:8px;\"></div>'
                        : '<div><a href=\"' + url + '\" target=\"_blank\" rel=\"noopener\">' + file.name + '</a></div>';
                    editor.focus();
                    document.execCommand('insertHTML', false, html);
                } catch (e) {
                    console.error('Failed to upload quest description file', e);
                }
            }
        }
        async function questHandleDescFiles(inputEl) {
            if (!inputEl) return;
            var files = inputEl.files;
            await questUploadDescriptionFiles('questDescEditor', files);
            inputEl.value = '';
        }
        function getQuestTags() {
            var hidden = document.getElementById('quest-tags');
            if (!hidden || !hidden.value) return [];
            return hidden.value.split(',').map(function (t) { return t.trim(); }).filter(function (t) { return t; });
        }
        function setQuestTags(tags) {
            var hidden = document.getElementById('quest-tags');
            if (!hidden) return;
            var clean = Array.from(new Set(tags.map(function (t) { return String(t || '').trim(); }).filter(function (t) { return t; })));
            hidden.value = clean.join(',');
            updateQuestSelectedTagUI();
            var optionsContainer = document.getElementById('quest-tag-options');
            if (!optionsContainer) return;
            Array.prototype.slice.call(optionsContainer.children).forEach(function (opt) {
                var tag = opt.getAttribute('data-tag') || '';
                if (!tag) return;
                if (clean.indexOf(tag) !== -1) {
                    opt.classList.add('tag-option-selected');
                } else {
                    opt.classList.remove('tag-option-selected');
                }
            });
        }
        function updateQuestSelectedTagUI() {
            var selectedContainer = document.getElementById('quest-tag-selected');
            if (!selectedContainer) return;
            var tags = getQuestTags();
            selectedContainer.innerHTML = '';
            if (!tags.length) {
                var span = document.createElement('span');
                span.className = 'tag-placeholder';
                span.textContent = 'Search or add tags...';
                selectedContainer.appendChild(span);
                return;
            }
            tags.forEach(function (tag) {
                var pill = document.createElement('span');
                pill.className = 'tag-pill';
                pill.textContent = tag;
                var remove = document.createElement('span');
                remove.className = 'tag-remove';
                remove.textContent = '×';
                remove.onclick = function (event) {
                    event.stopPropagation();
                    removeQuestTagFromSelection(tag);
                };
                pill.appendChild(remove);
                selectedContainer.appendChild(pill);
            });
        }
        function toggleQuestTagDropdown() {
            var dropdown = document.getElementById('quest-tag-dropdown');
            if (!dropdown) return;
            var isOpen = dropdown.style.display === 'block';
            dropdown.style.display = isOpen ? 'none' : 'block';
            if (!isOpen) {
                var input = document.getElementById('quest-tag-input');
                if (input) {
                    input.focus();
                    input.select();
                }
                filterQuestTagOptions();
            }
        }
        function filterQuestTagOptions() {
            var input = document.getElementById('quest-tag-input');
            var optionsContainer = document.getElementById('quest-tag-options');
            var createRow = document.getElementById('quest-tag-create');
            var createLabel = document.getElementById('quest-tag-create-label');
            if (!input || !optionsContainer || !createRow || !createLabel) return;
            var query = input.value.trim().toLowerCase();
            var hasVisible = false;
            var hasExact = false;
            Array.prototype.slice.call(optionsContainer.children).forEach(function (opt) {
                var tag = String(opt.getAttribute('data-tag') || '').toLowerCase();
                var visible = !query || tag.indexOf(query) !== -1;
                opt.style.display = visible ? 'flex' : 'none';
                if (visible) {
                    hasVisible = true;
                }
                if (tag === query && query) {
                    hasExact = true;
                }
            });
            if (query && !hasExact) {
                createRow.style.display = 'flex';
                createLabel.textContent = input.value.trim();
            } else {
                createRow.style.display = 'none';
                createLabel.textContent = '';
            }
            if (!query && !hasVisible) {
                createRow.style.display = 'none';
                createLabel.textContent = '';
            }
        }
        function toggleQuestTagFromOption(tag) {
            var current = getQuestTags();
            var index = current.indexOf(tag);
            if (index >= 0) {
                current.splice(index, 1);
            } else {
                current.push(tag);
            }
            setQuestTags(current);
        }
        function createQuestTagFromInput() {
            var input = document.getElementById('quest-tag-input');
            if (!input) return;
            var value = input.value.trim();
            if (!value) return;
            var current = getQuestTags();
            if (current.indexOf(value) === -1) {
                current.push(value);
            }
            var optionsContainer = document.getElementById('quest-tag-options');
            if (optionsContainer) {
                var exists = Array.prototype.slice.call(optionsContainer.children).some(function (opt) {
                    return String(opt.getAttribute('data-tag') || '') === value;
                });
                if (!exists) {
                    var opt = document.createElement('div');
                    opt.className = 'tag-option';
                    opt.setAttribute('data-tag', value);
                    opt.onclick = function () {
                        toggleQuestTagFromOption(value);
                    };
                    var pill = document.createElement('span');
                    pill.className = 'tag-pill';
                    pill.textContent = value;
                    opt.appendChild(pill);
                    optionsContainer.insertBefore(opt, optionsContainer.firstChild || null);
                }
            }
            setQuestTags(current);
            input.value = '';
            filterQuestTagOptions();
        }
        function removeQuestTagFromSelection(tag) {
            var current = getQuestTags();
            var index = current.indexOf(tag);
            if (index >= 0) {
                current.splice(index, 1);
                setQuestTags(current);
            }
        }
        function parseQuestDueDateString(s) {
            if (!s) return null;
            var parts = String(s).split('/');
            if (parts.length !== 3) return null;
            var d = parseInt(parts[0], 10);
            var m = parseInt(parts[1], 10) - 1;
            var y = parseInt(parts[2], 10);
            if (isNaN(d) || isNaN(m) || isNaN(y)) return null;
            var date = new Date(y, m, d);
            if (isNaN(date.getTime())) return null;
            if (date.getDate() !== d || date.getMonth() !== m || date.getFullYear() !== y) return null;
            return date;
        }
        function questDateToNumber(date) {
            return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
        }
        function buildQuestTaskCard(task, category, taskId) {
            var title = task && task.title ? String(task.title) : 'Untitled Quest';
            var dueText = task && (task.due_date || task.dueDate) ? String(task.due_date || task.dueDate) : '';
            var priority = task && task.priority ? String(task.priority).toLowerCase() : '';
            var categoryType = String(category || '').toLowerCase();
            var id = taskId || (task && task.id ? String(task.id) : '');
            var descHtml = task && task.description ? String(task.description) : '';
            var tmp = document.createElement('div');
            tmp.innerHTML = descHtml;
            var descText = (tmp.textContent || tmp.innerText || '').trim();
            if (!descText) {
                descText = 'No description provided.';
            }
            var tags = Array.isArray(task && task.tags) ? task.tags : [];
            var assignList = [];
            if (task && task.assign_to) {
                if (Array.isArray(task.assign_to)) {
                    assignList = task.assign_to.slice();
                } else {
                    assignList = [task.assign_to];
                }
            }
            var departments = Array.isArray(task && task.departments) ? task.departments : [];
            var positions = Array.isArray(task && task.positions) ? task.positions : [];
            var points = typeof (task && task.points) === 'number' ? task.points : 0;
            function esc(str) {
                return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            }
            function renderCollectionNames(arr) {
                if (!Array.isArray(arr) || arr.length === 0) return '';
                var names = arr.map(function (x) {
                    if (!x) return '';
                    if (typeof x === 'string') return x;
                    if (x.name) return String(x.name);
                    return '';
                }).filter(function (v) { return v; });
                return names.join(', ');
            }
            var borderClass = 'border-blue-500';
            var badgeClass = 'bg-blue-600';
            if (priority === 'urgent') {
                borderClass = 'border-orange-500';
            } else if (priority === 'high') {
                borderClass = 'border-red-500';
            } else if (priority === 'low') {
                borderClass = 'border-gray-400';
            }
            if (categoryType === 'overdue') {
                badgeClass = 'bg-red-600';
            } else if (categoryType === 'upcoming') {
                badgeClass = 'bg-green-600';
            } else if (categoryType === 'today' || categoryType === 'todays') {
                badgeClass = 'bg-blue-600';
            }
            var wrapper = document.createElement('div');
            wrapper.className = 'flex items-start gap-4 quest-card';
            if (id) {
                wrapper.setAttribute('data-task-id', id);
            }
            var html = '';
            html += '<button type="button" class="w-6 h-6 border-2 ' + borderClass + ' rounded-full mt-1.5 flex-shrink-0 flex items-center justify-center bg-white quest-card-check-btn">';
            html += '<i data-lucide="check" class="w-3 h-3 text-gray-400" style=""></i>';
            html += '</button>';
            html += '<div class="flex-1">';
            html += '<div class="flex flex-wrap items-center gap-2 mb-1">';
            html += '<h3 class="text-xl font-bold leading-tight">' + esc(title) + '</h3>';
            if (dueText) {
                html += '<span class="inline-flex items-center gap-1 ' + badgeClass + ' text-white text-xs font-bold px-2 py-1 rounded">';
                html += esc(dueText);
                if (task && task.recur) {
                    html += '&nbsp;&nbsp; <i data-lucide="repeat" class="w-4 h-4 text-white"></i>';
                }
                html += '</span>';
            }
            html += '</div>';
            html += '<div class="flex flex-wrap items-center gap-2 mb-2 quest-card-actions hidden">';
            html += '<button type="button" class="px-3 py-1 text-xs font-semibold rounded-full border border-red-500 text-red-600 quest-card-delete-btn">Delete</button>';
            html += '</div>';
            html += '<p class="text-gray-600 italic description-truncate text-sm mb-3">' + esc(descText) + '</p>';
            html += '<div class="flex flex-col gap-2 mt-2">';
            if (assignList.length > 0) {
                html += '<div class="flex items-center gap-2">';
                var maxAvatars = 4;
                assignList.forEach(function (uid, index) {
                    if (index >= maxAvatars) return;
                    var user = questUsersById && questUsersById[uid] ? questUsersById[uid] : { uid: uid, name: uid };
                    var initials = getQuestUserInitials(user);
                    var titleText = user && user.name ? user.name : initials;
                    if (user.photo) {
                        html += '<img src="' + esc(user.photo) + '" alt="' + esc(titleText) + '" title="' + esc(titleText) + '" data-bs-toggle="tooltip" data-bs-title="' + esc(titleText) + '" class="w-7 h-7 rounded-full object-cover border border-slate-700">';
                    } else {
                        html += '<span class="w-7 h-7 rounded-full bg-slate-700 text-slate-100 text-[10px] font-semibold flex items-center justify-center" title="' + esc(titleText) + '" data-bs-toggle="tooltip" data-bs-title="' + esc(titleText) + '">';
                        html += esc(initials);
                        html += '</span>';
                    }
                });
                if (assignList.length > maxAvatars) {
                    html += '<span class="w-7 h-7 rounded-full bg-slate-800 text-slate-100 text-[10px] font-semibold flex items-center justify-center">';
                    html += esc('+' + (assignList.length - maxAvatars));
                    html += '</span>';
                }
                html += '</div>';
            }
            var deptNames = renderCollectionNames(departments);
            var posNames = renderCollectionNames(positions);
            if (deptNames || posNames) {
                html += '<div class="flex flex-wrap items-center gap-2 text-[11px] text-gray-500">';
                if (departments && departments.length) {
                    departments.forEach(function (d) {
                        var name = '';
                        if (typeof d === 'string') {
                            name = d;
                        } else if (d && d.name) {
                            name = String(d.name);
                        }
                        if (!name) return;
                        var hash = 0;
                        for (var i = 0; i < name.length; i++) {
                            hash = ((hash << 5) - hash) + name.charCodeAt(i);
                            hash |= 0;
                        }
                        var colorIndex = Math.abs(hash) % 5;
                        var cls = '';
                        if (colorIndex === 0) cls = 'bg-blue-50 text-blue-700 border-blue-100';
                        else if (colorIndex === 1) cls = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                        else if (colorIndex === 2) cls = 'bg-amber-50 text-amber-700 border-amber-100';
                        else if (colorIndex === 3) cls = 'bg-purple-50 text-purple-700 border-purple-100';
                        else cls = 'bg-rose-50 text-rose-700 border-rose-100';
                        html += '<span class="inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-semibold ' + cls + '">';
                        html += esc(name);
                        html += '</span>';
                    });
                }
                if (posNames) {
                    if (departments && departments.length) {
                        html += '<span class="text-gray-300 text-[11px]">|</span>';
                    }
                    html += '<span>' + esc(posNames) + '</span>';
                }
                html += '</div>';
            }
            var hasTags = tags && tags.length;
            var hasPoints = points && points > 0;
            if (hasTags || hasPoints) {
                html += '<div class="flex flex-wrap items-center gap-2 text-[11px] text-gray-600">';
                if (hasTags) {
                    tags.forEach(function (t) {
                        if (!t) return;
                        html += '<span class="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">';
                        html += esc(String(t));
                        html += '</span>';
                    });
                }
                if (hasPoints) {
                    html += '<span class="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 font-semibold">';
                    html += esc(String(points) + ' XP');
                    html += '</span>';
                }
                html += '</div>';
            }
            html += '</div>';
            html += '</div>';
            wrapper.innerHTML = html;
            var checkBtn = wrapper.querySelector('.quest-card-check-btn');
            if (checkBtn) {
                checkBtn.setAttribute('data-original-class', checkBtn.className);
                checkBtn.setAttribute('data-original-html', checkBtn.innerHTML);
            }
            return wrapper;
        }
        async function loadQuestTasks() {
            var overdueList = document.getElementById('questOverdueList');
            var todayList = document.getElementById('questTodayList');
            var upcomingList = document.getElementById('questUpcomingList');
            if (!overdueList && !todayList && !upcomingList) return;
            var parentWin = window.parent;
            if (!parentWin || !parentWin.db || !parentWin.collection || !parentWin.getDocs) return;
            try {
                if (overdueList) overdueList.innerHTML = '';
                if (todayList) todayList.innerHTML = '';
                if (upcomingList) upcomingList.innerHTML = '';
                
                var fetchFn = typeof getTasksCached === 'function' ? getTasksCached : (window.parent && typeof window.parent.getTasksCached === 'function' ? window.parent.getTasksCached : null);
                var snap = fetchFn ? await fetchFn(parentWin) : await parentWin.getDocs(parentWin.collection(parentWin.db, 'tasks'));
                
                var now = new Date();
                var todayNum = questDateToNumber(now);
                var totalMainQuest = 0;

                snap.forEach(function (docSnap) {
                    var data = docSnap.data() || {};
                    if (data.project_id || data.projectId) return;

                    // Update Main Quest Count: must be recurring and not complete/archived
                    var statusRaw = String(data.status || '').toLowerCase();
                    if (data.recur && statusRaw !== 'complete' && !data.archived) {
                        totalMainQuest++;
                    }

                    if (statusRaw === 'complete') return;
                    var dueText = data.due_date || data.dueDate || '';
                    if (!dueText) return;
                    var dueDate = parseQuestDueDateString(dueText);
                    if (!dueDate) return;
                    var dayNum = questDateToNumber(dueDate);
                    var targetList = null;
                    var category = '';
                    if (dayNum < todayNum) {
                        targetList = overdueList;
                        category = 'overdue';
                    } else if (dayNum === todayNum) {
                        targetList = todayList;
                        category = 'today';
                    } else if (dayNum > todayNum) {
                        targetList = upcomingList;
                        category = 'upcoming';
                    }
                    if (!targetList) return;
                    var id = docSnap.id;
                    if (id) {
                        questTasksById[id] = data;
                    }
                    var card = buildQuestTaskCard(data, category, id);
                    targetList.appendChild(card);
                });
                if (overdueList && !overdueList.innerHTML.trim()) {
                    overdueList.innerHTML = '<p class="text-gray-400 italic text-sm">No overdue quests.</p>';
                }
                if (todayList && !todayList.innerHTML.trim()) {
                    todayList.innerHTML = '<p class="text-gray-400 italic text-sm">No quests for today.</p>';
                }
                if (upcomingList && !upcomingList.innerHTML.trim()) {
                    upcomingList.innerHTML = '<p class="text-gray-400 italic text-sm">No upcoming quests.</p>';
                }

                var mainCountEl = document.getElementById('mainQuestCount');
                if (mainCountEl) {
                    mainCountEl.textContent = totalMainQuest;
                }

                if (window.lucide && window.lucide.createIcons) {
                    window.lucide.createIcons();
                }
                initQuestTooltips();
            } catch (e) {
                console.error('Failed to load quest tasks', e);
                if (overdueList) {
                    overdueList.innerHTML = '<p class="text-red-500 text-xs">Failed to load quests.</p>';
                }
                if (todayList) {
                    todayList.innerHTML = '<p class="text-red-500 text-xs">Failed to load quests.</p>';
                }
                if (upcomingList) {
                    upcomingList.innerHTML = '<p class="text-red-500 text-xs">Failed to load quests.</p>';
                }
            }
        }
        async function loadQuestDepartments() {
            var dropdown = document.getElementById('questDepartmentDropdown');
            if (!dropdown) return;
            dropdown.innerHTML = '<span class="text-gray-400 text-xs">Loading departments...</span>';
            try {
                var parentWin = window.parent;
                if (!parentWin || !parentWin.db || !parentWin.collection || !parentWin.getDocs) {
                    dropdown.innerHTML = '<span class="text-red-500 text-xs">Departments not available.</span>';
                    return;
                }
                var snap = await parentWin.getDocs(parentWin.collection(parentWin.db, "departments"));
                dropdown.innerHTML = '';
                snap.forEach(function (docSnap) {
                    var d = docSnap.data() || {};
                    var name = d.name || "Untitled";
                    var color = d.color || "#0B2B6A";
                    var row = document.createElement('div');
                    row.className = 'quest-dept-option flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer';
                    row.innerHTML =
                        '<span class="inline-flex w-2.5 h-2.5 rounded-full" style="background:' + color + ';"></span>' +
                        '<span class="quest-dept-name flex-1 text-xs md:text-sm text-gray-700">' + name + '</span>' +
                        '<input type="checkbox" class="ml-2 accent-blue-600" data-dept-id="' + docSnap.id + '">';
                    dropdown.appendChild(row);
                    var checkbox = row.querySelector('input[type="checkbox"]');
                    checkbox.addEventListener('change', updateQuestDepartmentLabel);
                    row.addEventListener('click', function (e) {
                        if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'input') {
                            return;
                        }
                        checkbox.checked = !checkbox.checked;
                        updateQuestDepartmentLabel();
                    });
                });
                if (!dropdown.innerHTML.trim()) {
                    dropdown.innerHTML = '<span class="text-gray-400 text-xs">No departments available.</span>';
                } else {
                    updateQuestDepartmentLabel();
                }
            } catch (e) {
                console.error('Failed to load departments for quest', e);
                dropdown.innerHTML = '<span class="text-red-500 text-xs">Failed to load departments.</span>';
            }
        }
        async function loadQuestPositions() {
            var dropdown = document.getElementById('questPositionDropdown');
            if (!dropdown) return;
            dropdown.innerHTML = '<span class="text-gray-400 text-xs">Loading positions...</span>';
            try {
                var parentWin = window.parent;
                if (!parentWin || !parentWin.db || !parentWin.collection || !parentWin.getDocs) {
                    dropdown.innerHTML = '<span class="text-red-500 text-xs">Positions not available.</span>';
                    return;
                }
                var snap = await parentWin.getDocs(parentWin.collection(parentWin.db, "positions"));
                dropdown.innerHTML = '';
                snap.forEach(function (docSnap) {
                    var d = docSnap.data() || {};
                    var name = d.name || "Untitled";
                    var row = document.createElement('div');
                    row.className = 'quest-position-option flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer';
                    row.innerHTML =
                        '<span class="quest-position-name flex-1 text-xs md:text-sm text-gray-700">' + name + '</span>' +
                        '<input type="checkbox" class="ml-2 accent-blue-600" data-position-id="' + docSnap.id + '">';
                    dropdown.appendChild(row);
                    var checkbox = row.querySelector('input[type="checkbox"]');
                    checkbox.addEventListener('change', updateQuestPositionLabel);
                    row.addEventListener('click', function (e) {
                        if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'input') {
                            return;
                        }
                        checkbox.checked = !checkbox.checked;
                        updateQuestPositionLabel();
                    });
                });
                if (!dropdown.innerHTML.trim()) {
                    dropdown.innerHTML = '<span class="text-gray-400 text-xs">No positions available.</span>';
                } else {
                    updateQuestPositionLabel();
                }
            } catch (e) {
                console.error('Failed to load positions for quest', e);
                dropdown.innerHTML = '<span class="text-red-500 text-xs">Failed to load positions.</span>';
            }
        }
        function updateSideQuestDepartmentLabel() {
            var dropdown = document.getElementById('sideQuestDepartmentDropdown');
            var labelEl = document.getElementById('sideQuestDepartmentButtonLabel');
            if (!dropdown || !labelEl) return;
            var selected = Array.prototype.slice.call(
                dropdown.querySelectorAll('input[type="checkbox"]:checked')
            );
            if (!selected.length) {
                labelEl.textContent = 'Select departments...';
                return;
            }
            var names = selected.map(function (cb) {
                var row = cb.closest('.sidequest-dept-option');
                if (!row) return '';
                var nameEl = row.querySelector('.sidequest-dept-name');
                return nameEl ? nameEl.textContent.trim() : '';
            }).filter(function (v) { return v; });
            if (!names.length) {
                labelEl.textContent = 'Select departments...';
            } else if (names.length === 1) {
                labelEl.textContent = names[0];
            } else if (names.length === 2) {
                labelEl.textContent = names[0] + ', ' + names[1];
            } else {
                labelEl.textContent = names[0] + ' and ' + (names.length - 1) + ' more';
            }
        }
        function updateSideQuestPositionLabel() {
            var dropdown = document.getElementById('sideQuestPositionDropdown');
            var labelEl = document.getElementById('sideQuestPositionButtonLabel');
            if (!dropdown || !labelEl) return;
            var selected = Array.prototype.slice.call(
                dropdown.querySelectorAll('input[type="checkbox"]:checked')
            );
            if (!selected.length) {
                labelEl.textContent = 'Select positions...';
                return;
            }
            var names = selected.map(function (cb) {
                var row = cb.closest('.sidequest-position-option');
                if (!row) return '';
                var nameEl = row.querySelector('.sidequest-position-name');
                return nameEl ? nameEl.textContent.trim() : '';
            }).filter(function (v) { return v; });
            if (!names.length) {
                labelEl.textContent = 'Select positions...';
            } else if (names.length === 1) {
                labelEl.textContent = names[0];
            } else if (names.length === 2) {
                labelEl.textContent = names[0] + ', ' + names[1];
            } else {
                labelEl.textContent = names[0] + ' and ' + (names.length - 1) + ' more';
            }
        }
        async function loadSideQuestDepartments() {
            var dropdown = document.getElementById('sideQuestDepartmentDropdown');
            if (!dropdown) return;
            dropdown.innerHTML = '<span class="text-gray-400 text-xs">Loading departments...</span>';
            try {
                var parentWin = window.parent;
                if (!parentWin || !parentWin.db || !parentWin.collection || !parentWin.getDocs) {
                    dropdown.innerHTML = '<span class="text-red-500 text-xs">Departments not available.</span>';
                    return;
                }
                var snap = await parentWin.getDocs(parentWin.collection(parentWin.db, "departments"));
                dropdown.innerHTML = '';
                snap.forEach(function (docSnap) {
                    var d = docSnap.data() || {};
                    var name = d.name || "Untitled";
                    var color = d.color || "#0B2B6A";
                    var row = document.createElement('div');
                    row.className = 'sidequest-dept-option flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer';
                    row.innerHTML =
                        '<span class="inline-flex w-2.5 h-2.5 rounded-full" style="background:' + color + ';"></span>' +
                        '<span class="sidequest-dept-name flex-1 text-xs md:text-sm text-gray-700">' + name + '</span>' +
                        '<input type="checkbox" class="ml-2 accent-blue-600" data-dept-id="' + docSnap.id + '">';
                    dropdown.appendChild(row);
                    var checkbox = row.querySelector('input[type="checkbox"]');
                    checkbox.addEventListener('change', updateSideQuestDepartmentLabel);
                    row.addEventListener('click', function (e) {
                        if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'input') {
                            return;
                        }
                        checkbox.checked = !checkbox.checked;
                        updateSideQuestDepartmentLabel();
                    });
                });
                if (!dropdown.innerHTML.trim()) {
                    dropdown.innerHTML = '<span class="text-gray-400 text-xs">No departments available.</span>';
                } else {
                    updateSideQuestDepartmentLabel();
                }
            } catch (e) {
                console.error('Failed to load departments for side quest', e);
                dropdown.innerHTML = '<span class="text-red-500 text-xs">Failed to load departments.</span>';
            }
        }
        async function loadSideQuestPositions() {
            var dropdown = document.getElementById('sideQuestPositionDropdown');
            if (!dropdown) return;
            dropdown.innerHTML = '<span class="text-gray-400 text-xs">Loading positions...</span>';
            try {
                var parentWin = window.parent;
                if (!parentWin || !parentWin.db || !parentWin.collection || !parentWin.getDocs) {
                    dropdown.innerHTML = '<span class="text-red-500 text-xs">Positions not available.</span>';
                    return;
                }
                var snap = await parentWin.getDocs(parentWin.collection(parentWin.db, "positions"));
                dropdown.innerHTML = '';
                snap.forEach(function (docSnap) {
                    var d = docSnap.data() || {};
                    var name = d.name || "Untitled";
                    var row = document.createElement('div');
                    row.className = 'sidequest-position-option flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer';
                    row.innerHTML =
                        '<span class="sidequest-position-name flex-1 text-xs md:text-sm text-gray-700">' + name + '</span>' +
                        '<input type="checkbox" class="ml-2 accent-blue-600" data-position-id="' + docSnap.id + '">';
                    dropdown.appendChild(row);
                    var checkbox = row.querySelector('input[type="checkbox"]');
                    checkbox.addEventListener('change', updateSideQuestPositionLabel);
                    row.addEventListener('click', function (e) {
                        if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'input') {
                            return;
                        }
                        checkbox.checked = !checkbox.checked;
                        updateSideQuestPositionLabel();
                    });
                });
                if (!dropdown.innerHTML.trim()) {
                    dropdown.innerHTML = '<span class="text-gray-400 text-xs">No positions available.</span>';
                } else {
                    updateSideQuestPositionLabel();
                }
            } catch (e) {
                console.error('Failed to load positions for side quest', e);
                dropdown.innerHTML = '<span class="text-red-500 text-xs">Failed to load positions.</span>';
            }
        }
        async function loadQuestUsers() {
            var parentWin = window.parent;
            var assignList = document.getElementById('questAssignList');
            var notifyList = document.getElementById('questNotifyList');
            if (assignList) {
                assignList.innerHTML = '<div class="text-slate-500 text-xs">Loading users...</div>';
            }
            if (notifyList) {
                notifyList.innerHTML = '<div class="text-slate-500 text-xs">Loading users...</div>';
            }
            try {
                if (!parentWin || !parentWin.db || !parentWin.collection || !parentWin.getDocs) {
                    if (assignList) {
                        assignList.innerHTML = '<div class="text-red-500 text-xs">Users not available.</div>';
                    }
                    if (notifyList) {
                        notifyList.innerHTML = '<div class="text-red-500 text-xs">Users not available.</div>';
                    }
                    return;
                }
                var snap = await parentWin.getDocs(parentWin.collection(parentWin.db, "users"));
                var users = [];
                questUsersById = {};
                snap.forEach(function (docSnap) {
                    var u = docSnap.data() || {};
                    var user = {
                        uid: docSnap.id,
                        name: u.name || u.email || "Unknown",
                        email: u.email || "",
                        photo: u.photo || ""
                    };
                    users.push(user);
                    questUsersById[user.uid] = user;
                });
                users.sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                });
                if (assignList) {
                    var baseUsers = users.slice();
                    function renderAssign(list) {
                        assignList.innerHTML = '';
                        list.forEach(function (user) {
                            var row = document.createElement('div');
                            row.className = 'quest-user-option flex items-center gap-3 px-2 py-2 hover:bg-slate-800 rounded-xl cursor-pointer';
                            var initials = getQuestUserInitials(user);
                            var avatar;
                            if (user.photo && user.photo.indexOf('pravatar.cc') === -1) {
                                avatar = '<img src="' + user.photo + '" alt="' + user.name + '" class="w-8 h-8 rounded-full object-cover border border-slate-700">';
                            } else {
                                avatar = '<span class="w-8 h-8 rounded-full bg-slate-700 text-slate-100 text-[10px] font-semibold flex items-center justify-center">' + initials + '</span>';
                            }
                            row.innerHTML =
                                '<div class="flex items-center gap-3 flex-1">' +
                                    avatar +
                                    '<span class="quest-user-name text-xs md:text-sm text-white">' + user.name + '</span>' +
                                '</div>' +
                                '<input type="checkbox" class="ml-2 accent-sky-500" data-user-id="' + user.uid + '">';
                            assignList.appendChild(row);
                            var checkbox = row.querySelector('input[type="checkbox"]');
                            checkbox.addEventListener('change', function () {
                                updateQuestUserLabel('questAssignDropdown', 'questAssignButtonLabel', 'Select user...', 'questAssignAvatars');
                            });
                            row.addEventListener('click', function (e) {
                                if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'input') {
                                    return;
                                }
                                checkbox.checked = !checkbox.checked;
                                updateQuestUserLabel('questAssignDropdown', 'questAssignButtonLabel', 'Select user...', 'questAssignAvatars');
                            });
                        });
                        if (!assignList.innerHTML.trim()) {
                            assignList.innerHTML = '<div class="text-slate-500 text-xs">No users found.</div>';
                        } else {
                            updateQuestUserLabel('questAssignDropdown', 'questAssignButtonLabel', 'Select user...', 'questAssignAvatars');
                        }
                    }
                    renderAssign(baseUsers);
                    var assignSearch = document.getElementById('questAssignSearch');
                    if (assignSearch) {
                        assignSearch.addEventListener('input', function () {
                            var filtered = filterQuestUsers(baseUsers, assignSearch.value);
                            renderAssign(filtered);
                        });
                    }
                }
                if (notifyList) {
                    var baseUsersNotify = users.slice();
                    function renderNotify(listN) {
                        notifyList.innerHTML = '';
                        listN.forEach(function (user) {
                            var row2 = document.createElement('div');
                            row2.className = 'quest-user-option flex items-center gap-3 px-2 py-2 hover:bg-slate-800 rounded-xl cursor-pointer';
                            var initials2 = getQuestUserInitials(user);
                            var avatar2;
                            if (user.photo && user.photo.indexOf('pravatar.cc') === -1) {
                                avatar2 = '<img src="' + user.photo + '" alt="' + user.name + '" class="w-8 h-8 rounded-full object-cover border border-slate-700">';
                            } else {
                                avatar2 = '<span class="w-8 h-8 rounded-full bg-slate-700 text-slate-100 text-[10px] font-semibold flex items-center justify-center">' + initials2 + '</span>';
                            }
                            row2.innerHTML =
                                '<div class="flex items-center gap-3 flex-1">' +
                                    avatar2 +
                                    '<span class="quest-user-name text-xs md:text-sm text-white">' + user.name + '</span>' +
                                '</div>' +
                                '<input type="checkbox" class="ml-2 accent-sky-500" data-user-id="' + user.uid + '">';
                            notifyList.appendChild(row2);
                            var cb2 = row2.querySelector('input[type="checkbox"]');
                            cb2.addEventListener('change', function () {
                                updateQuestUserLabel('questNotifyDropdown', 'questNotifyButtonLabel', 'Select user...', 'questNotifyAvatars');
                            });
                            row2.addEventListener('click', function (e) {
                                if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'input') {
                                    return;
                                }
                                cb2.checked = !cb2.checked;
                                updateQuestUserLabel('questNotifyDropdown', 'questNotifyButtonLabel', 'Select user...', 'questNotifyAvatars');
                            });
                        });
                        if (!notifyList.innerHTML.trim()) {
                            notifyList.innerHTML = '<div class="text-slate-500 text-xs">No users found.</div>';
                        } else {
                            updateQuestUserLabel('questNotifyDropdown', 'questNotifyButtonLabel', 'Select user...', 'questNotifyAvatars');
                        }
                    }
                    renderNotify(baseUsersNotify);
                    var notifySearch = document.getElementById('questNotifySearch');
                    if (notifySearch) {
                        notifySearch.addEventListener('input', function () {
                            var filteredN = filterQuestUsers(baseUsersNotify, notifySearch.value);
                            renderNotify(filteredN);
                        });
                    }
                }
                if (typeof renderReports === 'function') {
                    renderReports();
                }
                if (typeof updateActiveReportModalUsers === 'function') {
                    updateActiveReportModalUsers();
                }
            } catch (e) {
                console.error('Failed to load users for quest', e);
                if (assignList) {
                    assignList.innerHTML = '<div class="text-red-500 text-xs">Failed to load users.</div>';
                }
                if (notifyList) {
                    notifyList.innerHTML = '<div class="text-red-500 text-xs">Failed to load users.</div>';
                }
            }
        }
        function updateQuestActionButtons() {
            var actionContainers = document.querySelectorAll('.quest-card-actions');
            var deleteButtons = document.querySelectorAll('.quest-card-delete-btn');
            var cards = document.querySelectorAll('.quest-card');
            var checkButtons = document.querySelectorAll('.quest-card-check-btn');
            if (questActionMode === 'edit') {
                actionContainers.forEach(function (el) { el.classList.remove('hidden'); });
                deleteButtons.forEach(function (el) { el.classList.add('hidden'); });
                cards.forEach(function (card) { card.setAttribute('title', 'Click for Edit'); });
                checkButtons.forEach(function (btn) {
                    var originalClass = btn.getAttribute('data-original-class');
                    var originalHtml = btn.getAttribute('data-original-html');
                    if (!originalClass) {
                        btn.setAttribute('data-original-class', btn.className);
                    }
                    if (!originalHtml) {
                        btn.setAttribute('data-original-html', btn.innerHTML);
                    }
                    btn.className = 'px-3 py-1 text-xs font-semibold rounded-full border border-blue-500 text-blue-600 quest-card-check-btn';
                    btn.textContent = 'Edit';
                });
            } else if (questActionMode === 'delete') {
                actionContainers.forEach(function (el) { el.classList.remove('hidden'); });
                deleteButtons.forEach(function (el) { el.classList.remove('hidden'); });
                cards.forEach(function (card) { card.removeAttribute('title'); });
                checkButtons.forEach(function (btn) {
                    var originalClass = btn.getAttribute('data-original-class');
                    var originalHtml = btn.getAttribute('data-original-html');
                    if (originalClass) {
                        btn.className = originalClass;
                    }
                    if (originalHtml) {
                        btn.innerHTML = originalHtml;
                    }
                });
            } else {
                actionContainers.forEach(function (el) { el.classList.add('hidden'); });
                cards.forEach(function (card) { card.removeAttribute('title'); });
                checkButtons.forEach(function (btn) {
                    var originalClass = btn.getAttribute('data-original-class');
                    var originalHtml = btn.getAttribute('data-original-html');
                    if (originalClass) {
                        btn.className = originalClass;
                    }
                    if (originalHtml) {
                        btn.innerHTML = originalHtml;
                    }
                });
            }
        }
        function questEditTask(taskId) {
            if (!taskId) return;
            var targetWin = window.parent && window.parent !== window ? window.parent : window;
            var url = 'quest/quest-edit.html?taskId=' + encodeURIComponent(taskId);
            try {
                targetWin.open(url, '_blank');
            } catch (e) {
                window.open(url, '_blank');
            }
        }
        async function questToggleComplete(taskId) {
            if (!taskId) return;
            var parentWin = window.parent;
            if (!parentWin || !parentWin.db || !parentWin.doc || !parentWin.updateDoc) {
                alert('Tidak dapat mengubah status quest: koneksi database tidak tersedia.');
                return;
            }
            var currentStatus = null;
            if (questTasksById && questTasksById[taskId]) {
                currentStatus = questTasksById[taskId].status || questTasksById[taskId].Status;
            }
            var isComplete = String(currentStatus || '').toLowerCase() === 'complete';
            var nextStatus = isComplete ? 'Initiate' : 'Complete';
            try {
                var patch = { status: nextStatus };
                var payload = patch;
                if (parentWin.JSON && parentWin.JSON.stringify && parentWin.JSON.parse) {
                    try {
                        payload = parentWin.JSON.parse(parentWin.JSON.stringify(patch));
                    } catch (err) {
                        payload = patch;
                    }
                }
                await parentWin.updateDoc(parentWin.doc(parentWin.db, 'tasks', taskId), payload);
                if (questTasksById && questTasksById[taskId]) {
                    questTasksById[taskId].status = nextStatus;
                }
                loadQuestTasks();
                if (typeof loadSideQuestTasks === 'function') {
                    loadSideQuestTasks();
                }
            } catch (e) {
                console.error('Gagal mengubah status quest', e);
                alert('Gagal mengubah status quest: ' + (e && e.message ? e.message : String(e)));
            }
        }
        function questDeleteTask(taskId) {
            if (!taskId) return;
            var parentWin = window.parent;
            if (!parentWin || !parentWin.db || !parentWin.doc || !parentWin.deleteDoc) {
                showQuestAlert('Perhatian', 'Tidak dapat menghapus quest: koneksi database tidak tersedia.');
                return;
            }
            showQuestConfirm('Konfirmasi', 'Yakin ingin menghapus quest ini?', function () {
                parentWin.deleteDoc(parentWin.doc(parentWin.db, 'tasks', taskId)).then(function () {
                    if (questTasksById && questTasksById[taskId]) {
                        delete questTasksById[taskId];
                    }
                    loadQuestTasks();
                }).catch(function (e) {
                    console.error('Gagal menghapus quest', e);
                    var message = 'Gagal menghapus quest.';
                    if (e && e.message) {
                        message += ' ' + e.message;
                    }
                    showQuestAlert('Perhatian', message);
                });
            });
        }
        function questOpenTask(taskId) {
            if (!taskId) return;
            if (!questTasksById || !questTasksById[taskId]) {
                showQuestAlert('Perhatian', 'Tidak dapat menemukan data Side Quest untuk diedit.');
                return;
            }
            var data = questTasksById[taskId] || {};
            sideQuestEditingTaskId = taskId;
            var dropdown = document.getElementById('sideQuestCreateDropdown');
            var headerToggle = document.getElementById('sideQuestHeaderToggleButton');
            var headerMenu = document.getElementById('sideQuestHeaderMenu');
            if (dropdown) {
                dropdown.classList.remove('hidden');
                if (dropdown.scrollIntoView) {
                    dropdown.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
            if (headerToggle) {
                headerToggle.classList.add('hidden');
            }
            if (headerMenu) {
                headerMenu.classList.add('hidden');
            }
            var saveBtn = document.getElementById('sideQuestSaveButton');
            if (saveBtn) {
                saveBtn.textContent = 'Update Side Quest';
            }
            var input = document.getElementById('sideQuestNameInput');
            if (input) {
                input.value = data.title || '';
                if (input.focus) {
                    input.focus();
                }
            }
            var startEl = document.getElementById('sideQuestStartInput');
            if (startEl) {
                var startVal = data.start_date || data.startDate || '';
                startEl.value = startVal;
            }
            var dueEl = document.getElementById('sideQuestDueInput');
            if (dueEl) {
                var dueVal = data.due_date || data.dueDate || '';
                dueEl.value = dueVal;
            }
            var pointsEl = document.getElementById('sideQuestPointsInput');
            if (pointsEl) {
                var pointsVal = typeof data.points === 'number' ? data.points : (data.points ? Number(data.points) || 0 : 0);
                pointsEl.value = pointsVal ? String(pointsVal) : '';
            }
            var descEl = document.getElementById('sideQuestDesc');
            if (descEl) {
                descEl.innerHTML = data.description || '';
            }
            var tags = [];
            if (Array.isArray(data.tags)) {
                tags = data.tags.slice();
            }
            setSideQuestTags(tags);
            var departmentsMap = {};
            if (Array.isArray(data.departments)) {
                data.departments.forEach(function (d) {
                    if (d && d.id) {
                        departmentsMap[d.id] = true;
                    }
                });
            }
            Array.prototype.slice.call(
                document.querySelectorAll('#sideQuestDepartmentDropdown input[type="checkbox"]')
            ).forEach(function (cb) {
                var id = cb.getAttribute('data-dept-id') || '';
                cb.checked = !!departmentsMap[id];
            });
            updateSideQuestDepartmentLabel();
            var positionsMap = {};
            if (Array.isArray(data.positions)) {
                data.positions.forEach(function (p) {
                    if (p && p.id) {
                        positionsMap[p.id] = true;
                    }
                });
            }
            Array.prototype.slice.call(
                document.querySelectorAll('#sideQuestPositionDropdown input[type="checkbox"]')
            ).forEach(function (cb) {
                var id = cb.getAttribute('data-position-id') || '';
                cb.checked = !!positionsMap[id];
            });
            updateSideQuestPositionLabel();
            var assignSet = {};
            if (Array.isArray(data.assign_to)) {
                data.assign_to.forEach(function (uid) {
                    if (uid) {
                        assignSet[String(uid)] = true;
                    }
                });
            } else if (data.assign_to) {
                assignSet[String(data.assign_to)] = true;
            }
            Array.prototype.slice.call(
                document.querySelectorAll('#sideQuestAssignDropdown input[type="checkbox"]')
            ).forEach(function (cb) {
                var uid = cb.getAttribute('data-user-id') || '';
                cb.checked = !!assignSet[uid];
            });
            updateSideQuestUserLabel('sideQuestAssignDropdown', 'sideQuestAssignButtonLabel', 'Select user...', 'sideQuestAssignAvatars');
            var notifySet = {};
            if (Array.isArray(data.notify_to)) {
                data.notify_to.forEach(function (uid) {
                    if (uid) {
                        notifySet[String(uid)] = true;
                    }
                });
            } else if (data.notify_to) {
                notifySet[String(data.notify_to)] = true;
            }
            Array.prototype.slice.call(
                document.querySelectorAll('#sideQuestNotifyDropdown input[type="checkbox"]')
            ).forEach(function (cb) {
                var uid = cb.getAttribute('data-user-id') || '';
                cb.checked = !!notifySet[uid];
            });
            updateSideQuestUserLabel('sideQuestNotifyDropdown', 'sideQuestNotifyButtonLabel', 'Select user...', 'sideQuestNotifyAvatars');
            var priority = String(data.priority || 'normal').toLowerCase();
            sideQuestCurrentPriority = priority;
            var buttons = document.querySelectorAll('.side-quest-priority-btn');
            Array.prototype.slice.call(buttons).forEach(function (btn) {
                var p = btn.getAttribute('data-priority') || '';
                if (p === priority) {
                    btn.classList.add('border-slate-900', 'bg-slate-900', 'text-white');
                } else {
                    btn.classList.remove('border-slate-900', 'bg-slate-900', 'text-white');
                }
            });
        }
        async function saveQuest() {
            var parentWin = window.parent;
            if (!parentWin || !parentWin.db || !parentWin.collection || !parentWin.addDoc || !parentWin.serverTimestamp) {
                alert('Tidak dapat menyimpan quest: koneksi database tidak tersedia.');
                return;
            }
            var btn = document.getElementById('questSaveButton');
            var originalText = btn ? btn.textContent : '';
            if (btn) {
                btn.disabled = true;
                btn.textContent = 'Saving...';
            }
            try {
                var nameInput = document.getElementById('questNameInput');
                var title = nameInput ? String(nameInput.value || '').trim() : '';
                if (!title) {
                    alert('Silakan isi Quest Name terlebih dahulu.');
                    return;
                }
                var descEl = document.getElementById('questDescEditor');
                var descHtml = descEl ? descEl.innerHTML : '';
                var dueInput = document.getElementById('questDueDate');
                var dueText = dueInput ? String(dueInput.value || '').trim() : '';
                if (!dueText) {
                    showQuestAlert('Perhatian', 'task (atau Quest) tidak ada tanggalnya');
                    return;
                }
                var pointInput = document.getElementById('questPointInput');
                var points = 0;
                if (pointInput && pointInput.value) {
                    var p = parseFloat(pointInput.value);
                    if (!isNaN(p) && p > 0) {
                        points = p;
                    }
                }
                var deptSelected = [];
                Array.prototype.slice.call(
                    document.querySelectorAll('#questDepartmentDropdown input[type="checkbox"]:checked')
                ).forEach(function (cb) {
                    var id = cb.getAttribute('data-dept-id') || '';
                    var row = cb.closest('.quest-dept-option');
                    var nameEl = row ? row.querySelector('.quest-dept-name') : null;
                    var name = nameEl ? nameEl.textContent.trim() : '';
                    deptSelected.push({ id: id, name: name });
                });
                var positionSelected = [];
                Array.prototype.slice.call(
                    document.querySelectorAll('#questPositionDropdown input[type="checkbox"]:checked')
                ).forEach(function (cb) {
                    var id = cb.getAttribute('data-position-id') || '';
                    var row = cb.closest('.quest-position-option');
                    var nameEl = row ? row.querySelector('.quest-position-name') : null;
                    var name = nameEl ? nameEl.textContent.trim() : '';
                    positionSelected.push({ id: id, name: name });
                });
                var assignSelected = [];
                Array.prototype.slice.call(
                    document.querySelectorAll('#questAssignDropdown input[type="checkbox"]:checked')
                ).forEach(function (cb) {
                    var uid = cb.getAttribute('data-user-id') || '';
                    assignSelected.push(uid);
                });
                var notifySelected = [];
                Array.prototype.slice.call(
                    document.querySelectorAll('#questNotifyDropdown input[type="checkbox"]:checked')
                ).forEach(function (cb) {
                    var uid = cb.getAttribute('data-user-id') || '';
                    notifySelected.push(uid);
                });
                var tags = getQuestTags();
                var reminderMode = questReminderState && questReminderState.mode ? questReminderState.mode : null;
                var reminderDates = [];
                if (questReminderState && reminderMode) {
                    var dates = questReminderComputeDates();
                    if (dates && dates.length) {
                        reminderDates = dates.map(function (d) {
                            return d.toISOString();
                        });
                    }
                }
                var recur = null;
                if (questRecurState) {
                    recur = {
                        base_date: questRecurState.baseDate ? questDueFormatDate(questRecurState.baseDate) : null,
                        unit: questRecurState.unit || null,
                        interval: typeof questRecurState.interval === 'number' ? questRecurState.interval : 1,
                        weekdays: Array.isArray(questRecurState.weekdays) ? questRecurState.weekdays.slice() : [],
                        monthly_mode: questRecurState.monthlyMode || null
                    };
                }
                if (!recur) {
                    showQuestAlert('Perhatian', 'Quest tidak berulang atau hanya di jalankan sekali');
                    return;
                }
                if (notifySelected.length === 0) {
                    showQuestAlert('Perhatian', 'Quest tidak dilaporkan ke siapa-siapa');
                    return;
                }
                if (points === 0) {
                    showQuestAlert('Perhatian', 'Quest tidak punya nilai');
                    return;
                }
                var localData = null;
                try {
                    localData = JSON.parse(localStorage.getItem('userData') || 'null');
                } catch (e) {
                    localData = null;
                }
                var createdBy = localData && localData.uid ? localData.uid : '';
                var createdByName = localData && localData.name ? localData.name : '';
                var basePayload = {
                    title: title,
                    description: descHtml,
                    priority: questCurrentPriority || 'normal',
                    due_date: dueText,
                    points: points,
                    departments: deptSelected,
                    positions: positionSelected,
                    assign_to: assignSelected,
                    notify_to: notifySelected,
                    tags: tags,
                    reminder_mode: reminderMode,
                    reminder_dates: reminderDates,
                    recur: recur,
                    status: 'Initiate',
                    created_by: createdBy,
                    created_by_name: createdByName
                };
                var payload = basePayload;
                if (parentWin.JSON && parentWin.JSON.parse && parentWin.JSON.stringify) {
                    try {
                        payload = parentWin.JSON.parse(parentWin.JSON.stringify(basePayload));
                    } catch (e) {
                        payload = basePayload;
                    }
                }
                payload.created_at = parentWin.serverTimestamp();
                await parentWin.addDoc(parentWin.collection(parentWin.db, 'tasks'), payload);
                if (typeof loadQuestTasks === 'function') {
                    loadQuestTasks();
                }
                if (nameInput) nameInput.value = '';
                if (dueInput) dueInput.value = '';
                if (pointInput) pointInput.value = '';
                if (descEl) descEl.innerHTML = '';
                Array.prototype.slice.call(
                    document.querySelectorAll('#questDepartmentDropdown input[type="checkbox"]')
                ).forEach(function (cb) { cb.checked = false; });
                updateQuestDepartmentLabel();
                Array.prototype.slice.call(
                    document.querySelectorAll('#questPositionDropdown input[type="checkbox"]')
                ).forEach(function (cb) { cb.checked = false; });
                updateQuestPositionLabel();
                Array.prototype.slice.call(
                    document.querySelectorAll('#questAssignDropdown input[type="checkbox"]')
                ).forEach(function (cb) { cb.checked = false; });
                updateQuestUserLabel('questAssignDropdown', 'questAssignButtonLabel', 'Select user...', 'questAssignAvatars');
                Array.prototype.slice.call(
                    document.querySelectorAll('#questNotifyDropdown input[type="checkbox"]')
                ).forEach(function (cb) { cb.checked = false; });
                updateQuestUserLabel('questNotifyDropdown', 'questNotifyButtonLabel', 'Select user...', 'questNotifyAvatars');
                setQuestTags([]);
                questRecurState = null;
                questRecurPrevState = null;
                questReminderState = null;
                var labelReminder = document.getElementById('questReminderButtonLabel');
                if (labelReminder) {
                    labelReminder.textContent = 'No reminder';
                }
                toggleQuestForm();
                showQuestAlert('Sukses', 'Quest berhasil disimpan.');
            } catch (err) {
                console.error('Gagal menyimpan quest', err);
                alert('Gagal menyimpan quest: ' + (err && err.message ? err.message : String(err)));
            } finally {
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = originalText || 'Add to-do';
                }
            }
        }
        function updateQuestHeaderToggleButton() {
            var btn = document.getElementById('questHeaderToggleButton');
            if (!btn) return;
            if (questActionMode === 'edit') {
                btn.className = 'px-4 py-1.5 text-xs font-semibold rounded-full border border-blue-500 text-blue-600 bg-white shadow-sm';
                btn.textContent = 'Exit Edit';
            } else if (questActionMode === 'delete') {
                btn.className = 'px-4 py-1.5 text-xs font-semibold rounded-full border border-red-500 text-red-600 bg-white shadow-sm';
                btn.textContent = 'Exit Delete';
            } else {
                btn.className = 'w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm';
                btn.innerHTML = '<i data-lucide=\"more-vertical\" class=\"w-4 h-4 text-gray-600\"></i>';
                if (window.lucide && window.lucide.createIcons) {
                    window.lucide.createIcons();
                }
            }
        }
        function toggleQuestHeaderMenu(event) {
            var menu = document.getElementById('questHeaderMenu');
            if (!menu) return;
            if (event && event.stopPropagation) {
                event.stopPropagation();
            }
            if (questActionMode === 'edit' || questActionMode === 'delete') {
                questActionMode = null;
                updateQuestActionButtons();
                updateQuestHeaderToggleButton();
                return;
            }
            if (menu.classList.contains('hidden')) {
                menu.classList.remove('hidden');
            } else {
                menu.classList.add('hidden');
            }
        }
        function questHeaderEdit() {
            var menu = document.getElementById('questHeaderMenu');
            if (menu) {
                menu.classList.add('hidden');
            }
            if (questActionMode === 'edit') {
                questActionMode = null;
            } else {
                questActionMode = 'edit';
            }
            updateQuestActionButtons();
            updateQuestHeaderToggleButton();
        }
        function questHeaderDelete() {
            var menu = document.getElementById('questHeaderMenu');
            if (menu) {
                menu.classList.add('hidden');
            }
            if (questActionMode === 'delete') {
                questActionMode = null;
            } else {
                questActionMode = 'delete';
            }
            updateQuestActionButtons();
            updateQuestHeaderToggleButton();
        }
        function toggleSideQuestHeaderMenu(event) {
            var menu = document.getElementById('sideQuestHeaderMenu');
            if (!menu) return;
            if (event && event.stopPropagation) {
                event.stopPropagation();
            }
            if (menu.classList.contains('hidden')) {
                menu.classList.remove('hidden');
            } else {
                menu.classList.add('hidden');
            }
        }
        function sideQuestHeaderEdit() {
            var menu = document.getElementById('sideQuestHeaderMenu');
            if (menu) {
                menu.classList.add('hidden');
            }
        }
        function sideQuestHeaderDelete() {
            var menu = document.getElementById('sideQuestHeaderMenu');
            if (menu) {
                menu.classList.add('hidden');
            }
        }
        function questCloseDropdownIfOutside(event, dropdownId, usesDisplayStyle) {
            var dropdown = document.getElementById(dropdownId);
            if (!dropdown) return;
            var target = event.target;
            var trigger = dropdown.previousElementSibling;
            var insideDropdown = dropdown.contains(target);
            var insideTrigger = trigger && trigger.contains(target);
            if (insideDropdown || insideTrigger) return;
            if (usesDisplayStyle) {
                if (dropdown.style.display === 'block') {
                    dropdown.style.display = 'none';
                }
            } else {
                if (!dropdown.classList.contains('hidden')) {
                    dropdown.classList.add('hidden');
                }
            }
        }
        document.addEventListener('click', function (event) {
            var checkBtn = event.target.closest('.quest-card-check-btn');
            if (checkBtn) {
                var card = checkBtn.closest('.quest-card');
                if (card) {
                    var id = card.getAttribute('data-task-id');
                    if (id) {
                        if (questActionMode === 'edit') {
                            questEditTask(id);
                        } else if (questActionMode === 'delete') {
                            questDeleteTask(id);
                        } else {
                            checkBtn.classList.add('bg-emerald-500', 'border-emerald-500', 'text-white');
                            var icon = checkBtn.querySelector('i');
                            if (icon) {
                                icon.classList.remove('text-gray-400');
                                icon.classList.add('text-white');
                            }
                            questToggleComplete(id);
                        }
                    }
                }
                return;
            }
            var deleteBtn = event.target.closest('.quest-card-delete-btn');
            if (deleteBtn) {
                var cardDelete = deleteBtn.closest('.quest-card');
                if (cardDelete) {
                    var idDelete = cardDelete.getAttribute('data-task-id');
                    if (idDelete) {
                        questDeleteTask(idDelete);
                    }
                }
                return;
            }
            questCloseDropdownIfOutside(event, 'questDepartmentDropdown', false);
            questCloseDropdownIfOutside(event, 'questAssignDropdown', false);
            questCloseDropdownIfOutside(event, 'questDueDropdown', false);
            questCloseDropdownIfOutside(event, 'questRecurDropdown', false);
            questCloseDropdownIfOutside(event, 'questReminderDropdown', false);
            questCloseDropdownIfOutside(event, 'questPositionDropdown', false);
            questCloseDropdownIfOutside(event, 'questNotifyDropdown', false);
            questCloseDropdownIfOutside(event, 'quest-tag-dropdown', true);
            questCloseDropdownIfOutside(event, 'questHeaderMenu', false);
            questCloseDropdownIfOutside(event, 'sideQuestCreateDropdown', false);
            questCloseDropdownIfOutside(event, 'sideQuestHeaderMenu', false);
        });
        (async function() {
            await loadQuestDepartments();
            await loadQuestPositions();
            await loadQuestUsers();
            await loadQuestTasks();
            if (typeof loadSideQuestTasks === 'function') {
                await loadSideQuestTasks();
            } else if (window.parent && typeof window.parent.loadSideQuestTasks === 'function') {
                await window.parent.loadSideQuestTasks();
            }
        })();
        
        // Expose functions to window for cross-frame access
        if (typeof window !== 'undefined') {
            window.openSideQuestDescription = openSideQuestDescription;
        }
    </script>
</body>
</html>`;

            if (frame) {
                frame.removeAttribute('src');
                frame.onload = function() {
                    try {
                        if (frame.contentWindow) {
                            if (window.openSideQuestDescription) {
                                frame.contentWindow.openSideQuestDescription = window.openSideQuestDescription;
                                console.log('Injected openSideQuestDescription into iframe');
                            } else {
                                console.warn('window.openSideQuestDescription not available to inject');
                            }
                        }
                    } catch (e) {
                        console.error('Failed to inject openSideQuestDescription', e);
                    }
                };
                frame.srcdoc = html;
            }
            if (modalEl && typeof bootstrap !== "undefined" && bootstrap.Modal) {
                const overlay = document.getElementById('questBoardOverlay');
                if (overlay) {
                    overlay.classList.add('show');
                }
                modalEl.addEventListener('hidden.bs.modal', () => {
                    const ov = document.getElementById('questBoardOverlay');
                    if (ov) {
                        ov.classList.remove('show');
                    }
                }, { once: true });
                const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
                modal.show();
            } else {
                var newWin = window.open('', '_blank');
                if (newWin && newWin.document) {
                    newWin.document.open();
                    newWin.document.write(html);
                    newWin.document.close();
                }
            }
        });
    }

    const reportCard = target.querySelector('#reportFilterCard');
    if (reportCard) {
        reportCard.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof refreshSidebarCounts === 'function') {
                refreshSidebarCounts(0);
            }
            if (typeof window.closeQuestBoardModal === 'function') {
                try { window.closeQuestBoardModal(); } catch (err) {}
            }
            const modalEl = document.getElementById('reportBoardModal');
            const frame = document.getElementById('reportBoardFrame');
            window.closeReportBoardModal = function () {
                const overlay = document.getElementById('questBoardOverlay');
                if (overlay) {
                    overlay.classList.remove('show');
                }
                if (modalEl && typeof bootstrap !== "undefined" && bootstrap.Modal) {
                    const instance = bootstrap.Modal.getOrCreateInstance(modalEl);
                    instance.hide();
                }
            };
            const html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Report Management - Premium Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        :root {
            --primary-teal: #2d5a52;
            --bg-light: #f4f7f9;
            --text-muted: #64748b;
            --border-color: #e2e8f0;
        }
        body {
            background-color: var(--bg-light);
            font-family: 'Inter', sans-serif;
            color: #1e293b;
        }
        .card { border: none; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .count-badge { background: #0f172a; color: white; font-size: 0.7rem; padding: 2px 8px; border-radius: 20px; vertical-align: middle; }
        .btn-teal { background-color: var(--primary-teal); color: white; border: none; font-size: 14px; padding: 8px 16px; }
        .btn-teal:hover { background-color: #234741; color: white; }
        .btn-approve-all { background-color: #0f172a; color: white; border: none; font-size: 14px; }
        .stat-label { font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
        .stat-value { font-size: 24px; font-weight: 700; color: #0f172a; }
        .stat-diff { font-size: 10px; font-weight: 600; }
        .diff-up { color: #0ea5e9; }
        .diff-down { color: #f43f5e; }
        .table { table-layout: fixed; width: 100%; }
        .col-select { width: 56px; }
        .col-team { width: 180px; }
        .col-type { width: 130px; }
        .col-date { width: 140px; }
        .col-task { width: 160px; }
        .col-files { width: 130px; }
        .col-action { width: 140px; }
        .table thead th {
            background-color: #ffffff;
            color: var(--text-muted);
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            padding: 15px 12px;
            border-bottom: 1px solid var(--border-color);
        }
        .nav-item .nav-link.active {
            background: linear-gradient(to bottom, #0f61a8 5%, #0b2b6a 100%);
            border-radius: 10px;
            box-shadow: 0px 5px 16px -6px rgba(114, 4, 207, 1);
            -webkit-box-shadow: 0px 5px 16px -6px rgba(114, 4, 207, 1);
            color: white;
        }
        .nav-item .nav-link {
            color: #0B2B6A;
        }
        .table tbody tr { cursor: pointer; transition: background 0.2s; }
        .table tbody tr:hover { background-color: #f8fafc !important; }
        .table tbody td { padding: 12px; vertical-align: middle; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
        .badge-quest { font-size: 10px; padding: 4px 8px; border-radius: 6px; font-weight: 600; }
        .badge-main { background: #dbeafe; color: #1e40af; }
        .badge-side { background: #fef3c7; color: #92400e; }
        .badge-project { background: #f3e8ff; color: #6b21a8; }
        .rich-text-preview {
            background: #f1f5f9;
            color: #475569;
            padding: 5px 10px;
            border-radius: 6px;
            font-size: 12px;
            border-left: 3px solid var(--primary-teal);
            font-style: italic;
        }
        .text-truncate-custom { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
        .modal-content { border-radius: 15px; border: none; }
        .modal-header { border-bottom: 1px solid #f1f5f9; }
    </style>
</head>
<body class="py-4" style="background-color: #ffffff;">
<div class="container-fluid px-4" style="background-color: #ffffff;">
    <div class="d-flex justify-content-between align-items-center mb-4" style="background-color: #ffffff;">
        <div>
            <h4 class="fw-bold d-inline-block me-2 mb-0">Report Side Quest</h4>
            <span class="count-badge">551</span>
        </div>
        <div class="d-flex gap-2">
            <div class="btn-group shadow-sm">
                <button id="reportTopArchiveButton" type="button" class="btn btn-white border bg-white btn-sm px-3"><i class="fas fa-box-archive text-secondary"></i></button>
                <button id="reportTopDeleteButton" type="button" class="btn btn-white border bg-white btn-sm px-3"><i class="fas fa-trash-can text-muted"></i></button>
            </div>
            <ul class="nav nav-pills border-bottom-0 me-2">
                <li class="nav-item">
                    <a class="nav-link active fw-bold px-3" id="reportTabSide" href="javascript:void(0)">Side Quest</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link fw-bold px-3" id="reportTabMain" href="javascript:void(0)">Main Quest</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link fw-bold px-3" id="reportTabProject" href="javascript:void(0)">Project Quest</a>
                </li>
            </ul>
            <button type="button" class="btn btn-outline-secondary rounded-3 shadow-sm"
                onclick="if (window.parent && window.parent.closeReportBoardModal) { window.parent.closeReportBoardModal(); }">
                <i class="fas fa-times me-1"></i> Close
            </button>
        </div>
    </div>
    <div class="row g-3 mb-4">
        <div class="col-lg-6">
            <div class="card p-4 h-100 shadow">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h6 class="fw-bold mb-0 text-secondary"><i class="far fa-check-circle text-primary me-2"></i> Approval Status</h6>
                    <i class="fas fa-ellipsis-h text-muted"></i>
                </div>
                <div class="row">
                    <div class="col-3">
                        <div class="stat-label">Requested</div>
                        <div class="stat-value" id="statRequestedValue">265</div>
                        <div class="stat-diff diff-up">+ 12 vs yesterday</div>
                    </div>
                    <div class="col-3 border-start ps-4">
                        <div class="stat-label">Approved</div>
                        <div class="stat-value" id="statApprovedValue">3</div>
                        <div class="stat-diff diff-down">- 6 vs yesterday</div>
                    </div>
                    <div class="col-3 border-start ps-4">
                        <div class="stat-label">Rejected</div>
                        <div class="stat-value" id="statRejectedValue">4</div>
                        <div class="stat-diff diff-down">- 2 vs yesterday</div>
                    </div>
                    <div class="col-3 border-start ps-4">
                        <div class="stat-label">Pending</div>
                        <div class="stat-value" id="statPendingValue">18</div>
                        <div class="stat-diff diff-down">- 6 vs yesterday</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-6">
            <div class="card p-4 h-100 shadow">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="fw-bold mb-0 text-secondary"><i class="far fa-clock text-primary me-2"></i> Quest Type Breakdown</h6>
                    <i class="fas fa-ellipsis-h text-muted"></i>
                </div>
                <div class="mt-2">
                    <div class="d-flex align-items-center mb-2">
                        <span class="stat-label" style="width: 100px;">Main Quest</span>
                        <div class="flex-grow-1 mx-3"><div class="progress" style="height: 6px;"><div class="progress-bar bg-primary" style="width: 45%"></div></div></div>
                        <span class="fw-bold small">21</span>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                        <span class="stat-label" style="width: 100px;">Side Quest</span>
                        <div class="flex-grow-1 mx-3"><div class="progress" style="height: 6px;"><div class="progress-bar bg-warning" style="width: 70%"></div></div></div>
                        <span class="fw-bold small">30</span>
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="stat-label" style="width: 100px;">Project</span>
                        <div class="flex-grow-1 mx-3"><div class="progress" style="height: 6px;"><div class="progress-bar bg-purple" style="width: 60%; background-color: #a855f7;"></div></div></div>
                        <span class="fw-bold small">28</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-3">
        <div class="d-flex gap-2">
            <div class="position-relative">
                <i class="fas fa-search position-absolute text-muted" style="left: 12px; top: 10px; font-size: 13px;"></i>
                <input id="reportSearchInput" type="text" class="form-control ps-5 rounded-3 border-light shadow-sm" style="width: 280px; font-size: 13px;" placeholder="Search Report Quest">
            </div>
            <select id="reportPeriodSelect" class="form-select rounded-3 border-light shadow-sm" style="width: 150px; font-size: 13px;">
                <option value="all" selected>All Period</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="3month">3 Month</option>
                <option value="6month">6 Month</option>
                <option value="yearly">Yearly</option>
            </select>
            <div class="dropdown">
                <button id="reportBulkMenuButton" class="btn btn-light rounded-3 border shadow-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="width: 44px;">
                    <i class="fas fa-ellipsis-v text-muted"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><button class="dropdown-item" type="button" data-bulk-action="archive">Archive</button></li>
                    <li><button class="dropdown-item text-danger" type="button" data-bulk-action="delete">Delete</button></li>
                </ul>
            </div>
            <select id="reportStatusSelect" class="form-select rounded-3 border-light shadow-sm" style="width: 150px; font-size: 13px;">
                <option value="all">All Status</option>
                <option value="pending" selected>Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
            </select>
            <select id="reportPageSizeSelect" class="form-select rounded-3 border-light shadow-sm" style="width: 120px; font-size: 13px;">
                <option value="20" selected>20 / page</option>
                <option value="40">40 / page</option>
                <option value="60">60 / page</option>
            </select>
        </div>
        <button id="reportBulkActionButton" class="btn btn-approve-all px-3 py-2 rounded-3 shadow-sm" style="display:none;">
        </button>
    </div>
    <div class="card shadow-sm overflow-hidden border">
        <div class="table-responsive">
            <table class="table align-middle mb-0">
                <thead>
                    <tr>
                        <th class="col-select text-center js-bulk-only" style="display:none;" data-sort-key=""></th>
                        <th class="col-team px-4" data-sort-key="user">Team</th>
                        <th class="col-date" data-sort-key="date">Date</th>
                        <th class="col-task" data-sort-key="task">Task</th>
                        <th data-sort-key="reportPreview">Report</th>
                        <th class="col-files" data-sort-key="fileName">Files</th>
                        <th class="col-action text-center" data-sort-key="status">Action</th>
                    </tr>
                </thead>
                <tbody id="reportTableBody" class="bg-white"></tbody>
            </table>
        </div>
    </div>
</div>
<div class="modal fade" id="detailModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow-lg">
            <div class="modal-header bg-light">
                <h6 class="modal-title fw-bold mb-0">Report Details</h6>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-4">
                <div class="mb-3">
                    <div class="d-flex justify-content-between align-items-start gap-3">
                        <div class="col-6 text-start">
                            <div class="stat-label mb-1">Assigned</div>
                            <div id="mAssignAvatars" class="d-flex justify-content-start gap-1 flex-wrap"></div>
                        </div>
                        <div class="col-6 text-start">
                            <div class="stat-label mb-1">Report To</div>
                            <div id="mNotifyAvatars" class="d-flex justify-content-start gap-1 flex-wrap"></div>
                        </div>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-6">
                        <label class="stat-label mb-1">Quest Type</label>
                        <div id="mType"></div>
                    </div>
                    <div class="col-6">
                        <label class="stat-label mb-1">Task Title</label>
                        <div id="mTask" class="fw-medium"></div>
                    </div>
                </div>
                <div class="accordion mb-3" id="moreAccordion">
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed py-2" type="button" data-bs-toggle="collapse" data-bs-target="#moreCollapse" aria-expanded="false" aria-controls="moreCollapse">
                                More
                            </button>
                        </h2>
                        <div id="moreCollapse" class="accordion-collapse collapse" data-bs-parent="#moreAccordion">
                            <div class="accordion-body py-3">
                                <dl class="row mb-0 small">
                                    <dt class="col-4 text-muted">Department</dt>
                                    <dd class="col-8 mb-2" id="mDepartments">-</dd>
                                    <dt class="col-4 text-muted">Position</dt>
                                    <dd class="col-8 mb-2" id="mPositions">-</dd>
                                    <dt class="col-4 text-muted">Start Date</dt>
                                    <dd class="col-8 mb-2" id="mStartDate">-</dd>
                                    <dt class="col-4 text-muted">Due Date</dt>
                                    <dd class="col-8 mb-2" id="mDueDate">-</dd>
                                    <dt class="col-4 text-muted">Task Point</dt>
                                    <dd class="col-8 mb-2" id="mPoints">-</dd>
                                    <dt class="col-4 text-muted">Priority</dt>
                                    <dd class="col-8 mb-2" id="mPriority">-</dd>
                                    <dt class="col-4 text-muted">Description</dt>
                                    <dd class="col-8 mb-0" id="mDescription">-</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
                <div>
                    <label class="stat-label mb-2">Report Content</label>
                    <div id="mReport" class="p-3 rounded-3 bg-light border-start border-4 border-success" style="font-size: 14px; line-height: 1.6;"></div>
                </div>
                <div class="mt-3" id="mFilesWrapper" style="display:none;">
                    <label class="stat-label mb-2">Files</label>
                    <div id="mFiles" class="d-flex flex-wrap gap-2"></div>
                </div>
                <div id="feedbackSection" class="mt-3" style="display:none;">
                    <label class="stat-label mb-2">Feedback</label>
                    <div class="d-flex flex-wrap gap-2 mb-2">
                        <div class="btn-group btn-group-sm" role="group" aria-label="Formatting">
                            <button type="button" class="btn btn-outline-secondary" data-editor-cmd="bold"><i class="fas fa-bold"></i></button>
                            <button type="button" class="btn btn-outline-secondary" data-editor-cmd="italic"><i class="fas fa-italic"></i></button>
                            <button type="button" class="btn btn-outline-secondary" data-editor-cmd="underline"><i class="fas fa-underline"></i></button>
                        </div>
                        <div class="btn-group btn-group-sm" role="group" aria-label="Lists">
                            <button type="button" class="btn btn-outline-secondary" data-editor-cmd="insertUnorderedList"><i class="fas fa-list-ul"></i></button>
                            <button type="button" class="btn btn-outline-secondary" data-editor-cmd="insertOrderedList"><i class="fas fa-list-ol"></i></button>
                        </div>
                        <div class="btn-group btn-group-sm" role="group" aria-label="Insert">
                            <button id="feedbackAddLinkBtn" type="button" class="btn btn-outline-secondary"><i class="fas fa-link"></i></button>
                            <button id="feedbackAddFilesBtn" type="button" class="btn btn-outline-secondary"><i class="fas fa-paperclip"></i></button>
                        </div>
                    </div>
                    <div id="feedbackEditor" class="form-control rounded-3" contenteditable="true" style="min-height: 120px; font-size: 14px;"></div>
                    <input id="feedbackFileInput" type="file" multiple class="d-none">
                    <div id="feedbackFileList" class="small text-muted mt-2"></div>
                </div>
            </div>
            <div class="modal-footer border-0">
                <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
                <button id="approveTaskButton" type="button" class="btn btn-teal btn-sm px-4">Approve Task</button>
                <button id="submitFeedbackButton" type="button" class="btn btn-teal btn-sm px-4" style="display:none;">Submit Feedback</button>
            </div>
        </div>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script>
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    var detailModal = new bootstrap.Modal(document.getElementById('detailModal'));
    var activeModalReportId = null;
    var pendingFeedbackFiles = [];
    function loadReportUsers(attempt) {
        var parentWin = window.parent;
        if (!parentWin || !parentWin.db || !parentWin.collection || !parentWin.getDocs) {
            var nextAttempt = typeof attempt === 'number' ? attempt + 1 : 1;
            if (nextAttempt <= 30) {
                setTimeout(function () { loadReportUsers(nextAttempt); }, 500);
            }
            return;
        }
        parentWin.getDocs(parentWin.collection(parentWin.db, 'users')).then(function (snap) {
            var map = {};
            snap.forEach(function (docSnap) {
                var u = docSnap.data() || {};
                map[docSnap.id] = {
                    uid: docSnap.id,
                    name: u.name || u.email || docSnap.id,
                    email: u.email || '',
                    photo: u.photo || ''
                };
            });
            window.reportUsersById = map;
            if (typeof renderReports === 'function') {
                renderReports();
            }
            if (typeof updateActiveReportModalUsers === 'function') {
                updateActiveReportModalUsers();
            }
        }).catch(function (e) {
            console.error('Failed to load users for report board', e);
        });
    }
    loadReportUsers(0);

    function getParentUsers() {
        var w = window;
        if (w.reportUsersById && Object.keys(w.reportUsersById).length) return w.reportUsersById;
        if (w.questUsersById && Object.keys(w.questUsersById).length) return w.questUsersById;
        var parentWin = w.parent;
        if (parentWin && parentWin.reportUsersById && Object.keys(parentWin.reportUsersById).length) return parentWin.reportUsersById;
        if (parentWin && parentWin.questUsersById && Object.keys(parentWin.questUsersById).length) return parentWin.questUsersById;
        return {};
    }

    function getUserDisplay(uid) {
        var users = getParentUsers();
        var u = uid ? users[uid] : null;
        if (!u) return { name: uid || 'Unknown', photo: '' };
        return { name: u.name || u.email || uid, photo: u.photo || '' };
    }

    function formatNameWords(name, maxWords) {
        var s = String(name || '').trim().replace(/\s+/g, ' ');
        if (!s) return '';
        var words = s.split(' ');
        var limit = typeof maxWords === 'number' && maxWords > 0 ? maxWords : words.length;
        return words.slice(0, limit).join(' ');
    }

    function firstNameOf(fullName) {
        var s = String(fullName || '').trim().replace(/\s+/g, ' ');
        if (!s) return '';
        return s.split(' ')[0];
    }

    function initialsOf(source) {
        var s = String(source || '').trim();
        if (!s) return 'U';
        var parts = s.split(/\s+/);
        var letters = parts.map(function (p) { return p[0]; }).join('');
        letters = letters || s.substring(0, 2);
        return letters.substring(0, 2).toUpperCase();
    }

    function renderAvatarPile(uids, max) {
        var ids = Array.isArray(uids) ? uids.filter(Boolean) : [];
        if (ids.length === 0) return '<span class="text-muted">-</span>';
        var limit = typeof max === 'number' && max > 0 ? max : 5;
        var html = '<div class="d-flex align-items-center">';
        var showCount = Math.min(ids.length, limit);
        for (var i = 0; i < showCount; i++) {
            var info = getUserDisplay(ids[i]);
            var ml = i === 0 ? '' : ' margin-left:-8px;';
            var z = 100 - i;
            if (info.photo) {
                html += '<span class="position-relative" style="z-index:' + z + ';' + ml + '">' +
                    '<img src="' + escapeAttr(info.photo) + '" width="28" height="28" class="rounded-circle border bg-white" style="object-fit:cover;border-width:2px;" data-bs-toggle="tooltip" title="' + escapeAttr(info.name) + '">' +
                '</span>';
            } else {
                var ini = initialsOf(info.name || ids[i]);
                html += '<span class="position-relative d-inline-flex align-items-center justify-content-center rounded-circle border bg-secondary text-white" style="z-index:' + z + ';width:28px;height:28px;font-size:11px;' + ml + '" data-bs-toggle="tooltip" title="' + escapeAttr(info.name || ids[i]) + '">' + escapeAttr(ini) + '</span>';
            }
        }
        if (ids.length > limit) {
            var extra = ids.length - limit;
            var mlExtra = showCount > 0 ? ' margin-left:-8px;' : '';
            html += '<span class="d-inline-flex align-items-center justify-content-center rounded-circle bg-light text-muted border" style="width:28px;height:28px;font-size:11px;' + mlExtra + '">+' + String(extra) + '</span>';
        }
        html += '</div>';
        return html;
    }

    function renderAssigneesCell(uids) {
        var ids = Array.isArray(uids) ? uids.filter(Boolean) : [];
        if (ids.length === 0) return '<span class="text-muted">-</span>';
        return renderAvatarPile(ids, 2);
    }

    function renderNamedCollection(arr) {
        if (!Array.isArray(arr) || arr.length === 0) return '-';
        var names = [];
        for (var i = 0; i < arr.length; i++) {
            var x = arr[i];
            if (!x) continue;
            if (typeof x === 'string') names.push(x);
            else if (x.name) names.push(String(x.name));
        }
        if (!names.length) return '-';
        return names.join(', ');
    }

    function setModalMode(mode) {
        var feedback = document.getElementById('feedbackSection');
        var approveBtn = document.getElementById('approveTaskButton');
        var submitBtn = document.getElementById('submitFeedbackButton');
        if (mode === 'feedback') {
            if (feedback) feedback.style.display = '';
            if (approveBtn) approveBtn.style.display = 'none';
            if (submitBtn) submitBtn.style.display = '';
        } else {
            if (feedback) feedback.style.display = 'none';
            if (approveBtn) approveBtn.style.display = '';
            if (submitBtn) submitBtn.style.display = 'none';
        }
    }

    function openModalForReport(reportObj, mode) {
        if (!reportObj) return;
        activeModalReportId = reportObj.id;
        var mUser = document.getElementById('mUser');
        if (mUser) {
            var ids = Array.isArray(reportObj.assignees) ? reportObj.assignees.filter(Boolean) : [];
            if (ids.length === 0) {
                mUser.innerText = '-';
            } else if (ids.length === 1) {
                mUser.innerText = getUserDisplay(ids[0]).name;
            } else {
                var names = [];
                for (var i = 0; i < ids.length; i++) names.push(getUserDisplay(ids[i]).name);
                mUser.innerText = names.join(', ');
            }
        }
        var mTask = document.getElementById('mTask');
        if (mTask) mTask.innerText = reportObj.task || '-';
        var mReport = document.getElementById('mReport');
        if (mReport) mReport.innerHTML = reportObj.reportFull || '';
        var badgeClass = 'badge-quest ';
        if (reportObj.questType === 'Main Quest') badgeClass += 'badge-main';
        else if (reportObj.questType === 'Side Quest') badgeClass += 'badge-side';
        else badgeClass += 'badge-project';
        var mType = document.getElementById('mType');
        if (mType) mType.innerHTML = '<span class="' + badgeClass + '">' + (reportObj.questType || '-') + '</span>';

        var mAssign = document.getElementById('mAssignAvatars');
        if (mAssign) mAssign.innerHTML = renderAvatarPile(reportObj.assignees, 6);
        var mNotify = document.getElementById('mNotifyAvatars');
        if (mNotify) mNotify.innerHTML = renderAvatarPile(reportObj.notifyTo, 6);

        var mDepartments = document.getElementById('mDepartments');
        if (mDepartments) mDepartments.innerText = renderNamedCollection(reportObj.departments);
        var mPositions = document.getElementById('mPositions');
        if (mPositions) mPositions.innerText = renderNamedCollection(reportObj.positions);
        var mStartDate = document.getElementById('mStartDate');
        if (mStartDate) mStartDate.innerText = reportObj.startDate || '-';
        var mDueDate = document.getElementById('mDueDate');
        if (mDueDate) mDueDate.innerText = reportObj.dueDate || '-';
        var mPoints = document.getElementById('mPoints');
        if (mPoints) mPoints.innerText = typeof reportObj.points === 'number' ? String(reportObj.points) : (reportObj.points ? String(reportObj.points) : '-');
        var mPriority = document.getElementById('mPriority');
        if (mPriority) mPriority.innerText = reportObj.priority || '-';
        var mDescription = document.getElementById('mDescription');
        if (mDescription) {
            if (reportObj.description) mDescription.innerHTML = reportObj.description;
            else mDescription.innerText = '-';
        }

        var mFilesWrapper = document.getElementById('mFilesWrapper');
        var mFiles = document.getElementById('mFiles');
        if (mFilesWrapper && mFiles) {
            mFiles.innerHTML = '';
            var filesArr = Array.isArray(reportObj.files) ? reportObj.files : [];
            if (filesArr.length > 0) {
                var parts = [];
                for (var fi = 0; fi < filesArr.length; fi++) {
                    var fobj = filesArr[fi];
                    if (!fobj) continue;
                    var furl = fobj.url || '#';
                    var fname = fobj.name || 'Attachment';
                    var ftype = String(fobj.type || '').toLowerCase();
                    var ficon = 'far fa-file';
                    if (ftype.indexOf('pdf') !== -1) {
                        ficon = 'far fa-file-pdf';
                    } else if (ftype.indexOf('zip') !== -1 || ftype.indexOf('rar') !== -1 || ftype.indexOf('7z') !== -1) {
                        ficon = 'far fa-file-archive';
                    } else if (ftype.indexOf('image/') === 0) {
                        ficon = 'far fa-file-image';
                    }
                    parts.push(
                        '<a href="' + escapeAttr(furl) + '" class="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1" target="_blank" rel="noopener" data-bs-toggle="tooltip" title="' + escapeAttr(fname) + '">' +
                            '<i class="' + ficon + '"></i>' +
                            '<span class="small text-truncate" style="max-width:150px;">' + escapeAttr(fname) + '</span>' +
                        '</a>'
                    );
                }
                if (parts.length) {
                    mFiles.innerHTML = parts.join('');
                    mFilesWrapper.style.display = '';
                } else {
                    mFilesWrapper.style.display = 'none';
                }
            } else {
                mFilesWrapper.style.display = 'none';
            }
        }

        pendingFeedbackFiles = [];
        var feedbackEditor = document.getElementById('feedbackEditor');
        if (feedbackEditor) feedbackEditor.innerHTML = '';
        var feedbackFileList = document.getElementById('feedbackFileList');
        if (feedbackFileList) feedbackFileList.innerText = '';

        setModalMode(mode);
        detailModal.show();
        var tooltipEls = [].slice.call(document.querySelectorAll('#detailModal [data-bs-toggle="tooltip"]'));
        tooltipEls.forEach(function (el) {
            bootstrap.Tooltip.getOrCreateInstance(el);
        });
    }

    var allReports = [];
    var currentReports = [];
    var currentSortKey = 'date';
    var currentSortDir = 'desc';

    var currentQuestFilter = 'side';
    var visibleCount = 20;
    var pageSize = 20;
    var bulkMode = null;
    var selectedTaskIds = {};

    function updateCountBadge(total) {
        var badge = document.querySelector('.count-badge');
        if (!badge) return;
        var n = typeof total === 'number' ? total : allReports.length;
        badge.textContent = String(n);
    }

    function parseDateValue(s) {
        var parts = String(s || '').split('-');
        if (parts.length !== 3) return null;
        var y = parseInt(parts[0], 10);
        var m = parseInt(parts[1], 10) - 1;
        var d = parseInt(parts[2], 10);
        var dt = new Date(y, m, d);
        if (isNaN(dt.getTime())) return null;
        return dt;
    }

    function escapeAttr(s) {
        return String(s || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function escapeJs(s) {
        return String(s || '').replace(/'/g, "\\\\'");
    }

    function isWithinPeriod(dateStr, period) {
        if (!period || period === 'all') return true;
        var dt = parseDateValue(dateStr);
        if (!dt) return true;
        var now = new Date();
        var diffMs = now.getTime() - dt.getTime();
        var dayMs = 24 * 60 * 60 * 1000;
        var days = diffMs / dayMs;
        if (period === 'daily') return days <= 1;
        if (period === 'weekly') return days <= 7;
        if (period === 'monthly') return days <= 30;
        if (period === '3month') return days <= 90;
        if (period === '6month') return days <= 180;
        if (period === 'yearly') return days <= 365;
        return true;
    }

    function getYesterdayString() {
        var d = new Date();
        d.setDate(d.getDate() - 1);
        var mm = String(d.getMonth() + 1).padStart(2, '0');
        var dd = String(d.getDate()).padStart(2, '0');
        return d.getFullYear() + '-' + mm + '-' + dd;
    }

    function updateStats() {
        var y = getYesterdayString();
        var requested = 0;
        var approved = 0;
        var rejected = 0;
        var pending = 0;
        for (var i = 0; i < allReports.length; i++) {
            var r = allReports[i];
            if (currentQuestFilter === 'side' && r.questType !== 'Side Quest') continue;
            if (currentQuestFilter === 'main' && r.questType !== 'Main Quest') continue;
            if (currentQuestFilter === 'project' && r.questType !== 'Project Quest') continue;
            if (r.date !== y) continue;
            requested++;
            var st = r.status || 'pending';
            if (st === 'approved') {
                approved++;
            } else if (st === 'rejected') {
                rejected++;
            }
            if (st !== 'approved' && st !== 'rejected') {
                var n = typeof r.notifyCount === 'number' ? r.notifyCount : (r.notifyTo && r.notifyTo.length ? r.notifyTo.length : 0);
                if (n > 1) {
                    pending++;
                }
            }
        }
        var elReq = document.getElementById('statRequestedValue');
        var elApp = document.getElementById('statApprovedValue');
        var elRej = document.getElementById('statRejectedValue');
        var elPen = document.getElementById('statPendingValue');
        if (elReq) elReq.innerText = String(requested);
        if (elApp) elApp.innerText = String(approved);
        if (elRej) elRej.innerText = String(rejected);
        if (elPen) elPen.innerText = String(pending);
        var diffs = document.querySelectorAll('.stat-diff');
        Array.prototype.slice.call(diffs).forEach(function (d) {
            d.innerText = 'Kemarin';
        });
        var totalForBadge = 0;
        for (var j = 0; j < allReports.length; j++) {
            var rr = allReports[j];
            if (currentQuestFilter === 'side' && rr.questType !== 'Side Quest') continue;
            if (currentQuestFilter === 'main' && rr.questType !== 'Main Quest') continue;
            if (currentQuestFilter === 'project' && rr.questType !== 'Project Quest') continue;
            totalForBadge++;
        }
        updateCountBadge(totalForBadge);
    }

    function openReportDetail(id) {
        var found = null;
        for (var i = 0; i < allReports.length; i++) {
            if (allReports[i].id === id) {
                found = allReports[i];
                break;
            }
        }
        if (!found) return;
        openModalForReport(found, 'view');
    }

    function updateActiveReportModalUsers() {
        if (!activeModalReportId) return;
        var modalEl = document.getElementById('detailModal');
        if (!modalEl || !modalEl.classList.contains('show')) return;

        var found = null;
        if (typeof allReports !== 'undefined' && Array.isArray(allReports)) {
            for (var i = 0; i < allReports.length; i++) {
                if (allReports[i].id === activeModalReportId) {
                    found = allReports[i];
                    break;
                }
            }
        }
        if (!found) return;

        var mUser = document.getElementById('mUser');
        if (mUser) {
            var ids = Array.isArray(found.assignees) ? found.assignees.filter(Boolean) : [];
            if (ids.length === 0) {
                mUser.innerText = '-';
            } else if (ids.length === 1) {
                mUser.innerText = getUserDisplay(ids[0]).name;
            } else {
                var names = [];
                for (var i = 0; i < ids.length; i++) names.push(getUserDisplay(ids[i]).name);
                mUser.innerText = names.join(', ');
            }
        }

        var mAssign = document.getElementById('mAssignAvatars');
        if (mAssign) mAssign.innerHTML = renderAvatarPile(found.assignees, 6);

        var mNotify = document.getElementById('mNotifyAvatars');
        if (mNotify) mNotify.innerHTML = renderAvatarPile(found.notifyTo, 6);

        var tooltipEls = [].slice.call(document.querySelectorAll('#detailModal [data-bs-toggle="tooltip"]'));
        tooltipEls.forEach(function (el) {
            bootstrap.Tooltip.getOrCreateInstance(el);
        });
    }

    function renderReports() {
        var tbody = document.getElementById('reportTableBody');
        if (!tbody) return;
        var searchInput = document.getElementById('reportSearchInput');
        var periodSelect = document.getElementById('reportPeriodSelect');
        var statusSelect = document.getElementById('reportStatusSelect');
        var pageSizeSelect = document.getElementById('reportPageSizeSelect');
        var q = searchInput ? searchInput.value.toLowerCase().trim() : '';
        var period = periodSelect ? periodSelect.value : 'all';
        var statusFilter = statusSelect ? statusSelect.value : 'all';
        var ps = pageSizeSelect ? parseInt(pageSizeSelect.value, 10) : pageSize;
        if (!isNaN(ps) && ps > 0) pageSize = ps;
        var filtered = [];
        for (var i = 0; i < allReports.length; i++) {
            var r = allReports[i];
            if (currentQuestFilter === 'side' && r.questType !== 'Side Quest') continue;
            if (currentQuestFilter === 'main' && r.questType !== 'Main Quest') continue;
            if (currentQuestFilter === 'project' && r.questType !== 'Project Quest') continue;
            var text = ((r.task || '') + ' ' + (r.reportPreview || '')).toLowerCase();
            if (q && text.indexOf(q) === -1) continue;
            if (!isWithinPeriod(r.date, period)) continue;
            var st = r.status || 'pending';
            if (statusFilter !== 'all' && st !== statusFilter) continue;
            filtered.push(r);
        }
        filtered.sort(function (a, b) {
            var dir = currentSortDir === 'asc' ? 1 : -1;
            var ka = a[currentSortKey];
            var kb = b[currentSortKey];
            if (currentSortKey === 'date') {
                var da = parseDateValue(ka);
                var db = parseDateValue(kb);
                var ta = da ? da.getTime() : 0;
                var tb = db ? db.getTime() : 0;
                if (ta < tb) return -1 * dir;
                if (ta > tb) return 1 * dir;
                return 0;
            }
            ka = String(ka || '').toLowerCase();
            kb = String(kb || '').toLowerCase();
            if (ka < kb) return -1 * dir;
            if (ka > kb) return 1 * dir;
            return 0;
        });
        currentReports = filtered;
        tbody.innerHTML = '';
        var visible = filtered.slice(0, Math.min(filtered.length, visibleCount));
        for (var j = 0; j < visible.length; j++) {
            var r2 = visible[j];
            var st2 = r2.status || 'pending';
            var statusLabel = 'Pending';
            var statusClass = 'text-muted small';
            if (st2 === 'approved') {
                statusLabel = 'Approved';
                statusClass = 'text-success small fw-semibold';
            } else if (st2 === 'rejected') {
                statusLabel = 'Rejected';
                statusClass = 'text-danger small fw-semibold';
            }
            var row = document.createElement('tr');
            row.setAttribute('data-report-id', r2.id);
            var teamHtml = renderAssigneesCell(r2.assignees || []);
            teamHtml = '<div class="d-flex align-items-center">' + teamHtml + '</div>';
            var selectCellHtml = '<td class="col-select text-center js-bulk-only" style="display:none;"></td>';
            if (bulkMode) {
                var checked = selectedTaskIds[r2.id] ? ' checked' : '';
                selectCellHtml =
                    '<td class="col-select text-center js-bulk-only">' +
                        '<input type="checkbox" class="form-check-input js-bulk-checkbox"' + checked + ' style="width:18px;height:18px;">' +
                    '</td>';
            }
            var filesHtml = '<span class="text-muted">-</span>';
            if (Array.isArray(r2.files) && r2.files.length > 0) {
                var filesIcons = [];
                for (var fi = 0; fi < r2.files.length; fi++) {
                    var fobj = r2.files[fi];
                    if (!fobj) continue;
                    var furl = fobj.url || '#';
                    var fname = fobj.name || 'Attachment';
                    var ftype = String(fobj.type || '').toLowerCase();
                    var ficon = 'far fa-file';
                    if (ftype.indexOf('pdf') !== -1) {
                        ficon = 'far fa-file-pdf';
                    } else if (ftype.indexOf('zip') !== -1 || ftype.indexOf('rar') !== -1 || ftype.indexOf('7z') !== -1) {
                        ficon = 'far fa-file-archive';
                    } else if (ftype.indexOf('image/') === 0) {
                        ficon = 'far fa-file-image';
                    }
                    filesIcons.push(
                        '<a href="' + escapeAttr(furl) + '" class="text-primary text-decoration-none me-1" target="_blank" rel="noopener" data-bs-toggle="tooltip" title="' + escapeAttr(fname) + '">' +
                            '<i class="' + ficon + '"></i>' +
                        '</a>'
                    );
                }
                if (filesIcons.length) {
                    filesHtml = filesIcons.join('');
                }
            } else if (r2.fileName) {
                filesHtml = '<a href="' + escapeAttr(r2.fileUrl || '#') + '" class="text-primary text-decoration-none small text-truncate-custom" data-bs-toggle="tooltip" title="' + escapeAttr(r2.fileTitle || '') + '">' +
                    '<i class="' + r2.fileIconClass + ' me-1"></i> ' + r2.fileName +
                '</a>';
            }
            row.innerHTML =
                selectCellHtml +
                '<td class="px-4">' +
                    teamHtml +
                '</td>' +
                '<td><span class="text-muted small">' + r2.date + '</span></td>' +
                '<td><span class="fw-medium text-truncate-custom" data-bs-toggle="tooltip" title="' + escapeAttr(r2.task) + '">' + r2.taskShort + '</span></td>' +
                '<td>' +
                    '<div class="rich-text-preview text-truncate-custom" data-bs-toggle="tooltip" title="' + escapeAttr(r2.reportPreviewFull) + '">' +
                        r2.reportPreview +
                    '</div>' +
                '</td>' +
                '<td>' + filesHtml + '</td>' +
                '<td>' +
                    '<div class="d-flex flex-column align-items-center gap-1">' +
                        '<div class="' + statusClass + '">' + statusLabel + '</div>' +
                        '<div class="d-flex justify-content-center gap-1">' +
                            '<button type="button" class="btn btn-dlg-red shadow-none btn-sm px-2 rounded-2 js-reject-report"><i class="fas fa-times"></i></button>' +
                            '<button type="button" class="btn btn-dlg-blue btn-sm px-2 rounded-2 js-approve-report shadow-none">' + (st2 === 'approved' ? 'Approved' : 'Approve') + '</button>' +
                        '</div>' +
                    '</div>' +
                '</td>';
            (function (id) {
                var cb = row.querySelector('.js-bulk-checkbox');
                if (cb) {
                    cb.addEventListener('click', function (e) {
                        e.stopPropagation();
                        selectedTaskIds[id] = cb.checked;
                        syncBulkActionButton();
                    });
                }
                var rejectBtn = row.querySelector('.js-reject-report');
                if (rejectBtn) {
                    rejectBtn.addEventListener('click', async function (e) {
                        e.stopPropagation();
                        await rejectReport(id, true);
                    });
                }
                var approveBtn = row.querySelector('.js-approve-report');
                if (approveBtn) {
                    approveBtn.addEventListener('click', async function (e) {
                        e.stopPropagation();
                        await approveReport(id);
                    });
                }
            })(r2.id);
            row.addEventListener('click', (function (id) {
                return function () {
                    openReportDetail(id);
                };
            })(r2.id));
            tbody.appendChild(row);
        }
        var userTextEls = tbody.querySelectorAll('[data-user-text]');
        for (var k = 0; k < userTextEls.length; k++) {
            var el = userTextEls[k];
            el.textContent = el.getAttribute('data-user-text') || '';
        }
        var tooltipTriggerList2 = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList2.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    function setReportStatusInternal(id, status) {
        for (var i = 0; i < allReports.length; i++) {
            if (allReports[i].id === id) {
                allReports[i].status = status;
                break;
            }
        }
    }

    async function approveReport(id) {
        setReportStatusInternal(id, 'approved');
        renderReports();
        updateStats();
        try {
            await persistApprovalStatus(id, 'approved', '');
        } catch (e) {
            console.error('Failed to approve report:', e);
            alert('Failed to approve report: ' + (e.message || 'Unknown error'));
            // Revert status on error
            setReportStatusInternal(id, 'pending');
            renderReports();
            updateStats();
        }
    }

    async function rejectReport(id, openFeedback) {
        setReportStatusInternal(id, 'rejected');
        renderReports();
        updateStats();
        try {
            await persistApprovalStatus(id, 'rejected', '');
            if (openFeedback) {
                var found = null;
                for (var i = 0; i < allReports.length; i++) {
                    if (allReports[i].id === id) {
                        found = allReports[i];
                        break;
                    }
                }
                if (found) openModalForReport(found, 'feedback');
            }
        } catch (e) {
            console.error('Failed to reject report:', e);
            alert('Failed to reject report: ' + (e.message || 'Unknown error'));
            // Revert status on error
            setReportStatusInternal(id, 'pending');
            renderReports();
            updateStats();
        }
    }

    async function approveAllReports() {
        var errors = [];
        for (var i = 0; i < currentReports.length; i++) {
            currentReports[i].status = 'approved';
            try {
                await persistApprovalStatus(currentReports[i].id, 'approved', '');
            } catch (e) {
                console.error('Failed to approve report ' + currentReports[i].id + ':', e);
                errors.push('Report ' + currentReports[i].id + ': ' + (e.message || 'Unknown error'));
                // Revert status on error
                currentReports[i].status = 'pending';
            }
        }
        if (errors.length > 0) {
            alert('Failed to approve some reports:\\n' + errors.join('\\n'));
        }
        renderReports();
        updateStats();
    }

    var searchInputEl = document.getElementById('reportSearchInput');
    if (searchInputEl) {
        searchInputEl.addEventListener('input', function () {
            visibleCount = pageSize;
            renderReports();
        });
    }
    var periodSelectEl = document.getElementById('reportPeriodSelect');
    if (periodSelectEl) {
        periodSelectEl.addEventListener('change', function () {
            visibleCount = pageSize;
            renderReports();
        });
    }
    var statusSelectEl = document.getElementById('reportStatusSelect');
    if (statusSelectEl) {
        statusSelectEl.addEventListener('change', function () {
            visibleCount = pageSize;
            renderReports();
        });
    }

    var approveTaskBtn = document.getElementById('approveTaskButton');
    if (approveTaskBtn) {
        approveTaskBtn.addEventListener('click', async function () {
            if (!activeModalReportId) return;
            await approveReport(activeModalReportId);
            detailModal.hide();
        });
    }
    var pageSizeSelectEl = document.getElementById('reportPageSizeSelect');
    if (pageSizeSelectEl) {
        pageSizeSelectEl.addEventListener('change', function () {
            var ps = parseInt(pageSizeSelectEl.value, 10);
            if (!isNaN(ps) && ps > 0) pageSize = ps;
            visibleCount = pageSize;
            renderReports();
        });
    }

    function syncBulkActionButton() {
        var btn = document.getElementById('reportBulkActionButton');
        if (!btn) return;
        var selected = Object.keys(selectedTaskIds).filter(function (k) { return !!selectedTaskIds[k]; });
        var bulkCols = document.querySelectorAll('.js-bulk-only');
        for (var i = 0; i < bulkCols.length; i++) {
            bulkCols[i].style.display = bulkMode ? '' : 'none';
        }
        if (!bulkMode) {
            btn.className = 'btn btn-dlg-green px-3 py-2 rounded-3';
            btn.innerHTML = '<i class="fas fa-check-double me-1"></i> Approve all';
            btn.disabled = false;
            return;
        }
        var label = bulkMode === 'delete' ? 'Delete All' : 'Archive All';
        var icon = bulkMode === 'delete' ? 'fas fa-trash' : 'fas fa-box-archive';
        btn.innerHTML =
            '<div class="d-flex align-items-center gap-2">' +
                '<button type="button" class="btn btn-outline-secondary btn-sm px-2 py-1" id="reportBulkExitButton">Exit</button>' +
                '<span><i class="' + icon + ' me-1"></i> ' + label + '</span>' +
            '</div>';
        btn.disabled = selected.length === 0;
        if (bulkMode === 'delete') {
            btn.className = 'btn btn-danger px-3 py-2 rounded-3 shadow-sm';
        } else {
            btn.className = 'btn btn-warning px-3 py-2 rounded-3 shadow-sm';
        }
    }

    var bulkBtn = document.getElementById('reportBulkActionButton');
    if (bulkBtn) {
        bulkBtn.style.display = '';
        bulkBtn.addEventListener('click', async function () {
            if (!bulkMode) {
                await approveAllReports();
                return;
            }
            var selected = Object.keys(selectedTaskIds).filter(function (k) { return !!selectedTaskIds[k]; });
            if (selected.length === 0) return;
            if (bulkMode === 'delete') {
                bulkDeleteTasks(selected);
            } else {
                bulkArchiveTasks(selected);
            }
        });
        syncBulkActionButton();
        document.addEventListener('click', function (e) {
            var exitBtn = document.getElementById('reportBulkExitButton');
            if (exitBtn && e.target === exitBtn) {
                bulkMode = null;
                selectedTaskIds = {};
                visibleCount = pageSize;
                syncBulkActionButton();
                renderReports();
            }
        });
    }

    var bulkMenu = document.getElementById('reportBulkMenuButton');
    if (bulkMenu) {
        bulkMenu.addEventListener('click', function () {
            var menuItems = document.querySelectorAll('[data-bulk-action]');
            Array.prototype.slice.call(menuItems).forEach(function (el) {
                el.addEventListener('click', function () {
                    var action = el.getAttribute('data-bulk-action');
                    bulkMode = action === 'delete' ? 'delete' : 'archive';
                    selectedTaskIds = {};
                    visibleCount = pageSize;
                    syncBulkActionButton();
                    renderReports();
                }, { once: true });
            });
        });
    }

    var topArchiveBtn = document.getElementById('reportTopArchiveButton');
    if (topArchiveBtn) {
        topArchiveBtn.addEventListener('click', function () {
            bulkMode = 'archive';
            selectedTaskIds = {};
            visibleCount = pageSize;
            syncBulkActionButton();
            renderReports();
        });
    }
    var topDeleteBtn = document.getElementById('reportTopDeleteButton');
    if (topDeleteBtn) {
        topDeleteBtn.addEventListener('click', function () {
            bulkMode = 'delete';
            selectedTaskIds = {};
            visibleCount = pageSize;
            syncBulkActionButton();
            renderReports();
        });
    }

    function setQuestFilter(next) {
        currentQuestFilter = next;
        visibleCount = pageSize;
        var titleEl = document.querySelector('h4.fw-bold');
        if (titleEl) {
            if (next === 'side') titleEl.innerText = 'Report Side Quest';
            else if (next === 'main') titleEl.innerText = 'Report Main Quest';
            else titleEl.innerText = 'Report Project Quest';
        }

        // Update active tab class
        ['reportTabSide', 'reportTabMain', 'reportTabProject'].forEach(function(id) {
            var el = document.getElementById(id);
            if (el) {
                var isMatch = (id === 'reportTabSide' && next === 'side') || 
                             (id === 'reportTabMain' && next === 'main') || 
                             (id === 'reportTabProject' && next === 'project');
                if (isMatch) el.classList.add('active');
                else el.classList.remove('active');
            }
        });

        updateStats();
        renderReports();
        syncBulkActionButton();
    }

    var tabSide = document.getElementById('reportTabSide');
    if (tabSide) tabSide.addEventListener('click', function () { setQuestFilter('side'); });
    var tabMain = document.getElementById('reportTabMain');
    if (tabMain) tabMain.addEventListener('click', function () { setQuestFilter('main'); });
    var tabProject = document.getElementById('reportTabProject');
    if (tabProject) tabProject.addEventListener('click', function () { setQuestFilter('project'); });

    var tableScroll = document.querySelector('.table-responsive');
    if (tableScroll) {
        tableScroll.addEventListener('scroll', function () {
            var nearBottom = tableScroll.scrollTop + tableScroll.clientHeight >= tableScroll.scrollHeight - 40;
            if (nearBottom) {
                if (visibleCount < currentReports.length) {
                    visibleCount += pageSize;
                    renderReports();
                }
            }
        });
    }

    function stripHtml(s) {
        var div = document.createElement('div');
        div.innerHTML = s || '';
        return (div.textContent || div.innerText || '').trim();
    }

    function attachFeedbackToolbarHandlers() {
        var feedbackEditor = document.getElementById('feedbackEditor');
        if (!feedbackEditor) return;
        var cmdButtons = document.querySelectorAll('[data-editor-cmd]');
        Array.prototype.slice.call(cmdButtons).forEach(function (btn) {
            btn.addEventListener('click', function () {
                var cmd = btn.getAttribute('data-editor-cmd');
                if (!cmd) return;
                feedbackEditor.focus();
                try { document.execCommand(cmd, false, null); } catch (e) {}
            });
        });
        var linkBtn = document.getElementById('feedbackAddLinkBtn');
        if (linkBtn) {
            linkBtn.addEventListener('click', function () {
                var url = prompt('Add link (URL):');
                if (!url) return;
                feedbackEditor.focus();
                try { document.execCommand('createLink', false, url); } catch (e) {}
            });
        }
        var filesBtn = document.getElementById('feedbackAddFilesBtn');
        var fileInput = document.getElementById('feedbackFileInput');
        if (filesBtn && fileInput) {
            filesBtn.addEventListener('click', function () { fileInput.click(); });
            fileInput.addEventListener('change', function () {
                pendingFeedbackFiles = Array.prototype.slice.call(fileInput.files || []);
                var list = document.getElementById('feedbackFileList');
                if (list) {
                    if (!pendingFeedbackFiles.length) list.innerText = '';
                    else list.innerText = pendingFeedbackFiles.map(function (f) { return f.name; }).join(', ');
                }
            });
        }
    }

    attachFeedbackToolbarHandlers();

    function findReportById(id) {
        for (var i = 0; i < allReports.length; i++) {
            if (allReports[i].id === id) return allReports[i];
        }
        return null;
    }

    function toParentFirestoreValue(value, parentWin) {
        if (!parentWin) return value;
        if (value === null || value === undefined) return value;
        if (typeof value !== 'object') return value;
        if (Array.isArray(value)) {
            var arr = new parentWin.Array();
            for (var i = 0; i < value.length; i++) {
                arr.push(toParentFirestoreValue(value[i], parentWin));
            }
            return arr;
        }
        var proto = Object.getPrototypeOf(value);
        if (proto === Object.prototype || proto === null) {
            var obj = new parentWin.Object();
            var keys = Object.keys(value);
            for (var k = 0; k < keys.length; k++) {
                var key = keys[k];
                obj[key] = toParentFirestoreValue(value[key], parentWin);
            }
            return obj;
        }
        return value;
    }

    async function persistApprovalStatus(id, status, feedbackHtml) {
        var parentWin = window.parent;
        var r = findReportById(id);
        if (!r || !parentWin || !parentWin.db || !parentWin.updateDoc || !parentWin.doc) return;
        
        try {
            var payload = {
                approval_status: status,
                approvalStatus: status,
                approvalUpdatedAt: parentWin.serverTimestamp ? parentWin.serverTimestamp() : new Date().toISOString()
            };
            
            if (feedbackHtml) {
                payload.feedback = feedbackHtml;
                payload.feedback_at = parentWin.serverTimestamp ? parentWin.serverTimestamp() : new Date().toISOString();
                payload.feedback_by = parentWin.auth && parentWin.auth.currentUser ? parentWin.auth.currentUser.uid : '';
            }

            var plainPayload = toParentFirestoreValue(payload, parentWin);
            if (r.reportSource === 'root' && r.reportDocId) {
                await parentWin.updateDoc(parentWin.doc(parentWin.db, 'quest_reports', r.reportDocId), plainPayload);
            } else if (r.reportSource === 'sub' && r.reportDocId) {
                await parentWin.updateDoc(parentWin.doc(parentWin.db, 'tasks', id, 'reports', r.reportDocId), plainPayload);
            }
        } catch (e) {
            console.error('Failed to persist approval status', e);
            throw e; // Re-throw to handle upstream
        }
    }

    async function uploadFeedbackFiles(taskId, files) {
        var parentWin = window.parent;
        if (!files || !files.length) return [];
        if (!parentWin || !parentWin.storage || !parentWin.ref || !parentWin.uploadBytes || !parentWin.getDownloadURL) return [];
        var out = [];
        for (var i = 0; i < files.length; i++) {
            var f = files[i];
            try {
                var path = 'report_feedback/' + taskId + '/' + Date.now() + '_' + f.name;
                var sRef = parentWin.ref(parentWin.storage, path);
                await parentWin.uploadBytes(sRef, f);
                var url = await parentWin.getDownloadURL(sRef);
                out.push({ name: f.name, url: url, type: f.type || '' });
            } catch (e) {}
        }
        return out;
    }

    var submitFeedbackBtn = document.getElementById('submitFeedbackButton');
    if (submitFeedbackBtn) {
        submitFeedbackBtn.addEventListener('click', async function () {
            var id = activeModalReportId;
            if (!id) return;
            var editor = document.getElementById('feedbackEditor');
            var html = editor ? editor.innerHTML : '';
            if (!stripHtml(html)) return;
            var attachments = await uploadFeedbackFiles(id, pendingFeedbackFiles);
            var parentWin = window.parent;
            var r = findReportById(id);
            if (r && parentWin && parentWin.updateDoc && parentWin.doc && parentWin.db) {
                try {
                    var payload = {
                        feedback: html,
                        feedback_files: attachments,
                        feedbackFiles: attachments
                    };
                    payload = toParentFirestoreValue(payload, parentWin);
                    if (r.reportSource === 'root' && r.reportDocId) {
                        await parentWin.updateDoc(parentWin.doc(parentWin.db, 'quest_reports', r.reportDocId), payload);
                    } else if (r.reportSource === 'sub' && r.reportDocId) {
                        await parentWin.updateDoc(parentWin.doc(parentWin.db, 'tasks', id, 'reports', r.reportDocId), payload);
                    }
                } catch (e) {
                    console.error('Failed to submit feedback', e);
                }
            }
            await persistApprovalStatus(id, 'rejected', html);
            setReportStatusInternal(id, 'rejected');
            renderReports();
            updateStats();
            detailModal.hide();
        });
    }

    function getSelectedTaskIds() {
        return Object.keys(selectedTaskIds).filter(function (k) { return !!selectedTaskIds[k]; });
    }

    async function bulkArchiveTasks(taskIds) {
        var parentWin = window.parent;
        if (!parentWin || !parentWin.updateDoc || !parentWin.doc || !parentWin.db || !parentWin.addDoc || !parentWin.collection) return;
        try {
            for (var i = 0; i < taskIds.length; i++) {
                var taskId = taskIds[i];
                var taskData = {};
                if (parentWin.getDoc) {
                    try {
                        var tSnap = await parentWin.getDoc(parentWin.doc(parentWin.db, 'tasks', taskId));
                        if (tSnap && typeof tSnap.exists === 'function' ? tSnap.exists() : tSnap && tSnap.exists) {
                            taskData = tSnap.data() || {};
                        }
                    } catch (eGet) {}
                }
                var archiveEntry = {
                    taskId: taskId,
                    task: taskData,
                    archivedAt: parentWin.serverTimestamp ? parentWin.serverTimestamp() : new Date().toISOString(),
                    archivedBy: parentWin.auth && parentWin.auth.currentUser ? parentWin.auth.currentUser.uid : ''
                };
                archiveEntry = toParentFirestoreValue(archiveEntry, parentWin);
                try {
                    await parentWin.addDoc(parentWin.collection(parentWin.db, 'Archives'), archiveEntry);
                } catch (eAdd) {}
                var payload = {
                    archived: true,
                    archived_at: parentWin.serverTimestamp ? parentWin.serverTimestamp() : new Date().toISOString(),
                    archived_by: parentWin.auth && parentWin.auth.currentUser ? parentWin.auth.currentUser.uid : ''
                };
                payload = toParentFirestoreValue(payload, parentWin);
                await parentWin.updateDoc(parentWin.doc(parentWin.db, 'tasks', taskId), payload);
            }
        } catch (e) {
            console.error('Failed to archive tasks', e);
        }
        bulkMode = null;
        selectedTaskIds = {};
        syncBulkActionButton();
        loadReportsFromTasks();
    }

    async function bulkDeleteTasks(taskIds) {
        var parentWin = window.parent;
        if (!parentWin || !parentWin.deleteDoc || !parentWin.doc || !parentWin.db || !parentWin.collection || !parentWin.getDocs || !parentWin.addDoc) return;
        try {
            var rootSnap = await parentWin.getDocs(parentWin.collection(parentWin.db, 'quest_reports'));
            var rootDocs = [];
            rootSnap.forEach(function (d) { rootDocs.push({ id: d.id, data: d.data() || {} }); });
            for (var i = 0; i < taskIds.length; i++) {
                var tId = taskIds[i];
                var tData = {};
                if (parentWin.getDoc) {
                    try {
                        var tSnap = await parentWin.getDoc(parentWin.doc(parentWin.db, 'tasks', tId));
                        if (tSnap && typeof tSnap.exists === 'function' ? tSnap.exists() : tSnap && tSnap.exists) {
                            tData = tSnap.data() || {};
                        }
                    } catch (eGet) {}
                }
                var trashEntry = {
                    taskId: tId,
                    task: tData,
                    deletedAt: parentWin.serverTimestamp ? parentWin.serverTimestamp() : new Date().toISOString(),
                    deletedBy: parentWin.auth && parentWin.auth.currentUser ? parentWin.auth.currentUser.uid : ''
                };
                trashEntry = toParentFirestoreValue(trashEntry, parentWin);
                try {
                    await parentWin.addDoc(parentWin.collection(parentWin.db, 'Trash'), trashEntry);
                } catch (eAdd) {}
                try {
                    var repSnap = await parentWin.getDocs(parentWin.collection(parentWin.db, 'tasks', tId, 'reports'));
                    var deletes = [];
                    repSnap.forEach(function (d) { deletes.push(d.id); });
                    for (var j = 0; j < deletes.length; j++) {
                        await parentWin.deleteDoc(parentWin.doc(parentWin.db, 'tasks', tId, 'reports', deletes[j]));
                    }
                } catch (eSub) {}
                for (var k = 0; k < rootDocs.length; k++) {
                    var d2 = rootDocs[k];
                    var tid = d2.data.taskId || d2.data.task_id || '';
                    if (tid === tId) {
                        await parentWin.deleteDoc(parentWin.doc(parentWin.db, 'quest_reports', d2.id));
                    }
                }
                await parentWin.deleteDoc(parentWin.doc(parentWin.db, 'tasks', tId));
            }
        } catch (e) {
            console.error('Failed to delete tasks', e);
        }
        bulkMode = null;
        selectedTaskIds = {};
        syncBulkActionButton();
        loadReportsFromTasks();
    }
    function normalizeTimeValue(v) {
        if (!v) return '';
        if (v.toDate && typeof v.toDate === 'function') {
            var d = v.toDate();
            if (!isNaN(d.getTime())) return d.toISOString();
            return '';
        }
        if (typeof v === 'number') {
            var d2 = new Date(v);
            if (!isNaN(d2.getTime())) return d2.toISOString();
            return '';
        }
        return String(v);
    }
    function normalizeDateString(v, fallback) {
        var s = normalizeTimeValue(v);
        if (s) {
            if (s.length >= 10 && s.indexOf('T') >= 0) {
                return s.slice(0, 10);
            }
            if (s.length >= 10) {
                return s.slice(0, 10);
            }
        }
        return fallback || '';
    }
    async function loadReportsFromTasks(attempt) {
        var parentWin = window.parent;
        allReports = [];
        currentReports = [];
        if (!parentWin || !parentWin.db || !parentWin.collection || !parentWin.getDocs) {
            var nextAttempt = typeof attempt === 'number' ? attempt + 1 : 1;
            if (nextAttempt <= 30) {
                setTimeout(function () { loadReportsFromTasks(nextAttempt); }, 500);
            }
            updateStats();
            renderReports();
            return;
        }
        try {
            var tasksSnap = await parentWin.getDocs(parentWin.collection(parentWin.db, 'tasks'));
            var tasksById = {};
            var completeTaskIds = [];
            var taskQuestTypeById = {};
            tasksSnap.forEach(function (docSnap) {
                var data = docSnap.data() || {};
                tasksById[docSnap.id] = data;
                var archived = !!(data.archived || data.is_archived);
                if (archived) return;
                var statusRaw = '';
                if (typeof data.status === 'string') statusRaw = data.status;
                else if (data.status && typeof data.status === 'object') statusRaw = data.status.name || data.status.label || '';
                var normStatus = String(statusRaw || '').trim().toLowerCase().replace(/[\s_]/g, '');
                var isComplete = normStatus === 'complete' || normStatus === 'done';
                if (data.task_status) {
                    var tsRaw = '';
                    if (typeof data.task_status === 'string') {
                        tsRaw = data.task_status;
                    } else if (typeof data.task_status === 'object' && (data.task_status.name || data.task_status.label)) {
                        tsRaw = data.task_status.name || data.task_status.label || '';
                    }
                    var normTaskStatus = String(tsRaw || '').trim().toLowerCase().replace(/[\s_]/g, '');
                    if (normTaskStatus === 'complete' || normTaskStatus === 'done') {
                        isComplete = true;
                    }
                }

                // Always register the quest type so root-level reports can find their task
                var questType = 'Side Quest';
                if (data.project_id) questType = 'Project Quest';
                else if (data.recur) questType = 'Main Quest';
                taskQuestTypeById[docSnap.id] = questType;

                // Always fetch sub-collection reports for every task to be safe
                completeTaskIds.push(docSnap.id);
            });

            var latestByTaskId = {};
            var rootSnap = await parentWin.getDocs(parentWin.collection(parentWin.db, 'quest_reports'));
            rootSnap.forEach(function (repSnap) {
                var rdataRoot = repSnap.data() || {};
                var taskIdRoot = rdataRoot.taskId || rdataRoot.task_id || '';
                if (!taskIdRoot) return;
                if (!taskQuestTypeById[taskIdRoot]) return;
                var prevRoot = latestByTaskId[taskIdRoot];
                var prevTimeRoot = prevRoot ? normalizeTimeValue(prevRoot.data.submittedAt || prevRoot.data.createdAt || prevRoot.data.timestamp) : '';
                var currTimeRoot = normalizeTimeValue(rdataRoot.submittedAt || rdataRoot.createdAt || rdataRoot.timestamp);
                if (!prevRoot || currTimeRoot > prevTimeRoot) {
                    latestByTaskId[taskIdRoot] = { data: rdataRoot, source: 'root', docId: repSnap.id };
                }
            });

            async function fetchLatestSubReport(tId0) {
                try {
                    // Try to fetch latest report from root collection quest_reports first
                    // because we already have rootSnap loaded above. 
                    // But we already processed rootSnap into latestByTaskId before calling this function.
                    
                    // Now fetch from sub-collection tasks/{taskId}/reports
                    var repSnap0 = await parentWin.getDocs(parentWin.collection(parentWin.db, 'tasks', tId0, 'reports'));
                    if (!repSnap0.empty) {
                        console.log('Found ' + repSnap0.size + ' sub-collection reports for taskId:', tId0);
                    }
                    repSnap0.forEach(function (docRep) {
                        var rdata = docRep.data() || {};
                        var prev = latestByTaskId[tId0];
                        var prevTime = prev ? normalizeTimeValue(prev.data.submittedAt || prev.data.createdAt || prev.data.timestamp) : '';
                        var currTime = normalizeTimeValue(rdata.submittedAt || rdata.createdAt || rdata.timestamp);
                        
                        // Prioritize sub-collection reports, or newer reports
                        if (!prev || currTime >= prevTime || prev.source === 'root') {
                            latestByTaskId[tId0] = { data: rdata, source: 'sub', docId: docRep.id };
                        }
                    });
                } catch (eSub0) {}
            }

            var cursor0 = 0;
            var concurrency0 = 4;
            var workers0 = [];
            for (var w0 = 0; w0 < concurrency0; w0++) {
                workers0.push((async function () {
                    while (cursor0 < completeTaskIds.length) {
                        var idx0 = cursor0++;
                        var tId0 = completeTaskIds[idx0];
                        await fetchLatestSubReport(tId0);
                    }
                })());
            }
            await Promise.all(workers0);

            var reports = [];
            Object.keys(latestByTaskId).forEach(function (taskId) {
                var entry = latestByTaskId[taskId] || {};
                var rdata = entry.data || {};
                var data = tasksById[taskId] || {};
                var questType = taskQuestTypeById[taskId] || 'Side Quest';

                var notifyRaw = data.notify_to || data.notifyTo || [];
                var notifyIds = [];
                if (Array.isArray(notifyRaw)) {
                    notifyIds = notifyRaw.slice();
                } else if (notifyRaw) {
                    notifyIds = [notifyRaw];
                }

                var assignRaw = data.assign_to || data.assignTo || [];
                var assignIds = [];
                if (Array.isArray(assignRaw)) {
                    assignIds = assignRaw.slice();
                } else if (assignRaw) {
                    assignIds = [assignRaw];
                }

                var title = data.title || 'Untitled Task';
                var reportHtml = rdata.content || '';
                var tmpDiv = document.createElement('div');
                tmpDiv.innerHTML = reportHtml;
                var reportText = (tmpDiv.textContent || tmpDiv.innerText || '').trim();
                var previewMax = 140;
                var previewText = reportText;
                if (previewText.length > previewMax) {
                    previewText = previewText.substring(0, previewMax);
                    previewText = previewText.replace(/\s+\S*$/, '');
                    previewText += '...';
                }

                var submittedAt = rdata.submittedAt || rdata.createdAt || '';
                var dateStr = normalizeDateString(submittedAt, '');
                if (!dateStr) {
                    dateStr = data.due_date || data.dueDate || '';
                }

                var filesArr = Array.isArray(rdata.files) ? rdata.files : [];
                
                // Fallback for older report structures
                if (filesArr.length === 0) {
                    var legacyUrl = rdata.fileUrl || rdata.file_url || rdata.url || '';
                    var legacyName = rdata.fileName || rdata.file_name || rdata.name || 'Attachment';
                    if (legacyUrl && legacyUrl !== '#') {
                        filesArr.push({
                            url: legacyUrl,
                            name: legacyName,
                            type: rdata.fileType || rdata.type || ''
                        });
                    }
                }

                var fileName = '';
                var fileTitle = '';
                var fileUrl = '#';
                var fileIconClass = 'far fa-file';
                if (filesArr.length > 0) {
                    var f = filesArr[0];
                    fileName = f.name || 'Attachment';
                    fileTitle = f.name || '';
                    fileUrl = f.url || '#';
                    var ttype = String(f.type || '').toLowerCase();
                    if (ttype.indexOf('pdf') !== -1) {
                        fileIconClass = 'far fa-file-pdf';
                    } else if (ttype.indexOf('zip') !== -1 || ttype.indexOf('rar') !== -1 || ttype.indexOf('7z') !== -1) {
                        fileIconClass = 'far fa-file-archive';
                    } else if (ttype.indexOf('image/') === 0) {
                        fileIconClass = 'far fa-file-image';
                    }
                    if (filesArr.length > 1) {
                        fileName += ' (+' + String(filesArr.length - 1) + ')';
                    }
                }

                var appr = rdata.approval_status || rdata.approvalStatus || '';
                appr = String(appr || '').toLowerCase();
                var statusVal = appr === 'approved' || appr === 'rejected' ? appr : 'pending';

                reports.push({
                    id: taskId,
                    questType: questType,
                    date: dateStr,
                    task: title,
                    taskShort: title.length > 20 ? title.substring(0, 17) + '...' : title,
                    reportPreview: previewText,
                    reportPreviewFull: reportText,
                    reportFull: reportHtml,
                    fileName: fileName,
                    fileTitle: fileTitle,
                    fileUrl: fileUrl,
                    fileIconClass: fileIconClass,
                    files: filesArr,
                    status: statusVal,
                    notifyTo: notifyIds,
                    notifyCount: notifyIds.length,
                    assignees: assignIds,
                    departments: Array.isArray(data.departments) ? data.departments : [],
                    positions: Array.isArray(data.positions) ? data.positions : [],
                    startDate: data.start_date || data.startDate || '',
                    dueDate: data.due_date || data.dueDate || '',
                    points: typeof data.points === 'number' ? data.points : (data.points ? Number(data.points) || 0 : 0),
                    priority: data.priority || '',
                    description: data.description || '',
                    reportSource: entry.source || 'root',
                    reportDocId: entry.docId || ''
                });
            });

            allReports = reports;
            currentReports = reports.slice();
            visibleCount = pageSize;
            updateStats();
            renderReports();
        } catch (e) {
            console.error('Failed to load reports', e);
            updateStats();
            renderReports();
        }
    }
    var headerCells = document.querySelectorAll('table thead th[data-sort-key]');
    for (var h = 0; h < headerCells.length; h++) {
        (function (th) {
            th.addEventListener('click', function () {
                var key = th.getAttribute('data-sort-key');
                if (!key) return;
                if (currentSortKey === key) {
                    currentSortDir = currentSortDir === 'asc' ? 'desc' : 'asc';
                } else {
                    currentSortKey = key;
                    currentSortDir = 'asc';
                }
                renderReports();
            });
        })(headerCells[h]);
    }
    loadReportsFromTasks(0);
</script>
</body>
</html>`;
            if (frame) {
                frame.removeAttribute('src');
                frame.srcdoc = html;
            }
            if (modalEl && typeof bootstrap !== "undefined" && bootstrap.Modal) {
                const overlay = document.getElementById('questBoardOverlay');
                if (overlay) {
                    overlay.classList.add('show');
                }
                modalEl.addEventListener('hidden.bs.modal', () => {
                    const ov = document.getElementById('questBoardOverlay');
                    if (ov) {
                        ov.classList.remove('show');
                    }
                }, { once: true });
                const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
                modal.show();
            }
        });
    }
    const sideQuestCard = target.querySelectorAll('.smart-filters-grid .filter-card')[1];
    if (sideQuestCard) {
        sideQuestCard.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof window.closeReportBoardModal === 'function') {
                try { window.closeReportBoardModal(); } catch (err) {}
            } else {
                try {
                    var rbm1 = document.getElementById('reportBoardModal');
                    if (rbm1 && typeof bootstrap !== "undefined" && bootstrap.Modal) {
                        bootstrap.Modal.getOrCreateInstance(rbm1).hide();
                    }
                    var ov1 = document.getElementById('questBoardOverlay');
                    if (ov1) ov1.classList.remove('show');
                } catch (err3) {}
            }
            const modalEl = document.getElementById('questBoardModal');
            const frame = document.getElementById('questBoardFrame');
            window.closeQuestBoardModal = function () {
                const overlay = document.getElementById('questBoardOverlay');
                if (overlay) {
                    overlay.classList.remove('show');
                }
                if (modalEl && typeof bootstrap !== "undefined" && bootstrap.Modal) {
                    const instance = bootstrap.Modal.getOrCreateInstance(modalEl);
                    instance.hide();
                }
            };
            const html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Side Quest - Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <link rel="stylesheet" href="/assets/css/style.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        body { font-family: 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .btn-dlg-red {
            background: linear-gradient(to bottom, #e7181b 5%, #a31818 100%);
            box-shadow: 0px 5px 16px -6px rgba(114, 4, 207, 1);
            color: #fff;
            border: none;
            transition: 0.3s;
        }
        .btn-dlg-red:hover {
            background: linear-gradient(to bottom, #a31818 5%, #e7181b 100%);
            color: #fff;
            box-shadow: 0px 0px 4px 2px rgba(114, 4, 207, 0.75);
        }
        .btn-dlg-yellow {
            background: linear-gradient(to top, #f1ac15 22%, #fcf221 100%);
            box-shadow: 0px 5px 16px -6px rgba(114, 4, 207, 1);
            color: black;
            border: none;
            transition: 0.3s;
        }
        .btn-dlg-yellow:hover {
            background: linear-gradient(to top,#fcf221 22%, #f1ac15 100%);
            box-shadow: 0px 0px 4px 2px rgba(114, 4, 207, 0.75);
        }
        
        .rich-editor {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            background: #ffffff;
            transition: border-color 0.2s;
        }
        .rich-editor:focus-within {
            border-color: #94a3b8;
        }
        .rich-toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px 10px;
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
        }
        .rich-toolbar-left {
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .rich-btn {
            border: none;
            background: transparent;
            width: 32px;
            height: 32px;
            border-radius: 6px;
            color: #475569;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            cursor: pointer;
        }
        .rich-btn:hover {
            background: #f1f5f9;
            color: #0f172a;
        }
        .rich-btn.active {
            background: #e2e8f0;
            color: #2563eb;
        }
        .rich-editor-body {
            min-height: 140px;
            padding: 12px 16px;
            background: #ffffff;
            outline: none;
            font-size: 0.95rem;
            color: #334155;
            line-height: 1.6;
        }
        .rich-editor-body:empty:before {
            content: attr(data-placeholder);
            color: #94a3b8;
        }
        .rich-toolbar-right {
            display: flex;
            align-items: center;
        }
    </style>
</head>
<body class="min-h-screen p-6 md:p-12" style="background: #fff;">
    <div class="max-w-4xl mx-auto">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-extrabold tracking-tight">Side Quest</h1>
            <div class="flex items-center gap-3">
                <div class="relative inline-block">
                    <button id="sideQuestHeaderToggleButton" type="button"
                        class="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm"
                        onclick="toggleSideQuestHeaderMenu(event)">
                        <i data-lucide="more-vertical" class="w-4 h-4 text-gray-600"></i>
                    </button>
                    <div id="sideQuestHeaderMenu"
                        class="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-xl shadow-lg py-1 text-sm text-gray-700 hidden z-40">
                        <button type="button" class="w-full text-left px-3 py-1.5 hover:bg-gray-100"
                            onclick="sideQuestHeaderEdit()">
                            Edit
                        </button>
                        <button type="button" class="w-full text-left px-3 py-1.5 hover:bg-gray-100 text-red-600"
                            onclick="sideQuestHeaderDelete()">
                            Delete
                        </button>
                    </div>
                </div>
                <div class="relative inline-block">
                    <button class="btn-dlg-yellow rounded-full px-6 py-2.5 text-sm font-semibold shadow-sm"
                        onclick="toggleSideQuestDropdown(event)">
                        Add Side Quest
                    </button>
                </div>
                <button class="btn-dlg-red rounded-full px-5 py-2 text-sm font-semibold shadow-md"
                    onclick="if (window.parent && window.parent.closeQuestBoardModal) { window.parent.closeQuestBoardModal(); }">
                    Close
                </button>
            </div>
        </div>

        <div id="sideQuestCreateDropdown"
            class="mb-10 rounded-3xl border border-gray-200 bg-white shadow-sm p-6 md:p-8 hidden">
            <div class="mb-6">
                <input id="sideQuestNameInput" type="text" placeholder="Side Quest Name"
                    class="w-full text-2xl md:text-3xl font-semibold text-gray-900 border-none focus:ring-0 focus:outline-none placeholder-gray-400" />
            </div>
            <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div class="space-y-4 text-sm">
                    <div class="flex items-center gap-3">
                        <div class="font-medium text-gray-500 w-24">Department</div>
                        <div class="flex-1">
                            <div class="relative">
                                <button type="button"
                                    class="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-left text-gray-700"
                                    onclick="document.getElementById('sideQuestDepartmentDropdown').classList.toggle('hidden')">
                                    <span class="flex items-center gap-2">
                                        <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200">
                                            <span class="text-xs font-semibold text-gray-500">D</span>
                                        </span>
                                        <span id="sideQuestDepartmentButtonLabel" class="text-xs md:text-sm">Select departments...</span>
                                    </span>
                                    <span class="text-gray-400 text-xs md:text-sm">&#9662;</span>
                                </button>
                                <div id="sideQuestDepartmentDropdown"
                                    class="absolute top-full left-0 right-0 mt-2 rounded-xl border border-gray-200 bg-white shadow-lg p-3 hidden max-h-60 overflow-y-auto text-xs md:text-sm z-20">
                                    <span class="text-gray-400 text-xs">Loading departments...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-3">
                        <div class="font-medium text-gray-500 w-24">Assign to</div>
                        <div class="flex-1">
                            <div class="relative">
                                <button type="button"
                                    class="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-left text-gray-700"
                                    onclick="toggleSideQuestUserDropdown('assign')">
                                    <span class="flex items-center gap-2">
                                        <span id="sideQuestAssignAvatars" class="flex -space-x-1"></span>
                                        <span id="sideQuestAssignButtonLabel" class="text-xs md:text-sm">Select user...</span>
                                    </span>
                                    <span class="text-gray-400 text-xs md:text-sm">&#9662;</span>
                                </button>
                                <div id="sideQuestAssignDropdown"
                                    class="absolute top-full left-0 mt-2 w-72 md:w-80 rounded-2xl bg-slate-900 text-white shadow-2xl p-3 hidden text-xs md:text-sm z-40">
                                    <div class="mb-3">
                                        <div class="relative">
                                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                                                &#128269;
                                            </span>
                                            <input id="sideQuestAssignSearch" type="text"
                                                class="w-full rounded-full bg-slate-800 text-xs md:text-sm text-white placeholder-slate-500 pl-8 pr-3 py-1.5 outline-none border border-slate-700 focus:border-sky-500 focus:ring-0"
                                                placeholder="Search..." />
                                        </div>
                                    </div>
                                    <div class="text-[10px] tracking-[0.18em] text-slate-400 font-semibold mb-2">
                                        PEOPLE
                                    </div>
                                    <div id="sideQuestAssignList" class="max-h-56 overflow-y-auto flex flex-col gap-1">
                                        <div class="text-slate-500 text-xs">Loading users...</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="font-medium text-gray-500 w-24">Dates</div>
                        <div class="flex-1 flex flex-wrap items-center gap-2">
                            <div class="flex items-center gap-2">
                                <span class="text-xs md:text-sm text-gray-500">Start</span>
                                <input id="sideQuestStartInput" type="date"
                                    onclick="if (this.showPicker) this.showPicker();"
                                    class="w-28 md:w-32 rounded-xl border border-gray-200 px-3 py-2 text-xs md:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-xs md:text-sm text-gray-500">Due</span>
                                <input id="sideQuestDueInput" type="date"
                                    onclick="if (this.showPicker) this.showPicker();"
                                    class="w-28 md:w-32 rounded-xl border border-gray-200 px-3 py-2 text-xs md:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div class="space-y-4 text-sm">
                    <div class="flex items-center gap-3">
                        <div class="font-medium text-gray-500 w-24">Positions</div>
                        <div class="flex-1">
                            <div class="relative">
                                <button type="button"
                                    class="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-left text-gray-700"
                                    onclick="document.getElementById('sideQuestPositionDropdown').classList.toggle('hidden')">
                                    <span id="sideQuestPositionButtonLabel" class="text-xs md:text-sm">Select positions...</span>
                                    <span class="text-gray-400 text-xs md:text-sm">&#9662;</span>
                                </button>
                                <div id="sideQuestPositionDropdown"
                                    class="absolute top-full left-0 right-0 mt-2 rounded-xl border border-gray-200 bg-white shadow-lg p-3 hidden max-h-60 overflow-y-auto text-xs md:text-sm z-20">
                                    <span class="text-gray-400 text-xs">Loading positions...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="font-medium text-gray-500 w-24">Notify to</div>
                        <div class="flex-1">
                            <div class="relative">
                                <button type="button"
                                    class="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-left text-gray-700"
                                    onclick="toggleSideQuestUserDropdown('notify')">
                                    <span class="flex items-center gap-2">
                                        <span id="sideQuestNotifyAvatars" class="flex -space-x-1"></span>
                                        <span id="sideQuestNotifyButtonLabel" class="text-xs md:text-sm">Select user...</span>
                                    </span>
                                    <span class="text-gray-400 text-xs md:text-sm">&#9662;</span>
                                </button>
                                <div id="sideQuestNotifyDropdown"
                                    class="absolute top-full left-0 mt-2 w-72 md:w-80 rounded-2xl bg-slate-900 text-white shadow-2xl p-3 hidden text-xs md:text-sm z-40">
                                    <div class="mb-3">
                                        <div class="relative">
                                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                                                &#128269;
                                            </span>
                                            <input id="sideQuestNotifySearch" type="text"
                                                class="w-full rounded-full bg-slate-800 text-xs md:text-sm text-white placeholder-slate-500 pl-8 pr-3 py-1.5 outline-none border border-slate-700 focus:border-sky-500 focus:ring-0"
                                                placeholder="Search..." />
                                        </div>
                                    </div>
                                    <div class="text-[10px] tracking-[0.18em] text-slate-400 font-semibold mb-2">
                                        PEOPLE
                                    </div>
                                    <div id="sideQuestNotifyList" class="max-h-56 overflow-y-auto flex flex-col gap-1">
                                        <div class="text-slate-500 text-xs">Loading users...</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="font-medium text-gray-500 w-24">Task point</div>
                        <input id="sideQuestPointsInput" type="number" min="0" placeholder="0"
                            class="w-24 rounded-xl border border-gray-200 px-3 py-2 text-xs md:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="font-medium text-gray-500 w-24">Priority</div>
                        <div class="flex-1">
                            <div class="flex flex-wrap gap-2">
                                <button type="button"
                                    class="side-quest-priority-btn px-3 py-1.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 border border-transparent"
                                    data-priority="urgent"
                                    onclick="setSideQuestPriority('urgent', this)">
                                    Urgent
                                </button>
                                <button type="button"
                                    class="side-quest-priority-btn px-3 py-1.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600 border border-transparent"
                                    data-priority="high"
                                    onclick="setSideQuestPriority('high', this)">
                                    High
                                </button>
                                <button type="button"
                                    class="side-quest-priority-btn px-3 py-1.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 border border-transparent"
                                    data-priority="normal"
                                    onclick="setSideQuestPriority('normal', this)">
                                    Normal
                                </button>
                                <button type="button"
                                    class="side-quest-priority-btn px-3 py-1.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-600 border border-transparent"
                                    data-priority="low"
                                    onclick="setSideQuestPriority('low', this)">
                                    Low
                                </button>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
            <div class="rich-editor mb-6">
                <div class="rich-toolbar">
                    <div class="rich-toolbar-left">
                        <button type="button" class="rich-btn" title="Bold" onclick="applyFormat('sideQuestDesc','bold')"><i class="bi bi-type-bold"></i></button>
                        <button type="button" class="rich-btn" title="Italic" onclick="applyFormat('sideQuestDesc','italic')"><i class="bi bi-type-italic"></i></button>
                        <button type="button" class="rich-btn" title="Underline" onclick="applyFormat('sideQuestDesc','underline')"><i class="bi bi-type-underline"></i></button>
                        <div class="w-px h-4 bg-gray-300 mx-1"></div>
                        <button type="button" class="rich-btn" title="Bullet List" onclick="applyFormat('sideQuestDesc','insertUnorderedList')"><i class="bi bi-list-ul"></i></button>
                        <button type="button" class="rich-btn" title="Numbered List" onclick="applyFormat('sideQuestDesc','insertOrderedList')"><i class="bi bi-list-ol"></i></button>
                        <div class="w-px h-4 bg-gray-300 mx-1"></div>
                        <button type="button" class="rich-btn" title="Add Link" onclick="addLinkToEditor('sideQuestDesc')"><i class="bi bi-link-45deg"></i></button>
                    </div>
                    <div class="rich-toolbar-right">
                        <button type="button" class="rich-btn" title="Add Files" onclick="document.getElementById('sideQuestFileInput').click()"><i class="bi bi-paperclip"></i></button>
                        <input type="file" id="sideQuestFileInput" class="hidden" multiple onchange="handleSideQuestFiles(this)" />
                    </div>
                </div>
                <div id="sideQuestDesc" class="rich-editor-body outline-none"
                    contenteditable="true" data-placeholder="Task description or notes..."></div>
            </div>
            <div class="flex flex-col md:flex-row items-stretch md:items-center justify-end gap-3">
                <button type="button"
                    class="rounded-full px-7 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200"
                    onclick="toggleSideQuestDropdown(event)">
                    Cancel
                </button>
                <button type="button"
                    id="sideQuestSaveButton"
                    class="rounded-full px-8 py-2.5 text-sm font-semibold text-white btn-dlg-blue"
                    onclick="saveSideQuest()">
                    Add Side Quest
                </button>
            </div>
        </div>

        <div class="relative flex py-10 items-center">
            <div class="flex-grow border-t border-gray-200"></div>
            <span class="flex-shrink mx-6 text-gray-500 text-xs font-black uppercase tracking-[0.4em]">Side Quest</span>
            <div class="flex-grow border-t border-gray-200"></div>
        </div>
        <ul class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" role="tablist">
            <li class="nav-card active bg-[#FEE2E2] p-5 rounded-[2rem] flex flex-col gap-3 transition-all duration-200 transform shadow-lg -translate-y-1" onclick="switchTab('urgent', this)">
                <div class="icon-box w-10 h-10 rounded-xl flex items-center justify-center shadow" style="background: var(--dlg-red)">
                    <i data-lucide="alert-circle" class="w-6 h-6 text-white"></i>
                </div>
                <div>
                    <div class="text-3xl font-bold" id="sideQuestUrgentCount">00</div>
                    <div class="text-xs font-bold text-red-700/60 uppercase tracking-widest">Urgent</div>
                </div>
            </li>
            <li class="nav-card bg-[#E0F2FE] p-5 rounded-[2rem] flex flex-col gap-3 transition-all duration-200 transform" onclick="switchTab('high', this)">
                <div class="icon-box w-10 h-10 rounded-xl flex items-center justify-center shadow" style="background: var(--dlg-blue)">
                    <i data-lucide="trending-up" class="w-6 h-6 text-white"></i>
                </div>
                <div>
                    <div class="text-3xl font-bold" id="sideQuestHighCount">00</div>
                    <div class="text-xs font-bold text-blue-700/60 uppercase tracking-widest">High</div>
                </div>
            </li>
            <li class="nav-card bg-[#FEF3C7] p-5 rounded-[2rem] flex flex-col gap-3 transition-all duration-200 transform" onclick="switchTab('normal', this)">
                <div class="icon-box w-10 h-10 rounded-xl flex items-center justify-center shadow" style="background: var(--dlg-yellow)">
                    <i data-lucide="box" class="w-6 h-6 text-white"></i>
                </div>
                <div>
                    <div class="text-3xl font-bold" id="sideQuestNormalCount">00</div>
                    <div class="text-xs font-bold text-amber-700/60 uppercase tracking-widest">Normal</div>
                </div>
            </li>
            <li class="nav-card bg-[#F3E8FF] p-5 rounded-[2rem] flex flex-col gap-3 transition-all duration-200 transform" onclick="switchTab('low', this)">
                <div class="icon-box w-10 h-10 rounded-xl flex items-center justify-center shadow" style="background: var(--dlg-purple)">
                    <i data-lucide="arrow-down-circle" class="w-6 h-6 text-white"></i>
                </div>
                <div>
                    <div class="text-3xl font-bold" id="sideQuestLowCount">00</div>
                    <div class="text-xs font-bold text-purple-700/60 uppercase tracking-widest">Low</div>
                </div>
            </li>
        </ul>
        <div id="urgent-content" class="tab-pane space-y-4">
            <div id="sideQuestUrgentList" class="space-y-3"></div>
        </div>
        <div id="high-content" class="tab-pane space-y-4 hidden">
            <div id="sideQuestHighList" class="space-y-3"></div>
        </div>
        <div id="normal-content" class="tab-pane space-y-4 hidden">
            <div id="sideQuestNormalList" class="space-y-3"></div>
        </div>
        <div id="low-content" class="tab-pane space-y-4 hidden">
            <div id="sideQuestLowList" class="space-y-3"></div>
        </div>
    </div>
    
    <div class="modal fade" id="sideQuestDetailModal" tabindex="-1" aria-hidden="true" style="display: none;">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title fw-bolder" id="sideQuestDetailTitle">Side Quest Detail</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <div class="text-muted small mb-1 fw-semibold">Description</div>
                        <div id="sideQuestDetailDescription" class="border rounded p-2 bg-light" style="max-height: 260px; overflow-y: auto;"></div>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="small text-muted">Start Date</div>
                            <div id="sideQuestDetailStart" class="fw-semibold mb-2">-</div>
                            <div class="small text-muted">Due Date</div>
                            <div id="sideQuestDetailDue" class="fw-semibold mb-2">-</div>
                            <div class="small text-muted">Task Point</div>
                            <div id="sideQuestDetailPoints" class="fw-semibold mb-2">-</div>
                            <div class="small text-muted">Priority</div>
                            <div id="sideQuestDetailPriority" class="fw-semibold mb-2">-</div>
                        </div>
                        <div class="col-md-6">
                            <div class="small text-muted">Assign to</div>
                            <div id="sideQuestDetailAssign" class="fw-semibold mb-2 d-flex flex-wrap gap-1 align-items-center">-</div>
                            <div class="small text-muted">Report to</div>
                            <div id="sideQuestDetailNotify" class="fw-semibold mb-2 d-flex flex-wrap gap-1 align-items-center">-</div>
                            <div class="small text-muted">Departments</div>
                            <div id="sideQuestDetailDepartments" class="fw-semibold mb-2 d-flex flex-wrap gap-1 align-items-center">-</div>
                            <div class="small text-muted">Positions</div>
                            <div id="sideQuestDetailPositions" class="fw-semibold mb-2 d-flex flex-wrap gap-1 align-items-center">-</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        if (window.lucide && window.lucide.createIcons) {
            window.lucide.createIcons();
        }
        var questCurrentPriority = 'urgent';
        var sideQuestCurrentPriority = 'normal';
        var questTasksById = {};
        var questUsersById = {};
        var questActionMode = null;
        var sideQuestEditingTaskId = null;
        var sideQuestCurrentFiles = [];

        function computeInitials(user) {
            var source = '';
            if (user) {
                source = user.name || user.email || user.uid || '';
            }
            source = String(source || '').trim();
            if (!source) return 'US';
            var parts = source.split(/\s+/);
            var initials = '';
            for (var i = 0; i < parts.length && i < 2; i++) {
                if (parts[i] && parts[i].length > 0) {
                    initials += parts[i].charAt(0).toUpperCase();
                }
            }
            return initials || 'US';
        }

        async function questToggleComplete(taskId) {
            if (!taskId) return;
            var parentWin = window.parent;
            if (!parentWin || !parentWin.db || !parentWin.doc || !parentWin.updateDoc) {
                alert('Tidak dapat mengubah status quest: koneksi database tidak tersedia.');
                return;
            }
            var currentStatus = null;
            if (questTasksById && questTasksById[taskId]) {
                currentStatus = questTasksById[taskId].status || questTasksById[taskId].Status;
            }
            var isComplete = String(currentStatus || '').toLowerCase() === 'complete';
            var nextStatus = isComplete ? 'Initiate' : 'Complete';
            try {
                var patch = { status: nextStatus };
                var payload = patch;
                if (parentWin.JSON && parentWin.JSON.stringify && parentWin.JSON.parse) {
                    try {
                        payload = parentWin.JSON.parse(parentWin.JSON.stringify(patch));
                    } catch (err) {
                        payload = patch;
                    }
                }
                await parentWin.updateDoc(parentWin.doc(parentWin.db, 'tasks', taskId), payload);
                if (questTasksById && questTasksById[taskId]) {
                    questTasksById[taskId].status = nextStatus;
                }
                if (typeof loadSideQuestTasks === 'function') {
                    loadSideQuestTasks();
                }
            } catch (e) {
                console.error('Gagal mengubah status quest', e);
                alert('Gagal mengubah status quest: ' + (e && e.message ? e.message : String(e)));
            }
        }

        function applyFormat(editorId, command) {
            var editor = document.getElementById(editorId);
            if (!editor) return;
            editor.focus();
            document.execCommand(command, false, null);
            
            // Update button states
            var toolbar = editor.previousElementSibling;
            if (toolbar && toolbar.classList.contains('rich-toolbar')) {
                var btns = toolbar.querySelectorAll('.rich-btn');
                btns.forEach(function(btn) {
                    var cmd = btn.getAttribute('onclick');
                    if (cmd && cmd.indexOf('applyFormat') !== -1) {
                        var part = cmd.split("'")[3];
                        if (part && document.queryCommandState(part)) {
                            btn.classList.add('active');
                        } else {
                            btn.classList.remove('active');
                        }
                    }
                });
            }
        }

        function addLinkToEditor(editorId) {
            var url = prompt("Enter URL:", "https://");
            if (url) {
                var editor = document.getElementById(editorId);
                if (!editor) return;
                editor.focus();
                document.execCommand("createLink", false, url);
            }
        }

        function handleSideQuestFiles(input) {
            if (input.files && input.files.length > 0) {
                var container = input.closest('.rich-editor');
                // Jika input file berada di luar rich-editor (seperti "Optional : Attach files")
                // maka kita cari container terdekat yang menaungi area laporan
                if (!container) {
                    container = input.closest('#report-accordion-' + input.id.split('-')[1]);
                }
                if (!container) return;

                var fileList = container.querySelector('.rich-file-list');
                if (!fileList) {
                    fileList = document.createElement('div');
                    fileList.className = 'rich-file-list px-4 py-2 border-t border-gray-100 flex flex-wrap gap-2';
                    container.appendChild(fileList);
                }
                
                Array.from(input.files).forEach(function(file) {
                    var item = document.createElement('div');
                    item.className = 'flex items-center gap-2 bg-gray-50 px-2 py-1 rounded text-xs text-gray-600 border border-gray-200';
                    item.innerHTML = '<i class="bi bi-file-earmark"></i> <span>' + file.name + '</span><button type="button" class="text-gray-400 hover:text-red-500" onclick="this.parentElement.remove()"><i class="bi bi-x"></i></button>';
                    fileList.appendChild(item);
                });
            }
        }

        function toggleReportAccordion(taskId) {
            var accordion = document.getElementById('report-accordion-' + taskId);
            var card = document.querySelector('[data-task-id="' + taskId + '"]');
            var btn = card.querySelector('.quest-card-check-btn');
            var icon = btn.querySelector('i');
            
            if (accordion.classList.contains('hidden')) {
                accordion.classList.remove('hidden');
                btn.classList.add('bg-emerald-500', 'border-emerald-500', 'text-white');
                if (icon) {
                    icon.classList.remove('text-gray-400');
                    icon.classList.add('text-white');
                }
            } else {
                accordion.classList.add('hidden');
                btn.classList.remove('bg-emerald-500', 'border-emerald-500', 'text-white');
                if (icon) {
                    icon.classList.add('text-gray-400');
                    icon.classList.remove('text-white');
                }
            }
        }

        async function submitSideQuestReport(taskId) {
            var editor = document.getElementById('reportEditor-' + taskId);
            var reportContent = editor.innerHTML;
            if (!reportContent || reportContent.trim() === '' || editor.textContent.trim() === '') {
                alert('Please enter your report before submitting.');
                return;
            }
            
            var parentWin = window.parent;
            if (!parentWin || !parentWin.db || !parentWin.collection || !parentWin.addDoc || !parentWin.doc || !parentWin.updateDoc) {
                alert('Database connection not available.');
                return;
            }
            
            try {
                var fileInput = document.getElementById('reportFileInput-' + taskId);
                var files = fileInput.files;
                var attachedFiles = [];
                
                var refFn = parentWin.ref || parentWin.storageRef;
                if (files && files.length > 0) {
                    if (!(parentWin.storage && refFn && parentWin.uploadBytes && parentWin.getDownloadURL)) {
                        alert('Upload file belum tersedia. Silakan refresh halaman lalu coba lagi.');
                        return;
                    }
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        var path = 'reports/' + taskId + '/' + Date.now() + '_' + file.name;
                        var sRef = refFn(parentWin.storage, path);
                        await parentWin.uploadBytes(sRef, file);
                        var url = await parentWin.getDownloadURL(sRef);
                        attachedFiles.push({
                            name: file.name,
                            url: url,
                            type: file.type
                        });
                    }
                }
                
                // Save report to sub-collection 'reports'
                var reportData = {
                    content: reportContent,
                    files: attachedFiles,
                    createdAt: new Date().toISOString(),
                    submittedBy: parentWin.auth && parentWin.auth.currentUser ? parentWin.auth.currentUser.uid : 'unknown'
                };
                var reportPayload = reportData;
                if (parentWin.JSON && parentWin.JSON.stringify && parentWin.JSON.parse) {
                    try {
                        reportPayload = parentWin.JSON.parse(parentWin.JSON.stringify(reportData));
                    } catch (err) {
                        reportPayload = reportData;
                    }
                }
                await parentWin.addDoc(parentWin.collection(parentWin.db, 'tasks', taskId, 'reports'), reportPayload);
                
                // Update task document to indicate a report exists
                try {
                    var taskPatch = {
                        hasReport: true,
                        lastReportAt: new Date().toISOString()
                    };
                    // Ensure we pass a plain object to parentWin.updateDoc
                    var taskPayload = {};
                    if (parentWin.JSON && parentWin.JSON.stringify && parentWin.JSON.parse) {
                        try {
                            taskPayload = parentWin.JSON.parse(parentWin.JSON.stringify(taskPatch));
                        } catch (err) {
                            taskPayload = { hasReport: true, lastReportAt: taskPatch.lastReportAt };
                        }
                    } else {
                        taskPayload = { hasReport: true, lastReportAt: taskPatch.lastReportAt };
                    }
                    await parentWin.updateDoc(parentWin.doc(parentWin.db, 'tasks', taskId), taskPayload);
                } catch (eTask) {
                    console.warn('Failed to update task with report flag', eTask);
                }
                
                // Mark task as complete
                await questToggleComplete(taskId);
                
                alert('Report submitted successfully!');
            } catch (e) {
                console.error('Failed to submit report', e);
                alert('Failed to submit report: ' + e.message);
            }
        }

        function questOpenTask(taskId) {
            if (!taskId) return;
            if (!questTasksById || !questTasksById[taskId]) {
                alert('Tidak dapat menemukan data Side Quest untuk diedit.');
                return;
            }
            var data = questTasksById[taskId] || {};
            sideQuestEditingTaskId = taskId;
            var dropdown = document.getElementById('sideQuestCreateDropdown');
            var headerToggle = document.getElementById('sideQuestHeaderToggleButton');
            var headerMenu = document.getElementById('sideQuestHeaderMenu');
            if (dropdown) {
                dropdown.classList.remove('hidden');
                if (dropdown.scrollIntoView) {
                    dropdown.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
            if (headerToggle) {
                headerToggle.classList.add('hidden');
            }
            if (headerMenu) {
                headerMenu.classList.add('hidden');
            }
            var saveBtn = document.getElementById('sideQuestSaveButton');
            if (saveBtn) {
                saveBtn.textContent = 'Update Side Quest';
            }
            var input = document.getElementById('sideQuestNameInput');
            if (input) {
                input.value = data.title || '';
                if (input.focus) {
                    input.focus();
                }
            }
            var startEl = document.getElementById('sideQuestStartInput');
            if (startEl) {
                var startVal = data.start_date || data.startDate || '';
                startEl.value = startVal;
            }
            var dueEl = document.getElementById('sideQuestDueInput');
            if (dueEl) {
                var dueVal = data.due_date || data.dueDate || '';
                dueEl.value = dueVal;
            }
            var pointsEl = document.getElementById('sideQuestPointsInput');
            if (pointsEl) {
                var pointsVal = typeof data.points === 'number'
                    ? data.points
                    : (data.points ? Number(data.points) || 0 : 0);
                pointsEl.value = pointsVal ? String(pointsVal) : '';
            }
            var descEl = document.getElementById('sideQuestDesc');
            if (descEl) {
                descEl.innerHTML = data.description || '';
            }
            var hiddenTags = document.getElementById('sideQuest-tags');
            if (hiddenTags && Array.isArray(data.tags)) {
                hiddenTags.value = data.tags.map(function (t) { return String(t || '').trim(); }).filter(function (t) { return t; }).join(',');
            }
            if (typeof updateSideQuestSelectedTagUI === 'function') {
                updateSideQuestSelectedTagUI();
            }
            var deptMap = {};
            if (Array.isArray(data.departments)) {
                data.departments.forEach(function (d) {
                    if (d && d.id) {
                        deptMap[d.id] = true;
                    }
                });
            }
            Array.prototype.slice.call(
                document.querySelectorAll('#sideQuestDepartmentDropdown input[type="checkbox"]')
            ).forEach(function (cb) {
                var id = cb.getAttribute('data-dept-id') || '';
                cb.checked = !!deptMap[id];
            });
            updateSideQuestDepartmentLabel();
            var posMap = {};
            if (Array.isArray(data.positions)) {
                data.positions.forEach(function (p) {
                    if (p && p.id) {
                        posMap[p.id] = true;
                    }
                });
            }
            Array.prototype.slice.call(
                document.querySelectorAll('#sideQuestPositionDropdown input[type="checkbox"]')
            ).forEach(function (cb) {
                var id = cb.getAttribute('data-position-id') || '';
                cb.checked = !!posMap[id];
            });
            updateSideQuestPositionLabel();
            var assignSet = {};
            if (Array.isArray(data.assign_to)) {
                data.assign_to.forEach(function (uid) {
                    if (uid) {
                        assignSet[String(uid)] = true;
                    }
                });
            } else if (data.assign_to) {
                assignSet[String(data.assign_to)] = true;
            }
            Array.prototype.slice.call(
                document.querySelectorAll('#sideQuestAssignDropdown input[type="checkbox"]')
            ).forEach(function (cb) {
                var uid = cb.getAttribute('data-user-id') || '';
                cb.checked = !!assignSet[uid];
            });
            updateSideQuestUserLabel(
                'sideQuestAssignDropdown',
                'sideQuestAssignButtonLabel',
                'Select user...',
                'sideQuestAssignAvatars'
            );
            var notifySet = {};
            if (Array.isArray(data.notify_to)) {
                data.notify_to.forEach(function (uid) {
                    if (uid) {
                        notifySet[String(uid)] = true;
                    }
                });
            } else if (data.notify_to) {
                notifySet[String(data.notify_to)] = true;
            }
            Array.prototype.slice.call(
                document.querySelectorAll('#sideQuestNotifyDropdown input[type="checkbox"]')
            ).forEach(function (cb) {
                var uid = cb.getAttribute('data-user-id') || '';
                cb.checked = !!notifySet[uid];
            });
            updateSideQuestUserLabel(
                'sideQuestNotifyDropdown',
                'sideQuestNotifyButtonLabel',
                'Select user...',
                'sideQuestNotifyAvatars'
            );
            var priority = String(data.priority || 'normal').toLowerCase();
            sideQuestCurrentPriority = priority;
            var buttons = document.querySelectorAll('.side-quest-priority-btn');
            Array.prototype.slice.call(buttons).forEach(function (btn) {
                var p = btn.getAttribute('data-priority') || '';
                if (p === priority) {
                    btn.classList.add('border-slate-900', 'bg-slate-900', 'text-white');
                } else {
                    btn.classList.remove('border-slate-900', 'bg-slate-900', 'text-white');
                }
            });
        }

        function questEditTask(taskId) {
            if (!taskId) return;
            questOpenTask(taskId);
        }

        function questDeleteTask(taskId) {
            if (!taskId) return;
            var parentWin = window.parent;
            if (!parentWin || !parentWin.db || !parentWin.doc || !parentWin.deleteDoc) {
                alert('Tidak dapat menghapus quest: koneksi database tidak tersedia.');
                return;
            }
            if (confirm('Yakin ingin menghapus quest ini?')) {
                parentWin.deleteDoc(parentWin.doc(parentWin.db, 'tasks', taskId)).then(function () {
                    if (questTasksById && questTasksById[taskId]) {
                        delete questTasksById[taskId];
                    }
                    if (typeof loadSideQuestTasks === 'function') {
                        loadSideQuestTasks();
                    }
                }).catch(function (e) {
                    console.error('Gagal menghapus quest', e);
                    alert('Gagal menghapus quest.');
                });
            }
        }

        function getSideQuestTaskById(taskId) {
            if (!taskId) return null;
            if (questTasksById && questTasksById[taskId]) {
                return questTasksById[taskId];
            }
            if (window.questTasksById && window.questTasksById[taskId]) {
                return window.questTasksById[taskId];
            }
            if (window.parent && window.parent.questTasksById && window.parent.questTasksById[taskId]) {
                return window.parent.questTasksById[taskId];
            }
            return null;
        }

        function openSideQuestDetailModal(taskId, descHtmlOverride) {
            var data = getSideQuestTaskById(taskId);
            if (!data) {
                alert('Data Side Quest tidak ditemukan.');
                return;
            }

            var modalEl = document.getElementById('sideQuestDetailModal');
            if (!modalEl || typeof bootstrap === 'undefined' || !bootstrap.Modal) {
                alert('Modal tidak tersedia.');
                return;
            }

            var titleEl = document.getElementById('sideQuestDetailTitle');
            var descEl = document.getElementById('sideQuestDetailDescription');
            var startEl = document.getElementById('sideQuestDetailStart');
            var dueEl = document.getElementById('sideQuestDetailDue');
            var assignEl = document.getElementById('sideQuestDetailAssign');
            var notifyEl = document.getElementById('sideQuestDetailNotify');
            var deptEl = document.getElementById('sideQuestDetailDepartments');
            var posEl = document.getElementById('sideQuestDetailPositions');
            var pointsEl = document.getElementById('sideQuestDetailPoints');
            var priorityEl = document.getElementById('sideQuestDetailPriority');

            if (titleEl) {
                titleEl.textContent = data.title || 'Untitled Side Quest';
            }

            var descHtml = typeof descHtmlOverride === 'string' && descHtmlOverride ? descHtmlOverride : (data.description || '');
            if (descEl) {
                if (descHtml) {
                    descEl.innerHTML = descHtml;
                } else {
                    descEl.innerHTML = '<span class="text-muted">No description provided.</span>';
                }
            }

            function formatDate(raw) {
                if (!raw) return '-';
                return String(raw);
            }

            if (startEl) {
                startEl.textContent = formatDate(data.start_date || data.startDate || '');
            }
            if (dueEl) {
                dueEl.textContent = formatDate(data.due_date || data.dueDate || '');
            }

            function mapUserList(value) {
                var ids = [];
                if (Array.isArray(value)) {
                    ids = value.slice();
                } else if (value) {
                    ids = [value];
                }
                var html = '';
                ids.forEach(function (uid) {
                    var u = null;
                    if (questUsersById && questUsersById[uid]) {
                        u = questUsersById[uid];
                    } else if (window.questUsersById && window.questUsersById[uid]) {
                        u = window.questUsersById[uid];
                    } else if (window.parent && window.parent.questUsersById && window.parent.questUsersById[uid]) {
                        u = window.parent.questUsersById[uid];
                    }
                    
                    var name = (u && (u.name || u.email)) ? (u.name || u.email) : uid;
                    var photo = (u && u.photo && !u.photo.includes('pravatar.cc')) ? u.photo : '';
                    
                    if (photo) {
                        html += '<img src="' + photo + '" class="rounded-circle" style="width: 24px; height: 24px; object-fit: cover;" data-bs-toggle="tooltip" title="' + name + '">';
                    } else {
                        var initials = '';
                        if (u) {
                            var source = u.name || u.email || uid || '';
                            var parts = source.split(/\s+/);
                            for (var i = 0; i < parts.length && i < 2; i++) {
                                if (parts[i]) initials += parts[i].charAt(0).toUpperCase();
                            }
                        }
                        if (!initials) initials = 'U';
                        html += '<span class="d-inline-flex align-items-center justify-center rounded-circle bg-secondary text-white" style="width: 24px; height: 24px; font-size: 10px;" data-bs-toggle="tooltip" title="' + name + '">' + initials + '</span>';
                    }
                });
                return html || '-';
            }

            if (assignEl) {
                assignEl.innerHTML = mapUserList(data.assign_to || data.assignTo || []);
            }
            if (notifyEl) {
                notifyEl.innerHTML = mapUserList(data.notify_to || data.notifyTo || []);
            }

            function mapCollectionItems(value) {
                var items = Array.isArray(value) ? value : [];
                var html = '';
                items.forEach(function (item) {
                    if (!item) return;
                    var name = '';
                    var color = '#6c757d';
                    if (typeof item === 'string') {
                        name = item;
                    } else {
                        name = item.name || '';
                        color = item.color || color;
                    }
                    if (name) {
                        html += '<span class="badge" style="background-color: ' + color + ';">' + name + '</span>';
                    }
                });
                return html || '-';
            }

            if (deptEl) {
                deptEl.innerHTML = mapCollectionItems(data.departments || []);
            }
            if (posEl) {
                posEl.innerHTML = mapCollectionItems(data.positions || []);
            }

            if (pointsEl) {
                var pts = 0;
                if (typeof data.points === 'number') {
                    pts = data.points;
                } else if (data.points) {
                    var parsed = parseFloat(String(data.points));
                    if (!isNaN(parsed)) {
                        pts = parsed;
                    }
                }
                pointsEl.textContent = pts ? String(pts) : '-';
            }

            if (priorityEl) {
                var p = String(data.priority || 'normal').toLowerCase();
                var badgeClass = 'bg-secondary';
                if (p === 'urgent') badgeClass = 'bg-danger';
                else if (p === 'high') badgeClass = 'bg-primary';
                else if (p === 'normal') badgeClass = 'bg-warning text-dark';
                else if (p === 'low') badgeClass = 'bg-info text-dark';
                
                priorityEl.innerHTML = '<span class="badge ' + badgeClass + '">' + p.charAt(0).toUpperCase() + p.slice(1) + '</span>';
            }

            var editBtn = document.getElementById('sideQuestDetailEditBtn');
            if (editBtn) {
                editBtn.onclick = function() {
                    var modal = bootstrap.Modal.getInstance(modalEl);
                    if (modal) modal.hide();
                    if (typeof questEditTask === 'function') {
                        questEditTask(taskId);
                    }
                };
            }

            var modal = bootstrap.Modal.getOrCreateInstance(modalEl);
            modalEl.removeEventListener('shown.bs.modal', initTooltips);
            function initTooltips() {
                var tooltipTriggerList = [].slice.call(modalEl.querySelectorAll('[data-bs-toggle="tooltip"]'));
                tooltipTriggerList.map(function (tooltipTriggerEl) {
                    return new bootstrap.Tooltip(tooltipTriggerEl);
                });
            }
            modalEl.addEventListener('shown.bs.modal', initTooltips);
            modal.show();
        }

        function switchTab(priority, element) {
            document.querySelectorAll('.nav-card').forEach(function (card) {
                card.classList.remove('active');
                card.classList.remove('shadow-lg', '-translate-y-1');
            });
            if (element) {
                element.classList.add('active');
                element.classList.add('shadow-lg', '-translate-y-1');
            }
            questCurrentPriority = priority;
            document.querySelectorAll('.tab-pane').forEach(function (pane) { pane.classList.add('hidden'); });
            var pane = document.getElementById(priority + '-content');
            if (pane) {
                pane.classList.remove('hidden');
            }
        }
        if (typeof window !== 'undefined') {
            window.switchTab = switchTab;
        }

        window.toggleDashboardMenu = function(el) {
            var submenu = el.nextElementSibling;
            var icon = document.getElementById('dashboardIcon');
            if (submenu) {
                var isShow = submenu.classList.toggle('show');
                if (icon) {
                    if (isShow) {
                        icon.classList.remove('bi-arrow-left-square-fill');
                        icon.classList.add('bi-arrow-down-square-fill');
                    } else {
                        icon.classList.remove('bi-arrow-down-square-fill');
                        icon.classList.add('bi-arrow-left-square-fill');
                    }
                }
            }
        };

        var logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.onclick = function() {
                var w = window.parent && window.parent.db ? window.parent : window;
                if (w.auth && w.signOut) {
                    w.signOut(w.auth).then(function() {
                        window.location.href = '/login.html';
                    }).catch(function(error) {
                        console.error('Logout error:', error);
                        alert('Logout failed');
                    });
                } else {
                    // Fallback jika Firebase auth tidak tersedia
                    window.location.href = '/login.html';
                }
            };
        }

        function setSideQuestPriority(priority, element) {
            sideQuestCurrentPriority = priority || 'normal';
            var buttons = document.querySelectorAll('.side-quest-priority-btn');
            Array.prototype.slice.call(buttons).forEach(function (btn) {
                btn.classList.remove('border-slate-900', 'bg-slate-900', 'text-white');
            });
            if (element) {
                element.classList.add('border-slate-900', 'bg-slate-900', 'text-white');
            }
        }
        function toggleSideQuestDropdown(event) {
            var dropdown = document.getElementById('sideQuestCreateDropdown');
            if (!dropdown) return;
            if (event && event.stopPropagation) {
                event.stopPropagation();
            }
            var headerToggle = document.getElementById('sideQuestHeaderToggleButton');
            var headerMenu = document.getElementById('sideQuestHeaderMenu');
            var willShow = dropdown.classList.contains('hidden');
            if (willShow) {
                dropdown.classList.remove('hidden');
                if (headerToggle) headerToggle.classList.add('hidden');
                if (headerMenu) headerMenu.classList.add('hidden');
                var input = document.getElementById('sideQuestNameInput');
                if (input && input.focus) {
                    input.focus();
                }
                if (!sideQuestCurrentPriority) {
                    setSideQuestPriority('normal');
                } else {
                    var buttons = document.querySelectorAll('.side-quest-priority-btn');
                    Array.prototype.slice.call(buttons).forEach(function (btn) {
                        if (btn.getAttribute('data-priority') === sideQuestCurrentPriority) {
                            btn.classList.add('border-slate-900', 'bg-slate-900', 'text-white');
                        } else {
                            btn.classList.remove('border-slate-900', 'bg-slate-900', 'text-white');
                        }
                    });
                }
            } else {
                dropdown.classList.add('hidden');
                if (headerToggle) headerToggle.classList.remove('hidden');
                if (headerMenu) headerMenu.classList.add('hidden');
            }
        }
        function toggleSideQuestUserDropdown(field) {
            var dropdownId = field === 'assign' ? 'sideQuestAssignDropdown' : 'sideQuestNotifyDropdown';
            var searchId = field === 'assign' ? 'sideQuestAssignSearch' : 'sideQuestNotifySearch';
            var dropdown = document.getElementById(dropdownId);
            if (!dropdown) return;
            var isHidden = dropdown.classList.contains('hidden');
            if (isHidden) {
                dropdown.classList.remove('hidden');
                var search = document.getElementById(searchId);
                if (search && search.focus) {
                    search.focus();
                    if (search.select) search.select();
                }
            } else {
                dropdown.classList.add('hidden');
            }
        }
        function updateSideQuestUserLabel(dropdownId, labelId, placeholderText, avatarsId) {
            var dropdown = document.getElementById(dropdownId);
            var labelEl = document.getElementById(labelId);
            var avatarsEl = avatarsId ? document.getElementById(avatarsId) : null;
            if (!dropdown) return;
            var selected = Array.prototype.slice.call(
                dropdown.querySelectorAll('input[type="checkbox"]:checked')
            );
            if (!selected.length) {
                if (labelEl) {
                    labelEl.textContent = placeholderText;
                }
                if (avatarsEl) {
                    avatarsEl.innerHTML = '';
                }
                return;
            }
            var names = selected.map(function (cb) {
                var row = cb.closest('.quest-user-option');
                if (!row) return '';
                var nameEl = row.querySelector('.quest-user-name');
                return nameEl ? nameEl.textContent.trim() : '';
            }).filter(function (v) { return v; });
            if (avatarsEl) {
                avatarsEl.innerHTML = '';
                var maxAvatars = 4;
                selected.forEach(function (cb, index) {
                    if (index >= maxAvatars) return;
                    var row = cb.closest('.quest-user-option');
                    var imgEl = row ? row.querySelector('img') : null;
                    var name = names[index] || '';
                    var uid = cb.getAttribute('data-user-id') || '';
                    var source = name || uid;
                    var initials = 'U';
                    if (source) {
                        var parts = String(source).trim().split(/\s+/);
                        var tmp = parts.map(function (p) { return p[0]; }).join('');
                        initials = tmp.substring(0, 2).toUpperCase();
                    }
                    var avatarNode;
                    if (imgEl && imgEl.getAttribute('src')) {
                        avatarNode = document.createElement('img');
                        avatarNode.src = imgEl.getAttribute('src');
                        avatarNode.alt = name || '';
                        avatarNode.className = 'w-6 h-6 rounded-full object-cover border border-gray-200';
                    } else {
                        avatarNode = document.createElement('span');
                        avatarNode.className = 'w-6 h-6 rounded-full bg-slate-700 text-slate-100 text-[10px] font-semibold flex items-center justify-center';
                        avatarNode.textContent = initials;
                    }
                    avatarsEl.appendChild(avatarNode);
                });
                if (selected.length > maxAvatars) {
                    var more = document.createElement('span');
                    more.className = 'w-6 h-6 rounded-full bg-slate-800 text-slate-100 text-[10px] font-semibold flex items-center justify-center';
                    more.textContent = '+' + (selected.length - maxAvatars);
                    avatarsEl.appendChild(more);
                }
            }
            if (labelEl) {
                labelEl.textContent = '';
            }
        }
        function updateSideQuestDepartmentLabel() {
            var dropdown = document.getElementById('sideQuestDepartmentDropdown');
            var labelEl = document.getElementById('sideQuestDepartmentButtonLabel');
            if (!dropdown || !labelEl) return;
            var selected = Array.prototype.slice.call(
                dropdown.querySelectorAll('input[type="checkbox"]:checked')
            );
            if (!selected.length) {
                labelEl.textContent = 'Select departments...';
                return;
            }
            var names = selected.map(function (cb) {
                var row = cb.closest('.sidequest-dept-option');
                if (!row) return '';
                var nameEl = row.querySelector('.sidequest-dept-name');
                return nameEl ? nameEl.textContent.trim() : '';
            }).filter(function (v) { return v; });
            if (!names.length) {
                labelEl.textContent = 'Select departments...';
            } else if (names.length === 1) {
                labelEl.textContent = names[0];
            } else if (names.length === 2) {
                labelEl.textContent = names[0] + ', ' + names[1];
            } else {
                labelEl.textContent = names[0] + ' and ' + (names.length - 1) + ' more';
            }
        }
        function updateSideQuestPositionLabel() {
            var dropdown = document.getElementById('sideQuestPositionDropdown');
            var labelEl = document.getElementById('sideQuestPositionButtonLabel');
            if (!dropdown || !labelEl) return;
            var selected = Array.prototype.slice.call(
                dropdown.querySelectorAll('input[type="checkbox"]:checked')
            );
            if (!selected.length) {
                labelEl.textContent = 'Select positions...';
                return;
            }
            var names = selected.map(function (cb) {
                var row = cb.closest('.sidequest-position-option');
                if (!row) return '';
                var nameEl = row.querySelector('.sidequest-position-name');
                return nameEl ? nameEl.textContent.trim() : '';
            }).filter(function (v) { return v; });
            if (!names.length) {
                labelEl.textContent = 'Select positions...';
            } else if (names.length === 1) {
                labelEl.textContent = names[0];
            } else if (names.length === 2) {
                labelEl.textContent = names[0] + ', ' + names[1];
            } else {
                labelEl.textContent = names[0] + ' and ' + (names.length - 1) + ' more';
            }
        }
        async function loadSideQuestDepartments() {
            var dropdown = document.getElementById('sideQuestDepartmentDropdown');
            if (!dropdown) return;
            dropdown.innerHTML = '<span class="text-gray-400 text-xs">Loading departments...</span>';
            try {
                var parentWin = window.parent;
                if (!parentWin || !parentWin.db || !parentWin.collection || !parentWin.getDocs) {
                    dropdown.innerHTML = '<span class="text-red-500 text-xs">Departments not available.</span>';
                    return;
                }
                var snap = await parentWin.getDocs(parentWin.collection(parentWin.db, "departments"));
                dropdown.innerHTML = '';
                snap.forEach(function (docSnap) {
                    var d = docSnap.data() || {};
                    var name = d.name || "Untitled";
                    var color = d.color || "#0B2B6A";
                    var row = document.createElement('div');
                    row.className = 'sidequest-dept-option flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer';
                    row.innerHTML =
                        '<span class="inline-flex w-2.5 h-2.5 rounded-full" style="background:' + color + ';"></span>' +
                        '<span class="sidequest-dept-name flex-1 text-xs md:text-sm text-gray-700">' + name + '</span>' +
                        '<input type="checkbox" class="ml-2 accent-blue-600" data-dept-id="' + docSnap.id + '">';
                    dropdown.appendChild(row);
                    var checkbox = row.querySelector('input[type="checkbox"]');
                    checkbox.addEventListener('change', updateSideQuestDepartmentLabel);
                    row.addEventListener('click', function (e) {
                        if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'input') {
                            return;
                        }
                        checkbox.checked = !checkbox.checked;
                        updateSideQuestDepartmentLabel();
                    });
                });
                if (!dropdown.innerHTML.trim()) {
                    dropdown.innerHTML = '<span class="text-gray-400 text-xs">No departments available.</span>';
                } else {
                    updateSideQuestDepartmentLabel();
                }
            } catch (e) {
                console.error('Failed to load departments for side quest', e);
                dropdown.innerHTML = '<span class="text-red-500 text-xs">Failed to load departments.</span>';
            }
        }
        async function loadSideQuestPositions() {
            var dropdown = document.getElementById('sideQuestPositionDropdown');
            if (!dropdown) return;
            dropdown.innerHTML = '<span class="text-gray-400 text-xs">Loading positions...</span>';
            try {
                var parentWin = window.parent;
                if (!parentWin || !parentWin.db || !parentWin.collection || !parentWin.getDocs) {
                    dropdown.innerHTML = '<span class="text-red-500 text-xs">Positions not available.</span>';
                    return;
                }
                var snap = await parentWin.getDocs(parentWin.collection(parentWin.db, "positions"));
                dropdown.innerHTML = '';
                snap.forEach(function (docSnap) {
                    var d = docSnap.data() || {};
                    var name = d.name || "Untitled";
                    var row = document.createElement('div');
                    row.className = 'sidequest-position-option flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer';
                    row.innerHTML =
                        '<span class="sidequest-position-name flex-1 text-xs md:text-sm text-gray-700">' + name + '</span>' +
                        '<input type="checkbox" class="ml-2 accent-blue-600" data-position-id="' + docSnap.id + '">';
                    dropdown.appendChild(row);
                    var checkbox = row.querySelector('input[type="checkbox"]');
                    checkbox.addEventListener('change', updateSideQuestPositionLabel);
                    row.addEventListener('click', function (e) {
                        if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'input') {
                            return;
                        }
                        checkbox.checked = !checkbox.checked;
                        updateSideQuestPositionLabel();
                    });
                });
                if (!dropdown.innerHTML.trim()) {
                    dropdown.innerHTML = '<span class="text-gray-400 text-xs">No positions available.</span>';
                } else {
                    updateSideQuestPositionLabel();
                }
            } catch (e) {
                console.error('Failed to load positions for side quest', e);
                dropdown.innerHTML = '<span class="text-red-500 text-xs">Failed to load positions.</span>';
            }
        }
        async function saveSideQuest() {
            var parentWin = window.parent;
            if (!parentWin || !parentWin.db || !parentWin.collection || !parentWin.addDoc || !parentWin.serverTimestamp) {
                alert('Tidak dapat menyimpan side quest: koneksi database tidak tersedia.');
                return;
            }
            var input = document.getElementById('sideQuestNameInput');
            var title = input ? String(input.value || '').trim() : '';
            if (!title) {
                alert('Silakan isi Side Quest Name terlebih dahulu.');
                return;
            }
            var startEl = document.getElementById('sideQuestStartInput');
            var startValue = startEl && startEl.value ? String(startEl.value) : '';
            var dueEl = document.getElementById('sideQuestDueInput');
            var dueValue = dueEl && dueEl.value ? String(dueEl.value) : '';
            var pointsEl = document.getElementById('sideQuestPointsInput');
            var pointsValue = pointsEl && pointsEl.value ? Number(pointsEl.value) || 0 : 0;
            var hiddenTags = document.getElementById('sideQuest-tags');
            var tags = [];
            if (hiddenTags && hiddenTags.value) {
                tags = hiddenTags.value.split(',').map(function (t) { return t.trim(); }).filter(function (t) { return t; });
            }
            var descEl = document.getElementById('sideQuestDesc');
            var description = descEl ? String(descEl.innerHTML || '').trim() : '';
            
            // Handle file attachments
            var fileInput = document.getElementById('sideQuestFileInput');
            var files = fileInput ? fileInput.files : [];
            var attachedFiles = [];
            
            // If editing, we might have existing files
            if (sideQuestEditingTaskId && questTasksById[sideQuestEditingTaskId]) {
                var existingTask = questTasksById[sideQuestEditingTaskId];
                if (Array.isArray(existingTask.files)) {
                    attachedFiles = JSON.parse(JSON.stringify(existingTask.files));
                }
            }

            if (files && files.length > 0 && parentWin.storage && parentWin.ref && parentWin.uploadBytes && parentWin.getDownloadURL) {
                var saveBtn = document.getElementById('sideQuestSaveButton');
                var originalText = saveBtn ? saveBtn.textContent : 'Add Side Quest';
                if (saveBtn) {
                    saveBtn.disabled = true;
                    saveBtn.textContent = 'Uploading...';
                }

                try {
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        var fileRef = parentWin.ref(parentWin.storage, 'side_quests/' + Date.now() + '_' + file.name);
                        var snapshot = await parentWin.uploadBytes(fileRef, file);
                        var downloadURL = await parentWin.getDownloadURL(snapshot.ref);
                        attachedFiles.push({
                            name: file.name,
                            url: downloadURL,
                            type: file.type,
                            size: file.size,
                            uploadedAt: new Date().toISOString()
                        });
                    }
                } catch (err) {
                    console.error('Upload failed', err);
                    alert('Gagal mengunggah file.');
                    if (saveBtn) {
                        saveBtn.disabled = false;
                        saveBtn.textContent = originalText;
                    }
                    return;
                }
                
                if (saveBtn) {
                    saveBtn.disabled = false;
                    saveBtn.textContent = originalText;
                }
            }

            var assignSelected = [];
            Array.prototype.slice.call(
                document.querySelectorAll('#sideQuestAssignDropdown input[type=\"checkbox\"]:checked')
            ).forEach(function (cb) {
                var uid = cb.getAttribute('data-user-id') || '';
                if (uid) assignSelected.push(uid);
            });
            var notifySelected = [];
            Array.prototype.slice.call(
                document.querySelectorAll('#sideQuestNotifyDropdown input[type=\"checkbox\"]:checked')
            ).forEach(function (cb) {
                var uid = cb.getAttribute('data-user-id') || '';
                if (uid) notifySelected.push(uid);
            });
            var deptSelected = [];
            Array.prototype.slice.call(
                document.querySelectorAll('#sideQuestDepartmentDropdown input[type=\"checkbox\"]:checked')
            ).forEach(function (cb) {
                var id = cb.getAttribute('data-dept-id') || '';
                var row = cb.closest('.sidequest-dept-option');
                var nameEl = row ? row.querySelector('.sidequest-dept-name') : null;
                var name = nameEl ? nameEl.textContent.trim() : '';
                var color = '';
                if (row) {
                    var dot = row.querySelector('.inline-flex');
                    if (dot && dot.style) {
                        color = dot.style.backgroundColor || dot.style.background || '';
                    }
                }
                if (id) {
                    deptSelected.push({ id: id, name: name, color: color });
                }
            });
            var positionSelected = [];
            Array.prototype.slice.call(
                document.querySelectorAll('#sideQuestPositionDropdown input[type=\"checkbox\"]:checked')
            ).forEach(function (cb) {
                var id = cb.getAttribute('data-position-id') || '';
                var row = cb.closest('.sidequest-position-option');
                var nameEl = row ? row.querySelector('.sidequest-position-name') : null;
                var name = nameEl ? nameEl.textContent.trim() : '';
                if (id) {
                    positionSelected.push({ id: id, name: name });
                }
            });
            try {
                var localData = null;
                try {
                    localData = JSON.parse(localStorage.getItem('userData') || 'null');
                } catch (e) {
                    localData = null;
                }
                var createdBy = localData && localData.uid ? localData.uid : '';
                var createdByName = localData && localData.name ? localData.name : '';
                var baseEditable = {
                    title: title,
                    description: description,
                    priority: sideQuestCurrentPriority || 'normal',
                    start_date: startValue,
                    due_date: dueValue,
                    points: pointsValue,
                    departments: deptSelected,
                    positions: positionSelected,
                    assign_to: assignSelected,
                    notify_to: notifySelected,
                    tags: tags,
                    files: attachedFiles
                };
                var isEditing = !!sideQuestEditingTaskId;
                if (!isEditing) {
                    var basePayload = {
                        title: baseEditable.title,
                        description: baseEditable.description,
                        priority: baseEditable.priority,
                        start_date: baseEditable.start_date,
                        due_date: baseEditable.due_date,
                        points: baseEditable.points,
                        departments: baseEditable.departments,
                        positions: baseEditable.positions,
                        assign_to: baseEditable.assign_to,
                        notify_to: baseEditable.notify_to,
                        tags: baseEditable.tags,
                        files: baseEditable.files,
                        reminder_mode: null,
                        reminder_dates: [],
                        recur: null,
                        status: 'SideQuest',
                        task_status: 'Initiate',
                        created_by: createdBy,
                        created_by_name: createdByName,
                        type: 'side-quest'
                    };
                    var payload = basePayload;
                    if (parentWin.JSON && parentWin.JSON.parse && parentWin.JSON.stringify) {
                        try {
                            payload = parentWin.JSON.parse(parentWin.JSON.stringify(basePayload));
                        } catch (e) {
                            payload = basePayload;
                        }
                    }
                    payload.created_at = parentWin.serverTimestamp();
                    await parentWin.addDoc(parentWin.collection(parentWin.db, 'tasks'), payload);
                } else {
                    var patch = {
                        title: baseEditable.title,
                        description: baseEditable.description,
                        priority: baseEditable.priority,
                        start_date: baseEditable.start_date,
                        due_date: baseEditable.due_date,
                        points: baseEditable.points,
                        departments: baseEditable.departments,
                        positions: baseEditable.positions,
                        assign_to: baseEditable.assign_to,
                        notify_to: baseEditable.notify_to,
                        tags: baseEditable.tags,
                        files: baseEditable.files
                    };
                    var updatePayload = patch;
                    if (parentWin.JSON && parentWin.JSON.parse && parentWin.JSON.stringify) {
                        try {
                            updatePayload = parentWin.JSON.parse(parentWin.JSON.stringify(patch));
                        } catch (e) {
                            updatePayload = patch;
                        }
                    }
                    await parentWin.updateDoc(parentWin.doc(parentWin.db, 'tasks', sideQuestEditingTaskId), updatePayload);
                    if (questTasksById && questTasksById[sideQuestEditingTaskId]) {
                        var existing = questTasksById[sideQuestEditingTaskId];
                        existing.title = baseEditable.title;
                        existing.description = baseEditable.description;
                        existing.priority = baseEditable.priority;
                        existing.start_date = baseEditable.start_date;
                        existing.due_date = baseEditable.due_date;
                        existing.points = baseEditable.points;
                        existing.departments = baseEditable.departments;
                        existing.positions = baseEditable.positions;
                        existing.assign_to = baseEditable.assign_to;
                        existing.notify_to = baseEditable.notify_to;
                        existing.tags = baseEditable.tags;
                        existing.files = baseEditable.files;
                    }
                }
                if (typeof loadSideQuestTasks === 'function') {
                    loadSideQuestTasks();
                }
                if (input) {
                    input.value = '';
                }
                if (startEl) {
                    startEl.value = '';
                }
                if (dueEl) {
                    dueEl.value = '';
                }
                if (pointsEl) {
                    pointsEl.value = '';
                }
                var tagHidden = document.getElementById('sideQuest-tags');
                if (tagHidden) {
                    tagHidden.value = '';
                }
                if (descEl) {
                    descEl.innerHTML = '';
                }
                Array.prototype.slice.call(
                    document.querySelectorAll('#sideQuestDepartmentDropdown input[type=\"checkbox\"]')
                ).forEach(function (cb) { cb.checked = false; });
                updateSideQuestDepartmentLabel();
                Array.prototype.slice.call(
                    document.querySelectorAll('#sideQuestPositionDropdown input[type=\"checkbox\"]')
                ).forEach(function (cb) { cb.checked = false; });
                updateSideQuestPositionLabel();
                Array.prototype.slice.call(
                    document.querySelectorAll('#sideQuestAssignDropdown input[type=\"checkbox\"]')
                ).forEach(function (cb) { cb.checked = false; });
                Array.prototype.slice.call(
                    document.querySelectorAll('#sideQuestNotifyDropdown input[type=\"checkbox\"]')
                ).forEach(function (cb) { cb.checked = false; });
                updateSideQuestUserLabel('sideQuestAssignDropdown', 'sideQuestAssignButtonLabel', 'Select user...', 'sideQuestAssignAvatars');
                updateSideQuestUserLabel('sideQuestNotifyDropdown', 'sideQuestNotifyButtonLabel', 'Select user...', 'sideQuestNotifyAvatars');
                var dropdown = document.getElementById('sideQuestCreateDropdown');
                if (dropdown) {
                    dropdown.classList.add('hidden');
                }
                sideQuestEditingTaskId = null;
                var saveBtn = document.getElementById('sideQuestSaveButton');
                if (saveBtn) {
                    saveBtn.textContent = 'Add Side Quest';
                }
                alert('Side Quest berhasil disimpan.');
            } catch (err) {
                console.error('Gagal menyimpan side quest', err);
                alert('Gagal menyimpan side quest: ' + (err && err.message ? err.message : String(err)));
            }
        }
        async function loadSideQuestTasks() {
            var urgentList = document.getElementById('sideQuestUrgentList');
            var highList = document.getElementById('sideQuestHighList');
            var normalList = document.getElementById('sideQuestNormalList');
            var lowList = document.getElementById('sideQuestLowList');
            if (!urgentList && !highList && !normalList && !lowList) return;
            var parentWin = window.parent;
            if (!parentWin || !parentWin.db || !parentWin.collection || !parentWin.getDocs) return;

            // Use global users if available, otherwise fetch
            var users = window.questUsersById || (window.parent && window.parent.questUsersById);
            if (!users || Object.keys(users).length === 0) {
                console.log('Users not found in global scope, loading via loadSideQuestUsersForForm');
                await loadSideQuestUsersForForm();
            } else {
                // Ensure local questUsersById is in sync
                questUsersById = users;
            }

            try {
                function esc(str) {
                    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                }
                function normalizeCollectionItems(arr) {
                    if (!Array.isArray(arr)) return [];
                    return arr.map(function (item) {
                        if (!item) return null;
                        if (typeof item === 'string') {
                            return { name: item, color: '', id: '' };
                        }
                        return {
                            id: item.id || '',
                            name: item.name || '',
                            color: item.color || ''
                        };
                    }).filter(function (x) { return x && x.name; });
                }
                var urgentCount = 0;
                var highCount = 0;
                var normalCount = 0;
                var lowCount = 0;
                var urgentCountEl = document.getElementById('sideQuestUrgentCount');
                var highCountEl = document.getElementById('sideQuestHighCount');
                var normalCountEl = document.getElementById('sideQuestNormalCount');
                var lowCountEl = document.getElementById('sideQuestLowCount');
                function setSideQuestCount(el, value) {
                    if (!el) return;
                    var v = value || 0;
                    if (v < 0) v = 0;
                    el.textContent = v < 10 ? '0' + v : String(v);
                }
                if (urgentList) urgentList.innerHTML = '';
                if (highList) highList.innerHTML = '';
                if (normalList) normalList.innerHTML = '';
                if (lowList) lowList.innerHTML = '';
                
                var totalSideQuestCount = 0;
                var fetchFn = typeof getTasksCached === 'function' ? getTasksCached : (window.parent && typeof window.parent.getTasksCached === 'function' ? window.parent.getTasksCached : null);
                var snap = fetchFn ? await fetchFn(parentWin) : await parentWin.getDocs(parentWin.collection(parentWin.db, 'tasks'));
                
                snap.forEach(function (docSnap) {
                    var data = docSnap.data() || {};
                    if (data.project_id || data.projectId) return;

                    var rawType = String(data.type || '');
                    var rawStatus = String(data.status || '');
                    var type = rawType.toLowerCase();
                    var status = rawStatus.toLowerCase();
                    var normType = type.replace(/[\s_]/g, '');
                    var normStatus = status.replace(/[\s_]/g, '');

                    var isSideQuest = false;
                    if (normType === 'sidequest' || type === 'side-quest') {
                        isSideQuest = true;
                    } else if (normStatus === 'sidequest') {
                        isSideQuest = true;
                    } else if (data.task_status) {
                        isSideQuest = true;
                    }
                    if (!isSideQuest) return;

                    if (normStatus !== 'complete' && !data.archived) {
                        totalSideQuestCount++;
                    }

                    if (normStatus === 'complete') return;

                    var taskId = String(docSnap.id || '');
                    // Pastikan task masuk ke questTasksById supaya questToggleComplete tahu statusnya
                    if (typeof questTasksById !== 'undefined') {
                        questTasksById[taskId] = data;
                    }
                    // Sinkronkan ke parent window jika tersedia
                    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
                        if (typeof window.parent.questTasksById !== 'undefined') {
                            window.parent.questTasksById[taskId] = data;
                        }
                    }

                    var title = data.title || 'Untitled Side Quest';
                    var priority = String(data.priority || 'normal').toLowerCase();
                    var targetList = null;
                    if (priority === 'urgent') {
                        targetList = urgentList;
                        if (targetList) urgentCount++;
                    } else if (priority === 'high') {
                        targetList = highList;
                        if (targetList) highCount++;
                    } else if (priority === 'low') {
                        targetList = lowList;
                        if (targetList) lowCount++;
                    } else {
                        targetList = normalList;
                        if (targetList) normalCount++;
                    }
                    if (!targetList) return;
                    var descHtml = data.description || '';
                    var tmp = document.createElement('div');
                    tmp.innerHTML = descHtml;
                    var descText = (tmp.textContent || tmp.innerText || '').trim();
                    var hasFiles = false;
                    if (descHtml && (descHtml.indexOf('<a ') !== -1 || descHtml.indexOf('href=') !== -1 || descHtml.indexOf('<img ') !== -1)) {
                        hasFiles = true;
                    }
                    if (!descText) {
                        descText = 'No description provided.';
                    }
                    var maxLen = 140;
                    var isLong = descText.length > maxLen;
                    if (isLong) {
                        var truncated = descText.substring(0, maxLen);
                        truncated = truncated.replace(/\s+\S*$/, '');
                        descText = truncated + '...';
                    }
                    var departments = normalizeCollectionItems(data.departments);
                    var positions = normalizeCollectionItems(data.positions);
                    var assignList = [];
                    if (data.assign_to) {
                        if (Array.isArray(data.assign_to)) {
                            assignList = data.assign_to.slice();
                        } else {
                            assignList = [data.assign_to];
                        }
                    }
                    var dueText = data.due_date || data.dueDate || '';
                    var el = document.createElement('div');
                    el.className = 'relative p-4 rounded-2xl bg-gray-50 flex flex-col gap-2 quest-card';
                    var headerRight = dueText ? String(dueText) : '';
                    var pointsValue = 0;
                    if (typeof data.points === 'number') {
                        pointsValue = data.points;
                    } else if (data.points) {
                        var parsedPoints = parseFloat(String(data.points));
                        if (!isNaN(parsedPoints)) {
                            pointsValue = parsedPoints;
                        }
                    }
                    var htmlCard = '';
                    htmlCard += '<div class="flex items-start justify-between gap-2">';
                    htmlCard += '<div class="flex items-start gap-2">';
                    htmlCard += '<button type="button" class="w-6 h-6 border-2 border-gray-300 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center bg-white quest-card-check-btn">';
                    htmlCard += '<i data-lucide="check" class="w-3 h-3 text-gray-400"></i>';
                    htmlCard += '</button>';
                    htmlCard += '<div class="flex flex-col gap-1">';
                    htmlCard += '<h3 class="font-semibold text-gray-900 text-sm md:text-base leading-snug">' + esc(title) + '</h3>';
                    htmlCard += '</div>';
                    htmlCard += '</div>';
                    htmlCard += '<div class="flex items-start gap-2">';
                    htmlCard += '<div class="flex flex-col items-end gap-1">';
                    if (headerRight) {
                        htmlCard += '<span class="inline-flex items-center px-2.5 py-1 rounded-full bg-red-500 text-white text-[10px] md:text-xs font-semibold">';
                        htmlCard += esc(headerRight);
                        htmlCard += '</span>';
                    }
                    if (pointsValue > 0) {
                        htmlCard += '<span class="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 text-[10px] md:text-xs font-semibold">';
                        htmlCard += esc(String(pointsValue) + ' XP');
                        htmlCard += '</span>';
                    }
                    htmlCard += '</div>';
                    htmlCard += '<div class="quest-card-actions hidden">';
                    htmlCard += '<button type="button" class="quest-card-delete-btn">';
                    htmlCard += '<i data-lucide="trash" class="w-4 h-4 text-red-500"></i>';
                    htmlCard += '</button>';
                    htmlCard += '</div>';
                    htmlCard += '</div>';
                    htmlCard += '</div>';
                    if (descText) {
                        htmlCard += '<p class="text-xs md:text-sm text-gray-600 leading-snug">' +
                            esc(descText) +
                            ((hasFiles || isLong)
                                ? ' <button type="button" class="text-xs font-semibold text-blue-600 hover:underline sidequest-more-link">more</button>'
                                : '') +
                            '</p>';
                    }
                    if (departments.length > 0) {
                        htmlCard += '<div class="flex flex-wrap gap-2 mt-1">';
                        departments.forEach(function (dept, index) {
                            if (index >= 3) return;
                            var color = dept.color || '#0B2B6A';
                            htmlCard += '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-medium text-white" style="background-color:' + esc(color) + ';">';
                            htmlCard += esc(dept.name);
                            htmlCard += '</span>';
                        });
                        if (departments.length > 3) {
                            htmlCard += '<span class="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] md:text-xs font-medium">+' + esc(String(departments.length - 3)) + ' more</span>';
                        }
                        htmlCard += '</div>';
                    }
                    if (positions.length > 0) {
                        htmlCard += '<div class="flex flex-wrap gap-2 mt-1">';
                        positions.forEach(function (pos, index) {
                            if (index >= 4) return;
                            htmlCard += '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] md:text-xs font-medium border border-slate-200">';
                            htmlCard += esc(pos.name);
                            htmlCard += '</span>';
                        });
                        if (positions.length > 4) {
                            htmlCard += '<span class="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] md:text-xs font-medium">+' + esc(String(positions.length - 4)) + '</span>';
                        }
                        htmlCard += '</div>';
                    }
                    if (assignList.length > 0) {
                        htmlCard += '<div class="flex items-center justify-between gap-2 mt-2">';
                        htmlCard += '<div class="flex -space-x-1">';
                        var maxAvatars = 4;
                        assignList.forEach(function (uid, index) {
                            if (index >= maxAvatars) return;
                            var user = questUsersById && questUsersById[uid] ? questUsersById[uid] : { uid: uid };
                            var src = user.name || user.email || user.uid || '';
                            var initials;
                            if (!src) {
                                initials = 'U';
                            } else {
                                var parts = String(src).trim().split(/\s+/);
                                initials = parts.map(function (p) { return p[0]; }).join('');
                                initials = initials.substring(0, 2).toUpperCase();
                            }
                            var titleText = user && user.name ? user.name : initials;
                            if (user.photo && !user.photo.includes('pravatar.cc')) {
                                htmlCard += '<img src="' + esc(user.photo) + '" alt="' + esc(titleText) + '" title="' + esc(titleText) + '" class="w-7 h-7 rounded-full object-cover border border-gray-200 bg-white">';
                            } else {
                                htmlCard += '<span class="w-7 h-7 rounded-full bg-slate-700 text-slate-100 text-[10px] font-semibold flex items-center justify-center border border-gray-200" title="' + esc(titleText) + '">';
                                htmlCard += esc(initials);
                                htmlCard += '</span>';
                            }
                        });
                        if (assignList.length > maxAvatars) {
                            var remaining = assignList.length - maxAvatars;
                            htmlCard += '<span class="w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-[10px] font-semibold flex items-center justify-center border border-gray-200">+' + esc(String(remaining)) + '</span>';
                        }
                        htmlCard += '</div>';
                        htmlCard += '</div>';
                    }

                    // Report Accordion
                    htmlCard += '<div id="report-accordion-' + taskId + '" class="hidden mt-3 border-t border-gray-100 pt-3">';
                    htmlCard += '  <div class="mb-3">';
                    htmlCard += '    <label class="block text-xs font-medium text-gray-600 mb-1">Optional : Attach files</label>';
                    htmlCard += '    <input type="file" id="reportFileInput-' + taskId + '" multiple class="block w-full text-xs text-gray-700 border border-gray-200 rounded-xl bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"/>';
                    htmlCard += '  </div>';
                    htmlCard += '  <div class="rich-editor mb-3">';
                    htmlCard += '    <div class="rich-toolbar">';
                    htmlCard += '      <div class="rich-toolbar-left">';
                    htmlCard += '        <button type="button" class="rich-btn" title="Bold" data-editor-id="reportEditor-' + taskId + '" data-command="bold"><i class="bi bi-type-bold"></i></button>';
                    htmlCard += '        <button type="button" class="rich-btn" title="Italic" data-editor-id="reportEditor-' + taskId + '" data-command="italic"><i class="bi bi-type-italic"></i></button>';
                    htmlCard += '        <button type="button" class="rich-btn" title="Underline" data-editor-id="reportEditor-' + taskId + '" data-command="underline"><i class="bi bi-type-underline"></i></button>';
                    htmlCard += '        <div class="w-px h-4 bg-gray-300 mx-1"></div>';
                    htmlCard += '        <button type="button" class="rich-btn" title="Bullet List" data-editor-id="reportEditor-' + taskId + '" data-command="insertUnorderedList"><i class="bi bi-list-ul"></i></button>';
                    htmlCard += '        <button type="button" class="rich-btn" title="Numbered List" data-editor-id="reportEditor-' + taskId + '" data-command="insertOrderedList"><i class="bi bi-list-ol"></i></button>';
                    htmlCard += '        <div class="w-px h-4 bg-gray-300 mx-1"></div>';
                    htmlCard += '        <button type="button" class="rich-btn" title="Add Link" data-editor-id="reportEditor-' + taskId + '" data-command="link"><i class="bi bi-link-45deg"></i></button>';
                    htmlCard += '      </div>';
                    htmlCard += '      <div class="rich-toolbar-right">';
                    htmlCard += '        <button type="button" class="rich-btn" title="Add Files" data-task-id="' + taskId + '" data-action="add-file"><i class="bi bi-paperclip"></i></button>';
                    htmlCard += '      </div>';
                    htmlCard += '    </div>';
                    htmlCard += '    <div id="reportEditor-' + taskId + '" class="rich-editor-body outline-none" contenteditable="true" data-placeholder="Insert your report here..."></div>';
                    htmlCard += '  </div>';
                    htmlCard += '  <div class="flex justify-end gap-2">';
                    htmlCard += '    <button type="button" class="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full cancel-report-btn" data-task-id="' + taskId + '">Cancel</button>';
                    htmlCard += '    <button type="button" class="px-4 py-2 text-xs font-semibold text-white btn-dlg-blue rounded-full submit-report-btn" data-task-id="' + taskId + '">Submit Report</button>';
                    htmlCard += '  </div>';
                    htmlCard += '</div>';

                    el.innerHTML = htmlCard;
                    (function () {
                        var editorId = 'reportEditor-' + taskId;
                        var toolbarButtons = el.querySelectorAll('[data-editor-id="' + editorId + '"][data-command]');
                        Array.prototype.slice.call(toolbarButtons).forEach(function (tb) {
                            var cmd = tb.getAttribute('data-command');
                            tb.addEventListener('click', function (e) {
                                if (e && e.preventDefault) e.preventDefault();
                                if (!cmd) return;
                                if (cmd === 'link') {
                                    addLinkToEditor(editorId);
                                } else {
                                    applyFormat(editorId, cmd);
                                }
                            });
                        });
                        var fileBtn = el.querySelector('[data-action="add-file"][data-task-id="' + taskId + '"]');
                        if (fileBtn) {
                            fileBtn.addEventListener('click', function () {
                                var fileInput = document.getElementById('reportFileInput-' + taskId);
                                if (fileInput) {
                                    if (typeof fileInput.showPicker === 'function') {
                                        try {
                                            fileInput.showPicker();
                                        } catch (e) {
                                            fileInput.click();
                                        }
                                    } else {
                                        fileInput.click();
                                    }
                                }
                            });
                        }
                        var fileInput = el.querySelector('#reportFileInput-' + taskId);
                        if (fileInput) {
                            fileInput.addEventListener('change', function () {
                                handleSideQuestFiles(this);
                            });
                        }
                        var cancelBtn = el.querySelector('.cancel-report-btn[data-task-id="' + taskId + '"]');
                        if (cancelBtn) {
                            cancelBtn.addEventListener('click', function () {
                                toggleReportAccordion(taskId);
                            });
                        }
                        var submitBtn = el.querySelector('.submit-report-btn[data-task-id="' + taskId + '"]');
                        if (submitBtn) {
                            submitBtn.addEventListener('click', function () {
                                submitSideQuestReport(taskId);
                            });
                        }
                        var moreBtn = el.querySelector('.sidequest-more-link');
                        if (moreBtn && taskId) {
                            moreBtn.addEventListener('click', function (evt) {
                                if (evt && evt.stopPropagation) {
                                    evt.stopPropagation();
                                }
                                var fullHtml = '';
                                var stores = [
                                    typeof questTasksById !== 'undefined' ? questTasksById : null,
                                    window.questTasksById,
                                    typeof window !== 'undefined' && window.parent ? window.parent.questTasksById : null
                                ];
                                for (var i = 0; i < stores.length; i++) {
                                    if (stores[i] && stores[i][taskId] && (stores[i][taskId].description || stores[i][taskId].desc)) {
                                        fullHtml = String(stores[i][taskId].description || stores[i][taskId].desc);
                                        break;
                                    }
                                }
                                if (!fullHtml) {
                                    var p = moreBtn.closest('p');
                                    if (p) {
                                        var pClone = p.cloneNode(true);
                                        var mBtn = pClone.querySelector('.sidequest-more-link');
                                        if (mBtn) mBtn.remove();
                                        fullHtml = pClone.innerHTML;
                                    }
                                }
                                openSideQuestDetailModal(taskId, fullHtml);
                            });
                        }
                    })();
                    el.setAttribute('data-task-id', String(docSnap.id || ''));
                    var btn = el.querySelector('.quest-card-check-btn');
                    var deleteBtn = el.querySelector('.quest-card-delete-btn');

                    // Set tampilan awal jika sudah complete
                    var isTaskComplete = status === 'complete';
                    if (isTaskComplete && btn) {
                        btn.classList.add('bg-emerald-500', 'border-emerald-500', 'text-white');
                        var icon = btn.querySelector('i');
                        if (icon) {
                            icon.classList.remove('text-gray-400');
                            icon.classList.add('text-white');
                        }
                    }

                    if (btn && taskId) {
                        btn.addEventListener('click', function (evt) {
                            if (evt && evt.stopPropagation) {
                                evt.stopPropagation();
                            }
                            if (questActionMode === 'edit') {
                                questEditTask(taskId);
                            } else if (questActionMode === 'delete') {
                                questDeleteTask(taskId);
                            } else {
                                btn.classList.add('bg-emerald-500', 'border-emerald-500', 'text-white');
                                var icon = btn.querySelector('i');
                                if (icon) {
                                    icon.classList.remove('text-gray-400');
                                    icon.classList.add('text-white');
                                }
                                toggleReportAccordion(taskId);
                            }
                        });
                    }

                    // Bind rich text toolbar actions for this task's report editor
                    (function () {
                        var editorId = 'reportEditor-' + taskId;
                        var toolbarButtons = el.querySelectorAll('[data-editor-id="' + editorId + '"][data-command]');
                        Array.prototype.slice.call(toolbarButtons).forEach(function (tb) {
                            var cmd = tb.getAttribute('data-command');
                            tb.addEventListener('click', function (e) {
                                if (e && e.preventDefault) e.preventDefault();
                                if (!cmd) return;
                                if (cmd === 'link') {
                                    addLinkToEditor(editorId);
                                } else {
                                    applyFormat(editorId, cmd);
                                }
                            });
                        });
                    })();
                    if (deleteBtn && taskId) {
                        deleteBtn.addEventListener('click', function (evt) {
                            if (evt && evt.stopPropagation) {
                                evt.stopPropagation();
                            }
                            questDeleteTask(taskId);
                        });
                    }
                    targetList.appendChild(el);
                });
                function ensureList(listEl, message) {
                    if (!listEl) return;
                    if (!listEl.innerHTML.trim()) {
                        listEl.innerHTML = '<p class="text-gray-400 italic text-sm">' + esc(message) + '</p>';
                    }
                }
                ensureList(urgentList, 'No urgent side quests yet.');
                ensureList(highList, 'No high side quests yet.');
                ensureList(normalList, 'No normal side quests yet.');
                ensureList(lowList, 'No low side quests yet.');
                setSideQuestCount(urgentCountEl, urgentCount);
                setSideQuestCount(highCountEl, highCount);
                setSideQuestCount(normalCountEl, normalCount);
                setSideQuestCount(lowCountEl, lowCount);

                var sideCountEl = document.getElementById('sideQuestCount');
                if (sideCountEl) {
                    sideCountEl.textContent = totalSideQuestCount;
                }

                if (window.lucide && window.lucide.createIcons) {
                    window.lucide.createIcons();
                }
                updateSideQuestActionButtons();
            } catch (e) {
                console.error('Failed to load side quests', e);
                if (urgentList) urgentList.innerHTML = '<p class="text-red-500 text-xs">Failed to load side quests.</p>';
                if (highList) highList.innerHTML = '<p class="text-red-500 text-xs">Failed to load side quests.</p>';
                if (normalList) normalList.innerHTML = '<p class="text-red-500 text-xs">Failed to load side quests.</p>';
                if (lowList) lowList.innerHTML = '<p class="text-red-500 text-xs">Failed to load side quests.</p>';
            }
        }
        function updateSideQuestActionButtons() {
            var actionContainers = document.querySelectorAll('.quest-card-actions');
            var deleteButtons = document.querySelectorAll('.quest-card-delete-btn');
            var cards = document.querySelectorAll('.quest-card');
            var checkButtons = document.querySelectorAll('.quest-card-check-btn');
            if (questActionMode === 'edit') {
                actionContainers.forEach(function (el) { el.classList.remove('hidden'); });
                deleteButtons.forEach(function (el) { el.classList.add('hidden'); });
                cards.forEach(function (card) { card.setAttribute('title', 'Click for Edit'); });
                checkButtons.forEach(function (btn) {
                    var originalClass = btn.getAttribute('data-original-class');
                    var originalHtml = btn.getAttribute('data-original-html');
                    if (!originalClass) {
                        btn.setAttribute('data-original-class', btn.className);
                    }
                    if (!originalHtml) {
                        btn.setAttribute('data-original-html', btn.innerHTML);
                    }
                    btn.className = 'px-3 py-1 text-xs font-semibold rounded-full border border-blue-500 text-blue-600 quest-card-check-btn';
                    btn.textContent = 'Edit';
                });
            } else if (questActionMode === 'delete') {
                actionContainers.forEach(function (el) { el.classList.remove('hidden'); });
                deleteButtons.forEach(function (el) { el.classList.remove('hidden'); });
                cards.forEach(function (card) { card.removeAttribute('title'); });
                checkButtons.forEach(function (btn) {
                    var originalClass = btn.getAttribute('data-original-class');
                    var originalHtml = btn.getAttribute('data-original-html');
                    if (originalClass) {
                        btn.className = originalClass;
                    }
                    if (originalHtml) {
                        btn.innerHTML = originalHtml;
                    }
                });
            } else {
                actionContainers.forEach(function (el) { el.classList.add('hidden'); });
                cards.forEach(function (card) { card.removeAttribute('title'); });
                checkButtons.forEach(function (btn) {
                    var originalClass = btn.getAttribute('data-original-class');
                    var originalHtml = btn.getAttribute('data-original-html');
                    if (originalClass) {
                        btn.className = originalClass;
                    }
                    if (originalHtml) {
                        btn.innerHTML = originalHtml;
                    }
                });
            }
        }
        function updateSideQuestHeaderToggleButton() {
            var btn = document.getElementById('sideQuestHeaderToggleButton');
            if (!btn) return;
            if (questActionMode === 'edit') {
                btn.className = 'px-4 py-1.5 text-xs font-semibold rounded-full border border-blue-500 text-blue-600 bg-white shadow-sm';
                btn.textContent = 'Exit Edit';
            } else if (questActionMode === 'delete') {
                btn.className = 'px-4 py-1.5 text-xs font-semibold rounded-full border border-red-500 text-red-600 bg-white shadow-sm';
                btn.textContent = 'Exit Delete';
            } else {
                btn.className = 'w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm';
                btn.innerHTML = '<i data-lucide="more-vertical" class="w-4 h-4 text-gray-600"></i>';
                if (window.lucide && window.lucide.createIcons) {
                    window.lucide.createIcons();
                }
            }
        }
        function toggleSideQuestHeaderMenu(event) {
            var menu = document.getElementById('sideQuestHeaderMenu');
            if (!menu) return;
            if (event && event.stopPropagation) {
                event.stopPropagation();
            }
            if (questActionMode === 'edit' || questActionMode === 'delete') {
                questActionMode = null;
                updateSideQuestActionButtons();
                updateSideQuestHeaderToggleButton();
                return;
            }
            if (menu.classList.contains('hidden')) {
                menu.classList.remove('hidden');
            } else {
                menu.classList.add('hidden');
            }
        }
        function sideQuestHeaderEdit() {
            var menu = document.getElementById('sideQuestHeaderMenu');
            if (menu) {
                menu.classList.add('hidden');
            }
            if (questActionMode === 'edit') {
                questActionMode = null;
            } else {
                questActionMode = 'edit';
            }
            updateSideQuestActionButtons();
            updateSideQuestHeaderToggleButton();
        }
        function sideQuestHeaderDelete() {
            var menu = document.getElementById('sideQuestHeaderMenu');
            if (menu) {
                menu.classList.add('hidden');
            }
            if (questActionMode === 'delete') {
                questActionMode = null;
            } else {
                questActionMode = 'delete';
            }
            updateSideQuestActionButtons();
            updateSideQuestHeaderToggleButton();
        }
        function loadSideQuestUsersForForm() {
            var parentWin = window.parent;
            var assignList = document.getElementById('sideQuestAssignList');
            var notifyList = document.getElementById('sideQuestNotifyList');
            
            if (!parentWin || !parentWin.db || !parentWin.collection || !parentWin.getDocs) {
                if (assignList) assignList.innerHTML = '<div class="text-red-500 text-xs">Users not available.</div>';
                if (notifyList) notifyList.innerHTML = '<div class="text-red-500 text-xs">Users not available.</div>';
                return Promise.resolve();
            }

            return parentWin.getDocs(parentWin.collection(parentWin.db, 'users')).then(function (snap) {
                var users = [];
                var usersMap = {};
                snap.forEach(function (docSnap) {
                    var d = docSnap.data() || {};
                    var u = {
                        uid: docSnap.id,
                        name: d.name || d.email || 'Unknown',
                        email: d.email || '',
                        photo: d.photo || ''
                    };
                    users.push(u);
                    usersMap[docSnap.id] = u;
                });
                questUsersById = usersMap;
                // Sync to global/parent scope
                window.questUsersById = usersMap;
                if (window.parent && window.parent !== window) {
                    window.parent.questUsersById = usersMap;
                }

                users.sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                });

                if (!assignList && !notifyList) return;
                
                if (assignList) {
                    assignList.innerHTML = '';
                    var baseUsers = users.slice();
                    function renderAssign(list) {
                        assignList.innerHTML = '';
                        list.forEach(function (user) {
                            var row = document.createElement('div');
                            row.className = 'quest-user-option flex items-center gap-3 px-2 py-2 hover:bg-slate-800 rounded-xl cursor-pointer';
                            var initials = computeInitials(user);
                            var avatar;
                            if (user.photo && !user.photo.includes('pravatar.cc')) {
                                avatar = '<img src="' + user.photo + '" alt="' + user.name + '" class="w-8 h-8 rounded-full object-cover border border-slate-700">';
                            } else {
                                avatar = '<span class="w-8 h-8 rounded-full bg-slate-700 text-slate-100 text-[10px] font-semibold flex items-center justify-center">' + initials + '</span>';
                            }
                            row.innerHTML =
                                '<div class="flex items-center gap-3 flex-1">' +
                                    avatar +
                                    '<span class="quest-user-name text-xs md:text-sm text-white">' + user.name + '</span>' +
                                '</div>' +
                                '<input type="checkbox" class="ml-2 accent-sky-500" data-user-id="' + user.uid + '">';
                            assignList.appendChild(row);
                            var checkbox = row.querySelector('input[type="checkbox"]');
                            checkbox.addEventListener('change', function () {
                                updateSideQuestUserLabel('sideQuestAssignDropdown', 'sideQuestAssignButtonLabel', 'Select user...', 'sideQuestAssignAvatars');
                            });
                            row.addEventListener('click', function (e) {
                                if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'input') {
                                    return;
                                }
                                checkbox.checked = !checkbox.checked;
                                updateSideQuestUserLabel('sideQuestAssignDropdown', 'sideQuestAssignButtonLabel', 'Select user...', 'sideQuestAssignAvatars');
                            });
                        });
                        if (!assignList.innerHTML.trim()) {
                            assignList.innerHTML = '<div class="text-slate-500 text-xs">No users found.</div>';
                        } else {
                            updateSideQuestUserLabel('sideQuestAssignDropdown', 'sideQuestAssignButtonLabel', 'Select user...', 'sideQuestAssignAvatars');
                        }
                    }
                    renderAssign(baseUsers);
                    var assignSearch = document.getElementById('sideQuestAssignSearch');
                    if (assignSearch) {
                        assignSearch.addEventListener('input', function () {
                            var filtered = filterUsers(baseUsers, assignSearch.value);
                            renderAssign(filtered);
                        });
                    }
                }
                if (notifyList) {
                    notifyList.innerHTML = '';
                    var baseUsersNotify = users.slice();
                    function renderNotify(listN) {
                        notifyList.innerHTML = '';
                        listN.forEach(function (user) {
                            var row2 = document.createElement('div');
                            row2.className = 'quest-user-option flex items-center gap-3 px-2 py-2 hover:bg-slate-800 rounded-xl cursor-pointer';
                            var initials2 = computeInitials(user);
                            var avatar2;
                            if (user.photo && !user.photo.includes('pravatar.cc')) {
                                avatar2 = '<img src="' + user.photo + '" alt="' + user.name + '" class="w-8 h-8 rounded-full object-cover border border-slate-700">';
                            } else {
                                avatar2 = '<span class="w-8 h-8 rounded-full bg-slate-700 text-slate-100 text-[10px] font-semibold flex items-center justify-center">' + initials2 + '</span>';
                            }
                            row2.innerHTML =
                                '<div class="flex items-center gap-3 flex-1">' +
                                    avatar2 +
                                    '<span class="quest-user-name text-xs md:text-sm text-white">' + user.name + '</span>' +
                                '</div>' +
                                '<input type="checkbox" class="ml-2 accent-sky-500" data-user-id="' + user.uid + '">';
                            notifyList.appendChild(row2);
                            var cb2 = row2.querySelector('input[type="checkbox"]');
                            cb2.addEventListener('change', function () {
                                updateSideQuestUserLabel('sideQuestNotifyDropdown', 'sideQuestNotifyButtonLabel', 'Select user...', 'sideQuestNotifyAvatars');
                            });
                            row2.addEventListener('click', function (e) {
                                if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'input') {
                                    return;
                                }
                                cb2.checked = !cb2.checked;
                                updateSideQuestUserLabel('sideQuestNotifyDropdown', 'sideQuestNotifyButtonLabel', 'Select user...', 'sideQuestNotifyAvatars');
                            });
                        });
                        if (!notifyList.innerHTML.trim()) {
                            notifyList.innerHTML = '<div class="text-slate-500 text-xs">No users found.</div>';
                        } else {
                            updateSideQuestUserLabel('sideQuestNotifyDropdown', 'sideQuestNotifyButtonLabel', 'Select user...', 'sideQuestNotifyAvatars');
                        }
                    }
                    renderNotify(baseUsersNotify);
                    var notifySearch = document.getElementById('sideQuestNotifySearch');
                    if (notifySearch) {
                        notifySearch.addEventListener('input', function () {
                            var filteredN = filterUsers(baseUsersNotify, notifySearch.value);
                            renderNotify(filteredN);
                        });
                    }
                }
                if (typeof renderReports === 'function') {
                    renderReports();
                }
                if (typeof updateActiveReportModalUsers === 'function') {
                    updateActiveReportModalUsers();
                }
            }).catch(function (e) {
                console.error('Failed to load users for side quest', e);
                if (assignList) assignList.innerHTML = '<div class="text-red-500 text-xs">Failed to load users.</div>';
                if (notifyList) notifyList.innerHTML = '<div class="text-red-500 text-xs">Failed to load users.</div>';
            });
        }
        document.addEventListener('click', function (event) {
            var target = event.target;
            var dropdown = document.getElementById('sideQuestCreateDropdown');
            if (dropdown) {
                var trigger = dropdown.previousElementSibling;
                var insideDropdown = dropdown.contains(target);
                var insideTrigger = trigger && trigger.contains(target);
                if (!insideDropdown && !insideTrigger && !dropdown.classList.contains('hidden')) {
                    dropdown.classList.add('hidden');
                }
            }
            var menu = document.getElementById('sideQuestHeaderMenu');
            if (menu) {
                var btn = document.getElementById('sideQuestHeaderToggleButton');
                var insideMenu = menu.contains(target);
                var insideBtn = btn && btn.contains(target);
                if (!insideMenu && !insideBtn && !menu.classList.contains('hidden')) {
                    menu.classList.add('hidden');
                }
            }
            var assignDropdown = document.getElementById('sideQuestAssignDropdown');
            if (assignDropdown) {
                var assignTrigger = assignDropdown.previousElementSibling;
                var insideAssignDrop = assignDropdown.contains(target);
                var insideAssignTrig = assignTrigger && assignTrigger.contains(target);
                if (!insideAssignDrop && !insideAssignTrig && !assignDropdown.classList.contains('hidden')) {
                    assignDropdown.classList.add('hidden');
                }
            }
            var notifyDropdown = document.getElementById('sideQuestNotifyDropdown');
            if (notifyDropdown) {
                var notifyTrigger = notifyDropdown.previousElementSibling;
                var insideNotifyDrop = notifyDropdown.contains(target);
                var insideNotifyTrig = notifyTrigger && notifyTrigger.contains(target);
                if (!insideNotifyDrop && !insideNotifyTrig && !notifyDropdown.classList.contains('hidden')) {
                    notifyDropdown.classList.add('hidden');
                }
            }
            var tagDropdown = document.getElementById('sideQuest-tag-dropdown');
            if (tagDropdown) {
                var tagTrigger = document.getElementById('tag-selector-sidequest');
                var insideTagDrop = tagDropdown.contains(target);
                var insideTagTrig = tagTrigger && tagTrigger.contains(target);
                if (!insideTagDrop && !insideTagTrig && tagDropdown.style.display === 'block') {
                    tagDropdown.style.display = 'none';
                }
            }
        });
        loadSideQuestUsersForForm();
        loadSideQuestDepartments();
        loadSideQuestPositions();
        
        // Expose functions to global scope within iframe
        window.loadSideQuestUsersForForm = loadSideQuestUsersForForm;
        window.loadSideQuestDepartments = loadSideQuestDepartments;
        window.loadSideQuestPositions = loadSideQuestPositions;
        if (typeof loadSideQuestTasks === 'function') {
            window.loadSideQuestTasks = loadSideQuestTasks;
            loadSideQuestTasks();
        } else if (window.parent && typeof window.parent.loadSideQuestTasks === 'function') {
            loadSideQuestTasks();
        }
    </script>
</body>
</html>`;
            if (frame) {
                frame.removeAttribute('src');
                frame.onload = function() {
                    try {
                        if (frame.contentWindow) {
                            if (window.openSideQuestDescription) {
                                frame.contentWindow.openSideQuestDescription = window.openSideQuestDescription;
                                console.log('Injected openSideQuestDescription into Side Quest iframe (instance 3)');
                            } else {
                                console.warn('window.openSideQuestDescription not available to inject into Side Quest iframe');
                            }
                        }
                    } catch (e) {
                        console.error('Failed to inject openSideQuestDescription into Side Quest iframe', e);
                    }
                };
                frame.srcdoc = html;
            }
            if (modalEl && typeof bootstrap !== "undefined" && bootstrap.Modal) {
                const overlay = document.getElementById('questBoardOverlay');
                if (overlay) {
                    overlay.classList.add('show');
                }
                modalEl.addEventListener('hidden.bs.modal', () => {
                    const ov = document.getElementById('questBoardOverlay');
                    if (ov) {
                        ov.classList.remove('show');
                    }
                }, { once: true });
                const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
                modal.show();
            } else {
                var newWin = window.open('', '_blank');
                if (newWin && newWin.document) {
                    newWin.document.open();
                    newWin.document.write(html);
                    newWin.document.close();
                }
            }
        });
    }
}

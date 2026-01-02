export function renderSidebar(target) {
    if (!target) return;
    target.innerHTML = `
        <style>
            #questBoardModal {
                padding: 0;
            }
            #questBoardModal .modal-dialog {
                position: fixed;
                top: 70px;
                left: 290px;
                right: 0;
                margin: 0;
                width: auto;
                margin : 20px;
                max-width: none;
                height: calc(100vh - 120px);
            }
            #questBoardModal .modal-content {
                height: 100%;
                border-radius: 16px;
                background: #ffffff;
                box-shadow: 0px 7px 9px -6px rgba(114, 4, 207, 1);
                border: 0;
            }
            #questBoardModal .modal-body {
                height: 100%;
                padding: 0;
            }
            #questBoardModal #questBoardFrame {
                width: 100%;
                height: 100%;
                border: 0;
            }
            #questBoardOverlay {
                position: fixed;
                inset: 0;
                
                z-index: 1049;
                display: none;
            }
            #questBoardOverlay.show {
                display: block;
            }
        </style>
        <!-- 2. SIDEBAR (Light, Smart Filters, Pending Widget) -->
        <aside class="sidebar" id="sidebarNav">
            
            <!-- WRAPPER UNTUK AREA YANG BISA DI-SCROLL -->
            <div class="sidebar-scroll-wrapper">
                
                <!-- Smart Filters (4 Kotak Besar) -->
                <div class="smart-filters-grid">
                    <a href="#" class="filter-card">
                        <div class="filter-top"><div class="filter-icon" style="background-color: var(--dlg-blue);"><i class="bi bi-archive-fill"></i></div><div class="filter-count">429</div></div>
                        <div class="filter-label">Main Quest</div>
                    </a>
                    <a href="#" class="filter-card">
                        <div class="filter-top"><div class="filter-icon" style="background-color: var(--dlg-yellow);"><i class="bi bi-archive-fill"></i></div><div class="filter-count">429</div></div>
                        <div class="filter-label">Side Quest</div>
                    </a>
                    <a href="#" class="filter-card">
                        <div class="filter-top"><div class="filter-icon" style="background-color: var(--dlg-green);"><i class="bi bi-calendar-event-fill"></i></div><div class="filter-count" id="projectTasksTotalCount">0</div></div>
                        <div class="filter-label">Project</div>
                    </a>
                    <a href="#" class="filter-card">
                        <div class="filter-top"><div class="filter-icon bg-icon-orange"><i class="bi bi-flag-fill"></i></div><div class="filter-count">21</div></div>
                        <div class="filter-label">Files</div>
                    </a>
                    <a href="#" class="filter-card">
                        <div class="filter-top"><div class="filter-icon bg-icon-red"><i class="bi bi-calendar-check-fill"></i></div><div class="filter-count">30</div></div>
                        <div class="filter-label">Reminder</div>
                    </a>
                </div>

                <!-- Navigation Links -->
                <div class="nav-category">Main Navigation</div>
                <a href="#" class="sidebar-link active"><i class="bi bi-columns-gap"></i> Dashboard</a>
                <a href="#" class="sidebar-link"><i class="bi bi-list-columns-reverse"></i> Lineup <span class="sidebar-badge">4</span></a>
                <a href="#" class="sidebar-link"><i class="bi bi-chat-dots"></i> Pings</a>
                <a href="#" class="sidebar-link"><i class="bi bi-bell"></i> Hey!</a>
                <a href="#" class="sidebar-link"><i class="bi bi-activity"></i> Activity</a>
                <a href="#" class="sidebar-link"><i class="bi bi-person-circle"></i> My Stuff</a>

                <div class="nav-category mt-4">System</div>
                <a href="#" class="sidebar-link"><i class="bi bi-gear"></i> Settings</a>
                <a href="#" class="sidebar-link text-danger"><i class="bi bi-box-arrow-right"></i> Logout</a>

            </div> <!-- End Scroll Wrapper -->

            <!-- PENDING WIDGET (Pinned di Bawah, di luar scroll wrapper) -->
            <div class="pending-widget">
                <div class="fire-icon-wrapper"><i class="bi bi-fire fire-icon"></i></div>
                <h6 class="fw-bold" style="color:#0B2B6A; margin-bottom: 5px;">Pending Tasks</h6>
                <p class="small text-muted mb-3">You have 5 approvals waiting.</p>
                <button class="btn-review">Review Now</button>
                
                <!-- COPYRIGHT (Muncul hanya saat scroll mentok bawah) -->
                <div class="sidebarCopyright">
                    &copy; 2025 PT Dialogika Persona Indonesia
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
        `;

    const questCard = target.querySelector('.smart-filters-grid .filter-card');
    if (questCard) {
        questCard.addEventListener('click', (e) => {
            e.preventDefault();
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
            position: relative;
            background: #ffffff;
        }
        .rich-toolbar {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 6px 8px;
            background: #f9fafb;
            border-bottom: 1px solid #e5e7eb;
        }
        .rich-btn {
            border: none;
            background: transparent;
            padding: 4px 8px;
            border-radius: 999px;
            font-size: 0.8rem;
            color: #4b5563;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        .rich-btn:hover {
            background: #e5e7eb;
            color: #111827;
        }
        .rich-editor-body {
            min-height: 120px;
            padding: 10px 14px;
            font-size: 0.9rem;
            outline: none;
        }
        .rich-editor-body:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
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
            <div class="border border-gray-200 rounded-2xl overflow-hidden mb-6">
                <div class="rich-editor">
                    <div class="rich-toolbar">
                        <button type="button" class="rich-btn" onclick="questApplyFormat('questDescEditor','bold')"><i class="bi bi-type-bold"></i></button>
                        <button type="button" class="rich-btn" onclick="questApplyFormat('questDescEditor','italic')"><i class="bi bi-type-italic"></i></button>
                        <button type="button" class="rich-btn" onclick="questApplyFormat('questDescEditor','underline')"><i class="bi bi-type-underline"></i></button>
                        <button type="button" class="rich-btn" onclick="questApplyFormat('questDescEditor','insertUnorderedList')"><i class="bi bi-list-ul"></i></button>
                        <button type="button" class="rich-btn" onclick="questApplyFormat('questDescEditor','insertOrderedList')"><i class="bi bi-list-ol"></i></button>
                        <button type="button" class="rich-btn ms-auto" onclick="questTriggerDescFileInput()"><i class="bi bi-paperclip"></i></button>
                    </div>
                    <div id="questDescEditor" class="rich-editor-body min-h-[120px] px-4 py-3 text-sm text-gray-700 outline-none" contenteditable="true" data-placeholder="Task description or notes..."></div>
                    <input type="file" id="quest-desc-file-input" multiple style="display:none" onchange="questHandleDescFiles(this)">
                </div>
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
            <h2 class="text-2xl font-bold mb-6">Todays</h2>
            <div class="space-y-6" id="questTodayList">
            </div>
        </section>

        <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6">Upcoming</h2>
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

    <script>
        lucide.createIcons();
        var questCurrentPriority = 'urgent';
        var sideQuestCurrentPriority = 'normal';
        var questActionMode = null;
        var questTasksById = {};
        var questUsersById = {};
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

        function switchTab(priority, element) {
            document.querySelectorAll('.nav-card').forEach(card => card.classList.remove('active'));
            element.classList.add('active');
            questCurrentPriority = priority;

            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.add('hidden'));
            document.getElementById(priority + '-content').classList.remove('hidden');
        }
        function toggleQuestForm() {
            var el = document.getElementById('questCreateForm');
            if (!el) return;
            if (el.classList.contains('hidden')) {
                el.classList.remove('hidden');
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                el.classList.add('hidden');
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
        function applyFormat(editorId, command) {
            var editor = document.getElementById(editorId);
            if (!editor) return;
            editor.focus();
            document.execCommand(command, false, null);
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
            if (dropdown.classList.contains('hidden')) {
                dropdown.classList.remove('hidden');
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
            html += '<i data-lucide="check" class="w-3 h-3 text-gray-400"></i>';
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
                questTasksById = {};
                if (overdueList) overdueList.innerHTML = '';
                if (todayList) todayList.innerHTML = '';
                if (upcomingList) upcomingList.innerHTML = '';
                var snap = await parentWin.getDocs(parentWin.collection(parentWin.db, 'tasks'));
                var now = new Date();
                var todayNum = questDateToNumber(now);
                snap.forEach(function (docSnap) {
                    var data = docSnap.data() || {};
                    if (data.project_id || data.projectId) return;
                    var status = String(data.status || '').toLowerCase();
                    if (status === 'complete') return;
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
        async function loadSideQuestTasks() {
            var urgentList = document.getElementById('sideQuestUrgentList');
            var highList = document.getElementById('sideQuestHighList');
            var normalList = document.getElementById('sideQuestNormalList');
            var lowList = document.getElementById('sideQuestLowList');
            if (!urgentList && !highList && !normalList && !lowList) return;
            var parentWin = window.parent;
            if (!parentWin || !parentWin.db || !parentWin.collection || !parentWin.getDocs) return;
            try {
                function esc(str) {
                    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                }
                if (urgentList) urgentList.innerHTML = '';
                if (highList) highList.innerHTML = '';
                if (normalList) normalList.innerHTML = '';
                if (lowList) lowList.innerHTML = '';
                var snap = await parentWin.getDocs(parentWin.collection(parentWin.db, 'tasks'));
                snap.forEach(function (docSnap) {
                    var data = docSnap.data() || {};
                    if (data.project_id || data.projectId) return;
                    var type = String(data.type || '').toLowerCase();
                    var status = String(data.status || '').toLowerCase();
                    if (type !== 'side-quest' && status !== 'sidequest') return;
                    var title = data.title || '';
                    if (!title) return;
                    var priority = String(data.priority || 'normal').toLowerCase();
                    var targetList = null;
                    if (priority === 'urgent') {
                        targetList = urgentList;
                    } else if (priority === 'high') {
                        targetList = highList;
                    } else if (priority === 'low') {
                        targetList = lowList;
                    } else {
                        targetList = normalList;
                    }
                    if (!targetList) return;
                    var el = document.createElement('div');
                    el.className = 'p-4 rounded-2xl bg-gray-50 flex items-center justify-between';
                    var label = '#' + String(docSnap.id || '').substring(0, 6).toUpperCase();
                    var html = '';
                    html += '<span class="font-bold text-gray-700">' + esc(title) + '</span>';
                    html += '<span class="text-xs bg-white px-3 py-1 rounded-full shadow-sm font-bold text-gray-400">' + esc(label) + '</span>';
                    el.innerHTML = html;
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
            } catch (e) {
                console.error('Failed to load side quests', e);
                if (urgentList) urgentList.innerHTML = '<p class="text-red-500 text-xs">Failed to load side quests.</p>';
                if (highList) highList.innerHTML = '<p class="text-red-500 text-xs">Failed to load side quests.</p>';
                if (normalList) normalList.innerHTML = '<p class="text-red-500 text-xs">Failed to load side quests.</p>';
                if (lowList) lowList.innerHTML = '<p class="text-red-500 text-xs">Failed to load side quests.</p>';
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
            if (!assignList && !notifyList) return;
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
                            if (user.photo) {
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
                            if (user.photo) {
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
            questOpenTask(taskId);
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
            var targetWin = window.parent && window.parent !== window ? window.parent : window;
            var url = 'quest/quest-edit.html?taskId=' + encodeURIComponent(taskId);
            try {
                targetWin.open(url, '_blank');
            } catch (e) {
                window.open(url, '_blank');
            }
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
        loadQuestDepartments();
        loadQuestPositions();
        loadQuestUsers();
        loadQuestTasks();
        loadSideQuestTasks();
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
    const sideQuestCard = target.querySelectorAll('.smart-filters-grid .filter-card')[1];
    if (sideQuestCard) {
        sideQuestCard.addEventListener('click', (e) => {
            e.preventDefault();
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
    <title>Side Quest - Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
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
        .btn-dlg-blue {
            background: linear-gradient(to top, #4776e6 0%, #8e54e9 100%);
        }
        .btn-dlg-blue:hover {
            background: linear-gradient(to top, #8e54e9 0%, #4776e6 100%);
        }
        .description-truncate {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
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
                    <button class="btn-dlg-yellow rounded-full px-6 py-2.5 text-sm font-semibold shadow-md"
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
            <div class="grid md:grid-cols-2 gap-6 mb-6 text-sm">
                <div class="space-y-4">
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
                        <div class="font-medium text-gray-500 w-24">Due date</div>
                        <div class="flex-1">
                            <input id="sideQuestDueInput" type="date"
                                class="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs md:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                        </div>
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
                <div class="space-y-4">
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
                        <div class="flex-1">
                            <input id="sideQuestPointsInput" type="number" min="0"
                                class="w-24 rounded-xl border border-gray-200 px-3 py-2 text-xs md:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-3">
                        <div class="font-medium text-gray-500 w-24">Tags</div>
                        <div class="flex-1">
                            <input id="sideQuestTagsInput" type="text"
                                placeholder="tag1, tag2, tag3"
                                class="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs md:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="border border-gray-200 rounded-2xl overflow-hidden mb-6">
                <div class="rich-editor">
                    <div class="rich-toolbar">
                        <button type="button" class="rich-btn" onclick="applyFormat('sideQuestDesc','bold')"><i class="bi bi-type-bold"></i></button>
                        <button type="button" class="rich-btn" onclick="applyFormat('sideQuestDesc','italic')"><i class="bi bi-type-italic"></i></button>
                        <button type="button" class="rich-btn" onclick="applyFormat('sideQuestDesc','underline')"><i class="bi bi-type-underline"></i></button>
                        <button type="button" class="rich-btn" onclick="applyFormat('sideQuestDesc','insertUnorderedList')"><i class="bi bi-list-ul"></i></button>
                        <button type="button" class="rich-btn" onclick="applyFormat('sideQuestDesc','insertOrderedList')"><i class="bi bi-list-ol"></i></button>
                    </div>
                    <div id="sideQuestDesc" class="rich-editor-body min-h-[120px] px-4 py-3 text-sm text-gray-700 outline-none"
                        contenteditable="true" data-placeholder="Task description or notes..."></div>
                </div>
            </div>
            <div class="flex flex-col md:flex-row items-stretch md:items-center justify-end gap-3">
                <button type="button"
                    class="rounded-full px-7 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200"
                    onclick="toggleSideQuestDropdown(event)">
                    Cancel
                </button>
                <button type="button"
                    class="rounded-full px-8 py-2.5 text-sm font-semibold text-white btn-dlg-blue"
                    style="box-shadow: 0 10px 25px rgba(59,130,246,0.35);"
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
            <li class="nav-card active bg-[#FEE2E2] p-5 rounded-[2rem] flex flex-col gap-3" onclick="switchTab('urgent', this)">
                <div class="icon-box w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
                    <i data-lucide="alert-circle" class="w-6 h-6 text-red-500"></i>
                </div>
                <div>
                    <div class="text-3xl font-bold">12</div>
                    <div class="text-xs font-bold text-red-700/60 uppercase tracking-widest">Urgent</div>
                </div>
            </li>
            <li class="nav-card bg-[#E0F2FE] p-5 rounded-[2rem] flex flex-col gap-3" onclick="switchTab('high', this)">
                <div class="icon-box w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
                    <i data-lucide="trending-up" class="w-6 h-6 text-blue-500"></i>
                </div>
                <div>
                    <div class="text-3xl font-bold">08</div>
                    <div class="text-xs font-bold text-blue-700/60 uppercase tracking-widest">High</div>
                </div>
            </li>
            <li class="nav-card bg-[#FEF3C7] p-5 rounded-[2rem] flex flex-col gap-3" onclick="switchTab('normal', this)">
                <div class="icon-box w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
                    <i data-lucide="box" class="w-6 h-6 text-amber-500"></i>
                </div>
                <div>
                    <div class="text-3xl font-bold">24</div>
                    <div class="text-xs font-bold text-amber-700/60 uppercase tracking-widest">Normal</div>
                </div>
            </li>
            <li class="nav-card bg-[#F3E8FF] p-5 rounded-[2rem] flex flex-col gap-3" onclick="switchTab('low', this)">
                <div class="icon-box w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
                    <i data-lucide="arrow-down-circle" class="w-6 h-6 text-purple-500"></i>
                </div>
                <div>
                    <div class="text-3xl font-bold">05</div>
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
    <script>
        lucide.createIcons();
        var questCurrentPriority = 'urgent';
        var sideQuestCurrentPriority = 'normal';
        function switchTab(priority, element) {
            document.querySelectorAll('.nav-card').forEach(function (card) { card.classList.remove('active'); });
            if (element) {
                element.classList.add('active');
            }
            questCurrentPriority = priority;
            document.querySelectorAll('.tab-pane').forEach(function (pane) { pane.classList.add('hidden'); });
            var pane = document.getElementById(priority + '-content');
            if (pane) {
                pane.classList.remove('hidden');
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
        function toggleSideQuestDropdown(event) {
            var dropdown = document.getElementById('sideQuestCreateDropdown');
            if (!dropdown) return;
            if (event && event.stopPropagation) {
                event.stopPropagation();
            }
            if (dropdown.classList.contains('hidden')) {
                dropdown.classList.remove('hidden');
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
            var dueEl = document.getElementById('sideQuestDueInput');
            var dueValue = dueEl && dueEl.value ? String(dueEl.value) : '';
            var pointsEl = document.getElementById('sideQuestPointsInput');
            var pointsValue = pointsEl && pointsEl.value ? Number(pointsEl.value) || 0 : 0;
            var tagsInput = document.getElementById('sideQuestTagsInput');
            var rawTags = tagsInput && tagsInput.value ? String(tagsInput.value) : '';
            var tags = rawTags
                ? rawTags.split(',').map(function (t) { return t.trim(); }).filter(function (t) { return t; })
                : [];
            var descEl = document.getElementById('sideQuestDesc');
            var description = descEl ? String(descEl.innerHTML || '').trim() : '';
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
                    due_date: dueValue,
                    points: pointsValue,
                    departments: [],
                    positions: [],
                    assign_to: assignSelected,
                    notify_to: notifySelected,
                    tags: tags,
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
                if (typeof loadSideQuestTasks === 'function') {
                    loadSideQuestTasks();
                }
                if (input) {
                    input.value = '';
                }
                if (dueEl) {
                    dueEl.value = '';
                }
                if (pointsEl) {
                    pointsEl.value = '';
                }
                if (tagsInput) {
                    tagsInput.value = '';
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
            try {
                function esc(str) {
                    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                }
                if (urgentList) urgentList.innerHTML = '';
                if (highList) highList.innerHTML = '';
                if (normalList) normalList.innerHTML = '';
                if (lowList) lowList.innerHTML = '';
                var snap = await parentWin.getDocs(parentWin.collection(parentWin.db, 'tasks'));
                snap.forEach(function (docSnap) {
                    var data = docSnap.data() || {};
                    if (data.project_id || data.projectId) return;
                    var type = String(data.type || '').toLowerCase();
                    var status = String(data.status || '').toLowerCase();
                    if (type !== 'side-quest' && status !== 'sidequest') return;
                    var title = data.title || '';
                    if (!title) return;
                    var priority = String(data.priority || 'normal').toLowerCase();
                    var targetList = null;
                    if (priority === 'urgent') {
                        targetList = urgentList;
                    } else if (priority === 'high') {
                        targetList = highList;
                    } else if (priority === 'low') {
                        targetList = lowList;
                    } else {
                        targetList = normalList;
                    }
                    if (!targetList) return;
                    var el = document.createElement('div');
                    el.className = 'p-4 rounded-2xl bg-gray-50 flex items-center justify-between';
                    var label = '#' + String(docSnap.id || '').substring(0, 6).toUpperCase();
                    var htmlCard = '';
                    htmlCard += '<span class="font-bold text-gray-700">' + esc(title) + '</span>';
                    htmlCard += '<span class="text-xs bg-white px-3 py-1 rounded-full shadow-sm font-bold text-gray-400">' + esc(label) + '</span>';
                    el.innerHTML = htmlCard;
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
            } catch (e) {
                console.error('Failed to load side quests', e);
                if (urgentList) urgentList.innerHTML = '<p class="text-red-500 text-xs">Failed to load side quests.</p>';
                if (highList) highList.innerHTML = '<p class="text-red-500 text-xs">Failed to load side quests.</p>';
                if (normalList) normalList.innerHTML = '<p class="text-red-500 text-xs">Failed to load side quests.</p>';
                if (lowList) lowList.innerHTML = '<p class="text-red-500 text-xs">Failed to load side quests.</p>';
            }
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
        function loadSideQuestUsersForForm() {
            var parentWin = window.parent;
            var assignList = document.getElementById('sideQuestAssignList');
            var notifyList = document.getElementById('sideQuestNotifyList');
            if (!assignList && !notifyList) return;
            if (assignList) {
                assignList.innerHTML = '<div class="text-slate-500 text-xs">Loading users...</div>';
            }
            if (notifyList) {
                notifyList.innerHTML = '<div class="text-slate-500 text-xs">Loading users...</div>';
            }
            if (!parentWin || !parentWin.db || !parentWin.collection || !parentWin.getDocs) {
                if (assignList) {
                    assignList.innerHTML = '<div class="text-red-500 text-xs">Users not available.</div>';
                }
                if (notifyList) {
                    notifyList.innerHTML = '<div class="text-red-500 text-xs">Users not available.</div>';
                }
                return;
            }
            function computeInitials(user) {
                var source = user.name || user.email || user.uid || '';
                if (!source) return 'U';
                var parts = String(source).trim().split(/\s+/);
                var initials = parts.map(function (p) { return p[0]; }).join('');
                return initials.substring(0, 2).toUpperCase();
            }
            function filterUsers(list, query) {
                var q = String(query || '').trim().toLowerCase();
                if (!q) return list.slice();
                return list.filter(function (u) {
                    var name = String(u.name || '').toLowerCase();
                    var email = String(u.email || '').toLowerCase();
                    return name.indexOf(q) !== -1 || email.indexOf(q) !== -1;
                });
            }
            parentWin.getDocs(parentWin.collection(parentWin.db, 'users')).then(function (snap) {
                var users = [];
                snap.forEach(function (docSnap) {
                    var d = docSnap.data() || {};
                    users.push({
                        uid: docSnap.id,
                        name: d.name || d.email || 'Unknown',
                        email: d.email || '',
                        photo: d.photo || ''
                    });
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
                            var initials = computeInitials(user);
                            var avatar;
                            if (user.photo) {
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
                    var baseUsersNotify = users.slice();
                    function renderNotify(listN) {
                        notifyList.innerHTML = '';
                        listN.forEach(function (user) {
                            var row2 = document.createElement('div');
                            row2.className = 'quest-user-option flex items-center gap-3 px-2 py-2 hover:bg-slate-800 rounded-xl cursor-pointer';
                            var initials2 = computeInitials(user);
                            var avatar2;
                            if (user.photo) {
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
            }).catch(function (e) {
                console.error('Failed to load users for side quest', e);
                if (assignList) {
                    assignList.innerHTML = '<div class="text-red-500 text-xs">Failed to load users.</div>';
                }
                if (notifyList) {
                    notifyList.innerHTML = '<div class="text-red-500 text-xs">Failed to load users.</div>';
                }
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
        });
        loadSideQuestUsersForForm();
        loadSideQuestDepartments();
        loadSideQuestPositions();
        loadSideQuestTasks();
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

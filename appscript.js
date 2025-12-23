/**
 * DATABASE IDs - Gabungan v1.5 (Final Stable with Direct Drive Photo Link)
 * Sesuaikan ID Sheet dengan file Spreadsheet Anda
 */
const PROJECT_SHEET_ID = '1ctP2lGLlbsklFmFpeezOyPJFhGq1rHsNjDEIBbujwH4';
const LIST_SHEET_ID    = '1MKNFDUyl7E1tuScCEjTS2s2g4lI6r9kZ8EHbiERIWsQ';
const TASK_SHEET_ID    = '1EFUyGa3fPLQHlGGSQL-HdwKa2pCZbnoj-YgJWG1gSBQ';
const COMMENT_SHEET_ID = '1gQ35byn2ftxpC7oGCcvN4XyIsqqOmkF-T28R3L7IxKk';
const SUBS_SHEET_ID    = '1RRXSkJmgR03PG3LZcmlEHt-Tip-CKivOsrZGXN45efQ';
const TAG_SHEET_ID     = '14cZxGmm32hLvxL7Kd5Liy0tyoivvy2ehNFBGGrjhNE8';
const TASK_TAG_SHEET_ID= '1na1KfC3OdH7ghi8HsCcwjKWW71DS6TJBn5xQTMFSKTo';
const STATUS_SHEET_ID  = '1HVbobV81z_uKvtfHIBbCuZGp7C9CUkPeF6gIZwA_uJI';
const USER_SHEET_ID    = '1sFG5WY5UWD27d_77S1kCFDXeHB9vA2ZzasFHaDUu5Ns'; 
const DRIVE_FOLDER_ID  = '1UBAZEr-n3evqA3Npvj7Kl7qvnt-gWLgE'; 

/**
 * GET REQUEST HANDLER
 */
function doGet(e) {
  const action = e && e.parameter ? e.parameter.action : null;
  const id = e && e.parameter ? e.parameter.id : null;

  if (action === 'getProjectData' || (id && id !== "")) {
    return getProjectCompleteData(id);
  }
  return getAllProjectsData();
}

/**
 * POST REQUEST HANDLER
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000); 
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'createProject')      return createProject(data);
    if (data.action === 'createList')         return createList(data);
    if (data.action === 'createTask')         return createTask(data);
    if (data.action === 'createComment')      return createComment(data);
    if (data.action === 'uploadFile')         return uploadFileToDrive(data); 
    if (data.action === 'updateTaskStatus')   return updateTaskStatus(data);
    if (data.action === 'createTag')          return createTag(data);
    if (data.action === 'updateTag')          return updateTag(data);
    if (data.action === 'deleteTag')          return deleteTag(data);
    if (data.action === 'createStatus')       return createStatus(data);
    if (data.action === 'toggleSubscriber')   return toggleSubscriber(data);
    if (data.action === 'syncStatuses')       return syncStatuses(data);


    
    return responseJSON({ status: 'error', message: 'Action Unknown' });
  } catch (err) { 
    return responseJSON({ status: 'error', message: err.toString() }); 
  } finally { 
    lock.releaseLock(); 
  }
}

/** 
 * FUNGSI: MEMBUAT MASTER TAG BARU 
 */ 
function createTag(data) { 
  const ss = SpreadsheetApp.openById(TAG_SHEET_ID).getSheets()[0]; 
  const tid = Utilities.getUuid(); 
  // Kolom: tag_id, tag_name, color 
  ss.appendRow([tid, data.tagName, data.color]); 
  return responseJSON({ status: 'success', tagId: tid, name: data.tagName, color: data.color }); 
} 

/** 
 * FUNGSI: MENGAMBIL SEMUA DATA (PROJECT, LIST, STATUS, TAG, USERS) 
 */ 
function getProjectCompleteData(targetId) { 
  const targetIdStr = String(targetId).trim(); 
  
  // 1. Fetch Master Users 
  const uSheet = SpreadsheetApp.openById(USER_SHEET_ID).getSheets()[0]; 
  const uData = uSheet.getDataRange().getDisplayValues(); 
  let users = []; 
  for(let i=1; i<uData.length; i++) { 
    users.push({ 
      id: String(uData[i][0]).trim(), // Ambil kolom 'Id' 
      name: uData[i][1], 
      email: uData[i][2], 
      photo: formatDriveUrl(uData[i][4]), 
      role: uData[i][5] 
    }); 
  } 

  // 2. Fetch Master Tags 
  const tagSheet = SpreadsheetApp.openById(TAG_SHEET_ID).getSheets()[0]; 
  const tagRaw = tagSheet.getDataRange().getDisplayValues(); 
  let tags = []; 
  for(let i=1; i<tagRaw.length; i++) { 
    tags.push({ id: tagRaw[i][0], name: tagRaw[i][1], color: tagRaw[i][2] }); 
  } 

  // 3. Fetch Statuses 
  const sSheet = SpreadsheetApp.openById(STATUS_SHEET_ID).getSheets()[0]; 
  const sRaw = sSheet.getDataRange().getDisplayValues(); 
  let allStatuses = []; 
  for(let i=1; i<sRaw.length; i++) { 
    allStatuses.push({ 
      id: sRaw[i][0], 
      listId: sRaw[i][1], 
      name: sRaw[i][3], 
      type: sRaw[i][4], 
      color: sRaw[i][5], 
      position: sRaw[i][6] 
    }); 
  } 

  // ... (Logika Fetch Project, List, dan Task sama seperti sebelumnya, namun difilter berdasarkan project ID) 
  // [Kode fetching project & list disingkat, diasumsikan Anda sudah memiliki logikanya]
  
  // RE-USE EXISTING LOGIC FOR PROJECT, LISTS, TASKS
  
  let allRelevantIds = [targetIdStr];

  // 4. GET PROJECT
  const pSheet = SpreadsheetApp.openById(PROJECT_SHEET_ID).getSheets()[0];
  const pData = pSheet.getDataRange().getDisplayValues();
  let project = null;
  for(let i=1; i<pData.length; i++) {
    if(String(pData[i][0]).trim() === targetIdStr) {
      project = { id: pData[i][0], name: pData[i][1], desc: pData[i][2], department: pData[i][9] };
      break;
    }
  }
  if(!project) return responseJSON({ status: 'error', message: 'Project not found' });

  // 5. GET LISTS
  const lSheet = SpreadsheetApp.openById(LIST_SHEET_ID).getSheets()[0];
  const lData = lSheet.getDataRange().getDisplayValues();
  let lists = [], listIds = [];
  for(let i=1; i<lData.length; i++) {
    if(String(lData[i][1]).trim() === targetIdStr) {
      const lid = String(lData[i][0]).trim();
      lists.push({ id: lid, name: lData[i][2], desc: lData[i][3], tasks: [], statuses: [] });
      listIds.push(lid);
      allRelevantIds.push(lid);
    }
  }

  // 6. MAPPING STATUSES TO LISTS
  // allStatuses sudah diambil di atas (step 3)
  allStatuses.forEach(s => {
    let l = lists.find(x => String(x.id) === String(s.listId));
    if(l) {
        l.statuses.push({
            id: s.id, name: s.name, type: s.type, color: s.color, position: parseInt(s.position) || 0
        });
    }
  });

  // 7. GET TASKS
  const tSheet = SpreadsheetApp.openById(TASK_SHEET_ID).getSheets()[0];
  const tData = tSheet.getDataRange().getDisplayValues();
  for(let i=1; i<tData.length; i++) {
    let tListId = String(tData[i][1]).trim();
    if(listIds.includes(tListId)) {
      let tid = tData[i][0]; 
      allRelevantIds.push(tid);
      let l = lists.find(x => x.id === tListId);
      if(l) l.tasks.push({ 
        id: tid, 
        title: tData[i][3], 
        description: tData[i][4],
        status: String(tData[i][5]),
        priority: tData[i][6],
        points: tData[i][16],
        assignedTo: tData[i][18], 
        notifyTo: tData[i][19]    
      });
    }
  }

  // 8. GET COMMENTS
  let comments = [];
  try {
    const cSheet = SpreadsheetApp.openById(COMMENT_SHEET_ID).getSheets()[0];
    const cData = cSheet.getDataRange().getDisplayValues();
    for(let i=1; i<cData.length; i++) {
      // Filter berdasarkan context_id (projectId)
      if(allRelevantIds.includes(String(cData[i][2]).trim())) {
        comments.push({
          id: cData[i][0], 
          contextType: cData[i][1], 
          contextId: cData[i][2], 
          userId: cData[i][3], // Indeks diperbaiki ke 3 (user_id) 
          text: cData[i][4],   // Indeks diperbaiki ke 4 (comment_text) 
          date: cData[i][5],   // Indeks diperbaiki ke 5 (created_at) 
          attachment: cData[i][6] || "" // Indeks diperbaiki ke 6 (attachment) 
        });
      }
    }
  } catch(e) {}

  // 9. GET SUBSCRIBERS
  let subscribers = [];
  try {
    const subSheet = SpreadsheetApp.openById(SUBS_SHEET_ID).getSheets()[0];
    const subData = subSheet.getDataRange().getDisplayValues();
    for(let i=1; i<subData.length; i++) {
      // Pastikan kolom 2 adalah projectId dan kolom 3 adalah userId
      if(String(subData[i][1]).trim() === targetIdStr) {
        subscribers.push({ 
          id: subData[i][0], 
          projectId: subData[i][1], 
          userId: subData[i][2] 
        });
      }
    }
  } catch(e) {
    console.error("Error subscriber: " + e);
  }
  
  return responseJSON({ 
    status: 'success', 
    data: { 
      project: project,
      lists: lists,
      users: users, 
      tags: tags, 
      statuses: allStatuses, 
      comments: comments,
      subscribers: subscribers
    } 
  }); 
}

/**
 * FUNGSI PEMBANTU: Konversi URL Google Drive ke Link Foto Langsung
 */
function formatDriveUrl(url) {
  if (!url || url === "" || url.indexOf("http") === -1) {
    return "https://ui-avatars.com/api/?background=random&color=fff&name=User";
  }
  try {
    var fileId = "";
    if (url.indexOf("id=") > -1) {
      fileId = url.split("id=")[1].split("&")[0];
    } else {
      var parts = url.split("/");
      // Mencari ID di antara /d/ dan /view atau parts setelah d
      var dIndex = parts.indexOf("d");
      if (dIndex > -1 && parts[dIndex + 1]) {
        fileId = parts[dIndex + 1];
      }
    }
    
    if (fileId !== "") {
      return "https://drive.google.com/uc?export=view&id=" + fileId;
    }
    return url;
  } catch (e) {
    return url; 
  }
}

function createList(data) {
  try {
    const ss = SpreadsheetApp.openById(LIST_SHEET_ID).getSheets()[0];
    const lid = Utilities.getUuid(); // Generate ID unik
    const now = new Date();
    
    // Sesuaikan dengan urutan kolom di Spreadsheet List:
    // 1. list_id, 2. project_id, 3. list_name, 4. description, 5. is_tracked, 6. color_theme, 7. position, 8. created_at
    const row = [
      lid,                      // Column A: list_id
      data.projectId,           // Column B: project_id
      data.name,                // Column C: list_name (diambil dari data.name frontend)
      data.description || "",   // Column D: description (diambil dari data.description frontend)
      false,                    // Column E: is_tracked (default false)
      "#0B2B6A",                // Column F: color_theme (default)
      0,                        // Column G: position
      now                       // Column H: created_at
    ];
    
    ss.appendRow(row);
    return responseJSON({ status: 'success', listId: lid });
    
  } catch (err) {
    return responseJSON({ status: 'error', message: err.toString() });
  }
}

/** 
 * FUNGSI: MEMBUAT TASK (Lengkap dengan Status, User Asli, dan Tags) 
 */ 
function createTask(data) { 
  const ss = SpreadsheetApp.openById(TASK_SHEET_ID).getSheets()[0]; 
  const tid = Utilities.getUuid(); 
  const now = new Date(); 

  // Mapping kolom sesuai permintaan: 
  // 1:task_id, 2:list_id, 3:parent, 4:title, 5:desc, 6:status, 7:priority, 8:start, 9:due... 
  // 13:created_by_user_id 
  const row = [ 
    tid,                          // 1: task_id 
    data.listId,                  // 2: list_id 
    "",                           // 3: parent_task_id 
    data.title,                   // 4: task_title 
    data.description || "",       // 5: task_description 
    data.status || "OPEN",        // 6: status 
    data.priority || "normal",    // 7: priority 
    data.startDate || "",         // 8: start_date 
    data.dueDate || "",           // 9: due_date 
    "", "", "",                   // 10,11,12: occurrence, recurring, duplicated 
    data.userId,                  // 13: created_by_user_id (ID DARI FRONTEND) 
    now,                          // 14: created_at 
    now,                          // 15: updated_at 
    "",                           // 16: completed_at 
    data.points || 0,             // 17: point_available 
    "pts",                        // 18: point_type 
    data.assignTo || "",          // 19: assigned_to_user_ids 
    data.notifyTo || "",          // 20: notify_user_ids 
    0                             // 21: position 
  ]; 
  ss.appendRow(row); 

  // SIMPAN KE SHEET JUNCTION TASK_TAG (task_id, tag_id) 
  if (data.tagIds && data.tagIds.length > 0) { 
    const junctionSheet = SpreadsheetApp.openById(TASK_TAG_SHEET_ID).getSheets()[0]; 
    data.tagIds.forEach(tagId => { 
      junctionSheet.appendRow([tid, tagId]); 
    }); 
  } 

  return responseJSON({ status: 'success', taskId: tid }); 
} 

/** 
 * FUNGSI: MEMBUAT STATUS BARU 
 */ 
function createStatus(data) { 
  const ss = SpreadsheetApp.openById(STATUS_SHEET_ID).getSheets()[0]; 
  const sid = Utilities.getUuid(); 
  
  // Kolom: status_id, list_id, task_id, status_name, status_type, color, position 
  ss.appendRow([ 
    sid, 
    data.listId, 
    "", // task_id biasanya kosong jika status level list 
    data.statusName, 
    data.statusType || "active", 
    data.color || "#64748b", 
    data.position || 0 
  ]); 
  return responseJSON({ status: 'success', statusId: sid }); 
}

function syncStatuses(data) {
  try {
    const ss = SpreadsheetApp.openById(STATUS_SHEET_ID).getSheets()[0];
    const vals = ss.getDataRange().getValues();
    
    // 1. Hapus status lama untuk list_id ini
    // Kita hapus baris dari bawah ke atas agar index tidak berantakan
    for (let i = vals.length - 1; i >= 1; i--) {
      if (String(vals[i][1]) === String(data.listId)) {
        ss.deleteRow(i + 1);
      }
    }
    
    // 2. Tambahkan data baru hasil sinkronisasi
    data.statuses.forEach((s) => {
      ss.appendRow([
        Utilities.getUuid(), // status_id
        data.listId,         // list_id
        "",                  // task_id (kosongkan jika template)
        s.name,              // status_name
        s.type,              // status_type (not_started, active, dll)
        s.color,             // color
        s.position           // position
      ]);
    });
    
    return responseJSON({ status: 'success' });
  } catch (e) {
    return responseJSON({ status: 'error', message: e.toString() });
  }
}



function uploadFileToDrive(data) {
  try {
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const contentType = data.mimeType || "application/octet-stream";
    let rawData = data.fileData;
    if (rawData.indexOf(',') > -1) rawData = rawData.split(',')[1];
    const blob = Utilities.newBlob(Utilities.base64Decode(rawData), contentType, data.fileName);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return responseJSON({ status: 'success', fileUrl: file.getUrl(), fileName: file.getName() });
  } catch (e) { return responseJSON({ status: 'error', message: e.toString() }); }
}

function createComment(data) { 
   const ss = SpreadsheetApp.openById(COMMENT_SHEET_ID).getSheets()[0]; 
   const cid = Utilities.getUuid(); 
   
   // Urutan Kolom Sesuai Prompt Anda (7 Kolom): 
   // 1:comment_id, 2:context_type, 3:context_id, 4:user_id, 5:comment_text, 6:created_at, 7:attachment_url 
   ss.appendRow([ 
     cid,                       // comment_id 
     data.contextType || "project", // context_type (misal: project atau task) 
     data.contextId,            // context_id 
     data.userId,               // user_id (PENTING: ID login Anda) 
     data.text,                 // comment_text 
     new Date(),                // created_at 
     data.attachmentUrl || ""   // attachment_url 
   ]); 
   
   return responseJSON({ status: 'success' }); 
 }

function updateTaskStatus(data) {
  const ss = SpreadsheetApp.openById(TASK_SHEET_ID).getSheets()[0];
  const vals = ss.getDataRange().getValues();
  for(let i=1; i<vals.length; i++){
    if(String(vals[i][0]) === String(data.taskId)){
      ss.getRange(i+1, 6).setValue(data.status);
      ss.getRange(i+1, 15).setValue(new Date());
      return responseJSON({status:'success'});
    }
  }
  return responseJSON({status:'error', message: 'Task not found'});
}

/**
 * FUNGSI: TOGGLE SUBSCRIBER
 */
function toggleSubscriber(data) {
  const ss = SpreadsheetApp.openById(SUBS_SHEET_ID).getSheets()[0];
  const allData = ss.getDataRange().getValues();
  let foundRowIndex = -1;
  
  for (let i = 1; i < allData.length; i++) {
    if (String(allData[i][1]) === String(data.contextId) && String(allData[i][2]) === String(data.userId)) {
      foundRowIndex = i + 1;
      break;
    }
  }
  
  if (foundRowIndex !== -1) {
    ss.deleteRow(foundRowIndex);
    return responseJSON({ status: 'success', message: 'Unsubscribed' });
  } else {
    const sid = Utilities.getUuid();
    ss.appendRow([sid, data.contextId, data.userId]);
    return responseJSON({ status: 'success', message: 'Subscribed' });
  }
}

function getAllProjectsData() {
  const ss = SpreadsheetApp.openById(PROJECT_SHEET_ID).getSheets()[0];
  const d = ss.getDataRange().getDisplayValues();
  let p=[];
  for(let i=1; i<d.length; i++){
    if(d[i][0]) p.push({id:d[i][0], name:d[i][1], desc:d[i][2], department:d[i][9], pinned:d[i][8]});
  }
  return responseJSON({status:'success', data:p});
}

function responseJSON(obj) { 
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); 
}
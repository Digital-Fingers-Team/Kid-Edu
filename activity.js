// إعداد قاعدة بيانات Dexie
const db = new Dexie("EduKidDB");
db.version(2).stores({
  activities: '++id, ts, userName, stage, type, subType, title',
  attendance: '++id, [date+userName], date, ts, userName, stage, status'
});

// وظائف المزامنة مع LocalStorage للبيانات القديمة (اختياري)
const ACTIVITY_KEY = 'adukid_activity_v1';
const ATTENDANCE_KEY = 'adukid_attendance_v1';

function getCurrentUserSafe() {
  try {
    const raw = localStorage.getItem('adukid_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// وظائف الحضور والانصراف (IndexedDB)
async function recordAttendance(status = 'present', note = '') {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const user = getCurrentUserSafe();
  const stage = getCurrentStageSafe();
  const userName = (user?.studentName || 'guest');

  // التحقق من وجود سجل لنفس اليوم
  const existing = await db.attendance
    .where({ date: dateStr, userName: userName })
    .first();

  const record = {
    date: dateStr,
    ts: now.toISOString(),
    status: status,
    note: note,
    userName: userName,
    stage: stage
  };

  if (existing) {
    await db.attendance.update(existing.id, record);
  } else {
    await db.attendance.add(record);
  }
  
  // تحديث التقرير فوراً إذا كانت الدالة موجودة في الصفحة
  if (typeof updateChildData === 'function') {
    updateChildData((user?.grade || 'kg1').toLowerCase());
  }
  
  return record;
}

async function getAttendanceSummary(stage) {
  const s = (stage || getCurrentStageSafe() || '').toUpperCase();
  const user = getCurrentUserSafe();
  const userName = user?.studentName || 'guest';
  
  const allLogs = await db.attendance
    .where('stage').equalsIgnoreCase(s)
    .and(l => l.userName === userName)
    .toArray();
  
  const present = allLogs.filter(l => l.status === 'present').length;
  const absent = allLogs.filter(l => l.status === 'absent').length;
  const excused = allLogs.filter(l => l.status === 'excused').length;
  const total = allLogs.length;
  
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;
  
  return { present, absent, excused, total, rate, logs: allLogs.slice(-7).reverse() };
}

async function hasCheckedInToday() {
  const dateStr = new Date().toISOString().split('T')[0];
  const user = getCurrentUserSafe();
  const userName = user?.studentName || 'guest';
  try {
    const count = await db.attendance
      .where({ date: dateStr, userName: userName })
      .count();
    return count > 0;
  } catch (e) {
    console.warn("Dexie where error, falling back to array filter", e);
    const all = await db.attendance.where('userName').equals(userName).toArray();
    return all.some(a => a.date === dateStr);
  }
}

/**
 * وظيفة للتحقق من الحضور وعرض تنبيه إذا لم يتم التسجيل
 * يتم استدعاؤها عند تحميل لوحات التحكم
 */
async function checkAndPromptAttendance() {
  const checkedIn = await hasCheckedInToday();
  if (!checkedIn) {
    // إذا لم يتم تسجيل الحضور، نقوم بإظهار نافذة منبثقة بسيطة
    // أو استدعاء وظيفة لإظهار المودال إذا كانت موجودة في الصفحة
    if (typeof showAttendanceModal === 'function') {
      showAttendanceModal();
    } else {
      console.log("Attendance modal function not found, user should check in manually.");
    }
  }
}

function getCurrentStageSafe() {
  const user = getCurrentUserSafe();
  const u = (user?.grade || '').toString().trim().toUpperCase();
  const s = (localStorage.getItem('selectedStage') || '').toString().trim().toUpperCase();
  if (u === 'KG1' || u === 'KG2') return u;
  if (s === 'KG1' || s === 'KG2') return s;
  return '';
}

function normalizeSubject(subject) {
  const value = (subject || '').toString().trim().toLowerCase();
  if (!value) return '';
  if (value === 'arabic' || value === 'ar' || value === 'العربية' || value === 'لغة عربية') return 'arabic';
  if (value === 'math' || value === 'mathematics' || value === 'رياضيات' || value === 'الرياضيات') return 'math';
  if (value === 'english' || value === 'en' || value === 'الإنجليزية' || value === 'لغة إنجليزية') return 'english';
  if (value === 'life' || value === 'life-skills' || value === 'skills' || value === 'المهارات الحياتية') return 'life';
  return '';
}

function detectActivitySubject(activity) {
  const metaSubject = normalizeSubject(
    activity?.meta?.subject ||
    activity?.meta?.category ||
    activity?.meta?.track
  );
  if (metaSubject) return metaSubject;

  const title = `${activity?.title || ''} ${activity?.subType || ''}`.toLowerCase();

  if (
    title.includes('مغامرة الحروف') ||
    title.includes('حديقة الكلمات') ||
    title.includes('الحروف العربية') ||
    title.includes('كتاب اللغة العربية') ||
    title.includes('arabic_kg') ||
    title.includes('arabic kg') ||
    title.includes('رحلة الحروف')
  ) {
    return 'arabic';
  }

  if (
    title.includes('سباق الأرقام') ||
    title.includes('الأرقام') ||
    title.includes('معمل الأشكال') ||
    title.includes('كتاب الرياضيات') ||
    title.includes('math_kg') ||
    title.includes('math kg') ||
    title.includes('رحلة الأرقام')
  ) {
    return 'math';
  }

  if (
    title.includes('color explorer') ||
    title.includes('مستكشف الألوان') ||
    title.includes('word trail') ||
    title.includes('مسار الكلمات') ||
    title.includes('english book') ||
    title.includes('english_kg') ||
    title.includes('english kg') ||
    title.includes('abc')
  ) {
    return 'english';
  }

  if (
    title.includes('قصة') ||
    title.includes('الأرنب والثعلب')
  ) {
    return 'life';
  }

  if (activity?.type === 'story') {
    return 'life';
  }

  return '';
}

function getActivityImpact(activity) {
  const subType = (activity?.subType || '').toString().trim().toLowerCase();
  const weightedSubTypes = {
    open: 4,
    start: 6,
    read: 12,
    select: 6,
    play: 10,
    complete: 16,
    correct: 8,
    correct_answer: 8,
    success: 10,
    next_letter: 3,
    timeout: 2,
    wrong: 1,
    wrong_answer: 1
  };

  if (weightedSubTypes[subType]) {
    return weightedSubTypes[subType];
  }

  const fallbackByType = {
    game: 6,
    book: 10,
    story: 8,
    event: 2
  };

  return fallbackByType[activity?.type] || 4;
}

// وظائف الأنشطة (IndexedDB)
async function logActivity(payload) {
  const now = new Date().toISOString();
  const user = getCurrentUserSafe();
  const stage = getCurrentStageSafe();
  
  const record = {
    ts: now,
    userName: (user?.studentName || '').trim() || 'guest',
    stage: stage || '',
    type: payload?.type || 'event',
    subType: payload?.subType || '',
    title: payload?.title || '',
    meta: payload?.meta || {}
  };
  
  await db.activities.add(record);
  
  // تحديث الواجهة إذا لزم الأمر
  if (typeof updateActivityWidgets === 'function') {
    updateActivityWidgets();
  }
  
  return record;
}

async function summarizeActivities(stage) {
  const s = (stage || getCurrentStageSafe() || '').toString().trim().toUpperCase();
  const user = getCurrentUserSafe();
  const userName = user?.studentName || 'guest';

  const items = await db.activities
    .where('stage').equalsIgnoreCase(s)
    .and(a => a.userName === userName)
    .toArray();

  const summary = { 
    total: items.length, 
    games: 0, 
    books: 0, 
    stories: 0, 
    lastTs: '',
    progress: { arabic: 0, math: 0, english: 0, life: 0 },
    overallAcademic: 0
  };
  
  items.forEach(a => {
    if (a.type === 'game') summary.games += 1;
    if (a.type === 'book') summary.books += 1;
    if (a.type === 'story') summary.stories += 1;
    if (!summary.lastTs || a.ts > summary.lastTs) summary.lastTs = a.ts;

    const subject = detectActivitySubject(a);
    const impact = getActivityImpact(a);

    if (subject && typeof summary.progress[subject] === 'number') {
      summary.progress[subject] += impact;
    }

    if (a.type === 'story') {
      summary.progress.life += Math.max(2, Math.round(impact / 2));
    }
  });

  Object.keys(summary.progress).forEach(k => {
    summary.progress[k] = Math.min(Math.max(summary.progress[k], 0), 100);
  });

  summary.overallAcademic = Math.round(
    (summary.progress.arabic + summary.progress.math + summary.progress.english) / 3
  );

  return summary;
}

async function getRecentActivities(stage, limit = 5) {
  const s = (stage || getCurrentStageSafe() || '').toUpperCase();
  const user = getCurrentUserSafe();
  const userName = user?.studentName || 'guest';

  return await db.activities
    .where('stage').equalsIgnoreCase(s)
    .and(a => a.userName === userName)
    .reverse()
    .limit(limit)
    .toArray();
}
function formatArDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('ar-EG', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
}
function getCurrentDashboardUrl() {
  const stage = getCurrentStageSafe();
  if (stage === 'KG2') return 'dashboard-kg2.html';
  return 'dashboard-kg1.html';
}
function getStageLabel(stage) {
  const value = (stage || getCurrentStageSafe() || '').toString().trim().toUpperCase();
  if (value === 'KG2') return 'KG2';
  return 'KG1';
}
function enforceStageAccess(requiredStage) {
  const required = (requiredStage || '').toString().trim().toUpperCase();
  const current = getCurrentStageSafe();
  if (required && current && required !== current) {
    window.location.href = getCurrentDashboardUrl();
    return false;
  }
  return true;
}

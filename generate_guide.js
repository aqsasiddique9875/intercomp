const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, LevelFormat, PageBreak
} = require('docx');
const fs = require('fs');
 
// ── Helpers ──────────────────────────────────────────────────────────────────
 
const B = (style, color) => ({ style: BorderStyle.SINGLE, size: 4, color: color || '2563EB' });
const cellBorders = (c) => ({ top: B(1,c), bottom: B(1,c), left: B(1,c), right: B(1,c) });
 
function h1(text) {
  return new Paragraph({
    spacing: { before: 480, after: 160 },
    children: [new TextRun({ text, bold: true, size: 36, font: 'Arial', color: '0F172A' })]
  });
}
function h2(text) {
  return new Paragraph({
    spacing: { before: 320, after: 120 },
    children: [new TextRun({ text, bold: true, size: 28, font: 'Arial', color: '1D4ED8' })]
  });
}
function h3(text) {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, bold: true, size: 24, font: 'Arial', color: '334155' })]
  });
}
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, size: 22, font: 'Arial', color: '1E293B', ...opts })]
  });
}
function note(text) {
  return new Paragraph({
    spacing: { before: 100, after: 100 },
    indent: { left: 360 },
    children: [
      new TextRun({ text: '⚡ ', size: 22, font: 'Arial' }),
      new TextRun({ text, size: 22, font: 'Arial', color: '7C3AED', italics: true })
    ]
  });
}
function warn(text) {
  return new Paragraph({
    spacing: { before: 100, after: 100 },
    indent: { left: 360 },
    children: [
      new TextRun({ text: '⚠️  ', size: 22, font: 'Arial' }),
      new TextRun({ text, size: 22, font: 'Arial', color: 'B45309', bold: true })
    ]
  });
}
function bullet(text, bold = false) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22, font: 'Arial', bold })]
  });
}
function num(text) {
  return new Paragraph({
    numbering: { reference: 'numbers', level: 0 },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22, font: 'Arial' })]
  });
}
function code(text) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    indent: { left: 360 },
    children: [new TextRun({ text, size: 20, font: 'Courier New', color: '166534' })]
  });
}
function divider() {
  return new Paragraph({
    spacing: { before: 240, after: 240 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1', space: 1 } },
    children: []
  });
}
function space(n = 1) {
  return [...Array(n)].map(() => new Paragraph({ children: [] }));
}
function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}
 
// ── Table builder ─────────────────────────────────────────────────────────────
function makeTable(headers, rows, colWidths) {
  const total = colWidths.reduce((a, b) => a + b, 0);
  const hdrRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => new TableCell({
      borders: cellBorders('1D4ED8'),
      shading: { fill: '1D4ED8', type: ShadingType.CLEAR },
      width: { size: colWidths[i], type: WidthType.DXA },
      margins: { top: 100, bottom: 100, left: 140, right: 140 },
      children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: 'FFFFFF', size: 20, font: 'Arial' })] })]
    }))
  });
  const dataRows = rows.map((row, ri) => new TableRow({
    children: row.map((cell, ci) => new TableCell({
      borders: cellBorders('CBD5E1'),
      shading: { fill: ri % 2 === 0 ? 'F8FAFC' : 'EFF6FF', type: ShadingType.CLEAR },
      width: { size: colWidths[ci], type: WidthType.DXA },
      margins: { top: 80, bottom: 80, left: 140, right: 140 },
      children: [new Paragraph({ children: [new TextRun({ text: cell, size: 20, font: 'Arial', color: '1E293B' })] })]
    }))
  }));
  return new Table({ width: { size: total, type: WidthType.DXA }, columnWidths: colWidths, rows: [hdrRow, ...dataRows] });
}
 
// ── Content ───────────────────────────────────────────────────────────────────
const children = [
 
  // TITLE PAGE
  new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: 'FULL BACKEND ARCHITECTURE', bold: true, size: 56, font: 'Arial', color: '0F172A' })] }),
  new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: 'AI-Based Internship & Job Recommendation Platform', size: 30, font: 'Arial', color: '2563EB' })] }),
  new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: 'Senior Backend Developer Guide  •  Supabase + Node.js + PostgreSQL', size: 22, font: 'Arial', color: '64748B' })] }),
  new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: `Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, size: 20, font: 'Arial', color: '94A3B8' })] }),
  divider(),
 
  // ── SECTION 1 ─────────────────────────────────────────────────────────────
  h1('1. Architecture Overview'),
  p('This platform requires a production-grade backend supporting 3 user roles (Student, Company, Admin), AI-powered recommendations, real-time notifications, anti-cheat enforcement, and a monetization layer. The recommended stack is:'),
  ...space(1),
  makeTable(
    ['Layer', 'Technology', 'Purpose'],
    [
      ['API Server', 'Node.js + Express.js', 'REST API, business logic, middleware'],
      ['Database (Primary)', 'Supabase PostgreSQL', 'All relational data, RLS policies'],
      ['Authentication', 'Supabase Auth', 'Email/OTP/MFA login for all 3 roles'],
      ['Real-time', 'Supabase Realtime', 'Live notifications, activity feed'],
      ['File Storage', 'Supabase Storage', 'CVs, certificates, assignments, course videos'],
      ['AI Engine', 'Google Gemini Flash API', 'Recommendations, plagiarism detection'],
      ['Maps', 'Google Maps API', 'Nearby companies, navigation'],
      ['Background Jobs', 'Node-cron / BullMQ', 'Weekly test scheduling, ranking updates'],
      ['Payments', 'Stripe / JazzCash', 'Premium memberships, company ads'],
      ['Hosting', 'Hostinger VPS', 'Node.js server deployment'],
    ],
    [2200, 2800, 4360]
  ),
  ...space(1),
  note('Use Supabase as your primary backend. Node.js sits on top to handle complex business logic, AI calls, and scheduled jobs that Supabase Edge Functions alone cannot handle cleanly.'),
  divider(),
 
  // ── SECTION 2 ─────────────────────────────────────────────────────────────
  h1('2. Database Schema — All Tables'),
  p('Every table must be created inside Supabase PostgreSQL. Enable Row Level Security (RLS) on every table — this is not optional.'),
 
  h2('2.1 Users & Authentication'),
  h3('Table: profiles'),
  p('Extends Supabase auth.users. One row per user.'),
  makeTable(
    ['Column', 'Type', 'Notes'],
    [
      ['id', 'uuid (PK)', 'References auth.users.id'],
      ['role', 'enum (student, company, admin)', 'Set at registration'],
      ['full_name', 'text', ''],
      ['email', 'text', ''],
      ['phone', 'text', 'For OTP verification'],
      ['avatar_url', 'text', 'Supabase Storage URL'],
      ['is_verified', 'boolean', 'Email + phone verified'],
      ['is_blocked', 'boolean', 'Admin can block accounts'],
      ['device_fingerprint', 'text', 'Anti-fraud'],
      ['last_ip', 'inet', 'IP monitoring'],
      ['created_at', 'timestamptz', ''],
    ],
    [2200, 2200, 4960]
  ),
 
  h3('Table: student_profiles'),
  makeTable(
    ['Column', 'Type', 'Notes'],
    [
      ['id', 'uuid (PK)', 'References profiles.id'],
      ['university', 'text', ''],
      ['degree', 'text', ''],
      ['graduation_year', 'int', ''],
      ['bio', 'text', ''],
      ['portfolio_url', 'text', ''],
      ['github_url', 'text', ''],
      ['linkedin_url', 'text', ''],
      ['trust_score', 'numeric (0-100)', 'Updated by anti-cheat system'],
      ['overall_rating', 'numeric (0-5)', 'Computed from tests + activity'],
      ['rank_position', 'int', 'Global leaderboard rank'],
      ['is_premium', 'boolean', ''],
      ['premium_expires_at', 'timestamptz', ''],
      ['test_group', 'enum (A, B, C)', 'Scheduling group assignment'],
      ['streak_days', 'int', 'Daily login streak'],
      ['total_points', 'int', 'Gamification points'],
    ],
    [2500, 2000, 4860]
  ),
 
  h3('Table: company_profiles'),
  makeTable(
    ['Column', 'Type', 'Notes'],
    [
      ['id', 'uuid (PK)', 'References profiles.id'],
      ['company_name', 'text', ''],
      ['industry', 'text', ''],
      ['website', 'text', ''],
      ['logo_url', 'text', ''],
      ['description', 'text', ''],
      ['address', 'text', ''],
      ['latitude', 'numeric', 'For Google Maps'],
      ['longitude', 'numeric', 'For Google Maps'],
      ['is_verified', 'boolean', 'Admin must approve'],
      ['verification_docs_url', 'text[]', 'Array of doc URLs'],
      ['is_featured', 'boolean', 'Paid featured listing'],
      ['featured_expires_at', 'timestamptz', ''],
    ],
    [2500, 2000, 4860]
  ),
 
  h2('2.2 Skills & Certificates'),
  h3('Table: skills'),
  makeTable(
    ['Column', 'Type', 'Notes'],
    [
      ['id', 'uuid (PK)', ''],
      ['student_id', 'uuid (FK)', 'References student_profiles.id'],
      ['skill_name', 'text', 'e.g. Flutter, Node.js'],
      ['proficiency', 'enum (beginner, intermediate, expert)', ''],
      ['verified', 'boolean', 'Verified via test performance'],
    ],
    [2000, 2000, 5360]
  ),
 
  h3('Table: certificates'),
  makeTable(
    ['Column', 'Type', 'Notes'],
    [
      ['id', 'uuid (PK)', ''],
      ['student_id', 'uuid (FK)', ''],
      ['title', 'text', ''],
      ['issuer', 'text', ''],
      ['file_url', 'text', 'Supabase Storage'],
      ['issued_at', 'date', ''],
      ['is_verified', 'boolean', 'Admin verified'],
    ],
    [2000, 2000, 5360]
  ),
 
  h2('2.3 Jobs & Internships'),
  h3('Table: job_postings'),
  makeTable(
    ['Column', 'Type', 'Notes'],
    [
      ['id', 'uuid (PK)', ''],
      ['company_id', 'uuid (FK)', ''],
      ['type', 'enum (job, internship)', ''],
      ['title', 'text', ''],
      ['description', 'text', ''],
      ['required_skills', 'text[]', ''],
      ['location', 'text', ''],
      ['is_remote', 'boolean', ''],
      ['salary_range', 'text', ''],
      ['deadline', 'date', ''],
      ['status', 'enum (active, closed, draft)', ''],
      ['is_sponsored', 'boolean', 'Paid sponsored post'],
      ['views_count', 'int', ''],
      ['created_at', 'timestamptz', ''],
    ],
    [2500, 2000, 4860]
  ),
 
  h3('Table: applications'),
  makeTable(
    ['Column', 'Type', 'Notes'],
    [
      ['id', 'uuid (PK)', ''],
      ['student_id', 'uuid (FK)', ''],
      ['job_id', 'uuid (FK)', ''],
      ['status', 'enum (applied, shortlisted, interview, hired, rejected)', ''],
      ['cover_letter', 'text', ''],
      ['applied_at', 'timestamptz', ''],
      ['interview_at', 'timestamptz', ''],
      ['notes', 'text', 'Company internal notes'],
    ],
    [2000, 2500, 4860]
  ),
 
  h2('2.4 Tests & Assignments'),
  h3('Table: tests'),
  makeTable(
    ['Column', 'Type', 'Notes'],
    [
      ['id', 'uuid (PK)', ''],
      ['title', 'text', ''],
      ['description', 'text', ''],
      ['group_target', 'enum (A, B, C, all)', 'Which student group'],
      ['scheduled_date', 'date', ''],
      ['duration_minutes', 'int', ''],
      ['total_marks', 'int', ''],
      ['passing_marks', 'int', ''],
      ['is_published', 'boolean', ''],
      ['created_by', 'uuid (FK)', 'Admin user'],
    ],
    [2500, 2000, 4860]
  ),
 
  h3('Table: questions'),
  makeTable(
    ['Column', 'Type', 'Notes'],
    [
      ['id', 'uuid (PK)', ''],
      ['test_id', 'uuid (FK)', ''],
      ['question_text', 'text', ''],
      ['options', 'jsonb', 'Array of {label, value}'],
      ['correct_answer', 'text', 'Encrypted / hashed'],
      ['marks', 'int', ''],
      ['difficulty', 'enum (easy, medium, hard)', ''],
      ['skill_tag', 'text', 'For AI skill mapping'],
    ],
    [2200, 2000, 5160]
  ),
 
  h3('Table: test_attempts'),
  makeTable(
    ['Column', 'Type', 'Notes'],
    [
      ['id', 'uuid (PK)', ''],
      ['test_id', 'uuid (FK)', ''],
      ['student_id', 'uuid (FK)', ''],
      ['answers', 'jsonb', '{question_id: answer}'],
      ['score', 'int', ''],
      ['passed', 'boolean', ''],
      ['started_at', 'timestamptz', ''],
      ['submitted_at', 'timestamptz', ''],
      ['tab_switches', 'int', 'Anti-cheat: app switch count'],
      ['suspicious_events', 'jsonb', 'Array of flagged events'],
      ['is_flagged', 'boolean', 'Admin review needed'],
      ['consecutive_passes', 'int', 'For scholarship qualification'],
    ],
    [2500, 2000, 4860]
  ),
 
  h3('Table: assignments'),
  makeTable(
    ['Column', 'Type', 'Notes'],
    [
      ['id', 'uuid (PK)', ''],
      ['title', 'text', ''],
      ['description', 'text', ''],
      ['group_target', 'enum (A, B, C, all)', ''],
      ['due_date', 'date', ''],
      ['total_marks', 'int', ''],
      ['is_published', 'boolean', ''],
      ['created_by', 'uuid (FK)', ''],
    ],
    [2200, 2000, 5160]
  ),
 
  h3('Table: assignment_submissions'),
  makeTable(
    ['Column', 'Type', 'Notes'],
    [
      ['id', 'uuid (PK)', ''],
      ['assignment_id', 'uuid (FK)', ''],
      ['student_id', 'uuid (FK)', ''],
      ['submission_url', 'text', 'GitHub link or file URL'],
      ['description', 'text', ''],
      ['file_url', 'text', 'Supabase Storage upload'],
      ['score', 'int', 'Admin grades this'],
      ['feedback', 'text', ''],
      ['plagiarism_score', 'numeric', 'AI detected (0-100)'],
      ['is_flagged', 'boolean', ''],
      ['submitted_at', 'timestamptz', ''],
    ],
    [2500, 2000, 4860]
  ),
 
  h2('2.5 Courses'),
  h3('Table: courses'),
  makeTable(
    ['Column', 'Type', 'Notes'],
    [
      ['id', 'uuid (PK)', ''],
      ['title', 'text', ''],
      ['description', 'text', ''],
      ['skill_tags', 'text[]', ''],
      ['thumbnail_url', 'text', ''],
      ['is_free', 'boolean', ''],
      ['price', 'numeric', 'If paid'],
      ['is_premium_only', 'boolean', ''],
      ['created_by', 'uuid (FK)', 'Admin'],
      ['published_at', 'timestamptz', ''],
    ],
    [2200, 2000, 5160]
  ),
 
  h3('Table: course_videos'),
  makeTable(
    ['Column', 'Type', 'Notes'],
    [
      ['id', 'uuid (PK)', ''],
      ['course_id', 'uuid (FK)', ''],
      ['title', 'text', ''],
      ['video_url', 'text', 'Compressed Supabase Storage URL'],
      ['duration_seconds', 'int', ''],
      ['order_index', 'int', 'Playlist order'],
    ],
    [2200, 2000, 5160]
  ),
 
  h3('Table: course_enrollments'),
  makeTable(
    ['Column', 'Type', 'Notes'],
    [
      ['id', 'uuid (PK)', ''],
      ['student_id', 'uuid (FK)', ''],
      ['course_id', 'uuid (FK)', ''],
      ['progress_percent', 'int', ''],
      ['completed', 'boolean', ''],
      ['enrolled_at', 'timestamptz', ''],
    ],
    [2200, 2000, 5160]
  ),
 
  h2('2.6 Ranking, Badges & Rewards'),
  h3('Table: badges'),
  makeTable(
    ['Column', 'Type', 'Notes'],
    [
      ['id', 'uuid (PK)', ''],
      ['name', 'text', 'e.g. "Top Performer"'],
      ['icon_url', 'text', ''],
      ['criteria', 'text', 'Description of how to earn'],
    ],
    [2000, 2000, 5360]
  ),
 
  h3('Table: student_badges'),
  makeTable(
    ['Column', 'Type', 'Notes'],
    [
      ['id', 'uuid (PK)', ''],
      ['student_id', 'uuid (FK)', ''],
      ['badge_id', 'uuid (FK)', ''],
      ['awarded_at', 'timestamptz', ''],
    ],
    [2000, 2000, 5360]
  ),
 
  h3('Table: rewards'),
  makeTable(
    ['Column', 'Type', 'Notes'],
    [
      ['id', 'uuid (PK)', ''],
      ['student_id', 'uuid (FK)', ''],
      ['reward_type', 'enum (free_course, badge, premium_trial)', ''],
      ['description', 'text', ''],
      ['awarded_at', 'timestamptz', ''],
      ['expires_at', 'timestamptz', ''],
      ['is_claimed', 'boolean', ''],
    ],
    [2200, 2500, 4660]
  ),
 
  h2('2.7 Advertisements'),
  h3('Table: advertisements'),
  makeTable(
    ['Column', 'Type', 'Notes'],
    [
      ['id', 'uuid (PK)', ''],
      ['company_id', 'uuid (FK)', ''],
      ['title', 'text', ''],
      ['image_url', 'text', ''],
      ['target_url', 'text', ''],
      ['ad_type', 'enum (banner, featured_job, sponsored)', ''],
      ['status', 'enum (pending, active, rejected, expired)', ''],
      ['starts_at', 'timestamptz', ''],
      ['ends_at', 'timestamptz', ''],
      ['impressions', 'int', ''],
      ['clicks', 'int', ''],
      ['amount_paid', 'numeric', ''],
    ],
    [2500, 2000, 4860]
  ),
 
  h2('2.8 Success Stories & Mentorship'),
  h3('Table: success_stories'),
  makeTable(
    ['Column', 'Type', 'Notes'],
    [
      ['id', 'uuid (PK)', ''],
      ['student_id', 'uuid (FK)', ''],
      ['company_name', 'text', ''],
      ['role_title', 'text', ''],
      ['story_text', 'text', ''],
      ['photo_url', 'text', ''],
      ['is_published', 'boolean', 'Admin approves'],
      ['published_at', 'timestamptz', ''],
    ],
    [2200, 2000, 5160]
  ),
 
  h3('Table: mentorship_sessions'),
  makeTable(
    ['Column', 'Type', 'Notes'],
    [
      ['id', 'uuid (PK)', ''],
      ['student_id', 'uuid (FK)', ''],
      ['mentor_id', 'uuid (FK)', 'Admin / senior engineer'],
      ['session_type', 'enum (mock_interview, resume_review, career_guidance)', ''],
      ['scheduled_at', 'timestamptz', ''],
      ['status', 'enum (pending, confirmed, completed, cancelled)', ''],
      ['notes', 'text', ''],
    ],
    [2500, 2000, 4860]
  ),
 
  h2('2.9 Notifications & Activity'),
  h3('Table: notifications'),
  makeTable(
    ['Column', 'Type', 'Notes'],
    [
      ['id', 'uuid (PK)', ''],
      ['user_id', 'uuid (FK)', ''],
      ['type', 'text', 'e.g. test_scheduled, badge_earned'],
      ['title', 'text', ''],
      ['body', 'text', ''],
      ['is_read', 'boolean', ''],
      ['created_at', 'timestamptz', ''],
    ],
    [2000, 2000, 5360]
  ),
 
  h3('Table: activity_logs'),
  makeTable(
    ['Column', 'Type', 'Notes'],
    [
      ['id', 'uuid (PK)', ''],
      ['user_id', 'uuid (FK)', ''],
      ['action', 'text', 'e.g. login, test_start, app_switch'],
      ['metadata', 'jsonb', 'Extra context data'],
      ['ip_address', 'inet', ''],
      ['device_info', 'text', ''],
      ['created_at', 'timestamptz', ''],
    ],
    [2000, 2000, 5360]
  ),
 
  divider(),
  pageBreak(),
 
  // ── SECTION 3 ─────────────────────────────────────────────────────────────
  h1('3. API Endpoints — Complete List'),
  p('All endpoints are prefixed with /api/v1. Every protected route requires Authorization: Bearer <supabase_jwt_token> header.'),
 
  h2('3.1 Authentication Endpoints'),
  makeTable(
    ['Method', 'Endpoint', 'Role', 'Description'],
    [
      ['POST', '/auth/register/student', 'Public', 'Register new student'],
      ['POST', '/auth/register/company', 'Public', 'Register new company'],
      ['POST', '/auth/login', 'Public', 'Email + password login'],
      ['POST', '/auth/logout', 'Any', 'Invalidate session'],
      ['POST', '/auth/verify-email', 'Public', 'Confirm email OTP'],
      ['POST', '/auth/verify-phone', 'Any', 'Send + verify phone OTP'],
      ['POST', '/auth/forgot-password', 'Public', 'Send reset email'],
      ['POST', '/auth/reset-password', 'Public', 'Set new password'],
      ['GET',  '/auth/me', 'Any', 'Get current user profile'],
    ],
    [900, 2800, 1400, 4260]
  ),
 
  h2('3.2 Student Endpoints'),
  makeTable(
    ['Method', 'Endpoint', 'Description'],
    [
      ['GET/PUT', '/students/profile', 'Get or update student profile'],
      ['GET', '/students/dashboard', 'Dashboard stats, upcoming tests, rank'],
      ['POST', '/students/skills', 'Add a skill'],
      ['DELETE', '/students/skills/:id', 'Remove a skill'],
      ['POST', '/students/certificates', 'Upload certificate (multipart)'],
      ['GET', '/students/certificates', 'List all certificates'],
      ['GET', '/students/ranking', 'Get leaderboard + own position'],
      ['GET', '/students/badges', 'Get earned badges'],
      ['GET', '/students/performance', 'Test scores, assignment grades, graphs'],
      ['GET', '/students/recommendations', 'AI-generated job/course recommendations'],
      ['GET', '/students/nearby-companies', 'Map data: companies near lat/lng'],
    ],
    [1000, 3000, 5360]
  ),
 
  h2('3.3 Jobs & Applications'),
  makeTable(
    ['Method', 'Endpoint', 'Description'],
    [
      ['GET', '/jobs', 'List all active jobs (filter by skill, type, location)'],
      ['GET', '/jobs/:id', 'Get job detail'],
      ['POST', '/jobs/:id/apply', 'Student applies for a job'],
      ['GET', '/students/applications', 'Student sees their applications'],
      ['GET', '/companies/applications', 'Company sees all applicants'],
      ['PUT', '/companies/applications/:id', 'Update applicant status (shortlist, hire, etc.)'],
      ['GET', '/companies/jobs', 'List company own postings'],
      ['POST', '/companies/jobs', 'Create new job posting'],
      ['PUT', '/companies/jobs/:id', 'Edit job posting'],
      ['DELETE', '/companies/jobs/:id', 'Delete job posting'],
    ],
    [900, 2800, 5660]
  ),
 
  h2('3.4 Tests & Assignments'),
  makeTable(
    ['Method', 'Endpoint', 'Description'],
    [
      ['GET', '/tests/upcoming', 'Student: get scheduled test for own group'],
      ['POST', '/tests/:id/start', 'Start test session (timer begins, fullscreen lock)'],
      ['POST', '/tests/:id/submit', 'Submit answers + anti-cheat events log'],
      ['GET', '/tests/:id/result', 'Get test result + score'],
      ['POST', '/tests/:id/cheat-event', 'Log suspicious event (tab switch, paste, etc.)'],
      ['GET', '/assignments/upcoming', 'Student: get assignment for own group'],
      ['POST', '/assignments/:id/submit', 'Submit assignment (URL + optional file)'],
      ['GET', '/assignments/:id/submission', 'Get own submission + grade'],
      ['GET', '/admin/tests', 'Admin: list all tests'],
      ['POST', '/admin/tests', 'Admin: create test + questions'],
      ['PUT', '/admin/tests/:id', 'Admin: edit test'],
      ['GET', '/admin/submissions', 'Admin: all submissions to grade'],
      ['PUT', '/admin/submissions/:id/grade', 'Admin: submit grade + feedback'],
    ],
    [900, 2800, 5660]
  ),
 
  h2('3.5 Courses'),
  makeTable(
    ['Method', 'Endpoint', 'Description'],
    [
      ['GET', '/courses', 'List all courses (filter free/premium/skill)'],
      ['GET', '/courses/:id', 'Course detail + video list'],
      ['POST', '/courses/:id/enroll', 'Enroll in a course'],
      ['PUT', '/courses/:id/progress', 'Update video progress'],
      ['GET', '/students/courses', 'My enrolled courses'],
      ['POST', '/admin/courses', 'Admin: create course'],
      ['POST', '/admin/courses/:id/videos', 'Admin: upload video (multipart, compressed)'],
    ],
    [900, 2500, 5960]
  ),
 
  h2('3.6 Company & Talent Search'),
  makeTable(
    ['Method', 'Endpoint', 'Description'],
    [
      ['GET', '/companies/talent', 'Search students (filter: skills, uni, rating, trust)'],
      ['GET', '/companies/talent/:id', 'View student full profile'],
      ['POST', '/companies/interviews', 'Schedule interview with student'],
      ['GET', '/companies/interviews', 'List company scheduled interviews'],
      ['POST', '/companies/ads', 'Create ad campaign'],
      ['GET', '/companies/ads', 'List own ads + stats'],
      ['GET', '/companies/analytics', 'Recruitment analytics dashboard'],
    ],
    [900, 2500, 5960]
  ),
 
  h2('3.7 Admin Endpoints'),
  makeTable(
    ['Method', 'Endpoint', 'Description'],
    [
      ['GET', '/admin/dashboard', 'Platform-wide stats'],
      ['GET', '/admin/users', 'List all users (filter by role, status)'],
      ['PUT', '/admin/users/:id/block', 'Block or unblock account'],
      ['GET', '/admin/companies/pending', 'Companies awaiting verification'],
      ['PUT', '/admin/companies/:id/verify', 'Approve or reject company'],
      ['GET', '/admin/ads/pending', 'Ads awaiting moderation'],
      ['PUT', '/admin/ads/:id/moderate', 'Approve or reject ad'],
      ['GET', '/admin/security-alerts', 'Flagged cheating + suspicious activity'],
      ['PUT', '/admin/test-attempts/:id/flag', 'Flag or clear a test attempt'],
      ['POST', '/admin/success-stories', 'Publish a success story'],
      ['GET', '/admin/activity-logs', 'All platform activity logs'],
    ],
    [900, 2800, 5660]
  ),
 
  h2('3.8 Notifications & Payments'),
  makeTable(
    ['Method', 'Endpoint', 'Description'],
    [
      ['GET', '/notifications', 'Get user notifications'],
      ['PUT', '/notifications/read-all', 'Mark all as read'],
      ['POST', '/payments/premium/checkout', 'Student: initiate premium membership payment'],
      ['POST', '/payments/ads/checkout', 'Company: initiate ad payment'],
      ['POST', '/payments/webhook', 'Stripe webhook (payment confirmed)'],
    ],
    [900, 2800, 5660]
  ),
 
  divider(),
  pageBreak(),
 
  // ── SECTION 4 ─────────────────────────────────────────────────────────────
  h1('4. Authentication & Security Setup'),
 
  h2('4.1 Supabase Auth Configuration'),
  p('In Supabase Dashboard → Authentication → Providers:'),
  bullet('Enable Email provider'),
  bullet('Enable Phone provider (Twilio for OTP)'),
  bullet('Enable MFA (TOTP) — required for Admin accounts'),
  bullet('Set JWT expiry to 3600 seconds (1 hour)'),
  bullet('Enable refresh tokens with 30-day rotation'),
  ...space(1),
  p('In Supabase Dashboard → Authentication → Email Templates — customize all emails with your platform name.'),
 
  h2('4.2 Row Level Security (RLS) Policies'),
  warn('Enable RLS on EVERY table. Without this, any user can read all data.'),
  ...space(1),
  p('Key RLS rules to implement:'),
  bullet('profiles: users can only read/update their own row'),
  bullet('student_profiles: students own row; companies can read (for talent search); admin reads all'),
  bullet('test_attempts: student sees only own attempts; admin sees all'),
  bullet('questions: students cannot read correct_answer column'),
  bullet('job_postings: public read for active posts; company write own posts only'),
  bullet('applications: student reads own; company reads applications to their jobs only'),
  bullet('activity_logs: admin read only'),
  bullet('advertisements: company reads own; admin reads all; public reads active approved ads'),
 
  h2('4.3 JWT Middleware (Node.js)'),
  p('Every protected API route must validate the Supabase JWT:'),
  code('const { createClient } = require("@supabase/supabase-js");'),
  code('const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);'),
  code(''),
  code('async function authMiddleware(req, res, next) {'),
  code('  const token = req.headers.authorization?.replace("Bearer ", "");'),
  code('  if (!token) return res.status(401).json({ error: "No token" });'),
  code('  const { data: { user }, error } = await supabase.auth.getUser(token);'),
  code('  if (error || !user) return res.status(401).json({ error: "Invalid token" });'),
  code('  req.user = user;'),
  code('  next();'),
  code('}'),
 
  h2('4.4 Role Guard Middleware'),
  code('function requireRole(...roles) {'),
  code('  return async (req, res, next) => {'),
  code('    const { data } = await supabase'),
  code('      .from("profiles").select("role").eq("id", req.user.id).single();'),
  code('    if (!roles.includes(data?.role))'),
  code('      return res.status(403).json({ error: "Forbidden" });'),
  code('    req.userRole = data.role;'),
  code('    next();'),
  code('  };'),
  code('}'),
  code('// Usage: router.get("/admin/users", authMiddleware, requireRole("admin"), handler)'),
 
  h2('4.5 Device Fingerprinting & IP Monitoring'),
  bullet('On every login, save device_fingerprint and last_ip to profiles table'),
  bullet('If same account logs in from 3+ different devices in 24 hours → flag in activity_logs'),
  bullet('If IP is flagged as VPN/proxy (use ip-api.com) → require additional OTP verification'),
  bullet('University email verification: restrict student registration to .edu or known university domains'),
 
  divider(),
 
  // ── SECTION 5 ─────────────────────────────────────────────────────────────
  h1('5. AI Integration — Gemini Flash API'),
 
  h2('5.1 Recommendation Engine'),
  p('When a student requests recommendations (GET /students/recommendations), send this data to Gemini:'),
  bullet('Student skills list'),
  bullet('Test performance scores per skill_tag'),
  bullet('Assignment grades'),
  bullet('Courses completed'),
  bullet('Job applications history'),
  bullet('Current trust_score and rank'),
  ...space(1),
  p('Prompt structure to send to Gemini Flash:'),
  code('"Given this student profile: [JSON], recommend:'),
  code(' 1. Top 5 job postings from this list: [active jobs JSON]'),
  code(' 2. Top 3 courses from this list: [courses JSON]'),
  code(' 3. Skills they should learn next.'),
  code(' Return ONLY valid JSON, no markdown."'),
  ...space(1),
  note('Cache recommendations per student for 6 hours in Supabase to avoid excessive Gemini API calls.'),
 
  h2('5.2 Plagiarism Detection (Assignments)'),
  p('When admin grades an assignment, before saving score, call Gemini:'),
  code('"Analyze this student assignment submission: [text/code]'),
  code(' Check for: 1) AI-generated content, 2) copy-paste patterns.'),
  code(' Return JSON: { plagiarism_score: 0-100, ai_generated: true/false, reason: string }"'),
  ...space(1),
  bullet('If plagiarism_score > 70 → auto-flag submission, reduce trust_score by 10 points'),
  bullet('If ai_generated is true → flag for admin review'),
 
  h2('5.3 Test Anti-Cheat AI Analysis'),
  p('After test submission, run behavioral analysis:'),
  bullet('If tab_switches > 3 → reduce trust_score, flag attempt'),
  bullet('If answer pattern is statistically abnormal (all correct in < 10 seconds per question) → flag'),
  bullet('Send suspicious_events array to Gemini for behavioral pattern analysis'),
 
  divider(),
 
  // ── SECTION 6 ─────────────────────────────────────────────────────────────
  h1('6. Scheduling System — Test Groups'),
 
  h2('6.1 Group Assignment Logic'),
  p('When a student registers, assign them to a group (A, B, or C) by balancing group sizes:'),
  code('SELECT test_group, COUNT(*) FROM student_profiles GROUP BY test_group ORDER BY COUNT(*) ASC LIMIT 1;'),
  p('Assign the student to the group with the fewest members.'),
 
  h2('6.2 Weekly Schedule'),
  makeTable(
    ['Group', 'Test Day', 'Assignment Day', 'Purpose'],
    [
      ['A', 'Monday', 'Thursday', 'Spreads server load across week'],
      ['B', 'Tuesday', 'Friday', 'Increases daily app engagement'],
      ['C', 'Wednesday', 'Saturday', 'All students active every weekday'],
    ],
    [1500, 2000, 2500, 3360]
  ),
 
  h2('6.3 Cron Jobs (node-cron)'),
  p('Run these background jobs on your Node.js server:'),
  bullet('Every Sunday midnight → publish next week tests/assignments for correct groups'),
  bullet('Every day at 00:00 → update student rank_position based on total_points'),
  bullet('Every day at 06:00 → update streak_days (reset if no login in 24 hours)'),
  bullet('Every hour → check premium_expires_at, downgrade expired accounts'),
  bullet('Every hour → check featured_expires_at, remove expired company features'),
  bullet('Every 5 minutes → update advertisement impressions/clicks counters'),
  bullet('Every Monday 09:00 → send push notification to Group A "Your test is today!"'),
  ...space(1),
  note('Use BullMQ with Redis for job queuing if your user base grows above 10,000 students.'),
 
  h2('6.4 Ranking Algorithm'),
  p('Run every night at 00:00. Calculate total_points for each student:'),
  makeTable(
    ['Action', 'Points', 'Notes'],
    [
      ['Pass weekly test', '+50', 'Based on score percentage'],
      ['Score > 90% on test', '+20 bonus', 'Excellence bonus'],
      ['Complete assignment (on time)', '+30', ''],
      ['Complete a course', '+40', ''],
      ['Daily login streak (per day)', '+5', 'Max 35/week'],
      ['Get hired via platform', '+200', 'One-time'],
      ['Tab switch during test', '-15', 'Per occurrence'],
      ['Flagged for cheating', '-100', 'Admin confirmed'],
      ['3 consecutive test passes', 'Scholarship eligible', 'Reward system trigger'],
    ],
    [3000, 1500, 4860]
  ),
 
  divider(),
 
  // ── SECTION 7 ─────────────────────────────────────────────────────────────
  h1('7. File Storage Setup — Supabase Storage'),
 
  h2('7.1 Storage Buckets to Create'),
  makeTable(
    ['Bucket Name', 'Access', 'Contents'],
    [
      ['avatars', 'Public', 'User profile photos'],
      ['certificates', 'Private (owner only)', 'Student uploaded certificates'],
      ['assignments', 'Private (owner + admin)', 'Assignment file submissions'],
      ['company-docs', 'Private (admin only)', 'Company verification documents'],
      ['course-videos', 'Private (enrolled only)', 'Course video files'],
      ['course-thumbnails', 'Public', 'Course cover images'],
      ['ads-media', 'Public', 'Advertisement images/banners'],
      ['success-photos', 'Public', 'Success story photos'],
    ],
    [2500, 2500, 4360]
  ),
 
  h2('7.2 Video Compression'),
  p('Course video uploads must be compressed before storing. Use ffmpeg on the Node.js server:'),
  code('ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -preset fast -acodec aac output.mp4'),
  bullet('Target: reduce file size by 60-70% with minimal quality loss'),
  bullet('Max upload size per video: 500MB before compression, target 150MB after'),
  bullet('Store compressed video URL in course_videos.video_url'),
 
  divider(),
 
  // ── SECTION 8 ─────────────────────────────────────────────────────────────
  h1('8. Anti-Cheat Backend Implementation'),
 
  h2('8.1 Test Session Security'),
  bullet('On POST /tests/:id/start → create a test_session record with started_at timestamp'),
  bullet('Server enforces time limit: if submitted_at - started_at > duration_minutes → reject submission'),
  bullet('Questions are shuffled server-side per student (never in frontend)'),
  bullet('Answer options are randomized server-side per question'),
  bullet('correct_answer is NEVER sent to the client — only question text and options'),
  bullet('Answers are evaluated server-side on submission'),
 
  h2('8.2 Cheat Event Logging'),
  p('The Flutter app must call POST /tests/:id/cheat-event for each event. Backend logs:'),
  makeTable(
    ['Event Type', 'Action on Backend'],
    [
      ['app_switch', 'Increment tab_switches. If > 3: add 15 point penalty'],
      ['copy_attempt', 'Log to suspicious_events array'],
      ['paste_attempt', 'Log to suspicious_events array'],
      ['fullscreen_exit', 'Log to suspicious_events array'],
      ['test_timeout', 'Auto-submit whatever answers were saved'],
      ['rapid_answers', 'Flag if avg time per question < 8 seconds'],
    ],
    [3000, 6360]
  ),
 
  h2('8.3 Trust Score System'),
  p('trust_score (0-100) is stored on student_profiles and updated automatically:'),
  bullet('New account starts at 80'),
  bullet('Each confirmed cheat event: -10 points'),
  bullet('Admin clears flag: +5 points'),
  bullet('Passing 5 consecutive clean tests: +5 points'),
  bullet('Trust score < 40: account flagged, company filter hides student from search'),
  bullet('Trust score < 20: account auto-blocked, admin notified'),
 
  divider(),
 
  // ── SECTION 9 ─────────────────────────────────────────────────────────────
  h1('9. Google Maps Integration'),
 
  h2('9.1 Storing Company Locations'),
  bullet('When company registers, save latitude + longitude to company_profiles table'),
  bullet('Use Google Geocoding API to convert address → coordinates automatically'),
 
  h2('9.2 Nearby Companies API'),
  p('GET /students/nearby-companies?lat=31.5&lng=74.3&radius=10'),
  p('Backend SQL (PostGIS or Haversine formula):'),
  code('SELECT *, (6371 * acos(cos(radians($1)) * cos(radians(latitude))'),
  code('  * cos(radians(longitude) - radians($2))'),
  code('  + sin(radians($1)) * sin(radians(latitude)))) AS distance'),
  code('FROM company_profiles'),
  code('WHERE is_verified = true'),
  code('HAVING distance < $3'),
  code('ORDER BY distance ASC LIMIT 20;'),
 
  divider(),
 
  // ── SECTION 10 ──────────────────────────────────────────────────────────
  h1('10. Payments & Monetization'),
 
  h2('10.1 Revenue Streams to Implement'),
  makeTable(
    ['Revenue Type', 'Table', 'Flow'],
    [
      ['Premium Student Membership', 'student_profiles.is_premium', 'Student → Stripe → webhook → set is_premium + expiry'],
      ['Featured Company Listing', 'company_profiles.is_featured', 'Company → Stripe → webhook → set is_featured + expiry'],
      ['Advertisement Campaigns', 'advertisements', 'Company → Stripe → webhook → activate ad campaign'],
      ['Sponsored Job Posts', 'job_postings.is_sponsored', 'Company → Stripe → webhook → promote job listing'],
      ['Course Purchases', 'course_enrollments', 'Student → Stripe → webhook → grant course enrollment'],
    ],
    [2800, 2500, 4060]
  ),
 
  h2('10.2 Stripe Webhook Handler'),
  p('POST /payments/webhook — this is called by Stripe when payment succeeds:'),
  code('switch (event.type) {'),
  code('  case "checkout.session.completed":'),
  code('    const { metadata } = event.data.object;'),
  code('    if (metadata.type === "premium") activatePremium(metadata.student_id);'),
  code('    if (metadata.type === "ad") activateAd(metadata.ad_id);'),
  code('    if (metadata.type === "featured") activateFeatured(metadata.company_id);'),
  code('}'),
  warn('Always verify Stripe webhook signature using stripe.webhooks.constructEvent() before processing.'),
 
  divider(),
 
  // ── SECTION 11 ──────────────────────────────────────────────────────────
  h1('11. Deployment on Hostinger VPS'),
 
  h2('11.1 Server Setup Steps'),
  num('Purchase Hostinger VPS (minimum KVM 2: 2 CPU, 8GB RAM, 100GB SSD)'),
  num('Install Node.js 20 LTS via nvm'),
  num('Install PM2 globally: npm install -g pm2'),
  num('Install Nginx as reverse proxy'),
  num('Configure Nginx to proxy port 80/443 → Node.js port 3000'),
  num('Install Certbot and get free SSL certificate for your domain'),
  num('Set up environment variables in .env file (never commit to Git)'),
  num('Deploy: git pull → npm install → pm2 restart all'),
 
  h2('11.2 Required .env Variables'),
  code('SUPABASE_URL=https://rbbfptslllfwrtpptfof.supabase.co'),
  code('SUPABASE_SERVICE_KEY=your_service_role_key_here'),
  code('GEMINI_API_KEY=your_gemini_key_here'),
  code('GOOGLE_MAPS_KEY=your_maps_key_here'),
  code('STRIPE_SECRET_KEY=sk_live_...'),
  code('STRIPE_WEBHOOK_SECRET=whsec_...'),
  code('PORT=3000'),
  code('NODE_ENV=production'),
  warn('Use SUPABASE_SERVICE_KEY (not anon key) on the server. Never expose service key to mobile app.'),
 
  h2('11.3 PM2 Configuration'),
  code('pm2 start src/index.js --name "job-platform-api" --instances 2 --exec-mode cluster'),
  code('pm2 save'),
  code('pm2 startup   # Auto-start on server reboot'),
 
  divider(),
 
  // ── SECTION 12 ──────────────────────────────────────────────────────────
  h1('12. Build Order — Step by Step'),
  p('Follow this exact order to avoid blocking your frontend team:'),
  ...space(1),
  makeTable(
    ['Phase', 'Tasks', 'Priority'],
    [
      ['Phase 1 (Week 1)', 'Supabase project setup, all tables created, RLS enabled, Auth configured', 'CRITICAL'],
      ['Phase 2 (Week 1)', 'Node.js project scaffold, auth middleware, role guard, /auth/* endpoints', 'CRITICAL'],
      ['Phase 3 (Week 2)', 'Student profile endpoints, company profile endpoints, file upload endpoints', 'HIGH'],
      ['Phase 4 (Week 2)', 'Job postings CRUD, applications system, talent search with filters', 'HIGH'],
      ['Phase 5 (Week 3)', 'Tests system, questions bank, anti-cheat event logging, scoring engine', 'HIGH'],
      ['Phase 6 (Week 3)', 'Assignments, submissions, admin grading, plagiarism API call', 'HIGH'],
      ['Phase 7 (Week 4)', 'Ranking cron job, badge system, rewards, leaderboard endpoint', 'MEDIUM'],
      ['Phase 8 (Week 4)', 'Courses, video upload + compression, enrollment, progress tracking', 'MEDIUM'],
      ['Phase 9 (Week 5)', 'AI recommendations (Gemini), Google Maps nearby companies', 'MEDIUM'],
      ['Phase 10 (Week 5)', 'Payments (Stripe), premium membership, ads, featured listings', 'MEDIUM'],
      ['Phase 11 (Week 6)', 'Notifications (Supabase Realtime), success stories, mentorship', 'LOW'],
      ['Phase 12 (Week 6)', 'VPS deployment, Nginx, SSL, PM2, environment hardening', 'CRITICAL'],
    ],
    [2000, 5000, 1800 + 560]
  ),
 
  divider(),
  ...space(1),
  new Paragraph({
    spacing: { before: 200, after: 0 },
    children: [new TextRun({ text: 'End of Backend Architecture Guide  •  AI Job Platform  •  Senior Backend Reference', size: 20, font: 'Arial', color: '94A3B8', italics: true })]
  })
];
 
// ── Document ──────────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [
      { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: 'numbers', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 36, bold: true, font: 'Arial', color: '0F172A' }, paragraph: { spacing: { before: 480, after: 160 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: 'Arial', color: '1D4ED8' }, paragraph: { spacing: { before: 320, after: 120 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: 'Arial', color: '334155' }, paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
    children
  }]
});
 
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('d:/interncompany/Backend_Architecture_Guide.docx', buf);
  console.log('Done!');
});

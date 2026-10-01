const http = require('http');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const mammoth = require('mammoth');

const {
  readDb,
  writeDb,
  setCorsHeaders,
  validateToken,
  otps,
  SUPABASE_URL,
  SUPABASE_ANON_KEY
} = require('./logic');

const PORT = 8080;

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // Protect endpoints
  const protectedRoutes = [
    '/api/student/profile',
    '/api/student/profile/update',
    '/api/tests/submit',
    '/api/activity/log',
    '/api/assignments/submit',
    '/api/jobs/create',
    '/api/interviews/schedule',
    '/api/companies/verify',
    '/api/submissions/grade',
    '/api/tests/create',
    '/api/assignments/create',
    '/api/courses/create'
  ];

  if (protectedRoutes.includes(pathname)) {
    const authHeader = req.headers['authorization'];
    const user = await validateToken(authHeader);
    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized: Invalid or missing token' }));
      return;
    }
  }

  if (pathname === '/api/config' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      supabaseUrl: SUPABASE_URL,
      supabaseAnonKey: SUPABASE_ANON_KEY
    }));
    return;
  }

  // --- 1. Gateway & Authentication API ---
  if (pathname === '/api/send-otp' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        if (!payload.email) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Email is required' }));
          return;
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        otps[payload.email] = otp;
        console.log(`[OTP generated for ${payload.email}]: ${otp}`);

        // Try to send verification email via Firebase if API key is present
        const fbApiKey = process.env.FIREBASE_API_KEY;
        let emailSent = false;
        let emailError = null;

        if (fbApiKey) {
          try {
            const hostHeader = req.headers.host || 'localhost:8080';
            const windowOrigin = `http://${hostHeader}`;
            const fbRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${fbApiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                requestType: "EMAIL_SIGNIN",
                email: payload.email,
                continueUrl: `${windowOrigin}/website/index.html`
              })
            });
            const fbData = await fbRes.json();
            if (fbRes.ok) {
              emailSent = true;
              console.log(`Firebase Verification sign-in email sent to ${payload.email}`);
            } else {
              console.error("Firebase sendOobCode failed:", fbData);
              emailError = fbData.error?.message || "Firebase sendOobCode failed";
            }
          } catch (fbErr) {
            console.error("Firebase Auth API request failed:", fbErr);
            emailError = fbErr.message;
          }
        }

        // Fallback to SMTP/Nodemailer if Firebase not used or failed
        if (!emailSent) {
          const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER;
          const emailPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
          const emailHost = process.env.SMTP_HOST || 'smtp.gmail.com';
          const emailPort = process.env.SMTP_PORT || 465;

          if (emailUser && emailPass) {
            try {
              const transporter = nodemailer.createTransport({
                host: emailHost,
                port: parseInt(emailPort),
                secure: emailPort == 465,
                auth: {
                  user: emailUser,
                  pass: emailPass
                }
              });

              await transporter.sendMail({
                from: `"Wizard Portal" <${emailUser}>`,
                to: payload.email,
                subject: "Wizard Portal Verification Code",
                text: `Your verification code is: ${otp}\n\nPlease enter this code to complete your registration.`,
                html: `
                  <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px;">
                    <h2 style="color: #8731a3;">Wizard Portal Verification</h2>
                    <p>Thank you for signing up. Please use the verification code below to complete your registration:</p>
                    <div style="background: #f4f5fc; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; text-align: center; color: #8731a3; letter-spacing: 5px;">
                      ${otp}
                    </div>
                    <p style="color: #666; font-size: 12px; margin-top: 20px;">If you did not request this code, you can safely ignore this email.</p>
                  </div>
                `
              });
              emailSent = true;
              console.log(`Email successfully sent to ${payload.email}`);
            } catch (err) {
              console.error("Nodemailer error sending email:", err);
              emailError = err.message;
            }
          } else {
            console.log("No SMTP credentials configured. Skipping real email delivery (fallback to screen demo code).");
          }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: emailSent ? 'OTP sent to email' : 'OTP generated (Console fallback)',
          otp,
          emailSent,
          emailError
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  else if (pathname === '/api/verify-otp' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        if (!payload.email || !payload.otp) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Email and OTP are required' }));
          return;
        }
        if (otps[payload.email] === String(payload.otp)) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid verification code' }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  else if (pathname === '/api/signup' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();

        if (!payload.username || !payload.email || !payload.password) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Username, email and password are required' }));
          return;
        }

        const existing = db.users.find(u => u.email === payload.email || u.username === payload.username);
        if (existing) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'User already exists' }));
          return;
        }

        // Sync with Supabase Auth
        try {
          const supaRes = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY
            },
            body: JSON.stringify({
              email: payload.email,
              password: payload.password,
              options: {
                data: {
                  username: payload.username,
                  role: payload.role || 'student',
                  university: payload.university || '',
                  skills: payload.skills || []
                }
              }
            })
          });
          const supaData = await supaRes.json();
          if (supaRes.status >= 400) {
            console.error("Supabase returned signup error:", supaData);
          } else {
            console.log("Supabase signup sync success:", supaData.user?.id);
          }
        } catch (supaErr) {
          console.error("Failed to call Supabase signup API:", supaErr);
        }

        let userGroup = 'Group C';
        const userSkills = payload.skills || [];
        const hasMLorDS = userSkills.some(s => s.toLowerCase().includes('machine learning') || s.toLowerCase().includes('data science'));
        const hasSEorWeb = userSkills.some(s => s.toLowerCase().includes('software engineering') || s.toLowerCase().includes('web development') || s.toLowerCase().includes('javascript'));
        if (hasMLorDS) {
          userGroup = 'Group B';
        } else if (hasSEorWeb) {
          userGroup = 'Group A';
        }

        const newUser = {
          id: String(Date.now()),
          username: payload.username,
          email: payload.email,
          password: payload.password,
          role: payload.role || 'student',
          skills: userSkills,
          interests: payload.interests || [],
          rating: 4.0,
          badges: [],
          trustScore: 100,
          graduationYear: payload.graduationYear || '2026',
          university: payload.university || 'State University',
          consecutivePassed: 0,
          streak: 1,
          group: userGroup,
          lastLogin: Date.now()
        };

        db.users.push(newUser);
        writeDb(db);

        // Sync profile data to Supabase Database public tables (profiles or users)
        try {
          const profileData = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            skills: newUser.skills,
            university: newUser.university,
            trust_score: newUser.trustScore,
            streak: newUser.streak,
            group_name: newUser.group
          };

          // Try inserting to public.profiles table
          fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify(profileData)
          }).then(r => console.log(`Profiles table sync status: ${r.status}`))
            .catch(e => console.error("Profiles table sync failed:", e));

          // Try inserting to public.users table (alternative fallback)
          fetch(`${SUPABASE_URL}/rest/v1/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify(profileData)
          }).then(r => console.log(`Users table sync status: ${r.status}`))
            .catch(e => console.error("Users table sync failed:", e));

        } catch (dbErr) {
          console.error("Failed to sync profile to Supabase database tables:", dbErr);
        }

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, user: newUser }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  else if (pathname === '/api/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();

        // 1. Attempt verification with Supabase Auth
        let supabaseUser = null;
        try {
          const supaRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY
            },
            body: JSON.stringify({
              email: payload.email,
              password: payload.password
            })
          });
          if (supaRes.ok) {
            const data = await supaRes.json();
            supabaseUser = data.user;
          }
        } catch (supaErr) {
          console.error("Supabase Auth verification error:", supaErr);
        }

        // 2. Fetch or create local user (ignoring password check for demo purposes to allow easy testing)
        let user = db.users.find(u => u.email.toLowerCase() === payload.email.toLowerCase());

        if (!user && supabaseUser) {
          // User exists in Supabase but not locally, sync to local db.json
          user = {
            id: supabaseUser.id || String(Date.now()),
            username: payload.email.split('@')[0],
            email: payload.email,
            password: payload.password,
            role: supabaseUser.user_metadata?.role || 'student',
            skills: supabaseUser.user_metadata?.skills || [],
            interests: [],
            rating: 4.0,
            badges: [],
            trustScore: 100,
            graduationYear: '2026',
            university: supabaseUser.user_metadata?.university || 'State University',
            consecutivePassed: 0,
            streak: 1,
            group: 'Group C'
          };
          db.users.push(user);
          writeDb(db);
        } else if (!user) {
          // Auto-register if not found for demo purposes (from the duplicate route)
          user = {
            id: 'user_' + Date.now(),
            username: payload.email.split('@')[0],
            email: payload.email,
            role: 'student', // Default role
            password: payload.password,
            created_at: new Date().toISOString()
          };
          db.users.push(user);
          writeDb(db);
        }

        if (user) {
          user.lastLogin = Date.now();
          writeDb(db);
          // Sync profile to Supabase public tables to ensure record is visible
          try {
            const profileData = {
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role,
              skills: user.skills,
              university: user.university,
              trust_score: user.trustScore,
              streak: user.streak,
              group_name: user.group || 'Group C'
            };

            // Write to Supabase rest tables on login as well
            fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
              },
              body: JSON.stringify(profileData)
            }).catch(e => { });

            fetch(`${SUPABASE_URL}/rest/v1/users`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
              },
              body: JSON.stringify(profileData)
            }).catch(e => { });
          } catch (e) { }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, user }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid credentials' }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  // --- 2. Student Profile API ---
  else if (pathname === '/api/student/profile' && req.method === 'GET') {
    const db = readDb();
    const email = parsedUrl.searchParams.get('email') || 'studentone@gmail.com';
    const user = db.users.find(u => u.email === email);

    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'User profile not found' }));
    }
  }

  else if (pathname === '/api/student/profile/update' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();
        const user = db.users.find(u => u.email === payload.email);

        if (user) {
          if (payload.skills) user.skills = payload.skills;
          if (payload.interests) user.interests = payload.interests;
          if (payload.university) user.university = payload.university;
          if (typeof payload.trustScore !== 'undefined') user.trustScore = payload.trustScore;
          writeDb(db);

          // Sync updates to Supabase profiles/users tables
          const profileData = {};
          if (payload.skills) profileData.skills = payload.skills;
          if (payload.interests) profileData.interests = payload.interests;
          if (payload.university) profileData.university = payload.university;
          if (typeof payload.trustScore !== 'undefined') profileData.trust_score = payload.trustScore;

          if (Object.keys(profileData).length > 0) {
            fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
              },
              body: JSON.stringify(profileData)
            }).then(r => console.log(`Profiles update sync status: ${r.status}`))
              .catch(e => console.error("Profiles update sync failed:", e));

            fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${user.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
              },
              body: JSON.stringify(profileData)
            }).then(r => console.log(`Users update sync status: ${r.status}`))
              .catch(e => console.error("Users update sync failed:", e));
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, user }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'User not found' }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }


  else if (pathname === '/api/users' && req.method === 'GET') {
    const db = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    // Filter sensitive info like passwords before returning
    const safeUsers = db.users.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
      lastLogin: u.lastLogin || null
    }));
    res.end(JSON.stringify(safeUsers));
  }

  else if (pathname === '/api/users/role' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();
        const user = db.users.find(u => String(u.id) === String(payload.id));
        if (user) {
          user.role = payload.role;
          writeDb(db);
          
          // Sync the updated role to Supabase profiles table
          try {
            fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
              },
              body: JSON.stringify({ role: user.role })
            }).catch(e => { console.error("Supabase role sync error:", e); });
          } catch (e) {
            console.error("Failed to sync role to Supabase", e);
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'User not found' }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  else if (pathname === '/api/students' && req.method === 'GET') {
    const db = readDb();
    const students = db.users.filter(u => u.role === 'student');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(students));
  }

  else if (pathname === '/api/students/invite' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();
        const student = db.users.find(u => String(u.id) === String(payload.candidateId));

        if (student) {
          // Log simulated SMS/WhatsApp message
          const phone = student.phone || '+92 300 1234567';
          const smsText = `Hi ${student.username}, ${payload.companyName || 'EliteRecruit'} has invited you to apply for their role: ${payload.role || 'Internship'}. Check your dashboard.`;
          console.log(`[SMS Notification Sent to ${phone}]: ${smsText}`);

          // Create an in-app message/interview record in db.json
          db.interviews = db.interviews || [];
          const newInterview = {
            id: String(Date.now()),
            studentName: student.username || 'Student',
            studentEmail: student.email || '',
            company: payload.companyName || 'EliteRecruit',
            date: new Date().toISOString().split('T')[0],
            time: '12:00 PM',
            duration: 45,
            status: 'invited',
            message: payload.message || `Invitation to join ${payload.companyName || 'EliteRecruit'} for the role: ${payload.role}`
          };
          db.interviews.push(newInterview);
          writeDb(db);

          // Send real email using Nodemailer
          const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER;
          const emailPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
          const emailHost = process.env.SMTP_HOST || 'smtp.gmail.com';
          const emailPort = process.env.SMTP_PORT || 465;

          let emailSent = false;
          if (emailUser && emailPass && student.email) {
            try {
              const transporter = nodemailer.createTransport({
                host: emailHost,
                port: parseInt(emailPort),
                secure: emailPort == 465,
                auth: {
                  user: emailUser,
                  pass: emailPass
                }
              });

              await transporter.sendMail({
                from: `"${payload.companyName || 'EliteRecruit'}" <${emailUser}>`,
                to: student.email,
                subject: `Invitation from ${payload.companyName || 'EliteRecruit'}: ${payload.role || 'Opportunities'}`,
                text: payload.message || `Dear Student,\n\nYou have been invited to apply for the role of ${payload.role} at ${payload.companyName}.\n\nBest regards,\n${payload.companyName} HR Team`,
                html: `<div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
                  <h2>Company Invitation</h2>
                  <p>Dear <strong>${student.username}</strong>,</p>
                  <p>You have been invited to apply for the role of <strong>${payload.role || 'Internship'}</strong> at <strong>${payload.companyName || 'EliteRecruit'}</strong>.</p>
                  <p><strong>Message from recruiter:</strong></p>
                  <blockquote style="border-left: 4px solid #8731a3; padding-left: 15px; margin: 15px 0; color: #555;">
                    ${(payload.message || '').replace(/\n/g, '<br/>')}
                  </blockquote>
                  <p>Best regards,<br/><strong>${payload.companyName || 'EliteRecruit'} HR Team</strong></p>
                </div>`
              });
              emailSent = true;
              console.log(`Invitation notification email sent to ${student.email}`);
            } catch (e) {
              console.error("Failed to send invitation notification email:", e);
            }
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, interview: newInterview, emailSent, smsSent: true }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Student not found' }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  // --- 3. Academic Core & Timed Exam Proctor Player API ---
  else if (pathname === '/api/tests' && req.method === 'GET') {
    const db = readDb();
    const group = parsedUrl.searchParams.get('group');

    fetch(`${SUPABASE_URL}/rest/v1/tests`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Supabase fetch tests failed");
        return res.json();
      })
      .then(supaTests => {
        const mapped = supaTests.map(t => ({
          id: t.id,
          title: t.title,
          duration: t.duration,
          questions: t.questions,
          group: t.group_name,
          questionsList: t.questions_list
        }));
        
        // Merge Supabase tests with local db.tests (avoiding duplicate IDs)
        const combined = [...mapped];
        (db.tests || []).forEach(localTest => {
          if (!combined.some(t => String(t.id) === String(localTest.id))) {
            combined.push(localTest);
          }
        });

        let filteredTests = combined;
        if (group) {
          filteredTests = combined.filter(t => t.group === group || t.group === 'All' || !t.group);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(filteredTests));
      })
      .catch(err => {
        let filteredTests = db.tests || [];
        if (group) {
          filteredTests = filteredTests.filter(t => t.group === group || t.group === 'All' || !t.group);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(filteredTests));
      });
  }

  else if (pathname === '/api/submissions' && req.method === 'GET') {
    const db = readDb();
    const email = parsedUrl.searchParams.get('email');

    if (email) {
      fetch(`${SUPABASE_URL}/rest/v1/quiz_submissions?email=eq.${email}`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      })
        .then(res => {
          if (!res.ok) throw new Error("Supabase fetch failed");
          return res.json();
        })
        .then(supaSubmissions => {
          const mapped = supaSubmissions.map(s => ({
            id: s.id,
            email: s.email,
            testId: s.test_id,
            testTitle: s.test_title,
            score: s.score,
            passed: s.passed,
            timestamp: s.timestamp
          }));
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(mapped));
        })
        .catch(err => {
          let userSubmissions = db.submissions || [];
          userSubmissions = userSubmissions.filter(s => s.email === email);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(userSubmissions));
        });
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(db.submissions));
    }
  }

  else if (pathname === '/api/tests/submit' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();
        const user = db.users.find(u => u.email === payload.email);

        if (user) {
          const score = payload.score || 0;
          const passed = score >= 70;

          if (passed) {
            user.consecutivePassed += 1;
            user.rating = Math.min(5.0, +(user.rating + 0.1).toFixed(2));
            if (user.consecutivePassed >= 3) {
              if (!user.badges.includes("Elite Performer")) {
                user.badges.push("Elite Performer");
              }
            }
          } else {
            user.consecutivePassed = 0;
          }

          // Save submission record to db.submissions
          if (payload.testId) {
            db.submissions = db.submissions || [];
            const alreadySubmitted = db.submissions.some(s => s.email === payload.email && s.testId === payload.testId);
            if (!alreadySubmitted) {
              const quizSub = {
                id: String(Date.now()),
                email: payload.email,
                testId: payload.testId,
                testTitle: payload.testTitle || '',
                score: score,
                passed: passed,
                timestamp: Date.now()
              };
              db.submissions.push(quizSub);

              // Sync to Supabase quiz_submissions table
              const supabaseQuizSub = {
                id: quizSub.id,
                email: quizSub.email,
                test_id: quizSub.testId,
                test_title: quizSub.testTitle,
                score: quizSub.score,
                passed: quizSub.passed,
                timestamp: quizSub.timestamp
              };

              fetch(`${SUPABASE_URL}/rest/v1/quiz_submissions`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'apikey': SUPABASE_ANON_KEY,
                  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify(supabaseQuizSub)
              }).then(r => console.log(`Quiz submission sync status: ${r.status}`))
                .catch(e => console.error("Quiz submission sync failed:", e));
            }
          }

          writeDb(db);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, passed, user }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Student not found' }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  // --- 4. Anti-Cheating tab blur detection logger ---
  else if (pathname === '/api/activity/log' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();

        const logEntry = {
          id: String(Date.now()),
          time: new Date().toLocaleTimeString('en-US', { hour12: false }).substring(0, 5),
          studentName: payload.studentName || 'Anonymous Student',
          alert: payload.alert || 'Defocus event',
          severity: payload.severity || 'medium'
        };

        db.activities.push(logEntry);
        writeDb(db);

        // Sync activity log to Supabase activities table
        const supabaseActivity = {
          id: logEntry.id,
          time: logEntry.time,
          student_name: logEntry.studentName,
          alert: logEntry.alert,
          severity: logEntry.severity
        };

        fetch(`${SUPABASE_URL}/rest/v1/activities`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify(supabaseActivity)
        }).then(r => console.log(`Activities sync status: ${r.status}`))
          .catch(e => console.error("Activities sync failed:", e));

        if (payload.email) {
          const user = db.users.find(u => u.email === payload.email);
          if (user) {
            const deduction = payload.severity === 'high' ? 5 : 2;
            user.trustScore = Math.max(0, user.trustScore - deduction);
            writeDb(db); // rewrite after deduction update

            // Sync updated trust score to Supabase
            const profileUpdate = { trust_score: user.trustScore };
            fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
              },
              body: JSON.stringify(profileUpdate)
            }).catch(e => { });

            fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${user.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
              },
              body: JSON.stringify(profileUpdate)
            }).catch(e => { });
          }
        }

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, activity: logEntry }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  // --- AI Recommendations API using Gemini ---
  else if (pathname === '/api/ai-recommendations' && req.method === 'GET') {
    const skillsParam = parsedUrl.searchParams.get('skills') || '';
    const skillsList = skillsParam.split(',').map(s => s.trim()).filter(Boolean);
    const primarySkill = skillsList[0] || 'Software Engineering';

    const fallbackCourses = [
      { title: `Advanced ${primarySkill} Principles`, provider: "Coursera", match: 98, duration: "14 hours", level: "Intermediate", price: "Free" },
      { title: `Practical Application of ${primarySkill} in Industry`, provider: "edX", match: 94, duration: "18 hours", level: "Beginner", price: "Free" },
      { title: `${primarySkill} Fundamentals Masterclass`, provider: "Udemy", match: 92, duration: "22 hours", level: "Beginner", price: "Free" },
      { title: `Deep Dive into ${primarySkill} Concepts`, provider: "Pluralsight", match: 96, duration: "10 hours", level: "Advanced", price: "Free" },
      { title: `${primarySkill} for Technical Interviews`, provider: "Coursera", match: 99, duration: "8 hours", level: "Intermediate", price: "Free" },
      { title: `Modern ${primarySkill} Best Practices`, provider: "edX", match: 95, duration: "16 hours", level: "Intermediate", price: "Free" },
      { title: `Next-Gen ${primarySkill} Frameworks`, provider: "Udemy", match: 91, duration: "12 hours", level: "Advanced", price: "Free" },
      { title: `${primarySkill} Architecture & Design Patterns`, provider: "Coursera", match: 97, duration: "20 hours", level: "Advanced", price: "Free" },
      { title: `Hands-On Lab: ${primarySkill} Projects`, provider: "edX", match: 93, duration: "24 hours", level: "Beginner", price: "Free" },
      { title: `Future Trends in ${primarySkill} Technologies`, provider: "Pluralsight", match: 90, duration: "6 hours", level: "Advanced", price: "Free" },
      { title: `High Performance ${primarySkill} Systems`, provider: "Udemy", match: 94, duration: "15 hours", level: "Advanced", price: "Free" },
      { title: `Mastering ${primarySkill} Toolchains`, provider: "Coursera", match: 92, duration: "10 hours", level: "Intermediate", price: "Free" },
      { title: `Enterprise-Level ${primarySkill} Applications`, provider: "edX", match: 97, duration: "30 hours", level: "Advanced", price: "Free" },
      { title: `Advanced Debugging in ${primarySkill}`, provider: "Pluralsight", match: 95, duration: "8 hours", level: "Advanced", price: "Free" },
      { title: `Secure Coding Practices in ${primarySkill}`, provider: "Coursera", match: 98, duration: "12 hours", level: "Intermediate", price: "Free" },
      { title: `Introduction to ${primarySkill} Environments`, provider: "Udemy", match: 90, duration: "5 hours", level: "Beginner", price: "Free" },
      { title: `Building Scalable ${primarySkill} Services`, provider: "edX", match: 96, duration: "25 hours", level: "Advanced", price: "Free" },
      { title: `${primarySkill} for DevOps Engineers`, provider: "Pluralsight", match: 93, duration: "14 hours", level: "Intermediate", price: "Free" },
      { title: `Agile Development with ${primarySkill}`, provider: "Coursera", match: 91, duration: "10 hours", level: "Intermediate", price: "Free" },
      { title: `${primarySkill} Integration Strategies`, provider: "Udemy", match: 93, duration: "18 hours", level: "Intermediate", price: "Free" },
      { title: `Real-Time ${primarySkill} Systems`, provider: "edX", match: 95, duration: "22 hours", level: "Advanced", price: "Free" },
      { title: `Functional Programming in ${primarySkill}`, provider: "Pluralsight", match: 94, duration: "12 hours", level: "Advanced", price: "Free" },
      { title: `${primarySkill} Data Structures & Algorithms`, provider: "Coursera", match: 99, duration: "28 hours", level: "Intermediate", price: "Free" },
      { title: `Automating Workflows using ${primarySkill}`, provider: "Udemy", match: 92, duration: "8 hours", level: "Beginner", price: "Free" },
      { title: `Test-Driven Development in ${primarySkill}`, provider: "edX", match: 96, duration: "15 hours", level: "Advanced", price: "Free" },
      { title: `Cloud Deployment of ${primarySkill} Solutions`, provider: "Pluralsight", match: 97, duration: "20 hours", level: "Advanced", price: "Free" },
      { title: `Clean Architecture in ${primarySkill}`, provider: "Coursera", match: 98, duration: "16 hours", level: "Advanced", price: "Free" },
      { title: `Advanced UI Integrations with ${primarySkill}`, provider: "Udemy", match: 93, duration: "11 hours", level: "Intermediate", price: "Free" },
      { title: `Performance Tuning for ${primarySkill} Apps`, provider: "edX", match: 94, duration: "13 hours", level: "Advanced", price: "Free" },
      { title: `Collaborative Development in ${primarySkill} Projects`, provider: "Pluralsight", match: 91, duration: "7 hours", level: "Intermediate", price: "Free" }
    ];

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || typeof fetch === 'undefined') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(fallbackCourses));
      return;
    }

    try {
      const prompt = `Recommend up to 30 online courses for someone with skills: ${skillsList.join(', ')}. Return ONLY a JSON array of objects with keys: 'title', 'provider', 'match' (number between 90 and 100), 'duration', 'level', 'price'. Do not wrap in markdown code blocks.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API returned status ${response.status}`);
      }

      const data = await response.json();
      let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Clean up markdown block wraps if present
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();

      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(parsed));
          return;
        }
      } catch (jsonErr) {
        console.error("Failed to parse Gemini JSON response, text was:", text, jsonErr);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(fallbackCourses));
    } catch (err) {
      console.error("Gemini API call failed:", err);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(fallbackCourses));
    }
  }

  // --- AI Chat Agent API ---
  else if (pathname === '/api/ai-chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      let message = '';
      let activeScreen = '';
      let screenName = '';
      let screenInfo = '';
      try {
        const payload = JSON.parse(body);
        message = payload.message || '';
        activeScreen = payload.activeScreen || '';
        screenName = payload.screenName || '';
        screenInfo = payload.screenInfo || '';

        if (!message) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing message parameter' }));
          return;
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || typeof fetch === 'undefined') {
          throw new Error("Gemini API Key missing or fetch is undefined.");
        }

        const prompt = `You are the EliteHire AI Agent, a helpful, context-aware student portal assistant. 
The user is currently on the screen "${screenName || activeScreen || 'General dashboard'}".
Here is some information about what this screen does: "${screenInfo || 'General workspace'}".
The user asks: "${message}".

Please answer the user's question accurately, concisely (maximum 2-3 sentences), and professionally in English. Do NOT use markdown formatting, hashtags, or double asterisks (**) for bolding in your response. Return clean, plain text only.
Since you are a screen-specific assistant, you are restricted to answering questions related to this active screen. If the user asks questions completely unrelated to the current screen or about screens they are not on, politely inform them that you are restricted to assisting with the active screen and guide them to switch to the appropriate screen.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (!response.ok) {
          throw new Error(`Gemini API returned status ${response.status}`);
        }

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "I couldn't generate a response. Please try again.";

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, reply }));
      } catch (err) {
        console.warn("AI Chat API falling back to context-aware rules:", err.message);

        const fallbackTopics = {
          'student-dash': {
            name: 'Dashboard',
            info: 'shows your overall academic progress, weekly milestones, calendar schedule, recent activities, and shortcuts to courses or tests. You can also view your current active streak here.',
            keywords: ['dashboard', 'home', 'main', 'progress', 'streak', 'milestone', 'welcome']
          },
          'courses': {
            name: 'Courses',
            info: 'lists all available curriculum areas (Design, Engineering, Business, Data). You can select a course path, view its details, and quickly apply to register.',
            keywords: ['course', 'curriculum', 'learn', 'subject', 'class', 'catalog', 'enroll']
          },
          'assign': {
            name: 'Assignments',
            info: 'lists your course assignments divided by status (Remaining, Pending Evaluation, and Graded). You can submit a Git repository link to turn in your work here.',
            keywords: ['assignment', 'submit', 'git', 'homework', 'task', 'eval', 'grade']
          },
          'tests': {
            name: 'Quiz',
            info: 'lists your upcoming academic assessments, cognitive tests, and scheduled interviews. You can read integrity rules and launch the proctored exam from here.',
            keywords: ['test', 'exam', 'quiz', 'proctor', 'rules', 'question']
          },
          'leaderboard': {
            name: 'Grades',
            info: 'shows the global academic rankings of all students based on their score ratings, badges, and trust score.',
            keywords: ['grade', 'leaderboard', 'rank', 'ranking', 'score', 'points', 'trust']
          },
          'schedule': {
            name: 'Schedule',
            info: 'displays your weekly tasks, class times, and assessment events in a visual calendar format.',
            keywords: ['schedule', 'calendar', 'weekly', 'time', 'slot']
          },
          'opportunities': {
            name: 'Opportunities',
            info: 'lists curated job postings with quick apply features. You can browse listings, view job descriptions, and apply directly.',
            keywords: ['job', 'internship', 'opportunity', 'apply', 'career', 'salary', 'recruiting']
          },
          'student-analytics': {
            name: 'analytics',
            info: 'displays your dynamic learning metrics in real time, including your average test score, course completion rate, assignment grade, streak logs, and acquired skills.',
            keywords: ['analytics', 'performance', 'metrics', 'chart', 'graph', 'funnel']
          },
          'library': {
            name: 'Library',
            info: 'contains Cheat Sheets, Roadmaps, E-books, and Handbooks. You can search resources, request custom curation, and download guides directly.',
            keywords: ['library', 'download', 'pdf', 'book', 'cheat', 'sheet', 'roadmap']
          },
          'messages': {
            name: 'Messages',
            info: 'allows you to communicate directly with mentors and hiring teams. You can view conversations, check online status, and chat with this AI Agent!',
            keywords: ['message', 'chat', 'inbox', 'conversation', 'inbox']
          },
          'mentors': {
            name: 'Mentors',
            info: 'lets you schedule one-on-one sessions with senior industry professionals (like Sarah Jenkins). You can select slot durations and confirm bookings.',
            keywords: ['mentor', 'booking', 'sarah', 'call', 'meeting']
          },
          'checkout': {
            name: 'Checkout & Billing',
            info: 'processes your course registrations or job applications in PKR (1 USD = 280 PKR). It integrates EasyPaisa and JazzCash mobile wallet methods.',
            keywords: ['checkout', 'billing', 'pay', 'easypaisa', 'jazzcash', 'rs', 'rupee', 'pkr']
          },
          'amb-hub': {
            name: 'Ambassador Hub',
            info: 'displays your referral statistics, current monthly earnings, pending bonuses, active streaks, and options to share your referral link or view tasks.',
            keywords: ['ambassador', 'referral', 'bonus', 'earnings', 'link', 'rewards', 'hub']
          },
          'amb-referral': {
            name: 'Referral Center',
            info: 'shows your recent referrals and their status (Active, Pending, Joined). You can track referral invites and copy your referral link.',
            keywords: ['referral', 'invite', 'joined', 'friend', 'status', 'link', 'track']
          },
          'amb-missions': {
            name: 'Missions & Tasks',
            info: 'lists available tasks you can complete to earn bonuses, such as sharing on LinkedIn, referring friends, or completing learning streaks.',
            keywords: ['mission', 'task', 'complete', 'share', 'linkedin', 'points', 'bonus']
          },
          'amb-leaderboard': {
            name: 'Leaderboard & Rewards',
            info: 'lists top ambassadors and their rankings. You can also view available rewards and claim your cash bonuses.',
            keywords: ['leaderboard', 'rank', 'reward', 'points', 'earnings', 'claim', 'bonus']
          },
          'recruiter-dash': {
            name: 'Dashboard',
            info: 'provides an overview of hiring activity, candidate pipelines, interview schedules, ad campaigns, and quick stats on candidate matching.',
            keywords: ['dashboard', 'home', 'command center', 'metrics', 'overview', 'stats']
          },
          'jobboard': {
            name: 'Job Board',
            info: 'shows all active, closed, and draft job postings. Recruiters can promote listings, view details, compare candidates, or delete job postings.',
            keywords: ['jobboard', 'job board', 'listings', 'delete', 'promote', 'compare']
          },
          'talent': {
            name: 'Talent Pool',
            info: 'allows recruiters to search and filter candidates by name, university, skills, graduation year, trust scores, and activity to invite them to apply.',
            keywords: ['talent', 'search', 'candidate', 'filter', 'skills', 'university', 'trust']
          },
          'postings': {
            name: 'Postings',
            info: 'allows you to view details of active job posts, candidate matching percentages, candidate count, and click to view applicants.',
            keywords: ['postings', 'active postings', 'matching', 'post', 'manage']
          },
          'kanban': {
            name: 'Applicants',
            info: 'displays candidates in columns representing stages of the recruitment funnel (Applied, Shortlisted, Interviewing, Offered). Recruiters can drag items to update status.',
            keywords: ['applicants', 'kanban', 'board', 'funnel', 'stage', 'drag', 'shortlist']
          },
          'scheduler': {
            name: 'Interviews',
            info: 'helps recruiters sync calendars, propose time slots, view pending schedules, and schedule live video interviews with selected candidates.',
            keywords: ['scheduler', 'interview', 'calendar', 'meeting', 'schedule', 'slot']
          },
          'analytics': {
            name: 'Analytics',
            info: 'displays hiring funnel rates, conversion metrics, department breakdowns, and weekly stats.',
            keywords: ['analytics', 'metrics', 'performance', 'chart', 'graph', 'conversion', 'funnel']
          },
          'recruiter-analytics': {
            name: 'Analytics',
            info: 'displays hiring funnel rates, conversion metrics, department breakdowns, and weekly stats.',
            keywords: ['analytics', 'metrics', 'performance', 'chart', 'graph', 'conversion', 'funnel']
          },
          'saved-drafts': {
            name: 'Save Draft',
            info: 'displays your unpublished job postings and email template drafts. You can edit them to publish or discard them.',
            keywords: ['drafts', 'save draft', 'saved drafts', 'unpublished', 'templates']
          },
          'payment': {
            name: 'Payment',
            info: 'displays pricing tiers for promoting jobs, active marketing credits, transaction history, and EasyPaisa/JazzCash methods.',
            keywords: ['payment', 'payments', 'billing', 'credits', 'pricing', 'wallet', 'easypaisa', 'jazzcash']
          }
        };

        const activeScreenKey = activeScreen || 'student-dash';
        const activeTopic = fallbackTopics[activeScreenKey] || { name: screenName || 'Dashboard', info: screenInfo || 'General workspace', keywords: [] };

        let reply = '';
        const msgLower = message.toLowerCase();

        // Check if the user is asking about a DIFFERENT screen
        let targetScreenName = '';
        for (const key in fallbackTopics) {
          if (key !== activeScreenKey) {
            const hasKeyword = fallbackTopics[key].keywords.some(kw => msgLower.includes(kw));
            if (hasKeyword) {
              targetScreenName = fallbackTopics[key].name;
              break;
            }
          }
        }

        if (targetScreenName) {
          reply = `I apologize, but I am restricted to assisting you only with the screen you are currently viewing (${activeTopic.name}). To ask about ${targetScreenName}, please switch to the ${targetScreenName} screen using the sidebar navigation.`;
        } else {
          // General active screen help
          if (activeScreenKey === 'opportunities') {
            if (msgLower.includes('ai') || msgLower.includes('developer') || msgLower.includes('opportunity')) {
              reply = `Yes! There is an AI developer position available at TechFlow (93% Match, Est. Salary Rs. 23,500 - 27,500 / mo) located in Lahore, Pakistan. It requires UI Design, Figma, and Prototyping skills. You can click the "Apply" button on its card below to proceed!`;
            } else if (msgLower.includes('backend') || msgLower.includes('junior backend') || msgLower.includes('python')) {
              reply = `Yes! There is a Junior Backend Developer position at Arbisoft (94% Match, Est. Salary Rs. 80,000 - 120,000 / mo) in Lahore, Pakistan. It requires Python, Django, and SQL.`;
            } else if (msgLower.includes('ios') || msgLower.includes('ui') || msgLower.includes('swift')) {
              reply = `Yes! There is a Senior iOS UI Engineer position at TechFlow (93% Match, Est. Salary Rs. 8,000 - 12,000 / mo) in San Francisco, CA. It requires Swift, SwiftUI, and UI Design.`;
            } else if (msgLower.includes('react native') || msgLower.includes('jazz')) {
              reply = `Yes! There is a React Native Developer position at Jazz (Mobilink) (88% Match, Est. Salary Rs. 180,000 - 240,000 / mo) in Islamabad, Pakistan.`;
            } else {
              reply = `I am your opportunities assistant. We have several open roles matching your skillset, including AI developer (TechFlow), Junior Backend Developer (Arbisoft), and React Native Developer (Jazz). You can filter the job board cards using the top search bar!`;
            }
          } else if (activeScreenKey === 'courses') {
            if (msgLower.includes('design') || msgLower.includes('ux') || msgLower.includes('ui')) {
              reply = `We offer several Design courses, including Advanced UI/UX Design, Typography Mastery, and Interaction Design Fundamentals. You can enroll in them directly from the catalog below!`;
            } else if (msgLower.includes('web') || msgLower.includes('react') || msgLower.includes('engineering') || msgLower.includes('frontend')) {
              reply = `We offer Engineering courses, including Web Development Bootcamp and Advanced React & State Management.`;
            } else if (msgLower.includes('database') || msgLower.includes('data') || msgLower.includes('sql')) {
              reply = `We offer Data Science courses, including Python for Data Science and Database Architecture & SQL Essentials.`;
            } else {
              reply = `I am your courses assistant. We offer premium curriculum programs in Design, Engineering, Business, and Data Science. You can browse them below!`;
            }
          } else if (activeScreenKey === 'recruiter-dash') {
            reply = `Welcome to the Recruiter Command Center Dashboard. You can review your candidate conversion performance, track matching statistics, see interview schedules, or launch a new job posting from here!`;
          } else if (activeScreenKey === 'jobboard') {
            reply = `You are on the Recruiter Job Board. You can view details for active postings, promote job listings to sponsor them, or delete out-of-date jobs using the trash icon.`;
          } else if (activeScreenKey === 'talent') {
            reply = `This is the Talent Search screen. You can filter the candidate pool by trust score, skills, and university. If you find a matching candidate, click 'Invite to Company' to invite them.`;
          } else if (activeScreenKey === 'postings') {
            reply = `You are viewing Active Postings. This lists your published jobs, active candidate matches, and total applicants. Click 'View Applicants' to see specific candidates on the Kanban board.`;
          } else if (activeScreenKey === 'kanban') {
            reply = `This is the Applicant Kanban Board. Drag candidate cards between Applied, Shortlisted, Interviewing, and Offered columns to update their recruitment progress.`;
          } else if (activeScreenKey === 'scheduler') {
            reply = `Welcome to the Interview Scheduler. You can calendar appointments, propose meeting slots, or use Smart Match Pro AI to find optimal interview times based on candidate availability.`;
          } else if (activeScreenKey === 'analytics' || activeScreenKey === 'recruiter-analytics') {
            reply = `Welcome to the Recruiter Analytics dashboard. Here you can inspect hiring funnel throughputs, conversion ratios, department distributions, and weekly submission trends.`;
          } else if (activeScreenKey === 'saved-drafts') {
            reply = `This is the Saved Drafts folder. Here you can edit and finalize draft job posts or message templates to publish them when ready.`;
          } else if (activeScreenKey === 'payment') {
            reply = `Welcome to the Payment Billing portal. Here you can purchase advertising/job promotion credits and process transactions using EasyPaisa or JazzCash mobile wallets.`;
          } else {
            reply = `I am your screen-specific assistant for the ${activeTopic.name} screen. This screen ${activeTopic.info} Please ask about features on this page!`;
          }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, reply }));
      }
    });
  }

  // --- 4.5 File Upload API ---
  else if (pathname === '/api/upload' && req.method === 'POST') {
    const fileName = parsedUrl.searchParams.get('name') || 'uploaded_file';
    const ext = path.extname(fileName);
    const base = path.basename(fileName, ext);
    const safeName = base.replace(/[^a-zA-Z0-9]/g, '_') + '_' + Date.now() + ext;

    const uploadDir = path.join(__dirname, 'website', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, safeName);
    const writeStream = fs.createWriteStream(filePath);

    req.pipe(writeStream);

    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, url: `/website/uploads/${safeName}` }));
    });

    req.on('error', (err) => {
      console.error("Upload error:", err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Upload failed' }));
    });
  }

  // --- 4.6 Docx Parsing API ---
  else if (pathname === '/api/parse-docx' && req.method === 'GET') {
    const fileUrl = parsedUrl.searchParams.get('url');
    if (!fileUrl) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing url parameter' }));
      return;
    }
    
    // Resolve path: URL can start with a leading slash, remove it
    const cleanedPath = fileUrl.startsWith('/') ? fileUrl.substring(1) : fileUrl;
    let filePath = path.join(__dirname, cleanedPath);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(__dirname, cleanedPath);
    }
    
    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'File not found' }));
      return;
    }
    
    mammoth.convertToHtml({ path: filePath })
      .then(result => {
        const html = result.value; // Extracted HTML
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, html }));
      })
      .catch(err => {
        console.error("Error parsing docx:", err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to parse document: ' + err.message }));
      });
  }

  // --- 5. Course Catalog & Playback API ---
  else if (pathname === '/api/courses' && req.method === 'GET') {
    const db = readDb();
    const id = parsedUrl.searchParams.get('id');
    if (id) {
      const course = db.courses.find(c => c.id === id);
      if (course) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(course));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Course not found' }));
      }
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(db.courses));
    }
  }

  else if (pathname === '/api/courses/create' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();
        const newCourse = {
          id: payload.id || 'course-' + Date.now(),
          title: payload.title || 'Untitled Course',
          category: payload.category || 'General',
          match: Number(payload.match) || 90,
          price: payload.price || '199.00',
          image: payload.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5nPFYicb2sbkYrGLMTZgJLUV-JCRGQSTmbdl0GEqcX5_XfNvySzN1FB6BtwxKILfGwexbg0dOBBYiSDTYZVOB3_Q3nlyqkiRwISXDxIDd2_dhABeCohrEfCEojeTTzN1rfZXaMMtoGs-wMtuPvmSQBrXU6n5OPooKXKcpG0QBx7a0KCJ5e7pcKyoXY0Bi5bpTQ9bT4W6Aj6ExUY8-0-ENRKLdQE_6EpcYrwYYmlynMEgEsTUJgbFl1za85RGZOjjtS7YIBArMxF0H',
          link: payload.link || '#'
        };
        db.courses.push(newCourse);
        writeDb(db);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, course: newCourse }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  // --- 6. Assignments API ---
  else if (pathname === '/api/assignments' && req.method === 'GET') {
    const db = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db.assignments));
  }

  else if (pathname === '/api/assignments/submit' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();

        const newSubmission = {
          id: String(Date.now()),
          studentName: payload.studentName || 'Alex Sterling',
          email: payload.email,
          assignment: payload.assignment || 'Practical Portfolio submission',
          repoUrl: payload.repoUrl || 'https://github.com/',
          status: 'pending',
          grade: null
        };

        db.submissions.push(newSubmission);
        writeDb(db);

        // Sync to Supabase submissions table
        const supabaseSubmission = {
          id: newSubmission.id,
          student_name: newSubmission.studentName,
          email: newSubmission.email,
          assignment: newSubmission.assignment,
          repo_url: newSubmission.repoUrl,
          status: newSubmission.status,
          grade: newSubmission.grade
        };

        fetch(`${SUPABASE_URL}/rest/v1/submissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify(supabaseSubmission)
        }).then(r => console.log(`Submissions sync status: ${r.status}`))
          .catch(e => console.error("Submissions sync failed:", e));

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, submission: newSubmission }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  // --- 7. Jobs / Internships Search & Filters API ---
  else if (pathname === '/api/jobs' && req.method === 'GET') {
    const db = readDb();
    const id = parsedUrl.searchParams.get('id');
    
    // Function to ensure link exists
    const ensureLink = (job) => {
      if (!job.link) {
        if (job.company === 'skylync.io') job.link = 'https://skylync.io';
        else if (job.company === 'zylor.io') job.link = 'https://zylor.io';
        else if (job.company === 'TechFlow' || job.company === 'techflow') job.link = 'https://techflow.com';
        else job.link = `https://www.google.com/search?q=${encodeURIComponent(job.company + ' website')}`;
      }
      return job;
    };

    if (id) {
      const job = db.jobs.find(j => j.id === id);
      if (job) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(ensureLink(job)));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Job not found' }));
      }
    } else {
      const jobsWithLinks = db.jobs.map(j => ensureLink({ ...j }));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(jobsWithLinks));
    }
  }

  else if (pathname === '/api/jobs/create' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();

        const newJob = {
          id: String(Date.now()),
          title: payload.title || 'Job Title',
          company: payload.company || 'Anonymous Co',
          dept: payload.dept || payload.department || 'Product',
          department: payload.dept || payload.department || 'Product',
          location: payload.location || 'Remote',
          salary: payload.salary || '$80k - $100k',
          type: payload.type || 'Full-time',
          description: payload.description || '',
          skillsRequired: payload.skillsRequired || [],
          status: 'active',
          boosted: false,
          created_at: Date.now(),
          link: payload.link || '#',
          imageUrl: payload.imageUrl || null
        };

        db.jobs.push(newJob);
        writeDb(db);

        // Sync to Supabase jobs table
        const supabaseJob = {
          id: newJob.id,
          title: newJob.title,
          company: newJob.company,
          location: newJob.location,
          salary: newJob.salary,
          type: newJob.type,
          description: newJob.description,
          skills_required: newJob.skillsRequired,
          status: newJob.status,
          boosted: newJob.boosted,
          link: newJob.link
        };

        fetch(`${SUPABASE_URL}/rest/v1/jobs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify(supabaseJob)
        }).then(r => console.log(`Jobs sync status: ${r.status}`))
          .catch(e => console.error("Jobs sync failed:", e));

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, job: newJob }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  else if (pathname === '/api/jobs/update' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();
        const job = db.jobs.find(j => String(j.id) === String(payload.id));
        if (job) {
          if (payload.title) job.title = payload.title;
          if (payload.company) job.company = payload.company;
          if (payload.dept) job.dept = payload.dept;
          if (payload.department) job.department = payload.department;
          if (payload.location) job.location = payload.location;
          if (payload.salary) job.salary = payload.salary;
          if (payload.type) job.type = payload.type;
          if (payload.description) job.description = payload.description;
          if (payload.skillsRequired) job.skillsRequired = payload.skillsRequired;
          if (payload.status) job.status = payload.status;
          if (payload.link) job.link = payload.link;
          if (payload.imageUrl !== undefined) job.imageUrl = payload.imageUrl;
          writeDb(db);

          // Sync to Supabase
          const supabaseJob = {
            title: job.title,
            location: job.location,
            salary: job.salary,
            type: job.type,
            description: job.description,
            skills_required: job.skillsRequired,
            status: job.status,
            link: job.link
          };
          fetch(`${SUPABASE_URL}/rest/v1/jobs?id=eq.${job.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify(supabaseJob)
          }).catch(e => console.error("Jobs update sync failed:", e));

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, job }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Job not found' }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }
  else if (pathname === '/api/jobs/apply' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        if (!payload.jobId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'jobId is required' }));
          return;
        }
        const db = readDb();
        const job = db.jobs.find(j => String(j.id) === String(payload.jobId));
        if (job) {
          let count = parseInt(job.applied) || 0;
          count += 1;
          job.applied = count;
          writeDb(db);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, applied: job.applied }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Job not found' }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }
  else if (pathname === '/api/jobs/delete' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();
        const initialCount = db.jobs.length;
        db.jobs = db.jobs.filter(j => String(j.id) !== String(payload.id));
        if (db.jobs.length < initialCount) {
          writeDb(db);

          // Sync deletion to Supabase
          fetch(`${SUPABASE_URL}/rest/v1/jobs?id=eq.${payload.id}`, {
            method: 'DELETE',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
          }).catch(e => console.error("Jobs delete sync failed:", e));

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Job not found' }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  else if (pathname === '/api/jobs/pause' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();
        const job = db.jobs.find(j => String(j.id) === String(payload.id));
        if (job) {
          job.status = job.status === 'paused' ? 'active' : 'paused';
          writeDb(db);

          // Sync to Supabase
          fetch(`${SUPABASE_URL}/rest/v1/jobs?id=eq.${job.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ status: job.status })
          }).catch(e => { });

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, job }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Job not found' }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  else if (pathname === '/api/jobs/boost' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();
        const job = db.jobs.find(j => String(j.id) === String(payload.id));
        if (job) {
          job.boosted = true;
          job.status = 'active'; // Automatically activate if boosted
          writeDb(db);

          // Sync to Supabase
          fetch(`${SUPABASE_URL}/rest/v1/jobs?id=eq.${job.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ boosted: true, status: 'active' })
          }).catch(e => { });

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, job }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Job not found' }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  // --- 8. Recruiter Interview Scheduler API ---
  else if (pathname === '/api/interviews' && req.method === 'GET') {
    const db = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db.interviews));
  }

  else if (pathname === '/api/interviews/schedule' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();

        const newInterview = {
          id: String(Date.now()),
          studentName: payload.studentName || 'Elena Rostova',
          studentEmail: payload.studentEmail || '',
          company: payload.company || 'skylync.io',
          date: payload.date || '2026-06-30',
          time: payload.time || '11:00 AM',
          duration: payload.duration || 45,
          status: 'scheduled',
          message: payload.message || ''
        };

        db.interviews.push(newInterview);
        writeDb(db);

        // Send Email using Nodemailer
        const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER;
        const emailPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
        const emailHost = process.env.SMTP_HOST || 'smtp.gmail.com';
        const emailPort = process.env.SMTP_PORT || 465;

        let emailSent = false;
        if (emailUser && emailPass && newInterview.studentEmail) {
          try {
            const transporter = nodemailer.createTransport({
              host: emailHost,
              port: parseInt(emailPort),
              secure: emailPort == 465,
              auth: {
                user: emailUser,
                pass: emailPass
              }
            });

            await transporter.sendMail({
              from: `"${newInterview.company}" <${emailUser}>`,
              to: newInterview.studentEmail,
              subject: `Interview Scheduled: ${newInterview.company}`,
              text: newInterview.message || `Dear ${newInterview.studentName},\n\nYour interview with ${newInterview.company} has been scheduled for ${newInterview.date} at ${newInterview.time}.\n\nBest regards,\n${newInterview.company} HR Team`,
              html: `<div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
                <h2>Interview Scheduled</h2>
                <p>Dear <strong>${newInterview.studentName}</strong>,</p>
                <p>Your interview with <strong>${newInterview.company}</strong> has been scheduled.</p>
                <p><strong>Date:</strong> ${newInterview.date}<br/>
                <strong>Time:</strong> ${newInterview.time} (${newInterview.duration} minutes)</p>
                <p><strong>Message details:</strong></p>
                <blockquote style="border-left: 4px solid #8731a3; padding-left: 15px; margin: 15px 0; color: #555;">
                  ${newInterview.message.replace(/\n/g, '<br/>')}
                </blockquote>
                <p>Best regards,<br/><strong>${newInterview.company} HR Team</strong></p>
              </div>`
            });
            emailSent = true;
            console.log(`Interview notification email sent to ${newInterview.studentEmail}`);
          } catch (e) {
            console.error("Failed to send interview notification email:", e);
          }
        }

        // Simulate sending SMS / WhatsApp to mobile number
        const student = db.users.find(u => u.email === newInterview.studentEmail);
        const studentPhone = student?.phone || "+92 300 1234567";
        console.log(`[SMS Notification Sent to ${studentPhone}]: Hi ${newInterview.studentName}, your interview with ${newInterview.company} is scheduled on ${newInterview.date} at ${newInterview.time}.`);

        // Sync to Supabase interviews table
        const supabaseInterview = {
          id: newInterview.id,
          student_name: newInterview.studentName,
          company: newInterview.company,
          date: newInterview.date,
          time: newInterview.time,
          status: newInterview.status
        };

        fetch(`${SUPABASE_URL}/rest/v1/interviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify(supabaseInterview)
        }).then(r => console.log(`Interviews sync status: ${r.status}`))
          .catch(e => console.error("Interviews sync failed:", e));

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, interview: newInterview, emailSent, smsSent: true }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  // --- 9. Global Leaderboard API ---
  else if (pathname === '/api/leaderboard' && req.method === 'GET') {
    const db = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db.leaderboard));
  }

  // --- 10. Rewards & Scholarship API ---
  else if (pathname === '/api/rewards' && req.method === 'GET') {
    const db = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db.rewards));
  }

  // --- 11. Success Showcase API ---
  else if (pathname === '/api/success-showcase' && req.method === 'GET') {
    const db = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db.success_stories));
  }
  else if (pathname === '/api/success-showcase/create' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();
        const newStory = {
          id: payload.id || 'story_' + Date.now(),
          studentName: payload.studentName || 'Jordan Smith',
          company: payload.company || 'Google',
          role: payload.role || 'FinTech Intern',
          story: payload.story || '',
          avatar: payload.avatar || '',
          logo: payload.logo || '',
          statusState: payload.statusState || 'Published'
        };
        db.success_stories.push(newStory);
        writeDb(db);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, story: newStory }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }
  else if (pathname === '/api/success-showcase/delete' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        if (!payload.id) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Story ID is required' }));
          return;
        }
        const db = readDb();
        const initialLength = db.success_stories.length;
        db.success_stories = db.success_stories.filter(s => s.id !== payload.id);
        if (db.success_stories.length < initialLength) {
          writeDb(db);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Story not found' }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  // --- 12. Sponsored Advertisements API ---
  else if (pathname === '/api/ads' && req.method === 'GET') {
    const db = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db.ads));
  }

  // --- 13. Premium Guidance & Mentors API ---
  else if (pathname === '/api/mentors' && req.method === 'GET') {
    const db = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db.mentors));
  }

  // --- 14. Software Houses GPS Location Map coordinates ---
  else if (pathname === '/api/software-houses' && req.method === 'GET') {
    const db = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db.software_houses));
  }

  // --- 15. Smart Assignment/Test Day Scheduling API ---
  else if (pathname === '/api/schedule' && req.method === 'GET') {
    const db = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db.schedule));
  }

  // --- 16. Existing admin portal compatibility API endpoints ---
  else if (pathname === '/api/companies' && req.method === 'GET') {
    const db = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db.companies));
  }

  else if (pathname === '/api/companies/verify' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();
        const company = db.companies.find(c => c.id === payload.id);
        if (company) {
          company.status = payload.status || 'verified';
          writeDb(db);

          // Sync to Supabase companies table
          const companyId = parseInt(payload.id);
          if (!isNaN(companyId)) {
            fetch(`${SUPABASE_URL}/rest/v1/companies?id=eq.${companyId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
              },
              body: JSON.stringify({ status: company.status })
            }).then(r => console.log(`Companies verification sync status: ${r.status}`))
              .catch(e => console.error("Companies verification sync failed:", e));
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, company }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Company not found' }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  else if (pathname === '/api/submissions' && req.method === 'GET') {
    const db = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db.submissions));
  }

  else if (pathname === '/api/submissions/grade' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();
        const sub = db.submissions.find(s => s.id === payload.id);
        if (sub) {
          sub.status = 'graded';
          sub.grade = payload.grade || 'A';
          writeDb(db);

          // Sync to Supabase submissions table
          fetch(`${SUPABASE_URL}/rest/v1/submissions?id=eq.${payload.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ status: sub.status, grade: sub.grade })
          }).then(r => console.log(`Submissions grading sync status: ${r.status}`))
            .catch(e => console.error("Submissions grading sync failed:", e));

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, submission: sub }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Submission not found' }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  else if (pathname === '/api/tests/create' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();
        const newTest = {
          id: String(Date.now()),
          title: payload.title || 'Untitled Assessment',
          duration: payload.duration || '15 mins',
          questions: payload.questions || 1,
          group: payload.group || 'Group C',
          questionsList: payload.questionsList || []
        };
        db.tests.push(newTest);
        writeDb(db);

        // Sync to Supabase tests table
        const supabaseTest = {
          id: newTest.id,
          title: newTest.title,
          duration: newTest.duration,
          questions: newTest.questions,
          group_name: newTest.group,
          questions_list: newTest.questionsList
        };

        fetch(`${SUPABASE_URL}/rest/v1/tests`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify(supabaseTest)
        }).then(r => console.log(`Tests sync status: ${r.status}`))
          .catch(e => console.error("Tests sync failed:", e));

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, test: newTest }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  else if (pathname === '/api/assignments/create' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();
        const newAssign = {
          id: String(Date.now()),
          title: payload.title || 'Untitled Assignment',
          deadline: payload.deadline || 'Thursday',
          status: payload.status || 'published',
          points: payload.points || 100,
          passingGrade: payload.passingGrade || 60,
          tag: payload.tag || '',
          criteria: payload.criteria || [],
          resources: payload.resources || []
        };
        db.assignments.push(newAssign);
        writeDb(db);

        // Sync to Supabase assignments table
        const supabaseAssignment = {
          id: newAssign.id,
          title: newAssign.title,
          deadline: newAssign.deadline
        };

        fetch(`${SUPABASE_URL}/rest/v1/assignments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify(supabaseAssignment)
        }).then(r => console.log(`Assignments sync status: ${r.status}`))
          .catch(e => console.error("Assignments sync failed:", e));

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, assignment: newAssign }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  else if (pathname === '/api/activities' && req.method === 'GET') {
    const db = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db.activities));
  }

  else if (pathname === '/api/students' && req.method === 'GET') {
    const db = readDb();
    const students = db.users.filter(u => u.role === 'student');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(students));
  }

  else if (pathname === '/api/payments' && req.method === 'GET') {
    const db = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(db.purchases));
  }

  else if (pathname === '/api/onboarding' && req.method === 'GET') {
    const slides = [
      {
        title: "Verified Assessments",
        description: "Showcase your true potential with industry-standard skills verification.",
        position: "50% 0%"
      },
      {
        title: "Secure Path",
        description: "Advanced anti-cheat protocols ensuring a fair and transparent hiring journey.",
        position: "0% 0%"
      },
      {
        title: "AI Matching",
        description: "Intelligent algorithms connecting your unique skills with perfect-fit opportunities.",
        position: "100% 0%"
      }
    ];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(slides));
  }

  else if (pathname === '/api/ads' && req.method === 'GET') {
    const db = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db.ads || []));
  }

  else if (pathname === '/api/ads/approve' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();
        const ad = db.ads.find(a => a.id === payload.id);
        if (ad) {
          ad.status = 'active';
          writeDb(db);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, ad }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Ad not found' }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  else if (pathname === '/api/ads/reject' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();
        const ad = db.ads.find(a => a.id === payload.id);
        if (ad) {
          ad.status = 'rejected';
          writeDb(db);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, ad }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Ad not found' }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  else if (pathname === '/api/success-stories' && req.method === 'GET') {
    const db = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db.success_stories || []));
  }

  else if (pathname === '/api/success-stories/create' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();
        const newStory = {
          id: payload.id || String(Date.now()),
          name: payload.name,
          title: payload.title,
          desc: payload.desc,
          status: payload.status || 'Published'
        };
        db.success_stories = db.success_stories || [];
        db.success_stories.unshift(newStory);
        writeDb(db);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, story: newStory }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  else if (pathname === '/api/success-stories/delete' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();
        const index = db.success_stories.findIndex(s => s.id === payload.id);
        if (index !== -1) {
          db.success_stories.splice(index, 1);
          writeDb(db);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Story not found' }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  else if (pathname === '/api/courses' && req.method === 'GET') {
    const db = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db.courses || []));
  }

  else if (pathname === '/api/courses/create' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();
        const newCourse = {
          id: String(Date.now()),
          title: payload.title || 'Untitled Course',
          category: payload.category || 'General',
          price: payload.price || '199.00',
          match: payload.match || '95',
          image: payload.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400',
          link: payload.link || '#'
        };
        db.courses = db.courses || [];
        db.courses.push(newCourse);
        writeDb(db);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, course: newCourse }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  else if (pathname === '/api/courses/save' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();
        db.courses = db.courses || [];
        let course = db.courses.find(c => String(c.id) === String(payload.courseId));
        if (course) {
          course.modules = payload.modules;
          writeDb(db);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, course }));
        } else {
          // If the course isn't found in dynamic courses (e.g., if it's one of the default catalog courses),
          // let's create a record for it so modules can be saved.
          const newCourse = {
            id: String(payload.courseId),
            title: payload.title || 'Course',
            category: payload.category || 'General',
            price: payload.price || '199.00',
            match: payload.match || '90',
            image: payload.image || '',
            link: payload.link || '#',
            modules: payload.modules
          };
          db.courses.push(newCourse);
          writeDb(db);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, course: newCourse }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  else if (pathname === '/api/courses/delete' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();
        db.courses = db.courses || [];
        const index = db.courses.findIndex(c => String(c.id) === String(payload.id));
        if (index !== -1) {
          db.courses.splice(index, 1);
          writeDb(db);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Course not found' }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  else if (pathname === '/api/debug-log' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        fs.appendFileSync(path.join(__dirname, 'debug_frontend.log'), `[${new Date().toISOString()}] ${body}\n`, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  }

  else if (pathname === '/api/mock-interviews' && req.method === 'GET') {
    try {
      const db = readDb();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        mockInterviews: db.mockInterviews || []
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
  }

  else if (pathname === '/api/mock-interviews/schedule' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();
        if (!db.mockInterviews) db.mockInterviews = [];
        const newSession = {
          id: `MOCK-${Date.now()}`,
          title: payload.title || '1-on-1 Mentor Mock Session',
          type: payload.type || '1-on-1 Mentor',
          interviewer: payload.interviewer || 'Senior Industry Mentor',
          status: 'confirmed',
          scheduledTime: payload.scheduledTime || 'Upcoming',
          topic: payload.topic || 'Software Engineering'
        };
        db.mockInterviews.unshift(newSession);
        writeDb(db);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, session: newSession }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  else if (pathname === '/api/mock-interviews/submit' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDb();
        if (!db.mockInterviews) db.mockInterviews = [];
        const score = Math.floor(90 + Math.random() * 8);
        const completedSession = {
          id: `MOCK-${Date.now()}`,
          title: payload.title || 'AI Technical Mock Evaluation',
          type: payload.type || 'AI Technical',
          interviewer: 'AI Claude 3.7 Pro',
          status: 'completed',
          scheduledTime: 'Just Now',
          score: score,
          topic: payload.topic || 'Algorithms & Data Structures'
        };
        db.mockInterviews.unshift(completedSession);
        writeDb(db);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          score: score,
          feedback: {
            technicalScore: 96,
            communicationScore: 92,
            codeQuality: 94,
            summary: "Exceptional algorithm optimization and clear articulation of time/space complexity."
          }
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
  }

  else {
    // Serve static files from workspace root
    let filePath = path.join(__dirname, pathname);

    // Default to index.html if directory
    try {
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
          '.html': 'text/html',
          '.css': 'text/css',
          '.js': 'application/javascript',
          '.json': 'application/json',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.gif': 'image/gif',
          '.svg': 'image/svg+xml',
          '.mp4': 'video/mp4',
          '.webm': 'video/webm',
          '.mp3': 'audio/mpeg',
          '.pdf': 'application/pdf',
          '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        };
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server Error');
    }
  }
});

server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

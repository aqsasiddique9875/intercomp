const fs = require('fs');
const path = require('path');

// Load environment variables manually from .env file
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envLines = fs.readFileSync(envPath, 'utf-8').split('\n');
    envLines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const parts = trimmed.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.error("Failed to load .env manually:", e);
}

const DB_PATH = path.join(__dirname, 'db.json');
const otps = {}; // In-memory OTP store (email -> otp)

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

// Helper to read database
function readDb() {
  try {
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    const db = {
      companies: data.companies || [],
      submissions: data.submissions || [],
      tests: data.tests || [],
      assignments: data.assignments || [],
      activities: data.activities || [],
      users: data.users || [],
      success_stories: data.success_stories || [],
      ads: data.ads || [],
      mentors: data.mentors || [],
      software_houses: data.software_houses || [],
      schedule: data.schedule || {},
      rewards: data.rewards || {},
      jobs: data.jobs || [],
      courses: data.courses || [],
      interviews: data.interviews || [],
      mockInterviews: data.mockInterviews || [],
      leaderboard: data.leaderboard || [],
      purchases: data.purchases || { companyPlans: [], studentCourses: [] }
    };

    let updated = false;

    // Ensure studentone@gmail.com exists
    const studentUser = db.users.find(u => u.email === 'studentone@gmail.com');
    if (!studentUser) {
      db.users.push({
        id: "student_one",
        username: "studentone",
        email: "studentone@gmail.com",
        password: "123456",
        role: "student",
        skills: ["UI/UX Design", "Software Engineering", "React"],
        interests: ["UI/UX Design", "Web Apps"],
        rating: 5.0,
        badges: ["Consistent Learner", "Elite Performer"],
        trustScore: 100,
        graduationYear: "2026",
        university: "State University",
        consecutivePassed: 3
      });
      updated = true;
    } else if (studentUser.password !== '123456') {
      studentUser.password = '123456';
      updated = true;
    }

    // Ensure companysecond@gmail.com exists
    const companyUser = db.users.find(u => u.email === 'companysecond@gmail.com');
    if (!companyUser) {
      db.users.push({
        id: "company_second",
        username: "companysecond",
        email: "companysecond@gmail.com",
        password: "123456",
        role: "recruiter",
        companyId: "3",
        companyName: "zylor.io"
      });
      updated = true;
    } else if (companyUser.password !== '123456') {
      companyUser.password = '123456';
      updated = true;
    }

    // Ensure adminthird@gmail.com exists
    const adminUser = db.users.find(u => u.email === 'adminthird@gmail.com');
    if (!adminUser) {
      db.users.push({
        id: "admin_third",
        username: "adminthird",
        email: "adminthird@gmail.com",
        password: "123456",
        role: "admin"
      });
      updated = true;
    } else if (adminUser.password !== '123456') {
      adminUser.password = '123456';
      updated = true;
    }

    if (updated) {
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
    }

    // Seed ads and success stories if empty
    let dbUpdated = false;
    if (!db.ads || db.ads.length === 0) {
      db.ads = [
        {
          id: "ad_1",
          company: "Google",
          title: "Software Engineering Residency 2024",
          image: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=400",
          status: "pending",
          urgent: true,
          remaining: "24h Remaining",
          target: "CS Seniors & Grads",
          stipend: "Rs 80,000/mo"
        },
        {
          id: "ad_2",
          company: "Stripe",
          title: "Fintech Engineering Lead",
          image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400",
          status: "active",
          urgent: false,
          remaining: "Starts Nov 15",
          target: "L5+ Engineers",
          stipend: "$12,000/mo"
        },
        {
          id: "ad_3",
          company: "Airbnb",
          title: "Market Operations Intern",
          image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=400",
          status: "pending",
          urgent: false,
          remaining: "12h Remaining",
          target: "Business / Ops Majors",
          stipend: "Rs 45,000/mo"
        },
        {
          id: "ad_4",
          company: "OpenAI",
          title: "AI Research Intern",
          image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=400",
          status: "active",
          urgent: false,
          remaining: "Starts Jan 2025",
          target: "PhD in AI/ML",
          stipend: "$9,500/mo",
          aiManaged: true
        }
      ];
      dbUpdated = true;
    }

    if (!db.success_stories || db.success_stories.length === 0) {
      db.success_stories = [
        {
          id: "story_1",
          name: "Jordan Smith",
          title: "Breaking into FinTech",
          desc: "Successfully started working as a Software Intern.",
          status: "Published"
        },
        {
          id: "story_2",
          name: "Ayesha Lodhi",
          title: "Building Scalable Backends",
          desc: "Successfully started working as a Software Intern.",
          status: "Published"
        },
        {
          id: "story_3",
          name: "Bilal Khan",
          title: "Advanced UI/UX Architectures",
          desc: "Successfully started working as a Software Intern.",
          status: "Draft"
        }
      ];
      dbUpdated = true;
    }

    if (!db.mockInterviews || db.mockInterviews.length === 0) {
      db.mockInterviews = [
        {
          id: "MOCK-101",
          title: "Senior Frontend Architecture Mock",
          type: "AI Technical",
          interviewer: "AI Claude 3.7 Pro",
          status: "scheduled",
          scheduledTime: "Today, 4:30 PM",
          score: null,
          topic: "Virtual DOM, SSR & Custom Hooks"
        },
        {
          id: "MOCK-102",
          title: "System Design & Distributed Caching",
          type: "1-on-1 Mentor",
          interviewer: "Sarah Jenkins (Staff SWE @ Stripe)",
          status: "confirmed",
          scheduledTime: "Tomorrow, 10:00 AM",
          score: null,
          topic: "High Availability Systems"
        },
        {
          id: "MOCK-103",
          title: "Full-Stack Data Engineering & LRU Cache",
          type: "AI Technical",
          interviewer: "AI Claude 3.7 Pro",
          status: "completed",
          scheduledTime: "Yesterday, 3:00 PM",
          score: 94,
          topic: "LRU Cache & Concurrency"
        }
      ];
      dbUpdated = true;
    }

    if (dbUpdated) {
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
    }

    return db;
  } catch (err) {
    return {
      companies: [],
      submissions: [],
      tests: [],
      assignments: [],
      activities: [],
      users: [],
      success_stories: [],
      ads: [],
      mentors: [],
      software_houses: [],
      schedule: {},
      rewards: {},
      jobs: [],
      courses: [],
      interviews: [],
      leaderboard: [],
      purchases: { companyPlans: [], studentCourses: [] }
    };
  }
}

// Helper to write database
function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// CORS Headers helper
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Validate Auth Token helper
async function validateToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  if (!token) return null;

  if (token === 'mock_token' || token === 'test_token' || token === 'mock_token_student') {
    return { email: 'studentone@gmail.com' };
  }
  if (token === 'mock_token_company' || token === 'mock_token_recruiter') {
    return { email: 'companysecond@gmail.com' };
  }
  if (token === 'mock_token_admin') {
    return { email: 'adminthird@gmail.com' };
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': SUPABASE_ANON_KEY
      }
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        if (payload && payload.email) {
          return payload;
        }
      }
    } catch (err) { }
  }
  return null;
}

module.exports = {
  readDb,
  writeDb,
  setCorsHeaders,
  validateToken,
  otps,
  SUPABASE_URL,
  SUPABASE_ANON_KEY
};

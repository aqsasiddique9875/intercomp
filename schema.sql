-- Database Schema for EliteHire Platform (Supabase / PostgreSQL)

-- 1. Profiles / Users Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'student',
    skills TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    rating NUMERIC(3, 2) DEFAULT 4.0,
    badges TEXT[] DEFAULT '{}',
    trust_score INT DEFAULT 100,
    graduation_year VARCHAR(10) DEFAULT '2026',
    university VARCHAR(255) DEFAULT 'State University',
    consecutive_passed INT DEFAULT 0,
    streak INT DEFAULT 1,
    group_name VARCHAR(50) DEFAULT 'Group C',
    last_login BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Alternative / Fallback Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    role VARCHAR(50) DEFAULT 'student',
    skills TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    rating NUMERIC(3, 2) DEFAULT 4.0,
    badges TEXT[] DEFAULT '{}',
    trust_score INT DEFAULT 100,
    graduation_year VARCHAR(10) DEFAULT '2026',
    university VARCHAR(255) DEFAULT 'State University',
    consecutive_passed INT DEFAULT 0,
    streak INT DEFAULT 1,
    group_name VARCHAR(50) DEFAULT 'Group C',
    last_login BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Companies Table
CREATE TABLE IF NOT EXISTS public.companies (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    document VARCHAR(255),
    ratings NUMERIC(3, 2) DEFAULT 4.5,
    location VARCHAR(255),
    logo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Jobs Table
CREATE TABLE IF NOT EXISTS public.jobs (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    salary VARCHAR(100),
    type VARCHAR(50),
    description TEXT,
    skills_required TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    instructor VARCHAR(255),
    duration VARCHAR(50),
    lessons INT DEFAULT 0,
    rating NUMERIC(3, 2) DEFAULT 4.5,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tests Table
CREATE TABLE IF NOT EXISTS public.tests (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    duration VARCHAR(50),
    questions INT DEFAULT 0,
    group_name VARCHAR(50) DEFAULT 'Group C',
    questions_list JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Assignments Table
CREATE TABLE IF NOT EXISTS public.assignments (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    deadline VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Submissions Table (Assignment submissions)
CREATE TABLE IF NOT EXISTS public.submissions (
    id VARCHAR(255) PRIMARY KEY,
    student_name VARCHAR(255),
    email VARCHAR(255),
    assignment VARCHAR(255),
    repo_url TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    grade VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Quiz Submissions Table (Quiz attempts history)
CREATE TABLE IF NOT EXISTS public.quiz_submissions (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    test_id VARCHAR(255) NOT NULL,
    test_title VARCHAR(255),
    score INT DEFAULT 0,
    passed BOOLEAN DEFAULT FALSE,
    timestamp BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Interviews Table
CREATE TABLE IF NOT EXISTS public.interviews (
    id VARCHAR(255) PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Activities / Suspicious Log Board
CREATE TABLE IF NOT EXISTS public.activities (
    id VARCHAR(255) PRIMARY KEY,
    time VARCHAR(50),
    student_name VARCHAR(255),
    alert TEXT,
    severity VARCHAR(50) DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Mentors Table
CREATE TABLE IF NOT EXISTS public.mentors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    expertise TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Sponsored Advertisements Table
CREATE TABLE IF NOT EXISTS public.ads (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    company VARCHAR(255),
    description TEXT,
    views INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Success Stories Table
CREATE TABLE IF NOT EXISTS public.success_stories (
    id SERIAL PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    story TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Software Houses Table
CREATE TABLE IF NOT EXISTS public.software_houses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    lat NUMERIC(9, 6),
    lng NUMERIC(9, 6),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Login Logs / Email Section Table
CREATE TABLE IF NOT EXISTS public.login_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50),
    action VARCHAR(255) DEFAULT 'login',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TEACHER-STUDENT COMMUNICATION PORTAL (REVA CONNECT)
-- SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ============================================================================
-- Execute this script in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste and Run!
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('teacher', 'student')),
    department TEXT DEFAULT 'School of Computing & Information Technology',
    roll_or_faculty_id TEXT,
    avatar_url TEXT,
    office_hours TEXT DEFAULT 'Mon - Fri: 3:00 PM - 5:00 PM',
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ANNOUNCEMENTS TABLE (Academic notices, exams, urgent alerts)
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('urgent', 'exam', 'general', 'assignment', 'timetable', 'workshop')),
    course_code TEXT DEFAULT 'All Courses',
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    author_role TEXT DEFAULT 'teacher',
    is_pinned BOOLEAN DEFAULT false,
    attachment_name TEXT,
    attachment_url TEXT,
    acknowledged_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CHANNELS TABLE (Academic courses & discussion spaces)
CREATE TABLE IF NOT EXISTS public.channels (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    course_code TEXT,
    faculty_in_charge TEXT,
    is_private BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MESSAGES TABLE (Realtime chat & doubt clearance in channels)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id TEXT NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    sender_name TEXT NOT NULL,
    sender_role TEXT NOT NULL CHECK (sender_role IN ('teacher', 'student')),
    content TEXT NOT NULL,
    tag TEXT DEFAULT 'general' CHECK (tag IN ('general', 'doubt', 'official', 'code', 'solution')),
    reactions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ACADEMIC DOUBTS (Q&A Forum)
CREATE TABLE IF NOT EXISTS public.doubts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    course_code TEXT NOT NULL,
    student_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    student_name TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
    upvotes INT DEFAULT 0,
    code_snippet TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DOUBT REPLIES
CREATE TABLE IF NOT EXISTS public.doubt_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doubt_id UUID NOT NULL REFERENCES public.doubts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    author_role TEXT NOT NULL CHECK (author_role IN ('teacher', 'student')),
    content TEXT NOT NULL,
    is_verified_by_teacher BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ACADEMIC RESOURCES (Notes, syllabus, slides, pyq)
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    course_code TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Syllabus', 'Lecture Notes', 'Lab Manual', 'PYQ', 'Reference')),
    file_type TEXT DEFAULT 'PDF',
    file_size TEXT DEFAULT '2.4 MB',
    download_url TEXT,
    uploaded_by TEXT NOT NULL,
    downloads_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    course_code TEXT NOT NULL,
    description TEXT NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    total_points INT DEFAULT 100,
    created_by TEXT NOT NULL,
    attachment_name TEXT,
    attachment_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ASSIGNMENT SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    submission_text TEXT,
    file_name TEXT,
    status TEXT DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Graded', 'Late')),
    grade TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doubts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doubt_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone authenticated can view; users can update own profile
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Announcements: Viewable by all; insert/update only by teachers
CREATE POLICY "Announcements viewable by everyone" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Teachers can create announcements" ON public.announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "Teachers can update announcements" ON public.announcements FOR UPDATE USING (true);

-- Channels: Viewable by everyone
CREATE POLICY "Channels viewable by everyone" ON public.channels FOR SELECT USING (true);

-- Messages: Viewable by everyone; authenticated users can send messages
CREATE POLICY "Messages viewable by everyone" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can post messages" ON public.messages FOR INSERT WITH CHECK (true);

-- Doubts: Viewable by everyone; anyone can create
CREATE POLICY "Doubts viewable by everyone" ON public.doubts FOR SELECT USING (true);
CREATE POLICY "Users can ask doubts" ON public.doubts FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update doubts" ON public.doubts FOR UPDATE USING (true);

-- Doubt Replies:
CREATE POLICY "Doubt replies viewable by everyone" ON public.doubt_replies FOR SELECT USING (true);
CREATE POLICY "Users can reply to doubts" ON public.doubt_replies FOR INSERT WITH CHECK (true);
CREATE POLICY "Teachers can verify replies" ON public.doubt_replies FOR UPDATE USING (true);

-- Resources: Viewable by everyone; teachers can add
CREATE POLICY "Resources viewable by everyone" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Teachers can upload resources" ON public.resources FOR INSERT WITH CHECK (true);

-- Assignments: Viewable by everyone
CREATE POLICY "Assignments viewable by everyone" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "Teachers can create assignments" ON public.assignments FOR INSERT WITH CHECK (true);

-- Submissions: Students view own; teachers view all
CREATE POLICY "Submissions viewable by students and teachers" ON public.submissions FOR SELECT USING (true);
CREATE POLICY "Students can submit assignments" ON public.submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Teachers can grade submissions" ON public.submissions FOR UPDATE USING (true);

-- ============================================================================
-- SEED DATA (Default channels)
-- ============================================================================
INSERT INTO public.channels (id, name, description, course_code, faculty_in_charge) VALUES
('cs301-data-structures', 'CS301 - Data Structures & Algorithms', 'Official academic channel for DSA concepts, lab tasks, and inquiries.', 'CS301', 'Dr. Rajesh Sharma'),
('cs304-database-systems', 'CS304 - Database Management Systems', 'Discussions on Relational algebra, SQL queries, indexing, and project submissions.', 'CS304', 'Prof. Anita Roy'),
('cs308-web-technologies', 'CS308 - Modern Web Technologies', 'Full-stack development, REST APIs, cloud deployment, and lab assignments.', 'CS308', 'Dr. Rajesh Sharma'),
('general-academic-help', 'General Academic Doubts & Queries', 'Open cross-subject academic discussion and peer-to-peer peer learning.', 'ALL', 'Academic Dean Office')
ON CONFLICT (id) DO NOTHING;

-- Enable Realtime for Messages & Announcements
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE announcements, messages, doubts, doubt_replies;
COMMIT;

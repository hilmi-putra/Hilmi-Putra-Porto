-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    project_url TEXT,
    github_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create messages table for contact submissions
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
-- 1. Allow public read access to projects
CREATE POLICY "Allow public read access to projects" 
ON projects FOR SELECT 
USING (true);

-- 2. Allow authenticated users (admin) to do all operations on projects
CREATE POLICY "Allow admin CRUD on projects" 
ON projects FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- RLS Policies for messages
-- 1. Allow public to insert contact messages (anonymous submission)
CREATE POLICY "Allow public insert to messages" 
ON messages FOR INSERT 
WITH CHECK (true);

-- 2. Allow authenticated users (admin) to read and manage messages
CREATE POLICY "Allow admin view and manage messages" 
ON messages FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

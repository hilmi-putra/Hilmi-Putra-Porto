-- ==========================================
-- TAHAP 2: SUPABASE DATABASE SCHEMA
-- Copy dan Paste seluruh script ini ke SQL Editor di Supabase
-- ==========================================

-- 1. Table: journey
-- Menyimpan data perjalanan karir/pendidikan
CREATE TABLE IF NOT EXISTS public.journey (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    date_start TEXT NOT NULL, -- Contoh: 'Jan 2022'
    date_end TEXT, -- Contoh: 'Present' atau 'Dec 2023'
    title TEXT NOT NULL,
    description TEXT,
    key_details TEXT[] DEFAULT '{}', -- Array of text
    stack_and_focus TEXT[] DEFAULT '{}', -- Array of text
    sort_order INTEGER DEFAULT 0 -- Untuk fitur sortable
);

-- 2. Table: gallery
-- Menyimpan data galeri gambar portofolio
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    description TEXT,
    images TEXT[] DEFAULT '{}', -- Array of image URLs untuk carousel
    sort_order INTEGER DEFAULT 0
);

-- 3. Table: future_projects
-- Menyimpan data project masa depan / coming soon
CREATE TABLE IF NOT EXISTS public.future_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    leads_title TEXT,
    main_title TEXT NOT NULL,
    multiple_images TEXT[] DEFAULT '{}', -- Array of image URLs
    description TEXT,
    timeline TEXT,
    project_role TEXT,
    stack_and_technologies TEXT[] DEFAULT '{}',
    live_demo_link TEXT,
    github_repository_link TEXT,
    case_study_link TEXT,
    is_featured BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'In Progress', -- In Progress, Completed, dll
    sort_order INTEGER DEFAULT 0
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Aktifkan RLS untuk semua tabel
ALTER TABLE public.journey ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.future_projects ENABLE ROW LEVEL SECURITY;

-- Buat Policy: Semua orang (publik) bisa MEMBACA data (SELECT)
CREATE POLICY "Public profiles are viewable by everyone." ON public.journey FOR SELECT USING (true);
CREATE POLICY "Public profiles are viewable by everyone." ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Public profiles are viewable by everyone." ON public.future_projects FOR SELECT USING (true);

-- Buat Policy: HANYA Admin yang sudah login yang bisa menambah, mengubah, dan menghapus (INSERT, UPDATE, DELETE)
-- (Kita menggunakan auth.role() = 'authenticated' untuk sementara, yang artinya user yang berhasil login di Supabase Auth)
CREATE POLICY "Authenticated users can insert" ON public.journey FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON public.journey FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON public.journey FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert" ON public.gallery FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON public.gallery FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON public.gallery FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert" ON public.future_projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON public.future_projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON public.future_projects FOR DELETE USING (auth.role() = 'authenticated');

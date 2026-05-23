-- ==========================================
-- TAHAP 5: SUPABASE STORAGE POLICIES
-- Copy dan Paste seluruh script ini ke SQL Editor di Supabase
-- ==========================================

-- 1. Beri izin kepada PUBLIK (Semua orang) untuk MEMBACA (SELECT) gambar
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'portfolio-assets' );

-- 2. Beri izin kepada ADMIN (Authenticated) untuk UPLOAD (INSERT) gambar
CREATE POLICY "Admin Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated' );

-- 3. Beri izin kepada ADMIN untuk UPDATE gambar
CREATE POLICY "Admin Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated' );

-- 4. Beri izin kepada ADMIN untuk DELETE gambar
CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated' );

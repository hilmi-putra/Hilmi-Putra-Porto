import { supabase } from '../lib/supabaseClient';

const BUCKET_NAME = 'portfolio-assets';

/**
 * Upload gambar ke Supabase Storage
 * @param {File} file - Object file dari input type="file"
 * @param {string} folder - Nama folder tujuan (opsional), misal: 'gallery' atau 'future'
 * @returns {Promise<{url: string|null, error: string|null}>}
 */
export const uploadImage = async (file, folder = 'general') => {
  try {
    // 1. Buat nama file unik agar tidak bentrok
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // 2. Upload file ke Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false // Jangan timpa file dengan nama sama
      });

    if (uploadError) {
      throw uploadError;
    }

    // 3. Dapatkan Public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { url: null, error: error.message };
  }
};

/**
 * Menghapus gambar dari Supabase Storage
 * @param {string} url - Public URL gambar yang ingin dihapus
 */
export const deleteImage = async (url) => {
  try {
    // URL format: https://.../storage/v1/object/public/portfolio-assets/folder/filename.jpg
    const urlParts = url.split(`/${BUCKET_NAME}/`);
    if (urlParts.length !== 2) return { success: false, error: 'Invalid URL format' };
    
    const filePath = urlParts[1]; // Mengambil 'folder/filename.jpg'

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting image:', error);
    return { success: false, error: error.message };
  }
};

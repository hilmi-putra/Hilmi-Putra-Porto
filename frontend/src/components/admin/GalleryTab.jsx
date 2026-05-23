import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Loader2, UploadCloud } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { fetchItems, createItem, deleteItem, updateSortOrders } from '../../services/api';
import { uploadImage } from '../../services/storage';
import { SortableList } from '../dnd/SortableList';
import { SortableItem } from '../dnd/SortableItem';

export const GalleryTab = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Default form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sort_order: 0,
    image_url: '' // will be filled automatically after upload
  });

  const fileInputRef = useRef(null);

  const loadData = async () => {
    setLoading(true);
    const { data } = await fetchItems('gallery');
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData({ title: '', description: '', sort_order: 0, image_url: '' });
    setIsModalOpen(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Upload to bucket
      const { url, error } = await uploadImage(file, 'gallery');
      if (error) throw new Error(error);

      // 2. Set to form
      setFormData(prev => ({ ...prev, image_url: url }));
    } catch (err) {
      alert('Gagal mengupload gambar: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image_url) {
      alert("Harap upload gambar terlebih dahulu!");
      return;
    }
    if (!formData.title) {
      alert("Harap isi judul foto!");
      return;
    }

    setLoading(true);
    // Menyesuaikan dengan kolom aktual di database user:
    // caption_en, description, media_url, media_type, is_active
    const { error } = await createItem('gallery', {
      caption_en: formData.title,
      description: formData.description,
      media_url: formData.image_url,
      media_type: 'image',
      is_active: true,
      sort_order: parseInt(formData.sort_order) || 0
    });
    
    if (error) {
      alert("Gagal menyimpan data: " + error);
    }
    
    await loadData();
    setIsModalOpen(false);
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Hapus foto ini dari galeri?')) return;
    setLoading(true);
    
    // Optional: Delete from storage bucket if you want
    // Extract path from public URL if possible, or just delete DB record.
    // We will just delete DB record for simplicity
    await deleteItem('gallery', item.id);
    await loadData();
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-brand-lime" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Gallery</h2>
        <Button onClick={openAddModal} className="flex items-center gap-1.5 py-2 px-6 text-xs font-bold bg-brand-lime text-slate-900 hover:bg-brand-lime/90">
          <Plus size={14} /> Add Photo
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-2xl py-16 text-center border border-white/10">
          <p className="text-blue-100 text-sm font-light">Belum ada foto di galeri.</p>
        </div>
      ) : (
        <SortableList
          items={items}
          strategy="grid"
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          onReorder={async (newItems) => {
            const reorderedItems = newItems.map((item, index) => ({ ...item, sort_order: index }));
            setItems(reorderedItems);
            
            const updates = reorderedItems.map(item => ({ id: item.id, sort_order: item.sort_order }));
            const { success, error } = await updateSortOrders('gallery', updates);
            if (!success) {
              alert('Gagal mengurutkan data: ' + error);
              loadData(); // rollback
            }
          }}
        >
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id} className="h-full">
              <div className="bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-2xl border border-white/10 overflow-hidden flex flex-col group relative h-full">
              <div className="aspect-square bg-white/5 relative flex items-center justify-center overflow-hidden">
                <img src={item.media_url || ''} alt={item.caption_en} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4 flex flex-col gap-1">
                <span className="text-[10px] text-brand-lime uppercase tracking-widest font-black">{item.description || 'KATEGORI'}</span>
                <span className="text-sm font-bold text-white truncate leading-tight">{item.caption_en || 'Tanpa Judul'}</span>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">Sort: {item.sort_order}</span>
              </div>
              <button 
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => handleDelete(item)} 
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/20 backdrop-blur-md border border-red-500/50 text-white hover:bg-red-500 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20"
              >
                <Trash2 size={14} />
              </button>
            </div>
            </SortableItem>
          ))}
        </SortableList>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900/90 backdrop-blur-2xl shadow-2xl max-w-sm w-full rounded-3xl border border-white/10 p-8 flex flex-col gap-6 relative text-left">
            <h3 className="text-2xl font-bold text-white capitalize">Add Photo</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Image Uploader */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-widest text-blue-100 font-bold">Image File</label>
                <div 
                  className={`w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 overflow-hidden relative ${formData.image_url ? 'border-brand-lime/50 bg-white/5' : 'border-white/20 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors'}`}
                  onClick={() => !formData.image_url && fileInputRef.current?.click()}
                >
                  {uploading ? (
                    <Loader2 className="animate-spin text-brand-lime" size={24} />
                  ) : formData.image_url ? (
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <UploadCloud className="text-white/50" size={24} />
                      <span className="text-xs text-white/50">Click to upload image</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} disabled={uploading} />
                </div>
                {formData.image_url && (
                  <button type="button" onClick={() => setFormData(prev => ({...prev, image_url: ''}))} className="text-[10px] text-red-400 text-right uppercase hover:underline">
                    Remove Image
                  </button>
                )}
              </div>

              <Input label="Category / Eyebrow (Teks Hijau Kecil)" placeholder="Contoh: PERSONAL WORKSPACE" name="description" value={formData.description} onChange={handleInputChange} className="bg-white/10 border-white/20 text-white" />
              <Input label="Main Title (Teks Putih Besar) *" placeholder="Contoh: Builder Portrait" name="title" required value={formData.title} onChange={handleInputChange} className="bg-white/10 border-white/20 text-white" />
              <Input label="Sort Order (Angka)" name="sort_order" type="number" value={formData.sort_order} onChange={handleInputChange} className="bg-white/10 border-white/20 text-white" />
              
              <div className="flex justify-end gap-3 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="border-white/30 text-white hover:bg-white/10">Batal</Button>
                <Button type="submit" disabled={loading || uploading || !formData.image_url} className="bg-brand-lime text-slate-900 font-bold">{loading ? 'Menyimpan...' : 'Simpan'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

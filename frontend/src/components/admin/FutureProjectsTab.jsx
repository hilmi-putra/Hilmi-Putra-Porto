import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Loader2, UploadCloud, Edit2, Star } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { fetchItems, createItem, deleteItem, updateItem, updateSortOrders } from '../../services/api';
import { uploadImage } from '../../services/storage';
import { SortableList } from '../dnd/SortableList';
import { SortableItem } from '../dnd/SortableItem';

export const FutureProjectsTab = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null,
    leads_title: '',
    main_title: '',
    description: '',
    timeline: '',
    project_role: '',
    key_features: [],
    stack_and_technologies: [],
    live_demo_link: '',
    github_repository_link: '',
    case_study_link: '',
    is_featured: false,
    status: 'In Progress',
    sort_order: 0,
    multiple_images: []
  });

  const [stackTechInput, setStackTechInput] = useState('');
  const [keyFeatureInput, setKeyFeatureInput] = useState('');
  const fileInputRef = useRef(null);

  const loadData = async () => {
    setLoading(true);
    // Kita asumsikan nama tabel adalah 'future_projects'
    const { data } = await fetchItems('future_projects');
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const openAddModal = () => {
    setFormData({
      id: null, leads_title: '', main_title: '', description: '',
      timeline: '', project_role: '', key_features: [], stack_and_technologies: [],
      live_demo_link: '', github_repository_link: '', case_study_link: '',
      is_featured: false, status: 'In Progress', sort_order: 0, multiple_images: []
    });
    setStackTechInput('');
    setKeyFeatureInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setFormData({
      id: item.id,
      leads_title: item.leads_title || '',
      main_title: item.main_title || '',
      description: item.description || '',
      timeline: item.timeline || '',
      project_role: item.project_role || '',
      key_features: Array.isArray(item.key_features) ? item.key_features : [],
      stack_and_technologies: Array.isArray(item.stack_and_technologies) ? item.stack_and_technologies : [],
      live_demo_link: item.live_demo_link || '',
      github_repository_link: item.github_repository_link || '',
      case_study_link: item.case_study_link || '',
      is_featured: item.is_featured || false,
      status: item.status || 'In Progress',
      sort_order: item.sort_order || 0,
      multiple_images: item.multiple_images || []
    });
    setStackTechInput('');
    setKeyFeatureInput('');
    setIsModalOpen(true);
  };

  const handleAddArrayItem = (field, inputState, setInputState) => {
    if (!inputState.trim()) return;
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], inputState.trim()]
    }));
    setInputState('');
  };

  const handleRemoveArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const { url, error } = await uploadImage(file, 'future_projects');
        if (error) throw new Error(error);
        uploadedUrls.push(url);
      }
      
      setFormData(prev => ({ 
        ...prev, 
        multiple_images: [...prev.multiple_images, ...uploadedUrls] 
      }));
    } catch (err) {
      alert('Gagal mengupload gambar: ' + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      multiple_images: prev.multiple_images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.main_title) {
      alert("Harap isi Main Title!");
      return;
    }

    setLoading(true);
    
    const payload = {
      leads_title: formData.leads_title,
      main_title: formData.main_title,
      description: formData.description,
      timeline: formData.timeline,
      project_role: formData.project_role,
      key_features: formData.key_features,
      stack_and_technologies: formData.stack_and_technologies,
      live_demo_link: formData.live_demo_link,
      github_repository_link: formData.github_repository_link,
      case_study_link: formData.case_study_link,
      is_featured: formData.is_featured,
      status: formData.status,
      sort_order: parseInt(formData.sort_order) || 0,
      multiple_images: formData.multiple_images
    };

    let error;
    if (formData.id) {
      const res = await updateItem('future_projects', formData.id, payload);
      error = res.error;
    } else {
      const res = await createItem('future_projects', payload);
      error = res.error;
    }
    
    if (error) {
      alert("Gagal menyimpan data: " + error);
    }
    
    await loadData();
    setIsModalOpen(false);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Hapus project "${item.main_title}"?`)) return;
    setLoading(true);
    await deleteItem('future_projects', item.id);
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
        <h2 className="text-xl font-bold">Future Projects</h2>
        <Button onClick={openAddModal} className="flex items-center gap-1.5 py-2 px-6 text-xs font-bold bg-brand-lime text-slate-900 hover:bg-brand-lime/90">
          <Plus size={14} /> Add Project
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-2xl py-16 text-center border border-white/10">
          <p className="text-blue-100 text-sm font-light">Belum ada project.</p>
        </div>
      ) : (
        <SortableList
          items={items}
          strategy="grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          onReorder={async (newItems) => {
            const reorderedItems = newItems.map((item, index) => ({ ...item, sort_order: index }));
            setItems(reorderedItems);
            
            const updates = reorderedItems.map(item => ({ id: item.id, sort_order: item.sort_order }));
            const { success, error } = await updateSortOrders('future_projects', updates);
            if (!success) {
              alert('Gagal mengurutkan data: ' + error);
              loadData(); // rollback
            }
          }}
        >
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id} className="h-full">
              <div className="bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-2xl border border-white/10 overflow-hidden flex flex-col group relative h-full">
              <div className="aspect-video bg-white/5 relative flex items-center justify-center overflow-hidden">
                {item.multiple_images && item.multiple_images.length > 0 ? (
                  <img src={item.multiple_images[0]} alt={item.main_title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <span className="text-white/30 text-xs uppercase tracking-widest">No Image</span>
                )}
                {item.is_featured && (
                  <div className="absolute top-3 left-3 bg-brand-lime text-slate-900 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> FEATURED
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col gap-2 flex-grow">
                <span className="text-[10px] text-brand-lime uppercase tracking-widest font-black">{item.leads_title || 'CATEGORY'}</span>
                <h3 className="text-lg font-bold text-white leading-tight">{item.main_title}</h3>
                <p className="text-xs text-blue-100 line-clamp-2 mt-1">{item.description}</p>
              </div>
              <div className="p-5 pt-0 flex gap-2 justify-end border-t border-white/5 mt-auto">
                <button onPointerDown={(e) => e.stopPropagation()} onClick={() => openEditModal(item)} className="p-2 text-blue-200 hover:text-white transition-colors relative z-20">
                  <Edit2 size={16} />
                </button>
                <button onPointerDown={(e) => e.stopPropagation()} onClick={() => handleDelete(item)} className="p-2 text-red-400 hover:text-red-300 transition-colors relative z-20">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            </SortableItem>
          ))}
        </SortableList>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900/90 backdrop-blur-2xl shadow-2xl max-w-2xl w-full rounded-3xl border border-white/10 p-8 flex flex-col gap-6 relative text-left max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white capitalize">{formData.id ? 'Edit' : 'Add'} Future Project</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* Image Uploader */}
              <div className="flex flex-col gap-3">
                <label className="text-[11px] uppercase tracking-widest text-blue-100 font-bold">Multiple Images</label>
                
                {/* Preview Grid */}
                {formData.multiple_images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {formData.multiple_images.map((imgUrl, idx) => (
                      <div key={idx} className="aspect-video bg-white/5 rounded-lg border border-white/20 relative overflow-hidden group">
                        <img src={imgUrl} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => removeImage(idx)} 
                          className="absolute inset-0 bg-red-500/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Area */}
                <div 
                  className="w-full h-24 rounded-xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors flex flex-col items-center justify-center gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? (
                    <Loader2 className="animate-spin text-brand-lime" size={24} />
                  ) : (
                    <>
                      <UploadCloud className="text-white/50" size={24} />
                      <span className="text-xs text-white/50">Click to add images</span>
                    </>
                  )}
                  <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} disabled={uploading} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Main Title *" name="main_title" required value={formData.main_title} onChange={handleInputChange} className="bg-white/10 border-white/20 text-white" />
                <Input label="Leads Title / Kategori" placeholder="e.g. Frontend" name="leads_title" value={formData.leads_title} onChange={handleInputChange} className="bg-white/10 border-white/20 text-white" />
              </div>

              <Textarea label="Description" name="description" value={formData.description} onChange={handleInputChange} className="bg-white/10 border-white/20 text-white min-h-[100px]" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Timeline" placeholder="e.g. 2 Months" name="timeline" value={formData.timeline} onChange={handleInputChange} className="bg-white/10 border-white/20 text-white" />
                <Input label="Project Role" placeholder="e.g. Lead Developer" name="project_role" value={formData.project_role} onChange={handleInputChange} className="bg-white/10 border-white/20 text-white" />
              </div>

              {/* Dynamic Array Input: Key Features */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-widest text-blue-100 font-bold">Key Features</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={keyFeatureInput} 
                    onChange={(e) => setKeyFeatureInput(e.target.value)} 
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddArrayItem('key_features', keyFeatureInput, setKeyFeatureInput); } }}
                    placeholder="Ketik fitur kunci (key feature) lalu klik Add..." 
                    className="flex-grow bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-lime"
                  />
                  <Button type="button" onClick={() => handleAddArrayItem('key_features', keyFeatureInput, setKeyFeatureInput)} className="bg-white/10 text-white hover:bg-white/20 px-4">Add</Button>
                </div>
                {formData.key_features && formData.key_features.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    {formData.key_features.map((feature, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-3 bg-brand-lime/10 text-brand-lime border border-brand-lime/20 px-4 py-2 rounded-xl text-sm font-medium">
                        <span className="leading-relaxed">{feature}</span>
                        <button type="button" onClick={() => handleRemoveArrayItem('key_features', idx)} className="hover:text-white mt-1 shrink-0"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dynamic Array Input: Stack & Technologies */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-widest text-blue-100 font-bold">Stack & Technologies</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={stackTechInput} 
                    onChange={(e) => setStackTechInput(e.target.value)} 
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddArrayItem('stack_and_technologies', stackTechInput, setStackTechInput); } }}
                    placeholder="Ketik teknologi lalu klik Add..." 
                    className="flex-grow bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-lime"
                  />
                  <Button type="button" onClick={() => handleAddArrayItem('stack_and_technologies', stackTechInput, setStackTechInput)} className="bg-white/10 text-white hover:bg-white/20 px-4">Add</Button>
                </div>
                {formData.stack_and_technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.stack_and_technologies.map((stack, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-brand-lime/20 text-brand-lime border border-brand-lime/20 px-3 py-1 rounded-full text-xs font-bold">
                        <span>{stack}</span>
                        <button type="button" onClick={() => handleRemoveArrayItem('stack_and_technologies', idx)} className="hover:text-white"><Trash2 size={12} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Live Demo URL" type="url" name="live_demo_link" value={formData.live_demo_link} onChange={handleInputChange} className="bg-white/10 border-white/20 text-white" />
                <Input label="GitHub URL" type="url" name="github_repository_link" value={formData.github_repository_link} onChange={handleInputChange} className="bg-white/10 border-white/20 text-white" />
                <Input label="Case Study URL" type="url" name="case_study_link" value={formData.case_study_link} onChange={handleInputChange} className="bg-white/10 border-white/20 text-white" />
                <Input label="Sort Order" type="number" name="sort_order" value={formData.sort_order} onChange={handleInputChange} className="bg-white/10 border-white/20 text-white" />
              </div>

              <div className="flex gap-4 p-4 border border-white/10 rounded-xl bg-white/5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleInputChange} className="w-4 h-4 rounded bg-slate-900 border-white/20 text-brand-lime focus:ring-brand-lime focus:ring-offset-slate-900" />
                  <span className="text-sm font-bold text-white">Is Featured? (Bintang)</span>
                </label>
              </div>
              
              <div className="flex justify-end gap-3 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="border-white/30 text-white hover:bg-white/10">Batal</Button>
                <Button type="submit" disabled={loading || uploading} className="bg-brand-lime text-slate-900 font-bold">{loading ? 'Menyimpan...' : 'Simpan'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

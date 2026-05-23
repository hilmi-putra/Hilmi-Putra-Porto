import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, GripVertical } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { fetchItems, createItem, updateItem, deleteItem, updateSortOrders } from '../../services/api';
import { SortableList } from '../dnd/SortableList';
import { SortableItem } from '../dnd/SortableItem';

export const JourneyTab = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingId, setEditingId] = useState(null);
  
  // Default form state
  const initialForm = {
    title: '',
    institution: '',
    date_start: '',
    date_end: '',
    description: '',
    key_details: [], // changed to array
    stack_and_focus: [], // changed to array
    sort_order: 0
  };
  const [formData, setFormData] = useState(initialForm);
  const [keyDetailInput, setKeyDetailInput] = useState('');
  const [stackFocusInput, setStackFocusInput] = useState('');

  const loadData = async () => {
    setLoading(true);
    const { data } = await fetchItems('journey');
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData(initialForm);
    setKeyDetailInput('');
    setStackFocusInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setModalMode('edit');
    setEditingId(item.id);
    setFormData({
      title: item.title || '',
      institution: item.institution || '',
      date_start: item.date_start || '',
      date_end: item.date_end || '',
      description: item.description || '',
      key_details: Array.isArray(item.key_details) ? item.key_details : [],
      stack_and_focus: Array.isArray(item.stack_and_focus) ? item.stack_and_focus : [],
      sort_order: item.sort_order || 0
    });
    setKeyDetailInput('');
    setStackFocusInput('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Parse arrays
    const payload = {
      ...formData,
      sort_order: parseInt(formData.sort_order) || 0
    };

    if (modalMode === 'add') {
      await createItem('journey', payload);
    } else {
      await updateItem('journey', editingId, payload);
    }
    
    await loadData();
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus item journey ini?')) return;
    setLoading(true);
    await deleteItem('journey', id);
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
        <h2 className="text-xl font-bold">Manage Journey / Experience</h2>
        <Button onClick={openAddModal} className="flex items-center gap-1.5 py-2 px-6 text-xs font-bold bg-brand-lime text-slate-900 hover:bg-brand-lime/90">
          <Plus size={14} /> Add Journey
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-2xl py-16 text-center border border-white/10">
          <p className="text-blue-100 text-sm font-light">Belum ada data journey.</p>
        </div>
      ) : (
        <div className="bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-white/20 bg-white/10 text-blue-100 text-[10px] uppercase font-bold tracking-widest">
                  <th className="py-4 px-6 w-12">Sort</th>
                  <th className="py-4 px-6">Title</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Description</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <SortableList
                as="tbody"
                className="divide-y divide-white/10"
                items={items}
                strategy="vertical"
                onReorder={async (newItems) => {
                  const reorderedItems = newItems.map((item, index) => ({ ...item, sort_order: index }));
                  setItems(reorderedItems);
                  
                  const updates = reorderedItems.map(item => ({ id: item.id, sort_order: item.sort_order }));
                  const { success, error } = await updateSortOrders('journey', updates);
                  if (!success) {
                    alert('Gagal mengurutkan data: ' + error);
                    loadData(); // rollback
                  }
                }}
                renderActiveItem={(id) => {
                  const item = items.find(i => i.id === id);
                  if (!item) return null;
                  return (
                    <table className="w-full text-left border-collapse min-w-[700px] bg-slate-900 rounded-xl shadow-2xl border border-brand-lime">
                      <tbody>
                        <tr className="bg-white/10">
                          <td className="py-4 px-6 text-blue-100 font-bold">{item.sort_order}</td>
                          <td className="py-4 px-6 font-bold text-white text-sm">
                            {item.title}
                            <div className="text-[10px] text-blue-100 font-light mt-1 flex items-center gap-1">
                              {item.institution}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-xs text-brand-lime">{item.date_start} - {item.date_end}</td>
                          <td className="py-4 px-6 text-xs text-blue-100 max-w-xs truncate font-light">{item.description}</td>
                          <td className="py-4 px-6 text-right"></td>
                        </tr>
                      </tbody>
                    </table>
                  );
                }}
              >
                {items.map((item) => (
                  <SortableItem as="tr" key={item.id} id={item.id} className="hover:bg-white/10 transition-colors">
                    <td className="py-4 px-6 text-blue-100 font-bold">{item.sort_order}</td>
                    <td className="py-4 px-6 font-bold text-white text-sm">
                      {item.title}
                      <div className="text-[10px] text-blue-100 font-light mt-1 flex items-center gap-1">
                        {item.institution}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-brand-lime">{item.date_start} - {item.date_end}</td>
                    <td className="py-4 px-6 text-xs text-blue-100 max-w-xs truncate font-light">{item.description}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onPointerDown={(e) => e.stopPropagation()} onClick={() => openEditModal(item)} className="w-8 h-8 rounded-full border border-white/20 hover:border-brand-lime hover:text-brand-lime flex items-center justify-center transition-all text-blue-100 relative z-20">
                          <Edit2 size={12} />
                        </button>
                        <button onPointerDown={(e) => e.stopPropagation()} onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-full border border-white/20 hover:border-red-500 hover:text-red-500 flex items-center justify-center transition-all text-blue-100 relative z-20">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </SortableItem>
                ))}
              </SortableList>
            </table>
          </div>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900/90 backdrop-blur-2xl shadow-2xl max-w-lg w-full rounded-3xl border border-white/10 p-8 flex flex-col gap-6 relative text-left overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-bold text-white capitalize">{modalMode} Journey</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input label="Title (Role / Degree)" name="title" value={formData.title} onChange={handleInputChange} required className="bg-white/10 border-white/20 text-white" />
              <Input label="Institution / Company" name="institution" value={formData.institution} onChange={handleInputChange} placeholder="e.g. SMK Negeri 1 Cimahi" required className="bg-white/10 border-white/20 text-white" />
              <div className="flex gap-4">
                <Input label="Date Start" name="date_start" value={formData.date_start} onChange={handleInputChange} placeholder="Jan 2022" required className="bg-white/10 border-white/20 text-white" />
                <Input label="Date End" name="date_end" value={formData.date_end} onChange={handleInputChange} placeholder="Present" required className="bg-white/10 border-white/20 text-white" />
              </div>
              <Textarea label="Description" name="description" value={formData.description} onChange={handleInputChange} rows={3} className="bg-white/10 border-white/20 text-white" />
              
              {/* Dynamic Array Input: Key Details */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-widest text-blue-100 font-bold">Key Details</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={keyDetailInput} 
                    onChange={(e) => setKeyDetailInput(e.target.value)} 
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddArrayItem('key_details', keyDetailInput, setKeyDetailInput); } }}
                    placeholder="Ketik detail lalu klik Add..." 
                    className="flex-grow bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-lime"
                  />
                  <Button type="button" onClick={() => handleAddArrayItem('key_details', keyDetailInput, setKeyDetailInput)} className="bg-white/10 text-white hover:bg-white/20 px-4">Add</Button>
                </div>
                {formData.key_details.length > 0 && (
                  <ul className="flex flex-col gap-2 mt-2">
                    {formData.key_details.map((detail, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-white/5 border border-white/10 rounded-lg p-2 px-3 text-sm text-blue-100">
                        <span className="truncate pr-4">{detail}</span>
                        <button type="button" onClick={() => handleRemoveArrayItem('key_details', idx)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Dynamic Array Input: Stack & Focus */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-widest text-blue-100 font-bold">Stack & Focus</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={stackFocusInput} 
                    onChange={(e) => setStackFocusInput(e.target.value)} 
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddArrayItem('stack_and_focus', stackFocusInput, setStackFocusInput); } }}
                    placeholder="Ketik teknologi lalu klik Add..." 
                    className="flex-grow bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-lime"
                  />
                  <Button type="button" onClick={() => handleAddArrayItem('stack_and_focus', stackFocusInput, setStackFocusInput)} className="bg-white/10 text-white hover:bg-white/20 px-4">Add</Button>
                </div>
                {formData.stack_and_focus.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.stack_and_focus.map((stack, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-brand-lime/20 text-brand-lime border border-brand-lime/20 px-3 py-1 rounded-full text-xs font-bold">
                        <span>{stack}</span>
                        <button type="button" onClick={() => handleRemoveArrayItem('stack_and_focus', idx)} className="hover:text-white"><Trash2 size={12} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Input label="Sort Order (Angka)" name="sort_order" type="number" value={formData.sort_order} onChange={handleInputChange} className="bg-white/10 border-white/20 text-white w-32" />
              
              <div className="flex justify-end gap-3 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="border-white/30 text-white hover:bg-white/10">Batal</Button>
                <Button type="submit" disabled={loading} className="bg-brand-lime text-slate-900 font-bold">{loading ? 'Menyimpan...' : 'Simpan'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

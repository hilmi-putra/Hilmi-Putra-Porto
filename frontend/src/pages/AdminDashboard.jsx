import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Plus, Edit2, Trash2, LogOut, Loader2, MessageSquare, Briefcase, X, Shield, Route, Image as ImageIcon } from 'lucide-react';
import { JourneyTab } from '../components/admin/JourneyTab';
import { GalleryTab } from '../components/admin/GalleryTab';
import { FutureProjectsTab } from '../components/admin/FutureProjectsTab';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects'); // projects, journey, gallery
  const [loading, setLoading] = useState(true);
  const [isSandbox, setIsSandbox] = useState(() => localStorage.getItem('portfolio_sandbox_session') === 'true');

  const navigate = useNavigate();

  const loadData = useCallback(async (sandboxActive) => {
    setLoading(true);
    try {
      // Any sandbox initialization if needed
    } catch (err) {
      console.warn('Sandbox Mode Activated:', err.message);
      setIsSandbox(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadData(localStorage.getItem('portfolio_sandbox_session') === 'true');
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadData]);

  const handleLogout = async () => {
    if (isSandbox) {
      localStorage.removeItem('portfolio_sandbox_session');
    } else {
      await supabase.auth.signOut();
    }
    navigate('/admin/login');
  };



  return (
    <div className="w-full min-h-screen bg-brand-blue pt-32 pb-24 text-white grainy-overlay text-left">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-10">
        
        {/* Header Branding */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/20 pb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-brand-lime font-bold text-xs uppercase tracking-widest">
              {isSandbox ? (
                <div className="flex items-center gap-1 bg-brand-lime/20 px-2 py-0.5 rounded text-brand-lime">
                  <Shield size={12} /> Sandbox Sandbox Active
                </div>
              ) : (
                'Secured Admin Portal'
              )}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
            <p className="text-blue-100 text-sm font-light">
              Manage portfolio projects list and inspect client contact requests.
            </p>
          </div>

          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-2 self-start md:self-auto"
          >
            Sign Out <LogOut size={14} />
          </Button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all ${
              activeTab === 'projects' 
                ? 'bg-white text-text-dark font-bold' 
                : 'bg-white/5 text-blue-100 border border-white/10 hover:border-white hover:text-white'
            }`}
          >
            <Briefcase size={14} /> Future Projects
          </button>
          <button
            onClick={() => setActiveTab('journey')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all ${
              activeTab === 'journey' 
                ? 'bg-white text-text-dark font-bold' 
                : 'bg-white/5 text-blue-100 border border-white/10 hover:border-white hover:text-white'
            }`}
          >
            <Route size={14} /> Journey
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all ${
              activeTab === 'gallery' 
                ? 'bg-white text-text-dark font-bold' 
                : 'bg-white/5 text-blue-100 border border-white/10 hover:border-white hover:text-white'
            }`}
          >
            <ImageIcon size={14} /> Gallery
          </button>
        </div>

        {/* Dynamic Dashboard View Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 w-full">
            <Loader2 className="animate-spin text-brand-lime" size={40} />
            <span className="text-sm uppercase tracking-widest text-blue-100">Syncing Database...</span>
          </div>
        ) : activeTab === 'projects' ? (
          /* --- FUTURE PROJECTS TAB --- */
          <FutureProjectsTab />
        ) : activeTab === 'journey' ? (
          /* --- JOURNEY TAB --- */
          <JourneyTab />
        ) : activeTab === 'gallery' ? (
          /* --- GALLERY TAB --- */
          <GalleryTab />
        ) : null}

      </div>



    </div>
  );
};
export default AdminDashboard;

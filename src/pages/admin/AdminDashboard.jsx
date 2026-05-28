import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeAdminToken, getStoredAdmin } from '@/lib/api';
import AdminInfluencers from './AdminInfluencers';
import AdminKeywords from './AdminKeywords';
import AdminCreatorSubmissions from './AdminCreatorSubmissions';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('influencers');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  );
  const navigate = useNavigate();
  const admin = getStoredAdmin();

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleLogout = () => {
    removeAdminToken();
    navigate('/admin/login');
  };

  const selectTab = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-30 shadow-sm">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 text-black"
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-base font-bold text-black">Snappi Admin</h1>
        <div className="w-8" />
      </div>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-4 flex flex-col z-50 shadow-lg md:shadow-none transition-transform duration-200"
        style={{
          transform: isDesktop || sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-black">Snappi Admin</h1>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSidebarOpen(false);
            }}
            className="md:hidden p-2 -mr-2 text-black rounded hover:bg-gray-100 relative z-10"
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="space-y-2 flex-1">
          <button
            onClick={() => selectTab('influencers')}
            className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${
              activeTab === 'influencers'
                ? 'bg-blue-600 text-white'
                : 'text-black hover:bg-gray-100'
            }`}
          >
            Influencers
          </button>
          <button
            onClick={() => selectTab('keywords')}
            className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${
              activeTab === 'keywords'
                ? 'bg-blue-600 text-white'
                : 'text-black hover:bg-gray-100'
            }`}
          >
            Keywords
          </button>
          <button
            onClick={() => selectTab('creator-submissions')}
            className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${
              activeTab === 'creator-submissions'
                ? 'bg-blue-600 text-white'
                : 'text-black hover:bg-gray-100'
            }`}
          >
            Creator Submissions
          </button>
        </nav>

        {/* Profile & Logout */}
        <div className="border-t border-gray-200 pt-4 space-y-2">
          {admin && (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {admin.name ? admin.name.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-black truncate">{admin.name || 'Admin'}</p>
                <p className="text-xs text-black truncate">{admin.email || ''}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg transition text-black hover:bg-red-50 inline-flex items-center gap-2 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 pt-14 md:pt-0">
        {activeTab === 'influencers' && <AdminInfluencers />}
        {activeTab === 'keywords' && <AdminKeywords />}
        {activeTab === 'creator-submissions' && <AdminCreatorSubmissions />}
        {activeTab === 'users' && <div className="p-6"><h1 className="text-2xl font-bold text-black">Users Management</h1></div>}
        {activeTab === 'campaigns' && <div className="p-6"><h1 className="text-2xl font-bold text-black">Campaigns Management</h1></div>}
      </main>
    </div>
  );
};

export default AdminDashboard;

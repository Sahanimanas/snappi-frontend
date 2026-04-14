import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeAdminToken, getStoredAdmin } from '@/lib/api';
import AdminInfluencers from './AdminInfluencers';
import AdminKeywords from './AdminKeywords';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('influencers');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const admin = getStoredAdmin();

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
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-gray-900 text-white flex items-center justify-between px-4 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2"
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-base font-bold">Snappi Admin</h1>
        <div className="w-8" />
      </div>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-4 flex flex-col z-50 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold">Snappi Admin</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1"
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="space-y-2 flex-1">
          <button
            onClick={() => selectTab('influencers')}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'influencers' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
          >
            Influencers
          </button>
          <button
            onClick={() => selectTab('keywords')}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'keywords' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
          >
            Keywords
          </button>
        </nav>

        {/* Profile & Logout */}
        <div className="border-t border-gray-700 pt-4 space-y-3">
          {admin && (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                {admin.name ? admin.name.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{admin.name || 'Admin'}</p>
                <p className="text-xs text-gray-400 truncate">{admin.email || ''}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg transition text-red-400 hover:bg-red-900/30 hover:text-red-300 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 pt-14 lg:pt-0">
        {activeTab === 'influencers' && <AdminInfluencers />}
        {activeTab === 'keywords' && <AdminKeywords />}
        {activeTab === 'users' && <div className="p-6"><h1 className="text-2xl font-bold">Users Management</h1></div>}
        {activeTab === 'campaigns' && <div className="p-6"><h1 className="text-2xl font-bold">Campaigns Management</h1></div>}
      </div>
    </div>
  );
};

export default AdminDashboard;

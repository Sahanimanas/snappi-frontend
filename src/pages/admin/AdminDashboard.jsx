import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeAdminToken, getStoredAdmin } from '@/lib/api';
import AdminInfluencers from './AdminInfluencers';
import AdminKeywords from './AdminKeywords';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('influencers');
  const navigate = useNavigate();
  const admin = getStoredAdmin();

  const handleLogout = () => {
    removeAdminToken();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-4 flex flex-col">
        <h1 className="text-xl font-bold mb-8">Snappi Admin</h1>
        <nav className="space-y-2 flex-1">
          <button
            onClick={() => setActiveTab('influencers')}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'influencers' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
          >
            Influencers
          </button>
          <button
            onClick={() => setActiveTab('keywords')}
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
      <div className="ml-64">
        {activeTab === 'influencers' && <AdminInfluencers />}
        {activeTab === 'keywords' && <AdminKeywords />}
        {activeTab === 'users' && <div className="p-6"><h1 className="text-2xl font-bold">Users Management</h1></div>}
        {activeTab === 'campaigns' && <div className="p-6"><h1 className="text-2xl font-bold">Campaigns Management</h1></div>}
      </div>
    </div>
  );
};

export default AdminDashboard;
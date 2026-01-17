import React, { useState } from 'react';
import AdminInfluencers from './AdminInfluencers';
import AdminKeywords from './AdminKeywords';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('influencers');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-4">
        <h1 className="text-xl font-bold mb-8">Snappi Admin</h1>
        <nav className="space-y-2">
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
          {/* <button
            onClick={() => setActiveTab('users')}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'users' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'campaigns' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
          >
            Campaigns
          </button> */}
        </nav>
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
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfluencerForm from './InfluencerForm';
import BulkUpload from './BulkUpload';

const API_URL = import.meta.env.VITE_API_URL 
const AdminInfluencers = () => {
  const [influencers, setInfluencers] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [editingInfluencer, setEditingInfluencer] = useState(null);
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);

  const token = localStorage.getItem('adminToken');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchInfluencers();
    fetchKeywords();
    fetchStats();
  }, [page, search, platform]);

  const fetchInfluencers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.append('search', search);
      if (platform) params.append('platform', platform);
      
      const res = await axios.get(`${API_URL}/influencers?${params}`);
      setInfluencers(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching influencers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKeywords = async () => {
    try {
      const res = await axios.get(`${API_URL}/keywords/list`);
      setKeywords(res.data.data);
    } catch (error) {
      console.error('Error fetching keywords:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/influencers/admin/stats`, config);
      setStats(res.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this influencer?')) return;
    try {
      await axios.delete(`${API_URL}/influencers/${id}`, config);
      fetchInfluencers();
      fetchStats();
    } catch (error) {
      alert('Error deleting influencer');
    }
  };

  const handleEdit = (influencer) => {
    setEditingInfluencer(influencer);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingInfluencer(null);
    fetchInfluencers();
    fetchStats();
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">Influencer Management</h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowBulkUpload(true)}
              className="w-full sm:w-auto h-10 px-4 text-sm sm:text-base bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium inline-flex items-center justify-center"
            >
              Bulk Upload
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="w-full sm:w-auto h-10 px-4 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium inline-flex items-center justify-center"
            >
              + Add Influencer
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
              <p className="text-black text-xs sm:text-sm">Total Influencers</p>
              <p className="text-xl sm:text-2xl font-bold text-black">{stats.totalInfluencers}</p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
              <p className="text-black text-xs sm:text-sm">Verified</p>
              <p className="text-xl sm:text-2xl font-bold text-black">{stats.verifiedCount}</p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
              <p className="text-black text-xs sm:text-sm">Platforms</p>
              <p className="text-xl sm:text-2xl font-bold text-black">{stats.platformStats?.length || 0}</p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
              <p className="text-black text-xs sm:text-sm">Available</p>
              <p className="text-xl sm:text-2xl font-bold text-black">
                {stats.statusBreakdown?.find(s => s._id === 'available')?.count || 0}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-stretch sm:items-center">
            <input
              type="text"
              placeholder="Search influencers..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="flex-1 min-w-0 sm:min-w-[200px] h-10 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            <select
              value={platform}
              onChange={(e) => { setPlatform(e.target.value); setPage(1); }}
              className="h-10 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
            >
              <option value="">All Platforms</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="twitter">Twitter</option>
              <option value="facebook">Facebook</option>
              <option value="linkedin">LinkedIn</option>
            </select>
            <button
              onClick={() => { setSearch(''); setPlatform(''); setPage(1); }}
              className="h-10 px-4 bg-gray-200 text-black rounded-lg hover:bg-gray-300 font-medium inline-flex items-center justify-center"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Influencers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-black">Influencer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-black">Platforms</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-black">Followers</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-black">Engagement</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-black">Keywords</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-black">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-black">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {influencers.map((inf) => (
                  <tr key={inf._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={inf.profileImage || 'https://via.placeholder.com/40'}
                          alt={inf.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-black">{inf.name}</p>
                          <p className="text-sm text-black">{inf.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {inf.platforms?.map((p, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                          >
                            {p.platform}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-black">{formatNumber(inf.totalFollowers)}</td>
                    <td className="px-4 py-3 text-black">{inf.avgEngagement?.toFixed(1)}%</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap max-w-[150px]">
                        {inf.keywords?.slice(0, 3).map((k, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                          >
                            {k.displayName || k.name}
                          </span>
                        ))}
                        {inf.keywords?.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded">
                            +{inf.keywords.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded ${
                        inf.status === 'available' ? 'bg-green-100 text-green-700' :
                        inf.status === 'busy' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {inf.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(inf)}
                          className="h-8 px-3 text-sm bg-blue-100 text-black rounded hover:bg-blue-200 font-medium inline-flex items-center justify-center"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(inf._id)}
                          className="h-8 px-3 text-sm bg-red-100 text-black rounded hover:bg-red-200 font-medium inline-flex items-center justify-center"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-4 py-3 bg-gray-50">
            <p className="text-sm text-black text-center sm:text-left">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2 justify-center sm:justify-end">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-9 px-4 border rounded text-black font-medium disabled:opacity-50 inline-flex items-center justify-center"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-9 px-4 border rounded text-black font-medium disabled:opacity-50 inline-flex items-center justify-center"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <InfluencerForm
            influencer={editingInfluencer}
            keywords={keywords}
            onClose={handleFormClose}
          />
        )}

        {/* Bulk Upload Modal */}
        {showBulkUpload && (
          <BulkUpload
            onClose={() => { setShowBulkUpload(false); fetchInfluencers(); fetchStats(); }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminInfluencers;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BulkUploadKeywords from './BulkUploadKeywords';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const AdminKeywords = () => {
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState(null);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({ name: '', displayName: '', description: '', icon: '', color: '#6366f1', isActive: true });
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const token = localStorage.getItem('adminToken');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchKeywords();
    fetchStats();
  }, [search]);

  const fetchKeywords = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      const res = await axios.get(`${API_URL}/keywords?${params}`);
      setKeywords(res.data.data);
    } catch (error) {
      console.error('Error fetching keywords:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/keywords/admin/stats`, config);
      setStats(res.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingKeyword) {
        await axios.put(`${API_URL}/keywords/${editingKeyword._id}`, formData, config);
      } else {
        await axios.post(`${API_URL}/keywords`, formData, config);
      }
      setShowForm(false);
      setEditingKeyword(null);
      setFormData({ name: '', displayName: '', description: '', icon: '', color: '#6366f1', isActive: true });
      fetchKeywords();
      fetchStats();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving keyword');
    }
  };

  const handleEdit = (keyword) => {
    setEditingKeyword(keyword);
    setFormData({
      name: keyword.name,
      displayName: keyword.displayName,
      description: keyword.description || '',
      icon: keyword.icon || '',
      color: keyword.color || '#6366f1',
      isActive: keyword.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this keyword?')) return;
    try {
      await axios.delete(`${API_URL}/keywords/${id}`, config);
      fetchKeywords();
      fetchStats();
    } catch (error) {
      alert('Error deleting keyword');
    }
  };

  const handleToggleActive = async (keyword) => {
    try {
      await axios.put(`${API_URL}/keywords/${keyword._id}`, { isActive: !keyword.isActive }, config);
      fetchKeywords();
    } catch (error) {
      alert('Error updating keyword');
    }
  };

  const colors = ['#EF4444', '#F97316', '#F59E0B', '#84CC16', '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E'];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">Keywords Management</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                const csv = 'NAME,DISPLAY NAME,DESCRIPTION,ICON,COLOR,ACTIVE\nfitness,Fitness,Fitness and workout content,,#22C55E,true';
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'keywords_template.csv';
                a.click();
              }}
              className="w-full sm:w-auto h-10 px-4 bg-gray-200 text-black rounded-lg hover:bg-gray-300 text-sm sm:text-base font-medium inline-flex items-center justify-center"
            >
              Download Template
            </button>
            <button
              onClick={() => setShowBulkUpload(true)}
              className="w-full sm:w-auto h-10 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base font-medium inline-flex items-center justify-center"
            >
              Bulk Upload
            </button>
            <button
              onClick={() => { setShowForm(true); setEditingKeyword(null); setFormData({ name: '', displayName: '', description: '', icon: '', color: '#6366f1', isActive: true }); }}
              className="w-full sm:w-auto h-10 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base font-medium inline-flex items-center justify-center"
            >
              + Add Keyword
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-black text-sm">Total Keywords</p>
              <p className="text-2xl font-bold text-black">{stats.totalKeywords}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-black text-sm">Active Keywords</p>
              <p className="text-2xl font-bold text-black">{stats.activeKeywords}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-black text-sm">Total Assignments</p>
              <p className="text-2xl font-bold text-black">{stats.totalAssignments}</p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <input
            type="text"
            placeholder="Search keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        {/* Keywords Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-8">Loading...</div>
          ) : keywords.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">No keywords found</div>
          ) : (
            keywords.map((keyword) => (
              <div key={keyword._id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                      style={{ backgroundColor: keyword.color || '#6366f1' }}
                    >
                      {keyword.icon || keyword.displayName?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-black truncate">{keyword.displayName}</h3>
                      <p className="text-sm text-black truncate">#{keyword.name}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded font-medium text-black ${keyword.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                      {keyword.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {keyword.description && (
                    <p className="text-sm text-black mb-3">{keyword.description}</p>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <span className="text-sm text-black">
                      {keyword.influencerCount || 0} influencers
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleToggleActive(keyword)}
                        className={`h-8 px-3 text-xs rounded font-medium text-black inline-flex items-center justify-center ${keyword.isActive ? 'bg-yellow-100 hover:bg-yellow-200' : 'bg-green-100 hover:bg-green-200'}`}
                      >
                        {keyword.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleEdit(keyword)}
                        className="h-8 px-3 text-xs bg-blue-100 text-black rounded font-medium hover:bg-blue-200 inline-flex items-center justify-center"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(keyword._id)}
                        className="h-8 px-3 text-xs bg-red-100 text-black rounded font-medium hover:bg-red-200 inline-flex items-center justify-center"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md">
              <div className="border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">{editingKeyword ? 'Edit Keyword' : 'Add Keyword'}</h2>
                <button onClick={() => { setShowForm(false); setEditingKeyword(null); }} className="text-gray-500 text-2xl">&times;</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                    required
                    placeholder="e.g., fashion"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Name *</label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    required
                    placeholder="e.g., Fashion"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji or text)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="e.g., 👗 or shirt"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: c })}
                        className={`w-8 h-8 rounded-full border-2 ${formData.color === c ? 'border-gray-800' : 'border-transparent'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Active</span>
                </label>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => { setShowForm(false); setEditingKeyword(null); }} className="px-4 py-2 border rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {editingKeyword ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showBulkUpload && (
          <BulkUploadKeywords
            onClose={() => { setShowBulkUpload(false); fetchKeywords(); fetchStats(); }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminKeywords;
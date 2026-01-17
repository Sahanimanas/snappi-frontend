import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const AdminKeywords = () => {
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState(null);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({ name: '', displayName: '', description: '', icon: '', color: '#6366f1', isActive: true });

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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Keywords Management</h1>
          <button
            onClick={() => { setShowForm(true); setEditingKeyword(null); setFormData({ name: '', displayName: '', description: '', icon: '', color: '#6366f1', isActive: true }); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Add Keyword
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-500 text-sm">Total Keywords</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalKeywords}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-500 text-sm">Active Keywords</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeKeywords}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-500 text-sm">Total Assignments</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalAssignments}</p>
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
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{keyword.displayName}</h3>
                      <p className="text-sm text-gray-500">#{keyword.name}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${keyword.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {keyword.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {keyword.description && (
                    <p className="text-sm text-gray-600 mb-3">{keyword.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {keyword.influencerCount || 0} influencers
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleActive(keyword)}
                        className={`px-3 py-1 text-xs rounded ${keyword.isActive ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}
                      >
                        {keyword.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleEdit(keyword)}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(keyword._id)}
                        className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded"
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
      </div>
    </div>
  );
};

export default AdminKeywords;
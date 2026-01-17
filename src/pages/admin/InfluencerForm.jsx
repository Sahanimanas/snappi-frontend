import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const InfluencerForm = ({ influencer, keywords, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profileImage: '',
    bio: '',
    status: 'available',
    isVerified: false,
    isFeatured: false,
    location: { country: '', city: '', state: '' },
    languages: [],
    contactInfo: { phone: '', whatsapp: '', email: '', preferredContact: 'email' },
    platforms: [{ platform: 'instagram', username: '', profileUrl: '', followers: 0, engagement: 0, pricing: {} }],
    keywordIds: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [languageInput, setLanguageInput] = useState('');

  const token = localStorage.getItem('adminToken');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (influencer) {
      setFormData({
        name: influencer.name || '',
        email: influencer.email || '',
        profileImage: influencer.profileImage || '',
        bio: influencer.bio || '',
        status: influencer.status || 'available',
        isVerified: influencer.isVerified || false,
        isFeatured: influencer.isFeatured || false,
        location: influencer.location || { country: '', city: '', state: '' },
        languages: influencer.languages || [],
        contactInfo: influencer.contactInfo || { phone: '', whatsapp: '', email: '', preferredContact: 'email' },
        platforms: influencer.platforms?.length > 0 ? influencer.platforms : [{ platform: 'instagram', username: '', profileUrl: '', followers: 0, engagement: 0, pricing: {} }],
        keywordIds: influencer.keywords?.map(k => k._id || k) || []
      });
    }
  }, [influencer]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handlePlatformChange = (index, field, value) => {
    const updated = [...formData.platforms];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updated[index][parent] = { ...updated[index][parent], [child]: value };
    } else {
      updated[index][field] = value;
    }
    setFormData(prev => ({ ...prev, platforms: updated }));
  };

  const addPlatform = () => {
    setFormData(prev => ({
      ...prev,
      platforms: [...prev.platforms, { platform: 'instagram', username: '', profileUrl: '', followers: 0, engagement: 0, pricing: {} }]
    }));
  };

  const removePlatform = (index) => {
    if (formData.platforms.length <= 1) return alert('At least one platform required');
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.filter((_, i) => i !== index)
    }));
  };

  const addLanguage = () => {
    if (languageInput.trim() && !formData.languages.includes(languageInput.trim())) {
      setFormData(prev => ({ ...prev, languages: [...prev.languages, languageInput.trim()] }));
      setLanguageInput('');
    }
  };

  const removeLanguage = (lang) => {
    setFormData(prev => ({ ...prev, languages: prev.languages.filter(l => l !== lang) }));
  };

  const handleKeywordToggle = (keywordId) => {
    setFormData(prev => ({
      ...prev,
      keywordIds: prev.keywordIds.includes(keywordId)
        ? prev.keywordIds.filter(id => id !== keywordId)
        : [...prev.keywordIds, keywordId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        platforms: formData.platforms.map(p => ({
          ...p,
          followers: parseInt(p.followers) || 0,
          engagement: parseFloat(p.engagement) || 0
        }))
      };

      if (influencer) {
        await axios.put(`${API_URL}/influencers/${influencer._id}`, payload, config);
      } else {
        await axios.post(`${API_URL}/influencers`, payload, config);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving influencer');
    } finally {
      setLoading(false);
    }
  };

  const platformOptions = ['instagram', 'youtube', 'tiktok', 'twitter', 'facebook', 'linkedin', 'pinterest', 'snapchat', 'twitch'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">{influencer ? 'Edit Influencer' : 'Add Influencer'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
              <input
                type="url"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isVerified" checked={formData.isVerified} onChange={handleChange} className="rounded" />
              <span className="text-sm">Verified</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="rounded" />
              <span className="text-sm">Featured</span>
            </label>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <div className="grid grid-cols-3 gap-4">
              <input type="text" name="location.country" value={formData.location.country} onChange={handleChange} placeholder="Country" className="px-3 py-2 border rounded-lg" />
              <input type="text" name="location.city" value={formData.location.city} onChange={handleChange} placeholder="City" className="px-3 py-2 border rounded-lg" />
              <input type="text" name="location.state" value={formData.location.state} onChange={handleChange} placeholder="State" className="px-3 py-2 border rounded-lg" />
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                placeholder="Add language"
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <button type="button" onClick={addLanguage} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.languages.map((lang, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-2">
                  {lang}
                  <button type="button" onClick={() => removeLanguage(lang)} className="text-red-500">&times;</button>
                </span>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Information</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <input type="text" name="contactInfo.phone" value={formData.contactInfo.phone} onChange={handleChange} placeholder="Phone" className="px-3 py-2 border rounded-lg" />
              <input type="text" name="contactInfo.whatsapp" value={formData.contactInfo.whatsapp} onChange={handleChange} placeholder="WhatsApp" className="px-3 py-2 border rounded-lg" />
              <input type="email" name="contactInfo.email" value={formData.contactInfo.email} onChange={handleChange} placeholder="Contact Email" className="px-3 py-2 border rounded-lg" />
              <select name="contactInfo.preferredContact" value={formData.contactInfo.preferredContact} onChange={handleChange} className="px-3 py-2 border rounded-lg">
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="platform">Platform DM</option>
              </select>
            </div>
          </div>

          {/* Platforms */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Platforms *</label>
              <button type="button" onClick={addPlatform} className="text-sm text-blue-600 hover:text-blue-800">+ Add Platform</button>
            </div>
            <div className="space-y-4">
              {formData.platforms.map((plat, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">Platform {index + 1}</span>
                    {formData.platforms.length > 1 && (
                      <button type="button" onClick={() => removePlatform(index)} className="text-red-500 text-sm">Remove</button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <select
                      value={plat.platform}
                      onChange={(e) => handlePlatformChange(index, 'platform', e.target.value)}
                      className="px-3 py-2 border rounded-lg"
                    >
                      {platformOptions.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                    </select>
                    <input
                      type="text"
                      value={plat.username}
                      onChange={(e) => handlePlatformChange(index, 'username', e.target.value)}
                      placeholder="Username *"
                      required
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="url"
                      value={plat.profileUrl}
                      onChange={(e) => handlePlatformChange(index, 'profileUrl', e.target.value)}
                      placeholder="Profile URL *"
                      required
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="number"
                      value={plat.followers}
                      onChange={(e) => handlePlatformChange(index, 'followers', e.target.value)}
                      placeholder="Followers *"
                      required
                      min="0"
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="number"
                      value={plat.engagement}
                      onChange={(e) => handlePlatformChange(index, 'engagement', e.target.value)}
                      placeholder="Engagement % *"
                      required
                      min="0"
                      max="100"
                      step="0.1"
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="number"
                      value={plat.avgViews || ''}
                      onChange={(e) => handlePlatformChange(index, 'avgViews', e.target.value)}
                      placeholder="Avg Views"
                      min="0"
                      className="px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-3">
                    <input type="number" value={plat.pricing?.post || ''} onChange={(e) => handlePlatformChange(index, 'pricing.post', e.target.value)} placeholder="Post $" className="px-3 py-2 border rounded-lg text-sm" />
                    <input type="number" value={plat.pricing?.story || ''} onChange={(e) => handlePlatformChange(index, 'pricing.story', e.target.value)} placeholder="Story $" className="px-3 py-2 border rounded-lg text-sm" />
                    <input type="number" value={plat.pricing?.video || ''} onChange={(e) => handlePlatformChange(index, 'pricing.video', e.target.value)} placeholder="Video $" className="px-3 py-2 border rounded-lg text-sm" />
                    <input type="number" value={plat.pricing?.reel || ''} onChange={(e) => handlePlatformChange(index, 'pricing.reel', e.target.value)} placeholder="Reel $" className="px-3 py-2 border rounded-lg text-sm" />
                    <input type="number" value={plat.pricing?.short || ''} onChange={(e) => handlePlatformChange(index, 'pricing.short', e.target.value)} placeholder="Short $" className="px-3 py-2 border rounded-lg text-sm" />
                    <input type="number" value={plat.pricing?.live || ''} onChange={(e) => handlePlatformChange(index, 'pricing.live', e.target.value)} placeholder="Live $" className="px-3 py-2 border rounded-lg text-sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
            <div className="flex flex-wrap gap-2 p-4 border rounded-lg max-h-40 overflow-y-auto">
              {keywords.map((kw) => (
                <button
                  key={kw._id}
                  type="button"
                  onClick={() => handleKeywordToggle(kw._id)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    formData.keywordIds.includes(kw._id)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {kw.displayName}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Saving...' : (influencer ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InfluencerForm;
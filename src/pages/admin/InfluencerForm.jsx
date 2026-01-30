import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Linkedin,
  Music2,
  Camera,
  Twitch,
  Ghost,
  Globe,
  X,
  Plus,
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  Languages,
  DollarSign,
  Users,
  TrendingUp,
  Eye,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  Check,
  Loader2,
  AlertCircle,
  Star,
  BadgeCheck,
  MessageCircle,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

// Platform configuration with icons and colors
const platformConfig = {
  instagram: { 
    icon: Instagram, 
    color: 'from-purple-500 to-pink-500', 
    bgColor: 'bg-gradient-to-br from-purple-500 to-pink-500',
    lightBg: 'bg-purple-50 border-purple-200',
    textColor: 'text-purple-600'
  },
  youtube: { 
    icon: Youtube, 
    color: 'from-red-500 to-red-600', 
    bgColor: 'bg-red-500',
    lightBg: 'bg-red-50 border-red-200',
    textColor: 'text-red-600'
  },
  tiktok: { 
    icon: Music2, 
    color: 'from-gray-900 to-gray-800', 
    bgColor: 'bg-black',
    lightBg: 'bg-gray-50 border-gray-300',
    textColor: 'text-gray-900'
  },
  twitter: { 
    icon: Twitter, 
    color: 'from-blue-400 to-blue-500', 
    bgColor: 'bg-blue-400',
    lightBg: 'bg-blue-50 border-blue-200',
    textColor: 'text-blue-500'
  },
  facebook: { 
    icon: Facebook, 
    color: 'from-blue-600 to-blue-700', 
    bgColor: 'bg-blue-600',
    lightBg: 'bg-blue-50 border-blue-200',
    textColor: 'text-blue-600'
  },
  linkedin: { 
    icon: Linkedin, 
    color: 'from-blue-700 to-blue-800', 
    bgColor: 'bg-blue-700',
    lightBg: 'bg-blue-50 border-blue-200',
    textColor: 'text-blue-700'
  },
  pinterest: { 
    icon: Camera, 
    color: 'from-red-600 to-red-700', 
    bgColor: 'bg-red-600',
    lightBg: 'bg-red-50 border-red-200',
    textColor: 'text-red-600'
  },
  snapchat: { 
    icon: Ghost, 
    color: 'from-yellow-400 to-yellow-500', 
    bgColor: 'bg-yellow-400',
    lightBg: 'bg-yellow-50 border-yellow-200',
    textColor: 'text-yellow-600'
  },
  twitch: { 
    icon: Twitch, 
    color: 'from-purple-600 to-purple-700', 
    bgColor: 'bg-purple-600',
    lightBg: 'bg-purple-50 border-purple-200',
    textColor: 'text-purple-600'
  },
};

const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

// Section Header Component
const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="p-2 rounded-lg bg-blue-50">
      <Icon className="h-5 w-5 text-blue-600" />
    </div>
    <div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  </div>
);

// Input Field Component
const InputField = ({ label, icon: Icon, required, ...props }) => (
  <div className="space-y-1.5">
    {label && (
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      )}
      <input
        {...props}
        className={`w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
          Icon ? 'pl-10' : ''
        } ${props.className || ''}`}
      />
    </div>
  </div>
);

// Platform Card Component
const PlatformCard = ({ platform, index, onUpdate, onRemove, canRemove }) => {
  const [expanded, setExpanded] = useState(true);
  const config = platformConfig[platform.platform] || platformConfig.instagram;
  const Icon = config.icon;

  const pricingFields = [
    { key: 'post', label: 'Post' },
    { key: 'story', label: 'Story' },
    { key: 'video', label: 'Video' },
    { key: 'reel', label: 'Reel' },
    { key: 'short', label: 'Short' },
    { key: 'live', label: 'Live' },
  ];

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${config.lightBg}`}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${config.bgColor} text-white`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 capitalize">{platform.platform}</span>
              {platform.username && (
                <span className="text-sm text-gray-500">@{platform.username}</span>
              )}
            </div>
            {platform.followers > 0 && (
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {formatNumber(platform.followers)} followers
                </span>
                {platform.engagement > 0 && (
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {platform.engagement}% engagement
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Content */}
      {expanded && (
        <div className="p-4 pt-0 space-y-4 bg-white/50">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Platform</label>
              <select
                value={platform.platform}
                onChange={(e) => onUpdate('platform', e.target.value)}
                className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${config.textColor} font-medium`}
              >
                {Object.keys(platformConfig).map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <InputField
              label="Username"
              placeholder="@username"
              value={platform.username}
              onChange={(e) => onUpdate('username', e.target.value)}
              required
            />
            <InputField
              label="Profile URL"
              icon={LinkIcon}
              placeholder="https://..."
              value={platform.profileUrl}
              onChange={(e) => onUpdate('profileUrl', e.target.value)}
              required
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                Followers
              </label>
              <input
                type="number"
                value={platform.followers}
                onChange={(e) => onUpdate('followers', e.target.value)}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-400" />
                Engagement Rate (%)
              </label>
              <input
                type="number"
                value={platform.engagement}
                onChange={(e) => onUpdate('engagement', e.target.value)}
                placeholder="0.0"
                min="0"
                max="100"
                step="0.1"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Eye className="h-4 w-4 text-gray-400" />
                Average Views
              </label>
              <input
                type="number"
                value={platform.avgViews || ''}
                onChange={(e) => onUpdate('avgViews', e.target.value)}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              Pricing (USD)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {pricingFields.map((field) => (
                <div key={field.key} className="space-y-1">
                  <label className="text-xs text-gray-500">{field.label}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      value={platform.pricing?.[field.key] || ''}
                      onChange={(e) => onUpdate(`pricing.${field.key}`, e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
    platforms: [{ platform: 'instagram', username: '', profileUrl: '', followers: 0, engagement: 0, avgViews: 0, pricing: {} }],
    keywordIds: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [languageInput, setLanguageInput] = useState('');
  const [activeSection, setActiveSection] = useState('basic');

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
        platforms: influencer.platforms?.length > 0 ? influencer.platforms : [{ platform: 'instagram', username: '', profileUrl: '', followers: 0, engagement: 0, avgViews: 0, pricing: {} }],
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
      platforms: [...prev.platforms, { platform: 'instagram', username: '', profileUrl: '', followers: 0, engagement: 0, avgViews: 0, pricing: {} }]
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
          engagement: parseFloat(p.engagement) || 0,
          avgViews: parseInt(p.avgViews) || 0
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

  const commonLanguages = ['English', 'Spanish', 'French', 'German', 'Hindi', 'Mandarin', 'Arabic', 'Portuguese', 'Japanese', 'Korean'];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
        {/* Header - Fixed */}
        <div className="flex-shrink-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {influencer ? 'Edit Influencer' : 'Add New Influencer'}
              </h2>
              <p className="text-sm text-gray-500">
                {influencer ? 'Update influencer details' : 'Create a new influencer profile'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Basic Information */}
            <section className="space-y-4">
              <SectionHeader 
                icon={User} 
                title="Basic Information" 
                subtitle="Personal details and profile"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Full Name"
                  icon={User}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
                <InputField
                  label="Email Address"
                  icon={Mail}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Profile Image URL"
                  icon={LinkIcon}
                  type="url"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleChange}
                  placeholder="https://..."
                />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="available">🟢 Available</option>
                    <option value="busy">🟡 Busy</option>
                    <option value="unavailable">🔴 Unavailable</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  maxLength={500}
                  placeholder="Write a short bio about the influencer..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <p className="text-xs text-gray-400 text-right">{formData.bio.length}/500</p>
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input 
                    type="checkbox" 
                    name="isVerified" 
                    checked={formData.isVerified} 
                    onChange={handleChange} 
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Verified</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input 
                    type="checkbox" 
                    name="isFeatured" 
                    checked={formData.isFeatured} 
                    onChange={handleChange} 
                    className="w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                  />
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">Featured</span>
                  </div>
                </label>
              </div>
            </section>

            {/* Location */}
            <section className="space-y-4">
              <SectionHeader 
                icon={MapPin} 
                title="Location" 
                subtitle="Where is the influencer based?"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Country"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleChange}
                  placeholder="United States"
                />
                <InputField
                  label="State/Province"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  placeholder="California"
                />
                <InputField
                  label="City"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  placeholder="Los Angeles"
                />
              </div>
            </section>

            {/* Languages */}
            <section className="space-y-4">
              <SectionHeader 
                icon={Languages} 
                title="Languages" 
                subtitle="What languages does the influencer speak?"
              />
              
              <div className="flex flex-wrap gap-2 mb-3">
                {commonLanguages.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      if (!formData.languages.includes(lang)) {
                        setFormData(prev => ({ ...prev, languages: [...prev.languages, lang] }));
                      }
                    }}
                    disabled={formData.languages.includes(lang)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      formData.languages.includes(lang)
                        ? 'bg-blue-100 text-blue-700 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                  placeholder="Add custom language"
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="button" 
                  onClick={addLanguage} 
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>

              {formData.languages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.languages.map((lang, i) => (
                    <span 
                      key={i} 
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full"
                    >
                      {lang}
                      <button 
                        type="button" 
                        onClick={() => removeLanguage(lang)} 
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Contact Information */}
            <section className="space-y-4">
              <SectionHeader 
                icon={Phone} 
                title="Contact Information" 
                subtitle="How to reach the influencer"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Phone Number"
                  icon={Phone}
                  name="contactInfo.phone"
                  value={formData.contactInfo.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                />
                <InputField
                  label="WhatsApp"
                  icon={MessageCircle}
                  name="contactInfo.whatsapp"
                  value={formData.contactInfo.whatsapp}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                />
                <InputField
                  label="Contact Email"
                  icon={Mail}
                  type="email"
                  name="contactInfo.email"
                  value={formData.contactInfo.email}
                  onChange={handleChange}
                  placeholder="contact@influencer.com"
                />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Preferred Contact</label>
                  <select 
                    name="contactInfo.preferredContact" 
                    value={formData.contactInfo.preferredContact} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="email">📧 Email</option>
                    <option value="phone">📞 Phone</option>
                    <option value="whatsapp">💬 WhatsApp</option>
                    <option value="platform">📱 Platform DM</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Social Media Platforms */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <SectionHeader 
                  icon={Globe} 
                  title="Social Media Platforms" 
                  subtitle="Add the influencer's social media accounts"
                />
                <button
                  type="button"
                  onClick={addPlatform}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Platform
                </button>
              </div>

              <div className="space-y-4">
                {formData.platforms.map((platform, index) => (
                  <PlatformCard
                    key={index}
                    platform={platform}
                    index={index}
                    onUpdate={(field, value) => handlePlatformChange(index, field, value)}
                    onRemove={() => removePlatform(index)}
                    canRemove={formData.platforms.length > 1}
                  />
                ))}
              </div>
            </section>

            {/* Keywords/Categories */}
            {keywords && keywords.length > 0 && (
              <section className="space-y-4">
                <SectionHeader 
                  icon={Star} 
                  title="Categories & Keywords" 
                  subtitle="Select relevant categories for the influencer"
                />
                
                <div className="flex flex-wrap gap-2 p-4 border border-gray-200 rounded-xl max-h-48 overflow-y-auto bg-gray-50">
                  {keywords.map((kw) => (
                    <button
                      key={kw._id}
                      type="button"
                      onClick={() => handleKeywordToggle(kw._id)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.keywordIds.includes(kw._id)
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {formData.keywordIds.includes(kw._id) && (
                        <Check className="h-4 w-4" />
                      )}
                      {kw.displayName}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  {formData.keywordIds.length} categories selected
                </p>
              </section>
            )}
          </div>

          {/* Footer - Fixed */}
          <div className="flex-shrink-0 bg-white border-t px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  {influencer ? 'Update Influencer' : 'Create Influencer'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InfluencerForm;
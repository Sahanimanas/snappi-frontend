import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const BulkUpload = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState('');
  const [uploadType, setUploadType] = useState('file');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const token = localStorage.getItem('adminToken');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const sampleData = [
    {
      name: "Sample Influencer",
      email: "sample@email.com",
      platforms: [
        { platform: "instagram", username: "sampleuser", profileUrl: "https://instagram.com/sampleuser", followers: 100000, engagement: 4.5 }
      ],
      keywordIds: [],
      location: { country: "USA", city: "Los Angeles" },
      status: "available"
    }
  ];

  const sampleCsvHeaders = 'NAME,EMAIL,PLATFORM,PLATFORM USERNAME,PORTFOLIO URL/INSTAGRAM,INSTAGRAM URL,FACEBOOK URL,FOLLOWERS,ENGAGEMENT RATE,COUNTRY,CITY,STATE,NICHE,VERIFIED,TIKTOK URL,YOUTUBE URL';
  const sampleCsvRow = 'Sunny Leone,connect@suncityent.com,Instagram,sunnyleone,https://instagram.com/sunnyleone,https://instagram.com/sunnyleone,https://www.facebook.com/sunnyleone,55875401,United States of America,Mesa,,Lifestyle,true,,https://youtube.com/channel/xyz';

  // Parse CSV handling quoted fields
  const parseCsvLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  // Normalize header names to a known key
  const normalizeHeader = (h) => {
    const s = h.toLowerCase().replace(/[^a-z0-9]/g, '');
    const map = {
      'name': 'name',
      'email': 'email',
      'platform': 'platform',
      'platformusername': 'username',
      'username': 'username',
      'portfoliourlinstagram': 'portfolioUrl',
      'portfoliourl': 'portfolioUrl',
      'profileurl': 'portfolioUrl',
      'instagramurl': 'instagramUrl',
      'facebookurl': 'facebookUrl',
      'tiktokurl': 'tiktokUrl',
      'youtubeurl': 'youtubeUrl',
      'twitterurl': 'twitterUrl',
      'linkedinurl': 'linkedinUrl',
      'followers': 'followers',
      'followerscount': 'followers',
      'engagementrate': 'engagement',
      'engagement': 'engagement',
      'country': 'country',
      'city': 'city',
      'state': 'state',
      'niche': 'niche',
      'verified': 'verified',
      'isverified': 'verified',
      'status': 'status',
      'bio': 'bio',
      'profileimage': 'profileImage',
      'phone': 'phone',
      'whatsapp': 'whatsapp',
    };
    return map[s] || s;
  };

  // Extract username from a URL
  const extractUsername = (url) => {
    if (!url) return '';
    try {
      const u = new URL(url);
      const parts = u.pathname.split('/').filter(Boolean);
      return parts[parts.length - 1] || '';
    } catch {
      return url;
    }
  };

  // Parse follower count strings like "55.8M", "120K", "55875401"
  const parseFollowers = (val) => {
    if (!val) return 0;
    const s = String(val).trim().toUpperCase();
    const num = parseFloat(s);
    if (isNaN(num)) return 0;
    if (s.endsWith('M')) return Math.round(num * 1000000);
    if (s.endsWith('K')) return Math.round(num * 1000);
    return Math.round(num);
  };

  const csvToJson = (csv) => {
    const lines = csv.split('\n').filter(line => line.trim());
    if (lines.length < 2) return '[]';

    const rawHeaders = parseCsvLine(lines[0]);
    const headers = rawHeaders.map(normalizeHeader);
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      if (values.length < 2) continue;

      const get = (key) => {
        const idx = headers.indexOf(key);
        return idx >= 0 ? (values[idx] || '').trim() : '';
      };

      const name = get('name');
      if (!name) continue;

      // Build platforms from all URL columns
      const platforms = [];

      const addPlatform = (platformName, url, username, followers, engagement) => {
        if (!url && !username) return;
        const uname = username || extractUsername(url);
        if (!uname) return;
        platforms.push({
          platform: platformName,
          username: uname,
          profileUrl: url || `https://${platformName}.com/${uname}`,
          followers: followers || parseFollowers(get('followers')),
          engagement: engagement || parseFloat(get('engagement')) || 0,
        });
      };

      // Primary platform from PLATFORM column
      const primaryPlatform = (get('platform') || 'instagram').toLowerCase();
      const primaryUsername = get('username');
      const primaryUrl = get('portfolioUrl');
      const followers = parseFollowers(get('followers'));
      const engagement = parseFloat(get('engagement')) || 0;

      // Instagram
      const igUrl = get('instagramUrl') || (primaryPlatform === 'instagram' ? primaryUrl : '');
      const igUsername = primaryPlatform === 'instagram' ? primaryUsername : extractUsername(get('instagramUrl'));
      if (igUrl || igUsername) {
        addPlatform('instagram', igUrl, igUsername, followers, engagement);
      }

      // Facebook
      const fbUrl = get('facebookUrl');
      if (fbUrl) {
        addPlatform('facebook', fbUrl, extractUsername(fbUrl), 0, 0);
      }

      // TikTok
      const ttUrl = get('tiktokUrl');
      if (ttUrl) {
        addPlatform('tiktok', ttUrl, extractUsername(ttUrl), 0, 0);
      }

      // YouTube
      const ytUrl = get('youtubeUrl');
      if (ytUrl) {
        addPlatform('youtube', ytUrl, extractUsername(ytUrl), 0, 0);
      }

      // Twitter
      const twUrl = get('twitterUrl');
      if (twUrl) {
        addPlatform('twitter', twUrl, extractUsername(twUrl), 0, 0);
      }

      // LinkedIn
      const liUrl = get('linkedinUrl');
      if (liUrl) {
        addPlatform('linkedin', liUrl, extractUsername(liUrl), 0, 0);
      }

      // If no platform was added from URLs, use the primary platform column
      if (platforms.length === 0 && primaryUsername) {
        addPlatform(primaryPlatform, primaryUrl || `https://${primaryPlatform}.com/${primaryUsername}`, primaryUsername, followers, engagement);
      }

      // If still no platforms, skip this row
      if (platforms.length === 0) continue;

      const obj = {
        name,
        email: get('email') || undefined,
        profileImage: get('profileImage') || undefined,
        platforms,
        location: {
          country: get('country') || undefined,
          city: get('city') || undefined,
          state: get('state') || undefined,
        },
        bio: get('bio') || undefined,
        isVerified: ['true', 'yes', '1'].includes(get('verified').toLowerCase()),
        status: 'available',
      };

      // Add niche as a note (keywords need IDs, so store as bio/note if no bio)
      const niche = get('niche');
      if (niche && !obj.bio) {
        obj.bio = niche;
      }

      // Contact info
      const phone = get('phone');
      const whatsapp = get('whatsapp');
      if (phone || whatsapp || get('email')) {
        obj.contactInfo = {
          email: get('email') || undefined,
          phone: phone || undefined,
          whatsapp: whatsapp || undefined,
        };
      }

      // Clean undefined values from location
      Object.keys(obj.location).forEach(k => {
        if (!obj.location[k]) delete obj.location[k];
      });

      result.push(obj);
    }

    return JSON.stringify(result, null, 2);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          if (selectedFile.name.endsWith('.csv')) {
            setJsonData(csvToJson(event.target.result));
          } else {
            setJsonData(event.target.result);
          }
        } catch (err) {
          setError('Error reading file: ' + err.message);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      let data;
      try {
        data = JSON.parse(jsonData);
      } catch (e) {
        throw new Error('Invalid JSON format');
      }

      if (!Array.isArray(data)) {
        throw new Error('Data must be an array of influencers');
      }

      const uploadResults = { success: [], failed: [] };

      for (const influencer of data) {
        try {
          await axios.post(`${API_URL}/influencers`, influencer, config);
          uploadResults.success.push(influencer.name);
        } catch (err) {
          uploadResults.failed.push({
            name: influencer.name,
            error: err.response?.data?.message || 'Unknown error'
          });
        }
      }

      setResults(uploadResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadSample = () => {
    const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_influencers.json';
    a.click();
  };

  const downloadCsvSample = () => {
    const csv = sampleCsvHeaders + '\n' + sampleCsvRow;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_influencers.csv';
    a.click();
  };

  const downloadErrorReport = () => {
    if (!results || results.failed.length === 0) return;
    const lines = ['NAME,ERROR'];
    results.failed.forEach((f) => {
      const name = (f.name || 'Unknown').replace(/"/g, '""');
      const error = (f.error || 'Unknown error').replace(/"/g, '""');
      lines.push(`"${name}","${error}"`);
    });
    const csv = lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `upload_errors_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-black">Bulk Upload Influencers</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Supported Columns */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-black mb-2">Supported CSV Columns:</p>
            <p className="text-xs text-black leading-relaxed">
              NAME, EMAIL, PLATFORM, PLATFORM USERNAME, PORTFOLIO URL/INSTAGRAM, INSTAGRAM URL, FACEBOOK URL, TIKTOK URL, YOUTUBE URL, TWITTER URL, LINKEDIN URL, FOLLOWERS, ENGAGEMENT RATE, COUNTRY, CITY, STATE, NICHE, VERIFIED, STATUS, BIO, PHONE, WHATSAPP, PROFILE IMAGE
            </p>
          </div>

          {/* Download Samples */}
          <div className="flex gap-3">
            <button onClick={downloadSample} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm text-black">
              Download JSON Sample
            </button>
            <button onClick={downloadCsvSample} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm text-black">
              Download CSV Sample
            </button>
          </div>

          {/* Upload Type */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-black">
              <input type="radio" name="uploadType" value="file" checked={uploadType === 'file'} onChange={(e) => setUploadType(e.target.value)} />
              <span>Upload File</span>
            </label>
            <label className="flex items-center gap-2 text-black">
              <input type="radio" name="uploadType" value="json" checked={uploadType === 'json'} onChange={(e) => setUploadType(e.target.value)} />
              <span>Paste JSON</span>
            </label>
          </div>

          {/* File Upload */}
          {uploadType === 'file' && (
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".json,.csv"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
              />
              <label htmlFor="fileInput" className="cursor-pointer">
                <div className="text-black">
                  <p className="text-lg mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm">JSON or CSV file</p>
                </div>
              </label>
              {file && <p className="mt-3 text-blue-600 font-medium">{file.name}</p>}
            </div>
          )}

          {/* JSON Input */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              JSON Data {uploadType === 'file' && '(Preview)'}
            </label>
            <textarea
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              rows={10}
              placeholder={JSON.stringify(sampleData, null, 2)}
              className="w-full px-3 py-2 border rounded-lg font-mono text-xs text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error */}
          {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

          {/* Results */}
          {results && (
            <div className="space-y-3">
              <div className="bg-green-100 text-green-700 p-3 rounded">
                <p className="font-medium">Uploaded: {results.success.length} of {results.success.length + results.failed.length}</p>
              </div>
              {results.failed.length > 0 && (
                <div className="bg-red-50 border border-red-200 p-4 rounded flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-700">Failed: {results.failed.length} records</p>
                    <p className="text-sm text-red-600 mt-1">Download the error report to see details.</p>
                  </div>
                  <button
                    onClick={downloadErrorReport}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium flex-shrink-0"
                  >
                    Download Error Report
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={onClose} className="px-6 py-2 border rounded-lg hover:bg-gray-50 text-black">Close</button>
            <button
              onClick={handleSubmit}
              disabled={loading || !jsonData.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;

import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL|| 'http://localhost:8080/api';

const BulkUpload = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState('');
  const [uploadType, setUploadType] = useState('json');
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          if (selectedFile.name.endsWith('.csv')) {
            setJsonData(csvToJson(event.target.result));
          } else {
            setJsonData(event.target.result);
          }
        } catch (err) {
          setError('Error reading file');
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const csvToJson = (csv) => {
    const lines = csv.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const obj = {
        name: values[headers.indexOf('name')] || '',
        email: values[headers.indexOf('email')] || '',
        platforms: [{
          platform: values[headers.indexOf('platform')] || 'instagram',
          username: values[headers.indexOf('username')] || '',
          profileUrl: values[headers.indexOf('profileUrl')] || '',
          followers: parseInt(values[headers.indexOf('followers')]) || 0,
          engagement: parseFloat(values[headers.indexOf('engagement')]) || 0
        }],
        location: {
          country: values[headers.indexOf('country')] || '',
          city: values[headers.indexOf('city')] || ''
        },
        status: values[headers.indexOf('status')] || 'available'
      };
      result.push(obj);
    }
    return JSON.stringify(result, null, 2);
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
    const csv = 'name,email,platform,username,profileUrl,followers,engagement,country,city,status\nSample User,sample@email.com,instagram,sampleuser,https://instagram.com/sampleuser,100000,4.5,USA,Los Angeles,available';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_influencers.csv';
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Bulk Upload Influencers</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Download Samples */}
          <div className="flex gap-3">
            <button onClick={downloadSample} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm">
              Download JSON Sample
            </button>
            <button onClick={downloadCsvSample} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm">
              Download CSV Sample
            </button>
          </div>

          {/* Upload Type */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="uploadType" value="json" checked={uploadType === 'json'} onChange={(e) => setUploadType(e.target.value)} />
              <span>Paste JSON</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="uploadType" value="file" checked={uploadType === 'file'} onChange={(e) => setUploadType(e.target.value)} />
              <span>Upload File</span>
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
                <div className="text-gray-500">
                  <p className="text-lg mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm">JSON or CSV file</p>
                </div>
              </label>
              {file && <p className="mt-3 text-blue-600">{file.name}</p>}
            </div>
          )}

          {/* JSON Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              JSON Data {uploadType === 'file' && '(Preview)'}
            </label>
            <textarea
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              rows={12}
              placeholder={JSON.stringify(sampleData, null, 2)}
              className="w-full px-3 py-2 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error */}
          {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

          {/* Results */}
          {results && (
            <div className="space-y-3">
              <div className="bg-green-100 text-green-700 p-3 rounded">
                <p className="font-medium">Success: {results.success.length}</p>
                {results.success.length > 0 && (
                  <p className="text-sm mt-1">{results.success.join(', ')}</p>
                )}
              </div>
              {results.failed.length > 0 && (
                <div className="bg-red-100 text-red-700 p-3 rounded">
                  <p className="font-medium">Failed: {results.failed.length}</p>
                  <ul className="text-sm mt-1">
                    {results.failed.map((f, i) => (
                      <li key={i}>{f.name}: {f.error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={onClose} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Close</button>
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
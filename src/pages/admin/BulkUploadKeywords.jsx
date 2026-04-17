import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const BulkUploadKeywords = ({ onClose }) => {
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
      name: "fitness",
      displayName: "Fitness",
      description: "Fitness and workout content",
      icon: "",
      color: "#22C55E",
      isActive: true,
    },
  ];

  const sampleCsvHeaders = 'NAME,DISPLAY NAME,DESCRIPTION,ICON,COLOR,ACTIVE';
  const sampleCsvRow = 'fitness,Fitness,Fitness and workout content,,#22C55E,true';

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

  const normalizeHeader = (h) => {
    const s = h.toLowerCase().replace(/[^a-z0-9]/g, '');
    const map = {
      name: 'name',
      keyword: 'name',
      displayname: 'displayName',
      display: 'displayName',
      label: 'displayName',
      description: 'description',
      desc: 'description',
      icon: 'icon',
      emoji: 'icon',
      color: 'color',
      colour: 'color',
      active: 'isActive',
      isactive: 'isActive',
      enabled: 'isActive',
    };
    return map[s] || s;
  };

  const csvToJson = (csv) => {
    const lines = csv.split('\n').filter((line) => line.trim());
    if (lines.length < 2) return '[]';

    const rawHeaders = parseCsvLine(lines[0]);
    const headers = rawHeaders.map(normalizeHeader);
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      if (values.length < 1) continue;

      const get = (key) => {
        const idx = headers.indexOf(key);
        return idx >= 0 ? (values[idx] || '').trim() : '';
      };

      const name = get('name');
      if (!name) continue;

      const normalizedName = name.toLowerCase().replace(/\s+/g, '_');
      const displayName = get('displayName') || name;
      const color = get('color') || '#6366f1';
      const activeVal = get('isActive').toLowerCase();
      const isActive = activeVal === '' ? true : ['true', 'yes', '1'].includes(activeVal);

      result.push({
        name: normalizedName,
        displayName,
        description: get('description') || undefined,
        icon: get('icon') || undefined,
        color,
        isActive,
      });
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
        throw new Error('Data must be an array of keywords');
      }

      const uploadResults = { success: [], failed: [] };

      for (const keyword of data) {
        try {
          await axios.post(`${API_URL}/keywords`, keyword, config);
          uploadResults.success.push(keyword.displayName || keyword.name);
        } catch (err) {
          uploadResults.failed.push({
            name: keyword.displayName || keyword.name,
            error: err.response?.data?.message || 'Unknown error',
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
    a.download = 'sample_keywords.json';
    a.click();
  };

  const downloadCsvSample = () => {
    const csv = sampleCsvHeaders + '\n' + sampleCsvRow;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_keywords.csv';
    a.click();
  };

  const downloadErrorReport = () => {
    if (!results || results.failed.length === 0) return;
    const lines = ['NAME,ERROR'];
    results.failed.forEach((f) => {
      const name = (f.name || 'Unknown').replace(/"/g, '""');
      const err = (f.error || 'Unknown error').replace(/"/g, '""');
      lines.push(`"${name}","${err}"`);
    });
    const csv = lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keyword_upload_errors_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-black">Bulk Upload Keywords</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-black mb-2">Supported CSV Columns:</p>
            <p className="text-xs text-black leading-relaxed">
              NAME, DISPLAY NAME, DESCRIPTION, ICON, COLOR, ACTIVE
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={downloadSample} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm text-black">
              Download JSON Sample
            </button>
            <button onClick={downloadCsvSample} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm text-black">
              Download CSV Sample
            </button>
          </div>

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

          {uploadType === 'file' && (
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".json,.csv"
                onChange={handleFileChange}
                className="hidden"
                id="keywordFileInput"
              />
              <label htmlFor="keywordFileInput" className="cursor-pointer">
                <div className="text-black">
                  <p className="text-lg mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm">JSON or CSV file</p>
                </div>
              </label>
              {file && <p className="mt-3 text-blue-600 font-medium">{file.name}</p>}
            </div>
          )}

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

          {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

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

export default BulkUploadKeywords;

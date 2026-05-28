import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-700',
  reviewed: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const NICHE_LABELS = {
  fashion: 'Fashion & Style',
  beauty: 'Beauty & Skincare',
  fitness: 'Health & Fitness',
  food: 'Food & Lifestyle',
  travel: 'Travel',
  tech: 'Tech & Gaming',
  business: 'Business & Finance',
  parenting: 'Parenting & Family',
  entertainment: 'Entertainment',
  education: 'Education',
  sports: 'Sports',
  other: 'Other',
};

const formatDate = (d) => {
  if (!d) return '—';
  const date = new Date(d);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleString();
};

const initials = (first, last) => {
  const f = (first || '').trim();
  const l = (last || '').trim();
  return ((f[0] || '') + (l[0] || '')).toUpperCase() || 'CR';
};

const AdminCreatorSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('adminToken');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams({ limit: 200 });
      if (search.trim()) params.append('search', search.trim());
      if (statusFilter) params.append('status', statusFilter);
      const res = await axios.get(`${API_URL}/creator-submissions?${params}`, config);
      setSubmissions(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setUpdating(true);
      const res = await axios.patch(`${API_URL}/creator-submissions/${id}`, { status }, config);
      const updated = res.data.data;
      setSubmissions((prev) => prev.map((s) => (s._id === id ? updated : s)));
      setSelected((prev) => (prev && prev._id === id ? updated : prev));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update');
    } finally {
      setUpdating(false);
    }
  };

  const deleteSubmission = async (id) => {
    if (!window.confirm('Delete this submission? This cannot be undone.')) return;
    try {
      await axios.delete(`${API_URL}/creator-submissions/${id}`, config);
      setSubmissions((prev) => prev.filter((s) => s._id !== id));
      setSelected((prev) => (prev && prev._id === id ? null : prev));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleCardClick = (s) => setSelected(s);
  const handleClose = () => setSelected(null);

  const handleSelect = (key) => {
    const known = ['', 'new', 'reviewed', 'approved', 'rejected'];
    setStatusFilter(known.includes(key) ? key : '');
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-black">Creator Submissions</h1>
          <p className="text-sm text-gray-600">Forms submitted from the public Creators page.</p>
        </div>
        <button
          onClick={fetchSubmissions}
          className="px-3 py-2 text-sm font-medium text-black border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          Refresh
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Search by name, email, niche, location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => handleSelect(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="reviewed">Reviewed</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading submissions...</div>
      ) : submissions.length === 0 ? (
        <div className="p-8 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
          No submissions yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {submissions.map((s) => (
            <button
              key={s._id}
              type="button"
              onClick={() => handleCardClick(s)}
              className="text-left bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm shrink-0">
                    {initials(s.firstName, s.lastName)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-black truncate">
                      {s.firstName} {s.lastName || ''}
                    </p>
                    <p className="text-xs text-gray-600 truncate">{s.email}</p>
                  </div>
                </div>
                <span
                  className={`text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[s.status] || STATUS_COLORS.new}`}
                >
                  {s.status}
                </span>
              </div>
              <div className="space-y-1 text-xs text-gray-700">
                <p>
                  <span className="text-gray-500">Niche:</span> {NICHE_LABELS[s.niche] || s.niche || '—'}
                </p>
                <p>
                  <span className="text-gray-500">Followers:</span> {s.followerCount || '—'}
                </p>
                {s.location && (
                  <p>
                    <span className="text-gray-500">Location:</span> {s.location}
                  </p>
                )}
                <p className="text-gray-500 pt-1">
                  Submitted {formatDate(s.createdAt)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <SubmissionDetailModal
          submission={selected}
          onClose={handleClose}
          onUpdateStatus={(status) => updateStatus(selected._id, status)}
          onDelete={() => deleteSubmission(selected._id)}
          updating={updating}
        />
      )}
    </div>
  );
};

const HANDLE_PREFIXES = {
  instagram: 'https://instagram.com/',
  tiktok: 'https://tiktok.com/@',
  youtube: 'https://youtube.com/@',
  twitter: 'https://x.com/',
};

const HANDLE_LABELS = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  twitter: 'X (Twitter)',
};

const SubmissionDetailModal = ({ submission, onClose, onUpdateStatus, onDelete, updating }) => {
  const handles = submission.handles || {};
  const handleEntries = Object.entries(handles).filter(([, v]) => v && v.trim() !== '');

  const buildHandleUrl = (platform, handle) => {
    const clean = handle.trim().replace(/^@+/, '');
    const prefix = HANDLE_PREFIXES[platform];
    if (!prefix) return null;
    if (/^https?:\/\//i.test(clean)) return clean;
    return prefix + clean;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white w-full sm:max-w-2xl sm:rounded-xl shadow-xl flex flex-col max-h-screen sm:max-h-[90vh] overflow-hidden">
        <div className="flex items-start justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
              {initials(submission.firstName, submission.lastName)}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-black truncate">
                {submission.firstName} {submission.lastName || ''}
              </h2>
              <a
                href={`mailto:${submission.email}`}
                className="text-sm text-blue-600 hover:underline truncate block"
              >
                {submission.email}
              </a>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-500 hover:text-black rounded-lg hover:bg-gray-100 shrink-0"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Status:</span>
            {['new', 'reviewed', 'approved', 'rejected'].map((s) => (
              <button
                key={s}
                disabled={updating || submission.status === s}
                onClick={() => onUpdateStatus(s)}
                className={`text-xs px-3 py-1 rounded-full font-semibold capitalize transition ${
                  submission.status === s
                    ? STATUS_COLORS[s] + ' ring-2 ring-offset-1 ring-current'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {s}
              </button>
            ))}
          </div>

          <Section title="Basic Info">
            <DetailRow label="First Name" value={submission.firstName} />
            <DetailRow label="Last Name" value={submission.lastName || '—'} />
            <DetailRow label="Email" value={submission.email} />
            <DetailRow label="Location" value={submission.location || '—'} />
          </Section>

          <Section title="Audience">
            <DetailRow label="Niche" value={NICHE_LABELS[submission.niche] || submission.niche || '—'} />
            <DetailRow label="Follower Count" value={submission.followerCount || '—'} />
          </Section>

          <Section title="Social Handles">
            {handleEntries.length === 0 ? (
              <p className="text-sm text-gray-500">No handles provided.</p>
            ) : (
              <ul className="space-y-2">
                {handleEntries.map(([platform, handle]) => {
                  const url = buildHandleUrl(platform, handle);
                  return (
                    <li key={platform} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-gray-500 w-24 shrink-0">
                        {HANDLE_LABELS[platform] || platform}
                      </span>
                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          {handle}
                        </a>
                      ) : (
                        <span className="text-black break-all">{handle}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </Section>

          <Section title="Meta">
            <DetailRow label="Submitted" value={formatDate(submission.createdAt)} />
            <DetailRow label="Last Updated" value={formatDate(submission.updatedAt)} />
            <DetailRow label="ID" value={submission._id} mono />
          </Section>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onDelete}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-50"
          >
            Delete submission
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div>
    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{title}</h3>
    <div className="space-y-1.5">{children}</div>
  </div>
);

const DetailRow = ({ label, value, mono }) => (
  <div className="flex items-start justify-between gap-3 text-sm">
    <span className="text-gray-500 w-32 shrink-0">{label}</span>
    <span className={`text-black break-all text-right ${mono ? 'font-mono text-xs' : ''}`}>
      {value}
    </span>
  </div>
);

export default AdminCreatorSubmissions;

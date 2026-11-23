import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Plus,
  ArrowLeft,
  MapPin,
  Clock,
  Sparkles,
  Share2,
  Users,
  Eye,
  Check,
  Copy,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Filter,
  Trash2,
  Edit,
  Building2,
  Mail,
  Phone,
  X
} from 'lucide-react';
import { apiUrl, getAuthHeaders } from '../api';
import { DEPARTMENT_OPTIONS_GROUPED, ALL_DEPARTMENTS_LIST } from '../data/resdexSuggestions';

export default function ManageJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  
  // Naukri Fast-Sync State
  const [showNaukriSyncModal, setShowNaukriSyncModal] = useState(false);
  const [naukriUrl, setNaukriUrl] = useState('');
  const [naukriTitle, setNaukriTitle] = useState('');
  const [naukriDept, setNaukriDept] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState(null);

  // Resdex Matches Expansion State
  const [expandedMatchesJobId, setExpandedMatchesJobId] = useState(null);
  const [jobMatchesData, setJobMatchesData] = useState({});
  const [loadingMatchesId, setLoadingMatchesId] = useState(null);

  const handleToggleMatches = async (jobId) => {
    if (expandedMatchesJobId === jobId) {
      setExpandedMatchesJobId(null);
      return;
    }
    setExpandedMatchesJobId(jobId);
    if (!jobMatchesData[jobId]) {
      setLoadingMatchesId(jobId);
      try {
        const res = await fetch(apiUrl(`/api/jobs/${jobId}/matches`), {
          headers: getAuthHeaders()
        });
        const data = await res.json();
        if (data.success) {
          setJobMatchesData(prev => ({ ...prev, [jobId]: data }));
        }
      } catch (err) {
        console.error('Error fetching job matches:', err);
      } finally {
        setLoadingMatchesId(null);
      }
    }
  };

  // Edit Job Modal State
  const [editingJob, setEditingJob] = useState(null);
  const [isCustomDept, setIsCustomDept] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    company: 'MCP Consultants',
    department: '',
    locations: '',
    workExperienceMin: 0,
    workExperienceMax: 5,
    salaryMin: '',
    salaryMax: '',
    vacancies: 1,
    status: 'Active',
    jobDescription: ''
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editFeedback, setEditFeedback] = useState(null);

  const handleOpenEdit = (job) => {
    setEditingJob(job);
    const initialDept = job.department || 'Operations';
    setEditFormData({
      title: job.title || '',
      company: job.company || 'MCP Consultants',
      department: initialDept,
      locations: Array.isArray(job.locations) ? job.locations.join(', ') : (job.locations || 'Baddi'),
      workExperienceMin: job.workExperienceMin ?? 0,
      workExperienceMax: job.workExperienceMax ?? 5,
      salaryMin: job.salaryMin || '',
      salaryMax: job.salaryMax || '',
      vacancies: job.vacancies || 1,
      status: job.status || 'Active',
      jobDescription: job.jobDescription || ''
    });
    setIsCustomDept(false);
    setEditFeedback(null);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingJob) return;
    if (!editFormData.title.trim()) {
      setEditFeedback({ type: 'error', message: 'Job title is required.' });
      return;
    }
    setIsSavingEdit(true);
    setEditFeedback(null);
    try {
      const locList = editFormData.locations.split(',').map(s => s.trim()).filter(Boolean);
      const payload = {
        title: editFormData.title.trim(),
        company: editFormData.company.trim() || 'MCP Consultants',
        department: editFormData.department.trim(),
        locations: locList.length ? locList : ['Baddi'],
        workExperienceMin: Number(editFormData.workExperienceMin) || 0,
        workExperienceMax: Number(editFormData.workExperienceMax) || 0,
        salaryMin: editFormData.salaryMin.trim(),
        salaryMax: editFormData.salaryMax.trim(),
        vacancies: Number(editFormData.vacancies) || 1,
        status: editFormData.status,
        jobDescription: editFormData.jobDescription
      };

      const res = await fetch(apiUrl(`/api/jobs/${editingJob._id}`), {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setJobs(prevJobs => prevJobs.map(j => j._id === editingJob._id ? { ...j, ...payload } : j));
        setEditFeedback({ type: 'success', message: 'Job details updated successfully!' });
        setTimeout(() => {
          setEditingJob(null);
          setEditFeedback(null);
        }, 1200);
      } else {
        setEditFeedback({ type: 'error', message: data.message || 'Failed to update job details.' });
      }
    } catch (err) {
      setEditFeedback({ type: 'error', message: 'Network error saving job changes.' });
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleNaukriSync = async (e) => {
    e.preventDefault();
    if (!naukriUrl.trim()) return;
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await fetch(apiUrl('/api/jobs/import-naukri'), {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          url: naukriUrl.trim(),
          title: naukriTitle.trim(),
          department: naukriDept.trim(),
          autoPublish: true
        })
      });
      const data = await res.json();
      if (data.success) {
        setSyncFeedback({ type: 'success', message: data.message || 'Job successfully synced from Naukri!' });
        fetchJobs();
        setTimeout(() => {
          setShowNaukriSyncModal(false);
          setNaukriUrl('');
          setNaukriTitle('');
          setNaukriDept('');
          setSyncFeedback(null);
        }, 1800);
      } else {
        setSyncFeedback({ type: 'error', message: data.message || data.error || 'Failed to sync job.' });
      }
    } catch (err) {
      setSyncFeedback({ type: 'error', message: 'Network error connecting to sync service.' });
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const url = statusFilter === 'All' 
        ? apiUrl('/api/jobs') 
        : apiUrl(`/api/jobs?status=${encodeURIComponent(statusFilter)}`);
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(apiUrl(`/api/jobs/${id}`), {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setJobs(prevJobs => prevJobs.map(j => j._id === id ? { ...j, status: newStatus } : j));
      }
    } catch (err) {
      console.error('Error updating job status:', err);
    }
  };

  const handleDeleteJob = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title || 'this job posting'}"?\n\nThis will permanently delete the mandate and immediately remove it from the public Careers page.`)) return;
    try {
      await fetch(apiUrl(`/api/jobs/${id}`), {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      setJobs(jobs.filter(j => j._id !== id));
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  const handleCopyLink = (id) => {
    const link = typeof window !== 'undefined' ? `${window.location.origin}/jobs` : 'https://mcpconsultants.in/jobs';
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredJobs = jobs.filter(j => {
    if (!searchQuery.trim()) return true;
    const clean = searchQuery.toLowerCase();
    return (
      (j.title && j.title.toLowerCase().includes(clean)) ||
      (j.referenceCode && j.referenceCode.toLowerCase().includes(clean)) ||
      (j.locations && j.locations.some(l => l.toLowerCase().includes(clean)))
    );
  });

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#0f172a' }}>
      
      {/* ------------------------------------------------------------- */}
      {/* TOP CORPORATE NAVIGATION BAR                                  */}
      {/* ------------------------------------------------------------- */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link to="/admin/resdex" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '1px', color: '#0b1a2f', lineHeight: 1.1, fontFamily: 'var(--font-heading)' }}>
                MCP <span style={{ color: '#c49a45' }}>CONSULTANTS</span>
              </span>
              <span style={{ fontSize: '9.5px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#64748b', marginTop: '2px' }}>
                Hiring &amp; Talent Portal
              </span>
            </Link>

            <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link
                to="/admin/jobs"
                style={{
                  padding: '18px 12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#0f172a',
                  textDecoration: 'none',
                  borderBottom: '3px solid #ff4d4f'
                }}
              >
                Jobs & Responses
              </Link>
              <Link
                to="/admin/resdex"
                style={{
                  padding: '18px 12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#475569',
                  textDecoration: 'none',
                  borderBottom: '3px solid transparent'
                }}
              >
                Resdex
              </Link>
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setShowNaukriSyncModal(true)}
              style={{
                backgroundColor: '#16a34a',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 4px rgba(22,163,74,0.2)'
              }}
            >
              <Sparkles size={15} />
              <span>⚡ Sync from Naukri</span>
            </button>

            <Link
              to="/admin/post-job"
              style={{
                backgroundColor: '#0056b3',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 4px rgba(0,86,179,0.2)'
              }}
            >
              <Plus size={15} />
              <span>Post a Job</span>
            </Link>

            {/* Return to Admin Portal Button */}
            <Link 
              to="/admin" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: '#0b1a2f',
                color: '#c49a45',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                border: '1px solid #c49a45',
                boxShadow: '0 2px 4px rgba(11,26,47,0.15)'
              }}
              title="Return to Admin Portal"
            >
              <ArrowLeft size={15} />
              <span>Admin Portal</span>
            </Link>
          </div>

        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTAINER                                                */}
      {/* ------------------------------------------------------------- */}
      <main style={{ maxWidth: '1240px', margin: '28px auto', padding: '0 24px' }}>
        
        {/* Back to Admin Portal Breadcrumb Navigation */}
        <div style={{ marginBottom: '16px' }}>
          <Link
            to="/admin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#475569',
              textDecoration: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              transition: 'all 0.15s ease'
            }}
          >
            <ArrowLeft size={14} style={{ color: '#0056b3' }} />
            <span>← Back to Admin Portal</span>
          </Link>
        </div>
        
        {/* Title Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
              Manage Jobs & Responses
            </h1>
            <p style={{ margin: 0, fontSize: '13.5px', color: '#64748b' }}>
              Track active mandates, candidate responses, and instant Resdex talent matches.
            </p>
          </div>

          <Link
            to="/admin/post-job"
            style={{
              backgroundColor: '#0056b3',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Plus size={16} />
            <span>Post New Classified</span>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px 20px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {['All', 'Active', 'Draft', 'Closed'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: statusFilter === st ? '1.5px solid #0056b3' : '1px solid #cbd5e1',
                  backgroundColor: statusFilter === st ? '#eff6ff' : '#ffffff',
                  color: statusFilter === st ? '#0056b3' : '#475569',
                  fontSize: '12.5px',
                  fontWeight: statusFilter === st ? 700 : 500,
                  cursor: 'pointer'
                }}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text"
              placeholder="Search by job title, ref code, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
            />
          </div>

        </div>

        {/* Jobs List */}
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748b' }}>
            Loading job postings...
          </div>
        ) : filteredJobs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredJobs.map((job) => {
              const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/jobs` : 'https://mcpconsultants.in/jobs';
              const whatsAppText = encodeURIComponent(
                `🚀 *Opening via MCP Consultants: ${job.title}*\n` +
                `📍 Location: ${(job.locations || []).join(', ') || 'Baddi'}\n` +
                `💼 Experience: ${job.workExperienceMin}-${job.workExperienceMax} Years\n` +
                `💰 CTC: ${job.salaryMin}-${job.salaryMax} Lacs\n` +
                `Apply here: ${shareUrl}`
              );

              return (
                <div
                  key={job._id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '22px 26px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}
                >
                  {/* Job Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                          {job.title}
                        </h3>
                        <select
                          value={job.status || 'Active'}
                          onChange={(e) => handleStatusChange(job._id, e.target.value)}
                          title="Change status: Active jobs appear on the public Careers page. Paused or Closed jobs are automatically hidden."
                          style={{
                            fontSize: '11.5px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: job.status === 'Active' ? '1px solid #86efac' : (job.status === 'Paused' ? '1px solid #fde68a' : '1px solid #cbd5e1'),
                            backgroundColor: job.status === 'Active' ? '#f0fdf4' : (job.status === 'Paused' ? '#fffbeb' : '#f8fafc'),
                            color: job.status === 'Active' ? '#166534' : (job.status === 'Paused' ? '#92400e' : '#475569'),
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                        >
                          <option value="Active">🟢 Active (Live on Careers)</option>
                          <option value="Paused">🟡 Paused (Hidden from Careers)</option>
                          <option value="Closed">⚪ Closed (Hidden from Careers)</option>
                        </select>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>
                          Ref: <strong>{job.referenceCode || 'N/A'}</strong>
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13px', color: '#475569' }}>
                        <span>🏢 {job.hideCompany ? 'Confidential Client' : job.company}</span>
                        <span>•</span>
                        <span>📍 {(job.locations || []).join(', ') || 'Pan India'}</span>
                        <span>•</span>
                        <span>💼 {job.workExperienceMin} - {job.workExperienceMax} Years</span>
                        <span>•</span>
                        <span>💰 ₹ {job.salaryMin} - {job.salaryMax} Lacs ({job.salaryType})</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(job)}
                        style={{
                          background: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          color: '#1d4ed8',
                          cursor: 'pointer',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease'
                        }}
                        title="Edit Job Title, Requirements, Experience & Salary"
                      >
                        <Edit size={14} />
                        <span>Edit Details</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteJob(job._id, job.title)}
                        style={{
                          background: '#fff1f2',
                          border: '1px solid #fecdd3',
                          color: '#e11d48',
                          cursor: 'pointer',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease'
                        }}
                        title="Permanently remove this job from both Admin Portal and Careers page"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Key Skills Tags */}
                  {job.skills && job.skills.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {job.skills.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          style={{
                            fontSize: '11.5px',
                            fontWeight: s.mandatory ? 700 : 500,
                            padding: '2px 8px',
                            borderRadius: '12px',
                            backgroundColor: s.mandatory ? '#eff6ff' : '#f8fafc',
                            border: s.mandatory ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                            color: s.mandatory ? '#0056b3' : '#475569'
                          }}
                        >
                          {s.mandatory && '★ '}
                          {s.name || s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Metrics & Action Buttons Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '12px' }}>
                    
                    {/* Metrics */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '12.5px', color: '#64748b' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Eye size={14} style={{ color: '#0056b3' }} />
                        <strong>{job.viewsCount || 38}</strong> Views
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={14} style={{ color: '#16a34a' }} />
                        <strong>{job.applicationsCount || 7}</strong> Applications Received
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleMatches(job._id)}
                        title="Click to view all matching criteria & candidate profiles from Resdex"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: expandedMatchesJobId === job._id ? '#0056b3' : '#eff6ff',
                          color: expandedMatchesJobId === job._id ? '#ffffff' : '#0056b3',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontWeight: 700,
                          fontSize: '12px',
                          border: '1px solid #bfdbfe',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Sparkles size={13} style={{ color: expandedMatchesJobId === job._id ? '#c49a45' : '#0056b3' }} />
                        <span>{job.matchingCandidatesCount || 24} Resdex Matches</span>
                        {expandedMatchesJobId === job._id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      
                      {/* Search Resdex Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const skillsList = (job.skills || []).map(s => s.name || s).filter(Boolean);
                          const searchTerms = skillsList.length > 0 ? skillsList.join(',') : (job.department || 'Operations');
                          const locText = (job.locations || []).join(', ');
                          navigate(`/admin/resdex?keywords=${encodeURIComponent(searchTerms)}&location=${encodeURIComponent(locText)}&department=${encodeURIComponent(job.department || '')}&title=${encodeURIComponent(job.title || '')}`);
                        }}
                        style={{
                          backgroundColor: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          color: '#0056b3',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          padding: '7px 14px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Search size={14} />
                        <span>Search Resdex</span>
                      </button>

                      {/* WhatsApp Share */}
                      <a
                        href={`https://api.whatsapp.com/send?text=${whatsAppText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          backgroundColor: '#25D366',
                          color: '#ffffff',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          padding: '7px 14px',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Share2 size={13} />
                        <span>WhatsApp</span>
                      </a>

                      {/* Copy Link */}
                      <button
                        type="button"
                        onClick={() => handleCopyLink(job._id)}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          color: copiedId === job._id ? '#16a34a' : '#475569',
                          fontSize: '12px',
                          fontWeight: 600,
                          padding: '7px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {copiedId === job._id ? <Check size={13} /> : <Copy size={13} />}
                        <span>{copiedId === job._id ? 'Copied' : 'Link'}</span>
                      </button>

                    </div>

                  </div>

                  {/* Expanded Resdex Matches & Criteria Breakdown */}
                  {expandedMatchesJobId === job._id && (
                    <div style={{
                      marginTop: '6px',
                      padding: '18px 20px',
                      borderRadius: '10px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px'
                    }}>
                      {/* Match Criteria Header Bar */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Sparkles size={16} style={{ color: '#c49a45' }} />
                            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                              What Things Are Matched for this Job:
                            </h4>
                          </div>
                          <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#64748b' }}>
                            Criteria used to find verified executive & technical talent profiles from Resdex.
                          </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              const skillsList = (job.skills || []).map(s => s.name || s).filter(Boolean);
                              const searchTerms = skillsList.length > 0 ? skillsList.join(',') : (job.department || 'Operations');
                              const locText = (job.locations || []).join(', ');
                              navigate(`/admin/resdex?keywords=${encodeURIComponent(searchTerms)}&location=${encodeURIComponent(locText)}&department=${encodeURIComponent(job.department || '')}&title=${encodeURIComponent(job.title || '')}`);
                            }}
                            style={{
                              backgroundColor: '#0056b3',
                              color: '#ffffff',
                              padding: '6px 14px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 700,
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <Search size={13} />
                            <span>Open Full Search in Resdex</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setExpandedMatchesJobId(null)}
                            style={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #cbd5e1',
                              color: '#64748b',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              fontWeight: 600
                            }}
                          >
                            Close ▴
                          </button>
                        </div>
                      </div>

                      {/* Criteria Breakdown Chips */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', fontSize: '12px' }}>
                          <MapPin size={13} style={{ color: '#0056b3' }} />
                          <span style={{ color: '#1e3a8a', fontWeight: 600 }}>Location Matched:</span>
                          <strong style={{ color: '#0f172a' }}>{(job.locations && job.locations.length ? job.locations : ['Baddi']).join(', ')}</strong>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>(+ Regional / Relocatable)</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', fontSize: '12px' }}>
                          <Briefcase size={13} style={{ color: '#16a34a' }} />
                          <span style={{ color: '#166534', fontWeight: 600 }}>Department Matched:</span>
                          <strong style={{ color: '#0f172a' }}>{job.department || 'Operations'}</strong>
                        </div>

                        {job.title && !job.title.startsWith('Position Ref #') && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', backgroundColor: '#fef3c7', border: '1px solid #fde68a', fontSize: '12px' }}>
                            <span style={{ color: '#92400e', fontWeight: 600 }}>Target Role:</span>
                            <strong style={{ color: '#0f172a' }}>{job.title}</strong>
                          </div>
                        )}

                        {job.skills && job.skills.length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe', fontSize: '12px' }}>
                            <span style={{ color: '#5b21b6', fontWeight: 600 }}>Matched Skills:</span>
                            <strong style={{ color: '#0f172a' }}>{job.skills.map(s => s.name || s).join(', ')}</strong>
                          </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', fontSize: '12px' }}>
                          <Clock size={13} style={{ color: '#64748b' }} />
                          <span style={{ color: '#475569', fontWeight: 600 }}>Experience Range:</span>
                          <strong style={{ color: '#0f172a' }}>{job.workExperienceMin || 1} - {job.workExperienceMax || 5} Years</strong>
                        </div>
                      </div>

                      {/* Matched Candidates List */}
                      {loadingMatchesId === job._id ? (
                        <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                          Fetching matched Resdex talent profiles...
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>
                              Matched Resdex Profiles ({jobMatchesData[job._id]?.candidates?.length || (job.matchingCandidatesCount || 24)})
                            </span>
                            <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 500 }}>
                              Profiles matching above criteria
                            </span>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
                            {(jobMatchesData[job._id]?.candidates || []).slice(0, 6).map((cand, cIdx) => (
                              <div
                                key={cIdx}
                                style={{
                                  backgroundColor: '#ffffff',
                                  border: '1px solid #cbd5e1',
                                  borderRadius: '8px',
                                  padding: '14px 16px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '8px',
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                                }}
                              >
                                {/* Candidate Name & CTC */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>{cand.name}</strong>
                                      <span style={{ fontSize: '10px', color: '#16a34a', backgroundColor: '#dcfce7', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>Verified</span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#0056b3', fontWeight: 600, marginTop: '2px' }}>
                                      {cand.current_role}
                                    </div>
                                  </div>
                                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '10px', whiteSpace: 'nowrap' }}>
                                    {cand.annual_ctc || 'Negotiable'}
                                  </span>
                                </div>

                                {/* Company & Location */}
                                <div style={{ fontSize: '11.5px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                  <div>🏢 {cand.company}</div>
                                  <div>📍 {cand.location} • ⏳ {cand.experience} Exp</div>
                                </div>

                                {/* Why It Matched Tags */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
                                  {(cand.matches || []).map((m, mIdx) => (
                                    <span
                                      key={mIdx}
                                      style={{
                                        fontSize: '10.5px',
                                        fontWeight: 600,
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        backgroundColor: m.type === 'location' ? '#eff6ff' : (m.type === 'role' ? '#fef3c7' : '#f0fdf4'),
                                        color: m.type === 'location' ? '#1e40af' : (m.type === 'role' ? '#92400e' : '#166534'),
                                        border: '1px solid rgba(0,0,0,0.05)'
                                      }}
                                    >
                                      ✓ {m.label}
                                    </span>
                                  ))}
                                </div>

                                {/* Key Skills */}
                                {cand.key_skills && cand.key_skills.length > 0 && (
                                  <div style={{ fontSize: '11px', color: '#475569', display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
                                    {cand.key_skills.slice(0, 4).map((sk, skIdx) => (
                                      <span key={skIdx} style={{ backgroundColor: '#f1f5f9', padding: '1px 6px', borderRadius: '3px' }}>
                                        {sk}
                                      </span>
                                    ))}
                                    {cand.key_skills.length > 4 && (
                                      <span style={{ color: '#94a3b8' }}>+{cand.key_skills.length - 4} more</span>
                                    )}
                                  </div>
                                )}

                                {/* Quick Contact Actions */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                                  {cand.phone && (
                                    <a
                                      href={`tel:${cand.phone}`}
                                      style={{ fontSize: '11px', color: '#0056b3', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px', padding: '3px 8px', borderRadius: '4px', backgroundColor: '#eff6ff', fontWeight: 600 }}
                                    >
                                      <Phone size={11} />
                                      <span>Call</span>
                                    </a>
                                  )}
                                  {cand.phone && (
                                    <a
                                      href={`https://api.whatsapp.com/send?phone=${cand.phone.replace(/[^0-9]/g, '')}&text=Hello%20${encodeURIComponent(cand.name)},%20we%20have%20an%20active%20opportunity%20for%20${encodeURIComponent(job.title)}%20at%20MCP%20Consultants.`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ fontSize: '11px', color: '#16a34a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px', padding: '3px 8px', borderRadius: '4px', backgroundColor: '#f0fdf4', fontWeight: 600 }}
                                    >
                                      <span>WhatsApp</span>
                                    </a>
                                  )}
                                  {cand.email && (
                                    <a
                                      href={`mailto:${cand.email}?subject=Career Opportunity: ${encodeURIComponent(job.title)}`}
                                      style={{ fontSize: '11px', color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px', padding: '3px 8px', borderRadius: '4px', backgroundColor: '#f8fafc', fontWeight: 600 }}
                                    >
                                      <Mail size={11} />
                                      <span>Email</span>
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* View All Button */}
                          <div style={{ textAlign: 'center', marginTop: '12px' }}>
                            <button
                              type="button"
                              onClick={() => {
                                const skillsList = (job.skills || []).map(s => s.name || s).filter(Boolean);
                                const searchTerms = skillsList.length > 0 ? skillsList.join(',') : (job.department || 'Operations');
                                const locText = (job.locations || []).join(', ');
                                navigate(`/admin/resdex?keywords=${encodeURIComponent(searchTerms)}&location=${encodeURIComponent(locText)}&department=${encodeURIComponent(job.department || '')}&title=${encodeURIComponent(job.title || '')}`);
                              }}
                              style={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #0056b3',
                                color: '#0056b3',
                                padding: '7px 18px',
                                borderRadius: '6px',
                                fontSize: '12.5px',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              View All {jobMatchesData[job._id]?.candidates?.length || (job.matchingCandidatesCount || 24)} Matched Candidates in Resdex Search →
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '60px 20px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
            <Briefcase size={36} style={{ color: '#cbd5e1', margin: '0 auto 12px', display: 'block' }} />
            <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>No job postings found</h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b' }}>Post your first job requirement to start receiving candidate applications.</p>
            <Link
              to="/admin/post-job"
              style={{ backgroundColor: '#0056b3', color: '#ffffff', padding: '10px 20px', borderRadius: '8px', fontSize: '13.5px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} />
              <span>Post a Job Now</span>
            </Link>
          </div>
        )}

      </main>

      {/* Naukri Fast-Sync Modal */}
      {showNaukriSyncModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', maxWidth: '520px', width: '100%', padding: '28px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>Sync Job from Naukri</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Instantly publish any Naukri job posting to your Careers board</p>
                </div>
              </div>
              <button onClick={() => { setShowNaukriSyncModal(false); setSyncFeedback(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleNaukriSync}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Naukri Link or Job ID <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://hiring.naukri.com/hiring/180526801442/applies or 180526801442"
                  value={naukriUrl}
                  onChange={(e) => setNaukriUrl(e.target.value)}
                  required
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
                />
                <span style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                  Paste the hiring link from your recruiter dashboard or the 12-digit Job ID.
                </span>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Job Title / Designation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior QA Engineer, Production Incharge, Accountant"
                  value={naukriTitle}
                  onChange={(e) => setNaukriTitle(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
                />
                <span style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                  Recommended: Set the designation to appear directly on your public Careers page.
                </span>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Department / Function
                </label>
                <select
                  value={naukriDept}
                  onChange={(e) => setNaukriDept(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">-- Select Department / Function (Defaults to Operations) --</option>
                  {DEPARTMENT_OPTIONS_GROUPED.map((grp) => (
                    <optgroup key={grp.group} label={grp.group}>
                      {grp.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <span style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                  Assign the department/function for this imported mandate.
                </span>
              </div>

              {syncFeedback && (
                <div style={{ padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', backgroundColor: syncFeedback.type === 'success' ? '#f0fdf4' : '#fef2f2', color: syncFeedback.type === 'success' ? '#166534' : '#991b1b', border: syncFeedback.type === 'success' ? '1px solid #bbf7d0' : '1px solid #fecaca' }}>
                  {syncFeedback.message}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => { setShowNaukriSyncModal(false); setSyncFeedback(null); }}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#334155', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSyncing}
                  style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#16a34a', color: '#ffffff', fontSize: '13px', fontWeight: 700, cursor: isSyncing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {isSyncing ? 'Syncing...' : 'Fetch & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Job Mandate Modal */}
      {editingJob && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', maxWidth: '620px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0056b3' }}>
                  <Edit size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Edit Job Mandate</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Update designation, requirements, location and compensation</p>
                </div>
              </div>
              <button
                onClick={() => { setEditingJob(null); setEditFeedback(null); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Job Title */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                    Job Designation / Title <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    required
                    placeholder="e.g. Senior Mechanical Design Engineer"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {/* Company */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                      Hiring Company
                    </label>
                    <input
                      type="text"
                      value={editFormData.company}
                      onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                      placeholder="MCP Consultants"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#1e293b' }}>
                        Department / Function
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsCustomDept(!isCustomDept)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#0056b3',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        {isCustomDept ? '← Choose from list' : '+ Enter custom'}
                      </button>
                    </div>

                    {!isCustomDept ? (
                      <select
                        value={editFormData.department}
                        onChange={(e) => {
                          if (e.target.value === '__custom__') {
                            setIsCustomDept(true);
                          } else {
                            setEditFormData({ ...editFormData, department: e.target.value });
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '13px',
                          outline: 'none',
                          backgroundColor: '#ffffff',
                          color: '#0f172a',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="">-- Select Department / Function --</option>
                        {editFormData.department && !ALL_DEPARTMENTS_LIST.includes(editFormData.department) && (
                          <option value={editFormData.department}>
                            {editFormData.department} (Current)
                          </option>
                        )}
                        {DEPARTMENT_OPTIONS_GROUPED.map((grp) => (
                          <optgroup key={grp.group} label={grp.group}>
                            {grp.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                        <option value="__custom__">✏️ Other / Custom Department...</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={editFormData.department}
                        onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                        placeholder="Type custom department name..."
                        autoFocus
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1px solid #0056b3',
                          fontSize: '13px',
                          outline: 'none',
                          backgroundColor: '#ffffff'
                        }}
                      />
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                  {/* Locations */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                      Job Locations (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editFormData.locations}
                      onChange={(e) => setEditFormData({ ...editFormData, locations: e.target.value })}
                      placeholder="Baddi, Chandigarh, Solan"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                      Status
                    </label>
                    <select
                      value={editFormData.status}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#ffffff' }}
                    >
                      <option value="Active">🟢 Active (Live)</option>
                      <option value="Paused">🟡 Paused</option>
                      <option value="Closed">⚪ Closed</option>
                    </select>
                  </div>
                </div>

                {/* Experience & Salary Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                      Min Exp (Yrs)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editFormData.workExperienceMin}
                      onChange={(e) => setEditFormData({ ...editFormData, workExperienceMin: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                      Max Exp (Yrs)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editFormData.workExperienceMax}
                      onChange={(e) => setEditFormData({ ...editFormData, workExperienceMax: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                      Min CTC (Lacs)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 3.00"
                      value={editFormData.salaryMin}
                      onChange={(e) => setEditFormData({ ...editFormData, salaryMin: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                      Max CTC (Lacs)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 7.50"
                      value={editFormData.salaryMax}
                      onChange={(e) => setEditFormData({ ...editFormData, salaryMax: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                    Job Description &amp; Candidate Profile
                  </label>
                  <textarea
                    rows={4}
                    value={editFormData.jobDescription}
                    onChange={(e) => setEditFormData({ ...editFormData, jobDescription: e.target.value })}
                    placeholder="Brief summary of duties, qualifications, and key skills..."
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>

              </div>

              {editFeedback && (
                <div style={{ marginTop: '16px', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', backgroundColor: editFeedback.type === 'success' ? '#f0fdf4' : '#fef2f2', color: editFeedback.type === 'success' ? '#166534' : '#991b1b', border: editFeedback.type === 'success' ? '1px solid #bbf7d0' : '1px solid #fecaca' }}>
                  {editFeedback.message}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
                <button
                  type="button"
                  onClick={() => { setEditingJob(null); setEditFeedback(null); }}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#334155', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  style={{ padding: '9px 22px', borderRadius: '8px', border: 'none', backgroundColor: '#0056b3', color: '#ffffff', fontSize: '13px', fontWeight: 700, cursor: isSavingEdit ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {isSavingEdit ? 'Saving Changes...' : 'Save Mandate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

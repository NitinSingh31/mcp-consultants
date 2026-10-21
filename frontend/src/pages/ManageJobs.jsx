import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Plus,
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
  Filter,
  Trash2,
  Edit,
  Building2,
  Mail,
  Phone,
  X
} from 'lucide-react';
import { apiUrl, getAuthHeaders } from '../api';

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

  // Edit Job Modal State
  const [editingJob, setEditingJob] = useState(null);
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
    setEditFormData({
      title: job.title || '',
      company: job.company || 'MCP Consultants',
      department: job.department || 'Operations',
      locations: Array.isArray(job.locations) ? job.locations.join(', ') : (job.locations || 'Baddi'),
      workExperienceMin: job.workExperienceMin ?? 0,
      workExperienceMax: job.workExperienceMax ?? 5,
      salaryMin: job.salaryMin || '',
      salaryMax: job.salaryMax || '',
      vacancies: job.vacancies || 1,
      status: job.status || 'Active',
      jobDescription: job.jobDescription || ''
    });
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
          </div>

        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTAINER                                                */}
      {/* ------------------------------------------------------------- */}
      <main style={{ maxWidth: '1240px', margin: '28px auto', padding: '0 24px' }}>
        
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
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#eff6ff', color: '#0056b3', padding: '3px 8px', borderRadius: '12px', fontWeight: 700 }}>
                        <Sparkles size={13} />
                        <span>{job.matchingCandidatesCount || 24} Resdex Matches</span>
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      
                      {/* Search Resdex Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const skillsText = (job.skills || []).map(s => s.name || s).join(' ');
                          const locText = (job.locations || []).join(', ');
                          navigate(`/admin/resdex?keywords=${encodeURIComponent(skillsText)}&location=${encodeURIComponent(locText)}&title=${encodeURIComponent(job.title)}`);
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
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                      Department / Function
                    </label>
                    <input
                      type="text"
                      value={editFormData.department}
                      onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                      placeholder="e.g. Engineering, Operations, HR"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                    />
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

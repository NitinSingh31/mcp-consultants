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
  Phone
} from 'lucide-react';
import { apiUrl } from '../api';

export default function ManageJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

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

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to remove this job posting?')) return;
    try {
      await fetch(apiUrl(`/api/jobs/${id}`), { method: 'DELETE' });
      setJobs(jobs.filter(j => j._id !== id));
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  const handleCopyLink = (id) => {
    const link = `http://localhost:5173/jobs`;
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
            <Link to="/admin/resdex" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #0056b3, #0077ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: '900', fontSize: '16px' }}>
                M
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px', color: '#0056b3', lineHeight: 1 }}>mcp</span>
                <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#64748b' }}>hiring</span>
              </div>
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
              <Link
                to="/admin"
                style={{
                  padding: '18px 12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#475569',
                  textDecoration: 'none',
                  borderBottom: '3px solid transparent'
                }}
              >
                Reports
              </Link>
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
              const shareUrl = `http://localhost:5173/jobs`;
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
                        <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: job.status === 'Active' ? '#dcfce7' : '#f1f5f9', color: job.status === 'Active' ? '#166534' : '#475569', padding: '2px 8px', borderRadius: '4px' }}>
                          {job.status}
                        </span>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>
                          Ref: <strong>{job.referenceCode || 'MCP-2026-091'}</strong>
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13px', color: '#475569' }}>
                        <span>🏢 {job.hideCompany ? 'Confidential Client' : job.company}</span>
                        <span>•</span>
                        <span>📍 {(job.locations || []).join(', ') || 'Baddi'}</span>
                        <span>•</span>
                        <span>💼 {job.workExperienceMin} - {job.workExperienceMax} Years</span>
                        <span>•</span>
                        <span>💰 ₹ {job.salaryMin} - {job.salaryMax} Lacs ({job.salaryType})</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleDeleteJob(job._id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                        title="Delete job"
                      >
                        <Trash2 size={16} />
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

    </div>
  );
}

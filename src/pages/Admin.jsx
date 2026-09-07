import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Mail, 
  RefreshCw, 
  Download, 
  ExternalLink, 
  Search, 
  FileText, 
  ShieldCheck, 
  ArrowLeft,
  Calendar,
  Phone,
  Briefcase,
  AlertCircle
} from 'lucide-react';

export default function Admin() {
  const [data, setData] = useState({ mandates: [], candidates: [], inquiries: [], stats: {}, activeDatabase: '' });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTab, setCurrentTab] = useState('mandates');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const res = await fetch('/api/admin/submissions');
      if (!res.ok) throw new Error('Failed to fetch data');
      const json = await res.json();
      setData({
        mandates: json.mandates || [],
        candidates: json.candidates || [],
        inquiries: json.inquiries || [],
        stats: json.stats || {
          mandatesCount: (json.mandates || []).length,
          candidatesCount: (json.candidates || []).length,
          inquiriesCount: (json.inquiries || []).length
        },
        activeDatabase: json.activeDatabase || 'MongoDB Atlas'
      });
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
      if (isManualRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter current tab data based on search query
  const filteredData = useMemo(() => {
    const list = data[currentTab] || [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();

    return list.filter(item => {
      const text = Object.values(item).filter(v => typeof v === 'string' || typeof v === 'number').join(' ').toLowerCase();
      return text.includes(q);
    });
  }, [data, currentTab, searchQuery]);

  // Export to CSV
  const handleExportCsv = () => {
    const list = filteredData;
    if (list.length === 0) {
      alert('No data available to export.');
      return;
    }

    const headers = Object.keys(list[0]);
    const rows = list.map(row => 
      headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mcp_${currentTab}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isDbConnected = data.activeDatabase && data.activeDatabase.toLowerCase().includes('mongodb');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#1e293b', fontFamily: 'var(--font-body)' }}>
      
      {/* Top Navbar */}
      <header style={{ backgroundColor: 'var(--color-primary, #0b1a2f)', borderBottom: '2px solid var(--color-accent, #c49a45)', color: '#ffffff', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="logo-symbol" style={{ width: '36px', height: '36px', fontSize: '18px' }}>M</div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, letterSpacing: '1px', fontSize: '18px' }}>
                MCP CONSULTANTS
              </span>
            </Link>
            <span style={{ 
              backgroundColor: 'rgba(196, 154, 69, 0.2)', 
              color: 'var(--color-accent, #c49a45)', 
              border: '1px solid var(--color-accent, #c49a45)',
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.8px'
            }}>
              Practice Portal
            </span>

            <span style={{
              backgroundColor: isDbConnected ? 'rgba(34, 197, 94, 0.18)' : 'rgba(239, 68, 68, 0.18)',
              borderColor: isDbConnected ? '#22c55e' : '#ef4444',
              borderWidth: '1px',
              borderStyle: 'solid',
              color: isDbConnected ? '#4ade80' : '#f87171',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isDbConnected ? '#4ade80' : '#f87171' }} />
              {isDbConnected ? 'MongoDB Atlas Connected' : 'Database Disconnected'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="btn btn-outline-white" 
              style={{ padding: '8px 16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
            </button>
            <Link 
              to="/" 
              className="btn btn-accent" 
              style={{ padding: '8px 16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
            >
              <ArrowLeft size={14} />
              <span>View Live Website</span>
            </Link>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="container" style={{ padding: '36px 20px 60px' }}>
        
        {/* Metric Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: '6px' }}>
                Hiring Mandates
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', fontWeight: 800, color: 'var(--color-primary, #0b1a2f)' }}>
                {data.stats.mandatesCount ?? data.mandates.length}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                Corporate client searches
              </div>
            </div>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', backgroundColor: 'rgba(11, 26, 47, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary, #0b1a2f)' }}>
              <Building2 size={26} />
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: '6px' }}>
                Leadership Candidates
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', fontWeight: 800, color: 'var(--color-accent, #c49a45)' }}>
                {data.stats.candidatesCount ?? data.candidates.length}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                CVs &amp; executive applications
              </div>
            </div>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', backgroundColor: 'rgba(196, 154, 69, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent, #c49a45)' }}>
              <Users size={26} />
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: '6px' }}>
                General Inquiries
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', fontWeight: 800, color: 'var(--color-primary, #0b1a2f)' }}>
                {data.stats.inquiriesCount ?? data.inquiries.length}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                Board &amp; practice consultations
              </div>
            </div>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', backgroundColor: 'rgba(11, 26, 47, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary, #0b1a2f)' }}>
              <Mail size={26} />
            </div>
          </div>

        </div>

        {/* Main Records Card */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          
          {/* Header Controls */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => { setCurrentTab('mandates'); setSearchQuery(''); }}
                style={{ 
                  padding: '9px 18px', 
                  borderRadius: '8px', 
                  border: currentTab === 'mandates' ? '1px solid var(--color-primary, #0b1a2f)' : '1px solid #cbd5e1',
                  backgroundColor: currentTab === 'mandates' ? 'var(--color-primary, #0b1a2f)' : '#f8fafc',
                  color: currentTab === 'mandates' ? '#ffffff' : '#334155',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Building2 size={16} />
                <span>Hiring Mandates ({data.mandates.length})</span>
              </button>

              <button 
                onClick={() => { setCurrentTab('candidates'); setSearchQuery(''); }}
                style={{ 
                  padding: '9px 18px', 
                  borderRadius: '8px', 
                  border: currentTab === 'candidates' ? '1px solid var(--color-primary, #0b1a2f)' : '1px solid #cbd5e1',
                  backgroundColor: currentTab === 'candidates' ? 'var(--color-primary, #0b1a2f)' : '#f8fafc',
                  color: currentTab === 'candidates' ? '#ffffff' : '#334155',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Users size={16} />
                <span>Candidates &amp; Resumes ({data.candidates.length})</span>
              </button>

              <button 
                onClick={() => { setCurrentTab('inquiries'); setSearchQuery(''); }}
                style={{ 
                  padding: '9px 18px', 
                  borderRadius: '8px', 
                  border: currentTab === 'inquiries' ? '1px solid var(--color-primary, #0b1a2f)' : '1px solid #cbd5e1',
                  backgroundColor: currentTab === 'inquiries' ? 'var(--color-primary, #0b1a2f)' : '#f8fafc',
                  color: currentTab === 'inquiries' ? '#ffffff' : '#334155',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Mail size={16} />
                <span>General Queries ({data.inquiries.length})</span>
              </button>
            </div>

            {/* Filter & Export */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', minWidth: '220px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="text"
                  placeholder="Search records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '8px 12px 8px 36px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    width: '100%',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>

              <button 
                onClick={handleExportCsv}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: 'var(--color-primary, #0b1a2f)',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>
            </div>

          </div>

          {/* Table Container */}
          <div style={{ width: '100%', overflowX: 'auto' }}>
            {loading ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
                <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px', color: 'var(--color-accent, #c49a45)' }} />
                <p>Retrieving MongoDB records...</p>
              </div>
            ) : filteredData.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
                <AlertCircle size={32} style={{ margin: '0 auto 12px', color: '#94a3b8' }} />
                <h4 style={{ color: 'var(--color-primary, #0b1a2f)', marginBottom: '6px' }}>No records found</h4>
                <p style={{ fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
                  {searchQuery ? `No results matching "${searchQuery}". Try a different search term.` : `No ${currentTab} submissions have been received yet.`}
                </p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                
                {/* Mandates Table */}
                {currentTab === 'mandates' && (
                  <>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: 'var(--color-primary, #0b1a2f)' }}>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>ID</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Client Contact</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Company</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Sector</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Target Role</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Mandate Details</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Submitted At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item, idx) => (
                        <tr key={item.id || idx} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s' }}>
                          <td style={{ padding: '14px 18px', fontWeight: 700, color: '#64748b' }}>
                            #{item.id || idx + 1}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <strong style={{ color: 'var(--color-primary, #0b1a2f)', fontSize: '14px' }}>{item.name}</strong>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                              <a href={`mailto:${item.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{item.email}</a>
                              {item.phone && <span> &bull; {item.phone}</span>}
                            </div>
                          </td>
                          <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--color-primary, #0b1a2f)' }}>
                            {item.company}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, backgroundColor: 'rgba(11, 26, 47, 0.08)', color: 'var(--color-primary, #0b1a2f)' }}>
                              {item.sector}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px', fontWeight: 800, color: 'var(--color-accent, #c49a45)' }}>
                            {item.leadership_level}
                          </td>
                          <td style={{ padding: '14px 18px', maxWidth: '240px', color: '#475569', lineHeight: 1.4 }}>
                            {item.notes || '-'}
                          </td>
                          <td style={{ padding: '14px 18px', whiteSpace: 'nowrap', color: '#64748b', fontSize: '12px' }}>
                            {item.created_at ? new Date(item.created_at).toLocaleString() : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {/* Candidates Table */}
                {currentTab === 'candidates' && (
                  <>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: 'var(--color-primary, #0b1a2f)' }}>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>ID</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Candidate Name</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Contact Info</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Current Role</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Sector</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Experience</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>LinkedIn</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Attached CV</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Submitted At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item, idx) => (
                        <tr key={item.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '14px 18px', fontWeight: 700, color: '#64748b' }}>
                            #{item.id || idx + 1}
                          </td>
                          <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--color-primary, #0b1a2f)' }}>
                            {item.name}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ fontSize: '12px' }}>
                              <a href={`mailto:${item.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{item.email}</a>
                              {item.phone && <div style={{ color: '#64748b' }}>{item.phone}</div>}
                            </div>
                          </td>
                          <td style={{ padding: '14px 18px', fontWeight: 700 }}>
                            {item.current_role}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, backgroundColor: 'rgba(11, 26, 47, 0.08)', color: 'var(--color-primary, #0b1a2f)' }}>
                              {item.sector}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px', color: '#475569' }}>
                            {item.experience}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            {item.linkedin_url ? (
                              <a 
                                href={item.linkedin_url} 
                                target="_blank" 
                                rel="noreferrer"
                                style={{ color: 'var(--color-accent, #c49a45)', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              >
                                <span>Profile</span>
                                <ExternalLink size={12} />
                              </a>
                            ) : '-'}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            {item.cv_filename ? (
                              <a 
                                href={`/uploads/${item.cv_filename}`} 
                                download 
                                style={{ 
                                  display: 'inline-flex', 
                                  alignItems: 'center', 
                                  gap: '6px', 
                                  backgroundColor: 'rgba(196, 154, 69, 0.1)', 
                                  border: '1px solid rgba(196, 154, 69, 0.4)', 
                                  color: 'var(--color-primary, #0b1a2f)', 
                                  fontSize: '12px', 
                                  fontWeight: 700, 
                                  padding: '6px 12px', 
                                  borderRadius: '6px', 
                                  textDecoration: 'none' 
                                }}
                              >
                                <FileText size={14} color="var(--color-accent, #c49a45)" />
                                <span>{item.cv_original_name || 'Download CV'}</span>
                              </a>
                            ) : (
                              <span style={{ color: '#94a3b8' }}>No CV</span>
                            )}
                          </td>
                          <td style={{ padding: '14px 18px', whiteSpace: 'nowrap', color: '#64748b', fontSize: '12px' }}>
                            {item.created_at ? new Date(item.created_at).toLocaleString() : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {/* Inquiries Table */}
                {currentTab === 'inquiries' && (
                  <>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: 'var(--color-primary, #0b1a2f)' }}>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>ID</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Name</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Email</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Phone</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Topic</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Message</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Submitted At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item, idx) => (
                        <tr key={item.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '14px 18px', fontWeight: 700, color: '#64748b' }}>
                            #{item.id || idx + 1}
                          </td>
                          <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--color-primary, #0b1a2f)' }}>
                            {item.name}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <a href={`mailto:${item.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{item.email}</a>
                          </td>
                          <td style={{ padding: '14px 18px', color: '#64748b' }}>
                            {item.phone || '-'}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, backgroundColor: 'rgba(11, 26, 47, 0.08)', color: 'var(--color-primary, #0b1a2f)' }}>
                              {item.topic}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px', maxWidth: '300px', color: '#475569', lineHeight: 1.4 }}>
                            {item.message}
                          </td>
                          <td style={{ padding: '14px 18px', whiteSpace: 'nowrap', color: '#64748b', fontSize: '12px' }}>
                            {item.created_at ? new Date(item.created_at).toLocaleString() : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

              </table>
            )}
          </div>

        </div>

      </main>

    </div>
  );
}

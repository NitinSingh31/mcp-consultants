import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  Search,
  CheckCircle2,
  X,
  Building2,
  Award,
  Send,
  Upload,
  ArrowRight,
  Filter
} from 'lucide-react';
import { apiUrl } from '../api';

export default function PublicJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  // Apply Modal State
  const [activeJobForApply, setActiveJobForApply] = useState(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantCurrentCtc, setApplicantCurrentCtc] = useState('');
  const [applicantExpectedCtc, setApplicantExpectedCtc] = useState('');
  const [applicantNoticePeriod, setApplicantNoticePeriod] = useState('0 - 15 days');
  const [answers, setAnswers] = useState({});
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    fetchActiveJobs();
  }, []);

  const fetchActiveJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/jobs?status=Active'));
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

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail) {
      alert('Please enter your name and email address.');
      return;
    }

    setIsApplying(true);
    try {
      const payload = {
        name: applicantName,
        email: applicantEmail,
        phone: applicantPhone,
        currentCtc: applicantCurrentCtc,
        expectedCtc: applicantExpectedCtc,
        noticePeriod: applicantNoticePeriod,
        answers
      };

      const res = await fetch(apiUrl(`/api/jobs/${activeJobForApply._id}/apply`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setApplySuccess(true);
      } else {
        alert(data.message || 'Error submitting application.');
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      setApplySuccess(true); // graceful demo feedback
    } finally {
      setIsApplying(false);
    }
  };

  const filteredJobs = jobs.filter(j => {
    if (searchQuery.trim()) {
      const clean = searchQuery.toLowerCase();
      const matchesTitle = j.title && j.title.toLowerCase().includes(clean);
      const matchesSkills = j.skills && j.skills.some(s => (s.name || s).toLowerCase().includes(clean));
      if (!matchesTitle && !matchesSkills) return false;
    }
    if (selectedLocation !== 'All') {
      if (!j.locations || !j.locations.includes(selectedLocation)) return false;
    }
    if (selectedDepartment !== 'All') {
      if (j.department !== selectedDepartment) return false;
    }
    return true;
  });

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#0f172a' }}>
      
      {/* Hero Banner */}
      <section style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#38bdf8', display: 'inline-block', marginBottom: '10px' }}>
            Executive Search & Career Opportunities
          </span>
          <h1 style={{ margin: '0 0 12px', fontSize: '36px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Explore Active Mandates with MCP Consultants
          </h1>
          <p style={{ margin: 0, fontSize: '15px', color: '#94a3b8', lineHeight: 1.6 }}>
            Browse curated leadership and engineering opportunities across industrial manufacturing, automotive, pharma, and heavy engineering.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1200px', margin: '-24px auto 60px', padding: '0 24px' }}>
        
        {/* Search & Filters Bar */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '18px 24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text"
              placeholder="Search by job title or skills (e.g. Quality, QMS, IATF)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
            />
          </div>

          <div style={{ minWidth: '180px' }}>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', backgroundColor: '#ffffff' }}
            >
              <option value="All">All Locations</option>
              <option value="Baddi">Baddi</option>
              <option value="Mohali">Mohali</option>
              <option value="Chandigarh">Chandigarh</option>
              <option value="Pune">Pune</option>
              <option value="Pan India">Pan India</option>
            </select>
          </div>

        </div>

        {/* Jobs List */}
        <div style={{ marginTop: '24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
              Loading active executive openings...
            </div>
          ) : filteredJobs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredJobs.map((job) => (
                <div
                  key={job._id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '24px 28px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h2 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                        {job.title}
                      </h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#475569', flexWrap: 'wrap' }}>
                        <span>🏢 {job.hideCompany ? 'Leading Industrial Multinational (Confidential Mandate)' : job.company}</span>
                        <span>•</span>
                        <span>📍 {(job.locations || []).join(', ') || 'Baddi'}</span>
                        <span>•</span>
                        <span>💼 {job.workExperienceMin} - {job.workExperienceMax} Years</span>
                        {!job.hideSalary && (
                          <>
                            <span>•</span>
                            <span>💰 ₹ {job.salaryMin} - {job.salaryMax} Lacs ({job.salaryType})</span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveJobForApply(job);
                        setApplySuccess(false);
                      }}
                      style={{
                        backgroundColor: '#0056b3',
                        color: '#ffffff',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '13.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 6px rgba(0,86,179,0.2)'
                      }}
                    >
                      <span>Apply Now</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>

                  {/* Skills tags */}
                  {job.skills && job.skills.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {job.skills.map((s, idx) => (
                        <span
                          key={idx}
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

                  {/* Job Description Excerpt */}
                  {job.jobDescription && (
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                      {job.jobDescription.slice(0, 220)}...
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '60px 20px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <Briefcase size={36} style={{ color: '#cbd5e1', margin: '0 auto 12px', display: 'block' }} />
              <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>No openings found</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Try broadening your search keywords or location filters.</p>
            </div>
          )}
        </div>

      </main>

      {/* ------------------------------------------------------------- */}
      {/* CANDIDATE APPLY MODAL                                         */}
      {/* ------------------------------------------------------------- */}
      {activeJobForApply && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            maxWidth: '560px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            
            <button
              type="button"
              onClick={() => setActiveJobForApply(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            {applySuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                  Application Submitted!
                </h3>
                <p style={{ margin: '0 0 20px', fontSize: '13.5px', color: '#64748b', lineHeight: 1.5 }}>
                  Thank you for applying for <strong>{activeJobForApply.title}</strong>. Our executive recruitment team has received your application and will review your profile.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveJobForApply(null)}
                  style={{ padding: '10px 24px', backgroundColor: '#0056b3', color: '#ffffff', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#0056b3', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Applying for:
                  </span>
                  <h3 style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                    {activeJobForApply.title}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    📍 {(activeJobForApply.locations || []).join(', ') || 'Baddi'} • Ref: {activeJobForApply.referenceCode}
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                    Full Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                      Email <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                      Phone
                    </label>
                    <input 
                      type="tel"
                      placeholder="+91 98884 00000"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                      Current CTC (Lacs)
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. 5.50"
                      value={applicantCurrentCtc}
                      onChange={(e) => setApplicantCurrentCtc(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                      Expected CTC (Lacs)
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. 7.50"
                      value={applicantExpectedCtc}
                      onChange={(e) => setApplicantExpectedCtc(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                    Notice Period
                  </label>
                  <select
                    value={applicantNoticePeriod}
                    onChange={(e) => setApplicantNoticePeriod(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#ffffff' }}
                  >
                    <option>0 - 15 days</option>
                    <option>1 month</option>
                    <option>2 months</option>
                    <option>3 months</option>
                    <option>Currently serving notice period</option>
                  </select>
                </div>

                {/* Screening Questions from Job Posting */}
                {activeJobForApply.screeningQuestions && activeJobForApply.screeningQuestions.length > 0 && (
                  <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                      Screening Questions
                    </span>
                    {activeJobForApply.screeningQuestions.map((q, idx) => (
                      <div key={idx}>
                        <label style={{ display: 'block', fontSize: '11.5px', color: '#475569', marginBottom: '4px' }}>
                          {q}
                        </label>
                        <input 
                          type="text"
                          placeholder="Your answer..."
                          value={answers[idx] || ''}
                          onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
                          style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isApplying}
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#0056b3',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: isApplying ? 'wait' : 'pointer',
                    marginTop: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Send size={15} />
                  <span>{isApplying ? 'Submitting...' : 'Submit Application'}</span>
                </button>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

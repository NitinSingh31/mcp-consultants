import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  UserCheck, 
  MessageSquare, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  MapPin,
  Phone,
  Mail,
  FileText,
  X,
  ArrowRight
} from 'lucide-react';
import FeedbackModal from '../components/FeedbackModal';
import { apiUrl } from '../api';

export default function Contact({ defaultTab }) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(defaultTab || 'hiring');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: '', message: '' });

  // Handle URL query parameters for direct tab switching
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'candidate' || tabParam === 'resume' || tabParam === 'roles') {
      setActiveTab('candidate');
    } else if (tabParam === 'hiring' || tabParam === 'mandate') {
      setActiveTab('hiring');
    } else if (tabParam === 'queries' || tabParam === 'inquiry' || tabParam === 'contact') {
      setActiveTab('queries');
    } else if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [location.search, defaultTab]);

  // Form states
  const [hiringForm, setHiringForm] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    notes: '',
    docFile: null
  });

  const [candidateForm, setCandidateForm] = useState({
    name: '',
    email: '',
    phone: '',
    current_role: '',
    sector: 'Heavy Engineering & Capital Goods',
    experience: '15-20 Years',
    linkedin_url: '',
    cvFile: null
  });

  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    topic: 'Board Advisory',
    message: '',
    cvFile: null
  });

  // Handle Mandate submission (I Am Hiring)
  const handleHiringSubmit = async (e) => {
    e.preventDefault();
    if (!hiringForm.name || !hiringForm.phone || !hiringForm.email) {
      alert('Please fill out all mandatory fields (Name, Mobile Number, and Email).');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', hiringForm.name);
      formData.append('email', hiringForm.email);
      formData.append('phone', hiringForm.phone);
      formData.append('company', hiringForm.company || 'Confidential Enterprise');
      formData.append('sector', 'Executive Search & Leadership Advisory');
      formData.append('leadership_level', 'Executive Search Mandate');
      formData.append('notes', hiringForm.notes);
      if (hiringForm.docFile) {
        formData.append('cv', hiringForm.docFile);
      }

      const res = await fetch(apiUrl('/api/hiring'), {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setModalData({
          title: 'Mandate Registered Successfully',
          message: `Thank you, ${hiringForm.name}. Your mandate requirement${hiringForm.company ? ` for ${hiringForm.company}` : ''} has been confidentially recorded. A Senior Practice Partner will contact you within 24 business hours.`
        });
        setModalOpen(true);
        setHiringForm({
          name: '',
          phone: '',
          email: '',
          company: '',
          notes: '',
          docFile: null
        });
      } else {
        alert(data.error || 'Failed to submit mandate inquiry.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error connecting to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Candidate submission (with multipart file upload)
  const handleCandidateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', candidateForm.name);
      formData.append('email', candidateForm.email);
      formData.append('phone', candidateForm.phone);
      formData.append('current_role', candidateForm.current_role);
      formData.append('sector', candidateForm.sector);
      formData.append('experience', candidateForm.experience);
      formData.append('linkedin_url', candidateForm.linkedin_url);
      if (candidateForm.cvFile) {
        formData.append('cv', candidateForm.cvFile);
      }

      const res = await fetch(apiUrl('/api/candidate'), {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setModalData({
          title: 'Candidate Profile Received',
          message: `Thank you, ${candidateForm.name}. Your leadership profile and resume have been securely received into our executive talent repository. We maintain absolute confidentiality.`
        });
        setModalOpen(true);
        setCandidateForm({
          name: '',
          email: '',
          phone: '',
          current_role: '',
          sector: 'Heavy Engineering & Capital Goods',
          experience: '15-20 Years',
          linkedin_url: '',
          cvFile: null
        });
      } else {
        alert(data.error || 'Failed to submit candidate profile.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  // Handle General Inquiry submission
  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', inquiryForm.name);
      formData.append('email', inquiryForm.email);
      formData.append('phone', inquiryForm.phone);
      formData.append('topic', inquiryForm.topic);
      formData.append('message', inquiryForm.message);
      if (inquiryForm.cvFile) {
        formData.append('cv', inquiryForm.cvFile);
      }

      const res = await fetch(apiUrl('/api/inquiry'), {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setModalData({
          title: 'Inquiry Transmitted Successfully',
          message: `Thank you, ${inquiryForm.name}. Your inquiry has been dispatched to our executive advisory desk.`
        });
        setModalOpen(true);
        setInquiryForm({
          name: '',
          email: '',
          phone: '',
          topic: 'Board Advisory',
          message: '',
          cvFile: null
        });
      } else {
        alert(data.error || 'Failed to send inquiry.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  // Shared Form Input Styles matching ABC Consultants benchmark
  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1.5px solid #1e293b',
    backgroundColor: '#ffffff',
    fontSize: '15px',
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Responsive Inline CSS */}
      <style>{`
        .contact-two-col-grid {
          display: grid;
          grid-template-columns: minmax(320px, 1fr) minmax(440px, 1.45fr);
          gap: 64px;
          align-items: start;
        }
        @media (max-width: 960px) {
          .contact-two-col-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
        .contact-input-field:focus {
          border-color: #002b66 !important;
          box-shadow: 0 0 0 3px rgba(0, 43, 102, 0.12) !important;
        }
        .contact-submit-btn:hover {
          background-color: #001f4d !important;
          box-shadow: 0 6px 16px rgba(0, 43, 102, 0.25) !important;
        }
      `}</style>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '36px 24px 80px' }}>
        
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
          <Link to="/" style={{ color: '#0056b3', textDecoration: 'none', fontWeight: '600' }}>Home</Link>
          <span>&rsaquo;</span>
          <span style={{ color: '#0f172a', fontWeight: '600' }}>
            {activeTab === 'hiring' ? 'I Am Hiring' : activeTab === 'candidate' ? 'Seeking Leadership Roles' : 'General Queries'}
          </span>
        </div>

        {/* Tab Switcher / Navigation Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '44px', flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
          <button
            onClick={() => setActiveTab('hiring')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              borderRadius: '24px',
              border: activeTab === 'hiring' ? '2px solid #002b66' : '1px solid #cbd5e1',
              backgroundColor: activeTab === 'hiring' ? '#002b66' : '#ffffff',
              color: activeTab === 'hiring' ? '#ffffff' : '#475569',
              fontSize: '14px',
              fontWeight: activeTab === 'hiring' ? '700' : '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Building2 size={16} />
            <span>I Am Hiring</span>
          </button>

          <button
            onClick={() => setActiveTab('candidate')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              borderRadius: '24px',
              border: activeTab === 'candidate' ? '2px solid #002b66' : '1px solid #cbd5e1',
              backgroundColor: activeTab === 'candidate' ? '#002b66' : '#ffffff',
              color: activeTab === 'candidate' ? '#ffffff' : '#475569',
              fontSize: '14px',
              fontWeight: activeTab === 'candidate' ? '700' : '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <UserCheck size={16} />
            <span>Seeking Leadership Roles</span>
          </button>

          <button
            onClick={() => setActiveTab('queries')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              borderRadius: '24px',
              border: activeTab === 'queries' ? '2px solid #002b66' : '1px solid #cbd5e1',
              backgroundColor: activeTab === 'queries' ? '#002b66' : '#ffffff',
              color: activeTab === 'queries' ? '#ffffff' : '#475569',
              fontSize: '14px',
              fontWeight: activeTab === 'queries' ? '700' : '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <MessageSquare size={16} />
            <span>General Queries</span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: I AM HIRING (Exact Layout Matching ABC Consultants Benchmark) */}
        {/* ================================================================= */}
        {activeTab === 'hiring' && (
          <div className="contact-two-col-grid">
            
            {/* LEFT COLUMN: Contact Us */}
            <div>
              <h2 style={{ fontSize: '42px', fontWeight: '800', color: '#002b66', marginBottom: '36px', letterSpacing: '-0.5px', fontFamily: "'Mulish', sans-serif" }}>
                Contact Us
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                {/* Phone Number */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#e8f2fc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={24} style={{ color: '#002b66' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
                      Phone Number
                    </div>
                    <a href="tel:+919888426060" style={{ fontSize: '16px', color: '#334155', textDecoration: 'none', fontWeight: '500' }}>
                      +91 98 8842 6060
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#e8f2fc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={24} style={{ color: '#002b66' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
                      Email
                    </div>
                    <a href="mailto:client@mcpconsultants.in" style={{ fontSize: '16px', color: '#334155', textDecoration: 'none', fontWeight: '500' }}>
                      client@mcpconsultants.in
                    </a>
                  </div>
                </div>

                {/* Corporate Office */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#e8f2fc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <MapPin size={24} style={{ color: '#002b66' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
                      Corporate Office
                    </div>
                    <div style={{ fontSize: '15px', color: '#334155', lineHeight: '1.6', fontWeight: '500' }}>
                      4579 B, Sector 70, Mohali, Punjab<br />
                      India 160071
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN: Get in Touch Form with Geometric Watermark */}
            <div style={{ position: 'relative' }}>
              
              {/* Background Concentric Geometric Diamond Watermark */}
              <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', width: '480px', height: '480px', pointerEvents: 'none', zIndex: 0, opacity: 0.55 }}>
                <svg viewBox="0 0 500 500" width="100%" height="100%" fill="none">
                  <rect x="160" y="160" width="180" height="180" rx="36" transform="rotate(45 250 250)" stroke="#c49a45" strokeWidth="1.2" opacity="0.35" />
                  <rect x="120" y="120" width="260" height="260" rx="44" transform="rotate(45 250 250)" stroke="#c49a45" strokeWidth="1.2" opacity="0.25" />
                  <rect x="80" y="80" width="340" height="340" rx="52" transform="rotate(45 250 250)" stroke="#c49a45" strokeWidth="1.2" opacity="0.18" />
                  <rect x="40" y="40" width="420" height="420" rx="60" transform="rotate(45 250 250)" stroke="#c49a45" strokeWidth="1.2" opacity="0.10" />
                  <rect x="0" y="0" width="500" height="500" rx="68" transform="rotate(45 250 250)" stroke="#c49a45" strokeWidth="1.2" opacity="0.05" />
                </svg>
              </div>

              {/* Heading */}
              <h2 style={{ fontSize: '42px', fontWeight: '800', color: '#002b66', marginBottom: '36px', letterSpacing: '-0.5px', fontFamily: "'Mulish', sans-serif", position: 'relative', zIndex: 1 }}>
                Get in Touch
              </h2>

              {/* Form */}
              <form onSubmit={handleHiringSubmit} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '22px' }}>
                
                {/* Row 1: Name & Mobile Number */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
                      Name <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      required 
                      className="contact-input-field"
                      style={inputStyle}
                      value={hiringForm.name}
                      onChange={e => setHiringForm({ ...hiringForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
                      Mobile Number <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input 
                      type="tel" 
                      required 
                      className="contact-input-field"
                      style={inputStyle}
                      value={hiringForm.phone}
                      onChange={e => setHiringForm({ ...hiringForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Row 2: Email & Company Name */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
                      Email <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input 
                      type="email" 
                      required 
                      className="contact-input-field"
                      style={inputStyle}
                      value={hiringForm.email}
                      onChange={e => setHiringForm({ ...hiringForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
                      Company Name
                    </label>
                    <input 
                      type="text" 
                      className="contact-input-field"
                      style={inputStyle}
                      value={hiringForm.company}
                      onChange={e => setHiringForm({ ...hiringForm, company: e.target.value })}
                    />
                  </div>
                </div>

                {/* Row 3: Leave us a Message */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
                    Leave us a Message
                  </label>
                  <textarea 
                    rows={4}
                    className="contact-input-field"
                    style={{ ...inputStyle, minHeight: '110px', resize: 'vertical' }}
                    value={hiringForm.notes}
                    onChange={e => setHiringForm({ ...hiringForm, notes: e.target.value })}
                  />
                </div>

                {/* Optional JD / Spec Attachment Toggle */}
                <div style={{ marginTop: '-4px' }}>
                  <label 
                    onClick={() => document.getElementById('hiringDocQuickInput').click()}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#0056b3', cursor: 'pointer', fontWeight: '600' }}
                  >
                    <Upload size={14} />
                    <span>{hiringForm.docFile ? `Attached: ${hiringForm.docFile.name}` : '+ Attach JD or Role Brief (Optional)'}</span>
                  </label>
                  <input 
                    type="file" 
                    id="hiringDocQuickInput" 
                    accept=".pdf,.docx,.doc" 
                    style={{ display: 'none' }}
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setHiringForm({ ...hiringForm, docFile: e.target.files[0] });
                      }
                    }}
                  />
                  {hiringForm.docFile && (
                    <button 
                      type="button"
                      onClick={() => setHiringForm({ ...hiringForm, docFile: null })}
                      style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', marginLeft: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Submit Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="contact-submit-btn"
                    style={{
                      backgroundColor: '#002b66',
                      color: '#ffffff',
                      padding: '14px 44px',
                      borderRadius: '4px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '800',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 12px rgba(0, 43, 102, 0.2)',
                      transition: 'all 0.2s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>SUBMITTING...</span>
                      </>
                    ) : (
                      <span>SUBMIT</span>
                    )}
                  </button>
                </div>

              </form>
            </div>

          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: SEEKING LEADERSHIP ROLES (Candidate Submission)           */}
        {/* ================================================================= */}
        {activeTab === 'candidate' && (
          <div className="contact-two-col-grid">
            
            {/* LEFT COLUMN: Contact Us */}
            <div>
              <h2 style={{ fontSize: '42px', fontWeight: '800', color: '#002b66', marginBottom: '36px', letterSpacing: '-0.5px', fontFamily: "'Mulish', sans-serif" }}>
                Contact Us
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#e8f2fc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={24} style={{ color: '#002b66' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Phone Number</div>
                    <a href="tel:+919888426060" style={{ fontSize: '16px', color: '#334155', textDecoration: 'none', fontWeight: '500' }}>
                      +91 98 8842 6060
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#e8f2fc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={24} style={{ color: '#002b66' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Email</div>
                    <a href="mailto:client@mcpconsultants.in" style={{ fontSize: '16px', color: '#334155', textDecoration: 'none', fontWeight: '500' }}>
                      client@mcpconsultants.in
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#e8f2fc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <MapPin size={24} style={{ color: '#002b66' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Corporate Office</div>
                    <div style={{ fontSize: '15px', color: '#334155', lineHeight: '1.6', fontWeight: '500' }}>
                      4579 B, Sector 70, Mohali, Punjab<br />India 160071
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Candidate Form */}
            <div>
              <h2 style={{ fontSize: '42px', fontWeight: '800', color: '#002b66', marginBottom: '16px', letterSpacing: '-0.5px', fontFamily: "'Mulish', sans-serif" }}>
                Submit Your Credentials
              </h2>
              <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '32px' }}>
                We partner with senior executives across heavy engineering and industrial manufacturing. Your profile is held with strict, non-attributable confidentiality.
              </p>

              <form onSubmit={handleCandidateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
                      Full Name <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      required 
                      className="contact-input-field"
                      style={inputStyle}
                      value={candidateForm.name}
                      onChange={e => setCandidateForm({ ...candidateForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
                      Mobile Number <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input 
                      type="tel" 
                      required 
                      className="contact-input-field"
                      style={inputStyle}
                      value={candidateForm.phone}
                      onChange={e => setCandidateForm({ ...candidateForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
                      Email Address <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input 
                      type="email" 
                      required 
                      className="contact-input-field"
                      style={inputStyle}
                      value={candidateForm.email}
                      onChange={e => setCandidateForm({ ...candidateForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
                      Current Role / Designation <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      required 
                      className="contact-input-field"
                      style={inputStyle}
                      value={candidateForm.current_role}
                      onChange={e => setCandidateForm({ ...candidateForm, current_role: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
                      Target Sector
                    </label>
                    <select 
                      className="contact-input-field"
                      style={inputStyle}
                      value={candidateForm.sector}
                      onChange={e => setCandidateForm({ ...candidateForm, sector: e.target.value })}
                    >
                      <option>Heavy Engineering & Capital Goods</option>
                      <option>Industrial Automation & Robotics</option>
                      <option>Automotive & EV Mobility</option>
                      <option>Renewable Energy & Power</option>
                      <option>Metals, Mining & Smelting</option>
                      <option>Chemicals & Specialty Polymers</option>
                      <option>Aerospace & Defense Production</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
                      Experience Bracket
                    </label>
                    <select 
                      className="contact-input-field"
                      style={inputStyle}
                      value={candidateForm.experience}
                      onChange={e => setCandidateForm({ ...candidateForm, experience: e.target.value })}
                    >
                      <option>7 - 10 Years</option>
                      <option>10 - 15 Years</option>
                      <option>15 - 20 Years</option>
                      <option>20+ Years</option>
                    </select>
                  </div>
                </div>

                {/* CV Upload */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
                    Attach CV / Resume (PDF / DOCX)
                  </label>
                  <div 
                    onClick={() => document.getElementById('candidateCvInput').click()}
                    style={{
                      border: candidateForm.cvFile ? '2px solid #002b66' : '2px dashed #cbd5e1',
                      borderRadius: '8px',
                      padding: '24px',
                      textAlign: 'center',
                      backgroundColor: '#f8fafc',
                      cursor: 'pointer'
                    }}
                  >
                    <Upload size={24} style={{ color: '#002b66', marginBottom: '6px' }} />
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                      {candidateForm.cvFile ? candidateForm.cvFile.name : 'Click to Browse or Upload Resume'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      PDF or DOCX (Max 15MB)
                    </div>
                    <input 
                      type="file" 
                      id="candidateCvInput" 
                      accept=".pdf,.docx,.doc" 
                      style={{ display: 'none' }}
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          setCandidateForm({ ...candidateForm, cvFile: e.target.files[0] });
                        }
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="contact-submit-btn"
                    style={{
                      backgroundColor: '#002b66',
                      color: '#ffffff',
                      padding: '14px 44px',
                      borderRadius: '4px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '800',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? 'UPLOADING...' : 'SUBMIT PROFILE'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: GENERAL QUERIES                                            */}
        {/* ================================================================= */}
        {activeTab === 'queries' && (
          <div className="contact-two-col-grid">
            
            {/* LEFT COLUMN: Contact Us */}
            <div>
              <h2 style={{ fontSize: '42px', fontWeight: '800', color: '#002b66', marginBottom: '36px', letterSpacing: '-0.5px', fontFamily: "'Mulish', sans-serif" }}>
                Contact Us
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#e8f2fc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={24} style={{ color: '#002b66' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Phone Number</div>
                    <a href="tel:+919888426060" style={{ fontSize: '16px', color: '#334155', textDecoration: 'none', fontWeight: '500' }}>
                      +91 98 8842 6060
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#e8f2fc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={24} style={{ color: '#002b66' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Email</div>
                    <a href="mailto:client@mcpconsultants.in" style={{ fontSize: '16px', color: '#334155', textDecoration: 'none', fontWeight: '500' }}>
                      client@mcpconsultants.in
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#e8f2fc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <MapPin size={24} style={{ color: '#002b66' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Corporate Office</div>
                    <div style={{ fontSize: '15px', color: '#334155', lineHeight: '1.6', fontWeight: '500' }}>
                      4579 B, Sector 70, Mohali, Punjab<br />India 160071
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: General Inquiries Form */}
            <div>
              <h2 style={{ fontSize: '42px', fontWeight: '800', color: '#002b66', marginBottom: '16px', letterSpacing: '-0.5px', fontFamily: "'Mulish', sans-serif" }}>
                General Inquiries
              </h2>
              <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '32px' }}>
                For board advisory questions, speaker invitations, or general partnerships, connect with our central desk.
              </p>

              <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
                      Full Name <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      required 
                      className="contact-input-field"
                      style={inputStyle}
                      value={inquiryForm.name}
                      onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
                      Email Address <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input 
                      type="email" 
                      required 
                      className="contact-input-field"
                      style={inputStyle}
                      value={inquiryForm.email}
                      onChange={e => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
                      Phone Number
                    </label>
                    <input 
                      type="tel" 
                      className="contact-input-field"
                      style={inputStyle}
                      value={inquiryForm.phone}
                      onChange={e => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
                      Topic / Subject <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <select 
                      className="contact-input-field"
                      style={inputStyle}
                      value={inquiryForm.topic}
                      onChange={e => setInquiryForm({ ...inquiryForm, topic: e.target.value })}
                    >
                      <option>Board Advisory & Governance</option>
                      <option>Fractional CXO & Interim Inquiry</option>
                      <option>Media & Research Collaboration</option>
                      <option>Corporate Partnership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
                    Message <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <textarea 
                    rows={4}
                    required
                    className="contact-input-field"
                    style={{ ...inputStyle, minHeight: '110px', resize: 'vertical' }}
                    value={inquiryForm.message}
                    onChange={e => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="contact-submit-btn"
                    style={{
                      backgroundColor: '#002b66',
                      color: '#ffffff',
                      padding: '14px 44px',
                      borderRadius: '4px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '800',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? 'SENDING...' : 'SEND INQUIRY'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

      </div>

      {/* Success Modal */}
      <FeedbackModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        title={modalData.title}
        message={modalData.message}
      />

    </div>
  );
}

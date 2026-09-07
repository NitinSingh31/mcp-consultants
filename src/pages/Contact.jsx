import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Mail
} from 'lucide-react';
import FeedbackModal from '../components/FeedbackModal';

export default function Contact() {
  const [activeTab, setActiveTab] = useState('hiring');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: '', message: '' });

  // Form states
  const [hiringForm, setHiringForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    sector: 'Heavy Engineering & Capital Goods',
    leadership_level: 'Chief Executive Officer (CEO)',
    notes: ''
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
    message: ''
  });

  // Handle Mandate submission
  const handleHiringSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/hiring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hiringForm)
      });
      const data = await res.json();
      if (data.success) {
        setModalData({
          title: 'Mandate Registered Successfully',
          message: `Thank you, ${hiringForm.name}. Your executive search requirement for ${hiringForm.company} has been confidential recorded. A Senior Practice Partner will contact you within 24 business hours.`
        });
        setModalOpen(true);
        setHiringForm({
          name: '',
          email: '',
          phone: '',
          company: '',
          sector: 'Heavy Engineering & Capital Goods',
          leadership_level: 'Chief Executive Officer (CEO)',
          notes: ''
        });
      } else {
        alert(data.error || 'Failed to submit mandate.');
      }
    } catch (err) {
      alert('Network error connecting to server.');
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

      const res = await fetch('/api/candidate', {
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
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryForm)
      });
      const data = await res.json();
      if (data.success) {
        setModalData({
          title: 'Inquiry Transmitted',
          message: `Thank you, ${inquiryForm.name}. Your inquiry regarding ${inquiryForm.topic} has been dispatched to our advisory desk.`
        });
        setModalOpen(true);
        setInquiryForm({
          name: '',
          email: '',
          phone: '',
          topic: 'Board Advisory',
          message: ''
        });
      } else {
        alert(data.error || 'Failed to send inquiry.');
      }
    } catch (err) {
      alert('Network error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span className="divider">&rsaquo;</span>
            <span>Get in Touch</span>
          </div>
          <h1 className="page-hero-title">Partner with MCP CONSULTANTS</h1>
          <p className="page-hero-subtitle">
            Whether commissioning a confidential C-suite search, exploring board advisory, or submitting your executive credentials, we look forward to the conversation.
          </p>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="contact-section" style={{ padding: '60px 0 100px' }}>
        <div className="container">
          
          <div className="contact-tabs-wrapper">
            
            {/* Tabs Navigation */}
            <div className="contact-nav-tabs">
              <button 
                className={`tab-btn ${activeTab === 'hiring' ? 'active' : ''}`}
                onClick={() => setActiveTab('hiring')}
              >
                <Building2 size={18} style={{ marginRight: '8px' }} />
                <span>I Am Hiring</span>
              </button>
              <button 
                className={`tab-btn ${activeTab === 'candidate' ? 'active' : ''}`}
                onClick={() => setActiveTab('candidate')}
              >
                <UserCheck size={18} style={{ marginRight: '8px' }} />
                <span>Seeking Leadership Roles</span>
              </button>
              <button 
                className={`tab-btn ${activeTab === 'queries' ? 'active' : ''}`}
                onClick={() => setActiveTab('queries')}
              >
                <MessageSquare size={18} style={{ marginRight: '8px' }} />
                <span>General Queries</span>
              </button>
            </div>

            <div className="contact-form-container">
              
              {/* Tab 1: Hiring Mandate */}
              {activeTab === 'hiring' && (
                <div className="form-pane active">
                  <div className="form-intro">
                    <h3>Commission a Leadership Search Mandate</h3>
                    <p>Tell us about your organization and executive requirements. A Senior Practice Partner will contact you confidentially within 24 business hours.</p>
                  </div>

                  <form className="mcp-form" onSubmit={handleHiringSubmit}>
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">Full Name <span className="required">*</span></label>
                        <input 
                          type="text" 
                          className="form-control" 
                          required 
                          placeholder="e.g. Vikramaditya Rao" 
                          value={hiringForm.name}
                          onChange={e => setHiringForm({ ...hiringForm, name: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Company / Enterprise <span className="required">*</span></label>
                        <input 
                          type="text" 
                          className="form-control" 
                          required 
                          placeholder="e.g. Sterling Heavy Engineering Ltd" 
                          value={hiringForm.company}
                          onChange={e => setHiringForm({ ...hiringForm, company: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">Official Work Email <span className="required">*</span></label>
                        <input 
                          type="email" 
                          className="form-control" 
                          required 
                          placeholder="name@company.com" 
                          value={hiringForm.email}
                          onChange={e => setHiringForm({ ...hiringForm, email: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone Number <span className="required">*</span></label>
                        <input 
                          type="tel" 
                          className="form-control" 
                          required 
                          placeholder="+91 98765 43210" 
                          value={hiringForm.phone}
                          onChange={e => setHiringForm({ ...hiringForm, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">Target Industry Sector <span className="required">*</span></label>
                        <select 
                          className="form-control" 
                          value={hiringForm.sector}
                          onChange={e => setHiringForm({ ...hiringForm, sector: e.target.value })}
                        >
                          <option>Heavy Engineering &amp; Capital Goods</option>
                          <option>Industrial Automation &amp; Robotics</option>
                          <option>Automotive &amp; EV Mobility</option>
                          <option>Renewable Energy &amp; Power</option>
                          <option>Metals, Mining &amp; Smelting</option>
                          <option>Chemicals &amp; Specialty Polymers</option>
                          <option>Aerospace &amp; Defense Production</option>
                          <option>Packaging &amp; Converting</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Target Leadership Level <span className="required">*</span></label>
                        <select 
                          className="form-control" 
                          value={hiringForm.leadership_level}
                          onChange={e => setHiringForm({ ...hiringForm, leadership_level: e.target.value })}
                        >
                          <option>Chief Executive Officer (CEO)</option>
                          <option>Managing Director (MD)</option>
                          <option>Chief Operating Officer (COO)</option>
                          <option>Chief Financial Officer (CFO)</option>
                          <option>Chief Technology Officer (CTO)</option>
                          <option>President / Business Head</option>
                          <option>Independent Board Director</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Mandate Brief &amp; Context</label>
                      <textarea 
                        className="form-control" 
                        rows={4}
                        placeholder="Briefly describe the strategic mandate, plant location, or business turnaround context..."
                        value={hiringForm.notes}
                        onChange={e => setHiringForm({ ...hiringForm, notes: e.target.value })}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '220px' }}>
                      {loading ? <><Loader2 size={18} className="animate-spin" /><span>Submitting...</span></> : <span>Submit Search Mandate</span>}
                    </button>
                  </form>
                </div>
              )}

              {/* Tab 2: Candidate Submission */}
              {activeTab === 'candidate' && (
                <div className="form-pane active">
                  <div className="form-intro">
                    <h3>Submit Your Leadership Credentials</h3>
                    <p>We work with senior executives across industrial sectors. Your profile is handled with strict, non-attributable confidentiality.</p>
                  </div>

                  <form className="mcp-form" onSubmit={handleCandidateSubmit}>
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">Full Name <span className="required">*</span></label>
                        <input 
                          type="text" 
                          className="form-control" 
                          required 
                          placeholder="e.g. Sanyam Singla" 
                          value={candidateForm.name}
                          onChange={e => setCandidateForm({ ...candidateForm, name: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Current / Most Recent Designation <span className="required">*</span></label>
                        <input 
                          type="text" 
                          className="form-control" 
                          required 
                          placeholder="e.g. VP Operations / Plant Head" 
                          value={candidateForm.current_role}
                          onChange={e => setCandidateForm({ ...candidateForm, current_role: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">Confidential Email <span className="required">*</span></label>
                        <input 
                          type="email" 
                          className="form-control" 
                          required 
                          placeholder="personal@email.com" 
                          value={candidateForm.email}
                          onChange={e => setCandidateForm({ ...candidateForm, email: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Direct Phone Number <span className="required">*</span></label>
                        <input 
                          type="tel" 
                          className="form-control" 
                          required 
                          placeholder="+91 98111 22233" 
                          value={candidateForm.phone}
                          onChange={e => setCandidateForm({ ...candidateForm, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">Primary Industry Sector <span className="required">*</span></label>
                        <select 
                          className="form-control"
                          value={candidateForm.sector}
                          onChange={e => setCandidateForm({ ...candidateForm, sector: e.target.value })}
                        >
                          <option>Heavy Engineering &amp; Capital Goods</option>
                          <option>Industrial Automation &amp; Robotics</option>
                          <option>Automotive &amp; EV Mobility</option>
                          <option>Renewable Energy &amp; Power</option>
                          <option>Metals, Mining &amp; Smelting</option>
                          <option>Chemicals &amp; Specialty Polymers</option>
                          <option>Packaging &amp; Materials</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Total Experience <span className="required">*</span></label>
                        <select 
                          className="form-control"
                          value={candidateForm.experience}
                          onChange={e => setCandidateForm({ ...candidateForm, experience: e.target.value })}
                        >
                          <option>10 - 15 Years</option>
                          <option>15 - 20 Years</option>
                          <option>20 - 25 Years</option>
                          <option>25+ Years (Board / Veteran)</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">LinkedIn Profile URL</label>
                      <input 
                        type="url" 
                        className="form-control" 
                        placeholder="https://linkedin.com/in/username" 
                        value={candidateForm.linkedin_url}
                        onChange={e => setCandidateForm({ ...candidateForm, linkedin_url: e.target.value })}
                      />
                    </div>

                    {/* Resume Upload File Box */}
                    <div className="form-group">
                      <label className="form-label">Upload Executive CV / Resume (PDF / DOCX) <span className="required">*</span></label>
                      <div 
                        className="file-upload-box"
                        style={{
                          border: '2px dashed var(--color-border-light)',
                          padding: '30px',
                          borderRadius: 'var(--radius-md)',
                          textAlign: 'center',
                          backgroundColor: 'var(--color-bg-offwhite)',
                          cursor: 'pointer'
                        }}
                        onClick={() => document.getElementById('cvFileInput').click()}
                      >
                        <Upload size={32} color="var(--color-accent)" style={{ marginBottom: '8px' }} />
                        <div style={{ fontWeight: '600', fontSize: '15px' }}>
                          {candidateForm.cvFile ? candidateForm.cvFile.name : 'Click to Browse or Drag Resume Here'}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                          Supported formats: PDF, DOCX (Max 15MB)
                        </div>
                        <input 
                          type="file" 
                          id="cvFileInput" 
                          accept=".pdf,.docx,.doc" 
                          style={{ display: 'none' }}
                          onChange={e => setCandidateForm({ ...candidateForm, cvFile: e.target.files[0] })}
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '220px' }}>
                      {loading ? <><Loader2 size={18} className="animate-spin" /><span>Uploading Profile...</span></> : <span>Submit Executive Profile</span>}
                    </button>
                  </form>
                </div>
              )}

              {/* Tab 3: Other Inquiries */}
              {activeTab === 'queries' && (
                <div className="form-pane active">
                  <div className="form-intro">
                    <h3>General Inquiries &amp; Advisory Desk</h3>
                    <p>Have a question regarding corporate governance, speaker invitations, or general partnerships? Contact our advisory desk directly.</p>
                  </div>

                  <form className="mcp-form" onSubmit={handleInquirySubmit}>
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">Full Name <span className="required">*</span></label>
                        <input 
                          type="text" 
                          className="form-control" 
                          required 
                          placeholder="Your Name" 
                          value={inquiryForm.name}
                          onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address <span className="required">*</span></label>
                        <input 
                          type="email" 
                          className="form-control" 
                          required 
                          placeholder="name@email.com" 
                          value={inquiryForm.email}
                          onChange={e => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input 
                          type="tel" 
                          className="form-control" 
                          placeholder="+91" 
                          value={inquiryForm.phone}
                          onChange={e => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Subject / Topic <span className="required">*</span></label>
                        <select 
                          className="form-control"
                          value={inquiryForm.topic}
                          onChange={e => setInquiryForm({ ...inquiryForm, topic: e.target.value })}
                        >
                          <option>Board Advisory &amp; Governance</option>
                          <option>Fractional Leadership Inquiry</option>
                          <option>Research &amp; Media Interview</option>
                          <option>General Corporate Partnership</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Message <span className="required">*</span></label>
                      <textarea 
                        className="form-control" 
                        rows={4} 
                        required 
                        placeholder="Write your message here..."
                        value={inquiryForm.message}
                        onChange={e => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '220px' }}>
                      {loading ? <><Loader2 size={18} className="animate-spin" /><span>Sending...</span></> : <span>Send Inquiry</span>}
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* Centered Mohali (HQ) Card */}
      <section style={{ padding: '0 0 100px', backgroundColor: 'var(--color-bg-offwhite)' }}>
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: '30px' }}>
            <h2 className="section-title">Our Presence in India</h2>
            <p className="section-subtitle">Local search consultants grounded in key industrial and commercial hubs</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              background: '#ffffff',
              padding: '36px 44px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-light)',
              maxWidth: '540px',
              width: '100%',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)',
              borderTop: '3px solid var(--color-accent)'
            }}>
              <h3 style={{ fontSize: '20px', marginBottom: '12px', color: 'var(--color-primary)' }}>
                Mohali (HQ)
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--color-text-body)', lineHeight: '1.7', margin: '0 0 12px 0' }}>
                4579 B, Sector 70, Mohali, Punjab<br />
                <strong>T:</strong> <a href="tel:+919888426060" style={{ color: 'inherit', textDecoration: 'none' }}>+91 98 8842 6060</a>
              </p>
            </div>
          </div>

        </div>
      </section>

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

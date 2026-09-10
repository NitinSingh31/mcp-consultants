import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Users, Compass, CheckCircle2, ArrowRight } from 'lucide-react';

export default function About() {
  const leadershipTeam = [
    {
      name: "Shallu Sharma",
      role: "Managing Partner & Head of Industrial Practices",
      bio: "Over 22 years advising industrial conglomerates, automotive OEMs, and heavy EPC enterprises on executive leadership appointments.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Shikha Malhotra",
      role: "Senior Partner — Board Advisory & Fractional CXO",
      bio: "Specializes in boardroom governance, independent director succession, and agile executive deployment across process manufacturing.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Rajeev Singhal",
      role: "Senior Partner — Energy, Power & CleanTech",
      bio: "Advises listed utility giants and renewable energy developers on C-suite leadership and international market entry.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <div className="about-page">
      
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span className="divider">&rsaquo;</span>
            <span>About Us</span>
          </div>
          <h1 className="page-hero-title">Protect. Shape. Advance.</h1>
          <p className="page-hero-subtitle">
            A boutique leadership advisory and executive search firm anchored in the conviction that transformational industrial enterprises require visionary, uncompromising leaders.
          </p>
        </div>
      </section>

      {/* Heritage & Narrative */}
      <section className="about-narrative-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-text-block">
              <span className="section-tag">HERITAGE &amp; ANCHOR</span>
              <h2>Rooted in India’s Manufacturing Renaissance</h2>
              <p>
                Founded to address the specialized talent demands of India’s heavy engineering, power, and manufacturing sectors, MCP CONSULTANTS operates on the highest standards of discretion, technical understanding, and partner-led execution.
              </p>
              <p>
                Unlike generic staffing agencies, every search mandate at MCP is managed personally by Senior Partners with direct industrial domain expertise. We map not only active candidates, but the top 5% of passive industrial leaders who rarely appear on job boards.
              </p>
              <div className="about-feature-list">
                <div className="feature-item">
                  <CheckCircle2 size={20} color="var(--color-accent)" />
                  <span>100% Partner-Led Mandate Execution</span>
                </div>
                <div className="feature-item">
                  <CheckCircle2 size={20} color="var(--color-accent)" />
                  <span>Exclusively Focused on Industry &amp; Manufacturing</span>
                </div>
                <div className="feature-item">
                  <CheckCircle2 size={20} color="var(--color-accent)" />
                  <span>Independent 360-Degree Reference Audits</span>
                </div>
              </div>
            </div>

            <div className="about-image-wrap">
              <img 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80" 
                alt="Executive Boardroom Consultation"
                style={{ borderRadius: 'var(--radius-md)', width: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="team-section" style={{ backgroundColor: 'var(--color-bg-offwhite)', padding: '80px 0' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">LEADERSHIP</span>
            <h2 className="section-title">The Partners Behind Every Mandate</h2>
            <p className="section-subtitle">
              Veteran search practitioners with deep industrial networks and unmatched boardroom trust
            </p>
          </div>

          <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '40px' }}>
            {leadershipTeam.map((member, idx) => (
              <div key={idx} className="team-card" style={{ background: '#ffffff', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ height: '280px', overflow: 'hidden' }}>
                  <img 
                    src={member.image} 
                    alt={member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '20px', marginBottom: '6px', color: 'var(--color-primary)' }}>{member.name}</h3>
                  <div style={{ color: 'var(--color-accent)', fontWeight: '700', fontSize: '14px', marginBottom: '14px' }}>{member.role}</div>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-body)', lineHeight: '1.6' }}>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workplace Culture & Standards */}
      <section className="values-section" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">CORE VALUES</span>
            <h2 className="section-title">The Principles We Stand By</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginTop: '40px' }}>
            <div className="value-card" style={{ padding: '30px', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)' }}>
              <ShieldCheck size={32} color="var(--color-accent)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Confidentiality</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-body)' }}>Complete discretion protects client competitive positioning and executive career trajectories.</p>
            </div>
            <div className="value-card" style={{ padding: '30px', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)' }}>
              <Award size={32} color="var(--color-accent)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Rigorous Vetting</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-body)' }}>We investigate past plant output, governance history, and peer feedback before any candidate reaches your table.</p>
            </div>
            <div className="value-card" style={{ padding: '30px', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)' }}>
              <Users size={32} color="var(--color-accent)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Long-Term Alignment</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-body)' }}>We stay engaged through the critical first 100 days of executive integration to guarantee leadership success.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Users, Building2, Briefcase, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Services() {
  return (
    <div className="services-page">
      
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span className="divider">&rsaquo;</span>
            <span>Services</span>
          </div>
          <h1 className="page-hero-title">Practice Capabilities &amp; Advisory</h1>
          <p className="page-hero-subtitle">
            From retained C-suite appointments to agile fractional leadership and independent board governance, we deliver outcomes grounded in industrial acumen.
          </p>
        </div>
      </section>

      {/* 4 Deep Practice Blocks */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          
          {/* Practice 1 */}
          <div className="service-block-row" id="executive-search" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center', marginBottom: '80px' }}>
            <div>
              <span className="section-tag">CORE CAPABILITY</span>
              <h2 style={{ fontSize: '28px', margin: '8px 0 16px', color: 'var(--color-primary)' }}>Retained Executive Search</h2>
              <p style={{ fontSize: '15px', color: 'var(--color-text-body)', lineHeight: '1.7', marginBottom: '20px' }}>
                We execute discreet, high-stakes mandates for Chief Executive Officers (CEOs), Managing Directors, and CXO functional heads. Our rigorous talent mapping pinpoints executives with verified track records in scale, turnaround, and capital allocation.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', fontSize: '14px', lineHeight: '2' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="var(--color-accent)" />
                  <span>Confidential CEO &amp; Board Succession Mandates</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="var(--color-accent)" />
                  <span>Cross-functional Leadership Mapping (COO, CFO, CTO, CPO)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="var(--color-accent)" />
                  <span>Independent 360-Degree Non-Attributable Reference Audits</span>
                </li>
              </ul>
              <Link to="/contact" className="btn btn-primary">
                <span>Commission Search</span>
                <ArrowRight size={16} />
              </Link>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80" 
                alt="Executive Consultation" 
                style={{ borderRadius: 'var(--radius-md)', width: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Practice 2 */}
          <div className="service-block-row" id="fractional-cxo" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center', marginBottom: '80px' }}>
            <div style={{ order: 2 }}>
              <span className="section-tag">AGILE LEADERSHIP</span>
              <h2 style={{ fontSize: '28px', margin: '8px 0 16px', color: 'var(--color-primary)' }}>Fractional CXO &amp; Interim Leadership</h2>
              <p style={{ fontSize: '15px', color: 'var(--color-text-body)', lineHeight: '1.7', marginBottom: '20px' }}>
                When enterprises face urgent turnaround situations, rapid greenfield plant commissions, or sudden C-suite vacancies, our Fractional CXO practice deploys seasoned industrial veterans on flexible, outcome-driven engagements.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', fontSize: '14px', lineHeight: '2' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="var(--color-accent)" />
                  <span>Interim COOs for Plant Commissioning &amp; Ramp-Up</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="var(--color-accent)" />
                  <span>Fractional CFOs for Debt Restructuring &amp; M&amp;A Integration</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="var(--color-accent)" />
                  <span>Immediate Deployability with Zero Permanent Overhead</span>
                </li>
              </ul>
              <Link to="/contact" className="btn btn-primary">
                <span>Deploy Interim Leaders</span>
                <ArrowRight size={16} />
              </Link>
            </div>
            <div style={{ order: 1 }}>
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" 
                alt="Interim Discussion" 
                style={{ borderRadius: 'var(--radius-md)', width: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Practice 3 */}
          <div className="service-block-row" id="board-advisory" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center', marginBottom: '80px' }}>
            <div>
              <span className="section-tag">GOVERNANCE &amp; TRUST</span>
              <h2 style={{ fontSize: '28px', margin: '8px 0 16px', color: 'var(--color-primary)' }}>Board Advisory &amp; Governance</h2>
              <p style={{ fontSize: '15px', color: 'var(--color-text-body)', lineHeight: '1.7', marginBottom: '20px' }}>
                Robust corporate boards safeguard enterprise longevity. We advise promoters and institutional investors on boardroom composition, diversity, ESG compliance, and the appointment of visionary Independent Directors.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', fontSize: '14px', lineHeight: '2' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="var(--color-accent)" />
                  <span>Independent Director &amp; Board Chair Appointments</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="var(--color-accent)" />
                  <span>Audit, Risk &amp; Compensation Committee Search</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="var(--color-accent)" />
                  <span>Boardroom Effectiveness &amp; Succession Reviews</span>
                </li>
              </ul>
              <Link to="/contact" className="btn btn-primary">
                <span>Consult Board Advisory</span>
                <ArrowRight size={16} />
              </Link>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80" 
                alt="Boardroom" 
                style={{ borderRadius: 'var(--radius-md)', width: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* The MCP Search Methodology */}
      <section style={{ backgroundColor: 'var(--color-bg-offwhite)', padding: '80px 0' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">OUR METHODOLOGY</span>
            <h2 className="section-title">The 4-Stage Search Architecture</h2>
            <p className="section-subtitle">A disciplined, discreet framework ensuring guaranteed placement success</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginTop: '40px' }}>
            <div style={{ background: '#ffffff', padding: '30px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)' }}>
              <div style={{ color: 'var(--color-accent)', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>01</div>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Contextualize</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-body)' }}>Immersion into strategic objectives, operational culture, governance philosophy, and mandate specifics.</p>
            </div>
            <div style={{ background: '#ffffff', padding: '30px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)' }}>
              <div style={{ color: 'var(--color-accent)', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>02</div>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Market Mapping</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-body)' }}>Forensic mapping of top 5% passive leaders across competitors, adjacent ecosystems, and global peers.</p>
            </div>
            <div style={{ background: '#ffffff', padding: '30px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)' }}>
              <div style={{ color: 'var(--color-accent)', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>03</div>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Forensic Vetting</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-body)' }}>360-degree non-attributable references, past plant efficiency audits, and psychometric leadership appraisals.</p>
            </div>
            <div style={{ background: '#ffffff', padding: '30px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)' }}>
              <div style={{ color: 'var(--color-accent)', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>04</div>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Integration</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-body)' }}>Structured check-ins during the first 100 days ensuring seamless cultural alignment and immediate impact.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

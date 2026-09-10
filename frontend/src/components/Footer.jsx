import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Shield, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        
        {/* Main Footer Grid */}
        <div className="footer-top">
          
          {/* Column 1: Brand Manifesto */}
          <div className="footer-brand">
            <Link to="/" className="brand-logo footer-logo">
              <div className="logo-symbol">M</div>
              <div className="brand-text">
                <span className="brand-name">MCP <span className="highlight">CONSULTANTS</span></span>
                <span className="brand-tagline">Protect. Shape. Advance</span>
              </div>
            </Link>
            <p className="footer-desc">
              Pioneering executive search and leadership talent advisory across India’s core engineering, industrial automation, and manufacturing sectors.
            </p>
            <div style={{ marginTop: '16px' }}>
              <Link to="/admin" style={{ fontSize: '12px', color: 'var(--color-accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span>Executive Practice Portal (Admin)</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* Column 2: Core Practices */}
          <div>
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-nav-list">
              <li><Link to="/services#executive-search">Executive Search</Link></li>
              <li><Link to="/services#fractional-cxo">Fractional CXO &amp; Interim</Link></li>
              <li><Link to="/services#board-advisory">Board Advisory &amp; Governance</Link></li>
              <li><Link to="/services#talent-advisory">Talent Diagnostics &amp; Audit</Link></li>
            </ul>
          </div>

          {/* Column 3: Industries */}
          <div>
            <h4 className="footer-heading">Industries</h4>
            <ul className="footer-nav-list">
              <li><Link to="/industries">Heavy Manufacturing &amp; EPC</Link></li>
              <li><Link to="/industries">Industrial Automation &amp; Robotics</Link></li>
              <li><Link to="/industries">Automotive &amp; Electric Mobility</Link></li>
              <li><Link to="/industries">Renewables, Power &amp; Utilities</Link></li>
              <li><Link to="/industries">Chemicals &amp; Advanced Materials</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Offices */}
          <div>
            <h4 className="footer-heading">Connect With Us</h4>
            <div className="footer-contact-info">
              
              <div className="footer-contact-item">
                <MapPin size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span><strong>Head Office:</strong> 4579 B, Sector 70, Mohali, Punjab</span>
              </div>

              <div className="footer-contact-item">
                <Phone size={18} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                <span>
                  <a href="tel:+919888426060" style={{ color: 'inherit', textDecoration: 'none' }}>
                    +91 98 8842 6060
                  </a>
                </span>
              </div>

              <div className="footer-contact-item" style={{ alignItems: 'flex-start' }}>
                <Mail size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <a href="mailto:Recruiter.mcpconsultants@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                    Recruiter.mcpconsultants@gmail.com
                  </a>
                  <a href="mailto:Shallu.mcpconsultants@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                    Shallu.mcpconsultants@gmail.com
                  </a>
                  <a href="mailto:Shikha.mcpconsultants@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                    Shikha.mcpconsultants@gmail.com
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} MCP CONSULTANTS. All rights reserved. Grounded in industrial excellence.
          </div>
          <div className="footer-legal-links">
            <Link to="/about">About Firm</Link>
            <span>|</span>
            <Link to="/contact">Privacy Policy</Link>
            <span>|</span>
            <Link to="/contact">Disclaimer</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

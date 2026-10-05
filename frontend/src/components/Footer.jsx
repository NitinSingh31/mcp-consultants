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
              <div className="brand-text">
                <span className="brand-name">MCP <span className="highlight">GROUP</span></span>
                <span className="brand-tagline">Empowering People. Powering Businesses. Building India.</span>
              </div>
            </Link>
            <p className="footer-desc">
              Founded in 2007 in Chandigarh, MCP Group is an ISO 9001:2008 certified Human Resource and Workforce Management organization with nearly 50,000 associates and 500+ clients across India.
            </p>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '0.05em' }}>
                <Shield size={14} />
                <span>ISO 9001:2008 CERTIFIED ORGANIZATION</span>
              </div>
              <Link to="/admin" style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span>Executive Practice Portal (Admin)</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>

          {/* Column 2: Core Solutions */}
          <div>
            <h4 className="footer-heading">Our Solutions</h4>
            <ul className="footer-nav-list">
              <li><Link to="/services?service=workforce-management">Workforce Management</Link></li>
              <li><Link to="/services?service=hr-services">Human Resource Services</Link></li>
              <li><Link to="/services?service=facility-management">Facility Management</Link></li>
              <li><Link to="/services?service=bpo-solutions">BPO &amp; Business Process</Link></li>
              <li><Link to="/services?service=skill-development">Skill Development</Link></li>
              <li><Link to="/services?service=education">Education Solutions</Link></li>
              <li><Link to="/services?service=compliance-management">Compliance Management</Link></li>
            </ul>
          </div>

          {/* Column 3: Industries */}
          <div>
            <h4 className="footer-heading">Industries We Serve</h4>
            <ul className="footer-nav-list">
              <li><Link to="/industries">Pharmaceuticals &amp; Life Sciences</Link></li>
              <li><Link to="/industries">Power &amp; Energy</Link></li>
              <li><Link to="/industries">Automobiles &amp; EV</Link></li>
              <li><Link to="/industries">Textiles &amp; Manufacturing</Link></li>
              <li><Link to="/industries">Electronics &amp; Electricals</Link></li>
              <li><Link to="/industries">Retail &amp; Modern Commerce</Link></li>
              <li><Link to="/industries">Hospitality</Link></li>
              <li><Link to="/industries">Government &amp; Public Sector</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Offices */}
          <div>
            <h4 className="footer-heading">Connect With Us</h4>
            <div className="footer-contact-info">
              
              <div className="footer-contact-item">
                <MapPin size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span><strong>Head Office:</strong> 4579 B, Sector 70, Mohali, Punjab (Chandigarh Tricity)</span>
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
            &copy; {new Date().getFullYear()} MCP GROUP. All rights reserved. Empowering People. Powering Businesses. Building India.
          </div>
          <div className="footer-legal-links">
            <Link to="/about">About Group</Link>
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

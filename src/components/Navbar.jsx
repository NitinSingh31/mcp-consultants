import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  ChevronRight,
  Briefcase,
  Layers,
  FileText,
  Building2,
  Lock,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Top Utility Bar (Executive Tier 1 Style) */}
      <div className="navbar-top-bar">
        <div className="container navbar-top-container">
          
          <div className="top-bar-left">
            <a href="tel:+919888426060" className="top-bar-item">
              <Phone size={13} className="top-icon" />
              <span>+91 98 8842 6060</span>
            </a>
            <span className="top-bar-divider">|</span>
            <a href="mailto:Recruiter.mcpconsultants@gmail.com" className="top-bar-item">
              <Mail size={13} className="top-icon" />
              <span>Recruiter.mcpconsultants@gmail.com</span>
            </a>
          </div>

          <div className="top-bar-right">
            <div className="top-bar-item">
              <MapPin size={13} className="top-icon" />
              <span>Mohali HQ, Punjab</span>
            </div>
            <span className="top-bar-divider">|</span>
            <Link to="/admin" className="top-bar-item admin-link-badge">
              <Lock size={12} />
              <span>Practice Portal</span>
            </Link>
          </div>

        </div>
      </div>

      {/* Main Sticky Header */}
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="header-wrapper">
            
            {/* Brand Logo */}
            <Link to="/" className="brand-logo" aria-label="MCP CONSULTANTS Home">
              <div className="logo-symbol-wrapper">
                <span className="logo-symbol">M</span>
                <span className="logo-pulse" />
              </div>
              <div className="brand-text">
                <div className="brand-name">
                  MCP <span className="highlight">CONSULTANTS</span>
                </div>
                <div className="brand-tagline">
                  Protect. Shape. Advance
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="desktop-nav" aria-label="Main Navigation">
              <ul className="nav-list">
                <li className="nav-item">
                  <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                    <span>Home</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <span>About Us</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/industries" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <span>Industries</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/services" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <span>Services</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/insights" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <span>Insights</span>
                  </NavLink>
                </li>
              </ul>
            </nav>

            {/* Header Right Actions */}
            <div className="header-actions">
              <Link to="/contact" className="btn-header-cta" id="nav-cta-btn">
                <span>Get In Touch</span>
                <ArrowRight size={15} className="cta-arrow" />
              </Link>

              {/* Mobile Hamburger Toggle */}
              <button 
                className={`hamburger-toggle ${mobileMenuOpen ? 'open' : ''}`} 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? (
                  <X size={24} color="#ffffff" />
                ) : (
                  <Menu size={24} color="#ffffff" />
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`mobile-side-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden={!mobileMenuOpen}
      />

      {/* Mobile Slide-Out Drawer */}
      <aside className={`mobile-side-menu ${mobileMenuOpen ? 'open' : ''}`} aria-hidden={!mobileMenuOpen}>
        
        {/* Mobile Header */}
        <div className="mobile-menu-header">
          <div className="brand-logo mobile-brand">
            <div className="logo-symbol-wrapper">
              <span className="logo-symbol">M</span>
            </div>
            <div className="brand-text">
              <div className="brand-name" style={{ fontSize: '18px' }}>
                MCP <span className="highlight">CONSULTANTS</span>
              </div>
              <div className="brand-tagline">Protect. Shape. Advance</div>
            </div>
          </div>

          <button 
            className="close-side-menu" 
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close Navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mobile Quick Contact Bar */}
        <div className="mobile-quick-contact">
          <a href="tel:+919888426060" className="mobile-contact-pill">
            <Phone size={14} color="var(--color-accent)" />
            <span>+91 98 8842 6060</span>
          </a>
          <a href="mailto:Recruiter.mcpconsultants@gmail.com" className="mobile-contact-pill">
            <Mail size={14} color="var(--color-accent)" />
            <span>Recruiter.mcpconsultants@gmail.com</span>
          </a>
        </div>

        {/* Navigation Links */}
        <ul className="mobile-nav-list">
          <li className="mobile-nav-item">
            <NavLink to="/" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} end>
              <div className="mobile-link-inner">
                <Building2 size={18} className="mobile-nav-icon" />
                <span>Home</span>
              </div>
              <ChevronRight size={16} className="chevron" />
            </NavLink>
          </li>
          <li className="mobile-nav-item">
            <NavLink to="/about" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
              <div className="mobile-link-inner">
                <ShieldCheck size={18} className="mobile-nav-icon" />
                <span>About Us</span>
              </div>
              <ChevronRight size={16} className="chevron" />
            </NavLink>
          </li>
          <li className="mobile-nav-item">
            <NavLink to="/industries" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
              <div className="mobile-link-inner">
                <Layers size={18} className="mobile-nav-icon" />
                <span>Industries</span>
              </div>
              <ChevronRight size={16} className="chevron" />
            </NavLink>
          </li>
          <li className="mobile-nav-item">
            <NavLink to="/services" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
              <div className="mobile-link-inner">
                <Briefcase size={18} className="mobile-nav-icon" />
                <span>Services</span>
              </div>
              <ChevronRight size={16} className="chevron" />
            </NavLink>
          </li>
          <li className="mobile-nav-item">
            <NavLink to="/insights" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
              <div className="mobile-link-inner">
                <FileText size={18} className="mobile-nav-icon" />
                <span>Insights</span>
              </div>
              <ChevronRight size={16} className="chevron" />
            </NavLink>
          </li>
          <li className="mobile-nav-item">
            <NavLink to="/contact" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
              <div className="mobile-link-inner">
                <Sparkles size={18} className="mobile-nav-icon" />
                <span>Get In Touch</span>
              </div>
              <ChevronRight size={16} className="chevron" />
            </NavLink>
          </li>
        </ul>

        {/* Mobile Bottom Action */}
        <div className="mobile-menu-footer">
          <Link to="/contact" className="btn btn-accent btn-block" style={{ marginBottom: '12px', padding: '14px 20px', borderRadius: '8px' }}>
            <span>Submit Search Mandate</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/admin" className="mobile-admin-portal-link">
            <Lock size={13} />
            <span>Executive Practice Portal (Admin) &rarr;</span>
          </Link>
        </div>

      </aside>
    </>
  );
}

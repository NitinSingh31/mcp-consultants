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
  ChevronDown,
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
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [workforceSubmenuOpen, setWorkforceSubmenuOpen] = useState(false);
  const [mobileServicesExpanded, setMobileServicesExpanded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer and dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    setWorkforceSubmenuOpen(false);
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
      {/* Main Sticky Header */}
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="header-wrapper">
            
            {/* Brand Wordmark */}
            <Link to="/" className="brand-logo" aria-label="MCP CONSULTANTS Home">
              <div className="brand-text">
                <div className="brand-name">
                  MCP <span className="highlight">CONSULTANTS</span>
                </div>
                <div className="brand-tagline">
                  TALENT • PEOPLE • GROWTH
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
                <li 
                  className="nav-item has-dropdown"
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  onMouseLeave={() => {
                    setServicesDropdownOpen(false);
                    setWorkforceSubmenuOpen(false);
                  }}
                >
                  <NavLink to="/services" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <span>Our Services</span>
                    <ChevronDown size={13} className="nav-chevron" />
                  </NavLink>

                  {/* Dropdown Menu matching Reference Design */}
                  <div className={`nav-services-dropdown ${servicesDropdownOpen ? 'open' : ''}`}>
                    <div 
                      className="dropdown-item has-submenu"
                      onMouseEnter={() => setWorkforceSubmenuOpen(true)}
                      onMouseLeave={() => setWorkforceSubmenuOpen(false)}
                    >
                      <Link to="/services?service=workforce-management" className="dropdown-link-row">
                        <span>Workforce Management</span>
                        <ChevronRight size={13} className="submenu-arrow" />
                      </Link>

                      {/* Sub-menu Flyout */}
                      <div className={`nav-services-submenu ${workforceSubmenuOpen ? 'open' : ''}`}>
                        <Link to="/services?service=workforce-management&sub=temporary-staffing" className="submenu-link-item">
                          Temporary Staffing Solution
                        </Link>
                        <Link to="/services?service=workforce-management&sub=recruitment" className="submenu-link-item">
                          Recruitment (IT &amp; Non-IT)
                        </Link>
                        <Link to="/services?service=workforce-management&sub=naps" className="submenu-link-item">
                          NAPS
                        </Link>
                        <Link to="/services?service=workforce-management&sub=payroll" className="submenu-link-item">
                          Payroll Management
                        </Link>
                      </div>
                    </div>

                    <Link to="/services?service=power-sector" className="dropdown-link-row">
                      <span>Power Sector</span>
                    </Link>
                    <Link to="/services?service=retail-ev" className="dropdown-link-row">
                      <span>Retail &amp; EV</span>
                    </Link>
                    <Link to="/services?service=hospitality" className="dropdown-link-row">
                      <span>Hospitality</span>
                    </Link>
                    <Link to="/services?service=skill-development" className="dropdown-link-row">
                      <span>Skill Development &amp; Education</span>
                    </Link>
                    <Link to="/services?service=facility-management" className="dropdown-link-row">
                      <span>Facility Management &amp; BPO</span>
                    </Link>
                  </div>
                </li>
                <li className="nav-item">
                  <NavLink to="/insights" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <span>Insights</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/jobs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <span>Careers</span>
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
            <div className="brand-text">
              <div className="brand-name" style={{ fontSize: '18px' }}>
                MCP <span className="highlight">CONSULTANTS</span>
              </div>
              <div className="brand-tagline">TALENT • PEOPLE • GROWTH</div>
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
            <div 
              className="mobile-nav-link" 
              style={{ justifyContent: 'space-between', cursor: 'pointer' }}
              onClick={() => setMobileServicesExpanded(!mobileServicesExpanded)}
            >
              <div className="mobile-link-inner">
                <Briefcase size={18} className="mobile-nav-icon" />
                <span>Our Services</span>
              </div>
              <ChevronDown 
                size={16} 
                className="chevron" 
                style={{ transform: mobileServicesExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} 
              />
            </div>

            {mobileServicesExpanded && (
              <div className="mobile-submenu-list" style={{ paddingLeft: '28px', background: 'rgba(255,255,255,0.03)', borderLeft: '2px solid var(--color-accent)', margin: '6px 0 10px 14px' }}>
                <Link to="/services?service=workforce-management" className="mobile-sub-link" style={{ display: 'block', padding: '8px 0', color: '#cbd5e1', fontSize: '13.5px', textDecoration: 'none' }}>
                  Workforce Management
                </Link>
                <div style={{ paddingLeft: '14px', marginBottom: '8px', borderLeft: '1px dashed rgba(255,255,255,0.2)' }}>
                  <Link to="/services?service=workforce-management&sub=temporary-staffing" style={{ display: 'block', padding: '4px 0', color: '#94a3b8', fontSize: '12px', textDecoration: 'none' }}>
                    • Temporary Staffing Solution
                  </Link>
                  <Link to="/services?service=workforce-management&sub=recruitment" style={{ display: 'block', padding: '4px 0', color: '#94a3b8', fontSize: '12px', textDecoration: 'none' }}>
                    • Recruitment (IT &amp; Non-IT)
                  </Link>
                  <Link to="/services?service=workforce-management&sub=naps" style={{ display: 'block', padding: '4px 0', color: '#94a3b8', fontSize: '12px', textDecoration: 'none' }}>
                    • NAPS
                  </Link>
                  <Link to="/services?service=workforce-management&sub=payroll" style={{ display: 'block', padding: '4px 0', color: '#94a3b8', fontSize: '12px', textDecoration: 'none' }}>
                    • Payroll Management
                  </Link>
                </div>
                <Link to="/services?service=power-sector" className="mobile-sub-link" style={{ display: 'block', padding: '8px 0', color: '#cbd5e1', fontSize: '13.5px', textDecoration: 'none' }}>
                  Power Sector
                </Link>
                <Link to="/services?service=retail-ev" className="mobile-sub-link" style={{ display: 'block', padding: '8px 0', color: '#cbd5e1', fontSize: '13.5px', textDecoration: 'none' }}>
                  Retail &amp; EV
                </Link>
                <Link to="/services?service=hospitality" className="mobile-sub-link" style={{ display: 'block', padding: '8px 0', color: '#cbd5e1', fontSize: '13.5px', textDecoration: 'none' }}>
                  Hospitality
                </Link>
                <Link to="/services?service=skill-development" className="mobile-sub-link" style={{ display: 'block', padding: '8px 0', color: '#cbd5e1', fontSize: '13.5px', textDecoration: 'none' }}>
                  Skill Development &amp; Education
                </Link>
                <Link to="/services?service=facility-management" className="mobile-sub-link" style={{ display: 'block', padding: '8px 0', color: '#cbd5e1', fontSize: '13.5px', textDecoration: 'none' }}>
                  Facility Management &amp; BPO
                </Link>
              </div>
            )}
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
            <NavLink to="/jobs" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
              <div className="mobile-link-inner">
                <Briefcase size={18} className="mobile-nav-icon" />
                <span>Careers / Openings</span>
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
          <Link to="/contact" className="btn btn-accent btn-block" style={{ padding: '14px 20px', borderRadius: '8px' }}>
            <span>Submit Search Mandate</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </aside>
    </>
  );
}

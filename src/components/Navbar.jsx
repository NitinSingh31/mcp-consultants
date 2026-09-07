import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="header-wrapper">
            
            {/* Brand Logo */}
            <Link to="/" className="brand-logo" aria-label="MCP CONSULTANTS Home">
              <div className="logo-symbol">M</div>
              <div className="brand-text">
                <span className="brand-name">MCP <span className="highlight">CONSULTANTS</span></span>
                <span className="brand-tagline">Protect. Shape. Advance</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="desktop-nav" aria-label="Main Navigation">
              <ul className="nav-list">
                <li className="nav-item">
                  <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    About Us
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/industries" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Industries
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/services" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Services
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/insights" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Insights
                  </NavLink>
                </li>
              </ul>
            </nav>

            {/* Header Right Actions */}
            <div className="header-actions">
              <Link to="/contact" className="btn btn-primary btn-header">
                <span>Get In Touch</span>
                <ArrowRight size={16} />
              </Link>

              {/* Mobile Hamburger Toggle */}
              <button 
                className="hamburger-toggle" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X size={24} color="#ffffff" /> : <Menu size={24} color="#ffffff" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`mobile-side-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Side Menu */}
      <aside className={`mobile-side-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="brand-title" style={{ fontSize: '19px' }}>
            <span className="logo-symbol">M</span>
            <span>MCP <span className="highlight">CONSULTANTS</span></span>
          </div>
          <button className="close-side-menu" onClick={() => setMobileMenuOpen(false)}>
            &times;
          </button>
        </div>

        <ul className="mobile-nav-list">
          <li className="mobile-nav-item">
            <NavLink to="/" className="mobile-nav-link" end>Home</NavLink>
          </li>
          <li className="mobile-nav-item">
            <NavLink to="/about" className="mobile-nav-link">About Us</NavLink>
          </li>
          <li className="mobile-nav-item">
            <NavLink to="/industries" className="mobile-nav-link">Industries</NavLink>
          </li>
          <li className="mobile-nav-item">
            <NavLink to="/services" className="mobile-nav-link">Services</NavLink>
          </li>
          <li className="mobile-nav-item">
            <NavLink to="/insights" className="mobile-nav-link">Insights</NavLink>
          </li>
          <li className="mobile-nav-item">
            <NavLink to="/contact" className="mobile-nav-link">Get In Touch</NavLink>
          </li>
          <li className="mobile-nav-item">
            <NavLink to="/admin" className="mobile-nav-link" style={{ color: 'var(--color-accent)' }}>
              Executive Admin Portal &rarr;
            </NavLink>
          </li>
        </ul>
      </aside>
    </>
  );
}

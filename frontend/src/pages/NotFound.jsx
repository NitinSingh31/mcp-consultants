import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Briefcase, Mail, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '75vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      backgroundColor: '#f8fafc',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        maxWidth: '640px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '48px 40px',
        textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)'
      }}>
        <div style={{
          display: 'inline-block',
          backgroundColor: '#eff6ff',
          color: '#0056b3',
          border: '1px solid #bfdbfe',
          padding: '4px 14px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 800,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginBottom: '16px'
        }}>
          Error 404 • Page Not Found
        </div>

        <h1 style={{
          fontSize: '36px',
          fontWeight: 800,
          color: '#0f172a',
          margin: '0 0 12px',
          letterSpacing: '-1px'
        }}>
          Looking for Leadership?
        </h1>

        <p style={{
          fontSize: '15px',
          color: '#64748b',
          lineHeight: 1.6,
          margin: '0 auto 32px',
          maxWidth: '480px'
        }}>
          The page or mandate link you are looking for has been relocated, closed, or does not exist. Explore our active careers board or get in touch with our executive search advisory.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginBottom: '32px'
        }}>
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#0056b3',
              color: '#ffffff',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              transition: 'background-color 0.15s'
            }}
          >
            <Home size={16} />
            Return Home
          </Link>

          <Link
            to="/jobs"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#ffffff',
              color: '#1e293b',
              border: '1px solid #cbd5e1',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              transition: 'all 0.15s'
            }}
          >
            <Briefcase size={16} />
            Careers Board
          </Link>

          <Link
            to="/contact"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#ffffff',
              color: '#1e293b',
              border: '1px solid #cbd5e1',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              transition: 'all 0.15s'
            }}
          >
            <Mail size={16} />
            Contact Advisory
          </Link>
        </div>

        <div style={{
          borderTop: '1px solid #f1f5f9',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          color: '#64748b'
        }}>
          <span>Are you a corporate employer hiring leaders?</span>
          <Link to="/i-am-hiring" style={{ color: '#0056b3', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Submit a Mandate <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}

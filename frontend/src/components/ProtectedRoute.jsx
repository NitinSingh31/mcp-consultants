import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { apiUrl, getAuthToken } from '../api';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      const token = getAuthToken();
      if (!token) {
        if (isMounted) {
          setIsAuthenticated(false);
          setIsVerifying(false);
        }
        return;
      }

      try {
        const res = await fetch(apiUrl('/api/admin/verify-session'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        const data = await res.json();

        if (isMounted) {
          if (res.ok && data.success) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('mcp_admin_token');
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        console.error('Session verification error:', err);
        if (isMounted) {
          // If offline / dev server network blip, fall back to token existence check
          setIsAuthenticated(!!token);
        }
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  if (isVerifying) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        fontFamily: "'Inter', sans-serif",
        color: '#0056b3'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: '3px solid #e2e8f0',
          borderTop: '3px solid #0056b3',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
          Verifying security credentials...
        </span>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/admin?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Mail, 
  RefreshCw, 
  Download, 
  ExternalLink, 
  Search, 
  FileText, 
  ShieldCheck, 
  ArrowLeft,
  AlertCircle,
  Lock,
  Key,
  Shield,
  CheckCircle2,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  User,
  Check
} from 'lucide-react';
import { apiUrl } from '../api';

export default function Admin() {
  // Authentication & User State
  const [token, setToken] = useState(() => localStorage.getItem('mcp_admin_token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [currentUser, setCurrentUser] = useState({ username: '', email: '' });

  // Login Form State
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Forgot Password Modal State
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1 = Request OTP, 2 = Verify OTP & Reset
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotError, setForgotError] = useState('');

  // Account Settings Modal State
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    currentPassword: '',
    newUsername: '',
    newEmail: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState('');
  const [settingsError, setSettingsError] = useState('');

  // Dashboard Data State
  const [data, setData] = useState({ mandates: [], candidates: [], inquiries: [], stats: {}, activeDatabase: '' });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTab, setCurrentTab] = useState('mandates');
  const [searchQuery, setSearchQuery] = useState('');

  // ---------------------------------------------------------------------------
  // 1. Session Verification
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const verifySavedSession = async () => {
      const savedToken = localStorage.getItem('mcp_admin_token');
      if (!savedToken) {
        setIsAuthenticated(false);
        setAuthChecking(false);
        return;
      }

      try {
        const res = await fetch(apiUrl('/api/admin/verify-session'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: savedToken })
        });
        const json = await res.json();

        if (res.ok && json.success) {
          setIsAuthenticated(true);
          setCurrentUser({ username: json.username, email: json.email });
          setSettingsForm(prev => ({
            ...prev,
            newUsername: json.username,
            newEmail: json.email
          }));
          fetchData(false, savedToken);
        } else {
          // Token expired or invalid
          localStorage.removeItem('mcp_admin_token');
          setToken('');
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Session check failed:', err);
        setIsAuthenticated(false);
      } finally {
        setAuthChecking(false);
      }
    };

    verifySavedSession();
  }, []);

  // ---------------------------------------------------------------------------
  // 2. Fetch Submissions with Authorization Bearer
  // ---------------------------------------------------------------------------
  const fetchData = async (isManualRefresh = false, activeToken = token) => {
    if (!activeToken) return;
    if (isManualRefresh) setRefreshing(true);
    setLoading(true);

    try {
      const res = await fetch(apiUrl('/api/admin/submissions'), {
        headers: {
          'Authorization': `Bearer ${activeToken}`
        }
      });

      if (res.status === 401) {
        // Session unauthorized / expired
        handleLogout();
        return;
      }

      if (!res.ok) throw new Error('Failed to fetch data');
      const json = await res.json();
      setData({
        mandates: json.mandates || [],
        candidates: json.candidates || [],
        inquiries: json.inquiries || [],
        stats: json.stats || {
          mandatesCount: (json.mandates || []).length,
          candidatesCount: (json.candidates || []).length,
          inquiriesCount: (json.inquiries || []).length
        },
        activeDatabase: json.activeDatabase || 'MongoDB Atlas'
      });
      if (json.authenticatedUser) {
        setCurrentUser(json.authenticatedUser);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
      if (isManualRefresh) setRefreshing(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 3. Admin Authentication Handlers
  // ---------------------------------------------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch(apiUrl('/api/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginForm.identifier,
          password: loginForm.password
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Invalid credentials.');
      }

      localStorage.setItem('mcp_admin_token', json.token);
      setToken(json.token);
      setIsAuthenticated(true);
      setCurrentUser({ username: json.username, email: json.email });
      setSettingsForm(prev => ({
        ...prev,
        newUsername: json.username,
        newEmail: json.email
      }));
      fetchData(false, json.token);
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    const savedToken = token || localStorage.getItem('mcp_admin_token');
    try {
      if (savedToken) {
        await fetch(apiUrl('/api/admin/logout'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${savedToken}`
          }
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('mcp_admin_token');
      setToken('');
      setIsAuthenticated(false);
      setData({ mandates: [], candidates: [], inquiries: [], stats: {}, activeDatabase: '' });
    }
  };

  // ---------------------------------------------------------------------------
  // 4. Forgot Password Flow
  // ---------------------------------------------------------------------------
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotMessage('');
    setForgotLoading(true);

    try {
      const res = await fetch(apiUrl('/api/admin/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to dispatch reset code.');
      }

      setForgotMessage(json.message);
      setForgotStep(2);
    } catch (err) {
      setForgotError(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotMessage('');
    setForgotLoading(true);

    try {
      const res = await fetch(apiUrl('/api/admin/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail,
          otp: forgotOtp,
          newPassword: forgotNewPassword
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to reset password.');
      }

      localStorage.setItem('mcp_admin_token', json.token);
      setToken(json.token);
      setIsAuthenticated(true);
      setCurrentUser({ username: json.username, email: json.email });
      setForgotModalOpen(false);
      setForgotStep(1);
      setForgotOtp('');
      setForgotNewPassword('');
      fetchData(false, json.token);
    } catch (err) {
      setForgotError(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 5. Update Account Credentials (Direct In-App Settings)
  // ---------------------------------------------------------------------------
  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsMessage('');

    if (settingsForm.newPassword && settingsForm.newPassword !== settingsForm.confirmPassword) {
      setSettingsError('New passwords do not match. Please re-type.');
      return;
    }

    setSettingsLoading(true);

    try {
      const res = await fetch(apiUrl('/api/admin/update-credentials'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: settingsForm.currentPassword,
          newUsername: settingsForm.newUsername,
          newEmail: settingsForm.newEmail,
          newPassword: settingsForm.newPassword || undefined
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to update credentials.');
      }

      setSettingsMessage('Credentials updated successfully in MongoDB Atlas!');
      setCurrentUser({ username: json.username, email: json.email });
      setSettingsForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      setSettingsError(err.message);
    } finally {
      setSettingsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 6. Search Filter & CSV Export
  // ---------------------------------------------------------------------------
  const filteredData = useMemo(() => {
    const list = data[currentTab] || [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();

    return list.filter(item => {
      const text = Object.values(item).filter(v => typeof v === 'string' || typeof v === 'number').join(' ').toLowerCase();
      return text.includes(q);
    });
  }, [data, currentTab, searchQuery]);

  const handleExportCsv = () => {
    const list = filteredData;
    if (list.length === 0) {
      alert('No data available to export.');
      return;
    }

    const headers = Object.keys(list[0]);
    const rows = list.map(row => 
      headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mcp_${currentTab}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isDbConnected = data.activeDatabase && data.activeDatabase.toLowerCase().includes('mongodb');

  // ---------------------------------------------------------------------------
  // Screen A: Initial Checking State
  // ---------------------------------------------------------------------------
  if (authChecking) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0b1a2f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="logo-symbol" style={{ width: '48px', height: '48px', fontSize: '24px', margin: '0 auto 16px' }}>M</div>
          <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--color-accent, #c49a45)', margin: '0 auto 12px' }} />
          <p style={{ color: '#94a3b8', fontSize: '14px', letterSpacing: '0.5px' }}>Verifying Practice Portal Security...</p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Screen B: Unauthenticated Executive Login Gate
  // ---------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#0b1a2f', 
        background: 'radial-gradient(circle at 50% 20%, rgba(196, 154, 69, 0.12) 0%, rgba(11, 26, 47, 0.98) 60%), #0b1a2f',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '24px',
        fontFamily: 'var(--font-body)'
      }}>
        
        <div style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(196, 154, 69, 0.25)',
          overflow: 'hidden'
        }}>
          
          {/* Header Banner */}
          <div style={{ 
            backgroundColor: '#0b1a2f', 
            borderBottom: '3px solid var(--color-accent, #c49a45)', 
            padding: '28px 24px', 
            textAlign: 'center',
            color: '#ffffff'
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(196, 154, 69, 0.15)', border: '1px solid var(--color-accent, #c49a45)', color: 'var(--color-accent, #c49a45)', marginBottom: '12px' }}>
              <ShieldCheck size={26} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 800, letterSpacing: '1px', margin: '0 0 4px', color: '#ffffff' }}>
              MCP CONSULTANTS
            </h2>
            <p style={{ color: 'var(--color-accent, #c49a45)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', margin: 0 }}>
              Practice Portal &bull; Executive Sign In
            </p>
          </div>

          {/* Form Content */}
          <div style={{ padding: '32px 28px' }}>
            
            <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', marginTop: 0, marginBottom: '22px' }}>
              Sign in with your administrator username or email to access client mandates, talent resumes, and practice data.
            </p>

            {loginError && (
              <div style={{ 
                backgroundColor: 'rgba(239, 68, 68, 0.08)', 
                border: '1px solid rgba(239, 68, 68, 0.3)', 
                borderRadius: '8px', 
                padding: '10px 14px', 
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#dc2626',
                fontSize: '13px'
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Username or Work Email
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="text"
                    required
                    value={loginForm.identifier}
                    onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                    placeholder="admin or recruiter@mcpconsultants.com"
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      backgroundColor: '#f8fafc',
                      color: '#0f172a',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotModalOpen(true);
                      setForgotStep(1);
                      setForgotError('');
                      setForgotMessage('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-accent, #c49a45)',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••••••"
                    style={{
                      width: '100%',
                      padding: '10px 38px 10px 38px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      backgroundColor: '#f8fafc',
                      color: '#0f172a',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: loginLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {loginLoading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <Key size={16} />
                    <span>Sign In to Practice Portal</span>
                  </>
                )}
              </button>

            </form>

            {/* Public website back link */}
            <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '18px' }}>
              <Link 
                to="/" 
                style={{ 
                  color: '#64748b', 
                  fontSize: '13px', 
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ArrowLeft size={14} />
                <span>Return to Public Website</span>
              </Link>
            </div>

          </div>
        </div>

        {/* Forgot Password OTP Modal */}
        {forgotModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(11, 26, 47, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              overflow: 'hidden'
            }}>
              
              <div style={{ backgroundColor: '#0b1a2f', padding: '20px 24px', borderBottom: '2px solid var(--color-accent, #c49a45)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Key size={20} color="var(--color-accent, #c49a45)" />
                  <h3 style={{ margin: 0, fontSize: '16px', fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
                    {forgotStep === 1 ? 'Reset Portal Password' : 'Verify Code & Set Password'}
                  </h3>
                </div>
                <button 
                  onClick={() => setForgotModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}
                >
                  &times;
                </button>
              </div>

              <div style={{ padding: '24px' }}>
                
                {forgotError && (
                  <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '10px', marginBottom: '16px', color: '#dc2626', fontSize: '13px' }}>
                    {forgotError}
                  </div>
                )}

                {forgotMessage && (
                  <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '8px', padding: '10px', marginBottom: '16px', color: '#16a34a', fontSize: '13px' }}>
                    {forgotMessage}
                  </div>
                )}

                {forgotStep === 1 ? (
                  <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                      Enter the registered administrator email address. We will dispatch a 6-digit one-time verification code to your inbox.
                    </p>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Registered Admin Email
                      </label>
                      <input 
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="recruiter@mcpconsultants.com"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="btn btn-primary"
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 700,
                        cursor: forgotLoading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {forgotLoading ? 'Sending Security Code...' : 'Send Verification Code'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                      Enter the 6-digit OTP code sent to <strong>{forgotEmail}</strong> and choose your new password.
                    </p>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        6-Digit Security Code
                      </label>
                      <input 
                        type="text"
                        required
                        maxLength={6}
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value.trim())}
                        placeholder="123456"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '2px dashed var(--color-accent, #c49a45)',
                          fontSize: '22px',
                          fontWeight: 800,
                          textAlign: 'center',
                          letterSpacing: '6px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        New Password (Min 6 characters)
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input 
                          type={showForgotNewPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          value={forgotNewPassword}
                          onChange={(e) => setForgotNewPassword(e.target.value)}
                          placeholder="••••••••••••"
                          style={{
                            width: '100%',
                            padding: '10px 38px 10px 12px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '14px'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer'
                          }}
                        >
                          {showForgotNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="btn btn-primary"
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 700,
                        cursor: forgotLoading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {forgotLoading ? 'Updating Password...' : 'Confirm & Log In'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setForgotStep(1)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        fontSize: '12px',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      &larr; Re-enter email address
                    </button>
                  </form>
                )}

              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Screen C: Authenticated Admin Dashboard
  // ---------------------------------------------------------------------------
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#1e293b', fontFamily: 'var(--font-body)' }}>
      
      {/* Top Navbar */}
      <header style={{ backgroundColor: 'var(--color-primary, #0b1a2f)', borderBottom: '2px solid var(--color-accent, #c49a45)', color: '#ffffff', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="logo-symbol" style={{ width: '36px', height: '36px', fontSize: '18px' }}>M</div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, letterSpacing: '1px', fontSize: '18px' }}>
                MCP CONSULTANTS
              </span>
            </Link>
          </div>

          {/* User Controls & Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            
            {/* Logged in Badge */}
            <div style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.08)', 
              border: '1px solid rgba(255, 255, 255, 0.15)', 
              padding: '6px 12px', 
              borderRadius: '8px',
              fontSize: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Shield size={14} color="var(--color-accent, #c49a45)" />
              <span style={{ color: '#94a3b8' }}>Admin:</span>
              <strong style={{ color: '#ffffff' }}>{currentUser.username || 'admin'}</strong>
            </div>

            {/* Settings Modal Trigger */}
            <button 
              onClick={() => {
                setSettingsModalOpen(true);
                setSettingsError('');
                setSettingsMessage('');
              }}
              style={{ 
                padding: '8px 14px', 
                fontSize: '13px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                cursor: 'pointer',
                backgroundColor: 'rgba(196, 154, 69, 0.15)',
                border: '1px solid var(--color-accent, #c49a45)',
                color: 'var(--color-accent, #c49a45)',
                borderRadius: '8px',
                fontWeight: 700
              }}
              title="Change admin username, email, or password"
            >
              <Settings size={14} />
              <span>Settings</span>
            </button>

            {/* Refresh Data */}
            <button 
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="btn btn-outline-white" 
              style={{ padding: '8px 14px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>

            {/* Sign Out */}
            <button 
              onClick={handleLogout}
              style={{ 
                padding: '8px 14px', 
                fontSize: '13px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                cursor: 'pointer',
                backgroundColor: 'transparent',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                borderRadius: '8px',
                fontWeight: 600
              }}
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>

            {/* View Live Website */}
            <Link 
              to="/" 
              className="btn btn-accent" 
              style={{ padding: '8px 14px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
            >
              <ArrowLeft size={14} />
              <span>Website</span>
            </Link>

          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="container" style={{ padding: '36px 20px 60px' }}>
        
        {/* Metric Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: '6px' }}>
                Hiring Mandates
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', fontWeight: 800, color: 'var(--color-primary, #0b1a2f)' }}>
                {data.stats.mandatesCount ?? data.mandates.length}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                Corporate client searches
              </div>
            </div>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', backgroundColor: 'rgba(11, 26, 47, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary, #0b1a2f)' }}>
              <Building2 size={26} />
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: '6px' }}>
                Leadership Candidates
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', fontWeight: 800, color: 'var(--color-accent, #c49a45)' }}>
                {data.stats.candidatesCount ?? data.candidates.length}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                CVs &amp; executive applications
              </div>
            </div>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', backgroundColor: 'rgba(196, 154, 69, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent, #c49a45)' }}>
              <Users size={26} />
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: '6px' }}>
                General Inquiries
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', fontWeight: 800, color: 'var(--color-primary, #0b1a2f)' }}>
                {data.stats.inquiriesCount ?? data.inquiries.length}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                Board &amp; practice consultations
              </div>
            </div>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', backgroundColor: 'rgba(11, 26, 47, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary, #0b1a2f)' }}>
              <Mail size={26} />
            </div>
          </div>

        </div>

        {/* Main Records Card */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          
          {/* Header Controls */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => { setCurrentTab('mandates'); setSearchQuery(''); }}
                style={{ 
                  padding: '9px 18px', 
                  borderRadius: '8px', 
                  border: currentTab === 'mandates' ? '1px solid var(--color-primary, #0b1a2f)' : '1px solid #cbd5e1',
                  backgroundColor: currentTab === 'mandates' ? 'var(--color-primary, #0b1a2f)' : '#f8fafc',
                  color: currentTab === 'mandates' ? '#ffffff' : '#334155',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Building2 size={16} />
                <span>Hiring Mandates ({data.mandates.length})</span>
              </button>

              <button 
                onClick={() => { setCurrentTab('candidates'); setSearchQuery(''); }}
                style={{ 
                  padding: '9px 18px', 
                  borderRadius: '8px', 
                  border: currentTab === 'candidates' ? '1px solid var(--color-primary, #0b1a2f)' : '1px solid #cbd5e1',
                  backgroundColor: currentTab === 'candidates' ? 'var(--color-primary, #0b1a2f)' : '#f8fafc',
                  color: currentTab === 'candidates' ? '#ffffff' : '#334155',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Users size={16} />
                <span>Candidates &amp; Resumes ({data.candidates.length})</span>
              </button>

              <button 
                onClick={() => { setCurrentTab('inquiries'); setSearchQuery(''); }}
                style={{ 
                  padding: '9px 18px', 
                  borderRadius: '8px', 
                  border: currentTab === 'inquiries' ? '1px solid var(--color-primary, #0b1a2f)' : '1px solid #cbd5e1',
                  backgroundColor: currentTab === 'inquiries' ? 'var(--color-primary, #0b1a2f)' : '#f8fafc',
                  color: currentTab === 'inquiries' ? '#ffffff' : '#334155',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Mail size={16} />
                <span>General Queries ({data.inquiries.length})</span>
              </button>
            </div>

            {/* Filter & Export */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', minWidth: '220px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="text"
                  placeholder="Search records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '8px 12px 8px 36px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    width: '100%',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>

              <button 
                onClick={handleExportCsv}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: 'var(--color-primary, #0b1a2f)',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>
            </div>

          </div>

          {/* Table Container */}
          <div style={{ width: '100%', overflowX: 'auto' }}>
            {loading ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
                <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px', color: 'var(--color-accent, #c49a45)' }} />
                <p>Retrieving MongoDB records...</p>
              </div>
            ) : filteredData.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
                <AlertCircle size={32} style={{ margin: '0 auto 12px', color: '#94a3b8' }} />
                <h4 style={{ color: 'var(--color-primary, #0b1a2f)', marginBottom: '6px' }}>No records found</h4>
                <p style={{ fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
                  {searchQuery ? `No results matching "${searchQuery}". Try a different search term.` : `No ${currentTab} submissions have been received yet.`}
                </p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                
                {/* Mandates Table */}
                {currentTab === 'mandates' && (
                  <>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: 'var(--color-primary, #0b1a2f)' }}>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>ID</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Client Contact</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Company</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Sector</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Target Role</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Mandate Details</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Attached Brief</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Submitted At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item, idx) => (
                        <tr key={item.id || idx} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s' }}>
                          <td style={{ padding: '14px 18px', fontWeight: 700, color: '#64748b' }}>
                            #{item.id || idx + 1}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <strong style={{ color: 'var(--color-primary, #0b1a2f)', fontSize: '14px' }}>{item.name}</strong>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                              <a href={`mailto:${item.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{item.email}</a>
                              {item.phone && <span> &bull; {item.phone}</span>}
                            </div>
                          </td>
                          <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--color-primary, #0b1a2f)' }}>
                            {item.company}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, backgroundColor: 'rgba(11, 26, 47, 0.08)', color: 'var(--color-primary, #0b1a2f)' }}>
                              {item.sector}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px', fontWeight: 800, color: 'var(--color-accent, #c49a45)' }}>
                            {item.leadership_level}
                          </td>
                          <td style={{ padding: '14px 18px', maxWidth: '240px', color: '#475569', lineHeight: 1.4 }}>
                            {item.notes || '-'}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            {item.doc_filename ? (
                              <a 
                                href={apiUrl(`/uploads/${item.doc_filename}`)} 
                                download 
                                style={{ 
                                  display: 'inline-flex', 
                                  alignItems: 'center', 
                                  gap: '6px', 
                                  backgroundColor: 'rgba(196, 154, 69, 0.1)', 
                                  border: '1px solid rgba(196, 154, 69, 0.4)', 
                                  color: 'var(--color-primary, #0b1a2f)', 
                                  fontSize: '12px', 
                                  fontWeight: 700, 
                                  padding: '6px 12px', 
                                  borderRadius: '6px', 
                                  textDecoration: 'none' 
                                }}
                              >
                                <FileText size={14} color="var(--color-accent, #c49a45)" />
                                <span>{item.doc_original_name || 'Download JD'}</span>
                              </a>
                            ) : (
                              <span style={{ color: '#94a3b8' }}>-</span>
                            )}
                          </td>
                          <td style={{ padding: '14px 18px', whiteSpace: 'nowrap', color: '#64748b', fontSize: '12px' }}>
                            {item.created_at ? new Date(item.created_at).toLocaleString() : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {/* Candidates Table */}
                {currentTab === 'candidates' && (
                  <>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: 'var(--color-primary, #0b1a2f)' }}>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>ID</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Candidate Name</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Contact Info</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Current Role</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Sector</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Experience</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>LinkedIn</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Attached CV</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Submitted At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item, idx) => (
                        <tr key={item.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '14px 18px', fontWeight: 700, color: '#64748b' }}>
                            #{item.id || idx + 1}
                          </td>
                          <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--color-primary, #0b1a2f)' }}>
                            {item.name}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ fontSize: '12px' }}>
                              <a href={`mailto:${item.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{item.email}</a>
                              {item.phone && <div style={{ color: '#64748b' }}>{item.phone}</div>}
                            </div>
                          </td>
                          <td style={{ padding: '14px 18px', fontWeight: 700 }}>
                            {item.current_role}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, backgroundColor: 'rgba(11, 26, 47, 0.08)', color: 'var(--color-primary, #0b1a2f)' }}>
                              {item.sector}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px', color: '#475569' }}>
                            {item.experience}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            {item.linkedin_url ? (
                              <a 
                                href={item.linkedin_url} 
                                target="_blank" 
                                rel="noreferrer"
                                style={{ color: 'var(--color-accent, #c49a45)', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              >
                                <span>Profile</span>
                                <ExternalLink size={12} />
                              </a>
                            ) : '-'}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            {item.cv_filename ? (
                              <a 
                                href={apiUrl(`/uploads/${item.cv_filename}`)} 
                                download 
                                style={{ 
                                  display: 'inline-flex', 
                                  alignItems: 'center', 
                                  gap: '6px', 
                                  backgroundColor: 'rgba(196, 154, 69, 0.1)', 
                                  border: '1px solid rgba(196, 154, 69, 0.4)', 
                                  color: 'var(--color-primary, #0b1a2f)', 
                                  fontSize: '12px', 
                                  fontWeight: 700, 
                                  padding: '6px 12px', 
                                  borderRadius: '6px', 
                                  textDecoration: 'none' 
                                }}
                              >
                                <FileText size={14} color="var(--color-accent, #c49a45)" />
                                <span>{item.cv_original_name || 'Download CV'}</span>
                              </a>
                            ) : (
                              <span style={{ color: '#94a3b8' }}>No CV</span>
                            )}
                          </td>
                          <td style={{ padding: '14px 18px', whiteSpace: 'nowrap', color: '#64748b', fontSize: '12px' }}>
                            {item.created_at ? new Date(item.created_at).toLocaleString() : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {/* Inquiries Table */}
                {currentTab === 'inquiries' && (
                  <>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: 'var(--color-primary, #0b1a2f)' }}>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>ID</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Name</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Email</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Phone</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Topic</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Message</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Attached Resume / File</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Submitted At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item, idx) => (
                        <tr key={item.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '14px 18px', fontWeight: 700, color: '#64748b' }}>
                            #{item.id || idx + 1}
                          </td>
                          <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--color-primary, #0b1a2f)' }}>
                            {item.name}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <a href={`mailto:${item.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{item.email}</a>
                          </td>
                          <td style={{ padding: '14px 18px', color: '#64748b' }}>
                            {item.phone || '-'}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, backgroundColor: 'rgba(11, 26, 47, 0.08)', color: 'var(--color-primary, #0b1a2f)' }}>
                              {item.topic}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px', maxWidth: '300px', color: '#475569', lineHeight: 1.4 }}>
                            {item.message}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            {item.cv_filename ? (
                              <a 
                                href={apiUrl(`/uploads/${item.cv_filename}`)} 
                                download 
                                style={{ 
                                  display: 'inline-flex', 
                                  alignItems: 'center', 
                                  gap: '6px', 
                                  backgroundColor: 'rgba(196, 154, 69, 0.1)', 
                                  border: '1px solid rgba(196, 154, 69, 0.4)', 
                                  color: 'var(--color-primary, #0b1a2f)', 
                                  fontSize: '12px', 
                                  fontWeight: 700, 
                                  padding: '6px 12px', 
                                  borderRadius: '6px', 
                                  textDecoration: 'none' 
                                }}
                              >
                                <FileText size={14} color="var(--color-accent, #c49a45)" />
                                <span>{item.cv_original_name || 'Download CV'}</span>
                              </a>
                            ) : (
                              <span style={{ color: '#94a3b8' }}>No File</span>
                            )}
                          </td>
                          <td style={{ padding: '14px 18px', whiteSpace: 'nowrap', color: '#64748b', fontSize: '12px' }}>
                            {item.created_at ? new Date(item.created_at).toLocaleString() : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

              </table>
            )}
          </div>

        </div>

      </main>

      {/* Account & Security Settings Modal */}
      {settingsModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(11, 26, 47, 0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '520px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden'
          }}>
            
            {/* Modal Header */}
            <div style={{ backgroundColor: '#0b1a2f', padding: '20px 24px', borderBottom: '2px solid var(--color-accent, #c49a45)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Settings size={20} color="var(--color-accent, #c49a45)" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
                    Admin Security &amp; Credentials
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#94a3b8' }}>
                    Saved directly to MongoDB Atlas &bull; No .env changes needed
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSettingsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '22px', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              
              {settingsError && (
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#dc2626', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} />
                  <span>{settingsError}</span>
                </div>
              )}

              {settingsMessage && (
                <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#16a34a', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={16} />
                  <span>{settingsMessage}</span>
                </div>
              )}

              <form onSubmit={handleUpdateCredentials} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Admin Username
                  </label>
                  <input 
                    type="text"
                    required
                    value={settingsForm.newUsername}
                    onChange={(e) => setSettingsForm({ ...settingsForm, newUsername: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px'
                    }}
                  />
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>This is the username used to log into the Practice Portal.</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Notification &amp; Recovery Email
                  </label>
                  <input 
                    type="email"
                    required
                    value={settingsForm.newEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, newEmail: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px'
                    }}
                  />
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Password reset OTP codes will be delivered to this email.</span>
                </div>

                <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '12px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    New Password (Optional)
                  </label>
                  <input 
                    type="password"
                    minLength={6}
                    placeholder="Leave blank to keep existing password"
                    value={settingsForm.newPassword}
                    onChange={(e) => setSettingsForm({ ...settingsForm, newPassword: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      marginBottom: '8px'
                    }}
                  />

                  {settingsForm.newPassword && (
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Confirm New Password
                      </label>
                      <input 
                        type="password"
                        placeholder="Re-type new password"
                        value={settingsForm.confirmPassword}
                        onChange={(e) => setSettingsForm({ ...settingsForm, confirmPassword: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '13px'
                        }}
                      />
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '4px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0b1a2f', marginBottom: '4px' }}>
                    Current Password <span style={{ color: '#ef4444' }}>* (Required to verify changes)</span>
                  </label>
                  <input 
                    type="password"
                    required
                    placeholder="Enter your current password"
                    value={settingsForm.currentPassword}
                    onChange={(e) => setSettingsForm({ ...settingsForm, currentPassword: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setSettingsModalOpen(false)}
                    style={{
                      padding: '9px 16px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#475569',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={settingsLoading}
                    className="btn btn-primary"
                    style={{
                      padding: '9px 20px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: settingsLoading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {settingsLoading ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={14} />
                        <span>Update Credentials</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

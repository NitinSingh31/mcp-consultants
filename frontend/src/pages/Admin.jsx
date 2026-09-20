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
  const [securityCode, setSecurityCode] = useState('116');
  const [securityInput, setSecurityInput] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState('identifier');
  const [isLostPasswordView, setIsLostPasswordView] = useState(false);

  const generateSecurityCode = () => {
    const code = Math.floor(100 + Math.random() * 900).toString();
    setSecurityCode(code);
    return code;
  };

  useEffect(() => {
    generateSecurityCode();
  }, []);

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

    if (!securityInput || securityInput.trim() !== securityCode) {
      setLoginError('The security code entered is incorrect.');
      generateSecurityCode();
      setSecurityInput('');
      return;
    }

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
        generateSecurityCode();
        setSecurityInput('');
        throw new Error(json.error || `The password you entered for the username "${loginForm.identifier}" is incorrect.`);
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
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#1e293b',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '22px',
            fontWeight: 800,
            letterSpacing: '2.5px',
            color: '#0b1a2f',
            fontFamily: "'Cinzel', 'Times New Roman', Georgia, serif",
            textTransform: 'uppercase',
            marginBottom: '4px'
          }}>
            MCP <span style={{ color: '#c49a45' }}>CONSULTANTS</span>
          </div>
          <div style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '2px',
            color: '#64748b',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>
            Executive Search &bull; Leadership Advisory
          </div>
          <RefreshCw size={20} className="animate-spin" style={{ color: '#0b1a2f', margin: '0 auto 10px' }} />
          <p style={{ color: '#64748b', fontSize: '13px' }}>Verifying management portal session...</p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Screen B: Unauthenticated Sign In Panel (Executive Bespoke Style)
  // ---------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f4f6f8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
        boxSizing: 'border-box'
      }}>
        
        {/* Bespoke Brand Header (Clean typography, no generic circle icon) */}
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <Link to="/" title="Go to MCP Consultants" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 800,
              letterSpacing: '3px',
              color: '#0b1a2f',
              fontFamily: "'Cinzel', 'Times New Roman', Georgia, serif",
              textTransform: 'uppercase',
              lineHeight: 1.2
            }}>
              MCP <span style={{ color: '#c49a45' }}>CONSULTANTS</span>
            </div>
            <div style={{
              fontSize: '10.5px',
              fontWeight: 700,
              letterSpacing: '2px',
              color: '#64748b',
              textTransform: 'uppercase',
              marginTop: '5px'
            }}>
              Management Portal
            </div>
            <div style={{
              width: '44px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #c49a45, transparent)',
              margin: '8px auto 0'
            }} />
          </Link>
        </div>

        {/* Error Notice */}
        {loginError && !isLostPasswordView && (
          <div style={{
            width: '100%',
            maxWidth: '350px',
            marginBottom: '16px',
            padding: '12px 14px',
            backgroundColor: '#ffffff',
            borderLeft: '4px solid #dc2626',
            borderRadius: '0 6px 6px 0',
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.08), 0 1px 2px rgba(0,0,0,0.04)',
            fontSize: '13px',
            color: '#991b1b',
            boxSizing: 'border-box',
            lineHeight: 1.4
          }}>
            <strong>Error:</strong> {loginError}
          </div>
        )}

        {/* Lost Password Error / Success Notices */}
        {isLostPasswordView && forgotError && (
          <div style={{
            width: '100%',
            maxWidth: '350px',
            marginBottom: '16px',
            padding: '12px 14px',
            backgroundColor: '#ffffff',
            borderLeft: '4px solid #dc2626',
            borderRadius: '0 6px 6px 0',
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.08), 0 1px 2px rgba(0,0,0,0.04)',
            fontSize: '13px',
            color: '#991b1b',
            boxSizing: 'border-box',
            lineHeight: 1.4
          }}>
            <strong>Error:</strong> {forgotError}
          </div>
        )}

        {isLostPasswordView && forgotMessage && (
          <div style={{
            width: '100%',
            maxWidth: '350px',
            marginBottom: '16px',
            padding: '12px 14px',
            backgroundColor: '#ffffff',
            borderLeft: '4px solid #16a34a',
            borderRadius: '0 6px 6px 0',
            boxShadow: '0 2px 8px rgba(22, 163, 74, 0.08), 0 1px 2px rgba(0,0,0,0.04)',
            fontSize: '13px',
            color: '#166534',
            boxSizing: 'border-box',
            lineHeight: 1.4
          }}>
            {forgotMessage}
          </div>
        )}

        {/* Executive Card Box */}
        <div style={{
          width: '100%',
          maxWidth: '350px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          borderTop: '3px solid #c49a45',
          boxShadow: '0 10px 25px -5px rgba(11, 26, 47, 0.08), 0 4px 10px -2px rgba(11, 26, 47, 0.04)',
          padding: '28px 26px 32px',
          boxSizing: 'border-box'
        }}>
          {!isLostPasswordView ? (
            /* STANDARD LOGIN VIEW */
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
              
              <div style={{ marginBottom: '18px' }}>
                <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 700, color: '#0b1a2f', letterSpacing: '-0.2px' }}>
                  Sign In
                </h2>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>
                  Authorized administrators & recruiters
                </p>
              </div>

              {/* Username or Email Address */}
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Username or Email Address
              </label>
              <input 
                type="text"
                required
                value={loginForm.identifier}
                onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                onFocus={() => setFocusedField('identifier')}
                onBlur={() => setFocusedField(null)}
                autoFocus
                style={{
                  width: '100%',
                  fontSize: '15px',
                  padding: '7px 11px',
                  border: focusedField === 'identifier' ? '1.5px solid #0b1a2f' : '1px solid #cbd5e1',
                  boxShadow: focusedField === 'identifier' ? '0 0 0 3px rgba(196, 154, 69, 0.18)' : 'none',
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  marginBottom: '16px',
                  transition: 'all 0.15s ease-in-out'
                }}
              />

              {/* Password */}
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Password
              </label>
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <input 
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    width: '100%',
                    fontSize: '15px',
                    padding: '7px 36px 7px 11px',
                    border: focusedField === 'password' ? '1.5px solid #0b1a2f' : '1px solid #cbd5e1',
                    boxShadow: focusedField === 'password' ? '0 0 0 3px rgba(196, 154, 69, 0.18)' : 'none',
                    borderRadius: '6px',
                    boxSizing: 'border-box',
                    color: '#0f172a',
                    backgroundColor: '#ffffff',
                    outline: 'none',
                    transition: 'all 0.15s ease-in-out'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  title={showLoginPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '6px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {showLoginPassword ? <EyeOff size={16} color="#0b1a2f" /> : <Eye size={16} color="#64748b" />}
                </button>
              </div>

              {/* Security Code Display */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                  Security Verification Code
                </label>
                <button 
                  type="button" 
                  onClick={generateSecurityCode}
                  title="Generate new code"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#c49a45',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0
                  }}
                >
                  <RefreshCw size={11} />
                  <span>Refresh</span>
                </button>
              </div>

              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px dashed #cbd5e1',
                borderRadius: '6px',
                padding: '9px 14px',
                textAlign: 'center',
                fontSize: '22px',
                fontWeight: 800,
                color: '#0b1a2f',
                fontFamily: 'monospace, Courier, sans-serif',
                letterSpacing: '8px',
                marginBottom: '14px',
                userSelect: 'none',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)'
              }}>
                {securityCode}
              </div>

              {/* Enter the security code */}
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Enter the code above
              </label>
              <input 
                type="text"
                required
                value={securityInput}
                onChange={(e) => setSecurityInput(e.target.value)}
                onFocus={() => setFocusedField('security')}
                onBlur={() => setFocusedField(null)}
                autoComplete="off"
                placeholder="Type the 3-digit code"
                style={{
                  width: '100%',
                  fontSize: '15px',
                  padding: '7px 11px',
                  border: focusedField === 'security' ? '1.5px solid #0b1a2f' : '1px solid #cbd5e1',
                  boxShadow: focusedField === 'security' ? '0 0 0 3px rgba(196, 154, 69, 0.18)' : 'none',
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  marginBottom: '18px',
                  transition: 'all 0.15s ease-in-out'
                }}
              />

              {/* Bottom Row: Remember Me & Log In button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '13px', color: '#475569', cursor: 'pointer', userSelect: 'none' }}>
                  <input 
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{
                      width: '15px',
                      height: '15px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      accentColor: '#0b1a2f',
                      margin: 0
                    }}
                  />
                  <span>Remember Me</span>
                </label>

                <button
                  type="submit"
                  disabled={loginLoading}
                  style={{
                    backgroundColor: '#0b1a2f',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 20px',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    cursor: loginLoading ? 'not-allowed' : 'pointer',
                    letterSpacing: '0.4px',
                    boxShadow: '0 2px 4px rgba(11, 26, 47, 0.2)',
                    transition: 'background-color 0.15s ease-in-out'
                  }}
                  onMouseEnter={(e) => { if (!loginLoading) e.currentTarget.style.backgroundColor = '#162c4b'; }}
                  onMouseLeave={(e) => { if (!loginLoading) e.currentTarget.style.backgroundColor = '#0b1a2f'; }}
                >
                  {loginLoading ? 'Logging In...' : 'Log In'}
                </button>
              </div>

            </form>
          ) : (
            /* LOST PASSWORD VIEW */
            <div>
              <div style={{ marginBottom: '16px' }}>
                <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 700, color: '#0b1a2f' }}>
                  Password Recovery
                </h2>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>
                  Reset your administrator credentials
                </p>
              </div>

              {forgotStep === 1 ? (
                <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 16px', lineHeight: 1.5 }}>
                    Enter your registered administrator email. A secure 6-digit verification code will be dispatched to your inbox.
                  </p>

                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Registered Work Email
                  </label>
                  <input 
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    autoFocus
                    placeholder="Recruiter.mcpconsultants@gmail.com"
                    style={{
                      width: '100%',
                      fontSize: '15px',
                      padding: '7px 11px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      boxSizing: 'border-box',
                      color: '#0f172a',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                      marginBottom: '18px'
                    }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      style={{
                        backgroundColor: '#0b1a2f',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 20px',
                        fontSize: '13.5px',
                        fontWeight: 700,
                        cursor: forgotLoading ? 'not-allowed' : 'pointer',
                        boxShadow: '0 2px 4px rgba(11, 26, 47, 0.2)',
                        transition: 'background-color 0.15s ease-in-out'
                      }}
                      onMouseEnter={(e) => { if (!forgotLoading) e.currentTarget.style.backgroundColor = '#162c4b'; }}
                      onMouseLeave={(e) => { if (!forgotLoading) e.currentTarget.style.backgroundColor = '#0b1a2f'; }}
                    >
                      {forgotLoading ? 'Sending...' : 'Send Verification Code'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 16px', lineHeight: 1.5 }}>
                    Enter the 6-digit OTP code sent to <strong>{forgotEmail}</strong> and your new password.
                  </p>

                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    6-Digit Security OTP
                  </label>
                  <input 
                    type="text"
                    required
                    maxLength={6}
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value.trim())}
                    autoFocus
                    placeholder="123456"
                    style={{
                      width: '100%',
                      fontSize: '18px',
                      padding: '7px 11px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      boxSizing: 'border-box',
                      color: '#0f172a',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                      marginBottom: '16px',
                      letterSpacing: '4px',
                      textAlign: 'center'
                    }}
                  />

                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    New Password (Min 6 characters)
                  </label>
                  <input 
                    type="password"
                    required
                    minLength={6}
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    style={{
                      width: '100%',
                      fontSize: '15px',
                      padding: '7px 11px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      boxSizing: 'border-box',
                      color: '#0f172a',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                      marginBottom: '18px'
                    }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      style={{
                        backgroundColor: '#0b1a2f',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 20px',
                        fontSize: '13.5px',
                        fontWeight: 700,
                        cursor: forgotLoading ? 'not-allowed' : 'pointer',
                        boxShadow: '0 2px 4px rgba(11, 26, 47, 0.2)',
                        transition: 'background-color 0.15s ease-in-out'
                      }}
                      onMouseEnter={(e) => { if (!forgotLoading) e.currentTarget.style.backgroundColor = '#162c4b'; }}
                      onMouseLeave={(e) => { if (!forgotLoading) e.currentTarget.style.backgroundColor = '#0b1a2f'; }}
                    >
                      {forgotLoading ? 'Updating...' : 'Save New Password'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Links Outside Login Card */}
        <div style={{ width: '100%', maxWidth: '350px', marginTop: '16px', fontSize: '13px', color: '#64748b', boxSizing: 'border-box', textAlign: 'center' }}>
          <p style={{ margin: '0 0 10px' }}>
            {!isLostPasswordView ? (
              <button
                type="button"
                onClick={() => {
                  setIsLostPasswordView(true);
                  setForgotStep(1);
                  setForgotError('');
                  setForgotMessage('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: '#64748b',
                  fontSize: '13px',
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#0b1a2f'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; }}
              >
                Lost your password?
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsLostPasswordView(false);
                  setForgotError('');
                  setForgotMessage('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: '#64748b',
                  fontSize: '13px',
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#0b1a2f'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; }}
              >
                &larr; Back to Sign In
              </button>
            )}
          </p>
          <p style={{ margin: 0 }}>
            <Link 
              to="/" 
              style={{ 
                color: '#64748b', 
                textDecoration: 'none' 
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#0b1a2f'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; }}
            >
              &larr; Return to MCP Consultants
            </Link>
          </p>
        </div>

      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Screen C: Authenticated Admin Dashboard
  // ---------------------------------------------------------------------------
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#1e293b', fontFamily: 'var(--font-body)' }}>
      
      {/* Top Navbar */}
      {/* Top Navbar */}
      <header style={{ 
        backgroundColor: '#0a1728', 
        borderBottom: '1px solid rgba(196, 154, 69, 0.3)', 
        color: '#ffffff', 
        padding: '12px 0',
        position: 'sticky',
        top: 0,
        zIndex: 90,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(12px)'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Left: Brand Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#ffffff', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, letterSpacing: '1.5px', fontSize: '18px', color: '#ffffff', lineHeight: 1.1 }}>
                MCP <span style={{ color: 'var(--color-accent, #c49a45)' }}>CONSULTANTS</span>
              </span>
              <span style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                Management Portal
              </span>
            </Link>
          </div>

          {/* Center: Recruitment Module Suite */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px', 
            backgroundColor: 'rgba(255, 255, 255, 0.05)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            padding: '3px 4px', 
            borderRadius: '9px' 
          }}>
            {/* Resdex Search */}
            <Link 
              to="/admin/resdex" 
              className="admin-suite-btn"
              style={{ 
                padding: '6px 14px', 
                fontSize: '12.5px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '7px', 
                color: '#e2e8f0',
                borderRadius: '7px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              title="Launch Candidate Talent Search Engine"
            >
              <Search size={14} style={{ color: 'var(--color-accent, #c49a45)' }} />
              <span>Resdex Search</span>
            </Link>

            {/* Manage Jobs */}
            <Link 
              to="/admin/jobs" 
              className="admin-suite-btn"
              style={{ 
                padding: '6px 14px', 
                fontSize: '12.5px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '7px', 
                color: '#e2e8f0',
                borderRadius: '7px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              title="Manage live job postings & applicant responses"
            >
              <FileText size={14} style={{ color: 'var(--color-accent, #c49a45)' }} />
              <span>Manage Jobs</span>
            </Link>

            {/* Post a Job (Primary Action in module) */}
            <Link 
              to="/admin/post-job" 
              style={{ 
                padding: '6px 14px', 
                fontSize: '12.5px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                background: 'linear-gradient(135deg, #c49a45 0%, #dfb45e 100%)',
                color: '#0b1a2f',
                borderRadius: '7px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(196, 154, 69, 0.35)',
                transition: 'all 0.2s ease'
              }}
              title="Post a new executive mandate / job vacancy"
            >
              <Building2 size={14} />
              <span>Post a Job</span>
            </Link>
          </div>

          {/* Right: Quick Utilities & Admin Profile Capsule */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            
            {/* Refresh Data */}
            <button 
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="admin-util-btn"
              style={{ 
                padding: '7px 12px', 
                fontSize: '12px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                cursor: 'pointer',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#cbd5e1',
                borderRadius: '8px',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
              title="Refresh mandates, candidates & inquiries"
            >
              <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>

            {/* View Live Website */}
            <Link 
              to="/" 
              className="admin-util-btn"
              style={{ 
                padding: '7px 12px', 
                fontSize: '12px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                textDecoration: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#cbd5e1',
                borderRadius: '8px',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
              title="View Public Website"
            >
              <ExternalLink size={13} />
              <span>Website</span>
            </Link>

            {/* Subtle Divider */}
            <div style={{ width: '1px', height: '22px', backgroundColor: 'rgba(255, 255, 255, 0.15)', margin: '0 2px' }} />

            {/* Admin Profile Capsule */}
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(196, 154, 69, 0.35)',
              padding: '4px 6px 4px 10px',
              borderRadius: '999px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18)'
            }}>
              {/* User Avatar with Shield and Status Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #162b48, #0b1a2f)',
                  border: '1px solid var(--color-accent, #c49a45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-accent, #c49a45)'
                }}>
                  <Shield size={12} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>
                    {currentUser.username || 'admin'}
                  </span>
                </div>
                <span 
                  style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    backgroundColor: '#10b981', 
                    boxShadow: '0 0 6px #10b981' 
                  }} 
                  title="Session active"
                />
              </div>

              {/* Settings Action Button */}
              <button 
                onClick={() => {
                  setSettingsModalOpen(true);
                  setSettingsError('');
                  setSettingsMessage('');
                }}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.08)', 
                  border: 'none', 
                  color: '#e2e8f0', 
                  width: '28px', 
                  height: '28px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title="Account Settings (Change username / password)"
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent, #c49a45)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
              >
                <Settings size={14} />
              </button>

              {/* Sign Out Action Button */}
              <button 
                onClick={handleLogout}
                style={{ 
                  background: 'rgba(239, 68, 68, 0.15)', 
                  border: '1px solid rgba(239, 68, 68, 0.3)', 
                  color: '#f87171', 
                  padding: '4px 10px', 
                  borderRadius: '999px', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '5px', 
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title="Sign Out of Management Portal"
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.28)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; }}
              >
                <LogOut size={12} />
                <span>Sign Out</span>
              </button>
            </div>

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
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Role & Company</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Sector</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Exp & CTC</th>
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
                            {(item.city || item.location) && (
                              <div style={{ fontSize: '11px', color: '#0369a1', fontWeight: 600, marginTop: '2px' }}>
                                📍 {item.city || item.location}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ fontSize: '12px' }}>
                              <a href={`mailto:${item.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{item.email}</a>
                              {item.phone && <div style={{ color: '#64748b' }}>{item.phone}</div>}
                            </div>
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ fontWeight: 700, color: 'var(--color-primary, #0b1a2f)' }}>
                              {item.designation || item.current_role}
                            </div>
                            {item.company && (
                              <div style={{ fontSize: '12px', color: '#64748b' }}>
                                {item.company}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, backgroundColor: 'rgba(11, 26, 47, 0.08)', color: 'var(--color-primary, #0b1a2f)' }}>
                              {item.sector}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px', color: '#475569', fontSize: '13px' }}>
                            <div>{item.experience}</div>
                            {item.annual_ctc && (
                              <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, marginTop: '2px' }}>
                                ₹{item.annual_ctc} LPA
                              </div>
                            )}
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
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Contact Info</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Company</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Referral Source</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Message</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Attached File</th>
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
                          <td style={{ padding: '14px 18px', color: '#0f172a', fontWeight: 600 }}>
                            {item.company || '-'}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, backgroundColor: 'rgba(196, 154, 69, 0.15)', color: '#92400e' }}>
                              {item.source || item.topic || 'General Query'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px', maxWidth: '280px', color: '#475569', lineHeight: 1.4 }}>
                            {item.message || '-'}
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
                                <span>{item.cv_original_name || 'Download File'}</span>
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

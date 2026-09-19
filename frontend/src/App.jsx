import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

// Public Core Pages (Eagerly loaded for instant initial rendering)
import Home from './pages/Home';
import About from './pages/About';
import Industries from './pages/Industries';
import Services from './pages/Services';
import Insights from './pages/Insights';
import Contact from './pages/Contact';
import PublicJobs from './pages/PublicJobs';
import NotFound from './pages/NotFound';

// Recruiter & Admin Modules (Code-split with React.lazy for optimized bundle size)
const Admin = lazy(() => import('./pages/Admin'));
const ResdexSearch = lazy(() => import('./pages/ResdexSearch'));
const PostJob = lazy(() => import('./pages/PostJob'));
const ManageJobs = lazy(() => import('./pages/ManageJobs'));

// Lightweight loading indicator for lazy-loaded route chunks
function RouteLoadingFallback() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      fontFamily: "'Inter', sans-serif",
      color: '#0056b3'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #e2e8f0',
        borderTop: '3px solid #0056b3',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Loading workspace...</span>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ScrollToTop & Dynamic Document Title Manager
function RouteObserver() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // 1. Scroll to Top / Hash Anchor
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // 2. Dynamic Title Mapping
    const titleMap = {
      '/': 'MCP CONSULTANTS | Executive Search & Leadership Advisory',
      '/about': 'About Us | MCP Consultants',
      '/industries': 'Industries & Sectors | MCP Consultants',
      '/services': 'Executive Search & Advisory Services | MCP Consultants',
      '/insights': 'Leadership Insights & Intelligence | MCP Consultants',
      '/contact': 'Contact Us | MCP Consultants',
      '/i-am-hiring': 'Hire Leaders • Mandate Inquiry | MCP Consultants',
      '/i_am_hiring': 'Hire Leaders • Mandate Inquiry | MCP Consultants',
      '/i-am-seeking-leadership-roles': 'Submit CV • Executive Roles | MCP Consultants',
      '/i_am_seeking_leadership_roles': 'Submit CV • Executive Roles | MCP Consultants',
      '/seeking-leadership-roles': 'Submit CV • Executive Roles | MCP Consultants',
      '/i-have-other-queries': 'Inquiries & Regional Offices | MCP Consultants',
      '/i_have_other_queries': 'Inquiries & Regional Offices | MCP Consultants',
      '/other-queries': 'Inquiries & Regional Offices | MCP Consultants',
      '/contact-us': 'Contact Us | MCP Consultants',
      '/jobs': 'Executive Careers & Job Board | MCP Consultants',
      '/admin': 'Admin Portal | MCP Consultants',
      '/admin/resdex': 'Resdex Talent Search | MCP Consultants',
      '/resdex': 'Resdex Talent Search | MCP Consultants',
      '/admin/post-job': 'Post a Job • Employer Wizard | MCP Consultants',
      '/post-job': 'Post a Job • Employer Wizard | MCP Consultants',
      '/admin/jobs': 'Manage Job Mandates | MCP Consultants'
    };

    document.title = titleMap[pathname] || 'MCP CONSULTANTS | Executive Search & Leadership Advisory';
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin') || 
                  location.pathname.startsWith('/resdex') || 
                  location.pathname.startsWith('/post-job');

  return (
    <ErrorBoundary>
      <div className="app-container">
        <RouteObserver />
        
        {/* Show corporate Navbar only on non-admin routes */}
        {!isAdmin && <Navbar />}

        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            {/* Public Corporate Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/industries" element={<Industries />} />
            <Route path="/services" element={<Services />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/i-am-hiring" element={<Contact />} />
            <Route path="/i_am_hiring" element={<Contact />} />
            <Route path="/i-am-seeking-leadership-roles" element={<Contact defaultTab="candidate" />} />
            <Route path="/i_am_seeking_leadership_roles" element={<Contact defaultTab="candidate" />} />
            <Route path="/seeking-leadership-roles" element={<Contact defaultTab="candidate" />} />
            <Route path="/i-have-other-queries" element={<Contact defaultTab="queries" />} />
            <Route path="/i_have_other_queries" element={<Contact defaultTab="queries" />} />
            <Route path="/other-queries" element={<Contact defaultTab="queries" />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/jobs" element={<PublicJobs />} />

            {/* Recruiter & Admin Management Pages (Lazy Loaded) */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/resdex" element={<ResdexSearch />} />
            <Route path="/resdex" element={<ResdexSearch />} />
            <Route path="/admin/post-job" element={<PostJob />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/admin/jobs" element={<ManageJobs />} />

            {/* Branded 404 Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>

        {/* Show corporate Footer only on non-admin routes */}
        {!isAdmin && <Footer />}
      </div>
    </ErrorBoundary>
  );
}

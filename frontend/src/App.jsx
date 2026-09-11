import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Industries from './pages/Industries';
import Services from './pages/Services';
import Insights from './pages/Insights';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import ResdexSearch from './pages/ResdexSearch';

// ScrollToTop component: ensures page starts at top upon navigation
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin') || location.pathname.startsWith('/resdex');

  return (
    <div className="app-container">
      <ScrollToTop />
      
      {/* Show corporate Navbar only on non-admin routes */}
      {!isAdmin && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/services" element={<Services />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/resdex" element={<ResdexSearch />} />
        <Route path="/resdex" element={<ResdexSearch />} />
        {/* Fallback route */}
        <Route path="*" element={<Home />} />
      </Routes>

      {/* Show corporate Footer only on non-admin routes */}
      {!isAdmin && <Footer />}
    </div>
  );
}

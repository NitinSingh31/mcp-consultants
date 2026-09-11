import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Bookmark,
  Bell,
  User,
  Grid,
  History,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Download,
  Mail,
  Phone,
  Building2,
  Briefcase,
  MapPin,
  Calendar,
  Award,
  CheckCircle2,
  X,
  ExternalLink,
  ShieldCheck,
  Headphones,
  ArrowLeft,
  Filter,
  Check,
  Plus
} from 'lucide-react';
import { apiUrl } from '../api';
import {
  filterSkills,
  filterDesignations,
  filterCompanies,
  filterIndustries,
  SKILLS_DATABASE
} from '../data/resdexSuggestions';

// Helper to highlight matching letters/substring in autocomplete suggestions
function highlightMatch(text, query) {
  if (!query || !query.trim()) return text;
  const cleanQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${cleanQuery})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, index) =>
    regex.test(part) ? (
      <span
        key={index}
        style={{
          color: '#0056b3',
          backgroundColor: '#e0f2fe',
          fontWeight: 800,
          borderRadius: '2px',
          padding: '0 2px'
        }}
      >
        {part}
      </span>
    ) : (
      part
    )
  );
}

export default function ResdexSearch() {
  // Navigation State
  const [activeNavTab, setActiveNavTab] = useState('resdex');
  const [activeSubTab, setActiveSubTab] = useState('search');

  // Form Filter State (Matching Naukri Resdex layout)
  // 1. Client Autocomplete State
  const [clientHiringFor, setClientHiringFor] = useState('');
  const [showClientSuggestions, setShowClientSuggestions] = useState(false);

  // 2. Keywords Autocomplete & Chips State
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [showKeywordSuggestions, setShowKeywordSuggestions] = useState(false);
  const [booleanMode, setBooleanMode] = useState(false);
  const [mandatoryKeywords, setMandatoryKeywords] = useState(false);
  const [keywordLocation, setKeywordLocation] = useState('Entire resume');
  const [showExcludeKeywords, setShowExcludeKeywords] = useState(false);
  const [excludeKeywords, setExcludeKeywords] = useState('');
  const [showItSkills, setShowItSkills] = useState(false);
  const [itSkills, setItSkills] = useState('');

  // 3. Experience
  const [minExp, setMinExp] = useState('');
  const [maxExp, setMaxExp] = useState('');

  // 4. Industry / Sector Autocomplete State
  const [industry, setIndustry] = useState('');
  const [showIndustrySuggestions, setShowIndustrySuggestions] = useState(false);

  // 5. Company Autocomplete & Chips State
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [companyInput, setCompanyInput] = useState('');
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
  const [currentCompanyOnly, setCurrentCompanyOnly] = useState(true);
  const [showExcludeCompany, setShowExcludeCompany] = useState(false);
  const [excludeCompany, setExcludeCompany] = useState('');

  // 6. Designation Autocomplete & Chips State
  const [selectedDesignations, setSelectedDesignations] = useState([]);
  const [designationInput, setDesignationInput] = useState('');
  const [showDesignationSuggestions, setShowDesignationSuggestions] = useState(false);
  const [designationBoolean, setDesignationBoolean] = useState(false);
  const [currentDesignationOnly, setCurrentDesignationOnly] = useState(true);

  // 7. Notice Period Pills
  const [noticePeriod, setNoticePeriod] = useState('Any');
  const noticeOptions = [
    'Any',
    '0 - 15 days',
    '1 month',
    '2 months',
    '3 months',
    'More than 3 months',
    'Currently serving notice period'
  ];

  // Accordion Toggles
  const [educationOpen, setEducationOpen] = useState(false);
  const [ugQualification, setUgQualification] = useState('Any');
  const [pgQualification, setPgQualification] = useState('Any');

  const [diversityOpen, setDiversityOpen] = useState(false);
  const [gender, setGender] = useState('All candidates');
  const [careerBreak, setCareerBreak] = useState(false);

  const [differentlyAbledOpen, setDifferentlyAbledOpen] = useState(false);
  const [differentlyAbledType, setDifferentlyAbledType] = useState('Any');
  const [defencePersonnel, setDefencePersonnel] = useState('Any');

  const [additionalDetailsOpen, setAdditionalDetailsOpen] = useState(false);
  const [candidateCategory, setCandidateCategory] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');

  // Work & Display Details
  const [jobType, setJobType] = useState('Any');
  const [employmentType, setEmploymentType] = useState('Any');
  const [displayFilter, setDisplayFilter] = useState('All candidates');
  const [verifiedMobileOnly, setVerifiedMobileOnly] = useState(false);
  const [verifiedEmailOnly, setVerifiedEmailOnly] = useState(false);
  const [attachedResumeOnly, setAttachedResumeOnly] = useState(false);

  const [activeWindow, setActiveWindow] = useState('6 months');

  // Search Results & Loading State
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [totalMatches, setTotalMatches] = useState(0);

  // Recent & Saved Searches
  const [recentSearches, setRecentSearches] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);

  // Outside click listener to dismiss all autocomplete dropdowns
  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest('.resdex-autocomplete-wrapper')) {
        setShowKeywordSuggestions(false);
        setShowCompanySuggestions(false);
        setShowDesignationSuggestions(false);
        setShowIndustrySuggestions(false);
        setShowClientSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Initial Data & Recent Searches
  useEffect(() => {
    fetchRecentSearches();
    // Pre-execute a search to show available talent right away
    handleSearch(false);
  }, []);

  const fetchRecentSearches = async () => {
    try {
      const res = await fetch(apiUrl('/api/candidates/recent-searches'));
      const data = await res.json();
      if (data.success) {
        setRecentSearches(data.recentSearches || []);
        setSavedSearches(data.savedSearches || []);
      }
    } catch (err) {
      console.error('Failed to load recent searches:', err);
    }
  };

  // Keyword Chip Helpers
  const addKeywordChip = (skillName) => {
    if (!skillName || !skillName.trim()) return;
    const clean = skillName.trim();
    if (!selectedKeywords.includes(clean)) {
      setSelectedKeywords([...selectedKeywords, clean]);
    }
    setKeywordInput('');
    setShowKeywordSuggestions(false);
  };

  const removeKeywordChip = (skillName) => {
    setSelectedKeywords(selectedKeywords.filter((k) => k !== skillName));
  };

  // Company Chip Helpers
  const addCompanyChip = (companyName) => {
    if (!companyName || !companyName.trim()) return;
    const clean = companyName.trim();
    if (!selectedCompanies.includes(clean)) {
      setSelectedCompanies([...selectedCompanies, clean]);
    }
    setCompanyInput('');
    setShowCompanySuggestions(false);
  };

  const removeCompanyChip = (companyName) => {
    setSelectedCompanies(selectedCompanies.filter((c) => c !== companyName));
  };

  // Designation Chip Helpers
  const addDesignationChip = (roleName) => {
    if (!roleName || !roleName.trim()) return;
    const clean = roleName.trim();
    if (!selectedDesignations.includes(clean)) {
      setSelectedDesignations([...selectedDesignations, clean]);
    }
    setDesignationInput('');
    setShowDesignationSuggestions(false);
  };

  const removeDesignationChip = (roleName) => {
    setSelectedDesignations(selectedDesignations.filter((d) => d !== roleName));
  };

  // Execute Search Function
  const handleSearch = async (scrollToResults = true) => {
    setSearching(true);
    try {
      const activeKeywords = [...selectedKeywords, keywordInput.trim()].filter(Boolean).join(' ');
      const activeCompanies = [...selectedCompanies, companyInput.trim()].filter(Boolean).join(' ');
      const activeDesignations = [...selectedDesignations, designationInput.trim()].filter(Boolean).join(' ');

      const payload = {
        keywords: activeKeywords,
        booleanMode,
        client: clientHiringFor,
        minExp,
        maxExp,
        industry,
        company: activeCompanies,
        excludeCompany,
        designation: activeDesignations,
        noticePeriod,
        ugQualification,
        pgQualification,
        gender,
        displayFilter,
        verifiedMobileOnly,
        verifiedEmailOnly,
        attachedResumeOnly
      };

      const res = await fetch(apiUrl('/api/candidates/search'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setSearchResults(data.candidates || []);
        setTotalMatches(data.total || 0);
        setSearchExecuted(true);

        if (scrollToResults) {
          setTimeout(() => {
            const el = document.getElementById('search-results-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  // Fill Search from Recent / Saved
  const handleFillSearch = (query, autoExecute = false) => {
    if (query.keywords) {
      const terms = query.keywords.split(/[\s,]+/).filter(Boolean);
      setSelectedKeywords(terms);
      setKeywordInput('');
    } else {
      setSelectedKeywords([]);
      setKeywordInput('');
    }

    if (query.industry && query.industry !== 'Any') {
      setIndustry(query.industry);
    } else {
      setIndustry('');
    }

    if (query.company) {
      setSelectedCompanies([query.company]);
      setCompanyInput('');
    } else {
      setSelectedCompanies([]);
      setCompanyInput('');
    }

    if (query.designation) {
      setSelectedDesignations([query.designation]);
      setDesignationInput('');
    } else {
      setSelectedDesignations([]);
      setDesignationInput('');
    }

    if (query.noticePeriod) setNoticePeriod(query.noticePeriod);
    if (query.minExp) setMinExp(query.minExp);
    if (query.maxExp) setMaxExp(query.maxExp);

    if (autoExecute) {
      setTimeout(() => {
        handleSearch(true);
      }, 50);
    } else {
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedKeywords([]);
    setKeywordInput('');
    setSelectedCompanies([]);
    setCompanyInput('');
    setSelectedDesignations([]);
    setDesignationInput('');
    setIndustry('');
    setClientHiringFor('');
    setNoticePeriod('Any');
    setMinExp('');
    setMaxExp('');
    setExcludeKeywords('');
    setExcludeCompany('');
    setItSkills('');
    handleSearch(false);
  };

  // Filtered Autocomplete Lists
  const filteredSkills = filterSkills(keywordInput);
  const filteredCompanies = filterCompanies(companyInput);
  const filteredDesignations = filterDesignations(designationInput);
  const filteredIndustries = filterIndustries(industry);
  const filteredClients = filterCompanies(clientHiringFor);

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#0f172a' }}>
      
      {/* 1. TOP CORPORATE NAVIGATION (Styled like Naukri / MCP Resdex) */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Brand & Section Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            
            {/* Logo */}
            <Link to="/admin/resdex" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #0056b3, #0077ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: '900', fontSize: '16px', letterSpacing: '-0.5px' }}>
                M
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px', color: '#0056b3', lineHeight: 1 }}>mcp</span>
                <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#64748b' }}>resdex</span>
              </div>
            </Link>

            {/* Main Tabs */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setActiveNavTab('jobs')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '18px 12px',
                  fontSize: '14px',
                  fontWeight: activeNavTab === 'jobs' ? 700 : 500,
                  color: activeNavTab === 'jobs' ? '#0f172a' : '#475569',
                  cursor: 'pointer',
                  borderBottom: activeNavTab === 'jobs' ? '3px solid #ff4d4f' : '3px solid transparent'
                }}
              >
                Jobs & Responses
              </button>

              <button
                onClick={() => setActiveNavTab('resdex')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '18px 12px',
                  fontSize: '14px',
                  fontWeight: activeNavTab === 'resdex' ? 700 : 500,
                  color: activeNavTab === 'resdex' ? '#0f172a' : '#475569',
                  cursor: 'pointer',
                  borderBottom: activeNavTab === 'resdex' ? '3px solid #ff4d4f' : '3px solid transparent'
                }}
              >
                Resdex
              </button>

              <button
                onClick={() => setActiveNavTab('reports')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '18px 12px',
                  fontSize: '14px',
                  fontWeight: activeNavTab === 'reports' ? 700 : 500,
                  color: activeNavTab === 'reports' ? '#0f172a' : '#475569',
                  cursor: 'pointer',
                  borderBottom: activeNavTab === 'reports' ? '3px solid #ff4d4f' : '3px solid transparent'
                }}
              >
                Reports
              </button>
            </nav>

          </div>

          {/* Right Utilities */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            
            {/* Quick Search Bar */}
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: '20px', padding: '6px 14px', gap: '8px', width: '220px' }}>
              <Search size={15} style={{ color: '#64748b' }} />
              <input 
                type="text" 
                placeholder="Search candidates..." 
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(true)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '100%', color: '#0f172a' }}
              />
            </div>

            <button title="Recent Search History" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '6px' }}>
              <History size={18} />
            </button>

            <button title="Saved Searches" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '6px' }}>
              <Bookmark size={18} />
            </button>

            {/* Notification with Badge */}
            <div style={{ position: 'relative' }}>
              <button title="Notifications" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '6px' }}>
                <Bell size={18} />
              </button>
              <span style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: '#ef4444', color: '#ffffff', fontSize: '10px', fontWeight: 800, width: '15px', height: '15px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                5
              </span>
            </div>

            {/* Recruiter Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px', borderLeft: '1px solid #e2e8f0' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                N
              </div>
            </div>

            {/* Return to Admin Portal Button */}
            <Link 
              to="/admin" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                backgroundColor: '#0b1a2f',
                color: '#c49a45',
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'none',
                border: '1px solid #c49a45'
              }}
            >
              <ArrowLeft size={14} />
              <span>Admin Portal</span>
            </Link>

          </div>

        </div>
      </header>

      {/* 2. SUB-NAVIGATION TABS (Search candidates | Send NVite) */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '32px' }}>
          <button
            onClick={() => setActiveSubTab('search')}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 4px',
              fontSize: '14px',
              fontWeight: activeSubTab === 'search' ? 700 : 500,
              color: activeSubTab === 'search' ? '#0056b3' : '#64748b',
              cursor: 'pointer',
              borderBottom: activeSubTab === 'search' ? '2px solid #0056b3' : '2px solid transparent'
            }}
          >
            Search candidates
          </button>

          <button
            onClick={() => setActiveSubTab('nvite')}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 4px',
              fontSize: '14px',
              fontWeight: activeSubTab === 'nvite' ? 700 : 500,
              color: activeSubTab === 'nvite' ? '#0056b3' : '#64748b',
              cursor: 'pointer',
              borderBottom: activeSubTab === 'nvite' ? '2px solid #0056b3' : '2px solid transparent'
            }}
          >
            Send NVite
          </button>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE CONTAINER (2-Column Layout) */}
      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 24px 100px' }}>
        
        {/* Page Title & AI Assist Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Search candidates
          </h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#f5f3ff', color: '#7c3aed', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: 600, border: '1px solid #ddd6fe' }}>
            <Sparkles size={14} />
            <span>AI search assist</span>
            <Info size={13} style={{ cursor: 'pointer' }} />
          </div>
        </div>

        {/* 2-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '32px', alignItems: 'start' }}>
          
          {/* ============================================================= */}
          {/* LEFT COLUMN: MULTI-FACETED CANDIDATE SEARCH FORM             */}
          {/* ============================================================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* ----------------------------------------------------------- */}
            {/* Card 1: Client you're hiring for (WITH AUTOCOMPLETE)       */}
            {/* ----------------------------------------------------------- */}
            <div className="resdex-autocomplete-wrapper" style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px 24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Client you're hiring for</span>
                <span style={{ backgroundColor: '#fff7ed', color: '#ea580c', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', border: '1px solid #ffedd5' }}>New</span>
              </div>
              
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Add client/company you're hiring for (e.g. L&T, Tata Motors, Thermax)"
                  value={clientHiringFor}
                  onChange={(e) => {
                    setClientHiringFor(e.target.value);
                    setShowClientSuggestions(true);
                  }}
                  onFocus={() => setShowClientSuggestions(true)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                />

                {/* Client Autocomplete Dropdown */}
                {showClientSuggestions && filteredClients.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                    zIndex: 60,
                    maxHeight: '240px',
                    overflowY: 'auto'
                  }}>
                    <div style={{ padding: '8px 14px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {clientHiringFor ? `Matching Clients "${clientHiringFor}"` : 'Top Executive Clients'}
                    </div>
                    {filteredClients.map((clientItem, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setClientHiringFor(clientItem.name);
                          setShowClientSuggestions(false);
                        }}
                        style={{
                          padding: '10px 14px',
                          borderBottom: '1px solid #f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                      >
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                          {highlightMatch(clientItem.name, clientHiringFor)}
                        </span>
                        <span style={{ fontSize: '11px', backgroundColor: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                          {clientItem.sector}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', color: '#7c3aed', fontSize: '12px', fontWeight: 600 }}>
                <Sparkles size={13} />
                <span>Get AI-powered results tailored to your client's hiring needs</span>
              </div>
            </div>

            {/* ----------------------------------------------------------- */}
            {/* Card 2: KEYWORDS (WITH RICH AUTOCOMPLETE & TAG CHIPS)       */}
            {/* ----------------------------------------------------------- */}
            <div className="resdex-autocomplete-wrapper" style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px 24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Keywords</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>(Type any letter A-Z to see instant matching skills & competencies)</span>
                </div>

                {/* Boolean Mode Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setBooleanMode(!booleanMode)}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Boolean {booleanMode ? 'on' : 'off'}</span>
                  <div style={{ width: '32px', height: '18px', backgroundColor: booleanMode ? '#0056b3' : '#cbd5e1', borderRadius: '10px', position: 'relative', transition: 'background-color 0.2s' }}>
                    <div style={{ width: '14px', height: '14px', backgroundColor: '#ffffff', borderRadius: '50%', position: 'absolute', top: '2px', left: booleanMode ? '16px' : '2px', transition: 'left 0.2s' }} />
                  </div>
                </div>
              </div>

              {/* Tag Chips Container & Active Input */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  alignItems: 'center',
                  minHeight: '48px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: showKeywordSuggestions ? '1.5px solid #0056b3' : '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  boxShadow: showKeywordSuggestions ? '0 0 0 3px rgba(0, 86, 179, 0.1)' : 'none',
                  transition: 'all 0.15s'
                }}>
                  
                  {/* Selected Keyword Tag Chips */}
                  {selectedKeywords.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        backgroundColor: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        color: '#0056b3',
                        padding: '4px 10px',
                        borderRadius: '16px',
                        fontSize: '13px',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeKeywordChip(tag)}
                        style={{ background: 'none', border: 'none', color: '#0056b3', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}

                  {/* Typing input */}
                  <input 
                    type="text" 
                    placeholder={selectedKeywords.length === 0 ? "Type any letter A-Z for skills (e.g. A for AutoCAD, B for Battery, C for CNC, F for Fabrication...)" : "Add more skills..."}
                    value={keywordInput}
                    onChange={(e) => {
                      setKeywordInput(e.target.value);
                      setShowKeywordSuggestions(true);
                    }}
                    onFocus={() => setShowKeywordSuggestions(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && keywordInput.trim()) {
                        e.preventDefault();
                        addKeywordChip(keywordInput.trim());
                      } else if (e.key === 'Backspace' && !keywordInput && selectedKeywords.length > 0) {
                        removeKeywordChip(selectedKeywords[selectedKeywords.length - 1]);
                      }
                    }}
                    style={{
                      border: 'none',
                      outline: 'none',
                      fontSize: '14px',
                      flex: 1,
                      minWidth: '240px',
                      padding: '6px 0',
                      backgroundColor: 'transparent',
                      color: '#0f172a'
                    }}
                  />

                  {/* Clear all keywords if any */}
                  {selectedKeywords.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedKeywords([])}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '11px', cursor: 'pointer', padding: '4px', textDecoration: 'underline' }}
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* ========================================================= */}
                {/* REAL NAUKRI RESDEX SKILLS AUTOCOMPLETE DROPDOWN          */}
                {/* ========================================================= */}
                {showKeywordSuggestions && filteredSkills.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    boxShadow: '0 12px 28px -4px rgba(0,0,0,0.12), 0 8px 10px -6px rgba(0,0,0,0.08)',
                    zIndex: 70,
                    maxHeight: '340px',
                    overflowY: 'auto'
                  }}>
                    {/* Header bar */}
                    <div style={{ padding: '8px 16px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>
                        {keywordInput ? `Matching Skills (${filteredSkills.length}) for "${keywordInput}"` : '🔥 Popular & Trending Executive Skills (Click to add)'}
                      </span>
                      <span style={{ color: '#0056b3', fontWeight: 700 }}>Click to add tag</span>
                    </div>

                    {/* Suggestions List */}
                    {filteredSkills.map((skill, idx) => (
                      <div
                        key={idx}
                        onClick={() => addKeywordChip(skill.name)}
                        style={{
                          padding: '11px 16px',
                          borderBottom: '1px solid #f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'background-color 0.12s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
                            {highlightMatch(skill.name, keywordInput)}
                          </span>
                          <span style={{ fontSize: '11px', backgroundColor: '#f3e8ff', color: '#7e22ce', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                            {skill.category}
                          </span>
                        </div>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                          {skill.count}
                        </span>
                      </div>
                    ))}

                    {/* Footer bar */}
                    <div style={{ padding: '8px 16px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: '11px', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Showing {filteredSkills.length} skills • Scroll to view all</span>
                      <span style={{ fontWeight: 600 }}>Type any letter A-Z to filter</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Trending Skills Chips Ribbon (Instant 1-Click Addition) */}
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Quick Add:</span>
                {['Fabrication', 'Six Sigma', 'CNC Machining', 'EV Powertrain', 'Battery Systems', 'AutoCAD', 'Blast Furnace', 'Plant Operations', 'Total Productive Maintenance (TPM)', 'Robotics'].map((quickSkill) => {
                  const isAdded = selectedKeywords.includes(quickSkill);
                  return (
                    <button
                      key={quickSkill}
                      type="button"
                      onClick={() => isAdded ? removeKeywordChip(quickSkill) : addKeywordChip(quickSkill)}
                      style={{
                        background: isAdded ? '#dbeafe' : '#f8fafc',
                        border: isAdded ? '1px solid #93c5fd' : '1px solid #e2e8f0',
                        color: isAdded ? '#1d4ed8' : '#475569',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {isAdded ? <Check size={11} /> : <Plus size={11} />}
                      <span>{quickSkill}</span>
                    </button>
                  );
                })}
              </div>

              {/* Checkbox & Dropdown bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={mandatoryKeywords} 
                    onChange={(e) => setMandatoryKeywords(e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span>Mark all keywords as mandatory</span>
                </label>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#0056b3', cursor: 'pointer' }}>
                  <span>Search keyword in {keywordLocation}</span>
                  <ChevronDown size={14} />
                </div>
              </div>

              {/* Action Links */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                <button 
                  onClick={() => setShowExcludeKeywords(!showExcludeKeywords)}
                  style={{ background: 'none', border: 'none', color: '#0056b3', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  + Add Exclude Keywords
                </button>
                <button 
                  onClick={() => setShowItSkills(!showItSkills)}
                  style={{ background: 'none', border: 'none', color: '#0056b3', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  + Add IT Skills
                </button>
              </div>

              {showExcludeKeywords && (
                <div style={{ marginTop: '12px' }}>
                  <input 
                    type="text" 
                    placeholder="Enter keywords you want to exclude (e.g. Intern, Trainee, Contract)"
                    value={excludeKeywords}
                    onChange={(e) => setExcludeKeywords(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #fca5a5', fontSize: '13px', backgroundColor: '#fef2f2' }}
                  />
                </div>
              )}
            </div>

            {/* ----------------------------------------------------------- */}
            {/* Card 3: Experience                                         */}
            {/* ----------------------------------------------------------- */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px 24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: '10px' }}>Experience (in Years)</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Min Experience</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={minExp}
                    onChange={(e) => setMinExp(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>
                <span style={{ color: '#94a3b8', marginTop: '20px' }}>to</span>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Max Experience</label>
                  <input 
                    type="number" 
                    placeholder="30+" 
                    value={maxExp}
                    onChange={(e) => setMaxExp(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>
              </div>
            </div>

            {/* ----------------------------------------------------------- */}
            {/* Card 4: INDUSTRY, COMPANY & DESIGNATION AUTOCOMPLETE       */}
            {/* ----------------------------------------------------------- */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px 24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              
              {/* Industry / Sector with Autocomplete */}
              <div className="resdex-autocomplete-wrapper" style={{ marginBottom: '22px', position: 'relative' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: '8px' }}>Industry / Sector</span>
                <input 
                  type="text" 
                  placeholder="e.g. Heavy Engineering, Automotive, Steel & Metallurgy, CleanTech"
                  value={industry}
                  onChange={(e) => {
                    setIndustry(e.target.value);
                    setShowIndustrySuggestions(true);
                  }}
                  onFocus={() => setShowIndustrySuggestions(true)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />

                {/* Industry Autocomplete Dropdown */}
                {showIndustrySuggestions && filteredIndustries.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    zIndex: 60,
                    maxHeight: '260px',
                    overflowY: 'auto'
                  }}>
                    <div style={{ padding: '8px 14px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      {industry ? `Matching Industrial Sectors (${filteredIndustries.length})` : 'Popular Industry Practices'}
                    </div>
                    {filteredIndustries.map((ind, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setIndustry(ind.name);
                          setShowIndustrySuggestions(false);
                        }}
                        style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                      >
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                          {highlightMatch(ind.name, industry)}
                        </span>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>
                          {ind.tags}
                        </span>
                      </div>
                    ))}
                    <div style={{ padding: '6px 14px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: '11px', color: '#64748b' }}>
                      Showing {filteredIndustries.length} sectors • Click to select
                    </div>
                  </div>
                )}
              </div>

              {/* Company with Autocomplete & Chips */}
              <div className="resdex-autocomplete-wrapper" style={{ marginBottom: '22px', position: 'relative' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: '8px' }}>Company</span>
                
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  alignItems: 'center',
                  minHeight: '46px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff'
                }}>
                  {selectedCompanies.map((comp) => (
                    <span
                      key={comp}
                      style={{
                        backgroundColor: '#fef3c7',
                        border: '1px solid #fde68a',
                        color: '#92400e',
                        padding: '4px 10px',
                        borderRadius: '16px',
                        fontSize: '13px',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>{comp}</span>
                      <button
                        type="button"
                        onClick={() => removeCompanyChip(comp)}
                        style={{ background: 'none', border: 'none', color: '#92400e', cursor: 'pointer', padding: 0 }}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}

                  <input 
                    type="text" 
                    placeholder={selectedCompanies.length === 0 ? "Add company name (e.g. L&T, Tata Motors, JSW, Bharat Forge...)" : "Add another company..."}
                    value={companyInput}
                    onChange={(e) => {
                      setCompanyInput(e.target.value);
                      setShowCompanySuggestions(true);
                    }}
                    onFocus={() => setShowCompanySuggestions(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && companyInput.trim()) {
                        e.preventDefault();
                        addCompanyChip(companyInput.trim());
                      }
                    }}
                    style={{ border: 'none', outline: 'none', fontSize: '14px', flex: 1, minWidth: '180px', padding: '6px 0', backgroundColor: 'transparent' }}
                  />
                </div>

                {/* Company Dropdown */}
                {showCompanySuggestions && filteredCompanies.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    zIndex: 60,
                    maxHeight: '280px',
                    overflowY: 'auto'
                  }}>
                    <div style={{ padding: '8px 14px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{companyInput ? `Matching Companies (${filteredCompanies.length}) for "${companyInput}"` : 'Top Industrial Corporations (A-Z)'}</span>
                      <span style={{ color: '#0056b3', fontWeight: 600 }}>Click to add chip</span>
                    </div>
                    {filteredCompanies.map((cItem, i) => (
                      <div
                        key={i}
                        onClick={() => addCompanyChip(cItem.name)}
                        style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                      >
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                          {highlightMatch(cItem.name, companyInput)}
                        </span>
                        <span style={{ fontSize: '11px', backgroundColor: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                          {cItem.sector}
                        </span>
                      </div>
                    ))}
                    <div style={{ padding: '6px 14px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: '11px', color: '#64748b' }}>
                      Showing {filteredCompanies.length} companies • Scroll to explore
                    </div>
                  </div>
                )}
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#0056b3', cursor: 'pointer' }}>
                    <span>Search in Current company</span>
                    <ChevronDown size={14} />
                  </div>
                  <button 
                    onClick={() => setShowExcludeCompany(!showExcludeCompany)}
                    style={{ background: 'none', border: 'none', color: '#0056b3', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    + Add Exclude Company
                  </button>
                </div>

                {showExcludeCompany && (
                  <div style={{ marginTop: '10px' }}>
                    <input 
                      type="text" 
                      placeholder="Add companies you want to exclude (e.g. competitors)"
                      value={excludeCompany}
                      onChange={(e) => setExcludeCompany(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #fca5a5', fontSize: '13px', backgroundColor: '#fef2f2' }}
                    />
                  </div>
                )}
              </div>

              {/* Designation with Autocomplete & Chips */}
              <div className="resdex-autocomplete-wrapper" style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Designation</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setDesignationBoolean(!designationBoolean)}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Boolean {designationBoolean ? 'on' : 'off'}</span>
                    <div style={{ width: '32px', height: '18px', backgroundColor: designationBoolean ? '#0056b3' : '#cbd5e1', borderRadius: '10px', position: 'relative', transition: 'background-color 0.2s' }}>
                      <div style={{ width: '14px', height: '14px', backgroundColor: '#ffffff', borderRadius: '50%', position: 'absolute', top: '2px', left: designationBoolean ? '16px' : '2px', transition: 'left 0.2s' }} />
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  alignItems: 'center',
                  minHeight: '46px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff'
                }}>
                  {selectedDesignations.map((desig) => (
                    <span
                      key={desig}
                      style={{
                        backgroundColor: '#e0e7ff',
                        border: '1px solid #c7d2fe',
                        color: '#3730a3',
                        padding: '4px 10px',
                        borderRadius: '16px',
                        fontSize: '13px',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>{desig}</span>
                      <button
                        type="button"
                        onClick={() => removeDesignationChip(desig)}
                        style={{ background: 'none', border: 'none', color: '#3730a3', cursor: 'pointer', padding: 0 }}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}

                  <input 
                    type="text" 
                    placeholder={selectedDesignations.length === 0 ? "Add designation (e.g. Vice President, Plant Head, CTO, GM...)" : "Add another designation..."}
                    value={designationInput}
                    onChange={(e) => {
                      setDesignationInput(e.target.value);
                      setShowDesignationSuggestions(true);
                    }}
                    onFocus={() => setShowDesignationSuggestions(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && designationInput.trim()) {
                        e.preventDefault();
                        addDesignationChip(designationInput.trim());
                      }
                    }}
                    style={{ border: 'none', outline: 'none', fontSize: '14px', flex: 1, minWidth: '180px', padding: '6px 0', backgroundColor: 'transparent' }}
                  />
                </div>

                {/* Designation Dropdown */}
                {showDesignationSuggestions && filteredDesignations.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    zIndex: 60,
                    maxHeight: '280px',
                    overflowY: 'auto'
                  }}>
                    <div style={{ padding: '8px 14px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{designationInput ? `Matching Roles (${filteredDesignations.length}) for "${designationInput}"` : 'Executive & Management Roles (A-Z)'}</span>
                      <span style={{ color: '#4338ca', fontWeight: 600 }}>Click to add chip</span>
                    </div>
                    {filteredDesignations.map((dItem, i) => (
                      <div
                        key={i}
                        onClick={() => addDesignationChip(dItem.name)}
                        style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                      >
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                          {highlightMatch(dItem.name, designationInput)}
                        </span>
                        <span style={{ fontSize: '11px', backgroundColor: '#ede9fe', color: '#6d28d9', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                          {dItem.category}
                        </span>
                      </div>
                    ))}
                    <div style={{ padding: '6px 14px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: '11px', color: '#64748b' }}>
                      Showing {filteredDesignations.length} roles • Scroll to explore
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#0056b3', marginTop: '8px', cursor: 'pointer' }}>
                  <span>Search in Current designation</span>
                  <ChevronDown size={14} />
                </div>
              </div>

            </div>

            {/* ----------------------------------------------------------- */}
            {/* Card 5: Notice Period / Availability to Join               */}
            {/* ----------------------------------------------------------- */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px 24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Notice Period / Availability to join</span>
                <Info size={14} style={{ color: '#94a3b8', cursor: 'pointer' }} />
              </div>

              {/* Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {noticeOptions.map((opt) => {
                  const isSelected = noticePeriod === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setNoticePeriod(opt)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: isSelected ? '1px solid #0056b3' : '1px solid #e2e8f0',
                        backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                        color: isSelected ? '#0056b3' : '#334155',
                        fontSize: '13px',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s'
                      }}
                    >
                      <span>{opt}</span>
                      {opt !== 'Any' && <span>+</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accordion 1: Education Details */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div 
                onClick={() => setEducationOpen(!educationOpen)}
                style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', backgroundColor: educationOpen ? '#f8fafc' : '#ffffff' }}
              >
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Education Details</span>
                {educationOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {educationOpen && (
                <div style={{ padding: '20px 24px', borderTop: '1px solid #e2e8f0' }}>
                  {/* UG */}
                  <div style={{ marginBottom: '18px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>UG Qualification</span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {['Any UG qualification', 'Specific UG qualification', 'No UG qualification'].map((item) => (
                        <button
                          key={item}
                          onClick={() => setUgQualification(item)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: ugQualification === item ? '1px solid #0056b3' : '1px solid #cbd5e1',
                            backgroundColor: ugQualification === item ? '#eff6ff' : '#ffffff',
                            color: ugQualification === item ? '#0056b3' : '#475569',
                            fontSize: '13px',
                            cursor: 'pointer'
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* PG */}
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>PG Qualification</span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {['Any PG qualification', 'Specific PG qualification', 'No PG qualification'].map((item) => (
                        <button
                          key={item}
                          onClick={() => setPgQualification(item)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: pgQualification === item ? '1px solid #0056b3' : '1px solid #cbd5e1',
                            backgroundColor: pgQualification === item ? '#eff6ff' : '#ffffff',
                            color: pgQualification === item ? '#0056b3' : '#475569',
                            fontSize: '13px',
                            cursor: 'pointer'
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 2: Diversity Hiring */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div 
                onClick={() => setDiversityOpen(!diversityOpen)}
                style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', backgroundColor: diversityOpen ? '#f8fafc' : '#ffffff' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Diversity Hiring</span>
                  <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>New Add-on</span>
                </div>
                {diversityOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {diversityOpen && (
                <div style={{ padding: '20px 24px', borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Gender</span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {['All candidates', 'Male candidates', 'Female candidates'].map((item) => (
                        <button
                          key={item}
                          onClick={() => setGender(item)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: gender === item ? '1px solid #0056b3' : '1px solid #cbd5e1',
                            backgroundColor: gender === item ? '#eff6ff' : '#ffffff',
                            color: gender === item ? '#0056b3' : '#475569',
                            fontSize: '13px',
                            cursor: 'pointer'
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Candidates with career break</span>
                    <button
                      onClick={() => setCareerBreak(!careerBreak)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: careerBreak ? '1px solid #0056b3' : '1px solid #cbd5e1',
                        backgroundColor: careerBreak ? '#eff6ff' : '#ffffff',
                        color: careerBreak ? '#0056b3' : '#475569',
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      Women returning to work
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Display Details Card */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px 24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: '12px' }}>Display details</span>
              
              {/* Show Status */}
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px' }}>Show:</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['All candidates', 'New registrations', 'Modified candidates'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setDisplayFilter(item)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: displayFilter === item ? '1px solid #0056b3' : '1px solid #cbd5e1',
                        backgroundColor: displayFilter === item ? '#eff6ff' : '#ffffff',
                        color: displayFilter === item ? '#0056b3' : '#475569',
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Show only candidates with */}
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px' }}>Show only candidates with:</span>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setVerifiedMobileOnly(!verifiedMobileOnly)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      border: verifiedMobileOnly ? '1px solid #0056b3' : '1px solid #cbd5e1',
                      backgroundColor: verifiedMobileOnly ? '#eff6ff' : '#ffffff',
                      color: verifiedMobileOnly ? '#0056b3' : '#475569',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    Verified mobile number +
                  </button>

                  <button
                    onClick={() => setVerifiedEmailOnly(!verifiedEmailOnly)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      border: verifiedEmailOnly ? '1px solid #0056b3' : '1px solid #cbd5e1',
                      backgroundColor: verifiedEmailOnly ? '#eff6ff' : '#ffffff',
                      color: verifiedEmailOnly ? '#0056b3' : '#475569',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    Verified email ID +
                  </button>

                  <button
                    onClick={() => setAttachedResumeOnly(!attachedResumeOnly)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      border: attachedResumeOnly ? '1px solid #0056b3' : '1px solid #cbd5e1',
                      backgroundColor: attachedResumeOnly ? '#eff6ff' : '#ffffff',
                      color: attachedResumeOnly ? '#0056b3' : '#475569',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    Attached resume +
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* ============================================================= */}
          {/* RIGHT COLUMN: RECENT SEARCHES & SAVED SEARCHES SIDEBAR        */}
          {/* ============================================================= */}
          <div style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Recent Searches Box */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <History size={16} style={{ color: '#0056b3' }} />
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Recent Searches</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {recentSearches.map((item) => (
                  <div key={item.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                      {item.title}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <button 
                        onClick={() => handleFillSearch(item.query, false)}
                        style={{ background: 'none', border: 'none', color: '#0056b3', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                      >
                        Fill this search
                      </button>
                      <button 
                        onClick={() => handleFillSearch(item.query, true)}
                        style={{ background: 'none', border: 'none', color: '#0056b3', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                      >
                        Search profiles
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Saved Searches Box */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bookmark size={16} style={{ color: '#0056b3' }} />
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Saved Searches</h3>
                </div>
                <button style={{ background: 'none', border: 'none', color: '#0056b3', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                  View all
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {savedSearches.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleFillSearch(item.query, true)}
                    style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'border-color 0.15s' }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0056b3', display: 'block', marginBottom: '4px' }}>{item.name}</span>
                    <span style={{ fontSize: '12px', color: '#64748b', display: 'block', lineHeight: 1.3 }}>{item.summary}</span>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>

        {/* ============================================================= */}
        {/* CANDIDATE SEARCH RESULTS SECTION                              */}
        {/* ============================================================= */}
        <div id="search-results-section" style={{ marginTop: '48px', paddingTop: '32px', borderTop: '2px dashed #cbd5e1' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                Matched Candidates
              </h2>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                {searchExecuted 
                  ? `Showing ${searchResults.length} talent profiles matching your criteria`
                  : 'Execute a search to view matching talent profiles'
                }
              </p>
            </div>

            {searchExecuted && (
              <span style={{ backgroundColor: '#eff6ff', color: '#0056b3', border: '1px solid #bfdbfe', borderRadius: '20px', padding: '6px 14px', fontSize: '13px', fontWeight: 700 }}>
                {searchResults.length} Total Matches
              </span>
            )}
          </div>

          {/* Results Grid */}
          {searching ? (
            <div style={{ padding: '60px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTop: '4px solid #0056b3', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#475569' }}>Searching candidate repository across executive industrial practices...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {searchResults.map((cand) => (
                <div 
                  key={cand._id || cand.id} 
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                    
                    {/* Candidate Identity */}
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#0056b3', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 800 }}>
                        {cand.name ? cand.name.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                            {cand.name}
                          </h3>
                          {cand.verified_mobile && (
                            <span title="Verified Mobile Number" style={{ color: '#16a34a', display: 'flex', alignItems: 'center' }}>
                              <CheckCircle2 size={16} />
                            </span>
                          )}
                          {cand.verified_email && (
                            <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#f0fdf4', color: '#16a34a', padding: '1px 6px', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                              Verified
                            </span>
                          )}
                        </div>

                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#334155', margin: '4px 0 0 0' }}>
                          {cand.current_role}
                        </p>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0 0' }}>
                          {cand.company ? `${cand.company} • ` : ''}{cand.sector}
                        </p>
                      </div>
                    </div>

                    {/* Stats Pill / Highlights */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      {cand.annual_ctc && (
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, display: 'block' }}>CTC</span>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#166534' }}>{cand.annual_ctc}</span>
                        </div>
                      )}
                      <div style={{ textAlign: 'right', paddingLeft: cand.annual_ctc ? '16px' : 0, borderLeft: cand.annual_ctc ? '1px solid #e2e8f0' : 'none' }}>
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, display: 'block' }}>Experience</span>
                        <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{cand.experience || '10+ Years'}</span>
                      </div>
                      <div style={{ textAlign: 'right', paddingLeft: '16px', borderLeft: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, display: 'block' }}>Notice Period</span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#0056b3' }}>{cand.notice_period || 'Immediate'}</span>
                      </div>
                    </div>

                  </div>

                  {/* Skills Chips */}
                  {cand.key_skills && cand.key_skills.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '16px' }}>
                      {cand.key_skills.map((skill, idx) => (
                        <span key={idx} style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '12px', padding: '3px 10px', borderRadius: '12px', fontWeight: 500 }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Contact & Download Actions Footer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '12px' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '13px', color: '#475569' }}>
                      {cand.location && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} style={{ color: '#94a3b8' }} />
                          {cand.location}
                        </span>
                      )}
                      {cand.email && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Mail size={14} style={{ color: '#94a3b8' }} />
                          {cand.email}
                        </span>
                      )}
                      {cand.phone && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={14} style={{ color: '#94a3b8' }} />
                          {cand.phone}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {cand.linkedin_url && (
                        <a 
                          href={cand.linkedin_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            color: '#0056b3',
                            fontSize: '12px',
                            fontWeight: 600,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span>LinkedIn</span>
                          <ExternalLink size={12} />
                        </a>
                      )}

                      {cand.cv_filename ? (
                        <a 
                          href={apiUrl(`/uploads/${cand.cv_filename}`)} 
                          download 
                          style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            backgroundColor: '#0056b3',
                            color: '#ffffff',
                            fontSize: '12px',
                            fontWeight: 700,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Download size={13} />
                          <span>Download CV</span>
                        </a>
                      ) : (
                        <button 
                          disabled 
                          style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            backgroundColor: '#f1f5f9',
                            color: '#94a3b8',
                            fontSize: '12px',
                            fontWeight: 600,
                            border: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'not-allowed'
                          }}
                        >
                          <span>Profile Archived</span>
                        </button>
                      )}
                    </div>

                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '60px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#334155', margin: '0 0 8px 0' }}>No candidates found matching your exact filters</p>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Try broadening your keywords, setting Notice Period to "Any", or clearing company exclusions.</p>
            </div>
          )}

        </div>

      </main>

      {/* ============================================================= */}
      {/* 4. STICKY FLOATING BOTTOM ACTION BAR                          */}
      {/* ============================================================= */}
      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '14px 32px',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.06)',
        zIndex: 99,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        
        {/* Left window */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
          <span>Active in -</span>
          <select 
            value={activeWindow} 
            onChange={(e) => setActiveWindow(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#ffffff' }}
          >
            <option value="1 month">1 month</option>
            <option value="3 months">3 months</option>
            <option value="6 months">6 months</option>
            <option value="1 year">1 year</option>
            <option value="All">All Time</option>
          </select>
        </div>

        {/* Center/Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={handleClearFilters}
            style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
          >
            Clear Filters
          </button>

          <button
            onClick={() => handleSearch(true)}
            disabled={searching}
            style={{
              backgroundColor: '#0056b3',
              color: '#ffffff',
              padding: '12px 36px',
              borderRadius: '24px',
              fontSize: '15px',
              fontWeight: 800,
              border: 'none',
              cursor: searching ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 86, 179, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.15s'
            }}
          >
            <Search size={16} />
            <span>{searching ? 'Searching...' : 'Search candidates'}</span>
          </button>
        </div>

      </footer>

      {/* Floating MCP Help Button */}
      <button 
        onClick={() => alert('MCP Resdex Support: For executive mandate assistance or candidate mapping, contact support@mcpconsultants.in')}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '24px',
          backgroundColor: '#0056b3',
          color: '#ffffff',
          borderRadius: '24px',
          padding: '10px 18px',
          fontSize: '13px',
          fontWeight: 700,
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 86, 179, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          zIndex: 98
        }}
      >
        <Headphones size={16} />
        <span>MCP Help</span>
      </button>

    </div>
  );
}

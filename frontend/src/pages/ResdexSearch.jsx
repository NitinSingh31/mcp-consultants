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
  Plus,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { apiUrl } from '../api';
import {
  filterSkills,
  filterDesignations,
  filterCompanies,
  filterIndustries,
  filterLocations,
  filterDepartments,
  SKILLS_DATABASE,
  SALARY_SUGGESTIONS,
  DEPARTMENTS_DATABASE,
  LOCATIONS_DATABASE,
  SPECIAL_LOCATION_SCOPES,
  filterHierarchicalLocations
} from '../data/resdexSuggestions';
import HierarchicalLocationDropdown from '../components/HierarchicalLocationDropdown';

// 17 Additional RPwD Categories under the Rights of Persons with Disabilities Act (Naukri Resdex benchmark)
const RPWD_DISABILITIES_EXTRA = [
  'Dwarfism',
  'Intellectual Disability',
  'Mental Illness',
  'Autism Spectrum Disorder',
  'Cerebral Palsy',
  'Muscular Dystrophy',
  'Chronic Neurological conditions',
  'Specific Learning Disabilities',
  'Multiple Sclerosis',
  'Acid Attack victim',
  "Parkinson's disease",
  'Haemophilia',
  'Thalassemia',
  'Sickle Cell disease',
  'Multiple Disabilities',
  'Leprosy cured persons',
  'Deaf-Blindness'
];

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
  const [showJobsDropdown, setShowJobsDropdown] = useState(false);

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

  // 4. Current Location of Candidate State (Hierarchical: India → Region → State → City & Special Scopes)
  const [candidateLocation, setCandidateLocation] = useState('');
  const [candidateLocationInput, setCandidateLocationInput] = useState('');
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [relocateToLocations, setRelocateToLocations] = useState(true);
  const [changePreferredLocationOpen, setChangePreferredLocationOpen] = useState(false);
  const [preferredLocation, setPreferredLocation] = useState('');
  const [showExcludeAnywhere, setShowExcludeAnywhere] = useState(false);
  const [excludeAnywhere, setExcludeAnywhere] = useState('');

  const handleSelectHierarchicalLocation = (locName, item) => {
    if (!selectedLocations.includes(locName)) {
      const updated = [...selectedLocations, locName];
      setSelectedLocations(updated);
      setCandidateLocation(updated.join(', '));
    }
    setCandidateLocationInput('');
  };

  const handleRemoveLocation = (locToRemove) => {
    const updated = selectedLocations.filter(loc => loc !== locToRemove);
    setSelectedLocations(updated);
    setCandidateLocation(updated.join(', '));
  };

  const handleClearAllLocations = () => {
    setSelectedLocations([]);
    setCandidateLocation('');
    setCandidateLocationInput('');
  };

  // 5. Annual Salary State (INR ... to ... Lacs with 72 suggestions)
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [showMinSalaryDropdown, setShowMinSalaryDropdown] = useState(false);
  const [showMaxSalaryDropdown, setShowMaxSalaryDropdown] = useState(false);
  const [includeUnspecifiedSalary, setIncludeUnspecifiedSalary] = useState(true);

  // 6. Department & Role Sub-panel State (37 suggestions)
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departmentSubPanelOpen, setDepartmentSubPanelOpen] = useState(false);
  const [departmentQuery, setDepartmentQuery] = useState('');

  // 7. Industry / Sector Autocomplete State
  const [industry, setIndustry] = useState('');
  const [showIndustrySuggestions, setShowIndustrySuggestions] = useState(false);

  // 8. Company Autocomplete & Chips State
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [companyInput, setCompanyInput] = useState('');
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
  const [currentCompanyOnly, setCurrentCompanyOnly] = useState(true);
  const [showExcludeCompany, setShowExcludeCompany] = useState(false);
  const [excludeCompany, setExcludeCompany] = useState('');

  // 9. Designation Autocomplete & Chips State
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
  const [ugQualification, setUgQualification] = useState('Any UG qualification');
  const [pgQualification, setPgQualification] = useState('Any PG qualification');
  const [ppgOpen, setPpgOpen] = useState(false);
  const [ppgQualification, setPpgQualification] = useState('Any PPG qualification');

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
  const [workPermit, setWorkPermit] = useState('Choose category');
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
        setShowLocationSuggestions(false);
        setShowMinSalaryDropdown(false);
        setShowMaxSalaryDropdown(false);
      }
      if (!e.target.closest('.jobs-nav-dropdown-wrap')) {
        setShowJobsDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Initial Data & Recent Searches
  useEffect(() => {
    fetchRecentSearches();

    // Check if query params were passed from PostJob or ManageJobs (e.g. ?keywords=...&location=...)
    const params = new URLSearchParams(window.location.search);
    const kwParam = params.get('keywords');
    const locParam = params.get('location');
    const minExpParam = params.get('minExp');
    const maxExpParam = params.get('maxExp');

    if (kwParam || locParam || minExpParam || maxExpParam) {
      if (kwParam) {
        const kws = kwParam.split(',').map(s => s.trim()).filter(Boolean);
        setSelectedKeywords(kws);
      }
      if (locParam) {
        const locs = locParam.split(',').map(s => s.trim()).filter(Boolean);
        setSelectedLocations(locs);
        setCandidateLocation(locs.join(', '));
      }
      if (minExpParam) setMinExp(minExpParam);
      if (maxExpParam) setMaxExp(maxExpParam);

      // Trigger search with query params
      handleSearch(true, {
        keywords: kwParam ? kwParam.split(',').join(' ') : '',
        location: locParam || '',
        minExp: minExpParam || '',
        maxExp: maxExpParam || ''
      });
    } else {
      // Pre-execute a search to show available talent right away
      handleSearch(false);
    }
  }, []);

  const fetchRecentSearches = async () => {
    try {
      const res = await fetch(apiUrl('/api/candidates/recent-searches'));
      const data = await res.json();
      if (data.success) {
        const clearedRecent = localStorage.getItem('mcp_resdex_recent_cleared') === 'true';
        const clearedSaved = localStorage.getItem('mcp_resdex_saved_cleared') === 'true';

        setRecentSearches(clearedRecent ? [] : (data.recentSearches || []));
        setSavedSearches(clearedSaved ? [] : (data.savedSearches || []));
      }
    } catch (err) {
      console.error('Failed to load recent searches:', err);
    }
  };

  // Clear Recent Searches Function
  const handleClearRecentSearches = async () => {
    if (window.confirm('Are you sure you want to clear all recent searches?')) {
      setRecentSearches([]);
      localStorage.setItem('mcp_resdex_recent_cleared', 'true');
      try {
        await fetch(apiUrl('/api/candidates/clear-recent-searches'), { method: 'POST' });
      } catch (e) {
        console.error('Failed to notify clear-recent-searches:', e);
      }
    }
  };

  // Restore Default Recent Searches Function
  const handleRestoreRecentSearches = async () => {
    localStorage.removeItem('mcp_resdex_recent_cleared');
    try {
      const res = await fetch(apiUrl('/api/candidates/recent-searches'));
      const data = await res.json();
      if (data.success) {
        setRecentSearches(data.recentSearches || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Remove Single Recent Search
  const handleRemoveRecentSearch = (id, e) => {
    e.stopPropagation();
    setRecentSearches(prev => prev.filter(item => item.id !== id));
  };

  // Clear Saved Searches Function
  const handleClearSavedSearches = async () => {
    if (window.confirm('Are you sure you want to clear all saved searches?')) {
      setSavedSearches([]);
      localStorage.setItem('mcp_resdex_saved_cleared', 'true');
      try {
        await fetch(apiUrl('/api/candidates/clear-saved-searches'), { method: 'POST' });
      } catch (e) {
        console.error('Failed to notify clear-saved-searches:', e);
      }
    }
  };

  // Restore Default Saved Searches Function
  const handleRestoreSavedSearches = async () => {
    localStorage.removeItem('mcp_resdex_saved_cleared');
    try {
      const res = await fetch(apiUrl('/api/candidates/recent-searches'));
      const data = await res.json();
      if (data.success) {
        setSavedSearches(data.savedSearches || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Remove Single Saved Search
  const handleRemoveSavedSearch = (id, e) => {
    e.stopPropagation();
    setSavedSearches(prev => prev.filter(item => item.id !== id));
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
  const handleSearch = async (scrollToResults = true, overrides = null) => {
    setSearching(true);
    try {
      const activeKeywords = overrides?.keywords !== undefined
        ? overrides.keywords
        : [...selectedKeywords, keywordInput.trim()].filter(Boolean).join(' ');
      const activeCompanies = [...selectedCompanies, companyInput.trim()].filter(Boolean).join(' ');
      const activeDesignations = [...selectedDesignations, designationInput.trim()].filter(Boolean).join(' ');
      const activeLocation = overrides?.location !== undefined
        ? overrides.location
        : (candidateLocation || candidateLocationInput);
      const activeMinExp = overrides?.minExp !== undefined ? overrides.minExp : minExp;
      const activeMaxExp = overrides?.maxExp !== undefined ? overrides.maxExp : maxExp;

      const payload = {
        keywords: activeKeywords,
        booleanMode,
        client: clientHiringFor,
        minExp: activeMinExp,
        maxExp: activeMaxExp,
        minSalary,
        maxSalary,
        includeUnspecifiedSalary,
        location: activeLocation,
        relocateToLocations,
        excludeAnywhere: !!excludeAnywhere,
        department: selectedDepartment,
        industry,
        company: activeCompanies,
        excludeCompany,
        designation: activeDesignations,
        noticePeriod,
        ugQualification,
        pgQualification,
        ppgQualification,
        gender,
        careerBreak,
        differentlyAbledType,
        defencePersonnel,
        candidateCategory,
        minAge,
        maxAge,
        jobType,
        employmentType,
        workPermit,
        displayFilter,
        verifiedMobileOnly,
        verifiedEmailOnly,
        attachedResumeOnly,
        activeWindow
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

    if (query.location) {
      setCandidateLocation(query.location);
      setSelectedLocations(query.location.split(',').map(s => s.trim()).filter(Boolean));
      setCandidateLocationInput('');
    } else {
      setCandidateLocation('');
      setSelectedLocations([]);
      setCandidateLocationInput('');
    }

    if (query.minSalary) setMinSalary(query.minSalary);
    else setMinSalary('');

    if (query.maxSalary) setMaxSalary(query.maxSalary);
    else setMaxSalary('');

    if (query.department) setSelectedDepartment(query.department);
    else setSelectedDepartment('');

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
    setCandidateLocation('');
    setSelectedLocations([]);
    setCandidateLocationInput('');
    setMinSalary('');
    setMaxSalary('');
    setSelectedDepartment('');
    setDepartmentQuery('');
    setPreferredLocation('');
    setExcludeAnywhere('');
    setNoticePeriod('Any');
    setMinExp('');
    setMaxExp('');
    setExcludeKeywords('');
    setExcludeCompany('');
    setItSkills('');
    setUgQualification('Any UG qualification');
    setPgQualification('Any PG qualification');
    setPpgQualification('Any PPG qualification');
    setGender('All candidates');
    setCareerBreak(false);
    setDifferentlyAbledType('Any');
    setDefencePersonnel('Any');
    setCandidateCategory('');
    setMinAge('');
    setMaxAge('');
    setJobType('Any');
    setEmploymentType('Any');
    setWorkPermit('Choose category');
    setDisplayFilter('All candidates');
    setVerifiedMobileOnly(false);
    setVerifiedEmailOnly(false);
    setAttachedResumeOnly(false);
    setActiveWindow('6 months');
    handleSearch(false);
  };

  // Filtered Autocomplete Lists
  const filteredSkills = filterSkills(keywordInput);
  const filteredCompanies = filterCompanies(companyInput);
  const filteredDesignations = filterDesignations(designationInput);
  const filteredIndustries = filterIndustries(industry);
  const filteredClients = filterCompanies(clientHiringFor);
  const filteredLocs = filterLocations(candidateLocation);
  const filteredDepts = filterDepartments(departmentQuery);

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
              
              {/* Jobs & Responses with Dropdown */}
              <div className="jobs-nav-dropdown-wrap" style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowJobsDropdown(prev => !prev)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '18px 12px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#0f172a',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    borderBottom: '3px solid transparent'
                  }}
                >
                  <span>Jobs & Responses</span>
                  <ChevronDown size={14} style={{ color: '#64748b' }} />
                </button>

                {showJobsDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      width: '230px',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      padding: '8px',
                      zIndex: 200,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <Link
                      to="/admin/post-job"
                      onClick={() => setShowJobsDropdown(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        color: '#0f172a',
                        fontSize: '13px',
                        fontWeight: 600,
                        backgroundColor: '#f8fafc'
                      }}
                    >
                      <Plus size={15} style={{ color: '#0056b3' }} />
                      <span>Post a Hot Vacancy</span>
                    </Link>

                    <Link
                      to="/admin/jobs"
                      onClick={() => setShowJobsDropdown(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        color: '#0f172a',
                        fontSize: '13px',
                        fontWeight: 600
                      }}
                    >
                      <Briefcase size={15} style={{ color: '#475569' }} />
                      <span>Manage Jobs & Responses</span>
                    </Link>

                    <Link
                      to="/jobs"
                      target="_blank"
                      onClick={() => setShowJobsDropdown(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        color: '#64748b',
                        fontSize: '12px',
                        fontWeight: 500,
                        borderTop: '1px solid #f1f5f9'
                      }}
                    >
                      <ExternalLink size={14} style={{ color: '#94a3b8' }} />
                      <span>Public Career Board ↗</span>
                    </Link>
                  </div>
                )}
              </div>

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

            {/* Post a Job CTA Button */}
            <Link
              to="/admin/post-job"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                backgroundColor: '#0056b3',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 2px 4px rgba(0, 86, 179, 0.2)'
              }}
            >
              <Plus size={15} />
              <span>Post a Job</span>
            </Link>

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
                  placeholder="Add client/company you’re hiring for"
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
                    placeholder={selectedKeywords.length === 0 ? "Enter keywords like skills, designation and company" : "Add more skills..."}
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
                    maxHeight: '380px',
                    overflowY: 'auto'
                  }}>
                    {/* Sticky Header bar */}
                    <div style={{ padding: '8px 16px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
                      <span>
                        {keywordInput ? `Matching Skills (${filteredSkills.length}) for "${keywordInput}"` : `All Available Skills (${filteredSkills.length} Total from A–Z)`}
                      </span>
                      <span style={{ color: '#0056b3', fontWeight: 700 }}>Click to add tag</span>
                    </div>

                    {/* A-Z Alphabet Quick Jump Scrubber */}
                    <div style={{
                      padding: '6px 12px',
                      backgroundColor: '#f1f5f9',
                      borderBottom: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      overflowX: 'auto',
                      whiteSpace: 'nowrap',
                      position: 'sticky',
                      top: '32px',
                      zIndex: 10
                    }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', marginRight: '4px', textTransform: 'uppercase' }}>Filter A–Z:</span>
                      {['ALL', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map(letter => (
                        <button
                          key={letter}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (letter === 'ALL') {
                              setKeywordInput('');
                            } else {
                              setKeywordInput(letter.toLowerCase());
                            }
                          }}
                          style={{
                            border: 'none',
                            backgroundColor: (letter === 'ALL' && !keywordInput) || (keywordInput.toUpperCase() === letter) ? '#0056b3' : '#ffffff',
                            color: (letter === 'ALL' && !keywordInput) || (keywordInput.toUpperCase() === letter) ? '#ffffff' : '#334155',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            transition: 'all 0.1s'
                          }}
                        >
                          {letter}
                        </button>
                      ))}
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
                    <div style={{ padding: '8px 16px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: '11px', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', bottom: 0, zIndex: 10 }}>
                      <span>Showing all {filteredSkills.length} available skills • Scroll to browse A–Z</span>
                      <span style={{ fontWeight: 600 }}>Type or click letters A–Z to jump</span>
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
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: '10px' }}>Experience</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <input 
                    type="number" 
                    placeholder="Min experience" 
                    value={minExp}
                    onChange={(e) => setMinExp(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>
                <span style={{ color: '#94a3b8' }}>to</span>
                <div style={{ flex: 1 }}>
                  <input 
                    type="number" 
                    placeholder="Max experience" 
                    value={maxExp}
                    onChange={(e) => setMaxExp(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>Years</span>
              </div>
            </div>

            {/* ----------------------------------------------------------- */}
            {/* Card 4: Current location of candidate                       */}
            {/* ----------------------------------------------------------- */}
            <div className="resdex-autocomplete-wrapper" style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px 24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Current location of candidate</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>(Type or select: India → Region → State → City, or Special Scopes)</span>
                </div>
                {(selectedLocations.length > 0 || candidateLocationInput || candidateLocation) && (
                  <button
                    type="button"
                    onClick={handleClearAllLocations}
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: '2px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    title="Clear all selected locations"
                  >
                    <Trash2 size={12} />
                    <span>Clear locations</span>
                  </button>
                )}
              </div>

              {/* Selected Location Tags with Level Badges */}
              {selectedLocations.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                  {selectedLocations.map((loc, idx) => {
                    const isScope = loc.startsWith('Anywhere') || loc.startsWith('Any International');
                    const isState = loc.includes('(All cities)');
                    return (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          backgroundColor: isScope ? '#fef3c7' : isState ? '#e0f2fe' : '#eff6ff',
                          border: isScope ? '1px solid #fde68a' : isState ? '1px solid #bae6fd' : '1px solid #bfdbfe',
                          color: isScope ? '#92400e' : isState ? '#0369a1' : '#0056b3',
                          fontSize: '12px',
                          fontWeight: 600
                        }}
                      >
                        <span>{isScope ? '🌐' : isState ? '🏛️' : '📍'}</span>
                        <span>{loc}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveLocation(loc)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: isScope ? '#b45309' : isState ? '#0284c7' : '#2563eb',
                            cursor: 'pointer',
                            padding: '0 2px',
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: '50%'
                          }}
                          title={`Remove ${loc}`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Add location (e.g. Anywhere in North India, Baddi, Mohali, Pune, Dubai)"
                  value={candidateLocationInput}
                  onChange={(e) => {
                    setCandidateLocationInput(e.target.value);
                    setShowLocationSuggestions(true);
                  }}
                  onFocus={() => setShowLocationSuggestions(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (candidateLocationInput.trim()) {
                        handleSelectHierarchicalLocation(candidateLocationInput.trim());
                      }
                    } else if (e.key === 'Escape') {
                      setShowLocationSuggestions(false);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: showLocationSuggestions ? '1.5px solid #0056b3' : '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    boxShadow: showLocationSuggestions ? '0 0 0 3px rgba(0, 86, 179, 0.1)' : 'none',
                    transition: 'all 0.15s'
                  }}
                />

                {/* Hierarchical Searchable Autocomplete Suggestion Dropdown */}
                {showLocationSuggestions && (
                  <HierarchicalLocationDropdown
                    searchQuery={candidateLocationInput}
                    selectedLocations={selectedLocations}
                    onSelectLocation={(locName, item) => {
                      handleSelectHierarchicalLocation(locName, item);
                    }}
                    onClose={() => setShowLocationSuggestions(false)}
                  />
                )}
              </div>

              {/* Relocation checkbox */}
              <div style={{ marginTop: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={relocateToLocations} 
                    onChange={(e) => setRelocateToLocations(e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span>Include candidates who prefer to relocate to above locations</span>
                </label>
              </div>

              {/* Action Links */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                <button 
                  type="button"
                  onClick={() => setChangePreferredLocationOpen(!changePreferredLocationOpen)}
                  style={{ background: 'none', border: 'none', color: '#0056b3', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  {changePreferredLocationOpen ? '- Hide preferred location' : 'Change preferred location'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowExcludeAnywhere(!showExcludeAnywhere)}
                  style={{ background: 'none', border: 'none', color: '#0056b3', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  {showExcludeAnywhere ? '- Hide Exclude Anywhere' : 'Exclude candidates who have mentioned Anywhere in...'}
                </button>
              </div>

              {changePreferredLocationOpen && (
                <div style={{ marginTop: '12px' }}>
                  <input 
                    type="text" 
                    placeholder="Enter preferred candidate locations (e.g. North India, Anywhere in Himachal/Punjab)"
                    value={preferredLocation}
                    onChange={(e) => setPreferredLocation(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#f8fafc' }}
                  />
                </div>
              )}

              {showExcludeAnywhere && (
                <div style={{ marginTop: '12px' }}>
                  <input 
                    type="text" 
                    placeholder="Exclude candidates who have mentioned Anywhere in... (e.g. South India, Overseas)"
                    value={excludeAnywhere}
                    onChange={(e) => setExcludeAnywhere(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #fca5a5', fontSize: '13px', backgroundColor: '#fef2f2' }}
                  />
                </div>
              )}
            </div>

            {/* ----------------------------------------------------------- */}
            {/* Card 5: Annual Salary                                       */}
            {/* ----------------------------------------------------------- */}
            <div className="resdex-autocomplete-wrapper" style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px 24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Annual Salary</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px' }}>INR</span>
                </div>
                {(minSalary || maxSalary) && (
                  <button
                    type="button"
                    onClick={() => { setMinSalary(''); setMaxSalary(''); }}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Clear
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
                
                {/* Min Salary Input & Dropdown */}
                <div style={{ flex: 1, position: 'relative' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>72 suggestions found, to navigate use up and down arrows</div>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      placeholder="Min salary" 
                      value={minSalary}
                      onChange={(e) => {
                        setMinSalary(e.target.value);
                        setShowMinSalaryDropdown(true);
                      }}
                      onFocus={() => setShowMinSalaryDropdown(true)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                    />
                    {showMinSalaryDropdown && (
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
                        maxHeight: '220px',
                        overflowY: 'auto'
                      }}>
                        <div style={{ padding: '6px 12px', backgroundColor: '#f8fafc', fontSize: '11px', fontWeight: 700, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                          72 suggestions found (Lacs)
                        </div>
                        {SALARY_SUGGESTIONS.map((sal) => (
                          <div
                            key={sal}
                            onClick={() => {
                              setMinSalary(sal);
                              setShowMinSalaryDropdown(false);
                            }}
                            style={{ padding: '8px 12px', fontSize: '13px', cursor: 'pointer', borderBottom: '1px solid #f8fafc' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                          >
                            {sal} Lacs
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <span style={{ color: '#94a3b8', marginTop: '20px', fontWeight: 600 }}>to</span>

                {/* Max Salary Input & Dropdown */}
                <div style={{ flex: 1, position: 'relative' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>72 suggestions found, to navigate use up and down arrows</div>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      placeholder="Max salary" 
                      value={maxSalary}
                      onChange={(e) => {
                        setMaxSalary(e.target.value);
                        setShowMaxSalaryDropdown(true);
                      }}
                      onFocus={() => setShowMaxSalaryDropdown(true)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                    />
                    {showMaxSalaryDropdown && (
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
                        maxHeight: '220px',
                        overflowY: 'auto'
                      }}>
                        <div style={{ padding: '6px 12px', backgroundColor: '#f8fafc', fontSize: '11px', fontWeight: 700, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                          72 suggestions found (Lacs)
                        </div>
                        {SALARY_SUGGESTIONS.map((sal) => (
                          <div
                            key={sal}
                            onClick={() => {
                              setMaxSalary(sal);
                              setShowMaxSalaryDropdown(false);
                            }}
                            style={{ padding: '8px 12px', fontSize: '13px', cursor: 'pointer', borderBottom: '1px solid #f8fafc' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                          >
                            {sal} Lacs
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <span style={{ marginTop: '20px', fontSize: '13px', fontWeight: 700, color: '#475569' }}>Lacs</span>

              </div>

              <div style={{ marginTop: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={includeUnspecifiedSalary} 
                    onChange={(e) => setIncludeUnspecifiedSalary(e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span>Include candidates who did not mention their current salary</span>
                </label>
              </div>
            </div>

            {/* ----------------------------------------------------------- */}
            {/* Card 6: EMPLOYMENT DETAILS (Department, Industry, Company, Desig) */}
            {/* ----------------------------------------------------------- */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '22px 24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                Employment Details
              </h2>

              {/* Department and Role Sub-panel Section */}
              <div style={{ marginBottom: '22px', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px', backgroundColor: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Department and Role</span>
                    <button
                      type="button"
                      onClick={() => setDepartmentSubPanelOpen(!departmentSubPanelOpen)}
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '12px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: departmentSubPanelOpen ? '#0056b3' : '#ffffff',
                        color: departmentSubPanelOpen ? '#ffffff' : '#475569',
                        cursor: 'pointer'
                      }}
                    >
                      {departmentSubPanelOpen ? 'Sub-panel open' : 'Sub-panel closed'}
                    </button>
                  </div>

                  {selectedDepartment && (
                    <button
                      type="button"
                      onClick={() => { setSelectedDepartment(''); setDepartmentQuery(''); }}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Input with exact placeholder Add Department/Role */}
                <div style={{ position: 'relative', marginBottom: '8px' }}>
                  <input
                    type="text"
                    placeholder="Add Department/Role"
                    value={selectedDepartment || departmentQuery}
                    onChange={(e) => {
                      setSelectedDepartment('');
                      setDepartmentQuery(e.target.value);
                      setDepartmentSubPanelOpen(true);
                    }}
                    onFocus={() => setDepartmentSubPanelOpen(true)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: departmentSubPanelOpen ? '1.5px solid #0056b3' : '1px solid #cbd5e1',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#ffffff'
                    }}
                  />
                </div>

                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                  37 suggestions found, to navigate use up and down arrows
                </div>

                {/* Selected Department Display */}
                {selectedDepartment && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#0056b3', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                    <span>{selectedDepartment}</span>
                    <X size={13} style={{ cursor: 'pointer' }} onClick={() => { setSelectedDepartment(''); setDepartmentQuery(''); }} />
                  </div>
                )}

                {/* Expandable Sub-panel with the 37 Suggestions */}
                {departmentSubPanelOpen && (
                  <div style={{ marginTop: '6px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '12px' }}>
                    <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {filteredDepts.map((dept, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setSelectedDepartment(dept.name);
                            setDepartmentSubPanelOpen(false);
                          }}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: selectedDepartment === dept.name ? '#eff6ff' : '#ffffff',
                            border: selectedDepartment === dept.name ? '1px solid #bfdbfe' : '1px solid transparent',
                            transition: 'background-color 0.12s'
                          }}
                          onMouseEnter={(e) => { if (selectedDepartment !== dept.name) e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                          onMouseLeave={(e) => { if (selectedDepartment !== dept.name) e.currentTarget.style.backgroundColor = '#ffffff'; }}
                        >
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                            {highlightMatch(dept.name, departmentQuery)}
                          </span>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>
                            {dept.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Industry / Sector with Autocomplete */}
              <div className="resdex-autocomplete-wrapper" style={{ marginBottom: '22px', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Industry / Sector</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>(Scroll or type to choose practice)</span>
                  </div>
                  {industry && (
                    <button
                      type="button"
                      onClick={() => setIndustry('')}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '11px', cursor: 'pointer', padding: '2px', textDecoration: 'underline' }}
                    >
                      Clear
                    </button>
                  )}
                </div>

                <input 
                  type="text" 
                  placeholder="Add industry"
                  value={industry}
                  onChange={(e) => {
                    setIndustry(e.target.value);
                    setShowIndustrySuggestions(true);
                  }}
                  onFocus={() => setShowIndustrySuggestions(true)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: showIndustrySuggestions ? '1.5px solid #0056b3' : '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    boxShadow: showIndustrySuggestions ? '0 0 0 3px rgba(0, 86, 179, 0.1)' : 'none',
                    transition: 'all 0.15s'
                  }}
                />

                {/* Industry Autocomplete Dropdown */}
                {showIndustrySuggestions && filteredIndustries.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    boxShadow: '0 12px 28px -4px rgba(0,0,0,0.12), 0 8px 10px -6px rgba(0,0,0,0.08)',
                    zIndex: 60,
                    maxHeight: '320px',
                    overflowY: 'auto'
                  }}>
                    <div style={{ padding: '8px 16px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
                      <span>{industry ? `Matching Industrial Sectors (${filteredIndustries.length})` : `All Industrial Practices (${filteredIndustries.length} Total)`}</span>
                      <span style={{ color: '#0056b3', fontWeight: 700 }}>Click to select</span>
                    </div>

                    {filteredIndustries.map((ind, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setIndustry(ind.name);
                          setShowIndustrySuggestions(false);
                        }}
                        style={{ padding: '11px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'background-color 0.12s' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                      >
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                          {highlightMatch(ind.name, industry)}
                        </span>
                        <span style={{ fontSize: '11px', color: '#64748b', maxWidth: '300px', textAlign: 'right' }}>
                          {ind.tags}
                        </span>
                      </div>
                    ))}

                    <div style={{ padding: '8px 16px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: '11px', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', bottom: 0, zIndex: 10 }}>
                      <span>Showing all {filteredIndustries.length} industrial practices • Scroll to browse</span>
                      <span style={{ fontWeight: 600 }}>1-Click Select</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Company with Autocomplete & Chips */}
              <div className="resdex-autocomplete-wrapper" style={{ marginBottom: '22px', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Company</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>(Type any letter A-Z or browse top employers)</span>
                  </div>
                  {selectedCompanies.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedCompanies([])}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '11px', cursor: 'pointer', padding: '2px', textDecoration: 'underline' }}
                    >
                      Clear
                    </button>
                  )}
                </div>
                
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  alignItems: 'center',
                  minHeight: '48px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: showCompanySuggestions ? '1.5px solid #d97706' : '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  boxShadow: showCompanySuggestions ? '0 0 0 3px rgba(217, 119, 6, 0.1)' : 'none',
                  transition: 'all 0.15s'
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
                        style={{ background: 'none', border: 'none', color: '#92400e', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}

                  <input 
                    type="text" 
                    placeholder={selectedCompanies.length === 0 ? "Add company name" : "Add more companies..."}
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
                      } else if (e.key === 'Backspace' && !companyInput && selectedCompanies.length > 0) {
                        removeCompanyChip(selectedCompanies[selectedCompanies.length - 1]);
                      }
                    }}
                    style={{ border: 'none', outline: 'none', fontSize: '14px', flex: 1, minWidth: '220px', padding: '6px 0', backgroundColor: 'transparent', color: '#0f172a' }}
                  />
                </div>

                {/* Company Dropdown with Interactive A-Z Scrubber */}
                {showCompanySuggestions && filteredCompanies.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    boxShadow: '0 12px 28px -4px rgba(0,0,0,0.12), 0 8px 10px -6px rgba(0,0,0,0.08)',
                    zIndex: 60,
                    maxHeight: '380px',
                    overflowY: 'auto'
                  }}>
                    {/* Sticky Header */}
                    <div style={{ padding: '8px 16px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
                      <span>{companyInput ? `Matching Companies (${filteredCompanies.length}) for "${companyInput}"` : `All Available Companies (${filteredCompanies.length} Total from A–Z)`}</span>
                      <span style={{ color: '#d97706', fontWeight: 700 }}>Click to add chip</span>
                    </div>

                    {/* A-Z Alphabet Quick Jump Scrubber for Companies */}
                    <div style={{
                      padding: '6px 12px',
                      backgroundColor: '#fefce8',
                      borderBottom: '1px solid #fef08a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      overflowX: 'auto',
                      whiteSpace: 'nowrap',
                      position: 'sticky',
                      top: '32px',
                      zIndex: 10
                    }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#854d0e', marginRight: '4px', textTransform: 'uppercase' }}>Filter A–Z:</span>
                      {['ALL', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map(letter => (
                        <button
                          key={letter}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (letter === 'ALL') {
                              setCompanyInput('');
                            } else {
                              setCompanyInput(letter.toLowerCase());
                            }
                          }}
                          style={{
                            border: 'none',
                            backgroundColor: (letter === 'ALL' && !companyInput) || (companyInput.toUpperCase() === letter) ? '#d97706' : '#ffffff',
                            color: (letter === 'ALL' && !companyInput) || (companyInput.toUpperCase() === letter) ? '#ffffff' : '#78350f',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            transition: 'all 0.1s'
                          }}
                        >
                          {letter}
                        </button>
                      ))}
                    </div>

                    {/* Company Suggestions */}
                    {filteredCompanies.map((cItem, i) => (
                      <div
                        key={i}
                        onClick={() => addCompanyChip(cItem.name)}
                        style={{ padding: '11px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'background-color 0.12s' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fefce8'}
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

                    {/* Sticky Footer */}
                    <div style={{ padding: '8px 16px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: '11px', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', bottom: 0, zIndex: 10 }}>
                      <span>Showing all {filteredCompanies.length} companies • Scroll to browse A–Z</span>
                      <span style={{ fontWeight: 600 }}>Type or click letters A–Z to jump</span>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Designation</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>(Type any letter A-Z or browse executive roles)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {selectedDesignations.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedDesignations([])}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '11px', cursor: 'pointer', padding: '2px', textDecoration: 'underline' }}
                      >
                        Clear
                      </button>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setDesignationBoolean(!designationBoolean)}>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Boolean {designationBoolean ? 'on' : 'off'}</span>
                      <div style={{ width: '32px', height: '18px', backgroundColor: designationBoolean ? '#4338ca' : '#cbd5e1', borderRadius: '10px', position: 'relative', transition: 'background-color 0.2s' }}>
                        <div style={{ width: '14px', height: '14px', backgroundColor: '#ffffff', borderRadius: '50%', position: 'absolute', top: '2px', left: designationBoolean ? '16px' : '2px', transition: 'left 0.2s' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  alignItems: 'center',
                  minHeight: '48px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: showDesignationSuggestions ? '1.5px solid #4338ca' : '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  boxShadow: showDesignationSuggestions ? '0 0 0 3px rgba(67, 56, 202, 0.1)' : 'none',
                  transition: 'all 0.15s'
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
                        style={{ background: 'none', border: 'none', color: '#3730a3', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}

                  <input 
                    type="text" 
                    placeholder={selectedDesignations.length === 0 ? "Add designation" : "Add another designation..."}
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
                      } else if (e.key === 'Backspace' && !designationInput && selectedDesignations.length > 0) {
                        removeDesignationChip(selectedDesignations[selectedDesignations.length - 1]);
                      }
                    }}
                    style={{ border: 'none', outline: 'none', fontSize: '14px', flex: 1, minWidth: '220px', padding: '6px 0', backgroundColor: 'transparent', color: '#0f172a' }}
                  />
                </div>

                {/* Designation Dropdown with Interactive A-Z Scrubber */}
                {showDesignationSuggestions && filteredDesignations.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    boxShadow: '0 12px 28px -4px rgba(0,0,0,0.12), 0 8px 10px -6px rgba(0,0,0,0.08)',
                    zIndex: 60,
                    maxHeight: '380px',
                    overflowY: 'auto'
                  }}>
                    {/* Sticky Header */}
                    <div style={{ padding: '8px 16px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
                      <span>{designationInput ? `Matching Roles (${filteredDesignations.length}) for "${designationInput}"` : `All Available Designations (${filteredDesignations.length} Total from A–Z)`}</span>
                      <span style={{ color: '#4338ca', fontWeight: 700 }}>Click to add chip</span>
                    </div>

                    {/* A-Z Alphabet Quick Jump Scrubber for Designations */}
                    <div style={{
                      padding: '6px 12px',
                      backgroundColor: '#eef2ff',
                      borderBottom: '1px solid #e0e7ff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      overflowX: 'auto',
                      whiteSpace: 'nowrap',
                      position: 'sticky',
                      top: '32px',
                      zIndex: 10
                    }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#4338ca', marginRight: '4px', textTransform: 'uppercase' }}>Filter A–Z:</span>
                      {['ALL', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map(letter => (
                        <button
                          key={letter}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (letter === 'ALL') {
                              setDesignationInput('');
                            } else {
                              setDesignationInput(letter.toLowerCase());
                            }
                          }}
                          style={{
                            border: 'none',
                            backgroundColor: (letter === 'ALL' && !designationInput) || (designationInput.toUpperCase() === letter) ? '#4338ca' : '#ffffff',
                            color: (letter === 'ALL' && !designationInput) || (designationInput.toUpperCase() === letter) ? '#ffffff' : '#3730a3',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            transition: 'all 0.1s'
                          }}
                        >
                          {letter}
                        </button>
                      ))}
                    </div>

                    {/* Designation Suggestions */}
                    {filteredDesignations.map((dItem, i) => (
                      <div
                        key={i}
                        onClick={() => addDesignationChip(dItem.name)}
                        style={{ padding: '11px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'background-color 0.12s' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eef2ff'}
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

                    {/* Sticky Footer */}
                    <div style={{ padding: '8px 16px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: '11px', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', bottom: 0, zIndex: 10 }}>
                      <span>Showing all {filteredDesignations.length} roles • Scroll to browse A–Z</span>
                      <span style={{ fontWeight: 600 }}>Type or click letters A–Z to jump</span>
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
                <div style={{ padding: '20px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {/* UG Qualification */}
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>UG Qualification</span>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {['Any UG qualification', 'Specific UG qualification', 'No UG qualification'].map((item) => (
                        <button
                          key={item}
                          type="button"
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

                  {/* PG Qualification */}
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>PG Qualification</span>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {['Any PG qualification', 'Specific PG qualification', 'No PG qualification'].map((item) => (
                        <button
                          key={item}
                          type="button"
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

                  {/* Add PPG/Doctorate Qualification */}
                  <div style={{ paddingTop: '10px', borderTop: '1px dashed #e2e8f0' }}>
                    <button
                      type="button"
                      onClick={() => setPpgOpen(!ppgOpen)}
                      style={{ background: 'none', border: 'none', color: '#0056b3', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>+ Add PPG/Doctorate Qualification</span>
                    </button>

                    {ppgOpen && (
                      <div style={{ marginTop: '12px' }}>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          {['Any PPG qualification', 'Specific PPG qualification', 'No PPG qualification'].map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setPpgQualification(item)}
                              style={{
                                padding: '6px 14px',
                                borderRadius: '20px',
                                border: ppgQualification === item ? '1px solid #0056b3' : '1px solid #cbd5e1',
                                backgroundColor: ppgQualification === item ? '#eff6ff' : '#ffffff',
                                color: ppgQualification === item ? '#0056b3' : '#475569',
                                fontSize: '13px',
                                cursor: 'pointer'
                              }}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
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
                <div style={{ padding: '20px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Gender */}
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Gender</span>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {['All candidates', 'Male candidates', 'Female candidates'].map((item) => (
                        <button
                          key={item}
                          type="button"
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

                  {/* Candidates with career break */}
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Candidates with career break</span>
                    <button
                      type="button"
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

                  {/* Differently-abled */}
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Differently-abled</span>
                    <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '8px' }}>Select differently abled type</span>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {['Any', 'Blindness', 'Low Vision', 'Hearing Impairment', 'Speech and Language Disability', 'Locomotor Disability'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setDifferentlyAbledType(type)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: differentlyAbledType === type ? '1px solid #0056b3' : '1px solid #cbd5e1',
                            backgroundColor: differentlyAbledType === type ? '#eff6ff' : '#ffffff',
                            color: differentlyAbledType === type ? '#0056b3' : '#475569',
                            fontSize: '13px',
                            cursor: 'pointer'
                          }}
                        >
                          {type}
                        </button>
                      ))}

                      {/* +17 more toggle */}
                      <button
                        type="button"
                        onClick={() => setDifferentlyAbledOpen(!differentlyAbledOpen)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: differentlyAbledOpen ? '#e0e7ff' : '#f8fafc',
                          color: differentlyAbledOpen ? '#4338ca' : '#0056b3',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        +17 more {differentlyAbledOpen ? '▲' : '▼'}
                      </button>
                    </div>

                    {/* Expandable +17 more disabilities */}
                    {differentlyAbledOpen && (
                      <div style={{ marginTop: '10px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {RPWD_DISABILITIES_EXTRA.map((extraType) => (
                          <button
                            key={extraType}
                            type="button"
                            onClick={() => setDifferentlyAbledType(extraType)}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '16px',
                              border: differentlyAbledType === extraType ? '1px solid #0056b3' : '1px solid #cbd5e1',
                              backgroundColor: differentlyAbledType === extraType ? '#eff6ff' : '#ffffff',
                              color: differentlyAbledType === extraType ? '#0056b3' : '#475569',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            {extraType}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Defence background personnel */}
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Defence background personnel</span>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {['Any', 'Army', 'Navy', 'Air Force', 'Other Paramilitary Forces'].map((force) => (
                        <button
                          key={force}
                          type="button"
                          onClick={() => setDefencePersonnel(force)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: defencePersonnel === force ? '1px solid #0056b3' : '1px solid #cbd5e1',
                            backgroundColor: defencePersonnel === force ? '#eff6ff' : '#ffffff',
                            color: defencePersonnel === force ? '#0056b3' : '#475569',
                            fontSize: '13px',
                            cursor: 'pointer'
                          }}
                        >
                          {force}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Accordion 3: Additional Details */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div 
                onClick={() => setAdditionalDetailsOpen(!additionalDetailsOpen)}
                style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', backgroundColor: additionalDetailsOpen ? '#f8fafc' : '#ffffff' }}
              >
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Additional Details</span>
                {additionalDetailsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {additionalDetailsOpen && (
                <div style={{ padding: '20px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  
                  {/* Candidate details */}
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b', margin: '0 0 14px 0', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                      Candidate details
                    </h3>

                    {/* Candidate Category */}
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Candidate Category</span>
                      <div style={{ position: 'relative', maxWidth: '360px' }}>
                        <input
                          type="text"
                          placeholder="Add candidate category"
                          value={candidateCategory}
                          onChange={(e) => setCandidateCategory(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                        {['General', 'OBC', 'SC', 'ST'].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCandidateCategory(cat)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '14px',
                              border: candidateCategory === cat ? '1px solid #0056b3' : '1px solid #e2e8f0',
                              backgroundColor: candidateCategory === cat ? '#eff6ff' : '#f8fafc',
                              color: candidateCategory === cat ? '#0056b3' : '#64748b',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Candidate Age */}
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Candidate Age</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input 
                          type="number" 
                          placeholder="Min age" 
                          value={minAge}
                          onChange={(e) => setMinAge(e.target.value)}
                          style={{ width: '120px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                        <span style={{ color: '#94a3b8' }}>to</span>
                        <input 
                          type="number" 
                          placeholder="Max age" 
                          value={maxAge}
                          onChange={(e) => setMaxAge(e.target.value)}
                          style={{ width: '120px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>Years</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9' }} />

                  {/* Work details */}
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b', margin: '0 0 14px 0', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                      Work details
                    </h3>

                    <div style={{ marginBottom: '14px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Show candidates seeking</span>
                    </div>

                    {/* Job type */}
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '6px' }}>Job type</span>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['Any', 'Permanent', 'Contractual / Temporary'].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setJobType(t)}
                            style={{
                              padding: '6px 14px',
                              borderRadius: '20px',
                              border: jobType === t ? '1px solid #0056b3' : '1px solid #cbd5e1',
                              backgroundColor: jobType === t ? '#eff6ff' : '#ffffff',
                              color: jobType === t ? '#0056b3' : '#475569',
                              fontSize: '13px',
                              cursor: 'pointer'
                            }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Employment type */}
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '6px' }}>Employment type</span>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['Any', 'Full Time', 'Part Time'].map((et) => (
                          <button
                            key={et}
                            type="button"
                            onClick={() => setEmploymentType(et)}
                            style={{
                              padding: '6px 14px',
                              borderRadius: '20px',
                              border: employmentType === et ? '1px solid #0056b3' : '1px solid #cbd5e1',
                              backgroundColor: employmentType === et ? '#eff6ff' : '#ffffff',
                              color: employmentType === et ? '#0056b3' : '#475569',
                              fontSize: '13px',
                              cursor: 'pointer'
                            }}
                          >
                            {et}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Work permit for */}
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '6px' }}>Work permit for</span>
                      <div style={{ maxWidth: '320px' }}>
                        <select
                          value={workPermit}
                          onChange={(e) => setWorkPermit(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '13px',
                            color: workPermit === 'Choose category' ? '#64748b' : '#0f172a',
                            backgroundColor: '#ffffff',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Choose category">Choose category</option>
                          <option value="Authorized to work in India">Authorized to work in India</option>
                          <option value="USA (H1B/Green Card)">USA (H1B/Green Card)</option>
                          <option value="Canada (PR)">Canada (PR)</option>
                          <option value="UK (Tier 2)">UK (Tier 2)</option>
                          <option value="UAE / Gulf Countries">UAE / Gulf Countries</option>
                          <option value="Europe (EU Blue Card)">Europe (EU Blue Card)</option>
                          <option value="Singapore / ASEAN">Singapore / ASEAN</option>
                        </select>
                      </div>
                    </div>

                  </div>

                </div>
              )}
            </div>

            {/* Display Details Card */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px 24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: '12px' }}>Display details</span>
              
              {/* Show Status */}
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px' }}>Show</span>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {['All candidates', 'New registrations', 'Modified candidates'].map((item) => (
                    <button
                      key={item}
                      type="button"
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
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px' }}>Show only candidates with</span>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setVerifiedMobileOnly(!verifiedMobileOnly)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      border: verifiedMobileOnly ? '1px solid #0056b3' : '1px solid #cbd5e1',
                      backgroundColor: verifiedMobileOnly ? '#eff6ff' : '#ffffff',
                      color: verifiedMobileOnly ? '#0056b3' : '#475569',
                      fontSize: '13px',
                      fontWeight: verifiedMobileOnly ? 700 : 500,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>Verified mobile number</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVerifiedEmailOnly(!verifiedEmailOnly)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      border: verifiedEmailOnly ? '1px solid #0056b3' : '1px solid #cbd5e1',
                      backgroundColor: verifiedEmailOnly ? '#eff6ff' : '#ffffff',
                      color: verifiedEmailOnly ? '#0056b3' : '#475569',
                      fontSize: '13px',
                      fontWeight: verifiedEmailOnly ? 700 : 500,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>Verified email ID</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttachedResumeOnly(!attachedResumeOnly)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      border: attachedResumeOnly ? '1px solid #0056b3' : '1px solid #cbd5e1',
                      backgroundColor: attachedResumeOnly ? '#eff6ff' : '#ffffff',
                      color: attachedResumeOnly ? '#0056b3' : '#475569',
                      fontSize: '13px',
                      fontWeight: attachedResumeOnly ? 700 : 500,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>Attached resume</span>
                  </button>
                </div>
              </div>

              {/* Active in - */}
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Active in -</span>
                <select
                  value={activeWindow}
                  onChange={(e) => setActiveWindow(e.target.value)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    color: '#0f172a',
                    fontWeight: 600,
                    outline: 'none',
                    backgroundColor: '#f8fafc',
                    cursor: 'pointer'
                  }}
                >
                  <option value="1 month">1 month</option>
                  <option value="3 months">3 months</option>
                  <option value="6 months">6 months</option>
                  <option value="1 year">1 year</option>
                  <option value="All">All Time</option>
                </select>
              </div>

            </div>

            {/* Bottom Primary Search candidates Button directly under form */}
            <div style={{ marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => handleSearch(true)}
                disabled={searching}
                style={{
                  backgroundColor: '#0056b3',
                  color: '#ffffff',
                  padding: '14px 40px',
                  borderRadius: '24px',
                  fontSize: '16px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: searching ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(0, 86, 179, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'background-color 0.15s'
                }}
              >
                <Search size={18} />
                <span>{searching ? 'Searching...' : 'Search candidates'}</span>
              </button>
            </div>

          </div>

          {/* ============================================================= */}
          {/* RIGHT COLUMN: RECENT SEARCHES & SAVED SEARCHES SIDEBAR        */}
          {/* ============================================================= */}
          <div style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Recent Searches Box */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <History size={16} style={{ color: '#0056b3' }} />
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Recent Searches</h3>
                  <span style={{ fontSize: '11px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                    {recentSearches.length}
                  </span>
                </div>

                {/* Separate button to clear recent searches */}
                {recentSearches.length > 0 ? (
                  <button 
                    type="button"
                    onClick={handleClearRecentSearches}
                    style={{
                      background: '#fef2f2',
                      border: '1px solid #fee2e2',
                      color: '#dc2626',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.15s'
                    }}
                    title="Clear all recent searches"
                  >
                    <Trash2 size={12} />
                    <span>Clear recent searches</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRestoreRecentSearches}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0056b3',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Restore default demo recent searches"
                  >
                    <RotateCcw size={11} />
                    <span>Restore recent</span>
                  </button>
                )}
              </div>

              {recentSearches.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {recentSearches.map((item) => (
                    <div key={item.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', margin: 0, lineHeight: 1.4, flex: 1 }}>
                          {item.title}
                        </p>
                        <button
                          type="button"
                          onClick={(e) => handleRemoveRecentSearch(item.id, e)}
                          title="Remove this recent search"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: '4px'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                        >
                          <X size={13} />
                        </button>
                      </div>
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
              ) : (
                <div style={{ padding: '24px 12px', textAlign: 'center', color: '#64748b' }}>
                  <History size={26} style={{ color: '#cbd5e1', margin: '0 auto 8px', display: 'block' }} />
                  <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 700, color: '#334155' }}>No recent searches</p>
                  <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#94a3b8' }}>Searches you execute will appear here.</p>
                  <button
                    type="button"
                    onClick={handleRestoreRecentSearches}
                    style={{
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      color: '#0056b3',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '5px 12px',
                      borderRadius: '16px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <RotateCcw size={12} />
                    <span>Restore recent searches</span>
                  </button>
                </div>
              )}

            </div>

            {/* Saved Searches Box */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bookmark size={16} style={{ color: '#0056b3' }} />
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Saved Searches</h3>
                  <span style={{ fontSize: '11px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                    {savedSearches.length}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Separate button to clear saved searches */}
                  {savedSearches.length > 0 ? (
                    <button 
                      type="button"
                      onClick={handleClearSavedSearches}
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #fee2e2',
                        color: '#dc2626',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.15s'
                      }}
                      title="Clear all saved searches"
                    >
                      <Trash2 size={12} />
                      <span>Clear saved searches</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRestoreSavedSearches}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0056b3',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Restore default demo saved searches"
                    >
                      <RotateCcw size={11} />
                      <span>Restore saved</span>
                    </button>
                  )}
                  <button style={{ background: 'none', border: 'none', color: '#0056b3', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                    View all
                  </button>
                </div>
              </div>

              {savedSearches.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {savedSearches.map((item) => (
                    <div 
                      key={item.id} 
                      style={{ padding: '14px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', position: 'relative' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#0056b3' }}>{item.name}</span>
                          {item.badge && (
                            <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#dcfce7', color: '#166534', padding: '1px 6px', borderRadius: '4px' }}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleRemoveSavedSearch(item.id, e)}
                          title="Remove this saved search"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: '4px'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                        >
                          <X size={13} />
                        </button>
                      </div>
                      <span style={{ fontSize: '12px', color: '#64748b', display: 'block', lineHeight: 1.4, marginBottom: '10px' }}>{item.summary}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button 
                          type="button"
                          onClick={() => handleFillSearch(item.query, false)}
                          style={{ background: 'none', border: 'none', color: '#0056b3', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                        >
                          Fill this search
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleFillSearch(item.query, true)}
                          style={{ background: 'none', border: 'none', color: '#0056b3', fontSize: '12px', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                        >
                          {item.badge ? `${item.badge}` : 'Search profiles'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '24px 12px', textAlign: 'center', color: '#64748b' }}>
                  <Bookmark size={26} style={{ color: '#cbd5e1', margin: '0 auto 8px', display: 'block' }} />
                  <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 700, color: '#334155' }}>No saved searches</p>
                  <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#94a3b8' }}>Bookmark search filters to access them anytime.</p>
                  <button
                    type="button"
                    onClick={handleRestoreSavedSearches}
                    style={{
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      color: '#0056b3',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '5px 12px',
                      borderRadius: '16px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <RotateCcw size={12} />
                    <span>Restore saved searches</span>
                  </button>
                </div>
              )}
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

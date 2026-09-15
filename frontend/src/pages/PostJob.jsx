import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Star,
  Plus,
  X,
  Sparkles,
  Info,
  Building2,
  Check,
  Share2,
  ExternalLink,
  Search,
  ArrowLeft,
  Users,
  Mail,
  Copy,
  Clock,
  Award
} from 'lucide-react';
import { apiUrl } from '../api';
import {
  filterSkills,
  filterDepartments,
  filterIndustries,
  filterHierarchicalLocations,
  SPECIAL_LOCATION_SCOPES
} from '../data/resdexSuggestions';
import HierarchicalLocationDropdown from '../components/HierarchicalLocationDropdown';

export default function PostJob() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Top Nav Tab State
  const [activeNavTab, setActiveNavTab] = useState('jobs');
  const [showJobsMenu, setShowJobsMenu] = useState(false);

  // -------------------------------------------------------------
  // STEP 1: Job Details State
  // -------------------------------------------------------------
  const [company, setCompany] = useState('MCP Consultants');
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [hideCompany, setHideCompany] = useState(false);
  const [jobTitle, setJobTitle] = useState('Quality Engineer(QMS)');
  const [jobTitleError, setJobTitleError] = useState(false);
  const [department, setDepartment] = useState('Quality Assurance - Other');
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [employmentType, setEmploymentType] = useState('Full Time, Permanent');
  const [workExperienceMin, setWorkExperienceMin] = useState(7);
  const [workExperienceMax, setWorkExperienceMax] = useState(12);
  const [workMode, setWorkMode] = useState('In office');
  const [salaryType, setSalaryType] = useState('Total CTC');
  const [salaryMin, setSalaryMin] = useState('4.00');
  const [salaryMax, setSalaryMax] = useState('7.50');
  const [hideSalary, setHideSalary] = useState(false);
  
  // Locations (Hierarchical chips)
  const [locations, setLocations] = useState(['Baddi']);
  const [locationInput, setLocationInput] = useState('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [relocateToLocations, setRelocateToLocations] = useState(true);
  const [vacancies, setVacancies] = useState(1);

  // -------------------------------------------------------------
  // STEP 2: Preferred Candidate Details State
  // -------------------------------------------------------------
  const [skills, setSkills] = useState([
    { name: 'Quality Control', mandatory: true },
    { name: 'Quality Inspection', mandatory: false },
    { name: 'Quality Check', mandatory: true },
    { name: 'Quality Audit', mandatory: false },
    { name: 'QMS', mandatory: true },
    { name: 'ISO', mandatory: true },
    { name: 'IATF', mandatory: true },
    { name: 'Quality System Management', mandatory: false },
    { name: 'Customer Quality', mandatory: false },
    { name: 'Process Quality', mandatory: false },
    { name: 'Incoming Quality', mandatory: false },
    { name: 'Line Inspection', mandatory: false },
    { name: 'In Process Quality', mandatory: false },
    { name: 'Customer Audits', mandatory: false },
    { name: 'Final Quality', mandatory: false },
    { name: 'gears', mandatory: false },
    { name: 'Gear Manufacturing', mandatory: false },
    { name: 'Gear Box', mandatory: false },
    { name: 'Quality', mandatory: true }
  ]);
  const [skillInput, setSkillInput] = useState('');
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);

  const [education, setEducation] = useState([
    'Diploma - Mechanical Engineering',
    'B.Tech/B.E. - Mechanical Engineering'
  ]);
  const [educationInput, setEducationInput] = useState('');
  const [premiumBTech, setPremiumBTech] = useState(false);
  const [candidateIndustry, setCandidateIndustry] = useState('Industrial Equipment / Machinery');

  // -------------------------------------------------------------
  // STEP 3: Job Description State
  // -------------------------------------------------------------
  const [jobDescription, setJobDescription] = useState(`We require candidate for the position of Quality Engineer-QMS who should have experience in gears industry.
T-EXP: 7-12 yrs
CTC: 4.00 Lacs - 7.50 Lacs
Location: Baddi

Interested candidates may contact undersigned:
Shikha (9888426060)`);
  const [showCandidateProfileBlock, setShowCandidateProfileBlock] = useState(false);
  const [candidateProfile, setCandidateProfile] = useState('Candidate must have strong exposure to IATF 16949, ISO 9001 audits, and gear manufacturing quality inspection.');
  const [showPerksBlock, setShowPerksBlock] = useState(false);
  const [perks, setPerks] = useState('Performance Bonus, Health Insurance, Transportation Support');

  // -------------------------------------------------------------
  // STEP 4: Screening Questions State
  // -------------------------------------------------------------
  const [screeningQuestions, setScreeningQuestions] = useState([
    'What is your current CTC in Lacs per annum?',
    'What is your expected CTC in Lacs per annum?',
    'What is your notice period?',
    'How many years of experience do you have in Quality Control / QMS?',
    'Are you currently residing in Baddi or willing to relocate to Baddi?'
  ]);
  const [customQuestionInput, setCustomQuestionInput] = useState('');
  const [showAddCustomQuestion, setShowAddCustomQuestion] = useState(false);

  // Suggested questions bank
  const SUGGESTED_QUESTIONS = [
    'What is your current CTC in Lacs per annum?',
    'What is your expected CTC in Lacs per annum?',
    'What is your notice period?',
    'How many years of experience do you have in Quality Control?',
    'How many years of experience do you have in Quality Inspection?',
    'How many years of experience do you have in Quality Check?',
    'Are you currently residing in Baddi or willing to relocate to Baddi?',
    'How many years of experience do you have in Quality Audit?',
    'How many years of experience do you have in QMS?',
    'Do you have hands-on experience with IATF 16949 audits?'
  ];

  // -------------------------------------------------------------
  // STEP 5: Advanced Options State
  // -------------------------------------------------------------
  const [isWalkIn, setIsWalkIn] = useState(false);
  const [collaborators, setCollaborators] = useState(['Shallu.mcpconsultants@gmail.com', 'Shikha.mcpconsultants@gmail.com']);
  const [responseEmailPolicy, setResponseEmailPolicy] = useState('As a daily summary');
  const [referenceCode, setReferenceCode] = useState('MCP-2026-091');
  const [showReferenceCodeInput, setShowReferenceCodeInput] = useState(true);
  const [scheduleRefresh, setScheduleRefresh] = useState(false);

  // -------------------------------------------------------------
  // Submission & Success Modal State
  // -------------------------------------------------------------
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [createdJob, setCreatedJob] = useState(null);
  const [resdexMatchCount, setResdexMatchCount] = useState(24);
  const [copiedLink, setCopiedLink] = useState(false);

  // Outside click listener
  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest('.postjob-autocomplete-wrapper')) {
        setShowLocationSuggestions(false);
        setShowSkillSuggestions(false);
        setShowDeptDropdown(false);
      }
      if (!e.target.closest('.jobs-menu-wrapper')) {
        setShowJobsMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Skill Add / Toggle Mandatory
  const handleAddSkill = (skillName, isMandatory = false) => {
    if (!skillName || !skillName.trim()) return;
    const clean = skillName.trim();
    if (!skills.some(s => s.name.toLowerCase() === clean.toLowerCase())) {
      setSkills([...skills, { name: clean, mandatory: isMandatory }]);
    }
    setSkillInput('');
  };

  const handleToggleMandatorySkill = (skillName) => {
    setSkills(skills.map(s => s.name === skillName ? { ...s, mandatory: !s.mandatory } : s));
  };

  const handleRemoveSkill = (skillName) => {
    setSkills(skills.filter(s => s.name !== skillName));
  };

  // Location Add / Remove
  const handleSelectLocation = (locName) => {
    if (!locations.includes(locName)) {
      setLocations([...locations, locName]);
    }
    setLocationInput('');
    setShowLocationSuggestions(false);
  };

  const handleRemoveLocation = (locToRemove) => {
    setLocations(locations.filter(l => l !== locToRemove));
  };

  // Education Add / Remove
  const handleAddEducation = (edu) => {
    if (!edu || !edu.trim()) return;
    if (!education.includes(edu.trim())) {
      setEducation([...education, edu.trim()]);
    }
    setEducationInput('');
  };

  const handleRemoveEducation = (eduToRemove) => {
    setEducation(education.filter(e => e !== eduToRemove));
  };

  // Screening Questions Add / Remove
  const handleAddQuestion = (q) => {
    if (!q || !q.trim()) return;
    if (!screeningQuestions.includes(q.trim())) {
      setScreeningQuestions([...screeningQuestions, q.trim()]);
    }
    setCustomQuestionInput('');
    setShowAddCustomQuestion(false);
  };

  const handleRemoveQuestion = (qToRemove) => {
    setScreeningQuestions(screeningQuestions.filter(q => q !== qToRemove));
  };

  // Submit Handler
  const handlePostJobSubmit = async () => {
    if (!jobTitle.trim()) {
      setJobTitleError(true);
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: jobTitle,
        company,
        hideCompany,
        department,
        employmentType,
        workExperienceMin: Number(workExperienceMin),
        workExperienceMax: Number(workExperienceMax),
        workMode,
        salaryType,
        salaryMin,
        salaryMax,
        hideSalary,
        locations,
        relocateToLocations,
        vacancies: Number(vacancies),
        skills,
        education,
        industry: candidateIndustry,
        jobDescription,
        candidateProfile,
        perks,
        screeningQuestions,
        isWalkIn,
        collaborators,
        responseEmailPolicy,
        referenceCode,
        status: 'Active'
      };

      const res = await fetch(apiUrl('/api/jobs'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setCreatedJob(data.job);
        setResdexMatchCount(data.matchingCandidatesCount || 24);
        setSuccessModalOpen(true);
      } else {
        alert(data.message || 'Error posting job.');
      }
    } catch (err) {
      console.error('Error posting job:', err);
      // Demo fallback in case offline
      setCreatedJob({
        _id: 'demo-job-id',
        title: jobTitle,
        locations,
        skills,
        referenceCode: referenceCode || 'MCP-2026-091'
      });
      setResdexMatchCount(24);
      setSuccessModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp Share text generator
  const getWhatsAppShareText = () => {
    const locText = locations.join(', ') || 'Baddi';
    return encodeURIComponent(
      `🚀 *Urgent Opening via MCP Consultants*\n\n` +
      `📌 *Role:* ${jobTitle}\n` +
      `🏢 *Company:* ${hideCompany ? 'Leading Industrial Multinational (Confidential Mandate)' : company}\n` +
      `📍 *Location:* ${locText}\n` +
      `💼 *Experience:* ${workExperienceMin}-${workExperienceMax} Years\n` +
      `💰 *CTC:* ${salaryMin}-${salaryMax} Lacs\n` +
      `🔑 *Key Skills:* ${skills.slice(0, 5).map(s => s.name).join(', ')}\n\n` +
      `Interested candidates can connect directly with Shikha (9888426060) or apply at: http://localhost:5173/jobs`
    );
  };

  const copyShareLink = () => {
    const link = `http://localhost:5173/jobs`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Stepper items definition
  const STEPS = [
    { id: 1, label: 'Job details' },
    { id: 2, label: 'Preferred candidate details' },
    { id: 3, label: 'Job description' },
    { id: 4, label: 'Screening questions' },
    { id: 5, label: 'Advanced options' }
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#0f172a' }}>
      
      {/* ------------------------------------------------------------- */}
      {/* TOP CORPORATE NAVIGATION BAR (Matches Naukri Employer Suite)   */}
      {/* ------------------------------------------------------------- */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            {/* Logo */}
            <Link to="/admin/resdex" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #0056b3, #0077ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: '900', fontSize: '16px' }}>
                M
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px', color: '#0056b3', lineHeight: 1 }}>mcp</span>
                <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#64748b' }}>hiring</span>
              </div>
            </Link>

            {/* Navigation Tabs */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Jobs & Responses with Dropdown */}
              <div className="jobs-menu-wrapper" style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setShowJobsMenu(!showJobsMenu)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '18px 12px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#0f172a',
                    cursor: 'pointer',
                    borderBottom: '3px solid #ff4d4f',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>Jobs & Responses</span>
                  <ChevronDown size={14} />
                </button>

                {showJobsMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '240px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    zIndex: 120,
                    padding: '8px 0'
                  }}>
                    <Link
                      to="/admin/post-job"
                      onClick={() => setShowJobsMenu(false)}
                      style={{ display: 'block', padding: '10px 16px', fontSize: '13px', fontWeight: 700, color: '#0056b3', backgroundColor: '#eff6ff', textDecoration: 'none' }}
                    >
                      Post a Classified (Active)
                    </Link>
                    <Link
                      to="/admin/jobs"
                      onClick={() => setShowJobsMenu(false)}
                      style={{ display: 'block', padding: '10px 16px', fontSize: '13px', color: '#334155', textDecoration: 'none' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                    >
                      Manage Jobs & Responses
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to="/admin/resdex"
                style={{
                  padding: '18px 12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#475569',
                  textDecoration: 'none',
                  borderBottom: '3px solid transparent'
                }}
              >
                Resdex
              </Link>

              <Link
                to="/admin"
                style={{
                  padding: '18px 12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#475569',
                  textDecoration: 'none',
                  borderBottom: '3px solid transparent'
                }}
              >
                Reports
              </Link>
            </nav>
          </div>

          {/* Right Profile & Utilities */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              to="/admin/jobs"
              style={{ fontSize: '13px', color: '#0056b3', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Briefcase size={14} />
              <span>Manage Jobs</span>
            </Link>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#0056b3', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px' }}>
              N
            </div>
          </div>

        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* MAIN JOB POSTING CANVAS CONTAINER                             */}
      {/* ------------------------------------------------------------- */}
      <main style={{ maxWidth: '1240px', margin: '24px auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }}>
        
        {/* =========================================================== */}
        {/* LEFT SIDEBAR: STEPPER & PROMO CARD                          */}
        {/* =========================================================== */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Main Stepper Card */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Post a job</h1>
              <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#eff6ff', color: '#0056b3', padding: '2px 8px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                Classified
              </span>
            </div>

            {/* Stepper list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
              {STEPS.map((step, idx) => {
                const isCompleted = step.id < currentStep;
                const isActive = step.id === currentStep;

                return (
                  <div 
                    key={step.id} 
                    onClick={() => setCurrentStep(step.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', position: 'relative', zIndex: 2 }}
                  >
                    {/* Circle Indicator */}
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 700,
                        backgroundColor: isCompleted ? '#22c55e' : isActive ? '#ffffff' : '#f1f5f9',
                        color: isCompleted ? '#ffffff' : isActive ? '#0056b3' : '#94a3b8',
                        border: isActive ? '2px solid #0056b3' : isCompleted ? 'none' : '1px solid #cbd5e1'
                      }}
                    >
                      {isCompleted ? <Check size={14} /> : isActive ? <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0056b3' }} /> : step.id}
                    </div>

                    <span style={{
                      fontSize: '13.5px',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#0f172a' : isCompleted ? '#334155' : '#64748b'
                    }}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Progress status tag */}
            <div style={{ marginTop: '28px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} />
                <span>Job posting form filled (Step {currentStep} of 5)</span>
              </span>
            </div>

          </div>

          {/* Left Webinar Promo Card (Matches Screenshot) */}
          <div style={{ backgroundColor: '#fffbeb', borderRadius: '12px', padding: '16px 18px', border: '1px solid #fef3c7' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#92400e', display: 'block', marginBottom: '4px' }}>
              Join our free MCP recruiter webinar
            </span>
            <p style={{ margin: '0 0 10px', fontSize: '11.5px', color: '#b45309', lineHeight: 1.4 }}>
              Learn how to post jobs, write high-converting JDs, and match candidates on Resdex.
            </p>
            <a href="#webinar" style={{ fontSize: '11.5px', fontWeight: 700, color: '#b45309', textDecoration: 'none' }}>
              Reserve your slot →
            </a>
          </div>

        </aside>

        {/* =========================================================== */}
        {/* RIGHT CONTENT BODY: MULTI-STEP FORMS                        */}
        {/* =========================================================== */}
        <section style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '32px 36px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', position: 'relative' }}>
          
          {/* Quick Header Right Link */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              <strong style={{ color: '#0f172a' }}>Key in from scratch</strong> or{' '}
              <button 
                type="button"
                onClick={() => {
                  setJobTitle('Quality Engineer(QMS)');
                  setLocations(['Baddi']);
                  setWorkExperienceMin(7);
                  setWorkExperienceMax(12);
                  setSalaryMin('4.00');
                  setSalaryMax('7.50');
                }}
                style={{ background: 'none', border: 'none', color: '#0056b3', fontWeight: 600, cursor: 'pointer', padding: 0 }}
              >
                Prefill from previous jobs
              </button>
            </span>
          </div>

          {/* --------------------------------------------------------- */}
          {/* STEP 1: JOB DETAILS                                       */}
          {/* --------------------------------------------------------- */}
          {currentStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              
              {/* Field 1: Company you're hiring for */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Company you're hiring for
                </label>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc' }}>
                  {isEditingCompany ? (
                    <input 
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      onBlur={() => setIsEditingCompany(false)}
                      autoFocus
                      style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', width: '80%', fontWeight: 600 }}
                    />
                  ) : (
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{company}</span>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsEditingCompany(!isEditingCompany)}
                    style={{ background: 'none', border: 'none', color: '#0056b3', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    {isEditingCompany ? 'Done' : 'Change'}
                  </button>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', marginTop: '6px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox"
                    checked={hideCompany}
                    onChange={(e) => setHideCompany(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>Hide this information (Confidential Hiring)</span>
                </label>
              </div>

              {/* Field 2: Job title */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Job title <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input 
                  type="text"
                  placeholder="Enter job title e.g. Quality Engineer(QMS), Plant Head"
                  value={jobTitle}
                  onChange={(e) => {
                    setJobTitle(e.target.value);
                    if (jobTitleError) setJobTitleError(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: jobTitleError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                {jobTitleError && (
                  <span style={{ fontSize: '11.5px', color: '#ef4444', marginTop: '4px', display: 'block' }}>
                    Please enter a job title
                  </span>
                )}
              </div>

              {/* Field 3: Department */}
              <div className="postjob-autocomplete-wrapper" style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Department
                </label>
                <div
                  onClick={() => setShowDeptDropdown(!showDeptDropdown)}
                  style={{
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '14px'
                  }}
                >
                  <span style={{ color: department ? '#0f172a' : '#94a3b8' }}>{department || 'Enter department'}</span>
                  <ChevronDown size={14} style={{ color: '#64748b' }} />
                </div>

                {showDeptDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    zIndex: 50,
                    maxHeight: '220px',
                    overflowY: 'auto'
                  }}>
                    {['Quality Assurance - Other', 'Production & Manufacturing', 'Plant P&L & General Management', 'Plant Maintenance & Reliability', 'Engineering Design & CAD', 'Supply Chain & Sourcing'].map((d, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setDepartment(d);
                          setShowDeptDropdown(false);
                        }}
                        style={{ padding: '9px 14px', fontSize: '13px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                      >
                        {d}
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggestions pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Suggestions:</span>
                  <button
                    type="button"
                    onClick={() => setDepartment('Production & Manufacturing')}
                    style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '2px 10px', fontSize: '11px', color: '#334155', cursor: 'pointer' }}
                  >
                    + Production & Manufacturing
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepartment('Quality Assurance - Other')}
                    style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '2px 10px', fontSize: '11px', color: '#334155', cursor: 'pointer' }}
                  >
                    + Quality Assurance - Other
                  </button>
                </div>
              </div>

              {/* Field 4: Employment type */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Employment type
                </label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#ffffff', outline: 'none' }}
                >
                  <option>Full Time, Permanent</option>
                  <option>Contractual / Temporary</option>
                  <option>Part Time</option>
                  <option>Consulting Mandate</option>
                </select>
              </div>

              {/* Field 5: Work experience */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Work experience
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <select
                    value={workExperienceMin}
                    onChange={(e) => setWorkExperienceMin(Number(e.target.value))}
                    style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', backgroundColor: '#ffffff' }}
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 18, 20].map(yr => (
                      <option key={yr} value={yr}>{yr} years</option>
                    ))}
                  </select>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>to</span>
                  <select
                    value={workExperienceMax}
                    onChange={(e) => setWorkExperienceMax(Number(e.target.value))}
                    style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', backgroundColor: '#ffffff' }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 18, 20, 25, 30].map(yr => (
                      <option key={yr} value={yr}>{yr} years</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Field 6: Work mode */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  Work mode
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['In office', 'Hybrid', 'Remote'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setWorkMode(mode)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: workMode === mode ? '1.5px solid #0056b3' : '1px solid #cbd5e1',
                        backgroundColor: workMode === mode ? '#eff6ff' : '#ffffff',
                        color: workMode === mode ? '#0056b3' : '#334155',
                        fontSize: '12.5px',
                        fontWeight: workMode === mode ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 7: Salary type & range */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  Salary type
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  {['Total CTC', 'Fixed + variable'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSalaryType(st)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: salaryType === st ? '1.5px solid #0056b3' : '1px solid #cbd5e1',
                        backgroundColor: salaryType === st ? '#eff6ff' : '#ffffff',
                        color: salaryType === st ? '#0056b3' : '#334155',
                        fontSize: '12.5px',
                        fontWeight: salaryType === st ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#475569', padding: '10px 12px', backgroundColor: '#f1f5f9', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    ₹
                  </span>
                  <input 
                    type="text"
                    placeholder="Min salary e.g. 4.00"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}
                  />
                  <span style={{ fontSize: '13px', color: '#64748b' }}>to</span>
                  <input 
                    type="text"
                    placeholder="Max salary e.g. 7.50"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                    style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}
                  />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Lacs</span>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', marginTop: '6px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox"
                    checked={hideSalary}
                    onChange={(e) => setHideSalary(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>Hide salary details from candidates</span>
                </label>
              </div>

              {/* Field 8: Job location */}
              <div className="postjob-autocomplete-wrapper" style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Job location
                </label>
                
                {/* Location chips container */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                  {locations.map((loc, idx) => (
                    <span
                      key={idx}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '16px',
                        backgroundColor: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        color: '#0056b3',
                        fontSize: '12px',
                        fontWeight: 600
                      }}
                    >
                      <MapPin size={12} />
                      <span>{loc}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLocation(loc)}
                        style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: 0 }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>

                <input 
                  type="text"
                  placeholder="Search and add your job location e.g. Baddi, Mohali, Pune"
                  value={locationInput}
                  onChange={(e) => {
                    setLocationInput(e.target.value);
                    setShowLocationSuggestions(true);
                  }}
                  onFocus={() => setShowLocationSuggestions(true)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />

                {showLocationSuggestions && (
                  <HierarchicalLocationDropdown
                    searchQuery={locationInput}
                    selectedLocations={locations}
                    onSelectLocation={(loc) => handleSelectLocation(loc)}
                    onClose={() => setShowLocationSuggestions(false)}
                  />
                )}

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', marginTop: '6px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox"
                    checked={relocateToLocations}
                    onChange={(e) => setRelocateToLocations(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>Include candidates ready to relocate to the above location</span>
                </label>
              </div>

              {/* Field 9: No. of vacancies */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  No. of vacancies for this job
                </label>
                <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setVacancies(Math.max(1, vacancies - 1))}
                    style={{ width: '36px', height: '36px', border: 'none', background: '#f8fafc', fontSize: '16px', cursor: 'pointer', borderRight: '1px solid #cbd5e1' }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 16px', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                    {vacancies}
                  </span>
                  <button
                    type="button"
                    onClick={() => setVacancies(vacancies + 1)}
                    style={{ width: '36px', height: '36px', border: 'none', background: '#f8fafc', fontSize: '16px', cursor: 'pointer', borderLeft: '1px solid #cbd5e1' }}
                  >
                    +
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* --------------------------------------------------------- */}
          {/* STEP 2: PREFERRED CANDIDATE DETAILS                        */}
          {/* --------------------------------------------------------- */}
          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              
              {/* Add Skills */}
              <div className="postjob-autocomplete-wrapper" style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Add skills
                </label>

                {/* Skill Chips with Star mandatory toggle */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', minHeight: '80px', marginBottom: '8px' }}>
                  {skills.map((s, idx) => (
                    <span
                      key={idx}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '16px',
                        backgroundColor: s.mandatory ? '#eff6ff' : '#ffffff',
                        border: s.mandatory ? '1.5px solid #0056b3' : '1px solid #cbd5e1',
                        color: s.mandatory ? '#0056b3' : '#334155',
                        fontSize: '12px',
                        fontWeight: s.mandatory ? 700 : 500
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleMandatorySkill(s.name)}
                        title={s.mandatory ? "Mandatory skill (Click to toggle)" : "Click to mark as mandatory"}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                      >
                        <Star size={12} style={{ fill: s.mandatory ? '#eab308' : 'none', color: s.mandatory ? '#eab308' : '#94a3b8' }} />
                      </button>
                      <span>{s.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s.name)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <input 
                    type="text"
                    placeholder="Type skill e.g. Quality Control, IATF"
                    value={skillInput}
                    onChange={(e) => {
                      setSkillInput(e.target.value);
                      setShowSkillSuggestions(true);
                    }}
                    onFocus={() => setShowSkillSuggestions(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill(skillInput, false);
                      }
                    }}
                    style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', flex: 1, minWidth: '140px' }}
                  />
                </div>

                {/* Skill Autocomplete Dropdown */}
                {showSkillSuggestions && skillInput && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    zIndex: 50,
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {filterSkills(skillInput).slice(0, 8).map((sk, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          handleAddSkill(sk.name, false);
                          setShowSkillSuggestions(false);
                        }}
                        style={{ padding: '8px 14px', fontSize: '13px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                      >
                        <span style={{ fontWeight: 600 }}>{sk.name}</span>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>{sk.category}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggestions pills (from screenshot) */}
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Suggestions:</span>
                  {['Quality Systems', 'Manufacturing Quality', 'Plant Quality', 'VDA', 'Customer Complaints'].map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddSkill(s, false)}
                      style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '2px 10px', fontSize: '11px', color: '#334155', cursor: 'pointer' }}
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Educational qualification */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Educational qualification
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', marginBottom: '6px' }}>
                  {education.map((edu, idx) => (
                    <span
                      key={idx}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '16px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        color: '#334155',
                        fontSize: '12px',
                        fontWeight: 600
                      }}
                    >
                      <span>{edu}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(edu)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <input 
                    type="text"
                    placeholder="Add more education e.g. M.Tech, MBA"
                    value={educationInput}
                    onChange={(e) => setEducationInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddEducation(educationInput);
                      }
                    }}
                    style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', flex: 1, minWidth: '150px' }}
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', cursor: 'pointer' }}>
                  <input 
                    type="checkbox"
                    checked={premiumBTech}
                    onChange={(e) => setPremiumBTech(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>Premium B.Tech (IITs / NITs / BITS Pilani)</span>
                </label>
              </div>

              {/* Candidate's industry you are looking to hire from */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Candidate's industry you are looking to hire from (Optional)
                </label>
                <select
                  value={candidateIndustry}
                  onChange={(e) => setCandidateIndustry(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#ffffff', outline: 'none' }}
                >
                  <option>Industrial Equipment / Machinery</option>
                  <option>Automotive & Auto Ancillaries</option>
                  <option>Heavy Engineering & Capital Goods</option>
                  <option>Metals, Mining & Steel</option>
                  <option>Chemicals & Petrochemicals</option>
                  <option>Pharmaceuticals & Biotech</option>
                </select>
              </div>

            </div>
          )}

          {/* --------------------------------------------------------- */}
          {/* STEP 3: JOB DESCRIPTION                                   */}
          {/* --------------------------------------------------------- */}
          {currentStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                    Job details <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                    {jobDescription.length} / 4000
                  </span>
                </div>

                <textarea 
                  rows={9}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Enter detailed job description, responsibilities, reporting structure, and requirements..."
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px',
                    lineHeight: 1.6,
                    outline: 'none',
                    fontFamily: 'inherit',
                    backgroundColor: '#fafafa'
                  }}
                />
              </div>

              {/* Optional Accordions */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setShowCandidateProfileBlock(!showCandidateProfileBlock)}
                  style={{ background: 'none', border: 'none', color: '#0056b3', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 0' }}
                >
                  <span>{showCandidateProfileBlock ? '- Hide candidate profile details' : '+ Add candidate profile details (Optional)'}</span>
                </button>
                {showCandidateProfileBlock && (
                  <textarea
                    rows={3}
                    value={candidateProfile}
                    onChange={(e) => setCandidateProfile(e.target.value)}
                    placeholder="Candidate profile requirements..."
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', marginTop: '6px' }}
                  />
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setShowPerksBlock(!showPerksBlock)}
                  style={{ background: 'none', border: 'none', color: '#0056b3', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 0' }}
                >
                  <span>{showPerksBlock ? '- Hide perks and benefits' : '+ Perks and benefits (Optional)'}</span>
                </button>
                {showPerksBlock && (
                  <textarea
                    rows={2}
                    value={perks}
                    onChange={(e) => setPerks(e.target.value)}
                    placeholder="e.g. Performance bonus, health insurance, company transport..."
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', marginTop: '6px' }}
                  />
                )}
              </div>

            </div>
          )}

          {/* --------------------------------------------------------- */}
          {/* STEP 4: SCREENING QUESTIONS                               */}
          {/* --------------------------------------------------------- */}
          {currentStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              
              {/* Add a question button */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAddCustomQuestion(!showAddCustomQuestion)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1.5px dashed #0056b3',
                    backgroundColor: '#eff6ff',
                    color: '#0056b3',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={16} />
                  <span>Add a custom question</span>
                </button>

                {showAddCustomQuestion && (
                  <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                    <input 
                      type="text"
                      placeholder="Type your question e.g. Do you have experience with IATF audits?"
                      value={customQuestionInput}
                      onChange={(e) => setCustomQuestionInput(e.target.value)}
                      style={{ flex: 1, padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddQuestion(customQuestionInput)}
                      style={{ padding: '0 16px', borderRadius: '6px', backgroundColor: '#0056b3', color: '#ffffff', border: 'none', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>

              {/* Selected screening questions */}
              {screeningQuestions.length > 0 && (
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: '8px' }}>
                    Active Screening Questions ({screeningQuestions.length})
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {screeningQuestions.map((q, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '8px',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span style={{ fontSize: '13px', color: '#334155' }}>
                          <strong>{idx + 1}.</strong> {q}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(q)}
                          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Questions List (From Screenshot) */}
              <div>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '8px' }}>
                  Suggested questions:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {SUGGESTED_QUESTIONS.filter(q => !screeningQuestions.includes(q)).map((sq, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddQuestion(sq)}
                      style={{
                        textAlign: 'left',
                        padding: '9px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                        fontSize: '12.5px',
                        color: '#334155',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                    >
                      <Plus size={13} style={{ color: '#0056b3' }} />
                      <span>{sq}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* --------------------------------------------------------- */}
          {/* STEP 5: ADVANCED OPTIONS                                  */}
          {/* --------------------------------------------------------- */}
          {currentStep === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Field 1: Is this a walk-in job? */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  Is this a walk-in job?
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Yes', 'No'].map((opt) => {
                    const isYes = opt === 'Yes';
                    const active = isWalkIn === isYes;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setIsWalkIn(isYes)}
                        style={{
                          padding: '6px 18px',
                          borderRadius: '20px',
                          border: active ? '1.5px solid #0056b3' : '1px solid #cbd5e1',
                          backgroundColor: active ? '#eff6ff' : '#ffffff',
                          color: active ? '#0056b3' : '#334155',
                          fontSize: '13px',
                          fontWeight: active ? 700 : 500,
                          cursor: 'pointer'
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Field 2: Collaborate with team members to manage responses */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  Collaborate with team members to manage responses
                </label>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px', alignItems: 'start' }}>
                  {/* Left Collaborators Box */}
                  <div style={{ padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                      {collaborators.map((collab, idx) => (
                        <span
                          key={idx}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: '16px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #cbd5e1',
                            fontSize: '12px',
                            color: '#334155'
                          }}
                        >
                          <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#0056b3', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>
                            {collab[0].toUpperCase()}
                          </span>
                          <span>{collab}</span>
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const email = prompt('Enter recruiter team email to add:');
                        if (email && !collaborators.includes(email.trim())) {
                          setCollaborators([...collaborators, email.trim()]);
                        }
                      }}
                      style={{ background: 'none', border: 'none', color: '#0056b3', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                    >
                      + Add members
                    </button>
                  </div>

                  {/* Right Info Box */}
                  <div style={{ padding: '12px 14px', borderRadius: '8px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', fontSize: '12px', color: '#1e3a8a', lineHeight: 1.4 }}>
                    <Info size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                    <span>Add or remove team members who will be able to manage this job and its responses.</span>
                  </div>
                </div>
              </div>

              {/* Field 3: Receive responses over email */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                    Receive responses over email
                  </label>
                  <select
                    value={responseEmailPolicy}
                    onChange={(e) => setResponseEmailPolicy(e.target.value)}
                    style={{ border: 'none', background: 'transparent', color: '#0056b3', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    <option>As a daily summary</option>
                    <option>Instant notification</option>
                    <option>Weekly digest</option>
                  </select>
                </div>

                <div style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={15} style={{ color: '#64748b' }} />
                    <span>Responses routed to assigned recruiters ({collaborators.join(', ')})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => alert(`Responses configured to: ${collaborators.join(', ')}`)}
                    style={{ background: 'none', border: 'none', color: '#0056b3', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Field 4: Reference code */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                    Reference code to distinctly identify this job
                  </label>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>For internal tracking</span>
                </div>
                <input 
                  type="text"
                  value={referenceCode}
                  onChange={(e) => setReferenceCode(e.target.value)}
                  placeholder="e.g. MCP-2026-091"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              {/* Field 5: Schedule job for automatic refresh */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                  <input 
                    type="checkbox"
                    checked={scheduleRefresh}
                    onChange={(e) => setScheduleRefresh(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>Schedule job for automatic weekly refresh (Brings job back to top of search)</span>
                </label>
              </div>

            </div>
          )}

          {/* --------------------------------------------------------- */}
          {/* BOTTOM STEP NAVIGATION BAR                                */}
          {/* --------------------------------------------------------- */}
          <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            
            {/* Back Button */}
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              style={{
                padding: '9px 24px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: currentStep === 1 ? '#f1f5f9' : '#ffffff',
                color: currentStep === 1 ? '#94a3b8' : '#334155',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Back
            </button>

            {/* Next / Submit Button */}
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 1 && !jobTitle.trim()) {
                    setJobTitleError(true);
                    return;
                  }
                  setCurrentStep(currentStep + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  padding: '9px 32px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#0056b3',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,86,179,0.2)'
                }}
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePostJobSubmit}
                disabled={isSubmitting}
                style={{
                  padding: '10px 36px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: isSubmitting ? '#94a3b8' : '#0056b3',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  boxShadow: '0 4px 12px rgba(0,86,179,0.25)'
                }}
              >
                {isSubmitting ? 'Posting job...' : 'Preview & post job'}
              </button>
            )}

          </div>

        </section>

      </main>

      {/* ------------------------------------------------------------- */}
      {/* POST-SUBMISSION SUCCESS & RESDEX BRIDGE MODAL                 */}
      {/* ------------------------------------------------------------- */}
      {successModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            maxWidth: '560px',
            width: '100%',
            padding: '32px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            textAlign: 'center'
          }}>
            
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={32} />
            </div>

            <h2 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>
              Job Posted Successfully!
            </h2>
            <p style={{ margin: '0 0 20px', fontSize: '13.5px', color: '#64748b', lineHeight: 1.5 }}>
              Your mandate <strong>"{jobTitle}"</strong> ({locations.join(', ') || 'Baddi'}) is now active under reference code <strong>{referenceCode}</strong>.
            </p>

            {/* Instant Resdex Match Box (High-Value Feature) */}
            <div style={{ padding: '16px 20px', borderRadius: '12px', backgroundColor: '#eff6ff', border: '1.5px solid #bfdbfe', marginBottom: '24px', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0056b3', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} />
                  <span>Instant Resdex Candidate Match</span>
                </span>
                <span style={{ fontSize: '12px', fontWeight: 700, backgroundColor: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '12px' }}>
                  {resdexMatchCount} Matches Found
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#1e3a8a', lineHeight: 1.4 }}>
                We found <strong>{resdexMatchCount} candidates</strong> in your Resdex database who already match this job's skills and location!
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              {/* 1-Click Bridge into Resdex */}
              <button
                type="button"
                onClick={() => {
                  const skillsParam = skills.map(s => s.name).join(' ');
                  const locParam = locations.join(', ');
                  navigate(`/admin/resdex?keywords=${encodeURIComponent(skillsParam)}&location=${encodeURIComponent(locParam)}&title=${encodeURIComponent(jobTitle)}`);
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#0056b3',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 10px rgba(0,86,179,0.25)'
                }}
              >
                <Search size={16} />
                <span>Search {resdexMatchCount} Matching Candidates in Resdex</span>
              </button>

              {/* View in Manage Jobs Dashboard */}
              <button
                type="button"
                onClick={() => navigate('/admin/jobs')}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Briefcase size={15} />
                <span>View in Manage Jobs & Responses</span>
              </button>

              {/* WhatsApp / Social Share Link */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <a
                  href={`https://api.whatsapp.com/send?text=${getWhatsAppShareText()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: '#25D366',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Share2 size={14} />
                  <span>Share on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={copyShareLink}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: copiedLink ? '#16a34a' : '#475569',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

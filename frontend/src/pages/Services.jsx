import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { 
  Users, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  Target, 
  Briefcase,
  Clock,
  Award,
  PhoneCall,
  Sparkles,
  Building2,
  GraduationCap,
  Layers,
  Settings,
  Shield,
  HeartHandshake
} from 'lucide-react';

const servicesData = [
  {
    id: 'workforce-management',
    title: 'Workforce Management',
    image: '/images/workforce-management.jpg',
    badge: 'CORE SOLUTION 01',
    tagline: 'End-to-End Workforce Deployment, Staffing, Payroll & Workforce Administration',
    shortDesc: 'End-to-end workforce deployment, staffing, payroll and workforce administration for industrial and corporate enterprises.',
    overview: 'MCP Group delivers agile, audit-ready workforce management frameworks engineered for industrial manufacturing belts, supply chain corridors, and fast-scaling corporate hubs. From flexi-staffing ramp-ups for seasonal peaks to permanent technical staffing and nationwide statutory payroll execution, our workforce practice eliminates operational bottlenecks.',
    secondaryOverview: 'With a pan-India network of nearly 50,000 associates, we mobilize vetted shopfloor personnel, technical supervisors, and corporate back-office teams under strict Service Level Agreements (SLAs).',
    stats: [
      { label: 'Payroll & Compliance Accuracy', value: '100%' },
      { label: 'Turnaround Deployment SLA', value: '48-72 Hrs' },
      { label: 'Statutory Labor Audit Pass Rate', value: '100%' },
      { label: 'Active Associates Deployed', value: '50,000+' }
    ],
    subItems: [
      {
        name: 'Temporary & Contingent Staffing',
        desc: 'Flexible, high-caliber contingent workforce deployed across industrial plants, assembly lines, warehousing hubs, and corporate offices.',
        points: [
          'On-demand ramp-up from 50 to 1,000+ vetted shopfloor & clerical associates',
          'Complete statutory management (PF, ESIC, PT, Gratuity, Bonus, and Factories Act)',
          'Guaranteed attrition backfilling and dedicated on-site relationship coordinators'
        ]
      },
      {
        name: 'Payroll Management & Administration',
        desc: 'Zero-defect automated corporate payroll execution, statutory filing, and employee self-service management.',
        points: [
          'Automated monthly salary computation, tax withholdings, and instant bank disbursement',
          'Digitized employee self-service for payslips, PF passbooks, and Form 16',
          'Monthly statutory challan generation and comprehensive audit documentation'
        ]
      },
      {
        name: 'NAPS Apprenticeship Programs',
        desc: 'Turnkey operationalization of government-backed National Apprenticeship Promotion Scheme programs.',
        points: [
          'Candidate sourcing, portal registration, contract generation, and compliance',
          'Seamless stipend disbursement and quarterly reimbursement claims with NSDC',
          'Curriculum-aligned on-the-job training modules driving shopfloor productivity'
        ]
      },
      {
        name: 'On-Site Workforce Administration',
        desc: 'End-to-end personnel management, attendance logging, grievance resolution, and operational compliance at client premises.',
        points: [
          'Biometric and facial recognition attendance integration',
          'EHS and safety gear compliance enforcement on shopfloors',
          'Continuous performance monitoring and multi-shift supervisory coordination'
        ]
      }
    ]
  },
  {
    id: 'hr-services',
    title: 'Human Resource Services',
    image: '/images/about-intro-team.jpg',
    badge: 'CORE SOLUTION 02',
    tagline: 'Specialized Recruitment, Talent Acquisition, HR Support & Employee Management',
    shortDesc: 'Specialized recruitment, lateral talent acquisition, HR operational support and employee management.',
    overview: 'MCP Group’s Human Resource Services practice partners with organizations to identify, attract, and retain the right people. From specialized engineering and shopfloor supervisors to corporate managers and functional heads, we deliver structured recruitment with verified track records.',
    secondaryOverview: 'We also support organizations in establishing robust HR operational policies, employee lifecycle frameworks, and performance appraisal structures.',
    stats: [
      { label: 'Client Mandate Success Rate', value: '98%' },
      { label: 'Interview-to-Selection Ratio', value: '3:1' },
      { label: 'Talent Network Reach', value: 'Pan-India' },
      { label: 'Corporate Clients Served', value: '500+' }
    ],
    subItems: [
      {
        name: 'Lateral & Technical Recruitment',
        desc: 'Multi-tiered recruitment for core engineering, production, quality, maintenance, and technical plant functions.',
        points: [
          'Tooling specialists, CNC leads, QA/QC managers, and maintenance engineers',
          'Rigorous two-stage technical vetting and verified background check',
          'Fast-track delivery across manufacturing corridors nationwide'
        ]
      },
      {
        name: 'Mid-to-Senior & Executive Placements',
        desc: 'Appointing experienced functional leaders, Plant Heads, DGM/GM Operations, and business unit heads.',
        points: [
          'Confidential mapping of passive, high-performing industry leaders',
          'In-depth appraisal of past operational turnarounds and margin impact',
          'Structured onboarding support to ensure long-term retention'
        ]
      },
      {
        name: 'HR Policy & Operational Support',
        desc: 'Designing standardized human resource policies, employee handbooks, and compliance-ready operational frameworks.',
        points: [
          'Custom HR policy formulation aligned with state and central labor laws',
          'Standardized job descriptions, grading matrices, and compensation benchmarking',
          'Transparent grievance redressal and employee engagement mechanisms'
        ]
      }
    ]
  },
  {
    id: 'facility-management',
    title: 'Facility Management',
    image: '/images/facility-management.jpg',
    badge: 'CORE SOLUTION 03',
    tagline: 'Professional Facility, Housekeeping, Security Support & Operational Services',
    shortDesc: 'Professional facility, mechanized housekeeping, security support and operational services.',
    overview: 'Clean, safe, and well-managed premises are vital for industrial productivity and corporate reputation. MCP Group provides comprehensive soft and hard facility management services covering corporate offices, commercial campuses, and manufacturing factories.',
    secondaryOverview: 'Our trained facility personnel operate under strict hygiene, safety, and SLA protocols with mechanized cleaning tools and eco-friendly consumables.',
    stats: [
      { label: 'Premises Maintained', value: '15M+ Sq.Ft.' },
      { label: 'SLA Adherence Rate', value: '99.4%' },
      { label: 'Trained Facility Staff', value: '8,000+' },
      { label: 'Quality Standards', value: 'ISO 9001:2008' }
    ],
    subItems: [
      {
        name: 'Mechanized Industrial Housekeeping',
        desc: 'Advanced mechanized cleaning, sanitization, and waste management for factory shopfloors and cleanrooms.',
        points: [
          'Ride-on scrubbers, high-pressure washers, and industrial vacuum systems',
          'Strict compliance with pharma GMP and food processing hygiene norms',
          'Environmentally sustainable cleaning chemicals and consumables'
        ]
      },
      {
        name: 'Corporate Facility Management',
        desc: 'Front-office management, pantry services, mailroom logistics, and daily upkeep of corporate offices.',
        points: [
          'Trained pantry stewards, receptionists, and office support staff',
          'Vendor coordination, consumable inventory management, and hygiene audits',
          'Preventative maintenance of plumbing, electrical, and HVAC fixtures'
        ]
      },
      {
        name: 'Physical Security & Manned Guarding',
        desc: 'Vetted, disciplined security personnel, access control management, and premises surveillance.',
        points: [
          'Background-verified security guards, supervisors, and gate controllers',
          'Material in/out register maintenance and visitor pass management',
          'Emergency response drills, fire safety monitoring, and perimeter patrols'
        ]
      }
    ]
  },
  {
    id: 'bpo-solutions',
    title: 'BPO & Business Process Solutions',
    image: '/images/hero-split-office.jpg',
    badge: 'CORE SOLUTION 04',
    tagline: 'Scalable Business Process & Support Solutions Designed for Operational Efficiency',
    shortDesc: 'Scalable business process and support solutions designed for operational efficiency.',
    overview: 'MCP Group’s BPO practice provides scalable back-office and customer support solutions that allow organizations to streamline non-core operations, reduce fixed overheads, and improve service delivery.',
    secondaryOverview: 'Operating with modern IT infrastructure, data security protocols, and multi-lingual voice/chat capabilities, we help clients enhance operational responsiveness.',
    stats: [
      { label: 'First-Contact Resolution', value: '94%+' },
      { label: 'Data Accuracy Rate', value: '99.8%' },
      { label: 'Multi-Lingual Coverage', value: '8+ Languages' },
      { label: 'Uptime Availability', value: '99.9%' }
    ],
    subItems: [
      {
        name: 'Customer Support & Helpdesk',
        desc: 'Multi-channel customer engagement including inbound voice, email, chat, and ticketing support.',
        points: [
          '24/7 or shift-based customer service teams with customized call scripts',
          'Omnichannel CRM integration and real-time SLA tracking dashboards',
          'Quality assurance auditing, call calibration, and customer CSAT monitoring'
        ]
      },
      {
        name: 'Back-Office Data & Document Processing',
        desc: 'High-speed data entry, document verification, claims processing, and digital archiving.',
        points: [
          'KYC document verification, OCR digitization, and database deduplication',
          'Invoice processing, ledger reconciliation, and vendor voucher verification',
          'Strict information security, confidentiality, and data protection standards'
        ]
      }
    ]
  },
  {
    id: 'skill-development',
    title: 'Skill Development',
    image: '/images/skill-development.jpg',
    badge: 'CORE SOLUTION 05',
    tagline: 'Industry-Oriented Training & Skill Programs That Prepare People for Tomorrow’s Jobs',
    shortDesc: 'Industry-oriented training and skill development programs that prepare people for tomorrow’s jobs.',
    overview: 'India’s economic growth depends on a workforce equipped with modern, practical capabilities. MCP Group conducts structured skill development initiatives aligned with National Skill Development Corporation (NSDC) and sector skill council standards.',
    secondaryOverview: 'We collaborate with state governments, corporate CSR initiatives, and industrial clusters to transform youth into job-ready professionals.',
    stats: [
      { label: 'Candidates Trained', value: '35,000+' },
      { label: 'Post-Training Placement', value: '82%+' },
      { label: 'Training Centers Operated', value: '25+' },
      { label: 'Industry Sectors Covered', value: '12+' }
    ],
    subItems: [
      {
        name: 'Vocational & Technical Training',
        desc: 'Hands-on training in machine operation, CNC basics, automotive assembly, welding, and electrical systems.',
        points: [
          'Curricula developed in consultation with industrial plant supervisors',
          'Modern equipment labs simulating actual manufacturing environments',
          'Certifications aligned with National Skills Qualifications Framework (NSQF)'
        ]
      },
      {
        name: 'Corporate CSR Skill Initiatives',
        desc: 'Executing turnkey skill development and livelihood generation projects for corporate CSR programs.',
        points: [
          'Mobilization of candidates from rural and underserved communities',
          'End-to-end training delivery, assessment, and wage-linked placement',
          'Transparent impact assessment reports and audit-ready documentation'
        ]
      }
    ]
  },
  {
    id: 'education',
    title: 'Education Solutions',
    image: '/images/hospitality.jpg',
    badge: 'CORE SOLUTION 06',
    tagline: 'Workforce & Education Solutions Focused on Employability, Skills & Future Readiness',
    shortDesc: 'Workforce and education solutions focused on employability, skills and future readiness.',
    overview: 'Bridging the divide between academic degree programs and real-world workplace requirements. MCP Group partners with colleges, universities, and polytechnics to enhance student employability through experiential learning and industry apprenticeships.',
    secondaryOverview: 'We empower educational institutions with job-market insights, guest faculty from industry, and campus placement drives.',
    stats: [
      { label: 'Educational Partners', value: '40+' },
      { label: 'Students Upskilled', value: '20,000+' },
      { label: 'Campus Drives Organized', value: '150+' },
      { label: 'Corporate Hiring Partners', value: '500+' }
    ],
    subItems: [
      {
        name: 'Campus-to-Corporate Employability',
        desc: 'Structured modules covering professional communication, workplace etiquette, digital literacy, and interview prep.',
        points: [
          'Interactive behavioral training designed to build workplace confidence',
          'Mock technical interviews and aptitude assessment frameworks',
          'Direct access to recruitment drives across MCP’s 500+ client network'
        ]
      },
      {
        name: 'Institutional Apprenticeship Partnerships',
        desc: 'Integrating NAPS/NATS apprenticeships into college final-semester curricula for immediate job placement.',
        points: [
          'Government stipend support integration for graduating students',
          'Practical shopfloor and office immersion with verified enterprises',
          'High conversion rate of apprentices into permanent employee roles'
        ]
      }
    ]
  },
  {
    id: 'compliance-management',
    title: 'Compliance Management',
    image: '/images/power-sector.jpg',
    badge: 'CORE SOLUTION 07',
    tagline: 'Structured, Process-Driven Solutions Helping Organizations Meet Statutory & Regulatory Requirements',
    shortDesc: 'Structured, process-driven solutions helping organizations meet statutory and regulatory requirements.',
    overview: 'Operating in India requires rigorous adherence to multi-state labor laws, statutory acts, and regulatory filings. MCP Group’s compliance practice delivers comprehensive statutory audits, registration management, and monthly filings.',
    secondaryOverview: 'As an ISO 9001:2008 certified organization, we protect employers from statutory penalties, factory inspectorate notices, and legal vulnerabilities.',
    stats: [
      { label: 'Statutory Compliance Record', value: '100%' },
      { label: 'Audits Passed Without Penalty', value: '500+' },
      { label: 'State Labor Acts Covered', value: 'All 28 States' },
      { label: 'Quality Certification', value: 'ISO 9001:2008' }
    ],
    subItems: [
      {
        name: 'PF, ESIC & Statutory Returns',
        desc: 'End-to-end execution of Provident Fund, ESIC, Professional Tax, and Labor Welfare Fund monthly filings.',
        points: [
          'Timely monthly challan generation and verified electronic remittance',
          'Resolution of employee UAN, claim settlements, and transfer grievances',
          'Preparation of annual and half-yearly statutory returns'
        ]
      },
      {
        name: 'Factories Act & Contract Labor (CLRA) Licenses',
        desc: 'Procurement, renewal, and management of Contract Labour Regulation & Abolition (CLRA) licenses.',
        points: [
          'Principal Employer registration certificates (Form I) and contractor licenses',
          'Maintenance of mandatory statutory registers (Form XII, XIII, XIV, XVI, XVII)',
          'Representation and assistance during labor department and statutory inspections'
        ]
      },
      {
        name: 'Comprehensive Labor Compliance Audits',
        desc: 'Third-party forensic audits evaluating existing contractor compliance and statutory risk exposure.',
        points: [
          'Detailed gap analysis across minimum wages, overtime, and working hours',
          'Contractor audit scorecards and corrective action plans (CAP)',
          'Executive management summary safeguarding board of directors from liability'
        ]
      }
    ]
  }
];

export default function Services() {
  const { serviceId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine which service is selected (from URL param, search query, or hash)
  const queryService = searchParams.get('service');
  const hashId = location.hash.replace('#', '');
  
  const rawId = serviceId || queryService || (hashId && servicesData.some(s => s.id === hashId) ? hashId : null);
  const activeService = servicesData.find(s => s.id === rawId) || null;

  // Scroll to top when switching view or service
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [rawId]);

  // Handler to switch to a specific service
  const handleSelectService = (id) => {
    setSearchParams({ service: id });
  };

  // Handler to view all services
  const handleBackToAll = () => {
    setSearchParams({});
    navigate('/services');
  };

  return (
    <div className="services-page">
      
      {/* =========================================================================
          VIEW A: SPECIFIC SERVICE DETAIL (When a service is clicked)
          ========================================================================= */}
      {activeService ? (
        <div className="specific-service-view" id="service-detail-view">
          
          {/* Top Service Navigation & Breadcrumb Bar */}
          <section className="service-nav-bar" style={{ backgroundColor: '#071120', padding: '24px 0', borderBottom: '1px solid rgba(196,154,69,0.25)' }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div className="breadcrumbs" style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>
                  <Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Home</Link>
                  <span className="divider" style={{ margin: '0 8px' }}>&rsaquo;</span>
                  <button 
                    onClick={handleBackToAll}
                    style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 0, font: 'inherit' }}
                  >
                    Our Services
                  </button>
                  <span className="divider" style={{ margin: '0 8px' }}>&rsaquo;</span>
                  <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{activeService.title}</span>
                </div>

                <button 
                  onClick={handleBackToAll}
                  className="btn-back-services"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '8px 18px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ArrowLeft size={15} />
                  <span>All Solutions</span>
                </button>
              </div>

              {/* Service Switcher Tabs */}
              <div className="service-pill-tabs" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
                {servicesData.map((svc) => (
                  <button
                    key={svc.id}
                    onClick={() => handleSelectService(svc.id)}
                    style={{
                      background: svc.id === activeService.id ? 'var(--color-accent)' : 'rgba(255,255,255,0.06)',
                      color: svc.id === activeService.id ? '#071120' : '#cbd5e1',
                      border: svc.id === activeService.id ? '1px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.12)',
                      padding: '7px 16px',
                      borderRadius: '20px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {svc.title}
                  </button>
                ))}
              </div>

            </div>
          </section>

          {/* Specific Service Hero */}
          <section style={{ backgroundColor: '#ffffff', padding: '60px 0 40px', borderBottom: '1px solid #e2e8f0' }}>
            <div className="container">
              
              <div style={{ maxWidth: '900px', margin: '0 auto 40px', textAlign: 'center' }}>
                <span className="section-tag" style={{ marginBottom: '12px', display: 'inline-block' }}>
                  {activeService.badge}
                </span>
                <h1 style={{ fontSize: '38px', color: 'var(--color-primary)', fontWeight: '800', margin: '8px 0 16px', letterSpacing: '-0.5px' }}>
                  {activeService.title}
                </h1>
                <p style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-primary)', marginBottom: '20px', lineHeight: '1.4' }}>
                  {activeService.tagline}
                </p>
                <p style={{ fontSize: '15.5px', color: '#64748b', lineHeight: '1.8', margin: '0 0 14px' }}>
                  {activeService.overview}
                </p>
                <p style={{ fontSize: '14.5px', color: '#64748b', lineHeight: '1.7', margin: 0 }}>
                  {activeService.secondaryOverview}
                </p>
              </div>

              {/* Large Feature Banner */}
              <div style={{ 
                borderRadius: '10px', 
                overflow: 'hidden', 
                maxHeight: '440px', 
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)', 
                marginBottom: '50px' 
              }}>
                <img 
                  src={activeService.image} 
                  alt={activeService.title} 
                  style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
                />
              </div>

              {/* Metrics Bar */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '20px', 
                marginBottom: '40px' 
              }}>
                {activeService.stats.map((stat, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      background: '#f8fafc', 
                      padding: '24px 20px', 
                      borderRadius: '8px', 
                      border: '1px solid #e2e8f0', 
                      textAlign: 'center' 
                    }}
                  >
                    <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--color-accent)', marginBottom: '6px' }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* Key Capabilities for this Specific Service */}
          <section style={{ padding: '70px 0', backgroundColor: '#f1f6fb' }}>
            <div className="container">
              
              <div className="section-header text-center" style={{ maxWidth: '800px', margin: '0 auto 48px' }}>
                <span className="section-tag">SOLUTION CAPABILITIES</span>
                <h2 className="section-title">Core Service Deliverables</h2>
                <p className="section-desc">
                  Detailed breakdown of capabilities, deliverables, and operational execution under {activeService.title}.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
                {activeService.subItems.map((item, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      background: '#ffffff', 
                      borderRadius: '8px', 
                      padding: '32px 28px', 
                      border: '1px solid #e1ebf4', 
                      boxShadow: '0 4px 15px rgba(0,43,102,0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <span style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          background: 'rgba(212, 175, 55, 0.15)', 
                          color: 'var(--color-accent)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontWeight: '800', 
                          fontSize: '13px' 
                        }}>
                          0{idx + 1}
                        </span>
                        <CheckCircle2 size={18} color="var(--color-accent)" />
                      </div>

                      <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '10px' }}>
                        {item.name}
                      </h3>
                      
                      <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.65', marginBottom: '20px' }}>
                        {item.desc}
                      </p>

                      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', fontSize: '13px', lineHeight: '1.8' }}>
                        {item.points.map((pt, pIdx) => (
                          <li key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px', color: '#334155' }}>
                            <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link 
                      to={`/contact?service=${encodeURIComponent(item.name)}`}
                      className="btn-service-readmore"
                      style={{ alignSelf: 'flex-start', marginTop: '10px', fontSize: '13px', padding: '7px 18px' }}
                    >
                      Enquire On This
                    </Link>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* Action Callout Box */}
          <section style={{ backgroundColor: '#ffffff', padding: '60px 0' }}>
            <div className="container">
              <div style={{ 
                background: 'linear-gradient(135deg, #071120 0%, #0d264a 100%)', 
                borderRadius: '12px', 
                padding: '48px 40px', 
                color: '#ffffff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                flexWrap: 'wrap', 
                gap: '24px',
                boxShadow: '0 12px 30px rgba(7, 17, 32, 0.2)'
              }}>
                <div style={{ maxWidth: '650px' }}>
                  <span style={{ color: 'var(--color-accent)', fontSize: '12px', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                    PARTNER WITH MCP GROUP
                  </span>
                  <h3 style={{ fontSize: '26px', color: '#ffffff', fontWeight: '800', margin: '8px 0 10px' }}>
                    Need customized support in {activeService.title}?
                  </h3>
                  <p style={{ fontSize: '14.5px', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                    Our sector leads are ready to structure tailored staffing, compliance, facility, or workforce solutions within your timelines.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <Link to="/contact" className="btn btn-primary" style={{ padding: '12px 26px', fontSize: '14px' }}>
                    <span>Get In Touch</span>
                    <ArrowRight size={15} />
                  </Link>
                  <button 
                    onClick={handleBackToAll}
                    style={{
                      background: 'transparent',
                      color: '#ffffff',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '4px',
                      padding: '12px 22px',
                      fontSize: '13.5px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    View All Solutions
                  </button>
                </div>
              </div>
            </div>
          </section>

        </div>
      ) : (

        /* =========================================================================
            VIEW B: ALL SERVICES 7-CARD GRID (Section 04: What We Do)
            ========================================================================= */
        <div className="all-services-view">
          
          {/* Page Hero */}
          <section className="page-hero">
            <div className="container">
              <div className="breadcrumbs">
                <Link to="/">Home</Link>
                <span className="divider">&rsaquo;</span>
                <span>Our Services</span>
              </div>
              <span className="section-tag" style={{ color: 'var(--color-accent)', display: 'block', marginBottom: '8px' }}>
                WHAT WE DO
              </span>
              <h1 className="page-hero-title">One Group. Multiple Solutions. One Standard of Excellence.</h1>
              <p className="page-hero-subtitle">
                MCP Group offers an integrated portfolio of workforce and business solutions designed around the evolving needs of modern organizations across India.
              </p>
            </div>
          </section>

          {/* 7-Card Services Grid */}
          <section className="our-services-home-section" style={{ backgroundColor: '#ffffff', padding: '80px 0' }}>
            <div className="container">
              
              <div className="our-services-home-header">
                <span className="section-tag" style={{ color: 'var(--color-accent)' }}>INTEGRATED WORKFORCE PORTFOLIO</span>
                <h2 className="our-services-home-title">Our Core Solution Verticals</h2>
                <p style={{ color: '#64748b', maxWidth: '750px', margin: '12px auto 0', fontSize: '15px' }}>
                  Click on any service to explore detailed practice capabilities, operational SLAs, and case deliverables.
                </p>
              </div>

              <div className="our-services-home-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
                {servicesData.map((service) => (
                  <div key={service.id} className="service-photo-card">
                    <div className="service-photo-card-img-wrap">
                      <img 
                        src={service.image} 
                        alt={service.title} 
                        className="service-photo-card-img" 
                        loading="lazy"
                      />
                    </div>
                    <div className="service-photo-card-body">
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-accent)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        {service.badge}
                      </span>
                      <h3 className="service-photo-card-title" style={{ marginTop: '4px' }}>{service.title}</h3>
                      <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.5, margin: '8px 0 16px 0' }}>
                        {service.shortDesc}
                      </p>
                      <button 
                        onClick={() => handleSelectService(service.id)}
                        className="btn-service-readmore"
                      >
                        <span>Explore Capabilities</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* The MCP Delivery & Compliance Architecture */}
          <section style={{ backgroundColor: '#f3f7fb', padding: '80px 0', borderTop: '1px solid #e2e8f0' }}>
            <div className="container">
              <div className="section-header text-center">
                <span className="section-tag">DELIVERY EXCELLENCE</span>
                <h2 className="section-title">The 4-Stage Workforce Architecture</h2>
                <p className="section-subtitle">A disciplined, compliance-first framework ensuring reliable, scalable execution</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginTop: '40px' }}>
                <div style={{ background: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: 'var(--color-accent)', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>01</div>
                  <h3 style={{ fontSize: '18px', marginBottom: '10px', color: 'var(--color-primary)' }}>Assessment &amp; Scope</h3>
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>Understanding job descriptions, plant shift timings, statutory wage rules, and SLA requirements.</p>
                </div>
                <div style={{ background: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: 'var(--color-accent)', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>02</div>
                  <h3 style={{ fontSize: '18px', marginBottom: '10px', color: 'var(--color-primary)' }}>Mobilization &amp; Vetting</h3>
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>Screening candidates across our 50,000+ talent network with police and identity checks.</p>
                </div>
                <div style={{ background: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: 'var(--color-accent)', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>03</div>
                  <h3 style={{ fontSize: '18px', marginBottom: '10px', color: 'var(--color-primary)' }}>Statutory Onboarding</h3>
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>100% PF/ESIC enrollment, safety gear distribution, appointment documentation, and EHS briefing.</p>
                </div>
                <div style={{ background: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: 'var(--color-accent)', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>04</div>
                  <h3 style={{ fontSize: '18px', marginBottom: '10px', color: 'var(--color-primary)' }}>On-Site SLA Stewardship</h3>
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>Dedicated relationship coordinators, biometric attendance, instant payroll, and monthly compliance audit logs.</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      )}

    </div>
  );
}

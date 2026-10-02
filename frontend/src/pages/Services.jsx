import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { 
  Users, 
  Zap, 
  ShoppingBag, 
  Coffee, 
  GraduationCap, 
  Building, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  Target, 
  Briefcase,
  Clock,
  Award,
  PhoneCall,
  Sparkles
} from 'lucide-react';

const servicesData = [
  {
    id: 'workforce-management',
    title: 'Workforce Management',
    image: '/images/workforce-management.jpg',
    badge: 'TALENT & CONTINGENT WORKFORCE',
    tagline: 'End-to-End Contingent Staffing, Multi-Tier Recruitment & Regulatory Compliance',
    shortDesc: 'Flexible, high-caliber contingent staffing deployed across manufacturing plants, warehousing hubs, and corporate offices with 100% labor law compliance.',
    overview: 'MCP Consultants delivers agile, audit-ready workforce management frameworks engineered for industrial enterprises, manufacturing corridors, and fast-scaling corporate hubs. From flexi-staffing ramp-ups for seasonal peaks to permanent technical recruitment and nationwide statutory payroll execution, our workforce practice eliminates operational bottlenecks while safeguarding clients against regulatory exposure.',
    secondaryOverview: 'With deep talent pipelines across Tier-1, Tier-2, and industrial belt locations, we support fast ramp-ups of shopfloor personnel, technical supervisors, and corporate back-office teams under strict Service Level Agreements (SLAs).',
    stats: [
      { label: 'Payroll & Compliance Accuracy', value: '99.98%' },
      { label: 'Turnaround Deployment SLA', value: '48-72 Hrs' },
      { label: 'Statutory Labor Audit Pass Rate', value: '100%' },
      { label: 'Active Talent Pipeline', value: '50,000+' }
    ],
    subItems: [
      {
        name: 'Temporary Staffing Solution',
        desc: 'Flexible, high-caliber contingent workforce deployed across industrial plants, assembly lines, warehousing hubs, and corporate back-offices.',
        points: [
          'On-demand ramp-up from 50 to 1,000+ vetted shopfloor & clerical associates',
          'Complete statutory management (PF, ESIC, PT, Gratuity, Bonus, and Factories Act)',
          'Guaranteed attrition backfilling and dedicated on-site relationship coordinators'
        ]
      },
      {
        name: 'Recruitment (IT & Non-IT)',
        desc: 'Multi-tiered lateral talent acquisition spanning cutting-edge software engineering, plant automation, and core manufacturing functions.',
        points: [
          'IT: Cloud architects, full-stack engineers, cybersecurity, and data analysts',
          'Non-IT: Plant heads, maintenance engineers, supply chain leads, and quality auditors',
          'Rigorous two-stage technical vetting and verified background reference verification'
        ]
      },
      {
        name: 'NAPS (National Apprenticeship Promotion Scheme)',
        desc: 'Turnkey operationalization of government-backed apprenticeship programs to build a resilient, highly trained grassroots talent pipeline.',
        points: [
          'Candidate sourcing, portal registration, contract generation, and compliance',
          'Seamless stipend disbursement and quarterly reimbursement claims with NSDC/RDSDE',
          'Curriculum-aligned on-the-job training modules driving shopfloor productivity'
        ]
      },
      {
        name: 'Payroll Management & Compliance',
        desc: 'Zero-defect corporate payroll execution, statutory filing, and employee self-service management for workforces of any scale.',
        points: [
          'Automated monthly salary computation, tax withholdings, and instant bank disbursement',
          'Digitized employee self-service (ESS) portal for payslips, tax declarations, and Form 16',
          'Monthly statutory challan generation and comprehensive audit documentation'
        ]
      }
    ]
  },
  {
    id: 'power-sector',
    title: 'Power Sector',
    image: '/images/power-sector.jpg',
    badge: 'ENERGY & INFRASTRUCTURE',
    tagline: 'High-Voltage Transmission, Substation Engineering, Utilities & Clean Renewables',
    shortDesc: 'Specialized talent and engineering leadership for transmission lines, utility-scale solar/wind, smart grid modernization, and plant operations.',
    overview: 'India’s rapid industrial expansion and clean energy transition demand specialized engineering acuity. MCP Consultants’ Power Sector practice partners with leading generation utilities, transmission concessionaires, and clean energy developers to build battle-tested engineering, commissioning, and operational teams across conventional and renewable energy frontiers.',
    secondaryOverview: 'Whether mobilizing project directors for 765kV greenfield substations or sourcing battery energy storage (BESS) specialists, we deliver professionals with verified track records in heavy capital project execution.',
    stats: [
      { label: 'Transmission Line Commissioning', value: '400kV & 765kV' },
      { label: 'Renewable Portfolios Supported', value: '15+ GW' },
      { label: 'Plant Availability Track Record', value: '99.5%+' },
      { label: 'Specialized Technical Database', value: '12,000+' }
    ],
    subItems: [
      {
        name: 'Transmission & Distribution (T&D)',
        desc: 'Turnkey project directors and technical leads for high-voltage transmission lines, tower erection, and grid interconnects.',
        points: [
          '765kV / 400kV / 220kV GIS and AIS substation project managers and commissioning leads',
          'Overhead transmission line EPC leads and Right-of-Way (RoW) clearance specialists',
          'System protection, relay coordination, and SCADA automation engineers'
        ]
      },
      {
        name: 'Renewable Energy EPC (Solar, Wind & BESS)',
        desc: 'Comprehensive engineering, procurement, and construction staffing for utility-scale solar, wind farms, and hybrid storage systems.',
        points: [
          'Solar PV plant design leads, balance-of-plant (BOP) managers, and tracker specialists',
          'Wind turbine generator (WTG) installation heads and microgrid integration leads',
          'Battery Energy Storage System (BESS) containerization and power conversion engineers'
        ]
      },
      {
        name: 'Plant Operations & Maintenance (O&M)',
        desc: 'Round-the-clock plant leadership ensuring maximum commercial availability and stringent heat rate/efficiency standards.',
        points: [
          'Station directors and shift-charge engineers ensuring continuous 99.5%+ uptime',
          'Certified vibration analysts, thermographers, and preventative maintenance crews',
          'EHS compliance, factory inspectorate clearances, and environmental monitoring'
        ]
      },
      {
        name: 'Grid Modernization & Smart Metering',
        desc: 'Digital transformation leaders upgrading India’s distribution network with IoT and automated metering infrastructure.',
        points: [
          'Advanced Metering Infrastructure (AMI) and Smart Meter deployment project leads',
          'Meter Data Management (MDM) architects and cloud IoT integration specialists',
          'PPA negotiation, tariff petition, and regulatory compliance advisory'
        ]
      }
    ]
  },
  {
    id: 'retail-ev',
    title: 'Retail & EV',
    image: '/images/retail-ev.jpg',
    badge: 'CONSUMER COMMERCE & GREEN MOBILITY',
    tagline: 'Modern Retail Operations, Omnichannel Logistics & Electric Vehicle Powertrain Tech',
    shortDesc: 'Powering India’s hyper-growth consumer retail sectors and next-generation electric mobility ecosystems with specialized leadership and operational teams.',
    overview: 'Bridging the twin engines of modern commerce and green mobility. We provide specialized talent solutions for India’s tier-1 retail conglomerates and next-generation electric vehicle manufacturers, covering everything from high-footfall hypermarket operations to advanced battery management systems (BMS).',
    secondaryOverview: 'Our Retail & EV practice understands the distinct operational tempo of fast-moving consumer sectors and the deep technical specifications required for automotive electrification.',
    stats: [
      { label: 'Retail Stores Staffed', value: '1,200+' },
      { label: 'EV Tech Patents Represented', value: '45+' },
      { label: 'FMCG Fill-Rate Optimization', value: '98.5%' },
      { label: 'Automotive Engineers Mapped', value: '18,000+' }
    ],
    subItems: [
      {
        name: 'Hypermarket & Supermarket Retail Operations',
        desc: 'Store leadership, visual merchandising, and front-line operations teams driving footfall conversion and customer loyalty.',
        points: [
          'Store General Managers, Department Heads, and Regional Operations Directors',
          'Inventory control, shrinkage prevention, and high-velocity stock turn managers',
          'Cashiering, customer desk staff, and visual merchandising specialists'
        ]
      },
      {
        name: 'Electric Vehicle (EV) Engineering',
        desc: 'Pioneering automotive talent for electric two-wheelers, three-wheelers, commercial buses, and passenger EVs.',
        points: [
          'PMSM motor design, inverter hardware engineers, and powertrain simulation experts',
          'Battery Management Systems (BMS): Cell testing, thermal management, and firmware',
          'Vehicle homologation, ARAI/ICAT certification, and functional safety (ISO 26262)'
        ]
      },
      {
        name: 'Omnichannel & Cold Chain Logistics',
        desc: 'Supply chain architects, dark store networks, and temperature-controlled logistics for grocery and perishable goods.',
        points: [
          'Fulfillment center operations heads and micro-warehouse network managers',
          'Cold-chain fleet controllers, temperature datalogger auditors, and route optimizers',
          'ERP/WMS integration specialists reducing warehouse order turnaround time'
        ]
      },
      {
        name: 'EV Charging Infrastructure & Networks',
        desc: 'Turnkey project deployment leads for public fast-charging corridors and commercial fleet depot charging hubs.',
        points: [
          'Site acquisition managers and commercial host agreement negotiators',
          'DC fast-charger electrical commissioning leads and grid tie-in specialists',
          'Cloud CMS (Charge Point Management System) software developers and NOC operators'
        ]
      }
    ]
  },
  {
    id: 'hospitality',
    title: 'Hospitality',
    image: '/images/hospitality.jpg',
    badge: 'LUXURY & SERVICE STEWARDSHIP',
    tagline: 'Elite Hotel Operations, Banqueting & MICE, Culinary Leadership & Executive Dining',
    shortDesc: 'Delivering exceptional leadership and operational staff for luxury hotel brands, boutique resorts, corporate dining, and fine-dining banqueting.',
    overview: 'In luxury hospitality, brand equity is defined entirely by human delivery. MCP Consultants represents luxury hotel chains, boutique heritage resorts, corporate dining facilities, and convention centers, sourcing exceptional leadership and front-line service professionals who turn every guest touchpoint into an unforgettable experience.',
    secondaryOverview: 'From five-star General Managers who command P&L profitability to master executive chefs and banquet coordinators, we understand the subtle art of luxury service execution.',
    stats: [
      { label: '5-Star Hospitality Placements', value: '3,500+' },
      { label: 'Guest Satisfaction Index', value: '99.2%' },
      { label: 'Mega-Event Banqueting Staffed', value: '500+' },
      { label: 'Culinary Specialists Network', value: '8,000+' }
    ],
    subItems: [
      {
        name: 'Luxury Hotel & Resort General Management',
        desc: 'Visionary General Managers and Operations Heads with proven records in RevPAR optimization and five-star brand standards.',
        points: [
          'General Managers commanding full P&L, ADR growth, and asset enhancement',
          'Resident Managers, Front Office Directors, and Executive Housekeepers',
          'Concierge teams trained in Les Clefs d’Or international luxury hospitality standards'
        ]
      },
      {
        name: 'Banqueting, MICE & Event Stewardship',
        desc: 'Event directors and convention banquet leaders orchestrating high-volume destination weddings, summits, and corporate galas.',
        points: [
          'Banquet sales directors, catering coordinators, and protocol managers',
          'High-volume event staffing with immaculate grooming and synchronized service',
          'Audio-visual staging, seating layout optimization, and guest movement logistics'
        ]
      },
      {
        name: 'Executive Dining & Corporate Hospitality',
        desc: 'Bespoke corporate guest house management, boardroom dining, and VIP executive lounge stewardship.',
        points: [
          'Executive corporate chefs curating tailored healthy and gourmet executive menus',
          'Corporate dining room supervisors ensuring prompt, discreet executive service',
          'Full-service facility stewardship for promoter villas and corporate guest retreats'
        ]
      },
      {
        name: 'Food & Beverage Operations Excellence',
        desc: 'Multi-outlet F&B directors managing menu engineering, beverage curation, food hygiene audits, and high operating margins.',
        points: [
          'F&B Directors controlling food cost percentages while elevating culinary presentation',
          'Sommeliers, mixologists, and specialty restaurant head chefs',
          'Strict adherence to HACCP, FSSAI, and global food safety hygiene protocols'
        ]
      }
    ]
  },
  {
    id: 'skill-development',
    title: 'Skill Development & Education',
    image: '/images/skill-development.jpg',
    badge: 'LEARNING & INDUSTRIAL READINESS',
    tagline: 'Corporate Leadership Coaching, Shopfloor Upskilling & Institutional Capacity Building',
    shortDesc: 'Bridging the industrial employability gap through certified skill enhancement programs, executive coaching, and vocational initiatives.',
    overview: 'Bridging the divide between academic output and shopfloor readiness. Our Skill Development & Education practice develops and executes targeted corporate training, technical certifications, apprenticeship programs, and campus-to-corporate bridge curricula for Indian enterprises.',
    secondaryOverview: 'We empower manufacturing clusters and service organizations to upskill their human capital, reduce machine downtime, and cultivate future leaders from within.',
    stats: [
      { label: 'Professionals Trained', value: '40,000+' },
      { label: 'Curriculum Modules Benchmarked', value: '120+' },
      { label: 'Shopfloor Productivity Gain', value: '+24%' },
      { label: 'Placement Conversion Rate', value: '88%' }
    ],
    subItems: [
      {
        name: 'Corporate Leadership & Executive Coaching',
        desc: 'Tailored management development programs (MDP) and executive mentoring for first-time managers through C-suite officers.',
        points: [
          '1-on-1 executive coaching on boardroom presence, strategic vision, and conflict resolution',
          'High-potential (HiPo) leadership accelerator bootcamps for senior managers',
          'Change management and cross-functional team alignment workshops'
        ]
      },
      {
        name: 'Technical & Shopfloor Skill Enhancement',
        desc: 'Hands-on CNC, robotics, PLC automation, and safety (OSHA) certifications for modern manufacturing shopfloors.',
        points: [
          'Hands-on training in 5-axis CNC machining, precision welding, and tooling setup',
          'Industrial IoT, PLC/SCADA programming, and automated robotics maintenance',
          'Six Sigma Green/Black Belt, Lean Manufacturing, and 5S workplace audits'
        ]
      },
      {
        name: 'Campus-to-Corporate Readiness Programs',
        desc: 'Industry-integrated bridge curricula, finishing schools, and communication bootcamps for engineering and management graduates.',
        points: [
          'Finishing school modules covering corporate etiquette, business writing, and client facing',
          'Aptitude, logical reasoning, and technical interview preparation pipelines',
          'Industry mock projects evaluated by practicing corporate directors'
        ]
      },
      {
        name: 'Government & CSR Skill Initiatives',
        desc: 'Turnkey execution of PMKVY, DDU-GKY, and CSR-funded vocational training programs with verified placement tracking.',
        points: [
          'Accredited vocational center setup, lab equipment mobilization, and mobilization drives',
          'Assessment coordination with sector skill councils (SSCs) and certified diplomas',
          'Direct industry placement tie-ups with regional manufacturing clusters'
        ]
      }
    ]
  },
  {
    id: 'facility-management',
    title: 'Facility Management & BPO',
    image: '/images/facility-management.jpg',
    badge: 'WORKPLACE INFRASTRUCTURE & SHARED SERVICES',
    tagline: 'Integrated Facility Management (IFM), Business Process Outsourcing & Workplace Infrastructure',
    shortDesc: 'Comprehensive property upkeep, mechanical/electrical maintenance, corporate administrative support, and front-line contact center operations.',
    overview: 'Operational resilience relies on flawless day-to-day facility administration and customer support infrastructure. MCP Consultants delivers single-source Integrated Facility Management (IFM) and high-touch BPO operations for corporate campuses, IT parks, data centers, and multi-location retail chains.',
    secondaryOverview: 'We maintain uptime across critical electrical, HVAC, and data infrastructure while delivering scalable customer support solutions that protect corporate brand equity.',
    stats: [
      { label: 'Commercial Sq. Ft. Managed', value: '18M+' },
      { label: 'Critical Infrastructure Uptime', value: '99.99%' },
      { label: 'Customer Query Resolution SLA', value: '< 2 Hrs' },
      { label: 'Trained Facility Personnel', value: '15,000+' }
    ],
    subItems: [
      {
        name: 'Integrated Facility Management (IFM)',
        desc: 'Single-source stewardship of corporate campuses, IT parks, and factories covering MEP, HVAC, cleaning, and green initiatives.',
        points: [
          'Hard Services: 24/7 preventative maintenance of chillers, DG sets, and UPS systems',
          'Soft Services: Mechanized housekeeping, sanitization, facade cleaning, and waste management',
          'Energy audits, IoT sensor tracking, and LEED / ESG compliance reporting'
        ]
      },
      {
        name: 'Business Process Outsourcing (BPO)',
        desc: 'Scalable domestic and international customer care teams, back-office data processing, and technical support desks.',
        points: [
          'Multilingual omnichannel customer care (Voice, Email, Chat, and WhatsApp)',
          'Technical helpdesks with automated ticketing and Level 1/2 troubleshooting',
          'High-volume back-office processing, KYC verification, and document indexing'
        ]
      },
      {
        name: 'Corporate Security & Surveillance',
        desc: 'Trained manned security guards, CCTV surveillance command center operators, and executive protection personnel.',
        points: [
          'Licensed security guards, gatehouse management, and automated visitor tracking',
          'Centralized CCTV surveillance monitoring and rapid incident response protocols',
          'Comprehensive fire safety drills, emergency evacuation planning, and perimeter control'
        ]
      },
      {
        name: 'Environment, Health & Safety (EHS) Compliance',
        desc: 'Audited workplace sanitation, fire safety compliance, waste management, and LEED / ESG green building governance.',
        points: [
          'Statutory workplace safety audits, pollution control clearances, and hazardous waste disposal',
          'Indoor air quality monitoring, ergonomics assessments, and occupational health clinics',
          'Zero-accident safety culture implementation and regular mock emergency drills'
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
                  <span>All Services</span>
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
                <h1 style={{ fontSize: '38px', color: '#0b5cab', fontWeight: '800', margin: '8px 0 16px', letterSpacing: '-0.5px' }}>
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
                boxShadow: '0 12px 35px rgba(0,0,0,0.12)', 
                maxHeight: '440px',
                position: 'relative' 
              }}>
                <img 
                  src={activeService.image} 
                  alt={activeService.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: '440px', display: 'block' }}
                />
              </div>

              {/* Key Statistics Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '20px', 
                marginTop: '36px' 
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
                    <div style={{ fontSize: '28px', fontWeight: '800', color: '#0b5cab', marginBottom: '6px' }}>
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

          {/* Key Practice Pillars for this Specific Service */}
          <section style={{ padding: '70px 0', backgroundColor: '#f1f6fb' }}>
            <div className="container">
              
              <div className="section-header text-center" style={{ maxWidth: '800px', margin: '0 auto 48px' }}>
                <span className="section-tag">PRACTICE CAPABILITIES</span>
                <h2 className="section-title">Core Service Offerings</h2>
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
                          background: 'rgba(11,92,171,0.1)', 
                          color: '#0b5cab', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontWeight: '800', 
                          fontSize: '13px' 
                        }}>
                          0{idx + 1}
                        </span>
                        <CheckCircle2 size={18} color="#0b5cab" />
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
                    PARTNER WITH MCP
                  </span>
                  <h3 style={{ fontSize: '26px', color: '#ffffff', fontWeight: '800', margin: '8px 0 10px' }}>
                    Need customized support in {activeService.title}?
                  </h3>
                  <p style={{ fontSize: '14.5px', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                    Our sector leads are ready to structure tailored staffing, compliance, or technical talent solutions within your timelines.
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
                    View All Services
                  </button>
                </div>
              </div>
            </div>
          </section>

        </div>
      ) : (

        /* =========================================================================
            VIEW B: ALL SERVICES 6-CARD GRID (Matching Reference Screenshot)
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
              <h1 className="page-hero-title">Our Services &amp; Practice Capabilities</h1>
              <p className="page-hero-subtitle">
                Delivering workforce management, sectoral recruitment, technical staffing, and leadership advisory across India's fastest-growing industries.
              </p>
            </div>
          </section>

          {/* 6-Card Services Grid (Matching Reference Screenshot) */}
          <section className="our-services-home-section" style={{ backgroundColor: '#ffffff' }}>
            <div className="container">
              
              <div className="our-services-home-header">
                <h2 className="our-services-home-title">Our Services</h2>
              </div>

              <div className="our-services-home-grid">
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
                      <h3 className="service-photo-card-title">{service.title}</h3>
                      <button 
                        onClick={() => handleSelectService(service.id)}
                        className="btn-service-readmore"
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* The MCP Search Methodology */}
          <section style={{ backgroundColor: '#f3f7fb', padding: '80px 0', borderTop: '1px solid #e2e8f0' }}>
            <div className="container">
              <div className="section-header text-center">
                <span className="section-tag">OUR METHODOLOGY</span>
                <h2 className="section-title">The 4-Stage Search Architecture</h2>
                <p className="section-subtitle">A disciplined, outcome-driven framework ensuring guaranteed delivery success</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginTop: '40px' }}>
                <div style={{ background: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: 'var(--color-accent)', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>01</div>
                  <h3 style={{ fontSize: '18px', marginBottom: '10px', color: 'var(--color-primary)' }}>Contextualize &amp; Scope</h3>
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>Immersion into strategic objectives, operational culture, governance philosophy, and mandate specifics.</p>
                </div>
                <div style={{ background: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: 'var(--color-accent)', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>02</div>
                  <h3 style={{ fontSize: '18px', marginBottom: '10px', color: 'var(--color-primary)' }}>Market Mapping</h3>
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>Forensic mapping of top passive leaders across competitors, adjacent ecosystems, and global peers.</p>
                </div>
                <div style={{ background: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: 'var(--color-accent)', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>03</div>
                  <h3 style={{ fontSize: '18px', marginBottom: '10px', color: 'var(--color-primary)' }}>Forensic Vetting</h3>
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>360-degree non-attributable references, past plant efficiency audits, and psychometric leadership appraisals.</p>
                </div>
                <div style={{ background: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: 'var(--color-accent)', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>04</div>
                  <h3 style={{ fontSize: '18px', marginBottom: '10px', color: 'var(--color-primary)' }}>Integration &amp; SLA</h3>
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>Structured check-ins during the first 100 days ensuring seamless cultural alignment and immediate impact.</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      )}

    </div>
  );
}

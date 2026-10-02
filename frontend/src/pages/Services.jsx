import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  Zap, 
  ShoppingBag, 
  Coffee, 
  GraduationCap, 
  Building, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Target, 
  Briefcase 
} from 'lucide-react';

const servicesData = [
  {
    id: 'workforce-management',
    title: 'Workforce Management',
    image: '/images/workforce-management.jpg',
    badge: 'TALENT & STAFFING',
    tagline: 'End-to-End Strategic Workforce, Temporary Staffing & Compliance',
    description: 'We engineer workforce solutions that empower enterprises to scale their human capital with agility, regulatory rigor, and operational excellence.',
    subItems: [
      {
        name: 'Temporary Staffing Solution',
        desc: 'Flexible, high-caliber contingent staffing deployed across manufacturing plants, warehousing hubs, and corporate offices.'
      },
      {
        name: 'Recruitment (IT & Non-IT)',
        desc: 'Comprehensive multi-tier talent acquisition for both cutting-edge technology roles and core industrial operations.'
      },
      {
        name: 'NAPS (National Apprenticeship Promotion Scheme)',
        desc: 'End-to-end NAPS engagement, stipend administration, candidate mapping, and compliance with statutory frameworks.'
      },
      {
        name: 'Payroll Management',
        desc: 'Zero-defect corporate payroll execution, PF/ESI/TDS regulatory compliance, and cloud employee self-service management.'
      }
    ]
  },
  {
    id: 'power-sector',
    title: 'Power Sector',
    image: '/images/power-sector.jpg',
    badge: 'ENERGY & INFRASTRUCTURE',
    tagline: 'Specialized Leadership & Technical Talent for Power, Utilities & Renewables',
    description: 'From high-voltage grid transmission to greenfield solar, wind, and thermal installations, we build technical benches for mission-critical power assets.',
    subItems: [
      {
        name: 'Transmission & Distribution (T&D)',
        desc: 'Project directors and chief engineers for 400kV/765kV substations, towers, and national grid interconnects.'
      },
      {
        name: 'Renewable Energy EPC',
        desc: 'Utility-scale solar, wind farms, and hybrid battery energy storage system (BESS) commissioning leaders.'
      },
      {
        name: 'Plant Operations & Maintenance (O&M)',
        desc: 'Experienced station managers and plant safety directors ensuring 99.8%+ uptime and boiler turbine generator (BTG) reliability.'
      },
      {
        name: 'Grid Modernization & Smart Metering',
        desc: 'Talent specialized in SCADA, IoT smart grids, AMI infrastructure, and modern dispatch automation.'
      }
    ]
  },
  {
    id: 'retail-ev',
    title: 'Retail & EV',
    image: '/images/retail-ev.jpg',
    badge: 'CONSUMER & MOBILITY',
    tagline: 'Modern Commerce, Omnichannel Supply Chains & Clean Mobility',
    description: 'Powering India’s hyper-growth consumer retail sectors and next-generation electric mobility ecosystems with specialized leadership.',
    subItems: [
      {
        name: 'Hypermarket & Supermarket Retail Operations',
        desc: 'Store operations directors, regional business managers, and merchandising strategists driving high footfall conversions.'
      },
      {
        name: 'Electric Vehicle (EV) Engineering',
        desc: 'Pioneering engineers for EV powertrain, BMS (Battery Management Systems), motor controllers, and vehicle telematics.'
      },
      {
        name: 'Omnichannel & Cold Chain Logistics',
        desc: 'FMCG distribution heads, fulfillment center leaders, and supply chain architects minimizing delivery lead times.'
      },
      {
        name: 'EV Charging Infrastructure & Networks',
        desc: 'Business development and site acquisition leads expanding public and commercial fast-charging networks.'
      }
    ]
  },
  {
    id: 'hospitality',
    title: 'Hospitality',
    image: '/images/hospitality.jpg',
    badge: 'LUXURY & SERVICE EXCELLENCE',
    tagline: 'Elite Operations, Culinary Leadership & Guest Experience Stewardship',
    description: 'Delivering exceptional leadership and operational staff for luxury hotel brands, boutique resorts, corporate dining, and fine-dining banqueting.',
    subItems: [
      {
        name: 'Luxury Hotel & Resort General Management',
        desc: 'Visionary General Managers and Operations Heads with proven records in RevPAR optimization and five-star brand standards.'
      },
      {
        name: 'Banqueting, MICE & Event Stewardship',
        desc: 'Event directors and convention banquet leaders orchestrating high-volume weddings, summits, and corporate galas.'
      },
      {
        name: 'Executive Dining & Corporate Hospitality',
        desc: 'Executive chefs, concierge managers, and corporate guest house supervisors delivering bespoke executive hospitality.'
      },
      {
        name: 'Food & Beverage Operations Excellence',
        desc: 'Multi-unit F&B directors managing menu engineering, liquor licensing compliance, hygiene audits, and high margins.'
      }
    ]
  },
  {
    id: 'skill-development',
    title: 'Skill Development & Education',
    image: '/images/skill-development.jpg',
    badge: 'LEARNING & CAPACITY BUILDING',
    tagline: 'Corporate Training, Apprenticeships & Institutional Upskilling',
    description: 'Bridging the industrial employability gap through certified skill enhancement programs, executive coaching, and vocational initiatives.',
    subItems: [
      {
        name: 'Corporate Leadership & Executive Coaching',
        desc: 'Tailored management development programs (MDP) and executive mentoring for first-time managers through C-suite officers.'
      },
      {
        name: 'Technical & Shopfloor Skill Enhancement',
        desc: 'Hands-on CNC, robotics, PLC automation, and safety (OSHA) certifications for modern manufacturing shopfloors.'
      },
      {
        name: 'Campus-to-Corporate Readiness Programs',
        desc: 'Industry-integrated bridge curricula, finishing schools, and communication bootcamps for engineering and management graduates.'
      },
      {
        name: 'Government & CSR Skill Initiatives',
        desc: 'Turnkey execution of PMKVY, DDU-GKY, and CSR-funded vocational training programs with high placement tracking.'
      }
    ]
  },
  {
    id: 'facility-management',
    title: 'Facility Management & BPO',
    image: '/images/facility-management.jpg',
    badge: 'INFRASTRUCTURE & WORKPLACE',
    tagline: 'Integrated Facility Management (IFM) & Business Process Outsourcing',
    description: 'Comprehensive property upkeep, mechanical/electrical maintenance, corporate administrative support, and front-line contact center operations.',
    subItems: [
      {
        name: 'Integrated Facility Management (IFM)',
        desc: 'Single-source stewardship of corporate campuses, IT parks, and factories covering MEP, HVAC, cleaning, and green initiatives.'
      },
      {
        name: 'Business Process Outsourcing (BPO)',
        desc: 'Scalable domestic and international customer care teams, back-office data processing, and technical support desks.'
      },
      {
        name: 'Corporate Security & Surveillance',
        desc: 'Trained manned security guards, CCTV surveillance command center operators, and executive protection personnel.'
      },
      {
        name: 'Environment, Health & Safety (EHS) Compliance',
        desc: 'Audited workplace sanitation, fire safety compliance, waste management, and LEED / ESG green building governance.'
      }
    ]
  }
];

export default function Services() {
  const location = useLocation();

  // Scroll to hash on page load or hash change
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="services-page">
      
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
      <section className="our-services-home-section" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
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
                  <a href={`#${service.id}`} className="btn-service-readmore">
                    Read More
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Detailed Practice Breakdown Sections */}
      <section style={{ padding: '80px 0', backgroundColor: '#f8fafc' }}>
        <div className="container">
          
          <div className="section-header text-center" style={{ maxWidth: '800px', margin: '0 auto 60px' }}>
            <span className="section-tag">COMPREHENSIVE CAPABILITIES</span>
            <h2 className="section-title">Deep Sectoral Solutions &amp; Execution</h2>
            <p className="section-desc">
              Explore in-depth service frameworks designed to solve high-stakes talent, staffing, and operational mandates with guaranteed compliance.
            </p>
          </div>

          {servicesData.map((service, index) => {
            const isReversed = index % 2 === 1;
            return (
              <div 
                key={service.id} 
                id={service.id} 
                className="service-detail-section"
                style={{
                  background: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  padding: '40px',
                  marginBottom: '50px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                  scrollMarginTop: '100px'
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isReversed ? '1fr 1.1fr' : '1.1fr 1fr',
                  gap: '40px',
                  alignItems: 'center'
                }}>
                  
                  {/* Text Column */}
                  <div style={{ order: isReversed ? 2 : 1 }}>
                    <span className="section-tag" style={{ marginBottom: '10px', display: 'inline-block' }}>
                      {service.badge}
                    </span>
                    <h2 style={{ fontSize: '28px', color: 'var(--color-primary)', fontWeight: '800', margin: '6px 0 12px' }}>
                      {service.title}
                    </h2>
                    <p style={{ fontSize: '15.5px', fontWeight: '600', color: 'var(--color-accent)', marginBottom: '14px' }}>
                      {service.tagline}
                    </p>
                    <p style={{ fontSize: '14.5px', color: '#64748b', lineHeight: '1.7', marginBottom: '24px' }}>
                      {service.description}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                      {service.subItems.map((item, idx) => (
                        <div key={idx} style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '6px', borderLeft: '3px solid var(--color-accent)' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-primary)', margin: '0 0 4px' }}>
                            {item.name}
                          </h4>
                          <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>

                    <Link to="/contact" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <span>Enquire About {service.title}</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>

                  {/* Image Column */}
                  <div style={{ order: isReversed ? 1 : 2 }}>
                    <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                      <img 
                        src={service.image} 
                        alt={service.title} 
                        style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  </div>

                </div>
              </div>
            );
          })}

        </div>
      </section>

      {/* The MCP Operational Rigor Methodology */}
      <section style={{ backgroundColor: '#ffffff', padding: '80px 0', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">OUR METHODOLOGY</span>
            <h2 className="section-title">The 4-Stage Service Architecture</h2>
            <p className="section-subtitle">A disciplined, outcome-driven framework ensuring seamless delivery and compliance</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginTop: '40px' }}>
            <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ color: 'var(--color-accent)', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>01</div>
              <h3 style={{ fontSize: '18px', marginBottom: '10px', color: 'var(--color-primary)' }}>Diagnostics &amp; Scoping</h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>Immersion into strategic business objectives, headcount projections, skill taxonomy, and regulatory requirements.</p>
            </div>
            <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ color: 'var(--color-accent)', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>02</div>
              <h3 style={{ fontSize: '18px', marginBottom: '10px', color: 'var(--color-primary)' }}>Mobilization &amp; Mapping</h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>Leveraging proprietary industry databases and on-ground recruiting channels to source qualified talent within record SLAs.</p>
            </div>
            <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ color: 'var(--color-accent)', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>03</div>
              <h3 style={{ fontSize: '18px', marginBottom: '10px', color: 'var(--color-primary)' }}>Rigorous Compliance &amp; Vetting</h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>Multi-stage background verification, skill assessments, medical clearances, and statutory labor law onboarding.</p>
            </div>
            <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ color: 'var(--color-accent)', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>04</div>
              <h3 style={{ fontSize: '18px', marginBottom: '10px', color: 'var(--color-primary)' }}>Continuous Performance &amp; SLA</h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>Dedicated relationship managers, monthly payroll reconciliations, attrition backfilling, and transparent MIS reporting.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

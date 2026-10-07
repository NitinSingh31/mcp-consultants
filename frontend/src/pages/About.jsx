import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Award, 
  Users, 
  Compass, 
  CheckCircle2, 
  ArrowRight,
  Target,
  Quote,
  Building2,
  Briefcase,
  Sparkles,
  TrendingUp,
  Factory,
  Layers,
  HeartHandshake,
  Check,
  PhoneCall,
  Clock,
  Shield,
  FileCheck
} from 'lucide-react';

export default function About() {
  const journeyTimeline = [
    {
      year: "2007",
      title: "MCP Group Founded",
      desc: "The journey begins in Chandigarh with a vision to create dependable, compliance-driven workforce solutions for emerging and established enterprises."
    },
    {
      year: "2010+",
      title: "Expanding Capabilities",
      desc: "MCP strengthens its presence across multiple industrial verticals, adding specialized technical staffing, plant operations, and multi-state compliance support."
    },
    {
      year: "2015+",
      title: "Building Scale Nationwide",
      desc: "The organization rapidly scales its workforce network and corporate partnerships, surpassing 20,000+ associates deployed across North and Central India."
    },
    {
      year: "2020+",
      title: "Diversification & Innovation",
      desc: "MCP expands into facility management, BPO solutions, skill development, education, and digital attendance & automated payroll technologies."
    },
    {
      year: "TODAY",
      title: "Pan-India Workforce Powerhouse",
      desc: "Nearly 50,000 associates | 500+ clients across private, public, and government sectors | ISO 9001:2008 certified — and the journey continues."
    }
  ];

  const whyChooseMcp = [
    {
      icon: Compass,
      title: "Pan-India Reach",
      description: "Our extensive workforce network enables us to mobilize and support talent across multiple states, manufacturing belts, and corporate hubs nationwide."
    },
    {
      icon: Award,
      title: "Deep Industry Expertise",
      description: "Nearly two decades of experience gives us a granular understanding of diverse shopfloor environments, technical plant roles, and operational dynamics."
    },
    {
      icon: ShieldCheck,
      title: "Compliance First",
      description: "We place statutory compliance, governance, labor laws, and process discipline at the heart of our operations, safeguarding clients from liability."
    },
    {
      icon: TrendingUp,
      title: "Scale With Flexibility",
      description: "From specialized technical staffing to large-scale workforce deployment of 1,000+ associates, our solutions adapt seamlessly to shifting demands."
    },
    {
      icon: Users,
      title: "People-Powered",
      description: "Our greatest strength is our people — supported by automated systems, digital payroll, attendance technology, and dedicated on-site operational leaders."
    },
    {
      icon: HeartHandshake,
      title: "Long-Term Partnerships",
      description: "We focus on building lasting relationships rather than transactional engagements, growing alongside our clients through multi-year tenures."
    }
  ];

  return (
    <div className="about-page">
      
      {/* 1. Page Hero Banner */}
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span className="divider">&rsaquo;</span>
            <span>About Us</span>
          </div>
          <span className="section-tag" style={{ color: 'var(--color-accent)', display: 'block', marginBottom: '12px' }}>
            SINCE 2007 • CHANDIGARH, INDIA
          </span>
          <h1 className="page-hero-title">Empowering People. Powering Businesses. Building India.</h1>
          <p className="page-hero-subtitle">
            A leading Human Resource and Workforce Management organization delivering specialized, compliance-driven workforce solutions across India with nearly 50,000 associates and 500+ clients.
          </p>
        </div>
      </section>

      {/* 2. Key Metrics Ribbon */}
      <section className="about-stats-ribbon">
        <div className="container">
          <div className="about-stats-grid">
            <div className="about-stat-item">
              <span className="about-stat-number">19+ Years</span>
              <span className="about-stat-label">Heritage of Excellence</span>
              <span className="about-stat-sub">Founded in 2007 in Chandigarh</span>
            </div>
            <div className="about-stat-item">
              <span className="about-stat-number">50,000+</span>
              <span className="about-stat-label">Associates Deployed</span>
              <span className="about-stat-sub">Powering India's core industries</span>
            </div>
            <div className="about-stat-item">
              <span className="about-stat-number">500+</span>
              <span className="about-stat-label">Corporate Clients</span>
              <span className="about-stat-sub">Private, public &amp; government sectors</span>
            </div>
            <div className="about-stat-item">
              <span className="about-stat-number">ISO 9001:2008</span>
              <span className="about-stat-label">Certified Organization</span>
              <span className="about-stat-sub">Highest operational &amp; statutory quality</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section 01: Who We Are */}
      <section className="about-intro-section">
        <div className="container">
          <div className="about-intro-grid">
            
            {/* Left Narrative */}
            <div className="about-narrative-text">
              <span className="section-tag">WHO WE ARE</span>
              <h2 className="section-title" style={{ fontSize: '34px', marginBottom: '20px', lineHeight: 1.25 }}>
                Building India’s Workforce. Strengthening India’s Businesses.
              </h2>
              
              <p>
                Founded in 2007 in Chandigarh, <strong>MCP Group</strong> has grown into a trusted workforce and human resource partner for organizations across India. What began with a vision to create dependable workforce solutions has evolved into a diversified group serving some of India’s most demanding industries.
              </p>

              <p>
                Under the leadership of <strong>Chairman &amp; Managing Director Mrs. Shallu Gaba</strong>, the Group continues to expand its capabilities across diverse and rapidly evolving industries, including Pharmaceuticals, Power, Textiles, Automobiles, Electronics &amp; Electricals, Retail &amp; EV, Hospitality, Skill Development, Education, Facility Management, BPO and Workforce Management.
              </p>

              <blockquote style={{ background: 'var(--color-bg-light)', borderLeft: '4px solid var(--color-accent)', padding: '16px 20px', margin: '24px 0', borderRadius: '0 8px 8px 0', fontStyle: 'italic', color: 'var(--color-primary)' }}>
                “Rooted in India. Inspired by the Himalayas. From the foothills of Chandigarh, we carry the spirit of purity, strength, resilience and enduring excellence to every client, every workforce and every partnership.”
              </blockquote>

              <p>
                Our strength lies in understanding people, industries and compliance — and transforming these insights into reliable, scalable and future-ready workforce solutions.
              </p>

              <div className="about-feature-checks" style={{ marginTop: '24px' }}>
                <div className="about-check-item">
                  <CheckCircle2 size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>People + Process + Technology + Compliance + Industry Expertise</strong></span>
                </div>
                <div className="about-check-item">
                  <CheckCircle2 size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Nearly 50,000 associates deployed under structured SLAs across India</span>
                </div>
                <div className="about-check-item">
                  <CheckCircle2 size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>ISO 9001:2008 certified quality management and 100% labor law adherence</span>
                </div>
              </div>
            </div>

            {/* Right Formula Card */}
            <div className="about-blueprint-card">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent)', fontWeight: 800, fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px' }}>
                <Sparkles size={16} />
                <span>The MCP Blueprint</span>
              </div>
              
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', marginBottom: '16px', lineHeight: 1.3 }}>
                More Than Manpower. We Build Workforce Solutions.
              </h3>
              
              <p style={{ fontSize: '14.5px', color: '#cbd5e1', lineHeight: 1.7, marginBottom: '24px' }}>
                At MCP Group, we believe that people are the foundation of every successful organization. Our approach combines five essential dimensions:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Users size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '15px', color: '#ffffff' }}>People at the Centre</strong>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>Understanding aspirations, developing skills, and creating opportunities for growth.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <TrendingUp size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '15px', color: '#ffffff' }}>Process &amp; Technology</strong>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>Automated attendance, digital salary disbursement, and transparent client reporting.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <ShieldCheck size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '15px', color: '#ffffff' }}>Statutory Compliance</strong>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>100% adherence to PF, ESIC, minimum wages, and Factories Act requirements.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Factory size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '15px', color: '#ffffff' }}>Industry Expertise</strong>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>Specialized domain pods tuned to plant machinery, pharma GMP, and automotive lines.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Section 02 & 03: Vision & Mission */}
      <section className="vision-mission-section">
        <div className="container">
          
          <div className="section-header text-center" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <span className="section-tag" style={{ color: 'var(--color-accent)' }}>STRATEGIC ANCHORS</span>
            <h2 className="section-title" style={{ color: '#ffffff' }}>Our Vision &amp; Our Mission</h2>
            <p className="section-subtitle" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              The foundational convictions guiding every workforce deployment, partnership, and operational standard
            </p>
          </div>

          <div className="vision-mission-grid">
            
            {/* OUR VISION */}
            <div className="vm-card">
              <div className="vm-badge">
                <Compass size={16} />
                <span>OUR VISION</span>
              </div>
              <h3 className="vm-title">To Become India’s Most Trusted Workforce &amp; Business Solutions Partner</h3>
              <p className="vm-statement">
                “We envision a future where organizations can focus on their core business while MCP Group takes care of the people, processes and operational support that power their success.”
              </p>

              <div style={{ margin: '16px 0', padding: '14px 18px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '8px', borderLeft: '3px solid var(--color-accent)' }}>
                <strong style={{ color: '#ffffff', fontSize: '14px' }}>Our Goal is Simple:</strong>
                <p style={{ margin: '4px 0 0 0', color: 'var(--color-accent)', fontWeight: 700, fontSize: '15px' }}>
                  Build stronger organizations by building stronger workforces.
                </p>
              </div>

              <ul className="vm-list">
                <li className="vm-list-item">
                  <CheckCircle2 size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Operational Freedom:</strong> Allowing client boardrooms to innovate while we handle the workforce engine.</span>
                </li>
                <li className="vm-list-item">
                  <CheckCircle2 size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Nationwide Accessibility:</strong> Connecting enterprises across Tier-1, Tier-2, and industrial belts.</span>
                </li>
                <li className="vm-list-item">
                  <CheckCircle2 size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Sustainable Economic Impact:</strong> Supporting India’s manufacturing resurgence and employment generation.</span>
                </li>
              </ul>
            </div>

            {/* OUR MISSION */}
            <div className="vm-card">
              <div className="vm-badge">
                <Target size={16} />
                <span>OUR MISSION</span>
              </div>
              <h3 className="vm-title">People at the Centre. Excellence in Everything.</h3>
              <p className="vm-statement">
                “Our mission is to provide organizations with dependable, ethical and compliance-driven workforce solutions while creating meaningful employment opportunities for people across India.”
              </p>

              <div style={{ margin: '16px 0' }}>
                <strong style={{ color: '#ffffff', fontSize: '13.5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>We Continuously Invest In:</strong>
              </div>

              <ul className="vm-list">
                <li className="vm-list-item">
                  <CheckCircle2 size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Workforce Excellence &amp; Skill Development:</strong> Preparing associates for tomorrow's jobs through training.</span>
                </li>
                <li className="vm-list-item">
                  <CheckCircle2 size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Technology &amp; Process Innovation:</strong> Deploying state-of-the-art attendance and payroll infrastructure.</span>
                </li>
                <li className="vm-list-item">
                  <CheckCircle2 size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Statutory Compliance &amp; Employee Engagement:</strong> Cultivating ethical workplaces where people thrive.</span>
                </li>
                <li className="vm-list-item">
                  <CheckCircle2 size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Long-Term Value Partnerships:</strong> Creating measurable operational ROI for every client organization.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Section 07: Leadership Spotlight */}
      <section className="md-message-section">
        <div className="container">
          
          <div className="section-header text-center" style={{ maxWidth: '780px', margin: '0 auto 48px' }}>
            <span className="section-tag">OUR LEADERSHIP</span>
            <h2 className="section-title">Leadership With Vision. Growth With Purpose.</h2>
            <p className="section-subtitle">
              Pioneering a professionally managed, people-centric workforce organization
            </p>
          </div>

          <div className="md-message-card">
            
            {/* Left: MD Portrait & Credentials */}
            <div className="md-profile-col">
              <div className="md-portrait-frame">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80" 
                  alt="Mrs. Shallu Gaba, Chairman & Managing Director"
                />
              </div>
              <div className="md-name">Mrs. Shallu Gaba</div>
              <div className="md-role">Chairman &amp; Managing Director</div>
              <div className="md-firm">MCP GROUP</div>
              
              <div style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(196, 154, 69, 0.12)', borderRadius: '20px', color: 'var(--color-accent)', fontSize: '12px', fontWeight: 700 }}>
                <Award size={14} />
                <span>Founding Leadership • Since 2007</span>
              </div>
            </div>

            {/* Right: Message Letter */}
            <div className="md-text-col">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent)', marginBottom: '16px' }}>
                <Quote size={32} />
              </div>

              <blockquote className="md-quote-lead">
                “When people grow, organizations grow. Our responsibility is to create the environment where both can succeed.”
              </blockquote>

              <div className="md-body-text">
                <p>
                  With a clear vision for creating a professionally managed, people-centric organization, Mrs. Shallu Gaba has been instrumental in shaping the growth and strategic direction of MCP Group since its inception in 2007 in Chandigarh.
                </p>
                <p>
                  Her leadership philosophy combines integrity, operational excellence, innovation and an unwavering commitment to people. Under her stewardship, MCP Group has expanded its footprint across India’s core and emerging industries, including Pharmaceuticals, Power, Textiles, Automobiles, Electronics, Retail &amp; EV, Hospitality, and Government sectors.
                </p>
                <p>
                  By prioritizing statutory compliance, transparent governance, and technological modernization, Mrs. Gaba has guided MCP Group to become a trusted workforce partner for over 500 organizations with nearly 50,000 associates nationwide.
                </p>
              </div>

              <div className="md-signoff">
                <div>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: '20px', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '1px' }}>
                    Mrs. Shallu Gaba
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>
                    Chairman &amp; Managing Director, MCP Group
                  </div>
                </div>

                <Link to="/contact" className="btn btn-outline-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
                  <span>Connect With Leadership</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 6. Section 08: Our Journey Timeline */}
      <section style={{ padding: '80px 0', background: 'var(--color-bg-light)' }}>
        <div className="container">
          <div className="section-header text-center" style={{ maxWidth: '780px', margin: '0 auto 56px' }}>
            <span className="section-tag">OUR JOURNEY</span>
            <h2 className="section-title">From Chandigarh to a Pan-India Workforce Network</h2>
            <p className="section-subtitle">
              Nearly two decades of consistent growth, continuous innovation, and enduring client partnerships
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            {journeyTimeline.map((item, idx) => (
              <div 
                key={idx} 
                style={{ 
                  background: '#ffffff', 
                  borderRadius: '12px', 
                  padding: '28px 24px', 
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                  position: 'relative'
                }}
              >
                <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-accent)', marginBottom: '8px', fontFamily: "'Cinzel', serif" }}>
                  {item.year}
                </div>
                <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '10px' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Section 06: Why Leading Organizations Choose MCP */}
      <section className="why-mcp-section">
        <div className="container">
          
          <div className="section-header text-center" style={{ maxWidth: '820px', margin: '0 auto 20px' }}>
            <span className="section-tag">WHY MCP</span>
            <h2 className="section-title">Why Leading Organizations Choose MCP</h2>
            <p className="section-desc">
              Organizations today need more than people. They need speed, compliance, technology, reliability and strategic workforce thinking.
            </p>
          </div>

          <div className="why-mcp-cards-grid">
            {whyChooseMcp.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="why-card">
                  <div className="why-icon-wrap">
                    <IconComp size={26} />
                  </div>
                  <h3 className="why-title">{item.title}</h3>
                  <p className="why-desc">{item.description}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 8. Section 10: Quality & Compliance */}
      <section style={{ padding: '80px 0', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div className="section-header text-center" style={{ maxWidth: '750px', margin: '0 auto 40px' }}>
            <span className="section-tag">QUALITY &amp; COMPLIANCE</span>
            <h2 className="section-title">Built on Trust. Driven by Compliance.</h2>
            <p className="section-desc">
              MCP Group follows structured processes designed to deliver consistent quality and operational reliability.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {[
              {
                title: "Quality Management",
                desc: "ISO 9001:2008 certified systems ensuring standardized workforce onboarding, training, and operational delivery across all sites."
              },
              {
                title: "Statutory Compliance",
                desc: "100% adherence to Provident Fund (PF), ESIC, Professional Tax, Bonus, Gratuity, and state-specific Factories Act regulations."
              },
              {
                title: "Process Governance",
                desc: "Standard Operating Procedures (SOPs), monthly internal compliance audits, and multi-tier operational accountability."
              },
              {
                title: "Workforce Safety & EHS",
                desc: "Strict adherence to industrial occupational safety, safety gear distribution, and proactive hazard prevention protocols."
              },
              {
                title: "Data & Documentation",
                desc: "Digitized personnel files, automated attendance logs, biometric integration, and secure record retention."
              },
              {
                title: "Continuous Improvement",
                desc: "Regular client satisfaction audits, associate feedback loops, and ongoing process optimization to elevate service quality."
              }
            ].map((card, i) => (
              <div key={i} style={{ padding: '24px', background: 'var(--color-bg-light)', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <ShieldCheck size={20} color="var(--color-accent)" />
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>{card.title}</h4>
                </div>
                <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
              </div>
            ))}
          </div>

          {/* ISO 9001:2008 Badge Strip */}
          <div style={{ marginTop: '48px', padding: '24px 32px', background: 'linear-gradient(135deg, #071120 0%, #0d1e38 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', color: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--color-accent)' }}>
                <Award size={28} color="var(--color-accent)" />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#ffffff' }}>ISO 9001:2008 CERTIFIED</h4>
                <p style={{ margin: 0, fontSize: '13.5px', color: '#BAC7D5' }}>
                  Our quality-focused approach reflects our enduring commitment to delivering dependable services to clients across industries.
                </p>
              </div>
            </div>
            <Link to="/contact" className="btn btn-hero-gold" style={{ padding: '10px 22px', fontSize: '13.5px' }}>
              <span>Request Compliance Dossier</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 9. Section 12 & 13: The MCP Difference & Partnership Promise */}
      <section style={{ padding: '80px 0', background: 'var(--color-bg-light)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
            
            {/* The MCP Difference */}
            <div>
              <span className="section-tag">THE MCP DIFFERENCE</span>
              <h2 className="section-title" style={{ fontSize: '32px', marginBottom: '16px' }}>
                More Than Manpower.
              </h2>
              <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '15px', marginBottom: '24px' }}>
                The workforce industry is changing. Organizations today need more than people. They need speed, compliance, technology, reliability and strategic workforce thinking. That’s where MCP makes the difference.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                <div style={{ padding: '16px', background: '#ffffff', borderRadius: '8px', borderLeft: '4px solid var(--color-accent)' }}>
                  <strong style={{ display: 'block', color: 'var(--color-primary)' }}>We Understand People.</strong>
                </div>
                <div style={{ padding: '16px', background: '#ffffff', borderRadius: '8px', borderLeft: '4px solid var(--color-accent)' }}>
                  <strong style={{ display: 'block', color: 'var(--color-primary)' }}>We Understand Business.</strong>
                </div>
                <div style={{ padding: '16px', background: '#ffffff', borderRadius: '8px', borderLeft: '4px solid var(--color-accent)' }}>
                  <strong style={{ display: 'block', color: 'var(--color-primary)' }}>We Understand Compliance.</strong>
                </div>
                <div style={{ padding: '16px', background: '#ffffff', borderRadius: '8px', borderLeft: '4px solid var(--color-accent)' }}>
                  <strong style={{ display: 'block', color: 'var(--color-primary)' }}>We Understand India.</strong>
                </div>
              </div>

              <p style={{ fontStyle: 'italic', fontWeight: 600, color: 'var(--color-primary)' }}>
                “Pure in intent. Strong in execution. Relentless in pursuit of excellence.”
              </p>
            </div>

            {/* Partnership Promise */}
            <div style={{ background: '#ffffff', padding: '36px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
              <span className="section-tag">OUR PARTNERSHIP PROMISE</span>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)', margin: '8px 0 16px 0' }}>
                Your Workforce. Our Responsibility.
              </h3>
              <p style={{ color: '#64748b', fontSize: '14.5px', lineHeight: 1.6, marginBottom: '20px' }}>
                When you partner with MCP Group, you gain more than a service provider. You gain a workforce partner committed to understanding your business, solving your operational challenges and supporting your growth.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: 700, color: 'var(--color-primary)' }}>
                  <Check size={18} color="var(--color-accent)" />
                  <span>We Listen.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: 700, color: 'var(--color-primary)' }}>
                  <Check size={18} color="var(--color-accent)" />
                  <span>We Understand.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: 700, color: 'var(--color-primary)' }}>
                  <Check size={18} color="var(--color-accent)" />
                  <span>We Deliver.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: 700, color: 'var(--color-accent)' }}>
                  <Check size={18} color="var(--color-accent)" />
                  <span>We Grow Together.</span>
                </div>
              </div>

              <Link to="/contact" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <span>Partner With MCP Group</span>
                <ArrowRight size={16} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 10. Call to Action Banner */}
      <section style={{ backgroundColor: 'var(--color-primary-dark)', padding: '70px 0', color: '#ffffff', borderTop: '2px solid var(--color-accent)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '32px' }}>
          <div style={{ maxWidth: '680px' }}>
            <span style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              MCP GROUP • SINCE 2007
            </span>
            <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#ffffff', margin: '0 0 12px 0', lineHeight: 1.3 }}>
              Let's Build Something Stronger Together.
            </h2>
            <p style={{ margin: 0, fontSize: '15px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}>
              Whether you need workforce management, recruitment, facility management, BPO, skill development or specialized industry manpower — MCP Group is ready to help.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-accent" style={{ padding: '12px 24px' }}>
              <Briefcase size={16} />
              <span>Talk to Our Team</span>
            </Link>
            <Link to="/services" className="btn btn-outline-white" style={{ padding: '12px 24px' }}>
              <span>Explore Our Services</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

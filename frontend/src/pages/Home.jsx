import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Shield, 
  Award, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Target, 
  Factory, 
  Cpu, 
  Zap, 
  CheckCircle2,
  Building2, 
  Compass,
  Phone,
  Lock,
  Star,
  Layers,
  Sparkles,
  ShieldCheck,
  Settings
} from 'lucide-react';
import StatCounter from '../components/StatCounter';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const heroSlides = [
    {
      subtitle: "SINCE 2007 • CHANDIGARH, INDIA",
      title: "Empowering People. Powering Businesses. Building India.",
      description: "MCP Group is a leading Human Resource and Workforce Management organization delivering specialized, compliance-driven workforce solutions across India.",
      ctaText: "Work With MCP",
      ctaLink: "/contact",
      secondaryText: "Explore Our Solutions",
      secondaryLink: "/services",
      bgImage: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1920&q=80"
    },
    {
      subtitle: "MORE THAN MANPOWER",
      title: "We Build Future-Ready Workforce Solutions",
      description: "Combining People + Process + Technology + Compliance + Industry Expertise to help organizations operate efficiently, remain compliant and grow with confidence.",
      ctaText: "Explore 7 Verticals",
      ctaLink: "/services",
      secondaryText: "Industries We Serve",
      secondaryLink: "/industries",
      bgImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80"
    },
    {
      subtitle: "ROOTED IN INDIA • INSPIRED BY THE HIMALAYAS",
      title: "19+ Years. 50,000+ Associates. 500+ Clients.",
      description: "From the foothills of Chandigarh, carrying the spirit of purity, resilience, and enduring excellence to every client, every workforce, and every partnership across India.",
      ctaText: "Partner With Us",
      ctaLink: "/contact",
      secondaryText: "About MCP Group",
      secondaryLink: "/about",
      bgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
    }
  ];

  const testimonials = [
    {
      quote: "MCP Group has managed our manufacturing plant workforce with extraordinary discipline and 100% statutory compliance. Their on-site coordinators and rapid deployment have helped us achieve uninterrupted plant operations.",
      author: "Vice President - Operations",
      company: "Leading Pharmaceutical Formulation Group (Punjab & Baddi)",
      sector: "Pharmaceuticals"
    },
    {
      quote: "Mobilizing over 1,200 skilled associates across multiple logistics and retail hubs within weeks seemed impossible. MCP delivered with precision, backed by seamless digitized payroll and attendance tracking.",
      author: "Chief Human Resources Officer (CHRO)",
      company: "National Retail & Omnichannel Enterprise",
      sector: "Retail & Modern Commerce"
    },
    {
      quote: "Their adherence to labor laws, PF/ESIC governance, and ISO 9001 quality processes is second to none. A dependable workforce partner that truly understands compliance and scalability.",
      author: "Head of Administration & Compliance",
      company: "Public Sector & Infrastructure Undertaking",
      sector: "Government & Public Sector"
    }
  ];

  const industrySectors = [
    { name: "Pharmaceuticals", icon: Factory, placements: "Formulation, API & QA/QC", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80" },
    { name: "Power & Energy", icon: Zap, placements: "Transmission, Solar, O&M", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80" },
    { name: "Automobiles & EV", icon: Settings, placements: "Assembly, Tooling & EV Tech", image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80" },
    { name: "Textiles & Manufacturing", icon: Layers, placements: "Spinning, Apparel & Plant Ops", image: "https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=600&q=80" },
    { name: "Electronics & Electricals", icon: Cpu, placements: "Hardware, SMT & Tech Talent", image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80" },
    { name: "Retail & EV", icon: TrendingUp, placements: "Store Ops, Logistics & Mobility", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80" },
    { name: "Hospitality", icon: Users, placements: "Guest Relations & Operations", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80" },
    { name: "Government & Public Sector", icon: ShieldCheck, placements: "Compliance-Driven Manpower", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" }
  ];

  useEffect(() => {
    const heroTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(heroTimer);
  }, [heroSlides.length]);

  // TOGGLE: false activates the multi-slide carousel hero, true activates the split hero
  const SHOW_SPLIT_HERO = false;

  return (
    <div className="home-page">
      
      {SHOW_SPLIT_HERO ? (
        /* 1. Modern Split Hero */
        <section className="hero-split-section">
          <div className="container hero-split-container">
            <div className="hero-split-grid">
              
              {/* Left Column: Headline, Narrative & CTAs */}
              <div className="hero-split-content">
                <div className="hero-split-badge">
                  <span className="hero-badge-dot">•</span>
                  <span>19+ YEARS OF WORKFORCE EXCELLENCE • SINCE 2007</span>
                </div>
                
                <h1 className="hero-split-title">
                  People who <br />
                  <span className="title-accent">power business.</span>
                </h1>
                
                <p className="hero-split-desc">
                  MCP Group connects businesses with dependable, skilled and compliance-ready workforce solutions — serving nearly 50,000 associates and 500+ clients across India.
                </p>

                <div className="hero-split-actions">
                  <Link to="/contact" className="btn btn-hero-gold">
                    <span>Work With MCP</span>
                    <ArrowRight size={16} />
                  </Link>
                  <Link to="/services" className="btn btn-hero-translucent">
                    <span>Explore Our Solutions</span>
                  </Link>
                </div>

                {/* Bottom Highlight Metrics */}
                <div className="hero-split-metrics">
                  <div className="hero-metric-item">
                    <span className="hero-metric-num">19+</span>
                    <span className="hero-metric-label">Years Experience</span>
                  </div>
                  <div className="hero-metric-sep"></div>
                  <div className="hero-metric-item">
                    <span className="hero-metric-num">50,000+</span>
                    <span className="hero-metric-label">Associates</span>
                  </div>
                  <div className="hero-metric-sep"></div>
                  <div className="hero-metric-item">
                    <span className="hero-metric-num">500+</span>
                    <span className="hero-metric-label">Clients Across India</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Large Rounded Photo with Inset Floating Card */}
              <div className="hero-split-visual">
                <div className="hero-split-card">
                  <img 
                    src="/images/hero-split-office.jpg" 
                    alt="MCP Group Modern Collaborative Office" 
                    className="hero-split-img"
                  />
                  
                  {/* Floating Badge */}
                  <div className="hero-floating-glass-card">
                    <h3 className="floating-card-title">Building India's Workforce</h3>
                    <p className="floating-card-desc">
                      Specialised, compliance-driven workforce solutions for businesses that value the right people.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      ) : (
        /* 1. Preserved Hero Slider (Can be toggled back on anytime) */
        <section className="hero-slider-section">
          {heroSlides.map((slide, idx) => (
            <div 
              key={idx}
              className={`hero-slide ${idx === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url('${slide.bgImage}')` }}
            >
              <div className="container">
                <div className="hero-content">
                  <div className="hero-badge">
                    <Shield size={14} className="badge-icon" />
                    <span>{slide.subtitle}</span>
                  </div>
                  <h1 className="hero-title">{slide.title}</h1>
                  <p className="hero-desc">{slide.description}</p>
                  <div className="hero-cta-group">
                    <Link to={slide.ctaLink} className="btn btn-hero-accent btn-lg">
                      <span>{slide.ctaText}</span>
                      <ArrowRight size={18} />
                    </Link>
                    <Link to={slide.secondaryLink} className="btn btn-outline-white btn-lg">
                      <span>{slide.secondaryText}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Slide Controls */}
          <div className="slider-controls">
            <button 
              className="slider-arrow prev" 
              onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
              aria-label="Previous Slide"
            >
              <ChevronLeft size={22} />
            </button>
            <div className="slider-dots">
              {heroSlides.map((_, i) => (
                <button 
                  key={i} 
                  className={`slider-dot ${i === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button 
              className="slider-arrow next" 
              onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
              aria-label="Next Slide"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </section>
      )}

      {/* 2. Executive Trust Ribbon */}
      <div className="hero-trust-ribbon">
        <div className="container">
          <div className="trust-ribbon-grid">
            
            <div className="trust-ribbon-item">
              <div className="trust-ribbon-icon">
                <Award size={20} />
              </div>
              <div className="trust-ribbon-text">
                <strong>19+ Years Experience</strong>
                <span>Founded 2007 in Chandigarh</span>
              </div>
            </div>

            <div className="trust-ribbon-item">
              <div className="trust-ribbon-icon">
                <Users size={20} />
              </div>
              <div className="trust-ribbon-text">
                <strong>50,000+ Associates</strong>
                <span>Pan-India workforce network</span>
              </div>
            </div>

            <div className="trust-ribbon-item">
              <div className="trust-ribbon-icon">
                <ShieldCheck size={20} />
              </div>
              <div className="trust-ribbon-text">
                <strong>ISO 9001:2008 Certified</strong>
                <span>Statutory compliance &amp; governance</span>
              </div>
            </div>

            <div className="trust-ribbon-item">
              <div className="trust-ribbon-icon">
                <Building2 size={20} />
              </div>
              <div className="trust-ribbon-text">
                <strong>500+ Corporate Clients</strong>
                <span>Private, public &amp; government sectors</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Company Introduction: Building India's Workforce */}
      <section className="about-demo-intro-section" id="about-intro">
        
        {/* Sleek Sector Ticker Bar */}
        <div className="demo-ticker-bar">
          <div className="container demo-ticker-container">
            <span className="demo-ticker-left">Trusted Workforce Partner Since 2007</span>
            <div className="demo-ticker-tags">
              <span>PHARMACEUTICALS</span>
              <span className="ticker-dot">•</span>
              <span>POWER &amp; ENERGY</span>
              <span className="ticker-dot">•</span>
              <span>AUTOMOBILES</span>
              <span className="ticker-dot">•</span>
              <span>TEXTILES</span>
              <span className="ticker-dot">•</span>
              <span>ELECTRONICS</span>
              <span className="ticker-dot">•</span>
              <span>RETAIL &amp; EV</span>
              <span className="ticker-dot">•</span>
              <span>HOSPITALITY</span>
              <span className="ticker-dot">•</span>
              <span>GOVERNMENT SECTOR</span>
            </div>
          </div>
        </div>

        <div className="container about-demo-main-container">
          <div className="about-demo-grid">
            
            {/* Left Column: Rounded Feature Photo with Inset 19+ Badge */}
            <div className="about-demo-photo-col">
              <div className="about-demo-photo-card">
                <img 
                  src="/images/about-intro-team.jpg" 
                  alt="MCP Group Team" 
                  className="about-demo-img"
                  loading="lazy"
                />
                
                {/* Inset Badge */}
                <div className="about-demo-stat-badge">
                  <div className="stat-badge-num">19+</div>
                  <div className="stat-badge-label">Years of workforce excellence</div>
                </div>
              </div>
            </div>

            {/* Right Column: Narrative & 4 Pillars */}
            <div className="about-demo-content-col">
              <span className="about-demo-tag">WHO WE ARE</span>
              <h2 className="about-demo-title">
                Building India’s Workforce. Strengthening India’s Businesses.
              </h2>
              <p className="about-demo-desc">
                Founded in 2007 in Chandigarh under the leadership of Chairman &amp; Managing Director Mrs. Shallu Gaba, MCP Group has evolved into a trusted partner for organizations across the private, public and government sectors. With nearly 50,000 associates and 500+ clients, MCP Group brings together deep industry expertise, technology-enabled workforce solutions and a strong commitment to service excellence.
              </p>

              {/* 2x2 Pillars Grid */}
              <div className="about-demo-pillars-grid">
                
                <div className="about-demo-pillar-item">
                  <div className="pillar-num-badge">01</div>
                  <div className="pillar-text-wrap">
                    <h4>People-Centric Approach</h4>
                    <p>Understanding people to create dependable, future-ready talent solutions.</p>
                  </div>
                </div>

                <div className="about-demo-pillar-item">
                  <div className="pillar-num-badge">02</div>
                  <div className="pillar-text-wrap">
                    <h4>Process &amp; Technology</h4>
                    <p>Automated payroll, attendance tracking, and transparent operational systems.</p>
                  </div>
                </div>

                <div className="about-demo-pillar-item">
                  <div className="pillar-num-badge">03</div>
                  <div className="pillar-text-wrap">
                    <h4>Compliance First</h4>
                    <p>100% statutory adherence (PF, ESIC, Factories Act) and ISO 9001 governance.</p>
                  </div>
                </div>

                <div className="about-demo-pillar-item">
                  <div className="pillar-num-badge">04</div>
                  <div className="pillar-text-wrap">
                    <h4>Industry Expertise</h4>
                    <p>Dedicated sector pods understanding technical plant &amp; corporate needs.</p>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="about-demo-actions">
                <Link to="/about" className="btn btn-primary">
                  <span>About MCP Group</span>
                  <ArrowRight size={15} />
                </Link>
                <Link to="/services" className="btn-intro-outline">
                  <span>Explore Solutions</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Key Metrics Strip */}
              <div className="about-demo-metrics-strip">
                <div className="about-metric-item">
                  <div className="metric-val">19+</div>
                  <div className="metric-lbl">Years Experience</div>
                </div>
                <div className="metric-separator"></div>
                <div className="about-metric-item">
                  <div className="metric-val">50,000+</div>
                  <div className="metric-lbl">Associates</div>
                </div>
                <div className="metric-separator"></div>
                <div className="about-metric-item">
                  <div className="metric-val">500+</div>
                  <div className="metric-lbl">Clients</div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* 4. Our Services Section: 7 Core Solutions */}
      <section className="our-services-home-section" id="our-services">
        <div className="container">
          
          <div className="our-services-home-header">
            <span className="section-tag" style={{ color: 'var(--color-accent)', display: 'block', marginBottom: '8px' }}>
              WHAT WE DO
            </span>
            <h2 className="our-services-home-title">One Group. Multiple Solutions. One Standard of Excellence.</h2>
            <p style={{ color: '#BAC7D5', maxWidth: '750px', margin: '12px auto 0', fontSize: '15px' }}>
              MCP Group offers an integrated portfolio of workforce and business solutions designed around the evolving needs of modern organizations.
            </p>
          </div>

          <div className="our-services-home-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            {[
              {
                id: 'workforce-management',
                title: 'Workforce Management',
                desc: 'End-to-end workforce deployment, staffing, payroll and workforce administration.',
                image: '/images/workforce-management.jpg',
                link: '/services?service=workforce-management'
              },
              {
                id: 'hr-services',
                title: 'Human Resource Services',
                desc: 'Specialized recruitment, talent acquisition, HR support and employee management.',
                image: '/images/about-intro-team.jpg',
                link: '/services?service=hr-services'
              },
              {
                id: 'facility-management',
                title: 'Facility Management',
                desc: 'Professional facility, housekeeping, security support and operational services.',
                image: '/images/facility-management.jpg',
                link: '/services?service=facility-management'
              },
              {
                id: 'bpo-solutions',
                title: 'BPO & Business Process',
                desc: 'Scalable business process and support solutions designed for operational efficiency.',
                image: '/images/hero-split-office.jpg',
                link: '/services?service=bpo-solutions'
              },
              {
                id: 'skill-development',
                title: 'Skill Development',
                desc: 'Industry-oriented training and skill development programs preparing people for tomorrow.',
                image: '/images/skill-development.jpg',
                link: '/services?service=skill-development'
              },
              {
                id: 'education',
                title: 'Education Solutions',
                desc: 'Workforce and education solutions focused on employability, skills and future readiness.',
                image: '/images/hospitality.jpg',
                link: '/services?service=education'
              },
              {
                id: 'compliance-management',
                title: 'Compliance Management',
                desc: 'Structured, process-driven solutions helping organizations meet statutory and regulatory requirements.',
                image: '/images/power-sector.jpg',
                link: '/services?service=compliance-management'
              }
            ].map((service) => (
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
                  <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.5, margin: '8px 0 16px 0' }}>
                    {service.desc}
                  </p>
                  <Link to={service.link} className="btn-service-readmore">
                    <span>Learn More</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Numerical Impact Counters */}
      <section className="impact-stats-section">
        <div className="container">
          <div className="stats-grid">
            
            <div className="stat-card">
              <div className="stat-number-wrap">
                <StatCounter end={19} suffix="+" />
              </div>
              <div className="stat-label">Years of Experience</div>
              <div className="stat-desc">Founded in 2007 in Chandigarh</div>
            </div>

            <div className="stat-card">
              <div className="stat-number-wrap">
                <StatCounter end={50000} suffix="+" />
              </div>
              <div className="stat-label">Associates Nationwide</div>
              <div className="stat-desc">Empowering India's industrial workforce</div>
            </div>

            <div className="stat-card">
              <div className="stat-number-wrap">
                <StatCounter end={500} suffix="+" />
              </div>
              <div className="stat-label">Corporate Clients</div>
              <div className="stat-desc">Across private, public &amp; government sectors</div>
            </div>

            <div className="stat-card">
              <div className="stat-number-wrap">
                <span className="stat-number-text" style={{ fontSize: '38px', fontWeight: 800, color: 'var(--color-accent)' }}>Pan-India</span>
              </div>
              <div className="stat-label">Workforce Network</div>
              <div className="stat-desc">ISO 9001:2008 certified operational discipline</div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Why MCP (Section 06 from Corporate Profile) */}
      <section className="why-mcp-section" id="capabilities">
        <div className="container">
          
          <div className="section-header text-center" style={{ maxWidth: '820px', margin: '0 auto 48px' }}>
            <span className="section-tag">WHY MCP</span>
            <h2 className="section-title">Why Leading Organizations Choose MCP</h2>
            <p className="section-desc">
              The workforce industry is changing. Organizations today need more than people — they need speed, compliance, technology, reliability and strategic workforce thinking.
            </p>
          </div>

          <div className="why-mcp-grid">
            
            <div className="why-mcp-card">
              <div className="why-mcp-icon">
                <Compass size={24} />
              </div>
              <h3>Pan-India Reach</h3>
              <p>Our extensive workforce network enables us to support organizations across multiple manufacturing corridors and corporate hubs nationwide.</p>
            </div>

            <div className="why-mcp-card">
              <div className="why-mcp-icon">
                <Award size={24} />
              </div>
              <h3>Deep Industry Expertise</h3>
              <p>Nearly two decades of experience gives us a strong understanding of diverse industries, shopfloor environments, and operational dynamics.</p>
            </div>

            <div className="why-mcp-card">
              <div className="why-mcp-icon">
                <ShieldCheck size={24} />
              </div>
              <h3>Compliance First</h3>
              <p>We place statutory compliance, governance, labor laws, and process discipline at the heart of every deployment to safeguard clients from risk.</p>
            </div>

            <div className="why-mcp-card">
              <div className="why-mcp-icon">
                <TrendingUp size={24} />
              </div>
              <h3>Scale With Flexibility</h3>
              <p>From specialized technical staffing to large-scale workforce deployment of 1,000+ associates, our solutions adapt seamlessly to business demands.</p>
            </div>

            <div className="why-mcp-card">
              <div className="why-mcp-icon">
                <Users size={24} />
              </div>
              <h3>People-Powered</h3>
              <p>Our greatest strength is our people — supported by robust digital systems, attendance technology, and dedicated on-site operational leadership.</p>
            </div>

            <div className="why-mcp-card">
              <div className="why-mcp-icon">
                <Target size={24} />
              </div>
              <h3>Long-Term Partnerships</h3>
              <p>We focus on building lasting relationships rather than short-term engagements, growing collaboratively with our clients year after year.</p>
            </div>

          </div>

        </div>
      </section>

      {/* 7. Industries We Serve (Section 05 from Profile) */}
      <section className="industries-matrix-section">
        <div className="container">
          
          <div className="section-header text-center" style={{ maxWidth: '800px', margin: '0 auto 48px' }}>
            <span className="section-tag">INDUSTRIES WE SERVE</span>
            <h2 className="section-title">Expertise Across India’s Growth Industries</h2>
            <p className="section-desc">
              Our sector-focused teams understand the unique workforce, operational and compliance requirements of different industries.
            </p>
          </div>

          <div className="industry-pill-grid">
            {industrySectors.map((sector, i) => {
              const SectorIcon = sector.icon;
              return (
                <Link to="/industries" key={i} className="industry-pill-card">
                  <div className="pill-thumb-box">
                    <img src={sector.image} alt={sector.name} className="pill-thumb-img" loading="lazy" />
                    <div className="pill-thumb-icon-overlay">
                      <SectorIcon size={14} />
                    </div>
                  </div>
                  <div className="pill-info">
                    <span className="pill-title">{sector.name}</span>
                    <span className="pill-sub">{sector.placements}</span>
                  </div>
                  <ArrowRight size={16} className="pill-arrow" />
                </Link>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '42px' }}>
            <Link to="/industries" className="btn btn-hero-accent">
              <span>Explore All Sector Practices</span>
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </section>

      {/* 8. Leadership Spotlight (Section 07 from Corporate Profile) */}
      <section className="md-message-section" style={{ padding: '80px 0', background: 'var(--color-bg-light)' }}>
        <div className="container">
          <div className="section-header text-center" style={{ maxWidth: '780px', margin: '0 auto 48px' }}>
            <span className="section-tag">OUR LEADERSHIP</span>
            <h2 className="section-title">Leadership With Vision. Growth With Purpose.</h2>
          </div>

          <div className="md-message-card" style={{ background: '#ffffff', borderRadius: '16px', padding: '40px', boxShadow: '0 12px 36px rgba(0,0,0,0.06)', display: 'grid', gridTemplateColumns: 'minmax(280px, 320px) 1fr', gap: '48px', alignItems: 'center' }}>
            
            {/* Leadership Profile */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '220px', height: '220px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 20px', border: '4px solid var(--color-accent)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80" 
                  alt="Mrs. Shallu Gaba, Chairman & Managing Director" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-primary)', margin: '0 0 4px 0' }}>Mrs. Shallu Gaba</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-accent)', fontWeight: 700, margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Chairman &amp; Managing Director
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'rgba(212, 175, 55, 0.12)', borderRadius: '20px', color: '#b48a28', fontSize: '12px', fontWeight: 700 }}>
                <Award size={14} />
                <span>Founding Leadership • Since 2007</span>
              </div>
            </div>

            {/* Leadership Philosophy & Quote */}
            <div>
              <blockquote style={{ fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--color-primary)', lineHeight: 1.6, borderLeft: '4px solid var(--color-accent)', paddingLeft: '20px', margin: '0 0 20px 0', fontWeight: 600 }}>
                “When people grow, organizations grow. Our responsibility is to create the environment where both can succeed.”
              </blockquote>

              <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '15px', marginBottom: '16px' }}>
                With a clear vision for creating a professionally managed, people-centric organization, Mrs. Shallu Gaba has been instrumental in shaping the growth and direction of MCP Group. Her leadership philosophy combines integrity, operational excellence, innovation and commitment to people.
              </p>

              <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '15px', marginBottom: '24px' }}>
                Under her stewardship, MCP Group has expanded from its Chandigarh roots into a nationwide powerhouse serving over 500 organizations with nearly 50,000 associates, while maintaining an uncompromising focus on quality, statutory compliance and customer satisfaction.
              </p>

              <Link to="/about" className="btn btn-outline-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span>Read Full Corporate Profile</span>
                <ArrowRight size={15} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 9. Final CTA Banner: PEOPLE POWER BUSINESS. And We Power People. */}
      <section className="bottom-cta-banner">
        <div className="container">
          <div className="cta-banner-card">
            
            <div className="cta-banner-content">
              <span style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                MCP GROUP • EMPOWERING WORKFORCE. ENABLING BUSINESS.
              </span>
              <h2>PEOPLE POWER BUSINESS.<br />And We Power People.</h2>
              <p>
                For nearly two decades, MCP Group has connected organizations with the people and solutions they need to move forward. 19+ Years. 50,000+ Associates. 500+ Clients. One Vision.
              </p>
            </div>

            <div className="cta-banner-action">
              <Link to="/contact" className="btn btn-hero-accent btn-lg">
                <span>Talk to Our Team</span>
                <ArrowRight size={18} />
              </Link>
              <a 
                href="tel:+919888426060" 
                className="btn btn-outline-white"
                style={{ fontSize: '14px', padding: '12px 24px' }}
              >
                <Phone size={16} />
                <span>Call Chandigarh HQ: +91 98 8842 6060</span>
              </a>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

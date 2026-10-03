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
  ShieldCheck
} from 'lucide-react';
import StatCounter from '../components/StatCounter';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const heroSlides = [
    {
      subtitle: "EXECUTIVE SEARCH & LEADERSHIP ADVISORY",
      title: "Building the Leadership Bench for Indian Industry",
      description: "We partner with visionary boardrooms and industrial conglomerates to appoint transformational CXOs, Managing Directors, and Board Advisory leaders.",
      ctaText: "Commission a Search",
      ctaLink: "/contact",
      secondaryText: "Explore Practices",
      secondaryLink: "/industries",
      bgImage: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1920&q=80"
    },
    {
      subtitle: "ALL-WEATHER TALENT ALLIES",
      title: "Precision Executive Search Across 20+ Industrial Sectors",
      description: "From heavy engineering and smart factories to renewable energy and advanced robotics, we pinpoint leaders who turn capital into lasting industrial advantage.",
      ctaText: "Explore Industries",
      ctaLink: "/industries",
      secondaryText: "Our Methodology",
      secondaryLink: "/services",
      bgImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80"
    },
    {
      subtitle: "FRACTIONAL CXO & BOARD SUCCESSION",
      title: "Protect. Shape. Advance.",
      description: "Agile leadership solutions for enterprises undergoing rapid turnaround, plant scale-ups, and generational succession.",
      ctaText: "Deploy Interim Leaders",
      ctaLink: "/services#fractional-cxo",
      secondaryText: "Board Advisory",
      secondaryLink: "/services#board-advisory",
      bgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
    }
  ];

  const testimonials = [
    {
      quote: "MCP CONSULTANTS conducted our Group Chief Operating Officer search with extraordinary discretion and industrial insight. Their partners grasped the nuances of our manufacturing plant turnaround immediately. The leader they placed has delivered record plant efficiency within 18 months.",
      author: "Chairman & Managing Director",
      company: "Listed Heavy Engineering Conglomerate (India)",
      sector: "Heavy Manufacturing"
    },
    {
      quote: "Finding an interim CEO with both industrial robotics expertise and German joint-venture governance seemed impossible. MCP delivered a qualified CXO shortlist in 21 days. A truly bespoke retained advisory practice.",
      author: "Promoter & Vice Chairman",
      company: "Leading Industrial Robotics & Automation Group",
      sector: "Robotics & Automation"
    },
    {
      quote: "Their forensic vetting and board succession methodology are second to none. They appointed three high-caliber Independent Directors who have transformed our boardroom governance and ESG alignment.",
      author: "NRC Committee Chair & Board Member",
      company: "National Renewable Energy & EPC Corporation",
      sector: "Clean Energy & Infrastructure"
    }
  ];

  const industrySectors = [
    { name: "Heavy Engineering & Capital Goods", icon: Factory, placements: "MD, COO, Plant Heads" },
    { name: "Industrial Automation & Robotics", icon: Cpu, placements: "VP R&D, Tech Directors" },
    { name: "Automotive & EV Mobility", icon: Zap, placements: "Chief Engineers, Ops Heads" },
    { name: "Renewable Energy & Clean Tech", icon: TrendingUp, placements: "Project Directors, CFOs" },
    { name: "Metals, Mining & Steel", icon: Layers, placements: "Site Directors, Supply VP" },
    { name: "Chemicals & Process Polymers", icon: Sparkles, placements: "EHS Directors, Plant VPs" },
    { name: "Cement & Building Materials", icon: Building2, placements: "Cluster Heads, Sales CXOs" },
    { name: "Aerospace & Defense Production", icon: Shield, placements: "Quality VPs, Program MDs" },
    { name: "Power Generation & Grid Systems", icon: Zap, placements: "Grid Heads, Asset Leads" },
    { name: "Supply Chain, Ports & Logistics", icon: Compass, placements: "Chief Logistics Officers" },
    { name: "Packaging & Advanced Materials", icon: Factory, placements: "Business Unit MDs" },
    { name: "Infrastructure & Mega EPC Projects", icon: Target, placements: "Project VPs, Legal Heads" }
  ];

  useEffect(() => {
    const heroTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(heroTimer);
  }, [heroSlides.length]);

  return (
    <div className="home-page">
      
      {/* 1. Hero Slider */}
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

      {/* 2. Executive Trust Ribbon */}
      <div className="hero-trust-ribbon">
        <div className="container">
          <div className="trust-ribbon-grid">
            
            <div className="trust-ribbon-item">
              <div className="trust-ribbon-icon">
                <Award size={20} />
              </div>
              <div className="trust-ribbon-text">
                <strong>35+ Years Heritage</strong>
                <span>Pioneering industrial search since 1989</span>
              </div>
            </div>

            <div className="trust-ribbon-item">
              <div className="trust-ribbon-icon">
                <Users size={20} />
              </div>
              <div className="trust-ribbon-text">
                <strong>1,450+ CXO Appointees</strong>
                <span>Managing Directors, COOs &amp; Board Chairs</span>
              </div>
            </div>

            <div className="trust-ribbon-item">
              <div className="trust-ribbon-icon">
                <Lock size={20} />
              </div>
              <div className="trust-ribbon-text">
                <strong>100% Confidential Mandates</strong>
                <span>Forensic vetting &amp; strict discretion</span>
              </div>
            </div>

            <div className="trust-ribbon-item">
              <div className="trust-ribbon-icon">
                <Factory size={20} />
              </div>
              <div className="trust-ribbon-text">
                <strong>20+ Industrial Verticals</strong>
                <span>Deep manufacturing &amp; engineering roots</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Company Introduction: Experience that understands your industry (Per Demo Picture) */}
      <section className="about-demo-intro-section" id="about-intro">
        
        {/* Sleek Sector Ticker Bar (Matching top of Demo Picture 1) */}
        <div className="demo-ticker-bar">
          <div className="container demo-ticker-container">
            <span className="demo-ticker-left">Trusted recruitment expertise for 20+ years</span>
            <div className="demo-ticker-tags">
              <span>PHARMA</span>
              <span className="ticker-dot">•</span>
              <span>SHEET METAL</span>
              <span className="ticker-dot">•</span>
              <span>AUTOMOBILE</span>
              <span className="ticker-dot">•</span>
              <span>POWER SECTOR</span>
              <span className="ticker-dot">•</span>
              <span>RETAIL &amp; EV</span>
            </div>
          </div>
        </div>

        <div className="container about-demo-main-container">
          <div className="about-demo-grid">
            
            {/* Left Column: Rounded Feature Photo with Inset 20+ Badge */}
            <div className="about-demo-photo-col">
              <div className="about-demo-photo-card">
                <img 
                  src="/images/about-intro-team.jpg" 
                  alt="MCP Consultants Team" 
                  className="about-demo-img"
                  loading="lazy"
                />
                
                {/* Inset Badge matching Demo Picture 1 */}
                <div className="about-demo-stat-badge">
                  <div className="stat-badge-num">20+</div>
                  <div className="stat-badge-label">Years of industry experience</div>
                </div>
              </div>
            </div>

            {/* Right Column: Narrative & 2x2 Feature Grid */}
            <div className="about-demo-content-col">
              <span className="about-demo-tag">ABOUT MCP CONSULTANTS</span>
              <h2 className="about-demo-title">
                Experience that understands your industry.
              </h2>
              <p className="about-demo-desc">
                For over two decades, MCP Consultants has helped organisations build teams that support their operational and business goals. Our approach combines recruitment expertise with an understanding of the specialised workforce requirements of industrial, manufacturing, and pharmaceutical businesses.
              </p>

              {/* 2x2 Pillars Grid */}
              <div className="about-demo-pillars-grid">
                
                <div className="about-demo-pillar-item">
                  <div className="pillar-num-badge">01</div>
                  <div className="pillar-text-wrap">
                    <h4>Industry Understanding</h4>
                    <p>Recruitment aligned to the realities of specialised sectors.</p>
                  </div>
                </div>

                <div className="about-demo-pillar-item">
                  <div className="pillar-num-badge">02</div>
                  <div className="pillar-text-wrap">
                    <h4>Quality Talent</h4>
                    <p>Focused sourcing and screening for relevant profiles.</p>
                  </div>
                </div>

                <div className="about-demo-pillar-item">
                  <div className="pillar-num-badge">03</div>
                  <div className="pillar-text-wrap">
                    <h4>Long-Term Focus</h4>
                    <p>Relationships built around consistency and trust.</p>
                  </div>
                </div>

                <div className="about-demo-pillar-item">
                  <div className="pillar-num-badge">04</div>
                  <div className="pillar-text-wrap">
                    <h4>Responsive Support</h4>
                    <p>Clear communication from requirement to placement.</p>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="about-demo-actions">
                <Link to="/about" className="btn btn-primary">
                  <span>About Our Firm</span>
                  <ArrowRight size={15} />
                </Link>
                <Link to="/services" className="btn-intro-outline">
                  <span>Explore Our Expertise</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Key Industry Metrics Strip (From Demo Reference) */}
              <div className="about-demo-metrics-strip">
                <div className="about-metric-item">
                  <div className="metric-val">20+</div>
                  <div className="metric-lbl">Years Experience</div>
                </div>
                <div className="metric-separator"></div>
                <div className="about-metric-item">
                  <div className="metric-val">20+</div>
                  <div className="metric-lbl">Core Industries</div>
                </div>
                <div className="metric-separator"></div>
                <div className="about-metric-item">
                  <div className="metric-val">Long-term</div>
                  <div className="metric-lbl">Client Relationships</div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* 4. Our Services Section (Replaces All-Weather Leadership Allies per Reference Design) */}
      <section className="our-services-home-section" id="our-services">
        <div className="container">
          
          <div className="our-services-home-header">
            <h2 className="our-services-home-title">Our Services</h2>
          </div>

          <div className="our-services-home-grid">
            {[
              {
                id: 'workforce-management',
                title: 'Workforce Management',
                image: '/images/workforce-management.jpg',
                link: '/services?service=workforce-management'
              },
              {
                id: 'power-sector',
                title: 'Power Sector',
                image: '/images/power-sector.jpg',
                link: '/services?service=power-sector'
              },
              {
                id: 'retail-ev',
                title: 'Retail & EV',
                image: '/images/retail-ev.jpg',
                link: '/services?service=retail-ev'
              },
              {
                id: 'hospitality',
                title: 'Hospitality',
                image: '/images/hospitality.jpg',
                link: '/services?service=hospitality'
              },
              {
                id: 'skill-development',
                title: 'Skill Development & Education',
                image: '/images/skill-development.jpg',
                link: '/services?service=skill-development'
              },
              {
                id: 'facility-management',
                title: 'Facility Management & BPO',
                image: '/images/facility-management.jpg',
                link: '/services?service=facility-management'
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
                  <Link to={service.link} className="btn-service-readmore">
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Numerical Impact Counters (Full-Width Dark Navy Bar) */}
      <section className="impact-stats-section">
        <div className="container">
          <div className="stats-grid">
            
            <div className="stat-card">
              <div className="stat-number-wrap">
                <StatCounter end={35} suffix="+" />
              </div>
              <div className="stat-label">Years of Advisory Heritage</div>
              <div className="stat-desc">Serving 3 generations of promoters</div>
            </div>

            <div className="stat-card">
              <div className="stat-number-wrap">
                <StatCounter end={1450} suffix="+" />
              </div>
              <div className="stat-label">CXO &amp; Board Placements</div>
              <div className="stat-desc">Transformational leaders across India</div>
            </div>

            <div className="stat-card">
              <div className="stat-number-wrap">
                <StatCounter end={98} suffix="%" />
              </div>
              <div className="stat-label">Mandate Completion Rate</div>
              <div className="stat-desc">Industry-leading execution discipline</div>
            </div>

            <div className="stat-card">
              <div className="stat-number-wrap">
                <StatCounter end={20} suffix="+" />
              </div>
              <div className="stat-label">Dedicated Industrial Verticals</div>
              <div className="stat-desc">Deep sector manufacturing pods</div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Why MCP CONSULTANTS Differentiators */}
      <section className="why-mcp-section">
        <div className="container">
          
          <div className="section-header text-center" style={{ maxWidth: '820px', margin: '0 auto 48px' }}>
            <span className="section-tag">THE MCP ADVANTAGE</span>
            <h2 className="section-title">Why Promoters Choose Retained Advisory</h2>
            <p className="section-desc">
              Conventional recruitment agencies flood your inbox with unvetted resumes. We operate as your confidential boardroom search partner with rigorous forensic vetting.
            </p>
          </div>

          <div className="why-mcp-grid">
            
            <div className="why-mcp-card">
              <div className="why-mcp-icon">
                <Target size={24} />
              </div>
              <h3>Partner-Led Execution</h3>
              <p>Every mandate is spearheaded directly by a Senior Practice Partner. Your boardroom search is never delegated to junior associates.</p>
            </div>

            <div className="why-mcp-card">
              <div className="why-mcp-icon">
                <Factory size={24} />
              </div>
              <h3>Deep Industrial Roots</h3>
              <p>We do not recruit generic profiles. Our consultants possess hands-on domain knowledge across heavy engineering, robotics, steel, and plant operations.</p>
            </div>

            <div className="why-mcp-card">
              <div className="why-mcp-icon">
                <Shield size={24} />
              </div>
              <h3>Forensic Track Record Audits</h3>
              <p>Beyond standard CVs: we conduct confidential 360-degree peer references, regulatory checks, and culture alignment appraisals before presentation.</p>
            </div>

            <div className="why-mcp-card">
              <div className="why-mcp-icon">
                <Award size={24} />
              </div>
              <h3>1-Year Placement Guarantee</h3>
              <p>We stay invested throughout the leader's first 365 days, providing transition coaching to ensure strategic milestones are met seamlessly.</p>
            </div>

          </div>

        </div>
      </section>

      {/* 7. Core Industrial Practices Matrix */}
      <section className="industries-matrix-section">
        <div className="container">
          
          <div className="section-header text-center" style={{ maxWidth: '800px', margin: '0 auto 48px' }}>
            <span className="section-tag">SECTOR INTELLIGENCE</span>
            <h2 className="section-title">Deep Specialization in Indian Manufacturing</h2>
            <p className="section-desc">
              We focus exclusively on heavy industry, robotics, plant scale-ups, renewable energy, and infrastructure ecosystems.
            </p>
          </div>

          <div className="industry-pill-grid">
            {industrySectors.map((sector, i) => {
              const SectorIcon = sector.icon;
              return (
                <Link to="/industries" key={i} className="industry-pill-card">
                  <div className="pill-icon-box">
                    <SectorIcon size={20} />
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
              <span>View All 20+ Practice Hubs</span>
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </section>

      {/* 8. Executive Testimonials Carousel */}
      <section className="testimonials-section">
        <div className="container">
          
          <div className="section-header text-center" style={{ maxWidth: '720px', margin: '0 auto 36px' }}>
            <span className="section-tag">BOARDROOM VOICES</span>
            <h2 className="section-title">Trusted by Promoters &amp; Board Chairs</h2>
          </div>

          <div className="testimonials-container">
            <div className="testimonial-card-single">
              
              <div className="testimonial-header">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="#eab308" color="#eab308" />
                  ))}
                </div>
                <div className="verified-badge">
                  <CheckCircle2 size={13} />
                  <span>Verified Executive Mandate</span>
                </div>
              </div>

              <div className="quote-mark">“</div>
              <p className="testimonial-quote">
                {testimonials[currentTestimonial].quote}
              </p>

              <div className="testimonial-author-wrap">
                <div className="testimonial-author">
                  <strong>{testimonials[currentTestimonial].author}</strong>
                  <span>{testimonials[currentTestimonial].company}</span>
                </div>

                <div className="testimonial-nav-controls">
                  <button 
                    className="testi-arrow prev" 
                    onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                    aria-label="Previous Testimonial"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className="testi-dots" style={{ display: 'flex', gap: '6px' }}>
                    {testimonials.map((_, i) => (
                      <button 
                        key={i} 
                        className={`testi-dot ${i === currentTestimonial ? 'active' : ''}`}
                        onClick={() => setCurrentTestimonial(i)}
                        aria-label={`Testimonial ${i + 1}`}
                      />
                    ))}
                  </div>
                  <button 
                    className="testi-arrow next" 
                    onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                    aria-label="Next Testimonial"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 9. Bottom Executive CTA Banner */}
      <section className="bottom-cta-banner">
        <div className="container">
          <div className="cta-banner-card">
            
            <div className="cta-banner-content">
              <h2>Ready to Build Your Next-Generation Leadership Bench?</h2>
              <p>
                Speak confidentially with our Senior Practice Leaders regarding upcoming CXO appointments, boardroom succession, or forensic talent audits.
              </p>
            </div>

            <div className="cta-banner-action">
              <Link to="/contact" className="btn btn-hero-accent btn-lg">
                <span>Commission a Mandate</span>
                <ArrowRight size={18} />
              </Link>
              <a 
                href="tel:+919888426060" 
                className="btn btn-outline-white"
                style={{ fontSize: '14px', padding: '12px 24px' }}
              >
                <Phone size={16} />
                <span>Call Mohali HQ: +91 98 8842 6060</span>
              </a>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

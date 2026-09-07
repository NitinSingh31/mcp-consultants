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
  CheckCircle,
  Building2,
  Compass
} from 'lucide-react';
import StatCounter from '../components/StatCounter';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="home-page">
      
      {/* 1. Hero Slider */}
      <section className="hero-slider-section">
        {heroSlides.map((slide, idx) => (
          <div 
            key={idx}
            className={`hero-slide ${idx === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `linear-gradient(rgba(7, 17, 32, 0.78), rgba(11, 26, 47, 0.88)), url('${slide.bgImage}')` }}
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
                  <Link to={slide.ctaLink} className="btn btn-primary btn-lg">
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

      {/* 2. Core Manifesto: Protect. Shape. Advance */}
      <section className="manifesto-section">
        <div className="container">
          <div className="manifesto-grid">
            <div className="manifesto-intro">
              <span className="section-tag">OUR ESSENCE</span>
              <h2 className="section-title">A Higher Benchmark in Executive Search</h2>
              <p className="section-desc">
                In an era of industrial transformation, the wrong executive hire is a multi-crore risk. MCP CONSULTANTS was founded on an unyielding principle: to be the board’s trusted partner in identifying, appraising, and integrating leaders capable of transforming industrial enterprises.
              </p>
            </div>
            <div className="manifesto-pillars">
              <div className="pillar-card">
                <div className="pillar-icon"><Shield size={28} /></div>
                <h3>PROTECT</h3>
                <p>Safeguarding institutional reputation and shareholder value through rigorous 360-degree vetting and forensic track record audits.</p>
              </div>
              <div className="pillar-card">
                <div className="pillar-icon"><Compass size={28} /></div>
                <h3>SHAPE</h3>
                <p>Architecting leadership benches that thrive in automation, Industry 4.0, decarbonization, and supply-chain recalibration.</p>
              </div>
              <div className="pillar-card">
                <div className="pillar-icon"><TrendingUp size={28} /></div>
                <h3>ADVANCE</h3>
                <p>Propelling growth and operational agility by appointing game-changing executives who deliver sustainable long-term returns.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. All-Weather Allies - Services Showcase */}
      <section className="services-showcase-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">PRACTICE CAPABILITIES</span>
            <h2 className="section-title">All-Weather Leadership Allies</h2>
            <p className="section-subtitle">
              Comprehensive talent intelligence solutions tailored for high-growth enterprises and listed corporations
            </p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-card-header">
                <Target className="service-card-icon" size={32} />
                <span className="service-number">01</span>
              </div>
              <h3>Executive Search</h3>
              <p>Retained, confidential CXO and Managing Director search mandates executed with forensic precision and deep sector intelligence.</p>
              <Link to="/services#executive-search" className="service-link">
                <span>Learn More</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="service-card">
              <div className="service-card-header">
                <Users className="service-card-icon" size={32} />
                <span className="service-number">02</span>
              </div>
              <h3>Fractional CXO &amp; Interim</h3>
              <p>Battle-tested interim COOs, CFOs, and Transformation Directors deployable immediately for turnarounds and greenfield plant scale-ups.</p>
              <Link to="/services#fractional-cxo" className="service-link">
                <span>Learn More</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="service-card">
              <div className="service-card-header">
                <Building2 className="service-card-icon" size={32} />
                <span className="service-number">03</span>
              </div>
              <h3>Board Advisory &amp; Governance</h3>
              <p>Appointing visionary Independent Directors, Board Chairs, and conducting boardroom effectiveness and ESG succession reviews.</p>
              <Link to="/services#board-advisory" className="service-link">
                <span>Learn More</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="service-card">
              <div className="service-card-header">
                <Briefcase className="service-card-icon" size={32} />
                <span className="service-number">04</span>
              </div>
              <h3>Talent Diagnostics &amp; Audit</h3>
              <p>Psychometric evaluations, 360-degree reference audits, compensation benchmarking, and family business succession mapping.</p>
              <Link to="/services#talent-advisory" className="service-link">
                <span>Learn More</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Numerical Impact Counters */}
      <section className="impact-stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <StatCounter end={35} suffix="+" />
              <div className="stat-label">Years of Advisory Heritage</div>
            </div>
            <div className="stat-card">
              <StatCounter end={1450} suffix="+" />
              <div className="stat-label">CXO &amp; Board Placements</div>
            </div>
            <div className="stat-card">
              <StatCounter end={98} suffix="%" />
              <div className="stat-label">Mandate Completion Rate</div>
            </div>
            <div className="stat-card">
              <StatCounter end={20} suffix="+" />
              <div className="stat-label">Dedicated Industrial Verticals</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Core Industrial Practices Matrix */}
      <section className="industries-matrix-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">SECTOR INTELLIGENCE</span>
            <h2 className="section-title">Deep Specialization in Indian Manufacturing</h2>
            <p className="section-subtitle">
              We focus exclusively on heavy industry, automation, process plants, and infrastructure ecosystems
            </p>
          </div>

          <div className="industry-pill-grid">
            {[
              "Heavy Engineering & Capital Goods",
              "Industrial Automation & Robotics",
              "Automotive & EV Mobility",
              "Renewable Energy & Clean Tech",
              "Metals, Mining & Steel",
              "Chemicals, Petrochemicals & Polymers",
              "Cement & Building Materials",
              "Aerospace & Defense Production",
              "Power Generation & Transmission",
              "Supply Chain, Ports & Logistics",
              "Packaging & Processed Materials",
              "Infrastructure & Mega EPC Projects"
            ].map((sector, i) => (
              <Link to="/industries" key={i} className="industry-pill-card">
                <Factory size={18} className="pill-icon" />
                <span>{sector}</span>
                <ArrowRight size={14} className="pill-arrow" />
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link to="/industries" className="btn btn-primary">
              <span>View All 20+ Practice Hubs</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Executive Testimonials Carousel */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">TESTIMONIALS</span>
            <h2 className="section-title">Trusted by Boardrooms &amp; Promoters</h2>
          </div>

          <div className="testimonial-card-single">
            <div className="quote-mark">“</div>
            <p className="testimonial-quote">
              MCP CONSULTANTS conducted our Group Chief Operating Officer search with extraordinary discretion and industrial insight. Their partners grasped the nuances of our manufacturing plant turnaround immediately. The leader they placed has delivered record plant efficiency within 18 months.
            </p>
            <div className="testimonial-author">
              <strong>Chairman &amp; Managing Director</strong>
              <span>Listed Heavy Engineering Conglomerate (India)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Bottom CTA Banner */}
      <section className="bottom-cta-banner">
        <div className="container">
          <div className="cta-banner-card">
            <div className="cta-banner-content">
              <h2>Ready to Shape Your Leadership Bench?</h2>
              <p>Speak confidentially with our Senior Practice Leaders regarding your upcoming board or executive appointments.</p>
            </div>
            <div className="cta-banner-action">
              <Link to="/contact" className="btn btn-primary btn-lg">
                <span>Commission a Mandate</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

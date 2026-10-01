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
  Eye,
  Quote,
  Building2,
  Briefcase,
  Sparkles,
  Clock,
  Zap,
  Shield,
  TrendingUp,
  Factory,
  UserCheck,
  Lock,
  PhoneCall
} from 'lucide-react';

export default function About() {
  const leadershipTeam = [
    {
      name: "Shallu Sharma",
      role: "Managing Director & Head of Industrial Practices",
      bio: "Over 22 years advising industrial conglomerates, automotive OEMs, and heavy EPC enterprises on executive leadership appointments.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Shikha Malhotra",
      role: "Senior Partner — Board Advisory & Fractional CXO",
      bio: "Specializes in boardroom governance, independent director succession, and agile executive deployment across process manufacturing.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Rajeev Singhal",
      role: "Senior Partner — Energy, Power & CleanTech",
      bio: "Advises listed utility giants and renewable energy developers on C-suite leadership and international market entry.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const differentiators = [
    {
      icon: UserCheck,
      title: "100% Partner-Led Mandate Execution",
      description: "Every search is directed personally by a Senior Practice Partner from inception to boardroom presentation. Your search is never delegated to junior recruiters or call centers."
    },
    {
      icon: Factory,
      title: "Exclusively Industrial & Core Manufacturing",
      description: "We do not dilute our focus with generic IT or volume staffing. Our partners possess deep domain fluency across heavy engineering, automotive/EV, energy, steel, pharma, and technical textiles."
    },
    {
      icon: ShieldCheck,
      title: "Forensic 360° Track Record Audits",
      description: "Beyond conventional resumes, we conduct confidential peer appraisals, vendor/client cross-verifications, and regulatory integrity checks before presenting any candidate."
    },
    {
      icon: Target,
      title: "Confidential Passive Talent Mapping",
      description: "Over 90% of leaders we place are passive executives who are not actively on job portals. We maintain discrete relationships with the top 5% of proven industrial minds."
    },
    {
      icon: Zap,
      title: "Agile Velocity with Uncompromised Rigor",
      description: "A benchmarked, deeply appraised candidate dossier is presented to your board within 14 to 21 business days, accelerating your plant milestones and growth targets."
    },
    {
      icon: Award,
      title: "The 100-Day Executive Integration Shield",
      description: "Our partnership continues well past the appointment letter. We stay actively engaged through the appointee's first 100 days to safeguard cultural alignment and operational ROI."
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
          <h1 className="page-hero-title">Protect. Shape. Advance.</h1>
          <p className="page-hero-subtitle">
            A boutique leadership advisory and executive search firm anchored in the conviction that transformational industrial enterprises require visionary, uncompromising leaders.
          </p>
        </div>
      </section>

      {/* 2. Key Metrics Ribbon */}
      <section className="about-stats-ribbon">
        <div className="container">
          <div className="about-stats-grid">
            <div className="about-stat-item">
              <span className="about-stat-number">35+ Years</span>
              <span className="about-stat-label">Advisory Heritage</span>
              <span className="about-stat-sub">Serving 3 generations of promoters</span>
            </div>
            <div className="about-stat-item">
              <span className="about-stat-number">1,450+</span>
              <span className="about-stat-label">CXO &amp; Board Appointees</span>
              <span className="about-stat-sub">Managing Directors, COOs &amp; Plant Heads</span>
            </div>
            <div className="about-stat-item">
              <span className="about-stat-number">100%</span>
              <span className="about-stat-label">Partner-Led Execution</span>
              <span className="about-stat-sub">Zero delegation to junior recruiters</span>
            </div>
            <div className="about-stat-item">
              <span className="about-stat-number">98%</span>
              <span className="about-stat-label">Mandate Completion Rate</span>
              <span className="about-stat-sub">Forensic precision &amp; retention guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. About Us Introduction */}
      <section className="about-intro-section">
        <div className="container">
          <div className="about-intro-grid">
            
            {/* Left Narrative */}
            <div className="about-narrative-text">
              <span className="section-tag">WHO WE ARE</span>
              <h2 className="section-title" style={{ fontSize: '36px', marginBottom: '24px', lineHeight: 1.25 }}>
                The Boardroom’s Trusted Talent Ally for Indian Industry
              </h2>
              
              <p>
                Founded to address the specialized talent demands of India’s core industrial sectors, <strong>MCP CONSULTANTS</strong> is a specialized retained executive search and leadership advisory firm. We partner exclusively with industrial conglomerates, family-owned enterprises, multinational corporations, and private equity sponsors to recruit transformational business leaders.
              </p>

              <p>
                Unlike transactional recruitment agencies that flood executive inboxes with unfiltered resumes, we operate as a strategic boardroom extension. Every engagement is rooted in deep technical understanding of plant economics, manufacturing modernization, and executive culture alignment.
              </p>

              <p>
                From turning around stressed capital assets to scaling greenfield gigafactories, the leaders we appoint do not merely manage operations—they protect shareholder equity, shape Industry 4.0 capabilities, and advance long-term market leadership.
              </p>

              <div className="about-feature-checks">
                <div className="about-check-item">
                  <CheckCircle2 size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Exclusive dedication to Manufacturing, Engineering, Energy, Pharma &amp; Process Sectors</span>
                </div>
                <div className="about-check-item">
                  <CheckCircle2 size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Confidential mapping of passive, high-performing executive leaders</span>
                </div>
                <div className="about-check-item">
                  <CheckCircle2 size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>360-degree forensic due diligence and governance verification</span>
                </div>
              </div>
            </div>

            {/* Right Blueprint Card */}
            <div className="about-blueprint-card">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent)', fontWeight: 800, fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '20px' }}>
                <Sparkles size={16} />
                <span>Executive Search Blueprint</span>
              </div>
              
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', marginBottom: '16px', lineHeight: 1.3 }}>
                Grounded in Rigor, Discretion &amp; Industrial Mastery
              </h3>
              
              <p style={{ fontSize: '14.5px', color: '#cbd5e1', lineHeight: 1.7, marginBottom: '24px' }}>
                We believe that in an era of industrial transformation, the cost of an executive mis-hire is catastrophic. Our retained methodology safeguards your organization through forensic precision.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Shield size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '15px', color: '#ffffff' }}>Strict Confidentiality</strong>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>Protecting corporate strategy and executive career privacy under strict non-disclosure.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <TrendingUp size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '15px', color: '#ffffff' }}>Value Creation Focus</strong>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>Appointees appraised on proven track records of plant turnaround, margin expansion, and safety governance.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Building2 size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '15px', color: '#ffffff' }}>Boardroom Continuity</strong>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>Aligning promoters, independent directors, and succession planning for generational resilience.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Message from Managing Director */}
      <section className="md-message-section">
        <div className="container">
          
          <div className="section-header text-center" style={{ maxWidth: '780px', margin: '0 auto 48px' }}>
            <span className="section-tag">LEADERSHIP PERSPECTIVE</span>
            <h2 className="section-title">A Message from Our Managing Director</h2>
            <p className="section-subtitle">
              Reflections on leadership, industrial transformation, and our enduring fiduciary responsibility to the boardroom
            </p>
          </div>

          <div className="md-message-card">
            
            {/* Left: MD Portrait & Credentials */}
            <div className="md-profile-col">
              <div className="md-portrait-frame">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80" 
                  alt="Shallu Sharma, Managing Director"
                />
              </div>
              <div className="md-name">Shallu Sharma</div>
              <div className="md-role">Managing Director</div>
              <div className="md-firm">MCP CONSULTANTS</div>
              
              <div style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(196, 154, 69, 0.12)', borderRadius: '20px', color: 'var(--color-accent)', fontSize: '12px', fontWeight: 700 }}>
                <Award size={14} />
                <span>22+ Years in Executive Search</span>
              </div>
            </div>

            {/* Right: Message Letter */}
            <div className="md-text-col">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent)', marginBottom: '16px' }}>
                <Quote size={32} />
              </div>

              <blockquote className="md-quote-lead">
                “In an era of industrial resurgence, technology transformation, and green manufacturing, the single greatest competitive moat of an enterprise is not its plant machinery or capital—it is the caliber of leaders steering it.”
              </blockquote>

              <div className="md-body-text">
                <p>
                  <strong>Dear Board Members, Promoters, and Industrial Leaders,</strong>
                </p>
                <p>
                  When MCP Consultants was founded, India’s industrial economy was embarking on a modern chapter. Over the past three decades, we have had the privilege of walking alongside family-owned conglomerates, engineering titans, and visionary investors as they built the infrastructure and manufacturing backbone of modern India.
                </p>
                <p>
                  Today, that mandate is more urgent than ever. As Indian enterprises leap forward into Industry 4.0, advanced robotics, green energy, EV supply chains, and complex global regulatory landscapes, the standard for executive leadership has shifted dramatically. A Chief Executive or Operations Head must combine deep, hands-on plant floor wisdom with digital agility, environmental stewardship, and boardroom gravitas.
                </p>
                <p>
                  At MCP, we hold an unyielding conviction: an executive placement is never a transaction. It is a long-term fiduciary partnership. That is why our partners personally spearhead every search, conduct forensic reference checks, and remain actively invested through the leader’s first 100 days.
                </p>
                <p>
                  We are deeply honored by the enduring trust placed in us by boards and promoters across the country. We invite you to experience the clarity, discretion, and impact of a truly partner-led search.
                </p>
              </div>

              <div className="md-signoff">
                <div>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: '20px', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '1px' }}>
                    Shallu Sharma
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>
                    Managing Director &amp; Head of Industrial Practices
                  </div>
                </div>

                <Link to="/contact" className="btn btn-outline-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
                  <span>Initiate Confidential Discussion</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. Our Vision & Our Mission */}
      <section className="vision-mission-section">
        <div className="container">
          
          <div className="section-header text-center" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <span className="section-tag" style={{ color: 'var(--color-accent)' }}>STRATEGIC ANCHORS</span>
            <h2 className="section-title" style={{ color: '#ffffff' }}>Our Vision &amp; Our Mission</h2>
            <p className="section-subtitle" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              The bedrock principles guiding our boardroom advisory, talent diagnostics, and leadership appointments
            </p>
          </div>

          <div className="vision-mission-grid">
            
            {/* OUR VISION */}
            <div className="vm-card">
              <div className="vm-badge">
                <Compass size={16} />
                <span>The Future We Build</span>
              </div>
              <h3 className="vm-title">Our Vision</h3>
              <p className="vm-statement">
                “To be the definitive boardroom talent ally for India’s industrial engine—empowering manufacturing conglomerates, mid-market champions, and emerging technology pioneers to achieve global dominance through transformative, visionary leadership.”
              </p>

              <ul className="vm-list">
                <li className="vm-list-item">
                  <CheckCircle2 size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Catalyzing India’s Manufacturing Ambition:</strong> Powering enterprises driving Make-in-India, green energy transition, and global export competitiveness.</span>
                </li>
                <li className="vm-list-item">
                  <CheckCircle2 size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Setting the Highest Benchmark in Executive Search:</strong> Establishing an unmatched industry standard of discretion, forensic due diligence, and partner engagement.</span>
                </li>
                <li className="vm-list-item">
                  <CheckCircle2 size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Sustaining Generational Leadership:</strong> Architecting seamless promoter-to-professional leadership and board succession roadmaps.</span>
                </li>
              </ul>
            </div>

            {/* OUR MISSION */}
            <div className="vm-card">
              <div className="vm-badge">
                <Target size={16} />
                <span>The Purpose We Serve</span>
              </div>
              <h3 className="vm-title">Our Mission</h3>
              <p className="vm-statement">
                “To appraise, secure, and integrate high-impact executive leadership with unyielding discretion, rigorous forensic due diligence, and deep industrial domain insight—safeguarding institutional capital and accelerating enterprise value.”
              </p>

              <ul className="vm-list">
                <li className="vm-list-item">
                  <CheckCircle2 size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Zero Delegation, 100% Partner Execution:</strong> Ensuring every search mandate is led directly by senior practice partners with proven domain expertise.</span>
                </li>
                <li className="vm-list-item">
                  <CheckCircle2 size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Forensic Track-Record Verification:</strong> Safeguarding client reputation through exhaustive 360° references, regulatory audits, and culture appraisals.</span>
                </li>
                <li className="vm-list-item">
                  <CheckCircle2 size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>100-Day Executive Integration Shield:</strong> Providing structured onboarding stewardship to guarantee immediate leadership impact and long-term retention.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 6. Why MCP (Core Differentiators) */}
      <section className="why-mcp-section">
        <div className="container">
          
          <div className="section-header text-center" style={{ maxWidth: '820px', margin: '0 auto 20px' }}>
            <span className="section-tag">WHY MCP CONSULTANTS</span>
            <h2 className="section-title">Why Promoters &amp; Boards Choose Retained Advisory</h2>
            <p className="section-desc">
              Generic staffing agencies flood inboxes with unvetted resumes. We operate as your confidential boardroom search partner with rigorous forensic vetting and deep industrial roots.
            </p>
          </div>

          <div className="why-mcp-cards-grid">
            {differentiators.map((item, idx) => {
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

      {/* 7. Senior Leadership Team */}
      <section className="leadership-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">LEADERSHIP</span>
            <h2 className="section-title">The Partners Behind Every Mandate</h2>
            <p className="section-subtitle">
              Veteran search practitioners with deep industrial networks and unmatched boardroom trust
            </p>
          </div>

          <div className="leadership-grid">
            {leadershipTeam.map((member, idx) => (
              <div key={idx} className="leader-card">
                <div className="leader-img-box">
                  <img 
                    src={member.image} 
                    alt={member.name}
                  />
                </div>
                <div className="leader-info">
                  <div className="leader-name">{member.name}</div>
                  <div className="leader-role">{member.role}</div>
                  <p className="leader-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Workplace Culture & Core Values */}
      <section className="values-section" style={{ padding: '80px 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">CORE VALUES</span>
            <h2 className="section-title">The Principles We Stand By</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginTop: '40px' }}>
            <div className="value-card" style={{ padding: '30px', background: 'var(--color-bg-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)' }}>
              <ShieldCheck size={32} color="var(--color-accent)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', marginBottom: '10px', color: 'var(--color-primary)' }}>Confidentiality</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-body)', lineHeight: 1.6 }}>Complete discretion protects client competitive positioning and executive career trajectories.</p>
            </div>
            <div className="value-card" style={{ padding: '30px', background: 'var(--color-bg-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)' }}>
              <Award size={32} color="var(--color-accent)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', marginBottom: '10px', color: 'var(--color-primary)' }}>Rigorous Vetting</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-body)', lineHeight: 1.6 }}>We investigate past plant output, governance history, and peer feedback before any candidate reaches your table.</p>
            </div>
            <div className="value-card" style={{ padding: '30px', background: 'var(--color-bg-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)' }}>
              <Users size={32} color="var(--color-accent)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', marginBottom: '10px', color: 'var(--color-primary)' }}>Long-Term Alignment</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-body)', lineHeight: 1.6 }}>We stay engaged through the critical first 100 days of executive integration to guarantee leadership success.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Executive Call to Action Banner */}
      <section style={{ backgroundColor: 'var(--color-primary-dark)', padding: '70px 0', color: '#ffffff', borderTop: '2px solid var(--color-accent)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '32px' }}>
          <div style={{ maxWidth: '680px' }}>
            <span style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              RETAINED EXECUTIVE SEARCH &amp; ADVISORY
            </span>
            <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#ffffff', margin: '0 0 12px 0', lineHeight: 1.3 }}>
              Facing a Critical Leadership Transition or Plant Turnaround?
            </h2>
            <p style={{ margin: 0, fontSize: '15px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}>
              Connect with our Managing Director or Senior Practice Partners for an off-the-record briefing on leadership availability and market compensation.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-accent" style={{ padding: '12px 24px' }}>
              <Briefcase size={16} />
              <span>Commission a Search</span>
            </Link>
            <Link to="/industries" className="btn btn-outline-white" style={{ padding: '12px 24px' }}>
              <span>Explore Practice Areas</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, TrendingUp, BookOpen, ArrowRight, ShieldCheck, Users, Award } from 'lucide-react';

export default function Insights() {
  const reports = [
    {
      title: "India Statutory Compliance & Labor Law Landscape 2026",
      category: "Statutory Compliance",
      date: "Q2 2026",
      image: "/images/workforce-management.jpg",
      description: "An operational guide to navigating the 4 Labor Codes, Contract Labour (R&A) Act, EPF, ESIC, and minimum wage variations across industrial manufacturing corridors.",
      readTime: "16 min read"
    },
    {
      title: "Pharmaceutical & Cleanroom Staffing: Technical Competency & cGMP Compliance",
      category: "Pharmaceuticals",
      date: "Q1 2026",
      image: "/images/insights-pharma-cgmp.jpg",
      description: "How leading pharma formulation and API manufacturing units in Baddi, Mohali, and Hyderabad achieve zero-deviation staffing in sterile environments.",
      readTime: "14 min read"
    },
    {
      title: "Power, EV & Green Energy: Addressing the Industrial Technical Deficit",
      category: "Energy & Mobility",
      date: "Market Whitepaper",
      image: "/images/power-sector.jpg",
      description: "Deep dive into multi-state workforce mobilization, high-voltage certified technician deployment, and retention strategies for wind, solar, and EV battery plants.",
      readTime: "12 min read"
    },
    {
      title: "Next-Gen Facility Management: SLA Engineering & Industrial Safety",
      category: "Facility Management",
      date: "Annual Study",
      image: "/images/facility-management.jpg",
      description: "Examining how mechanized cleaning, IoT-driven asset maintenance, and integrated EHS protocols reduce industrial downtime and enhance compliance audits.",
      readTime: "15 min read"
    },
    {
      title: "Apprenticeship Models (NAPS/NATS) for High-Volume Manufacturing",
      category: "Skill Development",
      date: "Special Brief",
      image: "/images/skill-development.jpg",
      description: "Frameworks for bridging the skill gap in precision fabrication, textiles, and automotive assembly through government-certified apprenticeship programs.",
      readTime: "11 min read"
    },
    {
      title: "Boardroom & Plant Leadership Succession in Indian Conglomerates",
      category: "HR & Leadership Advisory",
      date: "Leadership Advisory",
      image: "/images/about-intro-team.jpg",
      description: "Best practices for smooth leadership transitions, hiring unit heads, and aligning operational leadership with long-term enterprise growth.",
      readTime: "13 min read"
    }
  ];

  return (
    <div className="insights-page">
      
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span className="divider">&rsaquo;</span>
            <span>Insights &amp; Whitepapers</span>
          </div>
          <h1 className="page-hero-title">Workforce Insights &amp; Compliance Intelligence</h1>
          <p className="page-hero-subtitle">
            Authoritative whitepapers, statutory compliance guides, and workforce benchmarks produced by MCP Group's 19+ years of industry practice leadership.
          </p>
        </div>
      </section>

      {/* Featured Whitepaper Spotlight */}
      <section className="insights-section" style={{ background: '#f8fafc', padding: '60px 0 20px' }}>
        <div className="container">
          <div className="featured-insight-card">
            <div className="featured-insight-img">
              <img 
                src="/images/insights-featured-compliance.jpg" 
                alt="Executive Statutory Compliance & Governance Whitepaper"
                loading="lazy"
              />
            </div>
            <div className="featured-insight-content">
              <span className="article-category">FEATURED EXECUTIVE BENCHMARK</span>
              <h2 className="article-title">
                The 2026 India Workforce &amp; Labor Code Synthesis
              </h2>
              <p className="article-excerpt">
                An authoritative executive whitepaper on statutory harmonization, automated wage compliance, and multi-state staffing governance across 50,000+ deployed associates in India's key industrial corridors.
              </p>
              <div className="article-meta" style={{ marginBottom: '28px', flexWrap: 'wrap' }}>
                <span><strong>Release:</strong> Q2 2026 Edition</span>
                <span>•</span>
                <span><strong>Scope:</strong> Pan-India Industrial Study</span>
                <span>•</span>
                <span>20 min comprehensive read</span>
              </div>
              <div>
                <Link to="/contact" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <span>Request Full Whitepaper</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reports Grid */}
      <section style={{ padding: '40px 0 90px', background: 'var(--color-bg-light)' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">MCP GROUP KNOWLEDGE REPOSITORY</span>
            <h2 className="section-title">Industry Research, Compliance &amp; Operational Benchmarks</h2>
            <p className="section-subtitle" style={{ maxWidth: '720px', margin: '14px auto 0' }}>
              Actionable insights derived from deploying and managing 50,000+ associates across 500+ enterprise clients nationwide.
            </p>
          </div>

          <div className="insights-grid" style={{ marginTop: '48px' }}>
            {reports.map((rep, i) => (
              <article key={i} className="insight-item-card">
                <div className="insight-item-img">
                  <img src={rep.image} alt={rep.title} loading="lazy" />
                </div>
                <div className="insight-item-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span className="badge-pill">{rep.category}</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{rep.date}</span>
                  </div>

                  <h3 className="insight-item-title">
                    {rep.title}
                  </h3>

                  <p className="insight-item-desc">
                    {rep.description}
                  </p>

                  <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{rep.readTime}</span>
                    <Link to="/contact" className="btn-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-accent)', fontWeight: '700', fontSize: '13px' }}>
                      <span>Request Copy</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}

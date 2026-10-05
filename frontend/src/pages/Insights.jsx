import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, TrendingUp, BookOpen, ArrowRight, ShieldCheck, Users, Award } from 'lucide-react';

export default function Insights() {
  const reports = [
    {
      title: "India Statutory Compliance & Labor Law Landscape 2026",
      category: "Statutory Compliance",
      date: "Q2 2026",
      description: "An operational guide to navigating the 4 Labor Codes, Contract Labour (R&A) Act, EPF, ESIC, and minimum wage variations across industrial manufacturing corridors.",
      readTime: "16 min read"
    },
    {
      title: "Pharmaceutical & Cleanroom Staffing: Technical Competency & cGMP Compliance",
      category: "Pharmaceuticals",
      date: "Q1 2026",
      description: "How leading pharma formulation and API manufacturing units in Baddi, Mohali, and Hyderabad achieve zero-deviation staffing in sterile environments.",
      readTime: "14 min read"
    },
    {
      title: "Power, EV & Green Energy: Addressing the Industrial Technical Deficit",
      category: "Energy & Mobility",
      date: "Market Whitepaper",
      description: "Deep dive into multi-state workforce mobilization, high-voltage certified technician deployment, and retention strategies for wind, solar, and EV battery plants.",
      readTime: "12 min read"
    },
    {
      title: "Next-Gen Facility Management: SLA Engineering & Industrial Safety",
      category: "Facility Management",
      date: "Annual Study",
      description: "Examining how mechanized cleaning, IoT-driven asset maintenance, and integrated EHS protocols reduce industrial downtime and enhance compliance audits.",
      readTime: "15 min read"
    },
    {
      title: "Apprenticeship Models (NAPS/NATS) for High-Volume Manufacturing",
      category: "Skill Development",
      date: "Special Brief",
      description: "Frameworks for bridging the skill gap in precision fabrication, textiles, and automotive assembly through government-certified apprenticeship programs.",
      readTime: "11 min read"
    },
    {
      title: "Boardroom & Plant Leadership Succession in Indian Conglomerates",
      category: "HR & Leadership Advisory",
      date: "Leadership Advisory",
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

      {/* Reports Grid */}
      <section style={{ padding: '80px 0', background: 'var(--color-bg-light)' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">MCP GROUP KNOWLEDGE REPOSITORY</span>
            <h2 className="section-title">Industry Research, Compliance &amp; Operational Benchmarks</h2>
            <p className="section-subtitle" style={{ maxWidth: '720px', margin: '14px auto 0' }}>
              Actionable insights derived from deploying and managing 50,000+ associates across 500+ enterprise clients nationwide.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '30px', marginTop: '48px' }}>
            {reports.map((rep, i) => (
              <div key={i} style={{ background: '#ffffff', padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span className="badge-pill">{rep.category}</span>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{rep.date}</span>
                </div>

                <h3 style={{ fontSize: '19px', color: 'var(--color-primary)', marginBottom: '12px', lineHeight: '1.4' }}>
                  {rep.title}
                </h3>

                <p style={{ fontSize: '14px', color: 'var(--color-text-body)', lineHeight: '1.6', marginBottom: '24px', flexGrow: 1 }}>
                  {rep.description}
                </p>

                <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{rep.readTime}</span>
                  <Link to="/contact" className="btn-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-accent)', fontWeight: '700', fontSize: '13px' }}>
                    <span>Request Copy</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}

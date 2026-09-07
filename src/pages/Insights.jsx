import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, TrendingUp, BookOpen, ArrowRight } from 'lucide-react';

export default function Insights() {
  const reports = [
    {
      title: "India CXO Remuneration & Incentive Trends 2026",
      category: "Compensation Benchmarking",
      date: "Q2 2026",
      description: "Comprehensive executive compensation analysis across 180+ listed manufacturing conglomerates. Covers long-term incentive plans (LTIPs), phantom stocks, and retention structures.",
      readTime: "18 min read"
    },
    {
      title: "The Industrial COO: Navigating Smart Manufacturing & Automation",
      category: "Operational Leadership",
      date: "Q1 2026",
      description: "How top industrial Chief Operating Officers are integrating automated guided vehicles, predictive maintenance, and decarbonization to double EBITDA margins.",
      readTime: "12 min read"
    },
    {
      title: "Board Succession in Promoted & Family-Run Conglomerates",
      category: "Board Governance",
      date: "Annual Whitepaper",
      description: "Best practices for smooth generational transitions, structuring advisory councils, and hiring the first non-family Chief Executive Officer.",
      readTime: "15 min read"
    },
    {
      title: "Renewable Energy & Battery Storage: C-Suite Talent Scarcity",
      category: "CleanTech Leadership",
      date: "Market Intelligence",
      description: "An in-depth talent market report exploring executive compensation, cross-industry hiring, and global talent repatriation in solar, wind, and green hydrogen.",
      readTime: "10 min read"
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
          <h1 className="page-hero-title">Executive Insights &amp; Market Intelligence</h1>
          <p className="page-hero-subtitle">
            Authoritative whitepapers, compensation benchmarks, and boardroom succession research produced by our industry practice leaders.
          </p>
        </div>
      </section>

      {/* Reports Grid */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">FLAGSHIP STUDIES</span>
            <h2 className="section-title">Leadership Research &amp; Salary Surveys</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '30px', marginTop: '40px' }}>
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
                    <span>Request Study Copy</span>
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

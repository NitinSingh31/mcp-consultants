import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Factory, 
  Cpu, 
  Zap, 
  Truck, 
  Layers, 
  Settings, 
  Search, 
  ArrowRight,
  Pill,
  Shirt,
  Building2,
  Users,
  ShoppingBag,
  ShieldCheck,
  Award,
  Sparkles
} from 'lucide-react';

export default function Industries() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const industriesData = [
    {
      id: "pharmaceuticals",
      name: "Pharmaceuticals & Life Sciences",
      category: "pharma",
      icon: Pill,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
      tagline: "Specialized workforce solutions for one of India's most critical industries.",
      description: "Delivering GMP-trained workforce, API chemical operators, formulation technicians, and regulatory compliance leaders for USFDA/MHRA-compliant manufacturing complexes and sterile packaging hubs.",
      roles: ["Formulation & API Plant Associates", "QA/QC Microbiologists & Analysts", "Production Shift In-Charge", "Regulatory Affairs & EHS Officers"]
    },
    {
      id: "power-energy",
      name: "Power & Energy",
      category: "energy",
      icon: Zap,
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
      tagline: "Workforce and operational support for India's evolving energy sector.",
      description: "Mobilizing certified high-voltage technicians, solar/wind EPC installation crews, substation commissioning staff, and round-the-clock plant operations & maintenance teams.",
      roles: ["Substation & T&D Linesmen", "Solar PV Installation Crews", "Thermal/Hydro Shift Engineers", "Grid Safety & Asset Controllers"]
    },
    {
      id: "automobiles-ev",
      name: "Automobiles & Electric Mobility",
      category: "automotive",
      icon: Truck,
      image: "/images/automobiles-electric-mobility.jpg",
      tagline: "Skilled manpower and workforce management for India's automotive ecosystem.",
      description: "Supporting OEM assembly lines, Tier-1 ancillary vendors, press shop tooling, robotic paint booths, and next-generation EV battery pack assembly with trained associates.",
      roles: ["Assembly Line Operators", "CNC & Press Tooling Supervisors", "EV Battery Pack Technicians", "Quality Inspectors (PDI/Line)"]
    },
    {
      id: "textiles-apparel",
      name: "Textiles & Manufacturing",
      category: "textiles",
      icon: Shirt,
      image: "https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=800&q=80",
      tagline: "Workforce solutions supporting India's textile and manufacturing industries.",
      description: "Comprehensive workforce deployment across high-speed spinning mills, automated weaving sheds, chemical dyeing units, garment finishing lines, and technical apparel complexes.",
      roles: ["Spinning & Loom Operators", "Finishing & Garment Tailors", "Dyeing Process Supervisors", "Textile Plant Maintenance Techs"]
    },
    {
      id: "electronics-electricals",
      name: "Electronics & Electricals",
      category: "electronics",
      icon: Cpu,
      image: "/images/electronics-electricals.jpg",
      tagline: "Talent and workforce solutions for rapidly evolving technology-driven industries.",
      description: "Supplying precision assembly staff for Surface Mount Technology (SMT) cleanrooms, consumer electronics manufacturing, switchgear production, and PCB component soldering.",
      roles: ["SMT & PCB Assembly Associates", "Testing & Calibration Techs", "Component Sourcing Leads", "Electro-Mechanical QA Officers"]
    },
    {
      id: "retail-ev",
      name: "Retail & Modern Commerce",
      category: "retail",
      icon: ShoppingBag,
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      tagline: "Future-ready workforce solutions for India's expanding retail and modern commerce.",
      description: "Staffing hypermarkets, modern trade supermarkets, dark stores, and fulfillment hubs with store floor staff, cashiering teams, inventory controllers, and logistics personnel.",
      roles: ["Store Associates & Cashiers", "Inventory & Stock Controllers", "Warehouse Pickers & Packers", "Visual Merchandising Leads"]
    },
    {
      id: "hospitality",
      name: "Hospitality & Corporate Facilities",
      category: "hospitality",
      icon: Users,
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
      tagline: "Professional manpower and operational support for hospitality businesses.",
      description: "Trained front-office stewards, housekeeping associates, culinary kitchen assistants, banqueting teams, and pantry staff for premier hotels, clubs, and corporate dining facilities.",
      roles: ["Front Office & Guest Stewards", "Housekeeping Associates", "Pantry & Banquet Service Crew", "Facility Shift Supervisors"]
    },
    {
      id: "government-public-sector",
      name: "Government & Public Sector",
      category: "government",
      icon: ShieldCheck,
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
      tagline: "Compliance-driven workforce solutions for public-sector requirements.",
      description: "Fully statutory-compliant manpower deployment, data entry operations, administrative assistance, and facility upkeep for municipal bodies, PSU enterprises, and state authorities.",
      roles: ["Administrative Support Staff", "Data Entry Operators (DEO)", "Public Facility Caretakers", "Statutory Compliance Officers"]
    },
    {
      id: "sheet-metal-fabrication",
      name: "Sheet Metal & Precision Fabrication",
      category: "automotive",
      icon: Settings,
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      tagline: "Recruitment and technical staffing for high-output fabrication centers.",
      description: "Staffing CNC press brake operations, laser cutting centers, robotic welding lines, progressive stamping toolrooms, and automotive sheet metal component lines.",
      roles: ["Press Shop Line Supervisors", "Tool & Die Maintenance Leads", "Laser & CNC Operators", "Welding & Fabrication Quality Leads"]
    },
    {
      id: "heavy-engineering",
      name: "Heavy Engineering & Capital Goods",
      category: "automotive",
      icon: Factory,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
      tagline: "Workforce deployment for heavy capital goods and equipment manufacturing.",
      description: "Mobilizing certified welders, machinists, structural fitters, and crane operators across turbine fabrication, industrial boiler manufacturing, and mining machinery complexes.",
      roles: ["Certified 6G/TIG Welders", "Heavy Machine Operators", "Plant Assembly Technicians", "Safety & Rigging Supervisors"]
    }
  ];

  const categories = [
    { id: 'all', label: 'All Industries' },
    { id: 'pharma', label: 'Pharmaceuticals' },
    { id: 'energy', label: 'Power & Energy' },
    { id: 'automotive', label: 'Automobiles & EV' },
    { id: 'textiles', label: 'Textiles' },
    { id: 'electronics', label: 'Electronics & Electricals' },
    { id: 'retail', label: 'Retail & Modern Commerce' },
    { id: 'hospitality', label: 'Hospitality' },
    { id: 'government', label: 'Government & PSU' }
  ];

  const filteredIndustries = industriesData.filter(ind => {
    const matchesCategory = activeCategory === 'all' || ind.category === activeCategory;
    const matchesSearch = ind.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ind.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ind.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ind.roles.some(r => r.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="industries-page">
      
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span className="divider">&rsaquo;</span>
            <span>Industries We Serve</span>
          </div>
          <span className="section-tag" style={{ color: 'var(--color-accent)', display: 'block', marginBottom: '8px' }}>
            INDUSTRIES WE SERVE
          </span>
          <h1 className="page-hero-title">Expertise Across India’s Growth Industries.</h1>
          <p className="page-hero-subtitle">
            Our sector-focused teams understand the unique workforce, operational and compliance requirements of different industries across India.
          </p>
        </div>
      </section>

      {/* Interactive Hub Filter & Search */}
      <section className="industries-hub-section" style={{ padding: '60px 0 100px' }}>
        <div className="container">
          
          {/* Controls Bar */}
          <div className="hub-controls-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            
            {/* Category Filter Pills */}
            <div className="filter-pills-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`btn-pill ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '24px',
                    border: '1px solid var(--color-border-light)',
                    background: activeCategory === cat.id ? 'var(--color-primary)' : '#ffffff',
                    color: activeCategory === cat.id ? '#ffffff' : 'var(--color-text-dark)',
                    fontWeight: '600',
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Live Search Input */}
            <div className="search-box" style={{ position: 'relative', minWidth: '280px' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input 
                type="text"
                placeholder="Search sectors, skills or roles..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 42px',
                  borderRadius: '24px',
                  border: '1px solid var(--color-border-light)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

          </div>

          {/* Cards Grid */}
          {filteredIndustries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)' }}>
              <p style={{ fontSize: '18px', color: 'var(--color-text-muted)' }}>No practices matching "{searchTerm}".</p>
              <button onClick={() => { setSearchTerm(''); setActiveCategory('all'); }} className="btn btn-primary" style={{ marginTop: '16px' }}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="industries-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '30px' }}>
              {filteredIndustries.map(ind => {
                const IconComponent = ind.icon;
                return (
                  <div key={ind.id} className="practice-card" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'all 0.3s ease' }}>
                    
                    {/* Top Image Banner according to Industry Type */}
                    <div style={{ height: '190px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                      <img 
                        src={ind.image} 
                        alt={ind.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }} 
                        className="practice-card-img"
                        loading="lazy"
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(12, 30, 51, 0.15) 0%, rgba(12, 30, 51, 0.65) 100%)' }}></div>
                      
                      {/* Floating Sector Badge */}
                      <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(12, 30, 51, 0.88)', backdropFilter: 'blur(8px)', color: '#dfb45e', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.15)' }}>
                        {categories.find(c => c.id === ind.category)?.label?.split(' ')[0] || 'Sector'}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(196, 154, 69, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9a6a2f', flexShrink: 0 }}>
                          <IconComponent size={22} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '18px', color: '#0c1e33', fontWeight: '800', margin: 0, lineHeight: 1.3 }}>{ind.name}</h3>
                        </div>
                      </div>

                      <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-accent)', marginBottom: '8px' }}>
                        {ind.tagline}
                      </p>

                      <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.6', marginBottom: '20px', flexGrow: 1 }}>
                        {ind.description}
                      </p>

                      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: 'auto' }}>
                        <div style={{ fontSize: '11.5px', fontWeight: '800', textTransform: 'uppercase', color: '#9a6a2f', marginBottom: '8px', letterSpacing: '0.8px' }}>
                          Key Roles Deployed:
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 18px 0', fontSize: '13px', color: '#1e293b', lineHeight: '1.75' }}>
                          {ind.roles.map((r, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ color: '#9a6a2f', fontWeight: 'bold' }}>•</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>

                        <Link to={`/contact?industry=${encodeURIComponent(ind.name)}`} className="btn btn-outline-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px', borderRadius: '6px', fontWeight: '700' }}>
                          <span>Request Workforce Solutions</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

    </div>
  );
}

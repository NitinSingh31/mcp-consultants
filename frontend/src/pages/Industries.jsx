import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Factory, 
  Cpu, 
  Zap, 
  Truck, 
  Layers, 
  Settings, 
  Plane, 
  Flame, 
  Box, 
  Search, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export default function Industries() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const industriesData = [
    {
      id: "heavy-engineering",
      name: "Heavy Engineering & Capital Goods",
      category: "heavy",
      icon: Factory,
      description: "Precision search for Managing Directors, VP Operations, and Plant Heads across turbine manufacturing, heavy machinery, boilermakers, and mining capital equipment.",
      roles: ["Chief Operating Officer (COO)", "Plant General Manager", "VP Heavy Fabrication", "Head of Quality & Metallurgy"]
    },
    {
      id: "automation-robotics",
      name: "Industrial Automation, Robotics & IoT",
      category: "automation",
      icon: Cpu,
      description: "Appointing digital manufacturing pioneers in PLC/SCADA integration, warehouse robotics, automated guided vehicles (AGVs), and smart factory turnarounds.",
      roles: ["VP Smart Factory Systems", "Head of Robotics Engineering", "Chief Technology Officer (CTO)", "Director of Automation Sales"]
    },
    {
      id: "automotive-ev",
      name: "Automotive, Electric Mobility & Ancillaries",
      category: "heavy",
      icon: Truck,
      description: "Partnering with Tier-1 automotive component suppliers and EV pioneers in powertrain design, battery pack assembly, and high-volume press shops.",
      roles: ["President Automotive Division", "VP Powertrain & EV Systems", "Plant Head Body-in-White", "Chief Procurement Officer"]
    },
    {
      id: "power-renewables",
      name: "Renewable Energy, Solar & CleanTech",
      category: "energy",
      icon: Zap,
      description: "Building executive teams for utility-scale solar parks, onshore wind farms, green hydrogen plants, and gigawatt battery energy storage projects.",
      roles: ["CEO Renewables Platform", "VP Solar EPC & Delivery", "Chief Technical Officer", "Head of Regulatory & Tariffs"]
    },
    {
      id: "metals-steel",
      name: "Metals, Mining & Steel Production",
      category: "materials",
      icon: Flame,
      description: "Executive recruitment for blast furnace operations, electric arc furnaces, non-ferrous smelters, open-cast mines, and mineral processing plants.",
      roles: ["Executive Director Steel Mill", "VP Smelting & Refining", "Head of Mine Planning", "Chief Sustainability Officer"]
    },
    {
      id: "chemicals-polymers",
      name: "Chemicals, Petrochemicals & Polymers",
      category: "materials",
      icon: Layers,
      description: "Senior leadership mandates across continuous-process chemical plants, specialty polymers, agrochemicals, and green chemistry complexes.",
      roles: ["Managing Director Process Plant", "VP Health, Safety & Environment", "Head of Petrochemical R&D", "Site Director"]
    },
    {
      id: "aerospace-defense",
      name: "Aerospace, Defense & Precision Machining",
      category: "heavy",
      icon: Plane,
      description: "Executive search for Make-in-India defense manufacturing, precision aero-structures, avionics assembly, and tactical systems contractors.",
      roles: ["President Defense Programs", "VP Precision Machining", "Head of Aerospace Quality (AS9100)", "Director of Government Offset Contracts"]
    },
    {
      id: "packaging-materials",
      name: "Packaging, Paper & Industrial Materials",
      category: "materials",
      icon: Box,
      description: "Appointing operational leaders in high-speed flexible packaging, corrugated boxes, recycled paper mills, and barrier films.",
      roles: ["COO Packaging Operations", "VP High-Speed Converting", "Plant Head Extrusion", "National Supply Chain Director"]
    }
  ];

  const categories = [
    { id: 'all', label: 'All Sectors' },
    { id: 'heavy', label: 'Heavy Engineering & Auto' },
    { id: 'automation', label: 'Automation & Industry 4.0' },
    { id: 'energy', label: 'Energy, Power & CleanTech' },
    { id: 'materials', label: 'Process & Materials' }
  ];

  const filteredIndustries = industriesData.filter(ind => {
    const matchesCategory = activeCategory === 'all' || ind.category === activeCategory;
    const matchesSearch = ind.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ind.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            <span>Industry Sectors</span>
          </div>
          <h1 className="page-hero-title">Industrial Practices &amp; Sector Intelligence</h1>
          <p className="page-hero-subtitle">
            We concentrate our executive search capabilities exclusively on core engineering, automation, energy, and process manufacturing ecosystems.
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
                    fontSize: '14px',
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
                placeholder="Search sector or role..."
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
                  <div key={ind.id} className="practice-card" style={{ background: '#ffffff', padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(196, 154, 69, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)' }}>
                        <IconComponent size={26} />
                      </div>
                      <h3 style={{ fontSize: '19px', color: 'var(--color-primary)' }}>{ind.name}</h3>
                    </div>

                    <p style={{ fontSize: '14px', color: 'var(--color-text-body)', lineHeight: '1.6', marginBottom: '20px', flexGrow: 1 }}>
                      {ind.description}
                    </p>

                    <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '16px', marginTop: 'auto' }}>
                      <div style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '8px', letterSpacing: '0.5px' }}>
                        Typical Placements:
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', fontSize: '13px', color: 'var(--color-text-dark)', lineHeight: '1.8' }}>
                        {ind.roles.map((r, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>

                      <Link to="/contact" className="btn btn-outline-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px' }}>
                        <span>Commission Mandate</span>
                        <ArrowRight size={14} />
                      </Link>
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

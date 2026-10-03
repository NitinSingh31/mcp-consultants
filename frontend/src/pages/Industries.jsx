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
  ShieldAlert,
  Pill,
  Shirt
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
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
      description: "Precision recruitment for Managing Directors, VP Operations, and Plant Heads across turbine manufacturing, heavy machinery, boilermakers, and mining capital equipment.",
      roles: ["Chief Operating Officer (COO)", "Plant General Manager", "VP Heavy Fabrication", "Head of Quality & Metallurgy"]
    },
    {
      id: "sheet-metal-fabrication",
      name: "Sheet Metal & Precision Fabrication",
      category: "heavy",
      icon: Settings,
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      description: "Recruitment for CNC press brake operations, laser cutting centers, robotic welding lines, progressive stamping toolrooms, and high-volume press shops.",
      roles: ["Press Shop General Manager", "Tooling & Die Design Specialist", "Head of Laser & CNC Operations", "Fabrication Quality Lead"]
    },
    {
      id: "pharmaceuticals-life-sciences",
      name: "Pharmaceuticals, APIs & Life Sciences",
      category: "pharma",
      icon: Pill,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
      description: "Appointing proven leadership for USFDA/MHRA-compliant formulation plants, Active Pharmaceutical Ingredient (API) synthesis, sterile injectables, biosimilars, and contract manufacturing (CDMO).",
      roles: ["President / Head of Global Formulations", "VP Active Pharmaceutical Ingredients (API)", "Head of Regulatory Affairs & USFDA Quality", "Chief Scientific Officer (CSO) / R&D Director"]
    },
    {
      id: "automotive-ev",
      name: "Automotive, Electric Mobility & Ancillaries",
      category: "heavy",
      icon: Truck,
      image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
      description: "Partnering with Tier-1 automotive component suppliers and EV pioneers in powertrain design, battery pack assembly, chassis manufacturing, and high-volume press shops.",
      roles: ["President Automotive Division", "VP Powertrain & EV Systems", "Plant Head Body-in-White", "Chief Procurement Officer"]
    },
    {
      id: "automation-robotics",
      name: "Industrial Automation, Robotics & IoT",
      category: "automation",
      icon: Cpu,
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
      description: "Appointing digital manufacturing pioneers in PLC/SCADA integration, warehouse robotics, automated guided vehicles (AGVs), and smart factory turnarounds.",
      roles: ["VP Smart Factory Systems", "Head of Robotics Engineering", "Chief Technology Officer (CTO)", "Director of Automation Sales"]
    },
    {
      id: "power-renewables",
      name: "Renewable Energy, Solar & CleanTech",
      category: "energy",
      icon: Zap,
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80",
      description: "Building engineering and management teams for utility-scale solar parks, onshore wind farms, green hydrogen plants, and gigawatt battery energy storage projects.",
      roles: ["CEO Renewables Platform", "VP Solar EPC & Delivery", "Chief Technical Officer", "Head of Regulatory & Tariffs"]
    },
    {
      id: "metals-steel",
      name: "Metals, Mining & Steel Production",
      category: "materials",
      icon: Flame,
      image: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=800&q=80",
      description: "Recruitment for blast furnace operations, electric arc furnaces, non-ferrous smelters, open-cast mines, and mineral processing plants across India.",
      roles: ["Executive Director Steel Mill", "VP Smelting & Refining", "Head of Mine Planning", "Chief Sustainability Officer"]
    },
    {
      id: "chemicals-polymers",
      name: "Chemicals, Petrochemicals & Polymers",
      category: "materials",
      icon: Layers,
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
      description: "Senior leadership mandates across continuous-process chemical plants, specialty polymers, agrochemicals, and green chemistry complexes.",
      roles: ["Managing Director Process Plant", "VP Health, Safety & Environment", "Head of Petrochemical R&D", "Site Director"]
    },
    {
      id: "textiles-apparel",
      name: "Textiles, Technical Fabrics & Apparel",
      category: "textiles",
      icon: Shirt,
      image: "https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=800&q=80",
      description: "Executive search across high-capacity spinning mills, technical non-woven textiles, automated garmenting clusters, synthetic polymer fibers, and sustainable processing plants.",
      roles: ["Chief Executive Officer (Textiles & Apparel)", "VP Spinning & Processing Operations", "Head of Technical Textiles & Geotextiles", "Director of Global Sourcing & Supply Chain"]
    },
    {
      id: "aerospace-defense",
      name: "Aerospace, Defense & Precision Machining",
      category: "heavy",
      icon: Plane,
      image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80",
      description: "Recruitment for Make-in-India defense manufacturing, precision aero-structures, avionics assembly, and tactical systems contractors.",
      roles: ["President Defense Programs", "VP Precision Machining", "Head of Aerospace Quality (AS9100)", "Director of Government Offset Contracts"]
    },
    {
      id: "packaging-materials",
      name: "Packaging, Paper & Industrial Materials",
      category: "materials",
      icon: Box,
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      description: "Appointing operational leaders in high-speed flexible packaging, corrugated boxes, recycled paper mills, and barrier films.",
      roles: ["COO Packaging Operations", "VP High-Speed Converting", "Plant Head Extrusion", "National Supply Chain Director"]
    }
  ];

  const categories = [
    { id: 'all', label: 'All Sectors' },
    { id: 'heavy', label: 'Heavy Engineering & Auto' },
    { id: 'pharma', label: 'Pharmaceuticals & Life Sciences' },
    { id: 'textiles', label: 'Textiles & Apparel' },
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(196, 154, 69, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9a6a2f', flexShrink: 0 }}>
                          <IconComponent size={22} />
                        </div>
                        <h3 style={{ fontSize: '18px', color: '#0c1e33', fontWeight: '800', margin: 0, lineHeight: 1.3 }}>{ind.name}</h3>
                      </div>

                      <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.6', marginBottom: '20px', flexGrow: 1 }}>
                        {ind.description}
                      </p>

                      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: 'auto' }}>
                        <div style={{ fontSize: '11.5px', fontWeight: '800', textTransform: 'uppercase', color: '#9a6a2f', marginBottom: '8px', letterSpacing: '0.8px' }}>
                          Typical Placements:
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 18px 0', fontSize: '13px', color: '#1e293b', lineHeight: '1.75' }}>
                          {ind.roles.map((r, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ color: '#9a6a2f', fontWeight: 'bold' }}>•</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>

                        <Link to="/contact" className="btn btn-outline-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px', borderRadius: '6px', fontWeight: '700' }}>
                          <span>Commission Mandate</span>
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

// MCP Resdex Comprehensive Autocomplete Suggestions Database
// Covers Skills, Designations, Companies, and Industries across letters A-Z

export const SKILLS_DATABASE = [
  // F Skills (as requested by user)
  { name: 'Fabrication', category: 'Manufacturing', count: '4,820 candidates' },
  { name: 'Foundry Operations & Melting', category: 'Metallurgy', count: '2,140 candidates' },
  { name: 'Factory Automation', category: 'Robotics', count: '3,610 candidates' },
  { name: 'Finite Element Analysis (FEA)', category: 'Design & R&D', count: '1,980 candidates' },
  { name: 'Failure Mode & Effects Analysis (FMEA)', category: 'Quality', count: '3,250 candidates' },
  { name: 'Forging & Heat Treatment', category: 'Heavy Engineering', count: '2,890 candidates' },
  { name: 'Fluid Dynamics & CFD', category: 'Thermal Engineering', count: '1,450 candidates' },
  { name: 'Financial Modeling & P&L Management', category: 'Finance & Strategy', count: '4,120 candidates' },
  { name: 'Facility & Utilities Management', category: 'Plant Operations', count: '2,760 candidates' },
  { name: 'First Article Inspection (FAI)', category: 'Aerospace & Quality', count: '890 candidates' },
  { name: 'Furnace Operations & Refractory', category: 'Steel & Metallurgy', count: '1,630 candidates' },
  { name: 'Fibre Reinforced Polymer (FRP)', category: 'Materials Science', count: '1,120 candidates' },
  { name: 'Field Service Engineering', category: 'Operations', count: '2,400 candidates' },
  { name: 'Frontend Development (React / Vue)', category: 'Software & Tech', count: '6,700 candidates' },
  { name: 'Full Stack Development', category: 'Software & Tech', count: '8,900 candidates' },
  { name: 'Flutter & Mobile App Development', category: 'Software & Tech', count: '3,400 candidates' },
  { name: 'Fast Moving Capital Goods (FMCG Machinery)', category: 'Industrial', count: '1,850 candidates' },

  // A Skills
  { name: 'AUTOSAR Architecture', category: 'Automotive & Embedded', count: '1,540 candidates' },
  { name: 'ASME Section VIII Pressure Vessels', category: 'Heavy Engineering', count: '2,180 candidates' },
  { name: 'Assembly Line Balancing', category: 'Production', count: '3,200 candidates' },
  { name: 'Aerospace Avionics & Flight Systems', category: 'Aerospace', count: '940 candidates' },
  { name: 'Alloy Steel Metallurgy', category: 'Metallurgy', count: '1,890 candidates' },
  { name: 'Advanced Driver Assistance Systems (ADAS)', category: 'Automotive & EV', count: '1,620 candidates' },
  { name: 'APQP & PPAP Documentation', category: 'Automotive Quality', count: '4,100 candidates' },
  { name: 'Anodizing & Electroplating', category: 'Surface Treatment', count: '1,350 candidates' },
  { name: 'Artificial Intelligence & Machine Learning', category: 'Tech & Analytics', count: '7,400 candidates' },
  { name: 'AutoCAD & 3D Modeling', category: 'Design', count: '5,800 candidates' },

  // B Skills
  { name: 'Battery Management Systems (BMS)', category: 'Electric Vehicles', count: '2,640 candidates' },
  { name: 'Blast Furnace Operations', category: 'Steel & Mining', count: '1,720 candidates' },
  { name: 'Boiler Design & Thermal EPC', category: 'Power & Capital Goods', count: '2,100 candidates' },
  { name: 'BOM (Bill of Materials) Management', category: 'Supply Chain', count: '3,900 candidates' },
  { name: 'Bending & Sheet Metal Forming', category: 'Fabrication', count: '2,450 candidates' },
  { name: 'Black Belt Lean Six Sigma', category: 'Operational Excellence', count: '4,800 candidates' },
  { name: 'Business Development & Industrial Sales', category: 'Commercial', count: '6,200 candidates' },

  // C Skills
  { name: 'CNC Machining & VMC / HMC Programming', category: 'Precision Engineering', count: '4,900 candidates' },
  { name: 'Continuous Casting Machine (CCM)', category: 'Steel Manufacturing', count: '1,850 candidates' },
  { name: 'CAD/CAM (CATIA, SolidWorks, Siemens NX)', category: 'Mechanical Design', count: '5,400 candidates' },
  { name: 'Cold Rolling Mill (CRM)', category: 'Metal Processing', count: '1,600 candidates' },
  { name: 'Cybersecurity in Industrial SCADA', category: 'Automation Security', count: '1,200 candidates' },
  { name: 'Cost Reduction & Value Engineering (VAVE)', category: 'Operations', count: '3,600 candidates' },
  { name: 'Chemical Process Optimization', category: 'Process Industry', count: '2,300 candidates' },

  // D Skills
  { name: 'Design for Manufacturing & Assembly (DFMA)', category: 'Engineering Design', count: '2,750 candidates' },
  { name: 'DCS & SCADA Industrial Architecture', category: 'Automation', count: '3,100 candidates' },
  { name: 'Die Casting (HPDC / LPDC)', category: 'Foundry', count: '2,200 candidates' },
  { name: 'Defence Offsets & Procurement', category: 'Aerospace & Defence', count: '890 candidates' },
  { name: 'Diesel Engine & Dual Fuel Calibration', category: 'Automotive', count: '1,450 candidates' },
  { name: 'Dynamics, Noise & Vibration (NVH)', category: 'Automotive Testing', count: '1,320 candidates' },

  // E Skills
  { name: 'Electric Vehicle (EV) Powertrain Integration', category: 'Automotive & EV', count: '3,150 candidates' },
  { name: 'Embedded C & Firmware Development', category: 'Electronics', count: '4,200 candidates' },
  { name: 'ERP SAP S/4HANA (PP, MM, PM Modules)', category: 'Enterprise Systems', count: '5,100 candidates' },
  { name: 'Environmental Health & Safety (EHS)', category: 'Plant Compliance', count: '3,800 candidates' },
  { name: 'Extrusion & Injection Moulding', category: 'Polymers & Tooling', count: '2,900 candidates' },
  { name: 'Electrical Substation & Switchyard (HV/EHV)', category: 'Power Distribution', count: '2,400 candidates' },

  // G Skills
  { name: 'Gearbox & Transmission Engineering', category: 'Automotive & Industrial', count: '1,840 candidates' },
  { name: 'Geometric Dimensioning & Tolerancing (GD&T)', category: 'Quality & Design', count: '3,900 candidates' },
  { name: 'Global Strategic Sourcing', category: 'Procurement', count: '4,300 candidates' },
  { name: 'Galvanizing & Protective Coatings', category: 'Steel & Surface', count: '1,500 candidates' },
  { name: 'Grid Interconnection & Solar SCADA', category: 'Renewable Energy', count: '2,100 candidates' },

  // H Skills
  { name: 'Heavy Fabrication & Submerged Arc Welding', category: 'Heavy Engineering', count: '3,400 candidates' },
  { name: 'Hot Strip Mill Operations', category: 'Steel Plant', count: '1,650 candidates' },
  { name: 'Hydraulics & High-Pressure Pneumatics', category: 'Mechanical Systems', count: '3,100 candidates' },
  { name: 'Heating, Ventilation & Air Conditioning (HVAC)', category: 'MEP Infrastructure', count: '3,800 candidates' },
  { name: 'Hydrogen Electrolyzer & Fuel Cell Systems', category: 'CleanTech', count: '920 candidates' },

  // I Skills
  { name: 'Industrial Internet of Things (IIoT)', category: 'Industry 4.0', count: '2,800 candidates' },
  { name: 'IATF 16949 / ISO 9001 Auditing', category: 'Quality Standards', count: '4,500 candidates' },
  { name: 'Instrumentation, Sensors & Actuators', category: 'Controls', count: '3,400 candidates' },
  { name: 'Inverter & Motor Control Algorithms', category: 'Power Electronics', count: '1,950 candidates' },
  { name: 'Inventory Control & Just-In-Time (JIT)', category: 'Supply Chain', count: '3,900 candidates' },

  // K Skills
  { name: 'Kaizen & 5S Workplace Organization', category: 'Lean Manufacturing', count: '5,200 candidates' },
  { name: 'Kanban Pull Systems', category: 'Production Planning', count: '3,400 candidates' },
  { name: 'Key Account Management', category: 'Sales & BD', count: '4,100 candidates' },

  // L Skills
  { name: 'Lean Manufacturing & Waste Elimination', category: 'Operational Excellence', count: '6,100 candidates' },
  { name: 'Laser Cutting & CNC Bending', category: 'Sheet Metal', count: '2,900 candidates' },
  { name: 'Lithium-ion Cell Chemistry & Testing', category: 'Battery Technology', count: '1,400 candidates' },
  { name: 'Line Balancing & Takt Time Reduction', category: 'Industrial Engineering', count: '2,800 candidates' },
  { name: 'Low Voltage (LV) & Medium Voltage (MV) Switchgear', category: 'Electrical Equipment', count: '2,600 candidates' },

  // M Skills
  { name: 'Machining Centers (5-Axis VMC / HMC)', category: 'Precision Tooling', count: '3,100 candidates' },
  { name: 'Metallurgy & Heat Treatment Metallurgy', category: 'Metallurgy', count: '2,700 candidates' },
  { name: 'Motor Testing & Dynamo Validation', category: 'Automotive Electrical', count: '1,800 candidates' },
  { name: 'Material Requirement Planning (MRP)', category: 'Supply Chain', count: '3,500 candidates' },
  { name: 'Maintenance Engineering (TPM / RCM)', category: 'Plant Engineering', count: '4,600 candidates' },

  // N Skills
  { name: 'Non-Destructive Testing (NDT Level II / III)', category: 'Quality & Inspection', count: '3,200 candidates' },
  { name: 'NADCAP Audit Accreditation', category: 'Aerospace Quality', count: '1,100 candidates' },
  { name: 'New Product Introduction (NPI / APQP)', category: 'Product Engineering', count: '4,300 candidates' },
  { name: 'Nuclear Pressure Equipment Fabrication', category: 'Heavy Engineering', count: '850 candidates' },

  // O Skills
  { name: 'Operations Management & Plant P&L', category: 'Plant Leadership', count: '5,800 candidates' },
  { name: 'Overall Equipment Effectiveness (OEE)', category: 'Operational Metrics', count: '4,900 candidates' },
  { name: 'Optical Emission Spectrometry (OES)', category: 'Metallurgical Lab', count: '1,400 candidates' },

  // P Skills
  { name: 'PLC Programming (Siemens TIA Portal / Rockwell / Allen-Bradley)', category: 'Automation', count: '4,300 candidates' },
  { name: 'Powertrain Integration & Thermal Architecture', category: 'Automotive & EV', count: '2,500 candidates' },
  { name: 'Plant Head & Operations Leadership', category: 'Executive', count: '3,900 candidates' },
  { name: 'Pressure Vessel Fabrication (ASME / IBR)', category: 'Heavy Engineering', count: '2,800 candidates' },
  { name: 'Precision Tool & Die Design', category: 'Tooling', count: '2,400 candidates' },
  { name: 'Production Planning & Control (PPC)', category: 'Manufacturing', count: '4,700 candidates' },

  // Q Skills
  { name: 'Quality Assurance & Quality Control (QA/QC)', category: 'Quality Management', count: '6,800 candidates' },
  { name: 'Quality Management Systems (QMS)', category: 'Compliance', count: '5,400 candidates' },
  { name: 'Quick Die Change (SMED Methodology)', category: 'Lean Tools', count: '2,100 candidates' },

  // R Skills
  { name: 'Robotics & Industrial Cobots Programming', category: 'Industry 4.0', count: '2,900 candidates' },
  { name: 'Rolling Mill Operations (Bar & Wire Rod)', category: 'Steel & Metallurgy', count: '1,900 candidates' },
  { name: 'Renewable Energy EPC (Solar & Wind)', category: 'Energy', count: '3,600 candidates' },
  { name: 'Root Cause Analysis (8D / 5-Why / Fishbone)', category: 'Problem Solving', count: '5,100 candidates' },

  // S Skills
  { name: 'Six Sigma Green / Black Belt', category: 'Quality & Process', count: '6,500 candidates' },
  { name: 'Supply Chain Management (SCM)', category: 'Logistics & SCM', count: '5,900 candidates' },
  { name: 'Strategic Sourcing & Vendor Management', category: 'Procurement', count: '4,800 candidates' },
  { name: 'Sheet Metal Stamping & Tooling', category: 'Fabrication', count: '3,500 candidates' },
  { name: 'SCADA, Telemetry & RTU Systems', category: 'Industrial Controls', count: '2,900 candidates' },

  // T Skills
  { name: 'Total Productive Maintenance (TPM)', category: 'Plant Reliability', count: '4,700 candidates' },
  { name: 'Titanium & Nickel Alloy Forging', category: 'Special Metallurgy', count: '1,200 candidates' },
  { name: 'Thermal Power Plant Erection & Commissioning', category: 'Power EPC', count: '2,800 candidates' },
  { name: 'Tool & Die Making & CNC Milling', category: 'Precision Tooling', count: '2,900 candidates' },

  // V Skills
  { name: 'Value Stream Mapping (VSM)', category: 'Lean Manufacturing', count: '3,200 candidates' },
  { name: 'Vendor Quality Assurance (VQA)', category: 'Quality & Sourcing', count: '3,700 candidates' },
  { name: 'Variable Frequency Drives (VFD) & Motion Control', category: 'Electrical Automation', count: '2,600 candidates' },

  // W Skills
  { name: 'Welding Engineering (SMAW, GTAW, GMAW, SAW)', category: 'Fabrication Standards', count: '3,900 candidates' },
  { name: 'Wind Turbine Generator Erection', category: 'Clean Energy', count: '1,600 candidates' },
  { name: 'Warehouse Management Systems (WMS)', category: 'Logistics', count: '3,400 candidates' }
];

export const DESIGNATIONS_DATABASE = [
  { name: 'Vice President - Operations & Manufacturing', category: 'Executive Leadership' },
  { name: 'Vice President - Engineering & R&D', category: 'Executive Leadership' },
  { name: 'Vice President - Supply Chain & Procurement', category: 'Executive Leadership' },
  { name: 'Plant Head / Factory Manager', category: 'Plant Management' },
  { name: 'General Manager - Plant Operations', category: 'Operations' },
  { name: 'General Manager - Quality Assurance (QA/QC)', category: 'Quality Leadership' },
  { name: 'Head of Manufacturing Excellence & TPM', category: 'Continuous Improvement' },
  { name: 'Chief Technology Officer (CTO)', category: 'C-Suite' },
  { name: 'Chief Operating Officer (COO)', category: 'C-Suite' },
  { name: 'Chief Executive Officer (CEO)', category: 'C-Suite' },
  { name: 'Director - Engineering & Design', category: 'Senior Leadership' },
  { name: 'Director - Global Sourcing & Vendor Development', category: 'Procurement' },
  { name: 'Head of Metallurgy & Rolling Mills', category: 'Steel & Metals' },
  { name: 'Head of EV Powertrain & Battery Systems', category: 'Automotive & EV' },
  { name: 'Head of Heavy Fabrication & Welding', category: 'Heavy Engineering' },
  { name: 'Head of Project Engineering - EPC', category: 'Projects' },
  { name: 'Production Manager / Shift Lead', category: 'Shop Floor Management' },
  { name: 'Quality Control Manager (QC Lead)', category: 'Quality' },
  { name: 'Maintenance Manager (Mechanical / Electrical)', category: 'Plant Engineering' },
  { name: 'Supply Chain Manager / Logistics Head', category: 'Supply Chain' },
  { name: 'Continuous Improvement Lead (Kaizen / Six Sigma)', category: 'Operational Excellence' },
  { name: 'R&D Principal Engineer (Mechanical / Electrical)', category: 'Design & R&D' },
  { name: 'Automation & Robotics Lead Engineer', category: 'Industry 4.0' },
  { name: 'Health, Safety & Environment (EHS) Lead', category: 'Plant Safety' }
];

export const COMPANIES_DATABASE = [
  { name: 'L&T Heavy Engineering', sector: 'Heavy Engineering & Capital Goods' },
  { name: 'L&T Defense & Aerospace', sector: 'Aerospace & Defence' },
  { name: 'Tata Motors Commercial Vehicles', sector: 'Automotive & Electric Vehicles' },
  { name: 'Tata Motors Passenger & Electric Mobility', sector: 'Automotive & EV' },
  { name: 'Tata Steel Limited', sector: 'Steel & Metallurgy' },
  { name: 'JSW Steel Ltd', sector: 'Steel & Metallurgy' },
  { name: 'Jindal Steel & Power (JSPL)', sector: 'Metals & Mining' },
  { name: 'Bharat Forge Limited', sector: 'Forging & Aerospace' },
  { name: 'Thermax Limited', sector: 'Clean Energy & Boilers' },
  { name: 'Godrej Process Equipment', sector: 'Heavy Fabrication' },
  { name: 'Kirloskar Brothers Limited', sector: 'Pumps & Industrial Valves' },
  { name: 'BHEL (Bharat Heavy Electricals Ltd)', sector: 'Capital Goods & Power' },
  { name: 'Suzlon Green Energy', sector: 'Renewable Energy EPC' },
  { name: 'Cummins India Limited', sector: 'Engines & Generators' },
  { name: 'Siemens Industrial Automation', sector: 'Automation & Drives' },
  { name: 'Schneider Electric India', sector: 'Energy & Switchgear' },
  { name: 'ABB India Limited', sector: 'Power & Robotics' },
  { name: 'Bosch India Automotive', sector: 'Automotive Technology' },
  { name: 'Mahindra & Mahindra Automotive', sector: 'Automotive & Tractors' },
  { name: 'JCB India Limited', sector: 'Construction & Earthmoving' },
  { name: 'Endurance Technologies', sector: 'Die Casting & Brakes' },
  { name: 'Balkrishna Industries (BKT Tires)', sector: 'Off-Highway Tires' },
  { name: 'Hindustan Aeronautics Limited (HAL)', sector: 'Aerospace & Defence' },
  { name: 'Vedanta Resources / Hindustan Zinc', sector: 'Metals & Mining' }
];

export const INDUSTRIES_DATABASE = [
  { name: 'Heavy Engineering & Capital Goods', tags: 'Boilers, Vessels, Turbines' },
  { name: 'Automotive & Electric Vehicles (EV)', tags: 'OEMs, Tier-1, Batteries' },
  { name: 'Steel, Metallurgy & Casting', tags: 'Blast Furnace, Rolling Mills, Forging' },
  { name: 'Renewable Energy & CleanTech', tags: 'Solar, Wind, Green Hydrogen' },
  { name: 'Aerospace & Defence Manufacturing', tags: 'Composites, Avionics, Offsets' },
  { name: 'Industrial Automation & Robotics', tags: 'PLC, SCADA, Industry 4.0' },
  { name: 'Power Generation, Transmission & Distribution', tags: 'Thermal, EPC, Grid' },
  { name: 'Chemicals, Petrochemicals & Polymers', tags: 'Refining, Polymers, Fertilizers' },
  { name: 'Infrastructure, EPC & Construction Equipment', tags: 'Earthmoving, Plant EPC' },
  { name: 'Precision Engineering & Tooling', tags: 'CNC, Moulds, Dies, Machining' },
  { name: 'Mining & Mineral Processing', tags: 'Extraction, Smelting, Bulk Handling' }
];

// Helper functions for autocomplete filtering
export function filterSkills(query) {
  if (!query || !query.trim()) {
    // Return trending/popular defaults when input is clicked or empty
    return SKILLS_DATABASE.slice(0, 8);
  }
  const clean = query.trim().toLowerCase();
  return SKILLS_DATABASE.filter(s => 
    s.name.toLowerCase().includes(clean) || 
    s.category.toLowerCase().includes(clean)
  ).slice(0, 10);
}

export function filterDesignations(query) {
  if (!query || !query.trim()) {
    return DESIGNATIONS_DATABASE.slice(0, 8);
  }
  const clean = query.trim().toLowerCase();
  return DESIGNATIONS_DATABASE.filter(d => 
    d.name.toLowerCase().includes(clean) || 
    d.category.toLowerCase().includes(clean)
  ).slice(0, 8);
}

export function filterCompanies(query) {
  if (!query || !query.trim()) {
    return COMPANIES_DATABASE.slice(0, 8);
  }
  const clean = query.trim().toLowerCase();
  return COMPANIES_DATABASE.filter(c => 
    c.name.toLowerCase().includes(clean) || 
    c.sector.toLowerCase().includes(clean)
  ).slice(0, 8);
}

export function filterIndustries(query) {
  if (!query || !query.trim()) {
    return INDUSTRIES_DATABASE.slice(0, 8);
  }
  const clean = query.trim().toLowerCase();
  return INDUSTRIES_DATABASE.filter(i => 
    i.name.toLowerCase().includes(clean) || 
    i.tags.toLowerCase().includes(clean)
  ).slice(0, 8);
}

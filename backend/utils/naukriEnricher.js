/**
 * Intelligent Naukri Job Data Parser & Executive Domain Enricher
 * Tailored for MCP Consultants executive search mandates.
 */

// Common locations recognized in slugs
const RECOGNIZED_LOCATIONS = [
  'Baddi', 'Solan', 'Chandigarh', 'Mohali', 'Panchkula', 'Ludhiana',
  'Jalandhar', 'Gurgaon', 'Gurugram', 'Noida', 'Delhi', 'Delhi NCR',
  'Faridabad', 'Pune', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai',
  'Ahmedabad', 'Vadodara', 'Haridwar', 'Dehradun', 'Roorkee', 'Kala Amb', 'Nalagarh'
];

/**
 * Clean common typos in job titles
 */
function cleanTitleTypos(str) {
  if (!str) return '';
  return str
    .replace(/\benigneer\b/gi, 'Engineer')
    .replace(/\benginer\b/gi, 'Engineer')
    .replace(/\bmanagr\b/gi, 'Manager')
    .replace(/\boprator\b/gi, 'Operator')
    .replace(/\btechnition\b/gi, 'Technician')
    .replace(/\bco-ordinator\b/gi, 'Coordinator')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parse raw input (URL or 12-digit Job ID)
 */
function parseNaukriInput(rawInput) {
  const result = {
    jobId: null,
    slugTitle: '',
    minExp: null,
    maxExp: null,
    locations: []
  };

  if (!rawInput || typeof rawInput !== 'string') return result;
  const input = rawInput.trim();

  // 1. Extract 12-digit Job ID
  const idMatch = input.match(/\b\d{12}\b/);
  if (idMatch) {
    result.jobId = idMatch[0];
  }

  // 2. Parse URL Slug if present
  try {
    const slugMatch = input.match(/job-listings-([a-zA-Z0-9-]+)/i);
    if (slugMatch && slugMatch[1]) {
      let slug = slugMatch[1];

      // Extract experience range if present in slug (e.g. 10-to-20-years, 3-to-8-years, 1-to-5-years)
      const expMatch = slug.match(/(\d+)-(?:to-)?(\d+)-years/i);
      if (expMatch) {
        result.minExp = parseInt(expMatch[1], 10);
        result.maxExp = parseInt(expMatch[2], 10);
        slug = slug.replace(/-?\d+-(?:to-)?\d+-years/i, '');
      }

      // Check for locations in slug
      for (const loc of RECOGNIZED_LOCATIONS) {
        const regex = new RegExp(`-${loc}\\b`, 'i');
        if (regex.test(slug)) {
          if (!result.locations.includes(loc)) {
            result.locations.push(loc);
          }
          slug = slug.replace(regex, '');
        }
      }

      // Remove trailing digits / job ID
      slug = slug.replace(/-\d{8,14}$/, '');
      // Remove company name tokens
      slug = slug.replace(/-(?:mcp-consultants|mcpconsultants|mcp)/gi, '');
      // Remove trailing generic keywords
      slug = slug.replace(/-(?:naukri|india|jobs?)$/gi, '');

      const words = slug.split('-').filter(Boolean);
      if (words.length > 0) {
        const rawTitle = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        result.slugTitle = cleanTitleTypos(rawTitle);
      }
    }
  } catch (e) {
    console.warn('Slug parsing error:', e.message);
  }

  return result;
}

/**
 * Domain Knowledge Base for Automatic Enrichment
 */
const DOMAIN_PROFILES = [
  {
    key: 'cnc_head',
    pattern: /\b(cnc\s*head|production\s*head|machining\s*head|tool\s*room\s*head|machine\s*shop\s*head)\b/i,
    titleDefault: 'Production Head - CNC Head',
    department: 'Operations, Manufacturing & Plant',
    industry: 'Industrial Manufacturing / Machine Tools / Automotive Components',
    minExp: 10,
    maxExp: 20,
    salaryMin: '12.00 Lacs',
    salaryMax: '20.00 Lacs',
    vacancies: 1,
    education: ['B.Tech / B.E. in Mechanical Engineering', 'Diploma in Mechanical Engineering'],
    skills: [
      { name: 'CNC Programming', mandatory: true },
      { name: 'VMC Operations', mandatory: true },
      { name: 'Production Planning (PPC)', mandatory: true },
      { name: 'Tooling & Fixtures', mandatory: true },
      { name: 'Shop Floor Management', mandatory: true },
      { name: 'Fanuc / Siemens Controls', mandatory: false },
      { name: 'Cycle Time Reduction', mandatory: false },
      { name: 'Manpower Management', mandatory: false },
      { name: '5S & Kaizen', mandatory: false },
      { name: 'OEE Improvement', mandatory: false }
    ],
    roleSummary: 'Lead and oversee high-precision CNC & VMC manufacturing operations, tool room planning, production scheduling, and machine efficiency to meet delivery commitments.',
    responsibilities: [
      'Spearhead complete shop floor operations across CNC, VMC, and turning centers with zero-defect targets.',
      'Plan and optimize machining cycles, tooling selection, jig/fixture development, and program verification.',
      'Supervise production planning and control (PPC), material requirement planning, and capacity utilization.',
      'Mentor and manage team of machine operators, shift supervisors, and programmers.',
      'Drive Lean Manufacturing, 5S workplace standards, Kaizen, and overall equipment effectiveness (OEE).',
      'Coordinate with Quality Assurance for first piece inspection, process capability (Cp/Cpk), and final clearances.'
    ]
  },
  {
    key: 'mep_engineer',
    pattern: /\b(mep|hvac|building\s*services|fire\s*fighting|electrical\s*and\s*plumbing)\b/i,
    titleDefault: 'MEP Engineer',
    department: 'Engineering, Design & Automation',
    industry: 'Engineering & Construction / Infrastructure / Facility Services',
    minExp: 3,
    maxExp: 8,
    salaryMin: '4.50 Lacs',
    salaryMax: '8.50 Lacs',
    vacancies: 2,
    education: ['B.Tech / B.E. in Mechanical / Electrical Engineering', 'Diploma in Mechanical / Electrical'],
    skills: [
      { name: 'MEP', mandatory: true },
      { name: 'HVAC Systems', mandatory: true },
      { name: 'Electrical Layouts', mandatory: true },
      { name: 'Plumbing & Fire Fighting', mandatory: true },
      { name: 'AutoCAD MEP', mandatory: true },
      { name: 'Site Execution & Commissioning', mandatory: false },
      { name: 'BOQ & Estimation', mandatory: false },
      { name: 'Vendor Coordination', mandatory: false },
      { name: 'BMS (Building Management Systems)', mandatory: false }
    ],
    roleSummary: 'Responsible for end-to-end design verification, site installation, testing, and commissioning of Mechanical, Electrical, and Plumbing (MEP) systems.',
    responsibilities: [
      'Supervise on-site execution of HVAC, electrical substations, plumbing, drainage, and firefighting networks.',
      'Review engineering drawings, schematic diagrams, and BOQ specifications to ensure regulatory compliance.',
      'Coordinate closely with project architects, structural consultants, and MEP contractors.',
      'Inspect incoming MEP equipment and materials to verify standards and test certificates.',
      'Prepare progress reports, site measurement sheets, and testing & commissioning dossiers.'
    ]
  },
  {
    key: 'design_engineer',
    pattern: /\b(design\s*engineer|r&d\s*engineer|cad\s*engineer|mechanical\s*designer|solidworks|autocad\s*designer)\b/i,
    titleDefault: 'Design Engineer',
    department: 'Engineering, Design & Automation',
    industry: 'Industrial Machinery / Equipment Design & Manufacturing',
    minExp: 1,
    maxExp: 6,
    salaryMin: '3.00 Lacs',
    salaryMax: '7.50 Lacs',
    vacancies: 2,
    education: ['B.Tech / B.E. in Mechanical Engineering', 'Diploma in Mechanical Engineering'],
    skills: [
      { name: 'AutoCAD', mandatory: true },
      { name: 'SolidWorks', mandatory: true },
      { name: 'Machine Design', mandatory: true },
      { name: '3D Modeling', mandatory: true },
      { name: '2D Drafting', mandatory: false },
      { name: 'GD&T', mandatory: false },
      { name: 'Gear Manufacturing & Design', mandatory: false },
      { name: 'Design Calculations', mandatory: false }
    ],
    roleSummary: 'Develop detailed 3D models, 2D manufacturing drawings, bill of materials, and engineering calculations for industrial components and assemblies.',
    responsibilities: [
      'Create 3D parametric CAD models and 2D manufacturing drawings using SolidWorks and AutoCAD.',
      'Perform engineering design calculations, tolerance stack-up analysis, and GD&T specification.',
      'Design mechanical gears, transmissions, shafts, and customized industrial tooling.',
      'Collaborate with tool room and production teams to resolve manufacturing feasibility issues.',
      'Maintain engineering change notices (ECN), revision histories, and technical documentation.'
    ]
  },
  {
    key: 'quality_lead',
    pattern: /\b(quality|qa\b|qc\b|qms|iatf|inspection|metrology|cmm)\b/i,
    titleDefault: 'Senior Quality & Plant Operations Lead',
    department: 'Quality, Testing & Compliance',
    industry: 'Automotive Components / Industrial Manufacturing',
    minExp: 4,
    maxExp: 9,
    salaryMin: '5.00 Lacs',
    salaryMax: '9.00 Lacs',
    vacancies: 2,
    education: ['B.Tech / B.E. in Mechanical Engineering', 'Diploma in Mechanical'],
    skills: [
      { name: 'Quality Control (QC)', mandatory: true },
      { name: 'Quality Assurance (QA)', mandatory: true },
      { name: 'Plant Operations', mandatory: true },
      { name: 'QMS (ISO 9001 / IATF 16949)', mandatory: true },
      { name: 'Inspection & Testing', mandatory: false },
      { name: 'Root Cause Analysis (RCA)', mandatory: false },
      { name: 'CAPA', mandatory: false },
      { name: 'Shop Floor Control', mandatory: false }
    ],
    roleSummary: 'Lead plant-wide quality assurance, incoming raw material inspections, line clearance, customer audit preparation, and quality management systems.',
    responsibilities: [
      'Ensure strict compliance with IATF 16949, ISO 9001, and OEM customer quality standards.',
      'Oversee receiving, in-process, and final dispatch quality inspection gates.',
      'Lead 8D investigations, Root Cause Analysis (RCA), and Corrective & Preventive Actions (CAPA).',
      'Manage gauge calibration, CMM verification, and MSA/SPC statistical process capability studies.',
      'Coordinate external customer audits and internal quality surveillance audits.'
    ]
  },
  {
    key: 'production_mgmt',
    pattern: /\b(production\s*manager|plant\s*manager|works\s*manager|factory\s*manager|production\s*incharge)\b/i,
    titleDefault: 'Production Manager',
    department: 'Operations, Manufacturing & Plant',
    industry: 'Industrial Manufacturing / Engineering Operations',
    minExp: 10,
    maxExp: 20,
    salaryMin: '7.00 Lacs',
    salaryMax: '12.00 Lacs',
    vacancies: 1,
    education: ['B.Tech / B.E. in Mechanical Engineering', 'Diploma in Mechanical Engineering'],
    skills: [
      { name: 'Production Management', mandatory: true },
      { name: 'Plant Operations', mandatory: true },
      { name: 'Shop Floor Control', mandatory: true },
      { name: 'Lean Manufacturing', mandatory: false },
      { name: 'Process Optimization', mandatory: false },
      { name: 'PPC & Capacity Planning', mandatory: false },
      { name: 'Manpower Allocation', mandatory: false }
    ],
    roleSummary: 'Direct all manufacturing and plant operations, production scheduling, resource allocation, and shop floor discipline to deliver optimum productivity.',
    responsibilities: [
      'Manage daily production targets across all shop floor lines to meet client shipment deadlines.',
      'Optimize cycle times, minimize changeover delays, and implement Lean 5S manufacturing methodologies.',
      'Supervise shift engineers, maintenance crew, and workforce scheduling.',
      'Drive continuous cost reduction, scrap minimization, and scrap recycling workflows.',
      'Enforce occupational health, environmental, and factory safety standards.'
    ]
  },
  {
    key: 'production_engineer',
    pattern: /\b(production\s*engineer|process\s*engineer|manufacturing\s*engineer|shift\s*incharge)\b/i,
    titleDefault: 'Production Engineer',
    department: 'Operations, Manufacturing & Plant',
    industry: 'Manufacturing & Industrial Engineering',
    minExp: 1,
    maxExp: 6,
    salaryMin: '3.00 Lacs',
    salaryMax: '8.00 Lacs',
    vacancies: 2,
    education: ['B.Tech / B.E. in Mechanical / Production Engineering', 'Diploma in Mechanical'],
    skills: [
      { name: 'Production Planning', mandatory: true },
      { name: 'Shop Floor Operations', mandatory: true },
      { name: 'Quality Control', mandatory: true },
      { name: 'Manufacturing Engineering', mandatory: false },
      { name: 'Line Efficiency', mandatory: false }
    ],
    roleSummary: 'Supervise daily shift operations, line throughput, machine uptime, and quality compliance across production cells.',
    responsibilities: [
      'Supervise on-floor machine operations, tool changes, and operator assignments during shifts.',
      'Track and document hourly output, downtime logs, and rejection statistics.',
      'Collaborate with maintenance to resolve breakdown stoppages swiftly.',
      'Train line workers on standard operating procedures (SOP) and safety guidelines.'
    ]
  },
  {
    key: 'accounts_finance',
    pattern: /\b(accountant|accounts\s*executive|finance\s*manager|taxation|gst|audit|billing)\b/i,
    titleDefault: 'Senior Accountant & Finance Executive',
    department: 'Finance, Accounts & Audit',
    industry: 'Corporate Finance / Industrial Accounting',
    minExp: 3,
    maxExp: 8,
    salaryMin: '3.50 Lacs',
    salaryMax: '7.00 Lacs',
    vacancies: 1,
    education: ['B.Com', 'M.Com', 'MBA in Finance', 'CA Inter / Semi-Qualified'],
    skills: [
      { name: 'Tally Prime / ERP 9', mandatory: true },
      { name: 'GST Filing & Returns', mandatory: true },
      { name: 'TDS & Withholding Tax', mandatory: true },
      { name: 'Bank Reconciliation', mandatory: true },
      { name: 'Accounts Payable / Receivable', mandatory: false },
      { name: 'Balance Sheet Finalization', mandatory: false },
      { name: 'MIS Reporting', mandatory: false }
    ],
    roleSummary: 'Manage general ledger accounting, accounts payable/receivable, statutory tax compliances (GST/TDS), and monthly financial reporting.',
    responsibilities: [
      'Maintain day-to-day accounts in Tally Prime, verifying purchase orders, invoices, and payment vouchers.',
      'Prepare and file timely GST, GSTR-1, GSTR-3B, TDS, and PF/ESI challans.',
      'Conduct monthly bank reconciliation (BRS) and vendor account reconciliations.',
      'Assist external auditors during statutory financial audits and tax assessments.'
    ]
  },
  {
    key: 'hr_recruitment',
    pattern: /\b(hr\b|human\s*resource|recruiter|talent\s*acquisition|admin\s*executive)\b/i,
    titleDefault: 'HR & Talent Acquisition Executive',
    department: 'Human Resources, Admin & Legal',
    industry: 'Recruitment Consulting / Human Capital',
    minExp: 2,
    maxExp: 7,
    salaryMin: '3.00 Lacs',
    salaryMax: '6.50 Lacs',
    vacancies: 2,
    education: ['MBA in HR', 'PGDM in Human Resources', 'Any Graduate'],
    skills: [
      { name: 'Talent Acquisition', mandatory: true },
      { name: 'End-to-End Recruitment', mandatory: true },
      { name: 'Naukri Resdex & Job Portals', mandatory: true },
      { name: 'Candidate Screening', mandatory: true },
      { name: 'HR Statutory Compliance', mandatory: false },
      { name: 'Interview Coordination', mandatory: false },
      { name: 'Employee Onboarding', mandatory: false }
    ],
    roleSummary: 'Drive full lifecycle hiring for engineering, technical, and executive mandates across industrial and corporate clients.',
    responsibilities: [
      'Source, screen, and interview candidates using Naukri Resdex, LinkedIn, and internal databases.',
      'Partner with hiring managers to understand technical job requirements and define candidate profiles.',
      'Manage interview scheduling, feedback loops, salary negotiations, and offer rollout.',
      'Handle employee onboarding, attendance records, and statutory compliance documentation.'
    ]
  },
  {
    key: 'maintenance',
    pattern: /\b(maintenance|electrical\s*engineer|utility|plc|automation\s*engineer)\b/i,
    titleDefault: 'Maintenance & Utility Engineer',
    department: 'Operations, Manufacturing & Plant',
    industry: 'Heavy Machinery / Industrial Maintenance',
    minExp: 3,
    maxExp: 8,
    salaryMin: '4.00 Lacs',
    salaryMax: '7.50 Lacs',
    vacancies: 2,
    education: ['B.Tech / B.E. in Electrical / Mechanical', 'Diploma in Electrical / Mechanical'],
    skills: [
      { name: 'Preventive Maintenance', mandatory: true },
      { name: 'Breakdown Maintenance', mandatory: true },
      { name: 'PLC & Automation', mandatory: true },
      { name: 'Hydraulics & Pneumatics', mandatory: true },
      { name: 'Total Productive Maintenance (TPM)', mandatory: false },
      { name: 'Utility Equipment (Compressors, DG, Boilers)', mandatory: false }
    ],
    roleSummary: 'Ensure high machine uptime and preventive maintenance across heavy production machinery, CNC units, and utility infrastructure.',
    responsibilities: [
      'Execute planned preventive maintenance and breakdown repairs on industrial machinery.',
      'Troubleshoot PLC control panels, sensor circuits, hydraulic drives, and pneumatic cylinders.',
      'Maintain utility equipment such as air compressors, DG sets, and cooling towers.',
      'Manage critical spares inventory to avoid production downtime.'
    ]
  }
];

/**
 * Fallback domain generator for any generic or specialized role
 */
function getGenericProfile(title) {
  const t = (title || 'Professional').toLowerCase();
  let dept = 'Operations, Manufacturing & Plant';
  let minExp = 2;
  let maxExp = 6;
  let salaryMin = '3.50 Lacs';
  let salaryMax = '7.00 Lacs';
  let vacancies = 2;

  // Seniority heuristics
  if (t.includes('head') || t.includes('vp') || t.includes('director') || t.includes('gm')) {
    minExp = 10;
    maxExp = 20;
    salaryMin = '12.00 Lacs';
    salaryMax = '22.00 Lacs';
    vacancies = 1;
    dept = 'Operations, Manufacturing & Plant';
  } else if (t.includes('manager') || t.includes('lead') || t.includes('incharge')) {
    minExp = 6;
    maxExp = 12;
    salaryMin = '6.50 Lacs';
    salaryMax = '12.00 Lacs';
    vacancies = 1;
  } else if (t.includes('senior') || t.includes('sr')) {
    minExp = 4;
    maxExp = 8;
    salaryMin = '5.00 Lacs';
    salaryMax = '8.50 Lacs';
    vacancies = 2;
  }

  // Department heuristics
  if (t.includes('engineer') || t.includes('design') || t.includes('tech')) {
    dept = 'Engineering, Design & Automation';
  } else if (t.includes('quality') || t.includes('qa') || t.includes('qc') || t.includes('audit')) {
    dept = 'Quality, Testing & Compliance';
  } else if (t.includes('account') || t.includes('finance') || t.includes('tax')) {
    dept = 'Finance, Accounts & Audit';
  } else if (t.includes('hr') || t.includes('recruiter') || t.includes('admin')) {
    dept = 'Human Resources, Admin & Legal';
  } else if (t.includes('sales') || t.includes('marketing') || t.includes('business development')) {
    dept = 'Sales, BD & Marketing';
  } else if (t.includes('purchase') || t.includes('procurement') || t.includes('store') || t.includes('logistics')) {
    dept = 'Supply Chain, Logistics & Procurement';
  }

  return {
    titleDefault: title || 'Executive Professional',
    department: dept,
    industry: 'Industrial Manufacturing / Corporate Consulting',
    minExp,
    maxExp,
    salaryMin,
    salaryMax,
    vacancies,
    education: ['B.Tech / B.E.', 'Diploma / Graduate in relevant stream'],
    skills: [
      { name: 'Core Domain Expertise', mandatory: true },
      { name: 'Process Execution', mandatory: true },
      { name: 'Team Coordination', mandatory: false },
      { name: 'Quality Standards', mandatory: false }
    ],
    roleSummary: `Join MCP Consultants client organization as a key contributor in the ${dept} division.`,
    responsibilities: [
      'Execute core operational and technical tasks in accordance with standard operating procedures.',
      'Coordinate with cross-functional teams to achieve organizational performance milestones.',
      'Ensure high standards of quality, compliance, and timely deliverables.'
    ]
  };
}

/**
 * Main Enrichment Function
 */
function enrichNaukriJobData({
  rawInput = '',
  customTitle = '',
  customDept = '',
  customLocations = null,
  customExpMin = null,
  customExpMax = null
}) {
  const parsed = parseNaukriInput(rawInput);
  const jobId = parsed.jobId;

  // Specific Known Job ID mappings for MCP Consultants
  const KNOWN_JOBS = {
    '171126032228': {
      title: 'Production Head - CNC Head',
      department: 'Operations, Manufacturing & Plant',
      profileKey: 'cnc_head',
      minExp: 10,
      maxExp: 20,
      salaryMin: '12.00 Lacs',
      salaryMax: '20.00 Lacs',
      vacancies: 1,
      locations: ['Baddi', 'Solan']
    },
    '171026808627': {
      title: 'MEP Engineer',
      department: 'Engineering, Design & Automation',
      profileKey: 'mep_engineer',
      minExp: 3,
      maxExp: 8,
      salaryMin: '4.50 Lacs',
      salaryMax: '8.50 Lacs',
      vacancies: 2,
      locations: ['Baddi']
    },
    '021126803473': {
      title: 'Senior Plant Quality & Operations Lead',
      department: 'Quality, Testing & Compliance',
      profileKey: 'quality_lead',
      minExp: 4,
      maxExp: 9,
      salaryMin: '5.00 Lacs',
      salaryMax: '9.00 Lacs',
      vacancies: 2,
      locations: ['Baddi']
    },
    '051026801594': {
      title: 'Design Engineer',
      department: 'Engineering, Design & Automation',
      profileKey: 'design_engineer',
      minExp: 1,
      maxExp: 6,
      salaryMin: '3.00 Lacs',
      salaryMax: '7.50 Lacs',
      vacancies: 2,
      locations: ['Baddi']
    },
    '180526801442': {
      title: 'Production Manager',
      department: 'Operations, Manufacturing & Plant',
      profileKey: 'production_mgmt',
      minExp: 10,
      maxExp: 20,
      salaryMin: '6.00 Lacs',
      salaryMax: '9.50 Lacs',
      vacancies: 1,
      locations: ['Baddi']
    },
    '051026828978': {
      title: 'Production Engineer',
      department: 'Operations, Manufacturing & Plant',
      profileKey: 'production_engineer',
      minExp: 1,
      maxExp: 6,
      salaryMin: '3.00 Lacs',
      salaryMax: '8.00 Lacs',
      vacancies: 2,
      locations: ['Baddi']
    }
  };

  const known = jobId && KNOWN_JOBS[jobId] ? KNOWN_JOBS[jobId] : null;

  // Determine Final Job Title
  let effectiveTitle = (customTitle && customTitle.trim())
    || (known && known.title)
    || parsed.slugTitle
    || (jobId ? `Senior Specialist #${jobId}` : 'Professional Position');

  effectiveTitle = cleanTitleTypos(effectiveTitle);

  // Find Best Matching Domain Profile
  let matchedProfile = null;
  if (known && known.profileKey) {
    matchedProfile = DOMAIN_PROFILES.find(p => p.key === known.profileKey);
  }
  if (!matchedProfile) {
    matchedProfile = DOMAIN_PROFILES.find(p => p.pattern.test(effectiveTitle));
  }
  if (!matchedProfile) {
    matchedProfile = getGenericProfile(effectiveTitle);
  }

  // Determine Experience Range
  let workExperienceMin = 0;
  let workExperienceMax = 5;
  if (customExpMin !== null && customExpMin !== undefined) {
    workExperienceMin = Number(customExpMin);
  } else if (parsed.minExp !== null) {
    workExperienceMin = parsed.minExp;
  } else if (known && known.minExp !== undefined) {
    workExperienceMin = known.minExp;
  } else {
    workExperienceMin = matchedProfile.minExp;
  }

  if (customExpMax !== null && customExpMax !== undefined) {
    workExperienceMax = Number(customExpMax);
  } else if (parsed.maxExp !== null) {
    workExperienceMax = parsed.maxExp;
  } else if (known && known.maxExp !== undefined) {
    workExperienceMax = known.maxExp;
  } else {
    workExperienceMax = matchedProfile.maxExp;
  }

  // Determine Department
  const effectiveDept = (customDept && customDept.trim())
    || (known && known.department)
    || matchedProfile.department
    || 'Operations, Manufacturing & Plant';

  // Determine Locations
  let effectiveLocations = ['Baddi'];
  if (customLocations && customLocations.length) {
    effectiveLocations = customLocations;
  } else if (parsed.locations.length) {
    effectiveLocations = parsed.locations;
  } else if (known && known.locations && known.locations.length) {
    effectiveLocations = known.locations;
  }

  // Determine CTC Range (clean numbers in Lacs)
  const cleanSalaryNumber = (val, fallback) => {
    if (!val) return fallback;
    return val.toString().replace(/\s*lacs?/gi, '').trim();
  };

  const rawSalaryMin = (known && known.salaryMin) || matchedProfile.salaryMin || '3.50';
  const rawSalaryMax = (known && known.salaryMax) || matchedProfile.salaryMax || '8.00';
  const salaryMin = cleanSalaryNumber(rawSalaryMin, '3.50');
  const salaryMax = cleanSalaryNumber(rawSalaryMax, '8.00');
  const vacancies = (known && known.vacancies) || matchedProfile.vacancies || 1;

  // Build Comprehensive Job Description
  const locationStr = effectiveLocations.join(', ');
  const respBullets = (matchedProfile.responsibilities || []).map(r => `• ${r}`).join('\n');
  const eduStr = (matchedProfile.education || ['B.Tech / Graduate']).join(' OR ');

  const fullJobDescription = 
`${matchedProfile.roleSummary}

Key Responsibilities & Deliverables:
${respBullets}

Mandatory Criteria & Candidate Profile:
• Total Relevant Experience: ${workExperienceMin} to ${workExperienceMax} Years
• Educational Qualification: ${eduStr}
• Work Location: ${locationStr}
• Compensation Range: ₹${salaryMin} - ₹${salaryMax} Lacs P.A. (Total CTC)
• Employment Type: Full Time, Permanent (In-Office)

Benefits & Perks:
• Comprehensive PF & ESIC Benefits
• Annual Performance Bonus & Incentives
• Professional growth opportunities in a progressive manufacturing environment

How to Apply:
Interested candidates are invited to apply directly via MCP Consultants Careers Portal or connect with our recruitment advisory:
Contact: Shikha (Senior Recruitment Consultant)
Direct Contact: +91-9888426060 | Email: shikha.k@mcpconsultants.in / recruiter.mcpconsultants@gmail.com
MCP Consultants, Baddi (Himachal Pradesh)`;

  const candidateProfile = 
`The ideal candidate should have ${workExperienceMin}-${workExperienceMax} years of hands-on experience in ${effectiveTitle}. Must possess strong communication skills, problem-solving capability, and relevant technical qualifications (${eduStr}). Immediate joiners or candidates with a notice period under 30 days are preferred.`;

  const referenceCode = jobId ? `NAUKRI-${jobId}` : `NAUKRI-${Date.now().toString().slice(-6)}`;

  const screeningQuestions = [
    'What is your current CTC (in Lacs per annum)?',
    'What is your expected CTC (in Lacs per annum)?',
    'What is your official notice period?',
    `Are you currently residing in ${locationStr} or willing to relocate?`
  ];

  return {
    title: effectiveTitle,
    company: 'MCP Consultants',
    hideCompany: false,
    department: effectiveDept,
    employmentType: 'Full Time, Permanent',
    workExperienceMin,
    workExperienceMax,
    workMode: 'In office',
    salaryType: 'Total CTC',
    salaryMin,
    salaryMax,
    hideSalary: false,
    locations: effectiveLocations,
    relocateToLocations: true,
    vacancies,
    skills: matchedProfile.skills || [{ name: 'Operations', mandatory: true }],
    education: matchedProfile.education || ['B.Tech / B.E.', 'Diploma'],
    industry: matchedProfile.industry || 'Industrial Manufacturing / Engineering Operations',
    jobDescription: fullJobDescription,
    candidateProfile,
    perks: 'ESI, PF, Performance Incentives, Free Transport / Canteen subsidy (as per plant policy)',
    screeningQuestions,
    isWalkIn: false,
    collaborators: ['recruiter.mcpconsultants@gmail.com'],
    responseEmailPolicy: 'As a daily summary',
    referenceCode,
    status: 'Active'
  };
}

module.exports = {
  parseNaukriInput,
  enrichNaukriJobData,
  cleanTitleTypos
};

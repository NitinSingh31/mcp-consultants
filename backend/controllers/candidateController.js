const CandidateModel = require('../models/Candidate');

// POST /api/candidates/search
exports.searchCandidates = async (req, res) => {
  try {
    const {
      keywords = '',
      booleanMode = false,
      client = '',
      minExp = '',
      maxExp = '',
      industry = '',
      company = '',
      excludeCompany = '',
      designation = '',
      noticePeriod = 'Any',
      ugQualification = 'Any',
      pgQualification = 'Any',
      gender = 'All',
      displayFilter = 'All candidates',
      verifiedMobileOnly = false,
      verifiedEmailOnly = false,
      attachedResumeOnly = false
    } = req.body || {};

    const query = {};

    // Keywords match across name, current_role, company, sector, key_skills
    if (keywords && keywords.trim()) {
      const terms = keywords.trim().split(/[\s,]+/).filter(Boolean);
      if (terms.length > 0) {
        const regexes = terms.map(t => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
        query.$or = [
          { name: { $in: regexes } },
          { current_role: { $in: regexes } },
          { sector: { $in: regexes } },
          { company: { $in: regexes } },
          { key_skills: { $in: regexes } }
        ];
      }
    }

    // Sector / Industry filter
    if (industry && industry.trim() && industry !== 'Any' && industry !== 'All') {
      query.sector = { $regex: new RegExp(industry.trim(), 'i') };
    }

    // Company filter
    if (company && company.trim()) {
      query.company = { $regex: new RegExp(company.trim(), 'i') };
    }

    // Exclude Company filter
    if (excludeCompany && excludeCompany.trim()) {
      query.company = { ...(query.company || {}), $not: new RegExp(excludeCompany.trim(), 'i') };
    }

    // Designation filter
    if (designation && designation.trim()) {
      query.current_role = { $regex: new RegExp(designation.trim(), 'i') };
    }

    // Notice period filter
    if (noticePeriod && noticePeriod !== 'Any' && noticePeriod.trim()) {
      const cleanNotice = noticePeriod.replace('+', '').trim();
      query.notice_period = { $regex: new RegExp(cleanNotice, 'i') };
    }

    // Gender filter
    if (gender && gender !== 'All' && gender !== 'All candidates') {
      const targetGender = gender.includes('Female') ? 'Female' : 'Male';
      query.gender = targetGender;
    }

    // Resume attached filter
    if (attachedResumeOnly) {
      query.cv_filename = { $exists: true, $ne: '' };
    }

    let candidates = await CandidateModel.find(query).sort({ createdAt: -1 }).lean();

    // Numerical Experience Filter
    const minYears = minExp ? parseInt(minExp, 10) : null;
    const maxYears = maxExp ? parseInt(maxExp, 10) : null;

    if (minYears !== null || maxYears !== null) {
      candidates = candidates.filter(c => {
        const match = (c.experience || '').match(/\d+/);
        const years = match ? parseInt(match[0], 10) : 0;
        if (minYears !== null && years < minYears) return false;
        if (maxYears !== null && years > maxYears) return false;
        return true;
      });
    }

    const results = candidates.map(c => ({
      ...c,
      id: c._id.toString().slice(-6),
      created_at: c.createdAt
    }));

    res.status(200).json({
      success: true,
      total: results.length,
      candidates: results,
      querySummary: {
        keywords,
        industry,
        company,
        designation,
        noticePeriod,
        minExp,
        maxExp,
        gender
      }
    });
  } catch (err) {
    console.error('Candidate search error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/candidates/recent-searches
exports.getRecentSearches = (req, res) => {
  res.status(200).json({
    success: true,
    recentSearches: [
      {
        id: 'rs-1',
        title: '<= 8.50 Lacs | Baddi, Kalka, Nalagarh, Ramshahr, Kasauli, Krishangarh, Pachhad, Naya Gaon, Dharampur, Chandigarh...',
        query: {
          keywords: 'Production Supervisor Quality Plant',
          industry: 'Heavy Engineering & Capital Goods',
          noticePeriod: '0 - 15 days',
          minExp: '3',
          maxExp: '8'
        }
      },
      {
        id: 'rs-2',
        title: 'amit kumar',
        query: {
          keywords: 'Amit Kumar',
          industry: 'Any',
          noticePeriod: 'Any',
          minExp: '',
          maxExp: ''
        }
      },
      {
        id: 'rs-3',
        title: 'Recent Search 3 (EV & Powertrain)',
        query: {
          keywords: 'Battery Management Systems Powertrain',
          industry: 'Automotive & Electric Vehicles',
          noticePeriod: '1 month',
          minExp: '10',
          maxExp: '18'
        }
      },
      {
        id: 'rs-4',
        title: '<= 9 Lacs (CNC & Metallurgy)',
        query: {
          keywords: 'CNC Machining Metallurgy Heavy',
          industry: 'Steel & Metallurgy',
          noticePeriod: 'Any',
          minExp: '5',
          maxExp: '12'
        }
      }
    ],
    savedSearches: [
      {
        id: 'ss-1',
        name: 'HR 04- 09',
        summary: 'Recruitment | <= 20 Lacs | Anywhere in North India, Anywhere in South India...',
        query: {
          keywords: 'Vice President General Manager Operations',
          industry: 'Heavy Engineering & Capital Goods',
          noticePeriod: '1 month',
          minExp: '15',
          maxExp: '25'
        }
      }
    ]
  });
};

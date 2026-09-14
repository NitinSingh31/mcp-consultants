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
      minSalary = '',
      maxSalary = '',
      includeUnspecifiedSalary = true,
      location = '',
      relocateToLocations = true,
      excludeAnywhere = false,
      department = '',
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

    // Location filter
    if (location && location.trim()) {
      const locTerms = location.trim().split(/[,]+/).map(s => s.trim()).filter(Boolean);
      if (locTerms.length > 0) {
        const locRegexes = locTerms.map(t => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
        query.$and = query.$and || [];
        query.$and.push({
          $or: [
            { location: { $in: locRegexes } },
            ...(relocateToLocations ? [{ location: { $regex: /relocate|anywhere|flexible/i } }] : [])
          ]
        });
      }
    }

    // Department filter
    if (department && department.trim() && department !== 'Any') {
      const deptRegex = new RegExp(department.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { sector: deptRegex },
          { current_role: deptRegex },
          { key_skills: { $in: [deptRegex] } }
        ]
      });
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

    // Numerical Annual Salary Filter (in Lacs)
    const minSal = minSalary ? parseFloat(minSalary) : null;
    const maxSal = maxSalary ? parseFloat(maxSalary) : null;

    if (minSal !== null || maxSal !== null) {
      candidates = candidates.filter(c => {
        const match = (c.annual_ctc || '').match(/[\d.]+/);
        if (!match) return includeUnspecifiedSalary;
        const sal = parseFloat(match[0]);
        if (minSal !== null && sal < minSal) return false;
        if (maxSal !== null && sal > maxSal) return false;
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
        location,
        minSalary,
        maxSalary,
        department,
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
        title: '<=7.50 Lacs | Chandigarh, Himachal Pradesh, Solan, Naya Gaon, Pachhad, Panchkula, Mohali, Sahibzada Ajit Singh Nagar, Zirakpur, Kharar, Kalka, Dera Bassi, Banur, Kasauli, Baddi, Morinda, Dharmpur, Krishangarh, Rajpura, Rup Nagar, Rupnagar, Nalagarh, Bassi Pathana, Fatehgarh Sahib, Chamkaur Sahib, Ramshahr, Sirhind Fatehgarh Sahib, Ambala, Kandaghat, Khamanon, Naraingarh, Shalai, Kala Amb, Junga, Arki, Vikasnagar, Shimla, Bharari, Cheta, Nohra, Theog, Tikar, Darlaghat, Nahan, Sirmaur, Namhol, Dadahu, Renuka, Chaupal, Punjab',
        query: {
          maxSalary: '7.5',
          location: 'Chandigarh, Baddi, Solan, Mohali, Panchkula, Nalagarh',
          includeUnspecifiedSalary: true
        }
      },
      {
        id: 'rs-2',
        title: '<=8.50 Lacs',
        query: {
          maxSalary: '8.5',
          includeUnspecifiedSalary: true
        }
      },
      {
        id: 'rs-3',
        title: 'amit kumar',
        query: {
          keywords: 'Amit Kumar'
        }
      },
      {
        id: 'rs-4',
        title: 'Recent Search 4',
        query: {
          keywords: 'Production Supervisor Quality Plant',
          industry: 'Heavy Engineering & Capital Goods',
          minExp: '3',
          maxExp: '8'
        }
      },
      {
        id: 'rs-5',
        title: '<=9 Lacs',
        query: {
          maxSalary: '9',
          includeUnspecifiedSalary: true
        }
      },
      {
        id: 'rs-6',
        title: 'Ca Intern, Ca Fresher, ICWA Inter | Chartered Accountant | 1-10 years | 3-10 Lacs | Chandigarh',
        query: {
          keywords: 'Chartered Accountant ICWA Inter Ca Fresher',
          designation: 'Chartered Accountant',
          minExp: '1',
          maxExp: '10',
          minSalary: '3',
          maxSalary: '10',
          location: 'Chandigarh'
        }
      },
      {
        id: 'rs-7',
        title: 'Recent Search 7',
        query: {
          keywords: 'Plant Operations Heavy Fabrication',
          industry: 'Heavy Engineering & Capital Goods',
          noticePeriod: '1 month'
        }
      },
      {
        id: 'rs-8',
        title: 'Recent Search 8',
        query: {
          keywords: 'Battery Management Systems Powertrain AUTOSAR',
          industry: 'Automotive & Electric Vehicles',
          noticePeriod: '0 - 15 days'
        }
      },
      {
        id: 'rs-9',
        title: 'Recent Search 9',
        query: {
          keywords: 'CNC Machining Metallurgy Blast Furnace',
          industry: 'Steel & Metallurgy',
          minExp: '5',
          maxExp: '15'
        }
      },
      {
        id: 'rs-10',
        title: '<=8 Lacs',
        query: {
          maxSalary: '8',
          includeUnspecifiedSalary: true
        }
      }
    ],
    savedSearches: [
      {
        id: 'ss-1',
        name: 'HR 04- 09',
        summary: 'Recruitment | <= 20 Lacs | Anywhere in North India, Anywhere in South India',
        badge: '1000+ new profiles',
        query: {
          keywords: 'Vice President General Manager Operations',
          maxSalary: '20',
          minExp: '15',
          maxExp: '25',
          industry: 'Heavy Engineering & Capital Goods'
        }
      },
      {
        id: 'ss-2',
        name: 'Chemical Sales',
        summary: 'Channel Sales | 6-12 years | Mumbai',
        badge: '100+ new profiles',
        query: {
          keywords: 'Chemical Sales Channel Sales',
          designation: 'Channel Sales Manager',
          minExp: '6',
          maxExp: '12',
          location: 'Mumbai'
        }
      },
      {
        id: 'ss-3',
        name: 'GMP - Baddi',
        summary: 'Project sales, Industrial Marketing | Industrial sales | Chandigarh, Panchkula, Kharar, S.A.S. Nagar, Mohali, Sirmaur, Morinda, Kalka, Dera Bassi, Fatehgarh Sahib, Rup Nagar, Rupnagar, Rajpura, Sirhind Fatehgarh Sahib, Nalagarh, Khamanon, Dharmpur, Krishangarh, Gobindgarh, Solan, Khanna, Amloh, Samrala, Shimla, Anandpur Sahib, Naina Devi, Balachaur, Naraingarh, Baddi, Patiala, Barara, Thanesar, Kurukshetra, Payal, Nabha, Nawanshahr, Shahid Bhagat Singh Nagar, Garhshankar, Ludhiana, Nahan, Yamunanagar, Paonta Sahib, Sundarnagar, Ghumarwin, Mandi, Sarkaghat, Hamirpur, Galore, Una, Dhuri',
        badge: '10+ new',
        query: {
          keywords: 'GMP Project Sales Industrial Marketing',
          designation: 'Industrial Sales Executive',
          location: 'Baddi, Chandigarh, Mohali, Panchkula, Nalagarh'
        }
      }
    ]
  });
};

// DELETE /api/candidates/recent-searches
exports.clearRecentSearches = async (req, res) => {
  try {
    return res.json({ success: true, message: 'Recent searches cleared successfully', recentSearches: [] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE /api/candidates/saved-searches
exports.clearSavedSearches = async (req, res) => {
  try {
    return res.json({ success: true, message: 'Saved searches cleared successfully', savedSearches: [] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

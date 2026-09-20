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

    // Hierarchical Location filter (India → Region → State → City & Special Scopes)
    if (location && location.trim()) {
      const rawTerms = location.trim().split(/[,]+/).map(s => s.trim()).filter(Boolean);
      const expandedTerms = [];

      for (const raw of rawTerms) {
        const lower = raw.toLowerCase();

        if (lower.includes('anywhere in india') || lower === 'india') {
          expandedTerms.push(
            'India', 'Chandigarh', 'Punjab', 'Haryana', 'Himachal', 'Delhi', 'Noida', 'Gurgaon', 'Gurugram',
            'Maharashtra', 'Mumbai', 'Pune', 'Karnataka', 'Bengaluru', 'Bangalore', 'Tamil Nadu', 'Chennai',
            'Telangana', 'Hyderabad', 'Gujarat', 'Ahmedabad', 'Vadodara', 'West Bengal', 'Kolkata', 'Jharkhand',
            'Jamshedpur', 'Rajasthan', 'Jaipur', 'Madhya Pradesh', 'Indore', 'Baddi', 'Mohali'
          );
        } else if (lower.includes('north india')) {
          expandedTerms.push(
            'North India', 'Chandigarh', 'Punjab', 'Mohali', 'Zirakpur', 'Ludhiana', 'Jalandhar', 'Amritsar', 'Patiala',
            'Himachal', 'Baddi', 'Nalagarh', 'Solan', 'Paonta Sahib', 'Kala Amb', 'Haryana', 'Panchkula', 'Gurgaon',
            'Gurugram', 'Faridabad', 'Panipat', 'Sonipat', 'Delhi', 'New Delhi', 'Noida', 'Greater Noida', 'Ghaziabad',
            'Uttar Pradesh', 'Lucknow', 'Kanpur', 'Rajasthan', 'Jaipur', 'Bhiwadi', 'Neemrana', 'Uttarakhand', 'Dehradun',
            'Haridwar', 'Jammu'
          );
        } else if (lower.includes('west india')) {
          expandedTerms.push(
            'West India', 'Maharashtra', 'Mumbai', 'Pune', 'Navi Mumbai', 'Thane', 'Nagpur', 'Nashik', 'Aurangabad',
            'Chhatrapati Sambhajinagar', 'Kolhapur', 'Gujarat', 'Ahmedabad', 'Vadodara', 'Baroda', 'Surat', 'Rajkot',
            'Gandhinagar', 'Bharuch', 'Ankleshwar', 'Vapi', 'Goa', 'Panaji'
          );
        } else if (lower.includes('south india')) {
          expandedTerms.push(
            'South India', 'Karnataka', 'Bengaluru', 'Bangalore', 'Mysuru', 'Mysore', 'Tamil Nadu', 'Chennai', 'Coimbatore',
            'Hosur', 'Sriperumbudur', 'Telangana', 'Hyderabad', 'Secunderabad', 'Andhra', 'Visakhapatnam', 'Kerala', 'Kochi', 'Cochin'
          );
        } else if (lower.includes('east india')) {
          expandedTerms.push(
            'East India', 'West Bengal', 'Kolkata', 'Howrah', 'Durgapur', 'Haldia', 'Jharkhand', 'Jamshedpur', 'Ranchi',
            'Bokaro', 'Odisha', 'Bhubaneswar', 'Rourkela', 'Bihar', 'Patna'
          );
        } else if (lower.includes('central india')) {
          expandedTerms.push(
            'Central India', 'Madhya Pradesh', 'Indore', 'Pithampur', 'Bhopal', 'Gwalior', 'Chhattisgarh', 'Raipur', 'Bhilai'
          );
        } else if (lower.includes('international') || lower.includes('overseas')) {
          expandedTerms.push(
            'International', 'Overseas', 'Dubai', 'UAE', 'Abu Dhabi', 'Riyadh', 'Saudi', 'Qatar', 'Doha', 'Oman', 'Muscat',
            'USA', 'United States', 'Canada', 'Toronto', 'UK', 'London', 'Germany', 'Frankfurt', 'Singapore', 'Australia', 'Sydney'
          );
        } else if (lower.includes('(all cities)')) {
          const stateClean = raw.replace(/\(all cities\)/i, '').trim();
          expandedTerms.push(stateClean);
        } else {
          expandedTerms.push(raw);
        }
      }

      const uniqueTerms = Array.from(new Set(expandedTerms)).filter(Boolean);
      if (uniqueTerms.length > 0) {
        const locRegexes = uniqueTerms.map(t => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
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
    recentSearches: [],
    savedSearches: []
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

const Candidate = require('../models/Candidate');

async function seedSampleCandidates() {
  try {
    const count = await Candidate.countDocuments();
    if (count < 6) {
      const samples = [
        {
          name: "Vikram Malhotra",
          email: "v.malhotra@executive-search.mcp",
          phone: "+91 98230 44120",
          current_role: "Vice President - Operations & Plant Manufacturing",
          company: "L&T Heavy Engineering",
          sector: "Heavy Engineering & Capital Goods",
          experience: "18 Years",
          location: "Pune, Maharashtra",
          key_skills: ["CNC Machining", "Six Sigma Black Belt", "Heavy Fabrication", "Lean Manufacturing", "Plant P&L"],
          notice_period: "1 month",
          ug_qualification: "B.Tech Mechanical Engineering",
          pg_qualification: "M.Tech Production Engineering",
          gender: "Male",
          annual_ctc: "48 Lacs",
          verified_mobile: true,
          verified_email: true,
          linkedin_url: "https://linkedin.com/in/sample-vmalhotra"
        },
        {
          name: "Pooja Deshmukh",
          email: "pooja.d@executive-search.mcp",
          phone: "+91 98112 33490",
          current_role: "Chief Technology Officer - EV Powertrain & Battery Systems",
          company: "Tata Motors Electric Mobility",
          sector: "Automotive & Electric Vehicles",
          experience: "15 Years",
          location: "Bengaluru, Karnataka",
          key_skills: ["Battery Management Systems (BMS)", "AUTOSAR", "Motor Controls", "Powertrain Integration", "Thermal Architecture"],
          notice_period: "0 - 15 days",
          ug_qualification: "B.E. Electrical & Electronics",
          pg_qualification: "MS Power Electronics (IISc)",
          gender: "Female",
          annual_ctc: "55 Lacs",
          verified_mobile: true,
          verified_email: true,
          linkedin_url: "https://linkedin.com/in/sample-pdeshmukh"
        },
        {
          name: "Rajesh K. Sharma",
          email: "rajesh.sharma@executive-search.mcp",
          phone: "+91 97180 88200",
          current_role: "Head of Metallurgy, Blast Furnace & Hot Strip Mill",
          company: "JSW Steel Ltd",
          sector: "Steel & Metallurgy",
          experience: "21 Years",
          location: "Jamshedpur, Jharkhand",
          key_skills: ["Blast Furnace Operations", "Continuous Casting", "Alloy Metallurgy", "Cost Optimization", "ISO 9001"],
          notice_period: "2 months",
          ug_qualification: "B.Tech Metallurgical Engineering (IIT BHU)",
          pg_qualification: "MBA Operations",
          gender: "Male",
          annual_ctc: "42 Lacs",
          verified_mobile: true,
          verified_email: true,
          linkedin_url: "https://linkedin.com/in/sample-rksharma"
        },
        {
          name: "Sunita Nair",
          email: "sunita.nair@executive-search.mcp",
          phone: "+91 99401 55621",
          current_role: "Director - Global Supply Chain & Strategic Sourcing",
          company: "Thermax Limited",
          sector: "Heavy Engineering & Capital Goods",
          experience: "16 Years",
          location: "Chennai, Tamil Nadu",
          key_skills: ["Strategic Sourcing", "Vendor Development", "ERP SAP S/4HANA", "Import-Export Compliance", "Contract Negotiation"],
          notice_period: "Currently serving notice period",
          ug_qualification: "B.Tech Industrial Engineering",
          pg_qualification: "Executive MBA (IIM Calcutta)",
          gender: "Female",
          annual_ctc: "38 Lacs",
          verified_mobile: true,
          verified_email: true,
          linkedin_url: "https://linkedin.com/in/sample-snair"
        },
        {
          name: "Anand Verma",
          email: "anand.verma@executive-search.mcp",
          phone: "+91 98450 12890",
          current_role: "General Manager - Aerospace Composites & Avionics Quality",
          company: "Bharat Forge Aerospace",
          sector: "Aerospace & Defence",
          experience: "19 Years",
          location: "Hyderabad, Telangana",
          key_skills: ["AS9100 Rev D", "Titanium Forging", "NADCAP Audits", "Avionics Assemblies", "Defence Offsets"],
          notice_period: "1 month",
          ug_qualification: "B.Tech Aeronautical Engineering",
          pg_qualification: "M.Tech Materials Science",
          gender: "Male",
          annual_ctc: "45 Lacs",
          verified_mobile: true,
          verified_email: true,
          linkedin_url: "https://linkedin.com/in/sample-averma"
        },
        {
          name: "Deepak Chawla",
          email: "deepak.c@executive-search.mcp",
          phone: "+91 98710 99011",
          current_role: "Head of Project Engineering - Solar & Wind EPC",
          company: "Suzlon Green Energy",
          sector: "Renewable Energy & CleanTech",
          experience: "14 Years",
          location: "Gurugram, Haryana",
          key_skills: ["Utility Scale EPC", "Grid Interconnection", "SCADA", "Turbine Erection", "PPA Execution"],
          notice_period: "3 months",
          ug_qualification: "B.Tech Electrical Engineering",
          pg_qualification: "PG Diploma Project Management",
          gender: "Male",
          annual_ctc: "35 Lacs",
          verified_mobile: true,
          verified_email: true,
          linkedin_url: "https://linkedin.com/in/sample-dchawla"
        },
        {
          name: "Megha Sengupta",
          email: "megha.sengupta@executive-search.mcp",
          phone: "+91 98300 77412",
          current_role: "Chief Operating Officer (COO) - Industrial Automation & Robotics",
          company: "Kirloskar Automation Systems",
          sector: "Industrial Automation",
          experience: "22 Years",
          location: "Pune, Maharashtra",
          key_skills: ["Industrial IoT", "PLC & DCS Architecture", "Factory Automation", "Global P&L", "Transformational Leadership"],
          notice_period: "0 - 15 days",
          ug_qualification: "B.E. Instrumentation & Control",
          pg_qualification: "Executive Post Graduate (ISB)",
          gender: "Female",
          annual_ctc: "60 Lacs",
          verified_mobile: true,
          verified_email: true,
          linkedin_url: "https://linkedin.com/in/sample-msengupta"
        },
        {
          name: "Arun Mehra",
          email: "arun.mehra@executive-search.mcp",
          phone: "+91 98201 66530",
          current_role: "Head of Heavy Fabrication & Pressure Vessels",
          company: "Godrej Process Equipment",
          sector: "Heavy Engineering & Capital Goods",
          experience: "17 Years",
          location: "Mumbai, Maharashtra",
          key_skills: ["ASME Section VIII", "Heavy Nuclear Vessels", "Welding Engineering", "Submerged Arc Welding", "Client Interface"],
          notice_period: "2 months",
          ug_qualification: "B.Tech Mechanical",
          pg_qualification: "Certified Welding Inspector (AWS)",
          gender: "Male",
          annual_ctc: "40 Lacs",
          verified_mobile: true,
          verified_email: true,
          linkedin_url: "https://linkedin.com/in/sample-amehra"
        }
      ];

      await Candidate.insertMany(samples);
      console.log(`🎯 Seeded ${samples.length} executive candidate profiles for Resdex Talent Search.`);
    }
  } catch (err) {
    console.error('Error seeding sample candidates:', err.message);
  }
}

module.exports = { seedSampleCandidates };

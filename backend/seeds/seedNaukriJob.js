const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const JobPosting = require('../models/JobPosting');

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/mcp_consultants';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    // Check if job already exists
    const existing = await JobPosting.findOne({ referenceCode: 'NAUKRI-051026801594' });
    if (existing) {
      console.log('Job already exists in database with ID:', existing._id);
      process.exit(0);
    }

    const job = new JobPosting({
      title: 'Design Engineer',
      company: 'MCP Consultants',
      hideCompany: false,
      department: 'Engineering & R&D',
      employmentType: 'Full Time, Permanent',
      workExperienceMin: 1,
      workExperienceMax: 6,
      workMode: 'In office',
      salaryType: 'Total CTC',
      salaryMin: '3.00 Lacs',
      salaryMax: '7.50 Lacs',
      hideSalary: false,
      locations: ['Baddi'],
      relocateToLocations: true,
      vacancies: 2,
      skills: [
        { name: 'AutoCAD', mandatory: true },
        { name: 'SolidWorks', mandatory: true },
        { name: 'Gear Manufacturing', mandatory: true },
        { name: 'Machine Design', mandatory: true },
        { name: '3D Modeling', mandatory: false },
        { name: '2D Modeling', mandatory: false },
        { name: 'Design Calculations', mandatory: false },
        { name: 'Gearbox Design', mandatory: false },
        { name: 'Mechanical Design', mandatory: false },
        { name: 'Design Costing', mandatory: false }
      ],
      education: ['B.Tech / B.E. in Mechanical Engineering', 'Diploma in Mechanical Engineering'],
      industry: 'Manufacturing / Industrial Automation / Gear Industry',
      jobDescription: `We required candidate for the position of Design Engineer who should have experience in gear industry.

Key Details:
• Total Experience: 1 - 6 years
• CTC Offered: ₹3.00 Lacs - ₹7.50 Lacs P.A.
• Location: Baddi (Himachal Pradesh)
• Industry: Gear Manufacturing / Heavy Machinery

Key Responsibilities:
• Lead mechanical design, calculations, and 2D/3D component modeling for industrial gearboxes and gearing systems.
• Prepare manufacturing fabrication drawings, BOMs (Bill of Materials), and GD&T specifications using AutoCAD and SolidWorks.
• Coordinate with gear hobbing, heat treatment, and precision assembly lines to ensure compliance with quality tolerances.
• Support cost estimation, design optimization, and client technical reviews.

Contact Person:
Shikha (MCP Consultants) - 9888426060 / Shikha.mcpconsultants@gmail.com`,
      candidateProfile: `Candidate should have 1 to 6 years of proven hands-on design experience in gear manufacturing or mechanical transmission systems. Proficiency in AutoCAD and 3D CAD modeling software (SolidWorks / SolidEdge / Creo) is essential.`,
      perks: 'Health insurance, annual appraisal, performance incentive, PF & statutory benefits as per policy.',
      screeningQuestions: [
        'How many years of experience do you have with gear design and manufacturing?',
        'Which CAD design tools are you most proficient in (AutoCAD / SolidWorks / Creo)?',
        'Are you comfortable working on-site at Baddi?'
      ],
      isWalkIn: false,
      collaborators: ['Shikha.mcpconsultants@gmail.com', 'recruiter.mcp@gmail.com'],
      responseEmailPolicy: 'As a daily summary',
      referenceCode: 'NAUKRI-051026801594',
      status: 'Active',
      viewsCount: 14,
      applicationsCount: 0
    });

    await job.save();
    console.log('Successfully saved Design Engineer job to DB with ID:', job._id);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding job:', err);
    process.exit(1);
  }
}

seed();

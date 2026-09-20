require('dotenv').config();
const mongoose = require('mongoose');

async function cleanData() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB Atlas');

  // 1. Clean JobPostings (delete sample job MCP-2026-091)
  const jobResult = await mongoose.connection.db.collection('jobpostings').deleteMany({});
  console.log('JobPostings deleted:', jobResult.deletedCount);

  // 2. Clean Candidates (delete all 10 sample candidates)
  const candResult = await mongoose.connection.db.collection('candidates').deleteMany({});
  console.log('Candidates deleted:', candResult.deletedCount);

  // 3. Clean Inquiries (delete 3 test inquiries)
  const inqResult = await mongoose.connection.db.collection('inquiries').deleteMany({});
  console.log('Inquiries deleted:', inqResult.deletedCount);

  // 4. Clean Mandates (delete test 'rohan@example.com', preserve 'nitinsingh013120@gmail.com')
  const manResult = await mongoose.connection.db.collection('mandates').deleteMany({
    email: { $ne: 'nitinsingh013120@gmail.com' }
  });
  console.log('Test Mandates deleted:', manResult.deletedCount);

  // 5. Verify counts
  console.log('--- Current Counts ---');
  console.log('jobpostings count:', await mongoose.connection.db.collection('jobpostings').countDocuments());
  console.log('candidates count:', await mongoose.connection.db.collection('candidates').countDocuments());
  console.log('inquiries count:', await mongoose.connection.db.collection('inquiries').countDocuments());
  console.log('mandates count:', await mongoose.connection.db.collection('mandates').countDocuments());
  console.log('admins count:', await mongoose.connection.db.collection('admins').countDocuments());

  const remainingMandates = await mongoose.connection.db.collection('mandates').find({}).toArray();
  console.log('Remaining Mandates:', remainingMandates.map(m => ({ name: m.name, email: m.email })));

  const remainingAdmins = await mongoose.connection.db.collection('admins').find({}).toArray();
  console.log('Remaining Admins:', remainingAdmins.map(a => ({ username: a.username, email: a.email })));

  await mongoose.disconnect();
  console.log('Cleanup finished successfully.');
}

cleanData().catch(err => {
  console.error('Error during cleanup:', err);
  process.exit(1);
});

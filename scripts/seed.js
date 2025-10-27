const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('Error: MONGO_URI environment variable not set.');
  process.exit(1);
}

async function seed() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db();
    // Insert demo users
    await db.collection('users').insertMany([
      { name: 'Alice', email: 'alice@example.com', role: 'jobseeker' },
      { name: 'Bob', email: 'bob@example.com', role: 'recruiter' },
    ]);
    // Insert demo jobs
    await db.collection('jobs').insertMany([
      { title: 'Frontend Developer', company: 'Acme Corp' },
      { title: 'Backend Developer', company: 'Beta Inc' },
    ]);
    console.log('Seed data inserted successfully.');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await client.close();
  }
}

seed();

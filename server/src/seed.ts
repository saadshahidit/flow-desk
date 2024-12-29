import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Task from './models/Task';
import Activity from './models/Activity';

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Task.deleteMany({});
  await Activity.deleteMany({});

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@flowdesk.com',
    password: 'password123',
    role: 'admin',
  });

  const alice = await User.create({
    name: 'Alice',
    email: 'alice@flowdesk.com',
    password: 'password123',
    role: 'member',
  });

  const bob = await User.create({
    name: 'Bob',
    email: 'bob@flowdesk.com',
    password: 'password123',
    role: 'member',
  });

  const t1 = await Task.create({
    title: 'Design landing page',
    description: 'Create wireframes and high-fidelity mockups for the new landing page.',
    priority: 'High',
    status: 'In Progress',
    dueDate: new Date('2026-04-01'),
    assignedTo: alice._id,
    createdBy: admin._id,
  });

  const t2 = await Task.create({
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment.',
    priority: 'Medium',
    status: 'Pending',
    dueDate: new Date('2026-04-10'),
    assignedTo: bob._id,
    createdBy: admin._id,
  });

  const t3 = await Task.create({
    title: 'Write API documentation',
    description: 'Document all REST endpoints using OpenAPI spec.',
    priority: 'Low',
    status: 'Review',
    dueDate: new Date('2026-03-25'),
    assignedTo: alice._id,
    createdBy: admin._id,
  });

  const t4 = await Task.create({
    title: 'Fix auth token expiry bug',
    description: 'Tokens are not being refreshed correctly on expiry.',
    priority: 'High',
    status: 'Accepted',
    dueDate: new Date('2026-03-20'),
    assignedTo: bob._id,
    createdBy: admin._id,
  });

  await Activity.create({ task: t1._id, user: admin._id, action: 'Created this task' });
  await Activity.create({ task: t1._id, user: alice._id, action: 'Changed status to In Progress' });
  await Activity.create({ task: t2._id, user: admin._id, action: 'Created this task' });
  await Activity.create({ task: t3._id, user: admin._id, action: 'Created this task' });
  await Activity.create({ task: t3._id, user: alice._id, action: 'Changed status to Review' });
  await Activity.create({ task: t4._id, user: admin._id, action: 'Created this task' });
  await Activity.create({ task: t4._id, user: bob._id, action: 'Changed status to Accepted' });

  console.log('Seeded successfully');
  console.log('  admin@flowdesk.com / password123  (admin)');
  console.log('  alice@flowdesk.com / password123  (member)');
  console.log('  bob@flowdesk.com   / password123  (member)');
  await mongoose.disconnect();
}

seed().catch(console.error);

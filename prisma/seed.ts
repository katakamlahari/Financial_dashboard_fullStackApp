import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.financialRecord.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
    },
  });

  const analystUser = await prisma.user.create({
    data: {
      email: 'analyst@example.com',
      password: await bcrypt.hash('analyst123', 10),
      firstName: 'Analyst',
      lastName: 'User',
      role: 'ANALYST',
      isActive: true,
    },
  });

  const viewerUser = await prisma.user.create({
    data: {
      email: 'viewer@example.com',
      password: await bcrypt.hash('viewer123', 10),
      firstName: 'Viewer',
      lastName: 'User',
      role: 'VIEWER',
      isActive: true,
    },
  });

  // Create sample financial records
  const now = new Date();
  const records = [
    {
      amount: 5000,
      type: 'INCOME',
      category: 'Salary',
      date: new Date(now.getFullYear(), now.getMonth(), 1),
      notes: 'Monthly salary',
      createdBy: adminUser.id,
    },
    {
      amount: 1200,
      type: 'EXPENSE',
      category: 'Rent',
      date: new Date(now.getFullYear(), now.getMonth(), 5),
      notes: 'Monthly rent',
      createdBy: adminUser.id,
    },
    {
      amount: 300,
      type: 'EXPENSE',
      category: 'Groceries',
      date: new Date(now.getFullYear(), now.getMonth(), 10),
      notes: 'Weekly groceries',
      createdBy: adminUser.id,
    },
    {
      amount: 500,
      type: 'INCOME',
      category: 'Freelance',
      date: new Date(now.getFullYear(), now.getMonth(), 15),
      notes: 'Project payment',
      createdBy: analystUser.id,
    },
    {
      amount: 150,
      type: 'EXPENSE',
      category: 'Entertainment',
      date: new Date(now.getFullYear(), now.getMonth(), 20),
      notes: 'Movies and dining',
      createdBy: analystUser.id,
    },
  ];

  for (const record of records) {
    await prisma.financialRecord.create({ data: record });
  }

  console.log('Seeding completed successfully!');
  console.log('Sample Users:');
  console.log('Admin:', adminUser.email, '/ admin123');
  console.log('Analyst:', analystUser.email, '/ analyst123');
  console.log('Viewer:', viewerUser.email, '/ viewer123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Hash the default password
  const defaultPassword = await bcrypt.hash('defaultpass123', 10);

  // Create test users
  const users = [
    {
      email: 'customer@petmanagement.com',
      name: '테스트 고객',
      password: defaultPassword,
      role: 'CUSTOMER' as const,
      phone: '010-1234-5678',
    },
    {
      email: 'groomer@petmanagement.com',
      name: '테스트 미용사',
      password: defaultPassword,
      role: 'GROOMER' as const,
      phone: '010-2345-6789',
    },
    {
      email: 'admin@petmanagement.com',
      name: '관리자',
      password: defaultPassword,
      role: 'ADMIN' as const,
      phone: '010-3456-7890',
    },
  ];

  for (const userData of users) {
    try {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: userData,
      });
      console.log(`Created/Updated user: ${user.email} with role: ${user.role}`);
    } catch (error) {
      console.error(`Error creating user ${userData.email}:`, error);
    }
  }

  // Create some test pets for the customer
  const customer = await prisma.user.findUnique({
    where: { email: 'customer@petmanagement.com' },
  });

  if (customer) {
    const pets = [
      {
        name: '뽀삐',
        type: 'DOG' as const,
        weight: 5.2,
        age: 3,
        gender: 'MALE' as const,
        customerId: customer.id,
      },
      {
        name: '나비',
        type: 'CAT' as const,
        weight: 4.8,
        age: 2,
        gender: 'FEMALE' as const,
        hairType: 'LONG_HAIR' as const,
        customerId: customer.id,
      },
    ];

    for (const petData of pets) {
      try {
        const pet = await prisma.pet.create({
          data: petData,
        });
        console.log(`Created pet: ${pet.name} for customer`);
      } catch (error) {
        console.error(`Error creating pet ${petData.name}:`, error);
      }
    }
  }

  // Create some test services
  const services = [
    {
      name: '기본 목욕',
      description: '샴푸와 드라이를 포함한 기본 목욕 서비스',
      basePrice: 30000,
      durationMinutes: 60,
      petTypes: ['DOG', 'CAT'],
      availableSizes: ['SMALL', 'MEDIUM', 'LARGE'],
      isActive: true,
    },
    {
      name: '전체 미용',
      description: '목욕, 털 다듬기, 발톱 손질을 포함한 전체 미용',
      basePrice: 50000,
      durationMinutes: 90,
      petTypes: ['DOG'],
      availableSizes: ['SMALL', 'MEDIUM', 'LARGE'],
      isActive: true,
    },
    {
      name: '발톱 손질',
      description: '발톱 손질 및 정리',
      basePrice: 15000,
      durationMinutes: 30,
      petTypes: ['DOG', 'CAT'],
      availableSizes: ['SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE'],
      isActive: true,
    },
  ];

  for (const serviceData of services) {
    try {
      // Check if service exists first
      const existingService = await prisma.service.findFirst({
        where: { name: serviceData.name },
      });

      let service;
      if (existingService) {
        service = await prisma.service.update({
          where: { id: existingService.id },
          data: serviceData,
        });
      } else {
        service = await prisma.service.create({
          data: serviceData,
        });
      }
      console.log(`Created/Updated service: ${service.name}`);
    } catch (error) {
      console.error(`Error creating service ${serviceData.name}:`, error);
    }
  }

  // Create commission grades
  const commissionGrades = [
    {
      name: '브론즈',
      description: '신규 미용사 등급',
      commissionRate: 60.0,
      displayOrder: 1,
      isActive: true,
    },
    {
      name: '실버',
      description: '숙련 미용사 등급',
      commissionRate: 65.0,
      displayOrder: 2,
      isActive: true,
    },
    {
      name: '골드',
      description: '전문 미용사 등급',
      commissionRate: 70.0,
      displayOrder: 3,
      isActive: true,
    },
    {
      name: '플래티넘',
      description: '최고급 미용사 등급',
      commissionRate: 75.0,
      displayOrder: 4,
      isActive: true,
    },
  ];

  for (const gradeData of commissionGrades) {
    try {
      // Check if grade with same name already exists
      const existingGrade = await prisma.groomerCommissionGrade.findFirst({
        where: { name: gradeData.name },
      });

      if (existingGrade) {
        console.log(`Commission grade already exists: ${gradeData.name}`);
        continue;
      }

      const grade = await prisma.groomerCommissionGrade.create({
        data: gradeData,
      });
      console.log(`Created/Updated commission grade: ${grade.name} (${grade.commissionRate}%)`);
    } catch (error) {
      console.error(`Error creating commission grade ${gradeData.name}:`, error);
    }
  }

  console.log('Database seed completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error in seed script:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

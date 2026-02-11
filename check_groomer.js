const { PrismaClient } = require('@mimisalon/shared');
const prisma = new PrismaClient();

async function checkGroomer() {
  try {
    const groomer = await prisma.user.findUnique({
      where: { id: 'cml4rjadh0006m1h0m77waa3n' },
      include: { groomerProfile: true }
    });
    
    console.log('미용사 정보:', JSON.stringify(groomer, null, 2));
  } catch (error) {
    console.error('오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkGroomer();

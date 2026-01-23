import { PrismaClient, PetType, BreedCategory } from '@prisma/client';

const prisma = new PrismaClient();

interface BreedData {
  name: string;
  petType: PetType;
  category: BreedCategory;
  displayOrder: number;
}

const breeds: BreedData[] = [
  // 소형견
  { name: '토이푸들', petType: 'DOG', category: 'SMALL', displayOrder: 1 },
  { name: '포메라니안', petType: 'DOG', category: 'SMALL', displayOrder: 2 },
  { name: '말티즈', petType: 'DOG', category: 'SMALL', displayOrder: 3 },
  { name: '시츄', petType: 'DOG', category: 'SMALL', displayOrder: 4 },
  { name: '요크셔테리어', petType: 'DOG', category: 'SMALL', displayOrder: 5 },
  { name: '치와와', petType: 'DOG', category: 'SMALL', displayOrder: 6 },
  { name: '닥스훈트', petType: 'DOG', category: 'SMALL', displayOrder: 7 },
  { name: '미니어처핀셔', petType: 'DOG', category: 'SMALL', displayOrder: 8 },
  { name: '파피용', petType: 'DOG', category: 'SMALL', displayOrder: 9 },
  { name: '페키니즈', petType: 'DOG', category: 'SMALL', displayOrder: 10 },

  // 중형견
  { name: '미니어처푸들', petType: 'DOG', category: 'MEDIUM', displayOrder: 11 },
  { name: '스피츠', petType: 'DOG', category: 'MEDIUM', displayOrder: 12 },
  { name: '코카스파니엘', petType: 'DOG', category: 'MEDIUM', displayOrder: 13 },
  { name: '슈나우저', petType: 'DOG', category: 'MEDIUM', displayOrder: 14 },
  { name: '비글', petType: 'DOG', category: 'MEDIUM', displayOrder: 15 },
  { name: '프렌치불독', petType: 'DOG', category: 'MEDIUM', displayOrder: 16 },
  { name: '보스턴테리어', petType: 'DOG', category: 'MEDIUM', displayOrder: 17 },
  { name: '잉글리시코카', petType: 'DOG', category: 'MEDIUM', displayOrder: 18 },
  { name: '불테리어', petType: 'DOG', category: 'MEDIUM', displayOrder: 19 },
  { name: '샤페이', petType: 'DOG', category: 'MEDIUM', displayOrder: 20 },

  // 대형견
  { name: '스탠다드푸들', petType: 'DOG', category: 'LARGE', displayOrder: 21 },
  { name: '골든리트리버', petType: 'DOG', category: 'LARGE', displayOrder: 22 },
  { name: '래브라도리트리버', petType: 'DOG', category: 'LARGE', displayOrder: 23 },
  { name: '시베리안허스키', petType: 'DOG', category: 'LARGE', displayOrder: 24 },
  { name: '알래스칸말라뮤트', petType: 'DOG', category: 'LARGE', displayOrder: 25 },
  { name: '사모예드', petType: 'DOG', category: 'LARGE', displayOrder: 26 },
  { name: '진돗개', petType: 'DOG', category: 'LARGE', displayOrder: 27 },
  { name: '셰퍼드', petType: 'DOG', category: 'LARGE', displayOrder: 28 },
  { name: '로트와일러', petType: 'DOG', category: 'LARGE', displayOrder: 29 },
  { name: '도베르만', petType: 'DOG', category: 'LARGE', displayOrder: 30 },

  // 특수견
  { name: '비숑프리제', petType: 'DOG', category: 'SPECIAL', displayOrder: 31 },
  { name: '꼬똥드툴레아', petType: 'DOG', category: 'SPECIAL', displayOrder: 32 },
  { name: '웰시코기', petType: 'DOG', category: 'SPECIAL', displayOrder: 33 },
  { name: '보더콜리', petType: 'DOG', category: 'SPECIAL', displayOrder: 34 },
  { name: '폭스테리어', petType: 'DOG', category: 'SPECIAL', displayOrder: 35 },
  { name: '잭러셀테리어', petType: 'DOG', category: 'SPECIAL', displayOrder: 36 },
  { name: '스코티시테리어', petType: 'DOG', category: 'SPECIAL', displayOrder: 37 },
  { name: '에어데일테리어', petType: 'DOG', category: 'SPECIAL', displayOrder: 38 },
  { name: '불독', petType: 'DOG', category: 'SPECIAL', displayOrder: 39 },
  { name: '차우차우', petType: 'DOG', category: 'SPECIAL', displayOrder: 40 },

  // 고양이 - 단모
  { name: '코리안숏헤어', petType: 'CAT', category: 'SHORT_HAIR', displayOrder: 41 },
  { name: '브리티시숏헤어', petType: 'CAT', category: 'SHORT_HAIR', displayOrder: 42 },
  { name: '아메리칸숏헤어', petType: 'CAT', category: 'SHORT_HAIR', displayOrder: 43 },
  { name: '러시안블루', petType: 'CAT', category: 'SHORT_HAIR', displayOrder: 44 },
  { name: '샴', petType: 'CAT', category: 'SHORT_HAIR', displayOrder: 45 },
  { name: '아비시니안', petType: 'CAT', category: 'SHORT_HAIR', displayOrder: 46 },
  { name: '벵골', petType: 'CAT', category: 'SHORT_HAIR', displayOrder: 47 },
  { name: '스코티시폴드', petType: 'CAT', category: 'SHORT_HAIR', displayOrder: 48 },
  { name: '스핑크스', petType: 'CAT', category: 'SHORT_HAIR', displayOrder: 49 },
  { name: '먼치킨', petType: 'CAT', category: 'SHORT_HAIR', displayOrder: 50 },

  // 고양이 - 장모
  { name: '페르시안', petType: 'CAT', category: 'LONG_HAIR', displayOrder: 51 },
  { name: '래그돌', petType: 'CAT', category: 'LONG_HAIR', displayOrder: 52 },
  { name: '메인쿤', petType: 'CAT', category: 'LONG_HAIR', displayOrder: 53 },
  { name: '노르웨이숲', petType: 'CAT', category: 'LONG_HAIR', displayOrder: 54 },
  { name: '터키시앙고라', petType: 'CAT', category: 'LONG_HAIR', displayOrder: 55 },
  { name: '시베리안', petType: 'CAT', category: 'LONG_HAIR', displayOrder: 56 },
  { name: '버만', petType: 'CAT', category: 'LONG_HAIR', displayOrder: 57 },
  { name: '히말라얀', petType: 'CAT', category: 'LONG_HAIR', displayOrder: 58 },
  { name: '발리니즈', petType: 'CAT', category: 'LONG_HAIR', displayOrder: 59 },
  { name: '소말리', petType: 'CAT', category: 'LONG_HAIR', displayOrder: 60 },
];

async function main() {
  console.log('Starting breed seed...');

  for (const breed of breeds) {
    try {
      await prisma.breed.upsert({
        where: {
          name_petType: {
            name: breed.name,
            petType: breed.petType,
          },
        },
        update: {
          category: breed.category,
          displayOrder: breed.displayOrder,
          isActive: true,
        },
        create: breed,
      });
      console.log(`✅ Created/Updated breed: ${breed.name} (${breed.category})`);
    } catch (error) {
      console.error(`❌ Error creating breed ${breed.name}:`, error);
    }
  }

  console.log('✅ Breed seed completed!');
}

main()
  .catch((e) => {
    console.error('Error in seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
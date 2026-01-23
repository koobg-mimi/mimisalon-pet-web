import { BreedCategory } from '@mimisalon/shared';

// 강아지 카테고리
export const DOG_CATEGORIES: Record<string, string> = {
  SMALL: '소형',
  MEDIUM: '중형',
  LARGE: '대형',
  SPECIAL: '특수',
};

// 고양이 카테고리
export const CAT_CATEGORIES: Record<string, string> = {
  SHORT_HAIR: '단모',
  LONG_HAIR: '장모',
};

// 전체 카테고리
export const BREED_CATEGORIES = {
  DOG: DOG_CATEGORIES,
  CAT: CAT_CATEGORIES,
} as const;

// 카테고리 이름 가져오기 헬퍼 함수
export function getCategoryName(category: BreedCategory): string {
  const allCategories = { ...DOG_CATEGORIES, ...CAT_CATEGORIES };
  return allCategories[category] || category;
}

// 동물 타입별 카테고리 가져오기
export function getCategoriesByPetType(petType: 'DOG' | 'CAT'): BreedCategory[] {
  if (petType === 'DOG') {
    return ['SMALL', 'MEDIUM', 'LARGE', 'SPECIAL'] as BreedCategory[];
  } else {
    return ['SHORT_HAIR', 'LONG_HAIR'] as BreedCategory[];
  }
}

// 카테고리가 해당 동물 타입에 유효한지 확인
export function isValidCategoryForPetType(
  category: BreedCategory,
  petType: 'DOG' | 'CAT'
): boolean {
  const validCategories = getCategoriesByPetType(petType);
  return validCategories.includes(category);
}

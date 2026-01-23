'use client';

import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { DOG_CATEGORIES, CAT_CATEGORIES } from '@/constants/breed-categories';

interface Breed {
  id: string;
  name: string;
  petType: 'DOG' | 'CAT';
  category: 'SMALL' | 'MEDIUM' | 'LARGE' | 'SPECIAL' | 'SHORT_HAIR' | 'LONG_HAIR';
  displayOrder: number;
  isActive: boolean;
}

interface BreedSelectorProps {
  selectedBreedIds: string[];
  onChange: (breedIds: string[]) => void;
  petType?: 'DOG' | 'CAT' | 'ALL';
}

export function BreedSelector({ selectedBreedIds, onChange, petType = 'ALL' }: BreedSelectorProps) {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  // Fetch breeds
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetch('/api/breeds');
        if (!response.ok) throw new Error('Failed to fetch breeds');
        const data = await response.json();
        setBreeds(data);
      } catch (error) {
        console.error('Error fetching breeds:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBreeds();
  }, []);

  // Filter breeds based on petType prop
  const filteredBreeds = petType === 'ALL' ? breeds : breeds.filter((b) => b.petType === petType);

  // Group breeds by category
  const breedsByCategory = filteredBreeds.reduce(
    (acc, breed) => {
      if (!acc[breed.category]) {
        acc[breed.category] = [];
      }
      acc[breed.category].push(breed);
      return acc;
    },
    {} as Record<string, Breed[]>
  );

  // Handle individual breed selection
  const handleBreedToggle = (breedId: string) => {
    if (selectedBreedIds.includes(breedId)) {
      onChange(selectedBreedIds.filter((id) => id !== breedId));
    } else {
      onChange([...selectedBreedIds, breedId]);
    }
  };

  // Handle category selection
  const handleCategoryToggle = (category: string) => {
    const categoryBreeds = breedsByCategory[category] || [];
    const categoryBreedIds = categoryBreeds.map((b) => b.id);
    const allSelected = categoryBreedIds.every((id) => selectedBreedIds.includes(id));

    if (allSelected) {
      // Deselect all in this category
      onChange(selectedBreedIds.filter((id) => !categoryBreedIds.includes(id)));
    } else {
      // Select all in this category
      const newIds = [...selectedBreedIds];
      categoryBreedIds.forEach((id) => {
        if (!newIds.includes(id)) {
          newIds.push(id);
        }
      });
      onChange(newIds);
    }
  };

  // Get category display name
  const getCategoryName = (category: string) => {
    if (DOG_CATEGORIES[category]) return DOG_CATEGORIES[category];
    if (CAT_CATEGORIES[category]) return CAT_CATEGORIES[category];
    return category;
  };

  // Check if all breeds in a category are selected
  const isCategorySelected = (category: string) => {
    const categoryBreeds = breedsByCategory[category] || [];
    if (categoryBreeds.length === 0) return false;
    return categoryBreeds.every((b) => selectedBreedIds.includes(b.id));
  };

  // Check if some breeds in a category are selected
  const isCategoryPartiallySelected = (category: string) => {
    const categoryBreeds = breedsByCategory[category] || [];
    if (categoryBreeds.length === 0) return false;
    const selected = categoryBreeds.filter((b) => selectedBreedIds.includes(b.id));
    return selected.length > 0 && selected.length < categoryBreeds.length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  const selectedCount = selectedBreedIds.filter((id) =>
    filteredBreeds.some((b) => b.id === id)
  ).length;

  return (
    <div className="space-y-3">
      {/* Header with expand/collapse */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="h-auto p-0 text-sm font-medium"
        >
          {expanded ? (
            <ChevronUp className="mr-1 h-4 w-4" />
          ) : (
            <ChevronDown className="mr-1 h-4 w-4" />
          )}
          품종 선택 ({selectedCount}개 선택됨)
        </Button>
      </div>

      {expanded && (
        <div className="space-y-4 rounded-lg border p-4">
          {/* Category bulk selection buttons */}
          <div className="space-y-2">
            {/* Dog categories */}
            {(petType === 'DOG' || petType === 'ALL') && Object.keys(DOG_CATEGORIES).length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">강아지 카테고리</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(DOG_CATEGORIES).map(([key, label]) => {
                    const hasBreeds = (breedsByCategory[key]?.length || 0) > 0;
                    if (!hasBreeds) return null;

                    return (
                      <Button
                        key={key}
                        type="button"
                        size="sm"
                        variant={isCategorySelected(key) ? 'default' : 'outline'}
                        onClick={() => handleCategoryToggle(key)}
                        className="h-7"
                      >
                        {label} 전체선택
                        {isCategoryPartiallySelected(key) && ' (부분)'}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cat categories */}
            {(petType === 'CAT' || petType === 'ALL') && Object.keys(CAT_CATEGORIES).length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">고양이 카테고리</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(CAT_CATEGORIES).map(([key, label]) => {
                    const hasBreeds = (breedsByCategory[key]?.length || 0) > 0;
                    if (!hasBreeds) return null;

                    return (
                      <Button
                        key={key}
                        type="button"
                        size="sm"
                        variant={isCategorySelected(key) ? 'default' : 'outline'}
                        onClick={() => handleCategoryToggle(key)}
                        className="h-7"
                      >
                        {label} 전체선택
                        {isCategoryPartiallySelected(key) && ' (부분)'}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Individual breed checkboxes grouped by category */}
          <div className="space-y-4">
            {Object.entries(breedsByCategory).map(([category, categoryBreeds]) => (
              <div key={category} className="space-y-2">
                <p className="text-muted-foreground text-sm font-semibold">
                  {getCategoryName(category)} ({categoryBreeds.length}종)
                </p>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                  {categoryBreeds.map((breed) => (
                    <label
                      key={breed.id}
                      className="hover:bg-muted/50 flex cursor-pointer items-center space-x-2 rounded p-1"
                    >
                      <Checkbox
                        checked={selectedBreedIds.includes(breed.id)}
                        onCheckedChange={() => handleBreedToggle(breed.id)}
                      />
                      <span className="text-sm">{breed.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="flex gap-2 border-t pt-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                const allIds = filteredBreeds.map((b) => b.id);
                onChange(allIds);
              }}
            >
              모두 선택
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => onChange([])}>
              모두 해제
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

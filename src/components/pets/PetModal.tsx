'use client';

import React, { useEffect, useState } from 'react';
import { Dog, Cat, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PetFormData, Breed } from '@/hooks/usePets';
import { usePetImages } from '@/hooks/usePetImages';
import { ImageUploadArea } from './ImageUploadArea';
import { toast } from 'sonner';
import { Pet } from '@mimisalon/shared';

interface PetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pet: PetFormData) => Promise<void>;
  pet?: Pet;
  mode: 'create' | 'edit';
  onImagesUpdated?: () => void;
}

export function PetModal({ isOpen, onClose, onSave, pet, mode, onImagesUpdated }: PetModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tempImages, setTempImages] = useState<File[]>([]); // Temporary images for creation mode
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [breedsLoading, setBreedsLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [formData, setFormData] = useState<PetFormData>({
    name: '',
    type: 'DOG',
    breedId: '',
    weight: undefined,
    age: undefined,
    birthDate: undefined,
    gender: undefined,
    hairType: undefined,
    specialNeeds: '',
    vaccinationStatus: 'UNKNOWN',
    vaccinationDate: undefined,
    termsAcception: false,
  });

  // Image management
  const {
    images,
    isLoading: imagesLoading,
    isUploading,
    fetchImages,
    uploadImages: uploadImagesHook,
    deleteImage,
    setPrimaryImage,
  } = usePetImages(pet?.id || '');

  // Fetch breeds
  const fetchBreeds = async () => {
    setBreedsLoading(true);
    try {
      const response = await fetch('/api/breeds');
      if (!response.ok) {
        throw new Error('Failed to fetch breeds');
      }
      const data = await response.json();
      setBreeds(data);
    } catch (error) {
      console.error('Error fetching breeds:', error);
      toast.error('품종 목록을 불러오는데 실패했습니다');
    } finally {
      setBreedsLoading(false);
    }
  };

  const uploadImages = async (files: File[]): Promise<void> => {
    await uploadImagesHook(files);
    // Notify parent that images have been updated
    if (onImagesUpdated) {
      onImagesUpdated();
    }
  };

  const handleDeleteImage = async (imageId: string): Promise<void> => {
    await deleteImage(imageId);
    // Notify parent that images have been updated
    if (onImagesUpdated) {
      onImagesUpdated();
    }
  };

  const handleSetPrimaryImage = async (imageId: string): Promise<void> => {
    await setPrimaryImage(imageId);
    // Notify parent that images have been updated
    if (onImagesUpdated) {
      onImagesUpdated();
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Fetch breeds when modal opens
      fetchBreeds();
    }

    if (pet && mode === 'edit') {
      setFormData({
        name: pet.name,
        type: pet.type,
        breedId: pet.breedId || '',
        weight: pet.weight || undefined,
        age: pet.age || undefined,
        birthDate: pet.birthDate
          ? (() => {
              const date = new Date(pet.birthDate);
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              return `${year}-${month}-${day}`;
            })()
          : undefined,
        gender: pet.gender || undefined,
        hairType: pet.hairType || undefined,
        specialNeeds: pet.specialNeeds || '',
        vaccinationStatus: pet.vaccinationStatus || 'UNKNOWN',
        vaccinationDate: pet.vaccinationDate
          ? (() => {
              const date = new Date(pet.vaccinationDate);
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              return `${year}-${month}-${day}`;
            })()
          : undefined,
        termsAcception: pet.termsAcception || false,
      });

      // Fetch images if editing
      if (pet.id) {
        fetchImages();
      }
    } else {
      setFormData({
        name: '',
        type: 'DOG',
        breedId: '',
        weight: undefined,
        age: undefined,
        birthDate: undefined,
        gender: undefined,
        hairType: undefined,
        specialNeeds: '',
        vaccinationStatus: 'UNKNOWN',
        vaccinationDate: undefined,
        termsAcception: false,
      });
      // Clear temp images when opening in create mode
      setTempImages([]);
    }
    setErrors({});
  }, [pet, mode, isOpen, fetchImages]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'weight' || name === 'age') {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseFloat(value) : undefined,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear breedId and hairType when changing pet type
    if (name === 'type') {
      setFormData((prev) => ({
        ...prev,
        breedId: '', // Clear breed selection when changing pet type
        hairType: value === 'DOG' ? undefined : prev.hairType,
      }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = '이름은 필수입니다';
    if (!formData.type) newErrors.type = '종류는 필수입니다';
    if (!formData.termsAcception)
      newErrors.termsAcception = '지병·노령견 미용 동의서에 동의해주셔야 합니다';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      // Format dates for API
      const formattedData = {
        ...formData,
        birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : undefined,
        vaccinationDate: formData.vaccinationDate
          ? new Date(formData.vaccinationDate).toISOString()
          : undefined,
      };

      // For create mode, pass images along with pet data
      if (mode === 'create' && tempImages.length > 0) {
        // We'll pass images to the parent handler
        await onSave({ ...formattedData, images: tempImages } as PetFormData & {
          images: File[];
        });
      } else {
        await onSave(formattedData);
      }

      onClose();
    } catch (error) {
      console.error('Failed to save pet:', error);
      toast.error('반려동물 저장에 실패했습니다');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle image selection for creation mode
  const handleImageSelect = (files: File[]) => {
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const validFiles = files.filter((file) => {
      if (!validImageTypes.includes(file.type)) {
        toast.error(`${file.name}: 지원하지 않는 파일 형식입니다`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name}: 파일 크기가 10MB를 초과합니다`);
        return false;
      }
      return true;
    });

    if (tempImages.length + validFiles.length > 10) {
      toast.error('최대 10개의 이미지만 업로드할 수 있습니다');
      return;
    }

    setTempImages((prev) => [...prev, ...validFiles]);
  };

  // Remove temp image for creation mode
  const handleRemoveTempImage = (index: number) => {
    setTempImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? '반려동물 등록' : '반려동물 정보 수정'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Upload Section - Top */}
          {mode === 'edit' && pet?.id ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">사진</h3>
                <span className="text-muted-foreground text-sm">{images.length}/10 사진</span>
              </div>
              <ImageUploadArea
                images={images}
                onUpload={uploadImages}
                onDelete={handleDeleteImage}
                onSetPrimary={handleSetPrimaryImage}
                maxImages={10}
                isUploading={isUploading}
                className="pb-4"
              />
              {images.length === 0 && !imagesLoading && (
                <div className="bg-muted/30 rounded-lg py-6 text-center">
                  <ImageIcon className="mx-auto mb-3 h-12 w-12 opacity-50" />
                  <p className="text-muted-foreground text-sm">
                    사진을 추가하여 반려동물을 소개해주세요
                  </p>
                </div>
              )}
            </div>
          ) : (
            mode === 'create' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">사진 추가 (선택사항)</h3>
                  <span className="text-muted-foreground text-sm">{tempImages.length}/10 사진</span>
                </div>

                {/* Image Upload Input */}
                <div className="border-border rounded-lg border-2 border-dashed p-6">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        handleImageSelect(Array.from(e.target.files));
                      }
                    }}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex cursor-pointer flex-col items-center justify-center"
                  >
                    <ImageIcon className="mb-3 h-12 w-12 opacity-50" />
                    <p className="mb-1 text-sm font-medium">사진을 선택하세요</p>
                    <p className="text-muted-foreground text-xs">JPG, PNG, GIF, WebP (최대 10MB)</p>
                  </label>
                </div>

                {/* Preview selected images */}
                {tempImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {tempImages.map((file, index) => (
                      <div key={index} className="group relative">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          width={120}
                          height={96}
                          className="h-24 w-full rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveTempImage(index)}
                          className="bg-destructive text-destructive-foreground absolute top-1 right-1 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          )}

          {/* Separator */}
          <Separator />

          {/* Basic Information Section - Bottom */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">기본 정보</h3>

            {/* Pet Type Selection - Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="type">반려동물 종류 *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="종류 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DOG">
                    <div className="flex items-center gap-2">
                      <Dog className="h-4 w-4" />
                      강아지
                    </div>
                  </SelectItem>
                  <SelectItem value="CAT">
                    <div className="flex items-center gap-2">
                      <Cat className="h-4 w-4" />
                      고양이
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름 *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="반려동물 이름"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="breed">품종</Label>
                {breedsLoading ? (
                  <div className="flex h-10 items-center justify-center rounded-md border">
                    <LoadingSpinner size="sm" />
                  </div>
                ) : (
                  <Select
                    value={formData.breedId}
                    onValueChange={(value) => handleSelectChange('breedId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="품종을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {breeds
                        .filter((breed) => breed.petType === formData.type)
                        .map((breed) => (
                          <SelectItem key={breed.id} value={breed.id}>
                            {breed.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {/* Conditional Fields based on Pet Type */}
            <div className="grid grid-cols-2 gap-4">
              {/* Hair Type for Cats Only */}
              {formData.type === 'CAT' && (
                <div className="space-y-2">
                  <Label htmlFor="hairType">털 타입</Label>
                  <Select
                    value={formData.hairType}
                    onValueChange={(value) => handleSelectChange('hairType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="털 타입 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SHORT_HAIR">단모</SelectItem>
                      <SelectItem value="LONG_HAIR">장모</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Gender - Always shown */}
              <div className="space-y-2">
                <Label htmlFor="gender">성별</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange('gender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="성별 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">남자</SelectItem>
                    <SelectItem value="FEMALE">여자</SelectItem>
                    <SelectItem value="UNKNOWN">모름</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Weight and Birth Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">체중 (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight || ''}
                  onChange={handleChange}
                  placeholder="예: 5.5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">생년월일</Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate || ''}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Vaccination */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vaccinationStatus">예방접종 상태</Label>
                <Select
                  value={formData.vaccinationStatus}
                  onValueChange={(value) => handleSelectChange('vaccinationStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="접종 상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UP_TO_DATE">접종 완료</SelectItem>
                    <SelectItem value="OVERDUE">접종 지연</SelectItem>
                    <SelectItem value="PARTIAL">부분 접종</SelectItem>
                    <SelectItem value="UNKNOWN">미확인</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vaccinationDate">최근 접종일</Label>
                <Input
                  id="vaccinationDate"
                  name="vaccinationDate"
                  type="date"
                  value={formData.vaccinationDate || ''}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Special Needs */}
            <div className="space-y-2">
              <Label htmlFor="specialNeeds">특이사항</Label>
              <Textarea
                id="specialNeeds"
                name="specialNeeds"
                value={formData.specialNeeds}
                onChange={handleChange}
                placeholder="알레르기, 지병, 주의사항 등을 입력해주세요"
                rows={3}
              />
            </div>
          </div>

          {/* 지병·노령견 미용 동의서 */}
          <Separator />
          <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-6">
            <div className="mb-4">
              <h3 className="mb-2 text-lg font-semibold text-orange-900">
                지병·노령견 미용 동의서
              </h3>
              <p className="text-sm text-orange-700">
                반려동물의 안전한 미용을 위해 아래 동의서를 확인하고 동의해주세요.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowTerms(!showTerms)}
              className="mb-4 w-full justify-between border-orange-300 bg-white hover:bg-orange-100"
            >
              <span className="text-sm font-medium">
                {showTerms ? '동의서 내용 접기' : '동의서 내용 보기'}
              </span>
              {showTerms ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>

            {showTerms && (
              <div className="mb-4 space-y-4 rounded-lg bg-white p-4 text-sm">
                <div className="rounded-lg border-l-4 border-orange-500 bg-orange-50 p-3">
                  <p className="mb-1 font-semibold text-orange-800">※ 안내사항 ※</p>
                  <p className="text-orange-700">
                    지병(뇌질환, 심장질환, 보행불가 등)이 있거나 노령견(만 10세 이상)인 경우 반드시
                    &quot;지병·노령견 미용 동의서&quot;를 작성해주셔야 합니다.
                  </p>
                </div>

                <ol className="list-decimal space-y-3 pl-5 text-gray-700">
                  <li>
                    미미살롱펫은 반려견 미용 시 반려견의 건강과 안전을 최우선으로 고려하여 소홀함
                    없이 최대한 주의를 기울여 미용을 진행할 것을 약속드립니다.
                  </li>
                  <li>
                    다만, 노령견 및 지병이 있는 반려견의 경우 노화 및 기존 질환으로 인한 각종 위험
                    요인이 존재할 수 있으며 미용 후 상태 악화 또는 스트레스 유발로 인한 원치 않는
                    상황이 발생할 가능성이 있음을 사전 고지드립니다.
                  </li>
                  <li>
                    미미살롱펫은 최대한 보호자의 입장에서 아이들의 상태를 살피며 미용을
                    진행하겠습니다. 그러나 위와 같은 상황으로 인해 발생하는 건강 이상 및 사고에 대해
                    미미살롱펫은 법적 책임을 지지 않음에 대해 보호자의 사전 동의를 요청드립니다.
                  </li>
                  <li>
                    또한, 본 동의서는 미용 서비스 진행 시마다 매번 작성하실 필요 없이, 1회 서명으로
                    향후 동일 조건 하에 동일하게 적용됩니다.
                  </li>
                </ol>
              </div>
            )}

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="termsAcception"
                checked={formData.termsAcception}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, termsAcception: e.target.checked }))
                }
                className="mt-1 h-5 w-5 rounded border-orange-300 text-orange-600 focus:ring-orange-500"
              />
              <div className="flex-1">
                <Label
                  htmlFor="termsAcception"
                  className="cursor-pointer text-base font-semibold text-orange-900"
                >
                  위 내용을 확인하였으며 지병·노령견 미용 동의서에 동의합니다{' '}
                  <span className="text-red-500">*</span>
                </Label>
                {errors.termsAcception && (
                  <p className="mt-1 text-sm text-red-500">{errors.termsAcception}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            취소
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                저장 중...
              </>
            ) : (
              '저장'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

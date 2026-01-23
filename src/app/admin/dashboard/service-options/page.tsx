'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { DOG_CATEGORIES, CAT_CATEGORIES } from '@/constants/breed-categories'

interface ServiceOption {
  id: string
  name: string
  description?: string
  price: number
  isActive: boolean
  displayOrder: number
  applicableCategories: string[]
  createdAt: string
  updatedAt: string
}

interface ServiceOptionFormData {
  name: string
  description: string
  price: string
  applicableCategories: string[]
  displayOrder: string
  isActive: boolean
}

export default function ServiceOptionsPage() {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingOption, setEditingOption] = useState<ServiceOption | null>(null)
  const [formData, setFormData] = useState<ServiceOptionFormData>({
    name: '',
    description: '',
    price: '',
    applicableCategories: [],
    displayOrder: '0',
    isActive: true,
  })

  // Fetch service options
  const {
    data: options = [],
    isLoading,
    isError,
    error,
  } = useQuery<ServiceOption[]>({
    queryKey: ['admin', 'service-options'],
    queryFn: async () => {
      const response = await fetch('/api/admin/service-options')
      if (!response.ok) {
        throw new Error('Failed to fetch service options')
      }
      return response.json()
    },
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: ServiceOptionFormData) => {
      const response = await fetch('/api/admin/service-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          description: data.description || undefined,
          price: parseFloat(data.price),
          applicableCategories: data.applicableCategories,
          displayOrder: parseInt(data.displayOrder),
          isActive: data.isActive,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create option')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'service-options'] })
      toast.success('옵션 생성 완료', {
        description: '서비스 옵션이 성공적으로 생성되었습니다.',
      })
      handleCloseDialog()
    },
    onError: (error: Error) => {
      toast.error('옵션 생성 실패', {
        description: error.message,
      })
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ServiceOptionFormData }) => {
      const response = await fetch(`/api/admin/service-options/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          description: data.description || undefined,
          price: parseFloat(data.price),
          applicableCategories: data.applicableCategories,
          displayOrder: parseInt(data.displayOrder),
          isActive: data.isActive,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update option')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'service-options'] })
      toast.success('옵션 수정 완료', {
        description: '서비스 옵션이 성공적으로 수정되었습니다.',
      })
      handleCloseDialog()
    },
    onError: (error: Error) => {
      toast.error('옵션 수정 실패', {
        description: error.message,
      })
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/service-options/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete option')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'service-options'] })
      toast.success('옵션 삭제 완료', {
        description: '서비스 옵션이 성공적으로 삭제되었습니다.',
      })
    },
    onError: (error: Error) => {
      toast.error('옵션 삭제 실패', {
        description: error.message,
      })
    },
  })

  const handleOpenDialog = (option?: ServiceOption) => {
    if (option) {
      setEditingOption(option)
      setFormData({
        name: option.name,
        description: option.description || '',
        price: option.price.toString(),
        applicableCategories: option.applicableCategories,
        displayOrder: option.displayOrder.toString(),
        isActive: option.isActive,
      })
    } else {
      setEditingOption(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        applicableCategories: [],
        displayOrder: '0',
        isActive: true,
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingOption(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      applicableCategories: [],
      displayOrder: '0',
      isActive: true,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingOption) {
      updateMutation.mutate({ id: editingOption.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('정말 이 옵션을 삭제하시겠습니까?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      applicableCategories: prev.applicableCategories.includes(category)
        ? prev.applicableCategories.filter((c) => c !== category)
        : [...prev.applicableCategories, category],
    }))
  }

  const getCategoryDisplayName = (category: string): string => {
    return { ...DOG_CATEGORIES, ...CAT_CATEGORIES }[category] || category
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-destructive flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p>{error instanceof Error ? error.message : '옵션을 불러오는데 실패했습니다'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">서비스 옵션 관리</h1>
          <p className="text-muted-foreground mt-2">
            반려동물 상태에 따른 추가 서비스 옵션을 관리합니다
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          옵션 추가
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>서비스 옵션 목록</CardTitle>
          <CardDescription>총 {options.length}개의 옵션이 등록되어 있습니다</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>옵션명</TableHead>
                <TableHead>설명</TableHead>
                <TableHead>가격</TableHead>
                <TableHead>적용 카테고리</TableHead>
                <TableHead>순서</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {options.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-muted-foreground text-center">
                    등록된 옵션이 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                options.map((option) => (
                  <TableRow key={option.id}>
                    <TableCell className="font-medium">{option.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{option.description || '-'}</TableCell>
                    <TableCell>{option.price.toLocaleString()}원</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {option.applicableCategories.map((cat) => (
                          <Badge key={cat} variant="secondary">
                            {getCategoryDisplayName(cat)}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{option.displayOrder}</TableCell>
                    <TableCell>
                      <Badge variant={option.isActive ? 'default' : 'secondary'}>
                        {option.isActive ? '활성' : '비활성'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(option)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(option.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingOption ? '옵션 수정' : '옵션 추가'}</DialogTitle>
            <DialogDescription>
              서비스 옵션 정보를 입력해주세요. 적용 카테고리에 따라 고객에게 표시됩니다.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">옵션명 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="예: 지병 관리, 털엉킴 경미"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="옵션에 대한 상세 설명을 입력하세요"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">가격 (원) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="10000"
                  min="0"
                  step="1000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayOrder">표시 순서</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>적용 카테고리 *</Label>
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground mb-2 text-sm font-medium">강아지</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(DOG_CATEGORIES).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={`cat-${key}`}
                          checked={formData.applicableCategories.includes(key)}
                          onCheckedChange={() => handleCategoryToggle(key)}
                        />
                        <Label htmlFor={`cat-${key}`} className="cursor-pointer">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground mb-2 text-sm font-medium">고양이</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(CAT_CATEGORIES).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={`cat-${key}`}
                          checked={formData.applicableCategories.includes(key)}
                          onCheckedChange={() => handleCategoryToggle(key)}
                        />
                        <Label htmlFor={`cat-${key}`} className="cursor-pointer">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {formData.applicableCategories.length === 0 && (
                <p className="text-destructive text-sm">최소 1개 이상의 카테고리를 선택해주세요</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked as boolean })
                }
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                활성화
              </Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                취소
              </Button>
              <Button
                type="submit"
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  formData.applicableCategories.length === 0
                }
              >
                {editingOption ? '수정' : '생성'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

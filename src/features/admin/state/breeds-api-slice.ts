/**
 * RTK Query API for Admin Breeds Management
 *
 * Replaces TanStack Query with RTK Query for admin breeds data fetching.
 * Provides type-safe CRUD operations for breed management with automatic
 * cache invalidation and Redux DevTools integration.
 *
 * @module features/admin/state/breeds-api-slice
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  BreedsResponse,
  CreateBreedsInput,
  CreateBreedsResponse,
  BreedWithCount,
} from '../types/breeds.types'

/**
 * Admin Breeds API
 *
 * RTK Query API definition for admin breeds management endpoints.
 * Uses the existing API routes at /api/admin/breeds.
 *
 * Key features:
 * - Type-safe API calls using breeds.types.ts
 * - Automatic caching and invalidation via ['Breeds'] tag
 * - Optimistic updates support through invalidatesTags
 * - Redux DevTools integration for debugging
 *
 * Cache invalidation strategy:
 * - All queries provide ['Breeds'] tag
 * - All mutations invalidate ['Breeds'] tag
 * - This ensures UI stays synchronized after any mutation
 *
 * @example
 * ```tsx
 * import {
 *   useGetBreedsQuery,
 *   useCreateBreedsMutation,
 *   useDeleteBreedMutation,
 *   useUpdateBreedMutation,
 * } from '@/features/admin/state/breeds-api-slice'
 *
 * function AdminBreedsPage() {
 *   const { data: breeds = [], isLoading } = useGetBreedsQuery()
 *   const [createBreeds] = useCreateBreedsMutation()
 *   const [deleteBreed] = useDeleteBreedMutation()
 *   const [updateBreed] = useUpdateBreedMutation()
 *
 *   // Use the hooks in your component...
 * }
 * ```
 */
export const breedsApiSlice = createApi({
  reducerPath: 'breedsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/admin' }),
  tagTypes: ['Breeds'],
  endpoints: (builder) => ({
    /**
     * Get all breeds with pet counts
     *
     * Fetches the complete list of breeds ordered by:
     * petType → category → displayOrder → name
     *
     * Each breed includes a count of associated pets for validation
     * (e.g., preventing deletion of breeds with pets).
     *
     * Type flow:
     * - Request: void (no parameters)
     * - API Response: BreedsResponse (array of BreedWithCount)
     *
     * Caching strategy:
     * - Provides ['Breeds'] tag for automatic invalidation
     * - Cache persists until invalidated by mutations
     *
     * @returns Array of breeds with pet counts
     *
     * @example
     * ```tsx
     * function BreedsList() {
     *   const { data: breeds = [], isLoading, error } = useGetBreedsQuery()
     *
     *   if (isLoading) return <LoadingSpinner />
     *   if (error) return <ErrorMessage error={error} />
     *
     *   return (
     *     <div>
     *       {breeds.map(breed => (
     *         <BreedCard key={breed.id} breed={breed} />
     *       ))}
     *     </div>
     *   )
     * }
     * ```
     *
     * @see GET /api/admin/breeds - Server endpoint
     * @see BreedsResponse - Return type documentation
     */
    getBreeds: builder.query<BreedsResponse, void>({
      query: () => '/breeds',
      providesTags: ['Breeds'],
    }),

    /**
     * Create or update multiple breeds in bulk
     *
     * Accepts comma-separated breed names and performs bulk operation:
     * - Creates new breeds that don't exist
     * - Updates existing breeds (e.g., reorder via displayOrder)
     * - Returns summary of created vs updated counts
     *
     * Type flow:
     * - Request: CreateBreedsInput (petType, category, breedNames)
     * - API Response: CreateBreedsResponse (created, updated, total counts)
     *
     * Cache invalidation:
     * - Invalidates ['Breeds'] tag to trigger refetch of breeds list
     * - UI automatically updates with new/updated breeds
     *
     * @param input - Breed creation input with petType, category, and comma-separated names
     * @returns Creation summary with counts of created/updated breeds
     *
     * @example
     * ```tsx
     * function BreedForm() {
     *   const [createBreeds, { isLoading }] = useCreateBreedsMutation()
     *
     *   const handleSubmit = async () => {
     *     try {
     *       const result = await createBreeds({
     *         petType: 'DOG',
     *         category: 'SMALL',
     *         breedNames: '푸들, 말티즈, 비숑'
     *       }).unwrap()
     *
     *       toast.success(`Created: ${result.created}, Updated: ${result.updated}`)
     *     } catch (error) {
     *       toast.error('Failed to save breeds')
     *     }
     *   }
     *
     *   return <Button onClick={handleSubmit} disabled={isLoading}>Save</Button>
     * }
     * ```
     *
     * @see POST /api/admin/breeds - Server endpoint
     * @see CreateBreedsInput - Input type documentation
     * @see CreateBreedsResponse - Response type documentation
     */
    createBreeds: builder.mutation<CreateBreedsResponse, CreateBreedsInput>({
      query: (input) => ({
        url: '/breeds',
        method: 'POST',
        body: input,
      }),
      invalidatesTags: ['Breeds'],
    }),

    /**
     * Delete a single breed by ID
     *
     * Removes the specified breed from the database.
     * Server will prevent deletion if the breed is currently in use by any pets.
     *
     * Type flow:
     * - Request: string (breed ID)
     * - API Response: { message: string }
     *
     * Cache invalidation:
     * - Invalidates ['Breeds'] tag to remove deleted breed from UI
     * - Automatically updates breeds list after successful deletion
     *
     * @param id - Unique identifier of the breed to delete
     * @returns Success message from server
     *
     * @example
     * ```tsx
     * function BreedDeleteButton({ breed }) {
     *   const [deleteBreed, { isLoading }] = useDeleteBreedMutation()
     *
     *   const handleDelete = async () => {
     *     if (!confirm(`Delete "${breed.name}"?`)) return
     *
     *     try {
     *       await deleteBreed(breed.id).unwrap()
     *       toast.success('Breed deleted')
     *     } catch (error) {
     *       toast.error('Cannot delete breed - it has associated pets')
     *     }
     *   }
     *
     *   return (
     *     <Button
     *       onClick={handleDelete}
     *       disabled={breed._count.pets > 0 || isLoading}
     *     >
     *       Delete
     *     </Button>
     *   )
     * }
     * ```
     *
     * @see DELETE /api/admin/breeds/[breedId] - Server endpoint
     */
    deleteBreed: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/breeds/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Breeds'],
    }),

    /**
     * Update breed active status
     *
     * Toggles or sets the isActive flag for a breed.
     * Used for quick enable/disable of breeds in the admin list.
     *
     * Type flow:
     * - Request: { id: string, isActive: boolean }
     * - API Response: BreedWithCount (updated breed)
     *
     * Cache invalidation:
     * - Invalidates ['Breeds'] tag to reflect status change in UI
     * - UI updates automatically with new status
     *
     * Note: This is a silent operation (no toast notifications)
     * as it's a frequent, low-risk action. UI updates provide
     * sufficient visual feedback.
     *
     * @param params - Object containing breed ID and new isActive status
     * @returns Updated breed with new status and pet count
     *
     * @example
     * ```tsx
     * function BreedToggle({ breed }) {
     *   const [updateBreed, { isLoading }] = useUpdateBreedMutation()
     *
     *   const handleToggle = async () => {
     *     try {
     *       await updateBreed({
     *         id: breed.id,
     *         isActive: !breed.isActive
     *       }).unwrap()
     *     } catch (error) {
     *       toast.error('Failed to update breed')
     *     }
     *   }
     *
     *   return (
     *     <Button onClick={handleToggle} disabled={isLoading}>
     *       {breed.isActive ? 'Active' : 'Inactive'}
     *     </Button>
     *   )
     * }
     * ```
     *
     * @see PATCH /api/admin/breeds/[breedId] - Server endpoint
     * @see BreedWithCount - Return type documentation
     */
    updateBreed: builder.mutation<BreedWithCount, { id: string; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/breeds/${id}`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: ['Breeds'],
    }),
  }),
})

/**
 * Export auto-generated hooks for usage in components
 *
 * These hooks are automatically created by RTK Query based on the endpoints:
 * - useGetBreedsQuery: Fetch all breeds (query)
 * - useCreateBreedsMutation: Create/update breeds in bulk (mutation)
 * - useDeleteBreedMutation: Delete a breed (mutation)
 * - useUpdateBreedMutation: Update breed status (mutation)
 *
 * @example
 * ```tsx
 * // Import the hooks you need
 * import {
 *   useGetBreedsQuery,
 *   useCreateBreedsMutation,
 * } from '@/features/admin/state/breeds-api-slice'
 *
 * // Use in your component
 * const { data: breeds, isLoading } = useGetBreedsQuery()
 * const [createBreeds] = useCreateBreedsMutation()
 * ```
 */
export const {
  useGetBreedsQuery,
  useCreateBreedsMutation,
  useDeleteBreedMutation,
  useUpdateBreedMutation,
} = breedsApiSlice

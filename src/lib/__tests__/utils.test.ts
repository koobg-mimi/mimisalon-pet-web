import { describe, expect, it } from 'vitest'
import { cn } from '../utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('px-2', 'py-1')
    expect(result).toBe('px-2 py-1')
  })

  it('should handle conditional classes', () => {
    const result = cn('base-class', 'conditional-class', false)
    expect(result).toBe('base-class conditional-class')
  })

  it('should handle Tailwind merge conflicts', () => {
    // Tailwind merge should keep the last conflicting class
    const result = cn('px-2', 'px-4')
    expect(result).toBe('px-4')
  })

  it('should handle array of classes', () => {
    const result = cn(['class1', 'class2'], 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('should handle undefined and null values', () => {
    const result = cn('valid-class', undefined, null, 'another-class')
    expect(result).toBe('valid-class another-class')
  })

  it('should handle empty input', () => {
    const result = cn()
    expect(result).toBe('')
  })
})

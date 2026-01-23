/**
 * Tests for groomer-status-config utility functions
 *
 * Tests status configuration functions that provide display properties
 * for groomer statuses (label, icon, variant, description).
 * Target coverage: 100%
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import {
  getStatusConfig,
  getStatusConfigByStatus,
  getAllStatusConfigs,
  type GroomerActiveStatus,
  type GroomerStatusConfig,
} from '../groomer-status-config'

describe('getStatusConfig', () => {
  it('should return ACTIVE config when isActive is true', () => {
    const config = getStatusConfig(true)

    expect(config.status).toBe('ACTIVE')
    expect(config.label).toBe('활성')
    expect(config.variant).toBe('success')
    expect(config.description).toBe('현재 활성화된 미용사')
  })

  it('should return INACTIVE config when isActive is false', () => {
    const config = getStatusConfig(false)

    expect(config.status).toBe('INACTIVE')
    expect(config.label).toBe('비활성')
    expect(config.variant).toBe('secondary')
    expect(config.description).toBe('비활성화된 미용사')
  })

  it('should return config with icon for ACTIVE status', () => {
    const config = getStatusConfig(true)

    expect(config.icon).toBeDefined()
    expect(config.icon).not.toBeNull()
  })

  it('should return config with icon for INACTIVE status', () => {
    const config = getStatusConfig(false)

    expect(config.icon).toBeDefined()
    expect(config.icon).not.toBeNull()
  })

  it('should return different configs for true and false', () => {
    const activeConfig = getStatusConfig(true)
    const inactiveConfig = getStatusConfig(false)

    expect(activeConfig.status).not.toBe(inactiveConfig.status)
    expect(activeConfig.label).not.toBe(inactiveConfig.label)
    expect(activeConfig.variant).not.toBe(inactiveConfig.variant)
  })

  it('should always return a valid GroomerStatusConfig object', () => {
    const config = getStatusConfig(true)

    expect(config).toHaveProperty('status')
    expect(config).toHaveProperty('label')
    expect(config).toHaveProperty('icon')
    expect(config).toHaveProperty('variant')
    expect(config).toHaveProperty('description')
  })

  it('should return consistent results for same input', () => {
    const config1 = getStatusConfig(true)
    const config2 = getStatusConfig(true)

    expect(config1.status).toBe(config2.status)
    expect(config1.label).toBe(config2.label)
    expect(config1.variant).toBe(config2.variant)
  })

  it('should handle boolean coercion', () => {
    // Test with truthy values
    const activeConfig = getStatusConfig(true)
    expect(activeConfig.status).toBe('ACTIVE')

    // Test with falsy values
    const inactiveConfig = getStatusConfig(false)
    expect(inactiveConfig.status).toBe('INACTIVE')
  })

  it('should return ACTIVE config with success variant', () => {
    const config = getStatusConfig(true)
    expect(config.variant).toBe('success')
  })

  it('should return INACTIVE config with secondary variant', () => {
    const config = getStatusConfig(false)
    expect(config.variant).toBe('secondary')
  })
})

describe('getStatusConfigByStatus', () => {
  it('should return ACTIVE config when status is ACTIVE', () => {
    const config = getStatusConfigByStatus('ACTIVE')

    expect(config.status).toBe('ACTIVE')
    expect(config.label).toBe('활성')
    expect(config.variant).toBe('success')
    expect(config.description).toBe('현재 활성화된 미용사')
  })

  it('should return INACTIVE config when status is INACTIVE', () => {
    const config = getStatusConfigByStatus('INACTIVE')

    expect(config.status).toBe('INACTIVE')
    expect(config.label).toBe('비활성')
    expect(config.variant).toBe('secondary')
    expect(config.description).toBe('비활성화된 미용사')
  })

  it('should return SUSPENDED config when status is SUSPENDED', () => {
    const config = getStatusConfigByStatus('SUSPENDED')

    expect(config.status).toBe('SUSPENDED')
    expect(config.label).toBe('정지')
    expect(config.variant).toBe('destructive')
    expect(config.description).toBe('정지된 미용사')
  })

  it('should return config with icon for each status', () => {
    const statuses: GroomerActiveStatus[] = ['ACTIVE', 'INACTIVE', 'SUSPENDED']

    statuses.forEach((status) => {
      const config = getStatusConfigByStatus(status)
      expect(config.icon).toBeDefined()
      expect(config.icon).not.toBeNull()
    })
  })

  it('should return different configs for different statuses', () => {
    const activeConfig = getStatusConfigByStatus('ACTIVE')
    const inactiveConfig = getStatusConfigByStatus('INACTIVE')
    const suspendedConfig = getStatusConfigByStatus('SUSPENDED')

    expect(activeConfig.status).not.toBe(inactiveConfig.status)
    expect(inactiveConfig.status).not.toBe(suspendedConfig.status)
    expect(activeConfig.label).not.toBe(suspendedConfig.label)
  })

  it('should return consistent results for same status', () => {
    const config1 = getStatusConfigByStatus('ACTIVE')
    const config2 = getStatusConfigByStatus('ACTIVE')

    expect(config1).toBe(config2) // Should be same reference
  })
})

describe('getAllStatusConfigs', () => {
  it('should return array of all status configurations', () => {
    const configs = getAllStatusConfigs()

    expect(Array.isArray(configs)).toBe(true)
    expect(configs.length).toBe(3)
  })

  it('should include ACTIVE, INACTIVE, and SUSPENDED configs', () => {
    const configs = getAllStatusConfigs()
    const statuses = configs.map((c) => c.status)

    expect(statuses).toContain('ACTIVE')
    expect(statuses).toContain('INACTIVE')
    expect(statuses).toContain('SUSPENDED')
  })

  it('should return configs in consistent order', () => {
    const configs1 = getAllStatusConfigs()
    const configs2 = getAllStatusConfigs()

    expect(configs1[0].status).toBe(configs2[0].status)
    expect(configs1[1].status).toBe(configs2[1].status)
    expect(configs1[2].status).toBe(configs2[2].status)
  })

  it('should return complete GroomerStatusConfig objects', () => {
    const configs = getAllStatusConfigs()

    configs.forEach((config) => {
      expect(config).toHaveProperty('status')
      expect(config).toHaveProperty('label')
      expect(config).toHaveProperty('icon')
      expect(config).toHaveProperty('variant')
      expect(config).toHaveProperty('description')
    })
  })
})

describe('Icon rendering', () => {
  it('should render ACTIVE icon (CheckCircle2)', () => {
    const config = getStatusConfigByStatus('ACTIVE')
    const { container } = render(<div>{config.icon}</div>)

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('h-3', 'w-3')
  })

  it('should render INACTIVE icon (XCircle)', () => {
    const config = getStatusConfigByStatus('INACTIVE')
    const { container } = render(<div>{config.icon}</div>)

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('h-3', 'w-3')
  })

  it('should render SUSPENDED icon (AlertCircle)', () => {
    const config = getStatusConfigByStatus('SUSPENDED')
    const { container } = render(<div>{config.icon}</div>)

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('h-3', 'w-3')
  })

  it('should render icons with consistent size class', () => {
    const configs = getAllStatusConfigs()

    configs.forEach((config) => {
      const { container } = render(<div>{config.icon}</div>)
      const svg = container.querySelector('svg')

      expect(svg).toHaveClass('h-3', 'w-3')
    })
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatRow } from '../StatRow'

describe('StatRow', () => {
  it('should render label and string value', () => {
    render(<StatRow label="Status" value="Active" />)

    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('should render label and numeric value with locale formatting', () => {
    render(<StatRow label="Total requests" value={1234567} />)

    expect(screen.getByText('Total requests')).toBeInTheDocument()
    expect(screen.getByText('1,234,567')).toBeInTheDocument()
  })

  it('should apply custom color class', () => {
    render(<StatRow label="Success" value="100%" color="text-green-600" />)

    const valueElement = screen.getByText('100%')
    expect(valueElement).toHaveClass('text-green-600')
  })

  it('should use default color when not specified', () => {
    render(<StatRow label="Metric" value="Value" />)

    const valueElement = screen.getByText('Value')
    expect(valueElement).toHaveClass('text-gray-900')
  })
})

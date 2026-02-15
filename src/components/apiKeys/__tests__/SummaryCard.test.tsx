import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SummaryCard } from '../SummaryCard'

describe('SummaryCard', () => {
  it('should render label and value', () => {
    render(<SummaryCard label="Total requests" value="1,234" />)

    expect(screen.getByText('Total requests')).toBeInTheDocument()
    expect(screen.getByText('1,234')).toBeInTheDocument()
  })

  it('should handle numeric values', () => {
    render(<SummaryCard label="Success rate" value="99.5%" />)

    expect(screen.getByText('Success rate')).toBeInTheDocument()
    expect(screen.getByText('99.5%')).toBeInTheDocument()
  })

  it('should handle zero values', () => {
    render(<SummaryCard label="Failed" value="0" />)

    expect(screen.getByText('Failed')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})

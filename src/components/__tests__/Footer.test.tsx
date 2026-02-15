import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Footer from '../Footer'

describe('Footer', () => {
  const renderFooter = () => {
    return render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>,
    )
  }

  it('should render all developer links', () => {
    renderFooter()

    const apiLinks = screen.getAllByText('API')
    expect(apiLinks.length).toBeGreaterThan(0)
    expect(apiLinks[0]).toBeInTheDocument()
    const docsLinks = screen.getAllByText('Docs')
    expect(docsLinks.length).toBeGreaterThan(0)
    expect(docsLinks[0]).toBeInTheDocument()
    const statusLinks = screen.getAllByText('Status')
    expect(statusLinks.length).toBeGreaterThan(0)
    expect(statusLinks[0]).toBeInTheDocument()
  })

  it('should render all legal links', () => {
    renderFooter()

    const privacyLinks = screen.getAllByText('Privacy Policy')
    expect(privacyLinks.length).toBeGreaterThan(0)
    expect(privacyLinks[0]).toBeInTheDocument()
    const termsLinks = screen.getAllByText('Terms of Service')
    expect(termsLinks.length).toBeGreaterThan(0)
    expect(termsLinks[0]).toBeInTheDocument()
    const contactLinks = screen.getAllByText('Contact')
    expect(contactLinks.length).toBeGreaterThan(0)
    expect(contactLinks[0]).toBeInTheDocument()
  })

  it('should render copyright text', () => {
    renderFooter()

    const copyrightTexts = screen.getAllByText(/All rights reserved/)
    expect(copyrightTexts.length).toBeGreaterThan(0)
    expect(copyrightTexts[0]).toBeInTheDocument()
  })

  it('should have correct link hrefs', () => {
    renderFooter()

    const apiLinks = screen.getAllByText('API')
    const apiLink = apiLinks[0].closest('a')
    const docsLinks = screen.getAllByText('Docs')
    const docsLink = docsLinks[0].closest('a')
    const statusLinks = screen.getAllByText('Status')
    const statusLink = statusLinks[0].closest('a')

    expect(apiLink).toHaveAttribute('href', '/api-keys')
    expect(docsLink).toHaveAttribute('href', '/docs')
    expect(statusLink).toHaveAttribute('href', '/status')
  })
})

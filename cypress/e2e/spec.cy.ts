describe('Navigation', () => {
  it('should navigate to the Home page and contain key elements and sections', () => {
    // Start from the index page
    cy.visit('/')

    cy.get('header img[id*="header-logo-home-link"]').should('be.visible')
 
    cy.get('a[id*="home-hero-cta-button"]').contains('Let\'s Talk')

    cy.get('a[id*="home-hero-learn-more-link"]').contains('Learn More')

    cy.get('img[id*="home-hero-image"]').should('be.visible')

    cy.get('div[id*="home-problem-feature-high-overhead-costs-section"] h3').contains('High')
    cy.get('div[id*="home-problem-feature-unmanageable-staffing-stress-section"] h3').contains('Unmanageable')
    cy.get('div[id*="home-problem-feature-killer-insurance-delays-section"] h3').contains('Killer')
    cy.get('div[id*="home-problem-feature-tiring-manual-workflows-section"] h3').contains('Tiring')

    cy.get('a[id*="home-learn-more-link"]').contains('How We Can Help')

    cy.get('footer img[id*="footer-logo-home-link"]').should('be.visible')
    cy.get('a[id*="footer-how-it-works-link"]').should('be.visible')
    cy.get('a[id*="footer-services-link"]').should('be.visible')
    cy.get('a[id*="footer-testimonials-link"]').should('be.visible')
    cy.get('a[id*="footer-about-us-link"]').should('be.visible')
    cy.get('a[id*="footer-contact-us-link"]').should('be.visible')
    cy.get('a[id*="footer-cta-link"]').should('be.visible')
  })


  it('should navigate to the Contact Us page via Let\'s Talk CTA button', () => {
    // Start from the index page
    cy.visit('/')

    // Find a link with an id attribute containing "home-hero-cta-button" and click it
    cy.get('a[id*="home-hero-cta-button"]').should('be.visible')
    cy.get('a[id*="home-hero-cta-button"]').click()
 
    // The new url should include "/contact-us"
    cy.url().should('include', '/contact-us')
  })


  it('should navigate to the Learn More page via Learn More link', () => {
    // Start from the index page
    cy.visit('/')

    // Find a link with an id attribute containing "home-hero-learn-more-link" and click it
    cy.get('a[id*="home-hero-learn-more-link"]').should('be.visible')
    cy.get('a[id*="home-hero-learn-more-link"]').click()
 
    // The new url should include "/contact-us"
    cy.url().should('include', '/learn-more')
  })


  it('should navigate to the Learn More page via How We Can Help link', () => {
    // Start from the index page
    cy.visit('/')

    // Find a link with an id attribute containing "home-learn-more-link" and click it
    cy.get('a[id*="home-learn-more-link"]').should('be.visible')
    cy.get('a[id*="home-learn-more-link"]').click()
 
    // The new url should include "/contact-us"
    cy.url().should('include', '/learn-more')
  })
})
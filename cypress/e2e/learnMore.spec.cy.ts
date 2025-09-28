describe('Learn More Page', () => {

  it('should navigate to the Learn More page and contain key elements and sections', () => {
    // Start from the Learn More page
    cy.visit('/learn-more')
 
    // hero image should be visible
    cy.get('img[id*="learn-more-hero-image"]').should('be.visible')

    // Learn More page links should be visible
    cy.get('a[id*="learn-more-hero-cta-button"]').should('be.visible')
    cy.get('a[id*="learn-more-next-steps-link"]').should('be.visible')
    cy.get('a[id*="learn-more-key-benefits-next-steps-link"]').should('be.visible')

    // Learn More page key sections should be visible
    cy.get('div[id*="learn-more-hero-section"]').should('be.visible')

    cy.get('div[id*="learn-more-who-we-help-section"]').should('be.visible')
    cy.get('img[id*="callout-dso-image"]').should('be.visible')
    cy.get('img[id*="callout-solo-image"]').should('be.visible')
    cy.get('img[id*="callout-office-image"]').should('be.visible')

    cy.get('div[id*="outcomes"]').should('be.visible')
    //cy.get('div[id*="learn-more-partners-section"]').should('be.visible')
    cy.get('div[id*="learn-more-key-benefits-section"]').should('be.visible')
  })


  it('should navigate to the Contact Us page via Let\'s Talk CTA button', () => {
    // Start from the Learn More page
    cy.visit('/learn-more')

    // Find a link with an id attribute containing "learn-more-hero-cta-button" and click it
    cy.get('a[id*="learn-more-hero-cta-button"]').should('be.visible')
    cy.get('a[id*="learn-more-hero-cta-button"]').click()
 
    // The new url should include "/contact-us"
    cy.url().should('include', '/contact-us')
  })


  it('should navigate to the Next Steps page via Next Steps link', () => {
    // Start from the Learn More page
    cy.visit('/learn-more')

    // Find a link with an id attribute containing "learn-more-next-steps-link" and click it
    cy.get('a[id*="learn-more-next-steps-link"]').should('be.visible')
    cy.get('a[id*="learn-more-next-steps-link"]').click()
 
    // The new url should include "/next-steps"
    cy.url().should('include', '/next-steps')
  })


  it('should navigate to the Next Steps page via Next Steps link under Key Benefits section', () => {
    // Start from the Learn More page
    cy.visit('/learn-more')

    // Find a link with an id attribute containing "learn-more-key-benefits-next-steps-link" and click it
    cy.get('a[id*="learn-more-key-benefits-next-steps-link"]').should('be.visible')
    cy.get('a[id*="learn-more-key-benefits-next-steps-link"]').click()
 
    // The new url should include "/next-steps"
    cy.url().should('include', '/next-steps')
  })
})
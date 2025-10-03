describe('How It Works Page', () => {

  it('should navigate to the How It Works page and contain key elements and sections', () => {
    // Start from the How It Works page
    cy.visit('/how-it-works')
 
    cy.get('div[id*="why-smylsync-hero-section"]').should('be.visible')
    cy.get('div[id*="why-smylsync-hero-video"]').should('be.visible')
    cy.get('a[id*="why-smylsync-hero-cta-button"]').should('be.visible')
   
    cy.get('div[id*="our-tech-hero-section"]').should('be.visible')
    cy.get('img[id*="our-tech-hero-image"]').should('be.visible')
    cy.get('a[id*="our-tech-hero-cta-button"]').should('be.visible')
    cy.get('a[id*="our-tech-learn-more-link"]').should('be.visible')
  })

  it('should navigate to the Contact Us page via Let\'s Talk CTA button on Why Filipino VAs section', () => {
    // Start from the How It Works page
    cy.visit('/how-it-works')

    // Find a link with an id attribute containing "why-smylsync-hero-cta-button" and click it
    cy.get('a[id*="why-smylsync-hero-cta-button"]').should('be.visible')
    cy.get('a[id*="why-smylsync-hero-cta-button"]').click()
 
    // The new url should include "/contact-us"
    cy.url().should('include', '/contact-us')
  })

  it('should navigate to the Contact Us page via Let\'s Talk CTA button on our Tech Advantage section', () => {
    // Start from the How It Works page
    cy.visit('/how-it-works')

    // Find a link with an id attribute containing "our-tech-hero-cta-button" and click it
    cy.get('a[id*="our-tech-hero-cta-button"]').should('be.visible')
    cy.get('a[id*="our-tech-hero-cta-button"]').click()
 
    // The new url should include "/contact-us"
    cy.url().should('include', '/contact-us')
  })

  it('should navigate to the Our Technologies page via Learn More link on our Tech Advantage section', () => {
    // Start from the How It Works page
    cy.visit('/how-it-works')

    // Find a link with an id attribute containing "our-tech-learn-more-link" and click it
    cy.get('a[id*="our-tech-learn-more-link"]').should('be.visible')
    cy.get('a[id*="our-tech-learn-more-link"]').click()
 
    // The new url should include "/tech"
    cy.url().should('include', '/tech')
  })

})
describe('About Us Page', () => {

  it('should navigate to the About Us page and contain key elements and sections', () => {
    // Start from the About Us page
    cy.visit('/about-us')
 
    cy.get('div[id*="who-we-are-section"]').should('be.visible')
    cy.get('div[id*="meet-the-team-section"]').should('be.visible')
    cy.get('div[id*="about-us-cta-section"]').should('be.visible')
  })

  it('should navigate to the About Us page and contain 4 team members', () => {
    // Start from the About Us page
    cy.visit('/about-us')

    // there should be 4 team members
    cy.get('div[data-testid*="featured-person"]').should('have.length', 4)

    // check that each team member is visible
    cy.get('div[id*="ceo-and-co-founder-ian-charl-nico-tubban"]').should('be.visible')
    cy.get('div[id*="coo-and-co-founder-chriseth-cruz"]').should('be.visible')
    cy.get('div[id*="cmo-and-co-founder-paolo-argamaso"]').should('be.visible')
    cy.get('div[id*="cto-and-co-founder-mark-de-leon"]').should('be.visible')
  })


  it('should navigate to the Contact Us page via Let\'s Talk CTA button', () => {
    // Start from the About Us page
    cy.visit('/about-us')

    cy.get('button[id*="privacy-banner-close-button"]').should('be.visible')
    cy.get('button[id*="privacy-banner-close-button"]').click()

    // Find a link with an id attribute containing "about-us-cta-button" and click it
    cy.get('a[id*="about-us-cta-button"]').should('be.visible')
    cy.get('a[id*="about-us-cta-button"]').click()
 
    // The new url should include "/contact-us"
    cy.url().should('include', '/contact-us')
  })

})
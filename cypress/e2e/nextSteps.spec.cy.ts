describe('Next Steps Page', () => {

  it('should navigate to the Next Steps page and contain key elements and sections', () => {
    // Start from the Next Steps page
    cy.visit('/next-steps')
 
    cy.get('div[id*="next-steps-hero-section"]').should('be.visible')

    // hero image should be visible
    cy.get('img[id*="next-steps-hero-image"]').should('be.visible')

    // Next Steps page CTA button should be visible
    cy.get('a[id*="next-steps-cta-button"]').should('be.visible')
  })


  it('should navigate to the Contact Us page via Let\'s Talk CTA button', () => {
    // Start from the Next Steps page
    cy.visit('/next-steps')

    // Find a link with an id attribute containing "next-steps-cta-button" and click it
    cy.get('a[id*="next-steps-cta-button"]').should('be.visible')
    cy.get('a[id*="next-steps-cta-button"]').click()
 
    // The new url should include "/contact-us"
    cy.url().should('include', '/contact-us')
  })

})
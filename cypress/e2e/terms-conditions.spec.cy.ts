describe('Terms and Conditions Page', () => {

  it('should navigate to the Terms and Conditions page and contain key sections', () => {

    cy.visit('/terms-and-conditions')

    cy.get('div[id*="terms-and-conditions-section"]').should('be.visible')
    cy.get('div[id*="terms-trust-reinforcement-section"]').should('be.visible')
  })

})
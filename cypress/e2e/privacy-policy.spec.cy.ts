describe('Privacy Policy Page', () => {

  it('should navigate to the Privacy Policy page and contain key sections', () => {

    cy.visit('/privacy-policy')

    cy.get('div[id*="privacy-policy-section"]').should('be.visible')
  })

})
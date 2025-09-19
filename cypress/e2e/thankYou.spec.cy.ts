describe('Thank You Page', () => {

  it('should navigate to the Thank You page and contain key sections', () => {

    cy.visit('/thank-you')

    cy.get('div[id*="thank-you-message-section"]').should('be.visible')
    cy.get('a[id*="thank-you-cta-button"]').should('be.visible')
  })

})
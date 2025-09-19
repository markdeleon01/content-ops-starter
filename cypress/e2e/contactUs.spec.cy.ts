describe('Contact Us Page', () => {

  it('should navigate to the Contact Us page and contain key sections', () => {

    cy.visit('/contact-us')

    cy.get('div[id*="contact-us-form-section"]').should('be.visible')
    cy.get('form[id*="contact-us-form"]').should('be.visible')
    cy.get('input[id*="name"]').should('be.visible')
    cy.get('input[id*="email"]').should('be.visible')
    cy.get('textarea[id*="message"]').should('be.visible')
    cy.get('button[id*="contact-us-form-submit"]').should('be.visible')

    cy.get('div[id*="contact-us-cta-section"]').should('be.visible')
    cy.get('a[id*="contact-us-cta-button"]').should('be.visible')
    cy.get('div[id*="contact-us-survey-section"]').should('be.visible')
    cy.get('a[id*="contact-us-survey-button"]').should('be.visible')
  })

})
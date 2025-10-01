describe('Solutions/Services Page', () => {

  it('should navigate to the Solutions/Services page and contain key elements and sections', () => {
    // Start from the Solutions/Services page
    cy.visit('/services')
 
    cy.get('div[id*="solutions-services-section"]').should('be.visible')
    cy.get('img[id*="claims-processing-image"]').should('be.visible')
    cy.get('img[id*="accounts-receivable-rescue-image"]').should('be.visible')
    cy.get('img[id*="credentialing-management-image"]').should('be.visible')
    cy.get('img[id*="scheduling-and-patient-coordination-image"]').should('be.visible')
    cy.get('img[id*="billing-and-insurance-verification-image"]').should('be.visible')
    cy.get('img[id*="other-admin-services-image"]').should('be.visible')
    cy.get('a[id*="solutions-services-cta-button"]').should('be.visible')
  })

  it('should navigate to the Solutions/Services page and contain 6 service feature items', () => {
    // Start from the index page
    cy.visit('/services')

    // there should be 6 service feature items
    cy.get('div[data-testid*="service-item"]').should('have.length', 6)
  })

  it('should navigate to the Contact Us page via Let\'s Talk CTA button on Solutions/Services section', () => {
    // Start from the Solutions/Services page
    cy.visit('/services')

    // Find a link with an id attribute containing "solutions-services-cta-button" and click it
    cy.get('a[id*="solutions-services-cta-button"]').should('be.visible')
    cy.get('a[id*="solutions-services-cta-button"]').click()
 
    // The new url should include "/contact-us"
    cy.url().should('include', '/contact-us')
  })

})
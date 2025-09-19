describe('Footer section', () => {

  it('should navigate to the Home page and contain footer section', () => {
    // Start from the index page
    cy.visit('/')

    // footer section and navigation links should be visible
    cy.get('footer img[id*="footer-logo-home-link"]').should('be.visible')

    cy.get('a[id*="footer-how-it-works-link"]').should('be.visible')
    cy.get('a[id*="footer-services-link"]').should('be.visible')
    cy.get('a[id*="footer-testimonials-link"]').should('be.visible')
    
    cy.get('a[id*="footer-about-us-link"]').should('be.visible')
    cy.get('a[id*="footer-contact-us-link"]').should('be.visible')
    cy.get('a[id*="footer-cta-link"]').should('be.visible')

    cy.get('a[id*="footer-facebook-link"]').should('be.visible')
    cy.get('a[id*="footer-linkedin-link"]').should('be.visible')
    cy.get('a[id*="footer-email-link"]').should('be.visible')

    cy.get('a[id*="footer-terms-link"]').should('be.visible')
    cy.get('a[id*="footer-privacy-link"]').should('be.visible')
  })

  it('should navigate to the How It Works page', () => {
    // Start from the index page
    cy.visit('/')
    cy.get('a[id*="footer-how-it-works-link"]').should('be.visible')
    cy.get('a[id*="footer-how-it-works-link"]').click()
 
    // The new url should include "/how-it-works"
    cy.url().should('include', '/how-it-works')
  })

  it('should navigate to the Solutions/Services page', () => {
    // Start from the index page
    cy.visit('/')
    cy.get('a[id*="footer-services-link"]').should('be.visible')
    cy.get('a[id*="footer-services-link"]').click()
 
    // The new url should include "/services"
    cy.url().should('include', '/services')
  })

  it('should navigate to the Client Outcomes section in the Learn More page', () => {
    // Start from the index page
    cy.visit('/')
    cy.get('a[id*="footer-testimonials-link"]').should('be.visible')
    cy.get('a[id*="footer-testimonials-link"]').click()
 
    // The new url should include "/learn-more/#outcomes"
    cy.url().should('include', '/learn-more/#outcomes')
  })

  it('should navigate to the About Us page', () => {
    // Start from the index page
    cy.visit('/')
    cy.get('a[id*="footer-about-us-link"]').should('be.visible')
    cy.get('a[id*="footer-about-us-link"]').click()
 
    // The new url should include "/about-us"
    cy.url().should('include', '/about-us')
  })

  it('should navigate to the Contact Us page', () => {
    // Start from the index page
    cy.visit('/')
    cy.get('a[id*="footer-contact-us-link"]').should('be.visible')
    cy.get('a[id*="footer-contact-us-link"]').click()
 
    // The new url should include "/contact-us"
    cy.url().should('include', '/contact-us')
  })

  it('should navigate to the Terms and Conditions page', () => {
    // Start from the index page
    cy.visit('/')
    cy.get('a[id*="footer-terms-link"]').should('be.visible')
    cy.get('a[id*="footer-terms-link"]').click()
 
    // The new url should include "/terms-and-conditions"
    cy.url().should('include', '/terms-and-conditions')
  })

  it('should navigate to the Privacy Policy page', () => {
    // Start from the index page
    cy.visit('/')
    cy.get('a[id*="footer-privacy-link"]').should('be.visible')
    cy.get('a[id*="footer-privacy-link"]').click()
 
    // The new url should include "/privacy-policy"
    cy.url().should('include', '/privacy-policy')
  })

})
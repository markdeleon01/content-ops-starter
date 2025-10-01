describe('Home Page', () => {

  it('should navigate to the Home page and contain header and footer sections', () => {
    // Start from the index page
    cy.visit('/')

    // header section and navigation links should be visible
    cy.get('header img[id*="header-logo-home-link"]').should('be.visible')

    // there are two navigation links: collapsed menu and full menu
    cy.get('header a[id*="header-home-link"]').should('have.length', 2)
    cy.get('header a[id*="header-how-it-works-link"]').should('have.length', 2)
    cy.get('header a[id*="header-services-link"]').should('have.length', 2)
    cy.get('header a[id*="header-outcomes-link"]').should('have.length', 2)
    cy.get('header a[id*="header-about-us-link"]').should('have.length', 2)
  })

  it('should navigate to the Home page and contain key elements and sections', () => {
    // Start from the index page
    cy.visit('/')
 
    // hero section CTA button should be visible
    cy.get('a[id*="home-hero-cta-button"]').should('be.visible')

    // hero section Learn More link should be visible
    cy.get('a[id*="home-hero-learn-more-link"]').should('be.visible')

    // hero image should be visible
    cy.get('img[id*="home-hero-image"]').should('be.visible')

    // problem feature sections should be visible
    // check for the presence of headings in each problem feature section
    cy.get('div[id*="home-problem-feature-high-overhead-costs-section"] h3').should('be.visible')
    cy.get('div[id*="home-problem-feature-unmanageable-staffing-stress-section"] h3').should('be.visible')
    cy.get('div[id*="home-problem-feature-killer-insurance-delays-section"] h3').should('be.visible')
    cy.get('div[id*="home-problem-feature-tiring-manual-workflows-section"] h3').should('be.visible')

    // Learn More link should be visible
    cy.get('a[id*="home-learn-more-link"]').should('be.visible')
  })

  it('should navigate to the Home page and contain 4 problem highlight items', () => {
    // Start from the index page
    cy.visit('/')

    // there should be 4 problem highlight items
    cy.get('div[class*="bg-neutralAlt-fg-light"]').should('have.length.at.most', 4)
  })

  it('should navigate to the Contact Us page via Let\'s Talk CTA button', () => {
    // Start from the index page
    cy.visit('/')

    // Find a link with an id attribute containing "home-hero-cta-button" and click it
    cy.get('a[id*="home-hero-cta-button"]').should('be.visible')
    cy.get('a[id*="home-hero-cta-button"]').click()
 
    // The new url should include "/contact-us"
    cy.url().should('include', '/contact-us')
  })


  it('should navigate to the Learn More page via Learn More link', () => {
    // Start from the index page
    cy.visit('/')

    // Find a link with an id attribute containing "home-hero-learn-more-link" and click it
    cy.get('a[id*="home-hero-learn-more-link"]').should('be.visible')
    cy.get('a[id*="home-hero-learn-more-link"]').click()
 
    // The new url should include "/learn-more"
    cy.url().should('include', '/learn-more')
  })


  it('should navigate to the Learn More page via How We Can Help link', () => {
    // Start from the index page
    cy.visit('/')

    // Find a link with an id attribute containing "home-learn-more-link" and click it
    cy.get('a[id*="home-learn-more-link"]').should('be.visible')
    cy.get('a[id*="home-learn-more-link"]').click()
 
    // The new url should include "/learn-more"
    cy.url().should('include', '/learn-more')
  })

})
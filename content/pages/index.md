---
title: Home
slug: /
sections:
  - type: GenericSection
    title:
      text: 'Free Your Dental Practice from Admin Chaos, Get Back to Creating Smiles'
      styles:
        self:
          padding:
            - pt-0
            - pl-0
            - pb-5
            - pr-0
      color: text-dark
      type: TitleBlock
    subtitle: >-
      SmylSync is your virtual assistant partner, revolutionizing U.S. dental
      practices by eliminating administrative chaos.
    text: null
    actions:
      - label: Let's Talk
        altText: Let's Talk
        url: /contact-us
        showIcon: false
        icon: arrowRight
        iconPosition: right
        style: primary
        elementId: home-hero-cta-button
        type: Button
      - label: Learn More
        altText: Learn More
        url: /learn-more
        showIcon: true
        icon: arrowRight
        iconPosition: right
        style: primary
        elementId: home-hero-learn-more-link
        type: Link
    media:
      url: /images/Hero-page.png
      altText: 'Free Your Practice of Admin Chaos, Get Back to Creating Smiles'
      elementId: 'home-hero-image'
      styles: {
        self: {
          borderRadius: x-large,
          margin: [
            mb-8
          ]
        }
      }
      type: ImageBlock
    elementId: 'home-hero-section'
    colors: bg-light-fg-dark
    styles:
      self:
        flexDirection: row
        padding:
          - pt-16
          - pl-16
          - pb-16
          - pr-16
  - type: FeaturedItemsSection
    title:
      text: 65% of Your Revenue Could Be Going to Waste
      color: text-dark
      styles:
        self:
          textAlign: center
      type: TitleBlock
    subtitle: >-
      You became a dentist to care for patients—not chase claims and reschedule
      appointments.
    items:
      - type: FeaturedItem
        title: High
        subtitle: Overhead Costs
        text: Over $40k annual salary costs for local assistants.
        actions: []
        elementId: home-problem-feature-high-overhead-costs-section
        colors: bg-neutralAlt-fg-light
        styles:
          self:
            padding:
              - pt-8
              - pl-8
              - pb-8
              - pr-8
            borderRadius: x-large
            flexDirection: row
            justifyContent: center
            textAlign: left
        image:
          type: ImageBlock
          altText: High overhead costs
          elementId: 'home-problem-feature-high-overhead-costs-image'
          url: /images/High.png
      - title: Unmanageable
        subtitle: Staffing Stress
        text: 6 in 10 dentists say hiring is their biggest headache.
        image:
          url: /images/Unmanageable.png
          altText: Unmanageable staffing stress
          elementId: 'home-problem-feature-unmanageable-staffing-stress-image'
          type: ImageBlock
        actions: []
        elementId: home-problem-feature-unmanageable-staffing-stress-section
        colors: bg-neutralAlt-fg-light
        styles:
          self:
            padding:
              - pt-8
              - pl-8
              - pb-8
              - pr-8
            borderRadius: x-large
            flexDirection: row
            textAlign: left
            justifyContent: center
        type: FeaturedItem
      - title: Killer
        subtitle: Insurance Delays
        text: >-
          Slow claims processing that lead to months, red tape, and denied
          reimbursements are killing cash flow.
        image:
          url: /images/Killer.png
          altText: Killer insurance delays
          elementId: 'home-problem-feature-killer-insurance-delays-image'
          type: ImageBlock
        actions: []
        elementId: 'home-problem-feature-killer-insurance-delays-section'
        colors: bg-neutralAlt-fg-light
        styles:
          self:
            padding:
              - pt-8
              - pl-8
              - pb-8
              - pr-8
            borderRadius: x-large
            flexDirection: row
            textAlign: left
            justifyContent: center
        type: FeaturedItem
      - type: FeaturedItem
        title: Tiring
        subtitle: Manual Workflows
        text: >-
          More than 20 hours lost per week due to outdated systems and task
          overload are draining your team.
        actions: []
        elementId: 'home-problem-feature-tiring-manual-workflows-section'
        colors: bg-neutralAlt-fg-light
        styles:
          self:
            padding:
              - pt-8
              - pl-8
              - pb-8
              - pr-8
            borderRadius: x-large
            flexDirection: row
            justifyContent: center
            textAlign: left
        image:
          type: ImageBlock
          altText: Tiring manual workflows
          elementId: 'home-problem-feature-tiring-manual-workflows-image'
          url: /images/Tiring.png
    elementId: 'home-problem-feature-tiring-manual-workflows-section'
    variant: two-col-grid
    colors: bg-neutral-fg-dark
    actions:
      - label: How We Can Help
        altText: How We Can Help
        url: /learn-more
        showIcon: true
        icon: arrowRight
        iconPosition: right
        style: primary
        elementId: home-learn-more-link
        type: Link
    styles:
      self:
        padding:
          - pb-16
          - pt-16
          - pl-16
          - pr-16
        justifyContent: center
      subtitle:
        textAlign: center
seo:
  metaTitle: Home - SMYLSYNC
  metaDescription: Built for Dentists. Powered by Experts.
  socialImage: /images/Hero-page.png
  type: Seo
type: PageLayout
---

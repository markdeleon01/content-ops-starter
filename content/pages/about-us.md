---
title: About Us
slug: /about-us
sections:
  - title:
      text: Who We Are
      color: text-dark
      styles:
        self:
          textAlign: center
      type: TitleBlock
    subtitle: Built for Dentists.  Powered by Experts.
    text: |-
      **Mission**: Founded in 2024, SmylSync empowers U.S. dental practices with expert, HIPAA-compliant virtual assistant services, driven by the heartfelt dedication of Filipino VAs. We eliminate administrative chaos—scheduling, claims, credentialing, and patient follow-ups—so dentists can focus on patient care, cut costs, and grow with confidence.

      **Vision**:  To transform U.S. dental practices into thriving, stress-free havens of care, where our Filipino VAs' warmth and AI-driven precision create a future of seamless operations, empowered dentists, and brighter smiles for every patient.

      **Why we do this**: You became a dentist or practice manager because nothing beats seeing a patient's face light up with a confident smile—it's the fire that got you here. But let's be real: the endless admin grind, from denied claims to scheduling nightmares, takes away the joy right out, turning your passion into a daily slog. At SmylSync, our heart-driven purpose is simple—to hand that mess over to our warm, dedicated Filipino VAs and intelligent AI, so you reclaim your spark, build a practice that hums with ease, and keep creating those life-changing smiles. We're in this to make dentistry feel alive again, one stress-free day at a time.
    actions: []
    colors: bg-neutral-fg-dark
    styles:
      self:
        padding:
          - pt-16
          - pl-6
          - pb-16
          - pr-6
        alignItems: center
        flexDirection: row-reverse
        justifyContent: center
      text:
        textAlign: justify
      subtitle:
        textAlign: center
    type: GenericSection
    elementId: 'who-we-are-section'
  - title:
      text: Meet our team
      color: text-dark
      styles:
        self:
          textAlign: center
      type: TitleBlock
    people:
      - content/data/icn-tubban.json
      - content/data/chriseth-cruz.json
      - content/data/paolo-argamaso.json
      - content/data/mark-de-leon.json
    colors: bg-light-fg-dark
    styles:
      self:
        padding:
          - pt-16
          - pl-6
          - pb-16
          - pr-6
        justifyContent: center
      subtitle:
        textAlign: center
    elementId: 'meet-the-team-section'
    type: FeaturedPeopleSection
  - type: GenericSection
    title:
      text: ''
      color: text-dark
      type: TitleBlock
    subtitle:
    text: '**You’ve seen who we are and what drives us — now it’s your turn to experience the SmylSync difference.** Let our team of expert Filipino dental VAs help you reclaim your time, simplify your operations, and reignite your passion for patient care.
    
    
    **Book a quick call with us today and discover how effortless running your dental practice can truly be.**'
    actions:
      - label: Let's Talk
        altText: Let's Talk
        url: /contact-us
        showIcon: false
        icon: arrowRight
        iconPosition: right
        style: primary
        elementId: about-us-cta-button
        type: Button
    elementId: 'about-us-cta-section'
    colors: bg-neutral-fg-dark
    styles:
      self:
        flexDirection: row
        padding:
          - pt-16
          - pl-16
          - pb-16
          - pr-16
        justifyContent: center
      subtitle:
        textAlign: center
      text:
        textAlign: justify
seo:
  metaTitle: About Us - SMYLSYNC
  metaDescription: This is the About Us page built with Netlify Create.
  socialImage: /images/Hero-page.png
  type: Seo
type: PageLayout
---

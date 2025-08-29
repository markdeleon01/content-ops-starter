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
      Mission: SmylSync empowers U.S. dental practices with expert, HIPAA-compliant virtual assistant services, driven by the heartfelt dedication of Filipino VAs. We eliminate administrative chaos—scheduling, claims, credentialing, and patient follow-ups—so dentists can focus on patient care, cut costs, and grow with confidence.

      Vision:  To transform U.S. dental practices into thriving, stress-free havens of care, where our Filipino VAs' warmth and AI-driven precision create a future of seamless operations, empowered dentists, and brighter smiles for every patient.

      Why we do this: You became a dentist or practice manager because nothing beats seeing a patient's face light up with a confident smile—it's the fire that got you here. But let's be real: the endless admin grind, from denied claims to scheduling nightmares, sucks the joy right out, turning your passion into a daily slog. At SmylSync, our heart-driven purpose is simple—to hand that mess over to our warm, dedicated Filipino VAs and intelligent AI, so you reclaim your spark, build a practice that hums with ease, and keep creating those life-changing smiles. We're in this to make dentistry feel alive again, one stress-free day at a time.
    actions: []
    colors: bg-neutral-fg-dark
    styles:
      self:
        padding:
          - pt-20
          - pl-4
          - pb-20
          - pr-4
        alignItems: center
        flexDirection: row-reverse
        justifyContent: center
      text:
        textAlign: center
      subtitle:
        textAlign: center
    type: GenericSection
    backgroundImage:
      type: BackgroundImage
      altText: altText of the image
      backgroundSize: cover
      backgroundPosition: center
      backgroundRepeat: no-repeat
      opacity: 100
      url: /images/abstract-background.svg
  - title:
      text: Meet the team
      color: text-dark
      styles:
        self:
          textAlign: center
      type: TitleBlock
    people:
      - content/data/icn-tubban.json
      - content/data/criseth-cruz.json
      - content/data/paolo-argamaso.json
      - content/data/mark-de-leon.json
    variant: four-col-grid
    colors: bg-light-fg-dark
    styles:
      self:
        padding:
          - pt-16
          - pl-16
          - pb-16
          - pr-16
        justifyContent: center
      subtitle:
        textAlign: center
    type: FeaturedPeopleSection
seo:
  metaTitle: About Us - SMYLSYNC
  metaDescription: This is the About Us page built with Netlify Create.
  socialImage: /images/main-hero.jpg
  type: Seo
type: PageLayout
---

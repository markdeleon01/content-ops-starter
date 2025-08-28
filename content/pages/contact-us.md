---
title: Contact Us
slug: contact-us
sections:
  - title:
      text: Let's Talk
      color: text-dark
      type: TitleBlock
    subtitle: 
    text: |-
      Schedule a 15-minute call with us to identify your challenges and goals.

      Complete our 2-minute survey for a free efficiency report tailored to your practice.

      Let's explore how much time and revenue you could be saving.

      Set your expectations (costs, onboarding time, etc.).
    media:
      fields:
        - name: name
          label: Name
          hideLabel: true
          placeholder: Your name
          isRequired: true
          width: full
          type: TextFormControl
        - name: email
          label: Email
          hideLabel: true
          placeholder: Your email
          isRequired: true
          width: full
          type: EmailFormControl
        - name: message
          label: Message
          hideLabel: true
          placeholder: Your message
          width: full
          type: TextareaFormControl
      elementId: contact-form
      styles:
        self:
          padding:
            - pt-6
            - pb-6
            - pl-6
            - pr-6
          borderColor: border-dark
          borderStyle: solid
          borderWidth: 1
          borderRadius: large
      type: FormBlock
      submitButton:
        type: SubmitButtonFormControl
        label: Submit
        showIcon: false
        icon: arrowRight
        iconPosition: right
        style: primary
        elementId: null
    badge:
      label: Contact Us
      color: text-primary
      type: Badge
    colors: bg-light-fg-dark
    type: GenericSection
seo:
  metaTitle: Contact Us - SMYLSYNC
  metaDescription: This is the Contact Us page built with Netlify Create.
  socialImage: /images/main-hero.jpg
  type: Seo
type: PageLayout
---

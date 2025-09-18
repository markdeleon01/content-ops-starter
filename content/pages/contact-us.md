---
title: Contact Us
slug: /contact-us
sections:
  - title:
      text: Let us know how we can help!
      color: text-dark
      type: TitleBlock
    subtitle: 
    text: |-
      You might be missing out on huge savings!
      
      Send us a message!
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
        elementId: contact-us-form-submit
    badge:
      label: Contact Us
      color: text-primary
      type: Badge
    styles:
      self:
        padding:
        - pt-16
        - pl-16
        - pb-1
        - pr-16
    colors: bg-light-fg-dark
    type: GenericSection
  - text: |-
      But if you want to jumpstart the process to identify your challenges and goals..
    actions:
      - label: Book A Discovery Call
        altText: Book A Discovery Call
        url: https://calendly.com/smylsync-info/45mins
        showIcon: false
        icon: arrowRight
        iconPosition: right
        style: primary
        openInNewTab: true
        elementId: contact-us-cta-button
        type: Button
    styles:
      self:
        padding:
        - pt-16
        - pl-16
        - pb-1
        - pr-16
    colors: bg-light-fg-dark
    type: GenericSection
  - text: |-
      Or 
      
      Get a free efficiency report tailored to your practice!
    actions:
      - label: Complete a 2-minute survey
        altText: Complete a 2-minute survey 
        url: /
        showIcon: false
        icon: arrowRight
        iconPosition: right
        style: primary
        openInNewTab: true
        elementId: contact-us-survey-button
        type: Button
    styles:
      self:
        padding:
        - pt-6
        - pl-16
        - pb-16
        - pr-16
    colors: bg-light-fg-dark
    type: GenericSection
seo:
  metaTitle: Contact Us - SMYLSYNC
  metaDescription: This is the Contact Us page built with Netlify Create.
  socialImage: /images/main-hero.jpg
  type: Seo
type: PageLayout
---

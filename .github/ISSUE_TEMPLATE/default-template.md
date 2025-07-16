---
name: Default Template
about: For all issue reporting
title: Describe Your Issue With Shutro.App
labels: ''
assignees: MRAKS05

---

name: 🐞 Bug report
description: Use this template to report a bug or unexpected behavior.
labels: [needs-triage]

body:
  - type: dropdown
    id: tags
    attributes:
      label: 📑 Tags
      description: Select existing tags or type new ones.
      options:
        - bug
        - enhancement
        - documentation
        - performance
        - question

  - type: input
    id: title
    attributes:
      label: ✍️ Title
      description: Give your issue a short, descriptive title.
      placeholder: e.g. “App crashes on login”
      validations:
        required: true

  - type: textarea
    id: description
    attributes:
      label: 📝 Description
      description: Describe the bug, including steps to reproduce, expected vs. actual behavior.
      validations:
        required: true

  - type: dropdown
    id: location
    attributes:
      label: 📍 Where is this happening?
      description: Choose the component or area.
      options:
        - Frontend
        - Backend
        - API
        - Database
        - Mobile
        - Other

  - type: dropdown
    id: priority
    attributes:
      label: 🚦 Priority
      description: Wrong priority might result in ignored issue.
      options:
        - High
        - Medium
        - Low

  - type: attachments
    id: screenshots
    attributes:
      label: 📸 Screenshots
      description: Attach screenshots or logs if available.

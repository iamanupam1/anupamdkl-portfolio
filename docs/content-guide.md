# Content Guide

All frontend content is managed through markdown files in `src/content/`. Edit these files to update the site without touching code.

## Directory Structure

```
src/content/
  sections/       # Site config and section content
    site.md       # Name, handle, job title, site URL
    hero.md       # Hero section text
    about.md      # About section label, title, and bio
    contact.md    # Social links and footer text
  projects/       # One file per project
    project-alpha.md
    dataflow-engine.md
    devkit-cli.md
  blog/           # Blog posts
    my-post.md
```

## Editing Site Identity

**File:** `src/content/sections/site.md`

```yaml
---
name: "Your Name"
handle: "yourhandle"          # Shown as logo in nav
jobTitle: "Your Job Title"
siteUrl: "https://yourdomain.com"
---
```

Changes here update the nav logo, page titles, Schema.org metadata, and blog post author info.

## Editing the Hero Section

**File:** `src/content/sections/hero.md`

```yaml
---
label: "Full-Stack Engineer"
titleLine1: "Building digital"
titleAccent: "experiences"       # Shown in accent color
subtitle: "Crafting code that feels alive"
---
```

## Editing the About Section

**File:** `src/content/sections/about.md`

```yaml
---
label: "About"
title: "A bit about me"
---

Your bio text goes here as markdown. Each paragraph separated by a blank line
becomes a `<p>` element with a staggered fade-in animation.

Second paragraph here.
```

## Editing Contact Links

**File:** `src/content/sections/contact.md`

```yaml
---
footerText: "Designed with intention. Built with care."
social:
  - platform: "email"
    label: "Email"
    url: "mailto:you@example.com"
    ariaLabel: "Send email"
  - platform: "github"
    label: "GitHub"
    url: "https://github.com/username"
    ariaLabel: "View GitHub profile"
  - platform: "linkedin"
    label: "LinkedIn"
    url: "https://linkedin.com/in/username"
    ariaLabel: "View LinkedIn profile"
  - platform: "twitter"
    label: "X"
    url: "https://twitter.com/username"
    ariaLabel: "View X profile"
---
```

**Supported platforms** (for icons): `email`, `github`, `linkedin`, `twitter`

## Adding a Project

Create a new `.md` file in `src/content/projects/`:

```yaml
---
order: 4                        # Controls display order
tag: "Web App"                  # Category badge
title: "My Project"
summary: "One-line summary."
techStack: ["React", "Node.js"]
gradient: "var(--project-gradient-1)"  # 1, 2, or 3
liveUrl: "https://example.com"         # Optional
githubUrl: "https://github.com/..."    # Optional
---

Full project description goes here as the markdown body.
```

## Adding a Blog Post

Create a new `.md` file in `src/content/blog/`:

```yaml
---
title: "My Blog Post"
summary: "A short summary for cards and meta."
date: 2026-04-01
tags: ["Tag1", "Tag2"]
draft: false                    # Set true to hide from listings
---

Blog content here. Supports full markdown:

## Headings (become TOC entries)

**Bold**, *italic*, `code`, [links](https://example.com)

Images:
![Alt text](/blog/my-image.png)

Code blocks with syntax highlighting.
```

**Images:** Place image files in `public/blog/` and reference as `/blog/filename.ext`.

## Available Gradients

For projects, use these CSS variable gradients:
- `var(--project-gradient-1)` — Green tint
- `var(--project-gradient-2)` — Subtle green
- `var(--project-gradient-3)` — Deep green

## Build Validation

All markdown frontmatter is validated at build time with Zod schemas. If a required field is missing or has the wrong type, `npm run build` will show an error with the exact file and field.

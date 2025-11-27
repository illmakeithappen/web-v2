---
title: Deploy Schwarzenbach Wealth Management Website
description: create a gitthub workflow for prototyping a website
author: Claude Code with gitthub-workflow skill
category: workflow
type: deploy
difficulty: intermediate
references:
  - vault-web/workflows/deploy-cc-schwarzenbach-website-prototype/references/Schwarzenbach_Wealth_Management_Website_FULL.docx
  - vault-web/workflows/deploy-cc-schwarzenbach-website-prototype/references/Prasentation-Schwarzenbach-Wealth-Management.pdf
  - vault-web/workflows/deploy-cc-schwarzenbach-website-prototype/references/Logo_Schwarzenbach_schwarz.pdf
  - vault-web/workflows/deploy-cc-schwarzenbach-website-prototype/references/logo-schwarzenbach.png
context: |
  Building a professional wealth management website prototype for client presentations.
  The website specification document contains the complete page structure and German-language
  content for all sections. Deploying to Render platform for easy sharing with stakeholders.
agent: Claude Code
model: claude-sonnet-4-5
estimated_time: 2-3 hours
total_steps: 8
created_date: 2025-11-18
last_modified: 2025-11-18
workflow_id: 20251118_001_deploy_schwarzenbach_wealth_management_website
status: not started yet
tools:
  - render mcp (for deployment automation)
  - claude code (for site generation)
skills:
  - brand-guideline-applier (for applying any client's brand PDF to website styling and assets)
  - wealth-management-site-generator (for creating compliant financial services client sites)
  - render-deployment-automator (for streamlined Render deployments)
steps:
  - Setup Project Structure
  - Build Homepage with Services
  - Create Investment and Projects Pages
  - Build Team and Contact Pages
  - Add FAQ and Legal Pages
  - Apply Branding and Styling
  - Deploy to Render Platform
  - Configure Custom Domain
---

# Deploy Schwarzenbach Wealth Management Website

**Purpose:** Build and deploy a professional German-language wealth management website prototype for client presentations using Claude Code and Render platform.

**Target Completion Time:** 2-3 hours
**Total Steps:** 8

---

## Step 1: Setup Project Structure

**Instruction:**

```text
Use Claude Code to create a new project folder "schwarzenbach-wm-website" with basic
static site structure: index.html, assets/css/style.css, assets/js/main.js, and an
images folder for logos. Request Claude Code initialize proper HTML5 boilerplate with
German language attribute and responsive viewport meta tags.
```

*Note: This step would benefit from the wealth-management-site-generator skill. Say "Help me create the wealth-management-site-generator skill" to build it first, or continue with manual site setup.*

**Deliverable:** _Project scaffolding with organized folder structure and HTML5 boilerplate ready for content_

**Uses:**
- Tools: claude code
- Skills: wealth-management-site-generator

---

## Step 2: Build Homepage with Services

**Instruction:**

```text
Have Claude Code create index.html with hero section featuring "Dein individueller All-in-One-Beratung
für einen erfolgreichen Vermögensaufbau mit Immobilien" and four service blocks: Objektauswahl &
Erwerb, Finanzierung, Steueroptimierung, and Vermietung & Verwaltung. Request clean, professional
layout with contact CTA buttons for Dr. Lukowski (jhl@schwarzenbach-wm.com, +41 79919 5455).
```

**Deliverable:** _Complete homepage with hero section, four service blocks, and prominent contact CTAs_

**Uses:**
- Tools: claude code
- References: Schwarzenbach_Wealth_Management_Website_FULL.docx (Startseite section)

---

## Step 3: Create Investment and Projects Pages

**Instruction:**

```text
Use Claude Code to build investment-ansatz.html covering strategy, why Germany (4 benefits), 4-step
process, and target audience sections. Then create projekte.html showcasing three properties: Twelve
21 Berlin, Hamburg project, and Waldhausquartier Berlin with pricing and investment advantages.
Use professional cards or sections with clear visual hierarchy.
```

**Deliverable:** _Investment strategy page explaining approach and projects page displaying three real estate opportunities_

**Uses:**
- Tools: claude code
- References: Schwarzenbach_Wealth_Management_Website_FULL.docx (sections 2-3)

---

## Step 4: Build Team and Contact Pages

**Instruction:**

```text
Have Claude Code create team.html with profiles for Dr. Jan Hendrik Lukowski (Strategy & Organisation)
and Daniel Schwarz (Immobilien & Akquise) including their contact details. Build kontakt.html with
contact information for both locations (Zürich & Berlin) and email/phone details formatted professionally.
```

**Deliverable:** _Team page with two professional profiles and dedicated contact page with location information_

**Uses:**
- Tools: claude code
- References: Schwarzenbach_Wealth_Management_Website_FULL.docx (sections 4, 7)

---

## Step 5: Add FAQ and Legal Pages

**Instruction:**

```text
Use Claude Code to create faq.html with collapsible/expandable answers for all questions from the
specification (regions, returns, costs, risks, vvGmbH, market development, etc.). Build impressum.html
and datenschutz.html with complete legal text ensuring DSGVO compliance and proper formatting.
```

**Deliverable:** _FAQ page with interactive collapsible sections plus complete legal pages for impressum and privacy_

**Uses:**
- Tools: claude code
- References: Schwarzenbach_Wealth_Management_Website_FULL.docx (sections 6, 8, 9)

---

## Step 6: Apply Branding and Styling

**Instruction:**

```text
Have Claude Code integrate the Schwarzenbach logo, implement professional color scheme with trust-building
blues and clean whites, add responsive navigation menu across all pages, and ensure mobile-responsive
design. Request Google Fonts for professional typography and smooth transitions/hover effects for
modern feel. Test responsiveness across mobile, tablet, and desktop viewports.
```

*Note: This step would benefit from the brand-guideline-applier skill. Say "Help me create the brand-guideline-applier skill" to build it first, or continue with manual brand application.*

**Deliverable:** _Fully branded website with professional styling, responsive design, and consistent navigation across all pages_

**Uses:**
- Tools: claude code
- References: Logo_Schwarzenbach_schwarz.pdf, Prasentation-Schwarzenbach-Wealth-Management.pdf (for brand colors)
- Skills: brand-guideline-applier

---

## Step 7: Deploy to Render Platform

**Instruction:**

```text
Use the Render MCP tools to create a new static site service on Render. Configure the build command
to serve the site directly, set the publish directory to the project root, and deploy the static
files. Request Claude Code help configure environment settings and verify deployment succeeds.
Monitor deployment logs for any errors.
```

*Note: This step would benefit from the render-deployment-automator skill. Say "Help me create the render-deployment-automator skill" to build it first, or continue with manual Render deployment.*

**Deliverable:** _Live website deployed on Render with functioning URL and all pages accessible_

**Uses:**
- Tools: render mcp, claude code
- Skills: render-deployment-automator

---

## Step 8: Configure Custom Domain

**Instruction:**

```text
Ask Claude to guide you through adding schwarzenbach-wm.com as a custom domain in Render dashboard.
Request step-by-step instructions for updating DNS settings in Hostinger to point to Render's servers,
including A and CNAME records. Verify SSL certificate is automatically provisioned and domain resolves
correctly to the deployed site.
```

**Deliverable:** _Website accessible at schwarzenbach-wm.com with SSL certificate and proper domain configuration_

**Uses:**
- Tools: render mcp

---

## Workflow Completion

By completing this deploy workflow, you will have:

- ✅ Professional wealth management website with 8 pages (homepage, investment, projects, team, FAQ, contact, legal)
- ✅ German-language content following specification exactly
- ✅ Schwarzenbach branding with logos and professional color scheme
- ✅ Mobile-responsive design working across all devices
- ✅ Live deployment on Render platform
- ✅ Custom domain (schwarzenbach-wm.com) configured with SSL
- ✅ Complete legal compliance (Impressum, Datenschutz)
- ✅ Client-ready presentation website

**Final Outcome:** A professional, fully-functional wealth management website prototype deployed and accessible for client presentations at schwarzenbach-wm.com.

---

## Tips for Success

1. **Content First:** Copy all German text from the DOCX carefully to preserve proper language and terminology
2. **Visual Hierarchy:** Use clear section breaks, headings, and white space for professional appearance
3. **Trust Signals:** Emphasize contact information, certifications, and professional credentials throughout
4. **Mobile Testing:** Wealth management clients often browse on mobile - test thoroughly on small screens
5. **Performance:** Optimize images (especially logos) to ensure fast loading times for good first impressions
6. **Compliance:** Ensure Impressum and Datenschutz pages are easily accessible in footer on every page
7. **CTAs:** Make contact buttons prominent and consistent - multiple paths to reach Dr. Lukowski and Daniel
8. **Domain Verification:** Allow 24-48 hours for DNS propagation after configuring custom domain

---

## Next Steps After Workflow

1. **Content Review:** Have Dr. Lukowski and Daniel review all content for accuracy and completeness
2. **Email Setup:** Configure ds@schwarzenbach-wm.com and jhl@schwarzenbach-wm.com in Hostinger email settings
3. **Analytics:** Add simple analytics (Plausible, Simple Analytics) to track visitor engagement
4. **Additional Domains:** Point schwarzenbach-wm.de and schwarzenbach-wm.ch to the same Render deployment
5. **Ongoing Updates:** Plan quarterly content updates for new projects and market information
6. **Create recommended skills for reuse:**
   - **brand-guideline-applier** (for applying any client's brand PDF to website styling and assets) - Say: "Help me create the brand-guideline-applier skill"
   - **wealth-management-site-generator** (for creating compliant financial services client sites) - Say: "Help me create the wealth-management-site-generator skill"
   - **render-deployment-automator** (for streamlined Render deployments) - Say: "Help me create the render-deployment-automator skill"

---

## Resources

- **Render Documentation:** https://render.com/docs/static-sites
- **Hostinger DNS Guide:** https://support.hostinger.com/en/articles/1696791-how-to-point-domain-to-render
- **DSGVO Compliance:** https://www.datenschutz.org/dsgvo-website/

# Skills Marketplace Distribution Guide

This guide explains how to distribute skills via Claude Code plugin marketplaces, enabling Claude Code users to install your skills using the `/plugin install` command.

---

## Overview

Skills can be distributed through two channels:

1. **Anthropic Skills API** - Version-managed uploads via API (cloud-based)
2. **Claude Code Plugin Marketplace** - Direct installation via Claude Code (local or marketplace-hosted)

This guide focuses on marketplace distribution, which requires adding marketplace-specific metadata to your skill's frontmatter.

---

## Why Use Marketplace Distribution?

**Benefits:**
- **Discoverable** via `/plugin search` command in Claude Code
- **Easy installation** with `/plugin install skill-name`
- **Version control** with semantic versioning
- **Clear licensing** and attribution
- **Links to documentation** for comprehensive guides
- **Platform compatibility** indicators for users
- **Dual compatibility** - works with both Skills API and marketplace

**Official Confirmation:**
According to the Claude blog (https://www.claude.com/blog/skills-explained): "Claude Code users: Install Skills via plugin marketplaces."

---

## Prerequisites

Before distributing via marketplace:

1. ✅ **Complete skill implementation** with SKILL.md file
2. ✅ **All Skills API fields** populated (name, skill_id, description, etc.)
3. ✅ **Tested locally** in Claude Code
4. ✅ **Clear documentation** in skill content
5. ✅ **Source code repository** on GitHub or similar
6. ✅ **License chosen** (MIT, Apache-2.0, GPL-3.0, etc.)

---

## Required Marketplace Fields

Add these fields to your SKILL.md frontmatter under a `# Marketplace Integration` section:

### 1. organization

**Purpose:** Publisher or organization name

**Format:** String

**Example:**
```yaml
organization: gitthub
```

**Guidelines:**
- Use your GitHub organization name or brand name
- Provides attribution in marketplace listings
- Should match your repository organization

---

### 2. repository

**Purpose:** Link to skill source code

**Format:** Full GitHub URL

**Example:**
```yaml
repository: https://github.com/gitthub-org/skills/tree/main/gitthub-workflow
```

**Guidelines:**
- Direct link to the skill's directory in your repo
- Enables transparency and community contributions
- Should include `/tree/main/` or `/tree/master/` to show the right branch
- Points to the folder containing SKILL.md and supporting files

---

### 3. homepage

**Purpose:** Link to comprehensive documentation

**Format:** URL to skill detail page

**Example:**
```yaml
homepage: https://gitthub.org/doc?section=skills&skill=gitthub-workflow
```

**Guidelines:**
- Should point to your platform's skill detail page
- Provides users with full documentation beyond the SKILL.md file
- Can include query parameters for deep linking
- Alternative: direct link to skill page on your website

---

### 4. license

**Purpose:** Legal clarity for users

**Format:** SPDX license identifier

**Example:**
```yaml
license: MIT
```

**Common Licenses:**
- `MIT` - Most permissive
- `Apache-2.0` - Patent protection
- `GPL-3.0` - Copyleft
- `BSD-3-Clause` - BSD license
- `CC-BY-4.0` - Creative Commons (for documentation)

**Guidelines:**
- Choose an OSI-approved open source license
- Match the license file in your repository
- Consider compatibility with Claude Code marketplace terms

---

### 5. keywords

**Purpose:** Marketplace search terms

**Format:** Array of strings (5-10 keywords)

**Example:**
```yaml
keywords:
  - workflow
  - automation
  - documentation
  - github
  - structured-guidance
  - conversational-design
  - progressive-learning
```

**Guidelines:**
- 5-10 specific search terms
- More specific than tags (marketplace-focused)
- Include technical terms users might search for
- Mix of broad and specific terms
- Consider user search behavior
- Avoid duplicating tags exactly

---

### 6. compatibility

**Purpose:** Platforms where skill works

**Format:** Array of platform names

**Example:**
```yaml
compatibility:
  - "Claude Code"
  - "Claude.ai"
  - "Claude API"
```

**Valid Platforms:**
- `"Claude Code"` - VS Code extension
- `"Claude.ai"` - Web interface
- `"Claude Desktop"` - Desktop application
- `"Claude API"` - API integration

**Guidelines:**
- Use exact platform names in quotes
- Test on each platform before listing
- Most skills should support all platforms
- Some skills may have platform-specific features

---

### 7. installation_method

**Purpose:** How users should install the skill

**Format:** String (plugin | api | manual)

**Example:**
```yaml
installation_method: plugin
```

**Valid Values:**
- `plugin` - Install via `/plugin install` (recommended for marketplace)
- `api` - Install via Anthropic Skills API upload
- `manual` - Download and manually place in skills directory

**Guidelines:**
- Use `plugin` for skills distributed via marketplace
- Use `api` for skills uploaded via Anthropic Skills API
- Use `manual` for skills distributed as downloads

---

## Complete Example

Here's a complete marketplace integration section for reference:

```yaml
# Marketplace Integration
organization: gitthub
repository: https://github.com/gitthub-org/skills/tree/main/gitthub-workflow
homepage: https://gitthub.org/doc?section=skills&skill=gitthub-workflow
license: MIT
keywords:
  - workflow
  - automation
  - documentation
  - github
  - structured-guidance
  - conversational-design
  - progressive-learning
compatibility:
  - "Claude Code"
  - "Claude.ai"
  - "Claude API"
installation_method: plugin
```

---

## Step-by-Step Distribution Process

### Phase 1: Prepare Your Skill

1. **Complete all Skills API fields** in SKILL.md frontmatter
2. **Add marketplace fields** following this guide
3. **Test locally** in Claude Code
4. **Verify all supporting files** (instructions/, code/, resources/)
5. **Update version number** using semantic versioning

### Phase 2: Publish to Repository

1. **Create GitHub repository** (or use existing monorepo)
2. **Organize skill in directory structure:**
   ```
   skills/
   └── your-skill-name/
       ├── SKILL.md
       ├── instructions/
       ├── code/
       └── resources/
   ```
3. **Commit and push** to GitHub
4. **Tag release** with version number (e.g., `v1.0.0`)
5. **Update repository URL** in SKILL.md if needed

### Phase 3: Submit to Marketplace

1. **Follow Claude Code marketplace submission process**
2. **Provide marketplace metadata** from your SKILL.md
3. **Wait for review and approval**
4. **Respond to feedback** if requested
5. **Announce availability** once approved

### Phase 4: Maintain and Update

1. **Track usage** via usage_count field
2. **Gather user feedback** via GitHub issues
3. **Update version** when making changes
4. **Update last_modified** date in frontmatter
5. **Re-submit** to marketplace for major updates

---

## Validation Checklist

Before submitting to marketplace, verify:

**Required Skills API Fields:**
- [ ] `name` and `skill_id` are unique and kebab-case
- [ ] `description` is comprehensive (2-3 sentences)
- [ ] `skill_type` is valid from the list
- [ ] `difficulty` is beginner/intermediate/advanced
- [ ] `author` is specified
- [ ] `created_date` and `last_modified` are YYYY-MM-DD format
- [ ] `version` uses semantic versioning
- [ ] `status` is set to "active"
- [ ] `estimated_time` is realistic
- [ ] `agent` lists all supported platforms
- [ ] `model` specifies recommended model
- [ ] `tags` has 3-8 relevant tags

**Marketplace Fields:**
- [ ] `organization` matches your GitHub org/brand
- [ ] `repository` is a valid GitHub URL pointing to skill directory
- [ ] `homepage` links to your skill documentation page
- [ ] `license` is an OSI-approved open source license
- [ ] `keywords` has 5-10 marketplace search terms
- [ ] `compatibility` lists all supported platforms accurately
- [ ] `installation_method` is set to "plugin"

**Testing:**
- [ ] Skill works in Claude Code locally
- [ ] All supporting files load correctly
- [ ] Documentation is clear and complete
- [ ] Examples are tested and working
- [ ] License file exists in repository
- [ ] README exists in repository

---

## Marketplace vs Skills API

Understanding the differences:

| Aspect | Marketplace | Skills API |
|--------|-------------|------------|
| **Distribution** | Plugin marketplace | API upload |
| **Installation** | `/plugin install skill-name` | Automatic via API |
| **Discovery** | Browse/search marketplace | API listing |
| **Version Control** | Git tags + semantic versioning | Unix timestamp by API |
| **Hosting** | GitHub or marketplace | Anthropic cloud |
| **Updates** | Re-submit to marketplace | Re-upload via API |
| **Attribution** | Visible via organization field | Less prominent |
| **Licensing** | Required (license field) | Optional |
| **Repository Link** | Required (repository field) | Optional |

**Recommendation:** Use marketplace distribution for:
- Public skills you want discoverable
- Skills with complex supporting files
- Skills requiring version control
- Skills needing clear attribution
- Community-contributed skills

Use Skills API for:
- Private/internal skills
- Simple single-file skills
- Skills requiring cloud hosting
- Skills integrated into your product

**Best of Both:** You can maintain dual compatibility by including all fields!

---

## Updating Published Skills

When updating a marketplace skill:

1. **Make changes** to SKILL.md and supporting files
2. **Update version** field (e.g., 1.0 → 1.1)
3. **Update last_modified** date
4. **Commit and push** to GitHub
5. **Tag new release** (e.g., `v1.1.0`)
6. **Submit update** to marketplace (if required)
7. **Announce changes** in release notes

**Versioning Guidelines:**
- **Major (X.0)**: Breaking changes, restructure, new API
- **Minor (x.Y)**: New features, improvements, additions
- **Patch (x.y.Z)**: Bug fixes, typos, minor updates

---

## Common Issues and Solutions

### Issue: Skill not appearing in marketplace

**Solution:**
- Verify all required marketplace fields are populated
- Check that status is set to "active"
- Ensure repository URL is accessible
- Confirm license is an OSI-approved license
- Wait for marketplace indexing (can take 24-48 hours)

### Issue: Installation fails in Claude Code

**Solution:**
- Test skill locally before publishing
- Verify SKILL.md YAML frontmatter is valid
- Check that all file paths in references are correct
- Ensure supporting files exist at expected locations
- Validate compatibility list matches actual support

### Issue: Users can't find skill in search

**Solution:**
- Add more specific keywords
- Include common search terms users might use
- Make name and description more descriptive
- Add tags that match user intent
- Consider alternative terminology

### Issue: License conflicts

**Solution:**
- Ensure license matches license file in repository
- Use SPDX identifier (e.g., MIT, not "MIT License")
- Avoid mixing incompatible licenses in dependencies
- Document any special licensing requirements

---

## Best Practices

### Naming

✅ **Good:**
- `workflow-generator` - Clear, descriptive, kebab-case
- `python-debugger` - Technology + purpose
- `api-designer` - Function-focused

❌ **Bad:**
- `MySkill` - CamelCase not supported
- `skill_one` - Underscores not preferred
- `test` - Too generic, not descriptive

### Keywords

✅ **Good:**
- Mix of broad and specific terms
- Technical terms users search for
- Problem-focused language
- Tools and technologies mentioned

❌ **Bad:**
- All generic terms (automation, tool, helper)
- Duplicating tags exactly
- Too few keywords (<5)
- Too many keywords (>10)

### Documentation

✅ **Good:**
- Clear "When to Use" section with examples
- Step-by-step usage instructions
- Quick reference summary
- Links to supporting files

❌ **Bad:**
- Vague or missing usage guidance
- No examples provided
- Broken links to supporting files
- Missing prerequisites

---

## Additional Resources

**Templates:**
- `_SKILL_TEMPLATE.md` - Complete skill template with marketplace fields
- `gitthub-workflow/SKILL.md` - Reference implementation

**Documentation:**
- `_SKILL_STRUCTURE.md` - Comprehensive frontmatter structure guide
- Claude blog: https://www.claude.com/blog/skills-explained
- Claude Code marketplace docs: https://code.claude.com/docs/en/plugin-marketplaces

**Examples:**
- `gitthub-workflow/` - Complete skill with marketplace metadata
- `email-analyzer/` - Another reference implementation

---

## Support and Contribution

**Questions:**
- GitHub Issues: https://github.com/gitthub-org/skills/issues
- Documentation: https://gitthub.org/doc?section=skills

**Contributing:**
- Fork the skills repository
- Add your skill following this guide
- Submit pull request with complete metadata
- Wait for review and feedback

**Reporting Issues:**
- Report bugs via GitHub Issues
- Include skill_id and version number
- Provide steps to reproduce
- Attach relevant error messages

---

## Summary

Distributing skills via Claude Code marketplace requires:

1. ✅ **Complete Skills API frontmatter** (all required fields)
2. ✅ **Add 8 marketplace fields** (organization, repository, homepage, license, keywords, compatibility, installation_method)
3. ✅ **Publish to GitHub** (or similar repository)
4. ✅ **Submit to marketplace** (follow submission process)
5. ✅ **Maintain and update** (version control, user feedback)

**Time Investment:**
- Initial setup: 30-60 minutes
- Testing and validation: 30 minutes
- Marketplace submission: 15-30 minutes
- Total: ~2 hours for first skill

**Benefits:**
- Discoverable by Claude Code users
- Clear attribution and licensing
- Version-controlled updates
- Community contributions enabled
- Professional distribution channel

**Get Started:**
1. Copy `_SKILL_TEMPLATE.md`
2. Fill in all required and marketplace fields
3. Test locally in Claude Code
4. Publish to GitHub
5. Submit to marketplace

Happy skill building! 🚀

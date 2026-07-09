# BaseForge UI Rules

Use this file as the visual and interaction guide for building the BaseForge website.

## UI Goal

BaseForge should feel like a focused developer tool.

The interface should be:

- Minimal
- Fast to scan
- Practical
- Trustworthy
- Technical without feeling cluttered

The website should prioritize the project builder experience, not a marketing landing page.

## Visual Direction

Use a clean green-accent palette inspired by tools like Supabase and Neon.

Do not hardcode colors repeatedly in components.

Use:

- CSS variables
- Tailwind theme tokens
- shadcn/ui color tokens

The main accent should come from semantic tokens such as:

```txt
primary
accent
ring
border
muted
background
foreground
```

Avoid writing repeated one-off color classes like:

```txt
bg-green-500
text-emerald-600
border-lime-400
```

Prefer token-based classes:

```txt
bg-primary
text-primary-foreground
border-border
text-muted-foreground
ring-ring
bg-accent
```

## Theme Rules

The global theme should define the product palette.

Components should consume the theme instead of defining their own palettes.

Rules:

- Use CSS variables in `app/globals.css`.
- Support light and dark mode tokens.
- Keep green as an accent, not the only visible color.
- Use neutral surfaces for most layout areas.
- Use green for primary actions, focus rings, selected states, and key highlights.
- Avoid gradient-heavy design.
- Avoid decorative blobs, orbs, and bokeh backgrounds.

## Layout Rules

The first screen should show the actual BaseForge builder experience.

Do not build a marketing-only homepage.

Recommended layout:

```txt
Header
Main builder area
Step navigation
Current step content
Live summary or preview panel
Footer or compact status area
```

The builder should work well on:

- Desktop
- Tablet
- Mobile

Desktop can use a two-column layout:

```txt
Left: wizard step
Right: live summary / preview
```

Mobile should use a single-column layout with preview below the current step.

## Wizard Rules

BaseForge should use a step-by-step wizard.

Suggested steps:

```txt
1. Project
2. Framework
3. Styling and UI
4. Database
5. ORM
6. Auth
7. Extras
8. Preview
9. Download
```

Rules:

- Show current step clearly.
- Show progress clearly.
- Allow going back to previous steps.
- Prevent invalid next steps when required fields are missing.
- Keep each step focused.
- Do not show every option at once.
- Use compatibility rules to disable invalid choices.
- Explain disabled options briefly.

## Components

Use shadcn/ui components as the base system.

Prefer:

- `Button` for actions
- `Input` for project name
- `Card` only for contained repeated items or tool panels
- `Tabs` for preview modes
- `Badge` for selected technologies
- `Switch` or `Checkbox` for boolean options
- `RadioGroup` or selectable cards for exclusive choices
- `Dialog` only when interruption is necessary
- `Tooltip` for compact explanations

Do not nest cards inside cards.

Do not overuse large cards for every section.

## Option Selection Rules

Stack choices should be easy to compare.

Each selectable option should show:

- Name
- Short description
- Status if selected
- Disabled state if unavailable
- Optional "recommended" badge

Example:

```txt
PostgreSQL
Production-ready relational database.
Recommended
```

Do not use long paragraphs inside option cards.

## Preview Rules

The preview step should build confidence before download.

MVP preview should include:

- Selected stack summary
- Dependencies
- Dev dependencies
- Scripts
- Environment variables
- Generated file tree

Full file content preview is optional later.

Preview should not require generating the full zip unless necessary.

It can be based on schema and feature metadata in the MVP.

## Download Flow Rules

The download flow should be direct.

Required states:

- Ready to generate
- Generating
- Download started
- Error

The primary action should be clear:

```txt
Generate ZIP
```

After success, show practical next steps:

```bash
unzip my-app.zip
cd my-app
npm install
npm run dev
```

Use the selected package manager in these instructions.

## Typography Rules

Use simple, readable typography.

Rules:

- Avoid oversized hero typography inside the tool UI.
- Use compact headings in panels and wizard steps.
- Keep labels short.
- Use muted text for supporting descriptions.
- Do not use negative letter spacing.
- Do not scale font size with viewport width.

## Spacing And Radius

Keep the interface compact but not cramped.

Rules:

- Use consistent spacing.
- Prefer 8px or smaller card radius unless shadcn defaults apply.
- Do not make everything pill-shaped.
- Buttons may use standard shadcn radius.
- Keep form controls aligned.
- Avoid large empty decorative sections.

## Icon Rules

Use icons where they improve scanning.

Prefer lucide icons if available.

Good icon usage:

- Step status
- Download action
- Preview modes
- Database option
- Auth option
- UI option
- Warning or disabled state

Do not create custom SVG icons unless necessary.

Do not use icons as decoration without meaning.

## Copy Rules

The UI copy should be direct and developer-focused.

Good:

```txt
Choose your database
Add Prisma client and schema
Generate ZIP
Preview file tree
```

Avoid:

```txt
Supercharge your development journey
Build the future faster
Unleash productivity
```

Use practical wording over marketing language.

## Accessibility Rules

The builder should be keyboard-usable.

Rules:

- Use semantic form controls where possible.
- Ensure visible focus states.
- Use accessible labels.
- Do not rely only on color to communicate state.
- Disabled choices should include a reason.
- Ensure contrast is acceptable in light and dark mode.

## Responsive Rules

Desktop:

- Wizard and preview can sit side by side.
- Keep the primary action visible.

Mobile:

- Use one column.
- Keep step navigation compact.
- Avoid horizontal overflow.
- Ensure option cards fit within viewport width.
- Keep buttons readable and tappable.

## Error Rules

Errors should be clear and actionable.

Examples:

```txt
Project name is required.
Prisma requires a database.
Docker Compose is only available with PostgreSQL.
```

Avoid vague errors:

```txt
Something went wrong.
Invalid configuration.
```

If a generation error happens, show a short explanation and let the user retry.

## Loading Rules

Generation loading state should:

- Disable duplicate submissions
- Show clear progress text
- Preserve the selected config on screen
- Avoid fake detailed progress unless real steps are available

Good:

```txt
Generating project...
```

Later, if real stages exist:

```txt
Building file tree...
Creating ZIP...
```

## File Tree UI Rules

The file tree preview should be compact and readable.

Rules:

- Use monospace for file paths.
- Use indentation.
- Use folder/file icons if useful.
- Keep long paths from breaking layout.
- Support scroll when the tree is long.

Example:

```txt
my-app/
  app/
    layout.tsx
    page.tsx
  prisma/
    schema.prisma
  .env.example
  package.json
```

## Things To Avoid

Avoid:

- Marketing-first homepage
- Huge hero section before the builder
- Decorative gradient blobs
- One-note green-only interface
- Hardcoded colors across components
- Nested cards
- Too many options in one screen
- Long explanatory paragraphs inside the app
- Full CLI implementation in the website phase
- Generator logic inside UI components

## Final UI Principle

BaseForge should look and behave like a serious developer workflow tool:

```txt
Choose stack -> Preview output -> Generate ZIP
```

Everything in the UI should support that flow.

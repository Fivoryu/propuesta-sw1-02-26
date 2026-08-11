# Shared Design System

The design system provides an implementation-ready visual and interaction contract for the Spanish-language portal and three product prototypes. Shared primitives should feel related, while each product keeps a distinct identity. The system is mobile-first and targets WCAG 2.2 AA practices without claiming formal certification.

## Foundations

### Spacing

Use a 4 px base scale and semantic token names. Avoid arbitrary values in product screens.

| Token | Value | Typical use |
|---|---:|---|
| `space-1` | 4 px | icon-to-label gap, compact metadata |
| `space-2` | 8 px | control internals, badge padding |
| `space-3` | 12 px | field groups, card metadata |
| `space-4` | 16 px | mobile page padding, standard gaps |
| `space-6` | 24 px | card padding, section gaps |
| `space-8` | 32 px | desktop card padding, form groups |
| `space-12` | 48 px | section separation |
| `space-16` | 64 px | hero and major page separation |

Default page padding is 16 px on small screens and 24-32 px on larger screens. Content width should remain readable, with a recommended maximum of 1200 px for app shells and 720 px for focused forms.

### Typography

Use a readable sans-serif stack: `Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif`. A display face may be added per product only when it preserves legibility and does not require an external service. Visible UI copy is Spanish; technical identifiers remain English.

| Role | Size / line height | Weight | Use |
|---|---:|---:|---|
| Display | 48 / 56 px | 700 | portal hero or product landing headline |
| Heading 1 | 36 / 44 px | 700 | page title |
| Heading 2 | 28 / 36 px | 700 | major section |
| Heading 3 | 22 / 28 px | 650 | card or form section |
| Body | 16 / 24 px | 400 | primary reading and form labels |
| Body strong | 16 / 24 px | 600 | emphasis and values |
| Small | 14 / 20 px | 400 | helper and secondary text |
| Caption | 12 / 16 px | 600 | status metadata; never the only explanation |

On screens below 480 px, reduce Display to 36 / 44 px and Heading 1 to 30 / 38 px. Do not reduce body text below 16 px for primary controls.

### Radii and Elevation

| Token | Value | Typical use |
|---|---:|---|
| `radius-sm` | 8 px | inputs, compact controls |
| `radius-md` | 12 px | cards, banners, buttons |
| `radius-lg` | 16 px | feature cards, result panels |
| `radius-xl` | 24 px | hero surfaces and modal shells |
| `radius-pill` | 999 px | tags, status badges, progress indicators |

Use three elevation levels and keep them quiet:

- `elevation-0`: no shadow, separated by surface or border.
- `elevation-1`: `0 2px 8px` with a low-opacity neutral shadow for cards.
- `elevation-2`: `0 8px 24px` for dialogs and raised results.

Avoid shadows as the only way to communicate grouping. Borders, spacing, headings, and semantic status also carry meaning.

## Product Identities

Colors are semantic tokens. Product screens should consume theme tokens rather than hard-coded hex values. Contrast must be checked for every text/background pair.

| Product | Primary | Accent | Surface | Text | Visual language |
|---|---|---|---|---|---|
| Academic portal | `#273469` deep indigo | `#E2A93B` academic gold | `#F7F5F0` warm paper | `#182033` ink | editorial, structured, evidence-oriented |
| Mejora Mi Barrio | `#0E7C66` civic teal | `#E76F51` alert coral | `#F2F7F4` soft green | `#17332D` forest ink | civic, optimistic, grounded, map-adjacent |
| Cuaderno Matemático | `#2457D6` cobalt | `#F4C95D` chalk yellow | `#F6F8FC` cool paper | `#17213B` navy ink | focused, geometric, study-friendly |
| Encuentra Mi Mascota | `#7257D9` violet | `#F18F6A` warm peach | `#FFF8F2` cream | `#2B2230` plum ink | warm, caring, approachable, photo-led |
| NutriVision | `#2F9E44` | `#F59F00` | `#FBFDF8` | `#1C2B22` | natural, analytical, mobile-first, food-led |

Each theme also needs semantic colors independent of product identity: success `#147D64`, warning `#A46600`, error `#B42318`, info `#1769AA`, and neutral `#5B6472`. Pair them with an icon and text label; never communicate status with color alone.

## Controls and Components

### Button Contract

| Size | Height | Minimum width | Use |
|---|---:|---:|---|
| Small | 40 px | 88 px | secondary actions and dense toolbars |
| Medium | 48 px | 120 px | default action |
| Large | 56 px | 160 px | primary mobile action or hero CTA |

All buttons have at least 16 px horizontal padding, a visible label unless the icon is universally clear, and a 44 x 44 px interactive area. A primary action is visually distinct from secondary, ghost, and destructive actions. Destructive actions require a confirmation step when they discard a draft or remove a result.

### Shared Component Inventory

`packages/ui` should provide the following primitives and patterns:

- `AppShell`, `TopBar`, `BottomNav`, and `Breadcrumbs` for responsive navigation.
- `Button`, `IconButton`, `LinkButton`, and `ButtonGroup` for actions.
- `TextField`, `Textarea`, `Select`, `RadioGroup`, `Checkbox`, and `FileFixturePicker` for prototype inputs.
- `Card`, `Section`, `Badge`, `Divider`, and `Progress` for content structure.
- `Stepper`, `ConfidenceMeter`, `ResultSummary`, and `DuplicateNotice` for product flows.
- `StatusBanner`, `Skeleton`, `EmptyState`, `ErrorState`, and `RetryButton` for recovery states.
- `Dialog`, `ConfirmSheet`, and `Toast` for confirmation and reversible feedback.

Components accept content and status as props. They do not own product wording, call mock services, or decide whether a result is a duplicate.

## Component States

Every interactive component must define and test the states that apply to it:

| State | Required behavior |
|---|---|
| Default | Clear affordance and Spanish label. |
| Hover | Subtle visual response that does not change layout. |
| Focus-visible | High-contrast outline, never removed with `outline: none`. |
| Pressed / selected | Persistent indication for toggles, tabs, and selected candidates. |
| Disabled | Reduced emphasis and no action; explain why when not obvious. |
| Loading | Preserve context, prevent duplicate submission, and expose a text status such as `Analizando...`. |
| Success | Confirm what happened and identify the next reversible action. |
| Warning / low confidence | State uncertainty and invite review or correction. |
| Duplicate | Explain what is similar and offer `Revisar existente` or `Continuar de todos modos`. |
| Error | Explain the failed step, preserve safe input, and offer `Reintentar` or cancellation. |
| Empty | Explain why there is no content and provide the next useful action. |

## Accessibility and Responsive Behavior

- Use semantic landmarks, one descriptive page heading, and labels tied to every form control.
- Keep keyboard order equal to visual order. Dialogs trap focus while open and return focus to the triggering control when closed.
- Provide `aria-live` or an equivalent announcement for loading completion, validation errors, and result status without over-announcing every visual change.
- Maintain visible focus, a minimum 44 x 44 px target, and text contrast of at least 4.5:1 for normal text and 3:1 for large text or UI boundaries.
- Do not rely on color, animation, location, or an icon alone. Include Spanish text or an accessible name.
- Support `prefers-reduced-motion`; loading must remain understandable without animation.
- Validate at 360 px, 390 px, 768 px, 1024 px, and 1440 px widths. Avoid horizontal scrolling and keep primary actions reachable on mobile.
- Use a responsive two-column layout only when the content remains readable; forms and result review should collapse to one column on small screens.
- Do not expose realistic personal contact details in fixtures. If a contact-like value is shown, label it as fictional or simulated.

## Implementation Rules

1. Put shared tokens and primitives in `packages/ui`; put product theme values in one theme definition per app.
2. Keep UI copy in Spanish even when the underlying scenario, component, or type name is English.
3. Make loading, empty, low-confidence, duplicate, error, correction, cancel, and confirmation states first-class layouts, not incidental text below a form.
4. Prefer composition over product-specific forks of shared components.
5. Test keyboard paths and narrow layouts as part of the component contract, not as a final visual polish step.

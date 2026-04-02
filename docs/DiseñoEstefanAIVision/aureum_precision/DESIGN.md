# Design System Document: The Digital Atelier

## 1. Overview & Creative North Star
**Creative North Star: The Digital Atelier**
This design system is envisioned as a "Digital Atelier"—a space where the timeless precision of a master barber’s blade meets the hyper-intelligence of AI. To achieve a high-end editorial feel, we move away from the rigid, boxed-in layouts of standard SaaS apps. Instead, we embrace **Intentional Asymmetry** and **Tonal Depth**. 

The interface should feel like a premium lifestyle magazine: expansive white space, dramatic typographic scale shifts, and elements that overlap naturally to create a sense of physical layers. We are not just building an app; we are crafting a professional tool that feels as weighted and significant as a pair of bespoke shears.

---

## 2. Colors
Our palette balances the warmth of traditional barbering with the cold precision of technology.

*   **Core Tones:**
    *   **Background (`surface` / `#fef8f3`):** A sophisticated cream that prevents the "clinical" feel of pure white.
    *   **Primary (`primary-container` / `#1a1a2e`):** Our "Midnight Navy." Used for high-authority surfaces and headers to ground the experience.
    *   **The Accent (`secondary` / `#7b5806`):** Our "Barber Gold." This is used sparingly for CTAs and critical states to signify premium value.
    *   **AI Success (`on-tertiary-container` / `#00948c`):** A tech-forward Teal specifically for "Modo B" (AI Try-on) success states.

*   **The "No-Line" Rule:**
    Strictly prohibit 1px solid borders for sectioning content. Boundaries must be defined through background color shifts. For example, a card should not have an outline; it should be a `surface-container-lowest` shape sitting on a `surface-container-low` section.

*   **Surface Hierarchy & Nesting:**
    Treat the UI as a series of stacked fine-paper sheets. 
    *   **Base:** `surface`
    *   **Sectioning:** `surface-container-low`
    *   **Interactive Cards:** `surface-container-lowest` (creates a subtle "pop" without shadows).

*   **The "Glass & Gradient" Rule:**
    For the AI Vision features, use Glassmorphism. Floating panels should use semi-transparent `primary-container` (80% opacity) with a `20px` backdrop blur. Apply a subtle linear gradient to main CTAs—transitioning from `secondary` to `secondary-fixed-dim`—to give the gold a metallic, light-catching quality.

---

## 3. Typography
We use a high-contrast typographic pairing to signal both "Heritage" and "Tech."

*   **Display & Headlines (Noto Serif / Playfair Style):**
    Use **display-lg** and **headline-lg** for editorial moments, such as service titles or "Estefan AI" branding. These should be set with tight tracking (-2%) to feel authoritative and bespoke.
*   **UI & Body (Manrope / DM Sans Style):**
    Use **body-md** for general interface text and **label-md** for technical AI data. This sans-serif provides a functional, modern counter-balance to the serif headers.
*   **Hierarchy Note:** 
    Always pair a large Serif headline with a much smaller, all-caps Sans-Serif label (using **label-sm** with +10% letter spacing) positioned above it to create a "curated" look.

---

## 4. Elevation & Depth
Depth in this system is achieved through **Tonal Layering** rather than traditional structural lines or heavy drop shadows.

*   **The Layering Principle:**
    Stack surface tiers to create natural lift. A `surface-container-highest` element (like a featured AI cut) should feel closer to the user than a `surface-variant` background.
*   **Ambient Shadows:**
    When a floating effect is required (e.g., a "Confirm Appointment" modal), use an ultra-diffused shadow: `0 8px 32px rgba(29, 27, 25, 0.05)`. The shadow color is derived from the `on-surface` token at a very low opacity to mimic natural ambient light.
*   **The "Ghost Border" Fallback:**
    If a border is required for accessibility (e.g., in a high-contrast mode or input field), use the `outline-variant` token at **15% opacity**. Never use a 100% opaque border.
*   **Glassmorphism:**
    Use backdrop-blur on top-level navigation bars to allow the "Cream White" background to bleed through softly, ensuring the app feels integrated and "airy."

---

## 5. Components

### Buttons
*   **Primary (Gold):** Background `secondary`, Text `on-secondary`. 8px radius (`md`). Use a subtle inner-glow (top edge) to simulate a premium tactile button.
*   **Secondary (Navy):** Background `primary-container`, Text `inverse-on-surface`.
*   **Tertiary (Ghost):** No background. Use `title-sm` with `secondary` text color and an icon.

### Cards & AI Insights
*   **Forbid Dividers:** Do not use lines to separate hair-style options. Use `3.5rem` (Spacing 10) of vertical whitespace or a transition from `surface-container` to `surface-container-high`.
*   **AI Vision Cards:** Use the `EA` Monogram as a watermark at 5% opacity in the background of cards that contain AI-generated content.

### Inputs & Selectors
*   **Fields:** Use `surface-container-low` as the fill. On focus, transition the background to `surface-container-lowest` and add a `2px` "Barber Gold" (`secondary`) bottom-only indicator.
*   **Modo B Toggle:** A custom switch. When active, it glows with the Teal `tertiary` token, signaling the AI engine is engaged.

### The Monogram (EA)
The monogram is the "Seal of Quality." It should appear in `secondary` (Gold) on `primary-container` (Navy) backgrounds. In the loading state, the monogram should subtly pulse with a "shimmer" gradient.

---

## 6. Do's and Don'ts

### Do:
*   **DO** use generous whitespace (Scale 12 and 16) to let high-end photography breathe.
*   **DO** use the `EA` monogram as a central brand element in high-contrast navy/gold sections.
*   **DO** use "Thin Stroke" iconography (Lucide style) to match the precision of the typography.

### Don't:
*   **DON'T** use 1px dividers or "boxes within boxes." Use background shifts.
*   **DON'T** use pure black (#000). Use the Deep Navy `primary` or `on-surface` for text.
*   **DON'T** use the Teal accent for anything other than "Modo B" or success states; it must remain a signal for AI-specific interaction.
*   **DON'T** crowd the UI. If a screen feels busy, increase the spacing scale by one step and reduce the typography size.

---
*Director's Final Note: Remember, elegance is the balance of what you leave out. Keep the interface quiet, let the AI results be the hero, and ensure every tap feels intentional.*
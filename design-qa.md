# Design QA — restaurant map icon system

## Source of truth

- Selected ImageGen direction: `/Users/macmini/.codex/generated_images/01a013b6-d417-7412-8917-3f5c99fad2c1/exec-7df4ea23-6dfa-4e79-b1e1-ca5514e1c396.png`
- Direction: solid dark-forest-green circular fields, large warm-ivory food pictograms, and restrained coral or gold accents.
- The generated concept is art direction. Production icons use the closest matching Apache-2.0 Material Design Icons vector paths so all 25 categories remain crisp and maintainable.

## Implementation evidence

- Full 25-icon contact sheet: `artifacts/icon-system-option-2/contact-sheet.png` (640 × 640)
- Six-category matched state: `artifacts/icon-system-option-2/implementation-six.png` (1536 × 1024)
- iPhone map state: `artifacts/icon-system-option-2/implementation-mobile.png` (390 × 844 CSS pixels)
- iPhone restaurant-detail state: `artifacts/icon-system-option-2/implementation-detail.png` (390 × 844 CSS pixels)
- Direct icon comparison: `artifacts/icon-system-option-2/design-comparison-icons.png`
- Source-plus-mobile comparison: `artifacts/icon-system-option-2/design-comparison-mobile.png`

## Visual checks

| Check | Result | Evidence |
| --- | --- | --- |
| Palette and silhouette match selected direction | Passed | Direct side-by-side comparison uses the same six category order. |
| 19 px filter-chip legibility | Passed | Main silhouette remains readable; accents are secondary and never carry the category alone. |
| Map-pin legibility over OpenStreetMap | Passed | Dark-green pins and ivory pictograms retain contrast over streets, land and water. |
| Michelin distinction | Passed | Existing compact gold `M` badge remains separate from the cuisine symbol. |
| Closed-state distinction | Passed | Generated closed variants use grayscale without changing pin geometry. |
| Restaurant detail-card continuity | Passed | Category icon uses the same SVG asset as its filter and pin. |
| Layout regression | Passed | Header, horizontal cuisine filters, map controls, bottom navigation and place sheet retain existing spacing and hierarchy. |

## Interaction checks

- Restaurant detail route opens as a labelled dialog and retains the exterior photo.
- Closing the restaurant detail restores the map.
- Selecting `越南菜` sets `aria-pressed=true` and updates the result status from 97 to 27 restaurants.
- Browser console: no warnings or errors in the default map or restaurant-detail state.

## Findings and corrections

1. Initial warm accent marks were too small at filter-chip scale.
2. Accent scale was increased from 0.75 to 0.9 and moved inward so it survives 19 px rendering without crowding the main silhouette.
3. Legacy one-off root SVG files were removed; `scripts/map-icon-system.mjs` is now the single icon source of truth.

## Final result

passed

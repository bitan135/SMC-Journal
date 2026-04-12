---
name: UI Layout and Alignment Guidelines
description: Best practices and rules for maintaining pixel-perfect typography, flexbox alignments, and sidebar layouts in SMC Journal.
---

# UI Layout and Alignment Guidelines

This intelligence layer document ensures that future agents maintain the extreme professional standard, visual perfection, and pixel precision required by the SMC Journal web app.

## 1. Sidebar and Fixed Height Constraints
When maintaining or extending the `Sidebar.jsx`:
- Vertical spaces inside `h-screen`, `min-h-screen`, or flex containers with `overflow-y-auto` must have specific shrink rules. 
- Bottom elements like User Cards or CTAs MUST contain `shrink-0` if they reside in a dynamically shrinking `flex-col` constraint. 
- *Why:* If unconstrained, elements lacking `shrink-0` will vertically squash down unprofessionally when the viewport height collapses (for instance on smaller laptops or horizontal mobile views).
- The parent container should map its scroll effectively using `overflow-y-auto scrollbar-hide`. 

## 2. Text Baseline Alignments
When mixing very large typography (e.g., `text-4xl`) alongside metadata text (e.g., `text-[10px]`):
- **Avoid:** `<div className="flex items-baseline gap-2">` wrapping without safety checks.
- *Why:* The metadata text will awkwardly snap below the baseline due to horizontal width restrictions on devices, breaking visual symmetry and looking amateurish.
- **Do This:** Use a standard stacked metric column whenever constrained in a grid or standard container layout:
  ```jsx
  <div className="flex flex-col gap-1 mt-1">
      <span className="text-4xl font-black tracking-tighter leading-none">{value}</span>
      <span className="text-[10px] font-bold text-[var(--text-muted)] truncate opacity-80">{subValue}</span>
  </div>
  ```
- *Why:* The `flex-col`, coupled with `<span className="truncate">`, enforces that text strictly aligns on its axes without wrapping to an unpredictable baseline layout below it.

## 3. General "No-Break" Policies for SaaS Dashboards
- **Grid Density:** The `MetricCard` grids and Data Insight blocks must look pristine down to `360px` width. Implement `truncate` on secondary descriptions or enforce structured rows via flexbox. 
- **Flex-Wrap:** If items must sit side-by-side (e.g., buttons and labels), either restrict them using `whitespace-nowrap flex-shrink-0` or implement explicit breakpoint overrides `<div className="flex flex-col md:flex-row ...">`. Never allow a flex row to implicitly push baseline-dependent trailing elements to an unwieldy second row. 

## Reference 
Task: "Fix sidebar clipping and metric card wrapping misalignments" - April 2026.

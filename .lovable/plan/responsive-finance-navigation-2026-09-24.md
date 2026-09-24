# Responsive Finance Navigation

## Build
- Replace the current wrapping links with a compact navigation control placed beside the currency selector.
- Show Dashboard, Expenses, Budgets, Savings Goals, Analytics, and Reminders with clear active-page styling.
- Keep the full menu visible on wider screens and provide an accessible menu button and panel on smaller screens.
- Add a dedicated Analytics page using the existing live finance data and interactive charts.
- Preserve account, guest-mode, and sign-out behavior.

## Technical details
- Use TanStack Router links and pathname state for navigation and active states.
- Reuse existing design tokens and chart components.
- Add unique metadata for the new Analytics page, then verify desktop and mobile navigation in the preview.

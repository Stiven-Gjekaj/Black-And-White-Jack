# End-to-End checklist

Manual steps:
1. Load `index.html` and confirm service worker installs (check offline reload).
2. Place various chip bets, undo with page reload to verify bankroll persistence.
3. Deal initial hand – dealer shows one face-down card.
4. Use keyboard shortcuts (H/S/D/B/X/U) to trigger actions.
5. Hit until bust and verify toast shows "Bust" and bet deducted.
6. Test stand and dealer drawing behaviour.
7. Double and split options should update bet and play additional hands.
8. Toggle mute with `M` and ensure sounds stop.
9. Resize browser or open on mobile to check responsive layout.
10. Clear cache and reload to ensure assets served from service worker when offline.

<!-- Optional Playwright script for local runs
const { test, expect } = require('@playwright/test');

test('load game', async ({ page }) => {
  await page.goto('http://localhost:8000/index.html');
  await expect(page.locator('#chip-rack')).toBeVisible();
});
-->

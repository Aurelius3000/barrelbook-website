import assert from 'node:assert/strict';

async function expectFocused(page, locator) {
  await page.waitForFunction(element => element === document.activeElement, await locator.elementHandle());
}

// Start on the dialog's initial control and prove a complete cycle in each direction.
async function checkCycle(page, dialog, first, requiredStops) {
  for (const key of ['Tab', 'Shift+Tab']) {
    const remaining = new Set(requiredStops);
    await expectFocused(page, first);
    for (let step = 0; step < 30; step++) {
      await page.keyboard.press(key);
      assert.ok(await dialog.evaluate(el => el.contains(document.activeElement)), key + ' escaped the dialog');
      for (const stop of remaining) {
        if (await stop.evaluate(el => el === document.activeElement)) remaining.delete(stop);
      }
      if (await first.evaluate(el => el === document.activeElement)) break;
    }
    assert.equal(remaining.size, 0, key + ' skipped a required keyboard stop');
    await expectFocused(page, first);
  }
}

export async function checkDialogKeyboard(page) {
  await page.getByRole('button', { name: 'Table view', exact: true }).click();
  const name = 'Blanton’s Straight from the Barrel';
  const rowOpener = page.getByRole('table').getByRole('button', { name, exact: true });
  await rowOpener.press('Enter');
  const detail = page.getByRole('dialog', { name, exact: true });
  const back = detail.getByRole('button', { name: 'Back to collection' });
  const photo = detail.getByRole('button', { name: 'View bottle photos' });
  await checkCycle(page, detail, back, [
    photo, detail.getByRole('tab', { name: 'Details' }), detail.getByRole('button', { name: 'Done' }),
  ]);

  await photo.press('Enter');
  const viewer = page.locator('.d1-viewer');
  await checkCycle(page, viewer, viewer.getByRole('button', { name: 'Close photo viewer' }), [
    viewer.getByRole('region', { name: /Bottle photo/ }), viewer.getByRole('button', { name: 'Zoom in' }),
  ]);
  await page.keyboard.press('Escape');
  await expectFocused(page, photo);
  await page.keyboard.press('Escape');
  await expectFocused(page, rowOpener);
  await page.getByRole('button', { name: 'Grid view', exact: true }).click();
}

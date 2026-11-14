import { test, expect } from "@playwright/test";

const passport = "/equipment/attachments/sp-att-grp-001/";
const ownerPhoto = "https://smashpro.app/wp-content/uploads/2026/11/20261113_152010.jpg";
for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
  test(`received grapple passport and showroom at ${viewport.width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    const response = await page.goto(passport);
    expect(response.status()).toBe(200);
    await expect(page.getByRole("heading", { name: 'LOFLIN 42" MINI ROOT GRAPPLE', exact: true })).toBeVisible();
    await expect(page.locator(".attachment-passport-hero")).toContainText("Delivered · Fitment Review Required");
    const hero = page.locator(".attachment-passport-hero__visual img");
    await expect(hero).toHaveAttribute("src", ownerPhoto);
    await expect.poll(() => hero.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
    expect(await hero.evaluate(image => getComputedStyle(image).objectFit)).toBe("contain");
    await expect.poll(() => hero.evaluate(image => image.getBoundingClientRect().width / image.getBoundingClientRect().height)).toBeCloseTo(0.75, 2);
    await hero.scrollIntoViewIfNeeded();
    await hero.screenshot({ path: testInfo.outputPath(`hero-${viewport.width}.png`) });
    await page.screenshot({ path: testInfo.outputPath(`passport-${viewport.width}.png`) });
    await expect(page.locator(".spec-grid").first()).toContainText("2459685");
    await expect(page.locator("#grapple-freight")).toContainText("390 lbs freight shipment weight");
    await expect(page.locator("#attachment-commissioning .attachment-status")).toHaveCount(9);
    await expect(page.locator("#attachment-field-test-001")).toContainText("No test performed and no results recorded");
    const timeline = page.locator("#attachment-procurement-timeline");
    await expect(timeline.locator(".is-completed")).toHaveCount(7);
    await expect(timeline.locator(".is-pending")).toHaveCount(2);
    await expect(timeline).toContainText("November 9, 2026");
    await expect(timeline).toContainText("Received by ACME Logistics");
    const videos = page.locator("#attachment-videos");
    await expect(videos.getByRole("heading", { name: "$2,297 Later... ARDHI's New Grapple Is HERE!", exact: true })).toBeVisible();
    await expect(videos.getByRole("heading", { name: "Can ARDHI Handle This Brush Pile?", exact: true })).toBeVisible();
    await expect(videos.locator("iframe, video, img")).toHaveCount(0);
    await expect(videos).toContainText("Video production pending");
    await expect(videos).toContainText("Field test pending");
    await expect(page.getByText(/Awaiting Shipment|In transit · Estes|shipment pending/i)).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    const gallery = page.locator("#attachment-receiving-gallery");
    for (const category of ["Delivery", "Equipment Overview", "Manufacturer Identification", "Mounting and Fitment"]) {
      await expect(gallery.getByRole("heading", { name: category, exact: true })).toHaveCount(1);
    }
    await expect(gallery).toContainText("not certified mounting dimensions");
    expect(await gallery.locator(".factory-photo-frame img").first().evaluate(image => getComputedStyle(image).objectFit)).toBe("contain");
    await expect(gallery.getByText("Public photograph missing", { exact: true })).toHaveCount(0);
    await expect(gallery.locator(".factory-photo-frame img")).toHaveCount(11);
    for (const image of await gallery.locator(".factory-photo-frame img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0), { timeout: 15000 }).toBe(true);
      await image.evaluate(element => element.decode());
      const filename = (await image.getAttribute("src")).split("/").pop().replace(".jpg", "");
      await image.screenshot({ path: testInfo.outputPath(`photo-${filename}-${viewport.width}.png`) });
    }
    await gallery.getByRole("button", { name: "Enlarge Manufacturer identification plate and factory pressure-test sticker" }).click();
    await expect(page.getByRole("dialog").locator("img")).toHaveAttribute("src", "https://smashpro.app/wp-content/uploads/2026/11/20261111_093751.jpg");
    await page.keyboard.press("Escape");
    await gallery.getByRole("button", { name: "Enlarge Delivery and receiving photograph" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.locator("img")).toHaveAttribute("src", "https://smashpro.app/wp-content/uploads/2026/11/20261111_092910.jpg");
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await gallery.getByRole("button", { name: "Enlarge Initial mounting and field evaluation" }).click();
    await expect(dialog.locator("img")).toHaveAttribute("src", "https://smashpro.app/wp-content/uploads/2026/11/20261113_152047.jpg");
    await expect.poll(() => dialog.locator("img").evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
    await page.keyboard.press("Escape");
    await gallery.locator("summary").click();
    const reference = gallery.locator(".attachment-manufacturer-reference img");
    await expect.poll(() => reference.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
    await expect(reference).toHaveAttribute("alt", /not the delivered serial-numbered/);
    await page.evaluate(() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
    await gallery.screenshot({ path: testInfo.outputPath(`gallery-${viewport.width}.png`) });

    await page.goto("/equipment/");
    await page.evaluate(() => sessionStorage.setItem("smashpro-featured-attachment-v1", "SP-ATT-GRP-001"));
    await page.reload();
    const showroom = page.locator("#attachments");
    await expect(showroom.locator(`a[href="${passport}"]`)).toHaveCount(1);
    await expect(showroom).toContainText("Delivered · Fitment Review Required");
    const product = showroom.locator(".attachment-feature__visual img");
    await expect(product).toHaveAttribute("src", ownerPhoto);
    await expect.poll(() => product.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
    expect(await product.evaluate(image => getComputedStyle(image).objectFit)).toBe("contain");
    await showroom.scrollIntoViewIfNeeded();
    await expect(showroom).toHaveClass(/is-revealed/);
    await expect.poll(() => showroom.evaluate(element => getComputedStyle(element).opacity)).toBe("1");
    await showroom.locator(".attachment-feature").screenshot({ path: testInfo.outputPath(`showroom-${viewport.width}.png`) });
    await showroom.getByRole("link", { name: "View attachment passport", exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${passport}$`));
    await page.goto("/equipment/");
    await page.evaluate(() => sessionStorage.setItem("smashpro-featured-attachment-v1", "SP-ATT-BKT-001"));
    await page.reload();
    const row = page.locator(`#attachments a[href="${passport}"]`);
    await expect(row).toHaveCount(1);
    await expect(row.locator("img")).toHaveAttribute("src", ownerPhoto);
    await row.scrollIntoViewIfNeeded();
    await expect.poll(() => row.locator("img").evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
    await expect(page.locator("#attachments")).toHaveClass(/is-revealed/);
    await expect.poll(() => page.locator("#attachments").evaluate(element => getComputedStyle(element).opacity)).toBe("1");
    await row.screenshot({ path: testInfo.outputPath(`showroom-row-${viewport.width}.png`) });
    expect(errors).toEqual([]);
  });
}

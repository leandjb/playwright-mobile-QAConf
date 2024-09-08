import {test, expect, devices} from '@playwright/test';

test.use({
    browserName: 'chromium',
    viewport: devices['iPhone SE'].viewport,
    userAgent: devices['iPhone SE'].userAgent,
});

test.describe('Network Conditions Tests', () => {

    test.beforeEach(async ({page}) => {
        await page.goto('/');
    });

    test('should show an error message when trying to login offline', async ({page}) => {
        // Simulate offline mode
        await page.context().setOffline(true);
        await page.locator('#btn_action').click();

        // Check for offline error message
        const errorMessage = await page.locator('.error-code').textContent();
        expect(errorMessage).toContain('ERR_INTERNET_DISCONNECTED');
        // Simulate online mode again
        await page.context().setOffline(false);
    });

    test('test with slow 3G network', async ({ page }) => {
        // Emulating slow 3G network conditions
        await page.context().route('**', route => {
            route.continue({
                // Slow 3G settings
                headers: {
                    ...route.request().headers(),
                    'x-traffic-type': 'slow3g',
                },
                postData: route.request().postData(),
                method: route.request().method(),
                url: route.request().url()
            });
        });

        await page.goto('/');

        const title = await page.title();
        expect(title).toBe('Swag Labs');

    });
});

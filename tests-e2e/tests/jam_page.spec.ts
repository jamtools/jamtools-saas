import {test, expect} from '@playwright/test';

import {JamPage} from '../support/components/jam_page_pom';

const wait = (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms));

test.describe('Jam page', () => {
    test('basic usage', async ({page}) => {
        await page.goto('/');

        await page.locator('#firstname').fill('Michael');
        await page.getByRole('button', {name: 'Submit'}).click();

        await wait(100);

        expect(page).toHaveURL('/jam');

        const jamPage = new JamPage(page);
        await jamPage.clickNewJam();
        await jamPage.clickButtons(['C', 'Dm', 'F', 'Em', 'Am', 'G']);

        await expect(jamPage.draftedChords).toHaveText('CDmFEmAmG');
    });

    test('two users', async ({browser}) => {
        const mainBrowser = await browser.newContext();
        const otherBrowser = await browser.newContext();

        const mainUser = await mainBrowser.newPage();
        const otherUser = await otherBrowser.newPage();

        await mainUser.goto('/jam');
        await otherUser.goto('/jam');

        await wait(100);

        const jamPage = new JamPage(mainUser);
        await jamPage.clickNewJam();
        await jamPage.clickButtons(['C', 'Dm', 'F', 'Em', 'Am', 'G']);

        await expect(jamPage.draftedChords).toHaveText('CDmFEmAmG');

        const jamPage2 = new JamPage(otherUser);
        await expect(jamPage2.draftedChords).toHaveText('CDmFEmAmG');

        await jamPage2.clickNewJam();
        await expect(jamPage2.draftedChords).toHaveText('');
        await expect(jamPage.draftedChords).toHaveText('');
    });
});

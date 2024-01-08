import {test, expect} from '@playwright/test';

import {JamPage} from '../support/components/jam_page_pom';

const wait = (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms));

test('test', async ({page}) => {
    await page.goto('http://localhost:5005');

    await page.locator('#firstname').fill('Michael');
    await page.getByRole('button', {name: 'Submit'}).click();

    await wait(100);

    expect(page.url()).toBe('http://localhost:5005/jam');

    const jamPage = new JamPage(page);
    await jamPage.clickButtons(['C', 'Dm', 'F', 'Em', 'Am', 'G']);

    await expect(jamPage.draftedChords).toHaveText('CDmFEmAmG');
});

export class JamPage {
    constructor(private readonly page: Page) {}

    draftedChords = this.page.locator('.drafted-chords');
    chordButtons = this.page.locator('.chord-button');

    clickButton = async (name: string) => {
        await this.page.getByRole('button', {name}).click();
        return new Promise((resolve) => setTimeout(resolve, 10));
    }

    clickButtons = async (names: string[]) => {
        for (const name of names) {
            await this.clickButton(name);
        }
    }
}

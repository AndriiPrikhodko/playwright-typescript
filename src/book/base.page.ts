import type { Page } from '@playwright/test'
import { IBasePage, selectors, locators } from '@myTypes/book'


export class BasePage implements IBasePage {
    public readonly selectors: selectors
    public locators: locators = {}
    protected readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async initialize() {
        await Promise.all(
            Object.entries(this.selectors).map(async ([key, value]) =>{
                this.locators[key] = this.page.locator(value)
            })
        )
    }
}
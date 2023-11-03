import type { Page } from '@playwright/test'
import { IBasePage } from '@myTypes/book'


export class BasePage implements IBasePage {
    public readonly selectors: IBasePage['selectors'] = {}
    public locators: IBasePage['locators'] = {}
    public transition: IBasePage['transition']
    protected readonly page: Page

    /**
     *
     * @param page
     */
    constructor(page: Page) {
        this.page = page
    }

    initialize() {
        return Promise.all(Object.entries(this.selectors).
            map(async ([key, value]) =>{
                this.locators[key] = this.page.locator(value)
            }))
    }
}
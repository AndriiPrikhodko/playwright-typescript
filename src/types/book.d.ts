import type { Locator } from '@playwright/test'

interface selectors {
    [key: string]: string
}

interface locators {
    [key: string]: Locator
}
export interface IBasePage {
    selectors: selectors;
    locators: locators;
    initialize(): Promise<void>
}
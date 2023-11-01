import { Page, FrameLocator } from 'playwright/test'
import { BasePage } from '@book/base.page'
import { IIFrameDetailsSelectors } from '../../types/book'

export default class PaymentDetails extends BasePage {
    public readonly selectors: IIFrameDetailsSelectors = {
        email: '#email',
        cardNumber: '#card_number',
        expDate: '#cc-exp',
        CVC: '#cc-csc',
        zipCode: '#billing-zip',
        payButton: '#submitButton',
        close: '.close'
    }
    private readonly iframe: FrameLocator
    private readonly iFrameSelector = 'iframe'

    constructor(page: Page) {
        super(page)
        this.iframe = page.frameLocator(this.iFrameSelector)
    }

    async initialize() {
        await Promise.all(
            Object.entries(this.selectors).map(async ([key, value]) =>{
                this.locators[key] = this.iframe.locator(value)
            })
        )
    }
}
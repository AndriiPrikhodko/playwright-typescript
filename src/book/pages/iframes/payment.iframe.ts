import { Page, FrameLocator } from 'playwright/test'
import { BasePage } from '@book/base.page'
import { IPaymentIframe } from '@myTypes/book'

export default class PaymentDetails extends BasePage implements IPaymentIframe {
    private readonly iframe: FrameLocator
    private readonly iFrameSelector = 'iframe'

    public readonly selectors = {
        email: '#email',
        cardNumber: '#card_number',
        expDate: '#cc-exp',
        CVC: '#cc-csc',
        zipCode: '#billing-zip',
        payButton: '#submitButton',
        close: '.close'
    }

    constructor(page: Page) {
        super(page)
        this.iframe = page.frameLocator(this.iFrameSelector)
    }

    async initialize() {
        return Promise.all(
            Object.entries(this.selectors).map(async ([key, value]) =>{
                this.locators[key] = this.iframe.locator(value)
            })
        )
    }
}
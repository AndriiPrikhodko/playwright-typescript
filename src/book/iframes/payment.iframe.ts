import { Page } from "playwright/test"
import { BasePage } from "@book/base.page"

export default class PaymentDetails extends BasePage {
    public readonly selectors = {
        email: '#email',
        cardNumber: '#card_number',
        expDate: '#cc-exp',
        CVC: '#cc-csc',
        zipCode: '#billing-zip',
        payButton: '#submitButton',
        close: '.close'
    }
    private readonly iframe
    constructor(page: Page) {
        super(page)
        this.iframe = page.frameLocator('iframe')
    }

    async initialize() {
        await Promise.all(
            Object.entries(this.selectors).map(async ([key, value]) =>{
                this.locators[key] = this.iframe.locator(value)
            })
        )
    }
}
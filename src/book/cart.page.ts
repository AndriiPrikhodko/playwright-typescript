import { IBasePage, ICartSelectors, locators, ICartLocators } from "../types/book"
import { BasePage } from "./base.page"
import PaymentDetails from "./iframes/payment.iframe"
import parseCartItems from "@actions/parse-cart-item"

export default class CartPage extends BasePage {
    public selectors: ICartSelectors =  {
        itemRow: "table tr",
        cell: 'td',
        total: '#total',
        paymentButton: 'button[type=submit]'
    }

    public parseCartItems:() => Promise<[string, number][]> = parseCartItems.bind(this)

    /**
     *
     * @returns promise of iframe object with initialized locators
     */
    async getPaymentDetailsIframe (): Promise<IBasePage> {
        const paymentDetails = new PaymentDetails(this.page)
        await paymentDetails.initialize()
        return paymentDetails
    }
}
import { BasePage } from "./base.page"
import PaymentDetails from "./iframes/payment.iframe"

export default class CartPage extends BasePage {
    public selectors =  {
        itemRow: "table tr",
        cell: 'td',
        total: '#total',
        paymentButton: 'button[type=submit]'
    }

    async getPaymentDetailsIframe () {
        const paymentDetails = new PaymentDetails(this.page)
        await paymentDetails.initialize()
        return paymentDetails
    }
}
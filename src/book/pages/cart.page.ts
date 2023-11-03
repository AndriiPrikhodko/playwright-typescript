import {
    ICartPage,
    IPaymentIframe,
} from '@myTypes/book'
import { BasePage } from '@book/base.page'
import PaymentDetails from '@book/pages/iframes/payment.iframe'
import parseCartItems from '@actions/parse-cart-item'
import goToConfirmed from '@actions/transitions/cart/confirmed'

export default class CartPage extends BasePage implements ICartPage {
    private paymentDetailsIFrame: IPaymentIframe
    private confirmation (): () => Promise<void> {
        this.getPaymentDetailsIframe()
        return goToConfirmed.confirmation.bind(this.paymentDetailsIFrame)
    }

    public selectors: ICartPage['selectors'] =  {
        itemRow: 'table tr',
        cell: 'td',
        total: '#total',
        paymentButton: 'button[type=submit]'
    }

    public parseCartItems: ICartPage['parseCartItems'] =
        parseCartItems.bind(this)

    async getPaymentDetailsIframe () {
        this.paymentDetailsIFrame = new PaymentDetails(this.page)
        await this.paymentDetailsIFrame.initialize()
        return this.paymentDetailsIFrame
    }

    public transition: ICartPage['transition'] = {
        'confirmation': this.confirmation(),
    }
}
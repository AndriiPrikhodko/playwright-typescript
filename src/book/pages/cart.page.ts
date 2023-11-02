import { IBasePage,
    ICartPage,
    ICartSelectors,
} from '@myTypes/book'
import { BasePage } from '@book/base.page'
import PaymentDetails from '@book/pages/iframes/payment.iframe'
import parseCartItems from '@actions/parse-cart-item'
import goToConfirmed from '@actions/transitions/cart/confirmed'

export default class CartPage extends BasePage implements ICartPage {
    public selectors: ICartSelectors =  {
        itemRow: 'table tr',
        cell: 'td',
        total: '#total',
        paymentButton: 'button[type=submit]'
    }
    private paymentDetailsIFrame: IBasePage
    public parseCartItems:() => Promise<[string, number][]> =
        parseCartItems.bind(this)

    /**
     *
     * @returns promise of iframe object with initialized locators
     */
    async getPaymentDetailsIframe (): Promise<IBasePage> {
        this.paymentDetailsIFrame = new PaymentDetails(this.page)
        await this.paymentDetailsIFrame.initialize()
        return this.paymentDetailsIFrame
    }

    private confirmation () {
        this.getPaymentDetailsIframe()
        return goToConfirmed.confirmation.bind(this.paymentDetailsIFrame)
    }

    public transition = {
        'confirmation': this.confirmation(),
    }
}
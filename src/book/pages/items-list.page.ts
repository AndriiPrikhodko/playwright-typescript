import { IItemsPage, IItemsSelectors } from '@myTypes/book'
import { BasePage } from '@book/base.page'
import cheapestItemSearchAddToCart from '@actions/find-goods'
import goToCart from '@actions/transitions/item-list/cart'

export default class ItemListPage extends BasePage implements IItemsPage {
    private cart = goToCart.cart.bind(this)

    public selectors: IItemsSelectors =  {
        title: 'h2',
        cartButton: '#cart',
        items: '.container .text-center',
        itemsName: 'p.font-weight-bold',
        itemsAddToCart: 'button',
        itemsPrice: '//p[not(@class)]'
    }

    public cheapestItemSearchAddToCart:
        IItemsPage['cheapestItemSearchAddToCart'] =
            cheapestItemSearchAddToCart.bind(this)

    public transition: IItemsPage['transition'] = {
        'cart': this.cart,
    }
}
import { Iitem } from '@myTypes/actions'
import { IItemsPage, IItemsSelectors } from '@myTypes/book'
import { BasePage } from '@book/base.page'
import cheapestItemSearchAddToCart from '@actions/find-goods'
import goToCart from '@actions/transitions/item-list/cart'

export default class ItemListPage extends BasePage implements IItemsPage {
    public selectors: IItemsSelectors =  {
        title: 'h2',
        cartButton: '#cart',
        items: '.container .text-center',
        itemsName: 'p.font-weight-bold',
        itemsAddToCart: 'button',
        itemsPrice: '//p[not(@class)]'
    }

    public cheapestItemSearchAddToCart:(searchTerm: string) => Promise<Iitem> =
        cheapestItemSearchAddToCart.bind(this)

    private cart = goToCart.cart.bind(this)

    public transition = {
        'cart': this.cart,
    }
}
import { Iitem } from "@myTypes/actions"
import { IItemsSelectors } from "@myTypes/book"
import { BasePage } from "./base.page"
import cheapestItemSearchAddToCart from '@actions/find-goods'

export default class ItemListPage extends BasePage {
    public selectors: IItemsSelectors =  {
        title: 'h2',
        cart: '#cart',
        items: '.container .text-center',
        itemsName: `p.font-weight-bold`,
        itemsAddToCart: `button`,
        itemsPrice: `//p[not(@class)]`
    }

    public cheapestItemSearchAddToCart:(searchTerm: string) => Promise<Iitem> = 
        cheapestItemSearchAddToCart.bind(this)
}
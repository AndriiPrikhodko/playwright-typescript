import { BasePage } from "./base.page"

export default class ItemListPage extends BasePage {
    public selectors =  {
        title: 'h2',
        cart: '#cart',
        items: '.container .text-center',
        itemsName: `p.font-weight-bold`,
        itemsAddToCart: `button`,
        itemsPrice: `//p[not(@class)]`
    }
}
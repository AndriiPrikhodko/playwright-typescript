import { IHomeSelectors } from '@myTypes/book'
import { BasePage } from '@book/base.page'

export default class HomePage extends BasePage {
    public selectors: IHomeSelectors =  {
        title: 'h2',
        temperatureBar: '#temperature',
        moisturizerButton: 'a[href="/moisturizer"]',
        sunscreenButton: 'a[href="/sunscreen"]'
    }
}
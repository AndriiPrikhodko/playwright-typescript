import { IHomeSelectors, IHomePage } from '@myTypes/book'
import { BasePage,  } from '@book/base.page'
import goToItems from '@actions/transitions/home/go-to-items'

export default class HomePage extends BasePage implements IHomePage {
    public selectors: IHomeSelectors =  {
        title: 'h2',
        temperatureBar: '#temperature',
        moisturizerButton: 'a[href="/moisturizer"]',
        sunscreenButton: 'a[href="/sunscreen"]'
    }

    private moisturizer = goToItems.moisturizer.bind(this)
    private sunscreens = goToItems.sunscreens.bind(this)

    public transition = {
        'moisturizer': this.moisturizer,
        'sunscreens': this.sunscreens
    }
}
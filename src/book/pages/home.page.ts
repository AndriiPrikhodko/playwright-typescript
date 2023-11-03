import { IHomePage } from '@myTypes/book'
import { BasePage,  } from '@book/base.page'
import goToItems from '@actions/transitions/home/go-to-items'

export default class HomePage extends BasePage implements IHomePage {
    private moisturizer = goToItems.moisturizer.bind(this)
    private sunscreens = goToItems.sunscreens.bind(this)

    public selectors: IHomePage['selectors'] =  {
        title: 'h2',
        temperatureBar: '#temperature',
        moisturizerButton: 'a[href="/moisturizer"]',
        sunscreenButton: 'a[href="/sunscreen"]'
    }

    public transition: IHomePage['transition'] = {
        'moisturizer': this.moisturizer,
        'sunscreens': this.sunscreens
    }
}
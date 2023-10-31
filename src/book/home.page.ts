import { BasePage } from "./base.page"

export default class HomePage extends BasePage {
    public selectors =  {
        title: 'h2',
        temperatureBar: '#temperature',
        moisturizerButton: 'a[href="/moisturizer"]',
        sunscreenButton: 'a[href="/sunscreen"]'
    }
}
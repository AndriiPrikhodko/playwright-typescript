import { BasePage } from "./base.page"

export default class SuccessPage extends BasePage {
    public selectors =  {
        title: 'h2',
        message: 'p.text-justify'
    }
}
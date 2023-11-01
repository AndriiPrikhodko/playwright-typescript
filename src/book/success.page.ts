import { IConfirmSelectors } from "../types/book"
import { BasePage } from "./base.page"

export default class SuccessPage extends BasePage {
    public selectors: IConfirmSelectors =  {
        title: 'h2',
        message: 'p.text-justify'
    }
}
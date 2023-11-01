import { IConfirmSelectors } from '@myTypes/book'
import { BasePage } from '@book/base.page'

export default class SuccessPage extends BasePage {
    public selectors: IConfirmSelectors =  {
        title: 'h2',
        message: 'p.text-justify'
    }
}
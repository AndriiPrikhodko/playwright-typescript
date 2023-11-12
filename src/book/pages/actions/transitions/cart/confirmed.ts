import { locators } from '@myTypes/book'

async function goToConfirmation() {
    const locators: locators = this.locators
    await locators.payButton.click()
}

export default {
    confirmation: goToConfirmation
}
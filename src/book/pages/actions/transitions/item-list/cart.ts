import { locators } from '@myTypes/book'

async function goToCart() {
    const locators: locators = this.locators
    await locators.cartButton.click()
}

export default {
    cart: goToCart
}
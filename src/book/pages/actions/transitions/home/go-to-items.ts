import { locators } from '@myTypes/book'

async function goToMoisturizer() {
    const locators: locators = this.locators
    await locators.moisturizerButton.click()
}

async function goToSunscreens() {
    const locators: locators = this.locators
    await locators.sunscreenButton.click()
}

export default {
    moisturizer: goToMoisturizer,
    sunscreens: goToSunscreens
}
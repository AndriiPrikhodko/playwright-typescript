import { test, expect } from '@playwright/test'
import  {
    HomePage, 
    ItemListPage, 
    CartPage
} from '@book/book.facade'
import router from '@book/router'
import { fetchNumFromString } from '@utils/text-processor'

import * as data from '@test-data/generated/payment-details.ts.json'

const paymentDetails = data.default.default
const temperatureUpperBound = 19

/**
 * Given customer on https://weathershopper.pythonanywhere.com/
 * When checks the temperature and it is below 19 degrees
 * Then shops for moisturizers
 * And proceeds to cart
 * And pays for goods
 * And sees the successful purchase page
 */
test('assert customer shop moisturizers', async ({ page }) => {
    await page.goto(router.home)
    await page.waitForURL(router.home)

    const homePage = new HomePage(page)
    await homePage.initialize()

    await homePage.locators.temperatureBar.waitFor()

    const temperatureReading = await homePage.
        locators.temperatureBar.allInnerTexts()

    const [temperatureReadingNumber] = fetchNumFromString(temperatureReading)
    expect(temperatureReadingNumber).toBeLessThan(temperatureUpperBound)

    // transitioning to moisturizer page
    await homePage.
        locators.moisturizerButton.click()
    await page.waitForURL(router.moisturizer)

    const itemsPage = new ItemListPage(page)
    await itemsPage.initialize()

    const [almond, aloe] = await Promise.all(['almond', 'aloe'].map(itemName =>
        itemsPage.cheapestItemSearchAddToCart(itemName)))

    await almond.addToCart.click()

    await aloe.addToCart.click()

    // transitioning to cart page
    await itemsPage.locators.cart.click()
    await page.waitForURL(router.cart)

    const cartPage = new CartPage(page)
    await cartPage.initialize()

    // check that cart contains two items + 1 for description
    expect(await cartPage.locators.itemRow.count()).toEqual(3)

    const [cartDataAlmond, cartDataAloe] = await cartPage.parseCartItems()
    const [cartAlmondName, cartAlmondPrice] = cartDataAlmond
    const [cartAloeName, cartAloePrice] = cartDataAloe

    expect(cartAlmondName.trim()).toEqual(almond.name)
    expect(cartAlmondPrice).toEqual(almond.price)
    expect(cartAloeName.trim()).toEqual(aloe.name)
    expect(cartAloePrice).toEqual(aloe.price)

    const total = almond.price + aloe.price
    const totalTxt = await cartPage.locators.total.allInnerTexts()
    const [totalNumber] = fetchNumFromString(totalTxt)

    expect(totalNumber).toEqual(total)

    await cartPage.locators.paymentButton.click()

    // initializing payment iframe
    const paymentIframe = await cartPage.getPaymentDetailsIframe()

    // filling up payment details
    await paymentIframe.locators.email.fill(paymentDetails.email)
    await paymentIframe.locators.cardNumber.
        fill(paymentDetails.creditCardNumber)
    await paymentIframe.locators.expDate.
        fill(paymentDetails.experationDate)
    await paymentIframe.locators.CVC.fill(paymentDetails.CVC)

    // this could be a bug should be clarified with PO
    const isZipCodePresent = await paymentIframe.locators.zipCode.
        isVisible()

    // eslint-disable-next-line playwright/no-conditional-in-test
    if (isZipCodePresent) await paymentIframe.locators.zipCode
        .fill(paymentDetails.zipCode)

    await paymentIframe.locators.payButton.click()
    await page.waitForURL(router.confirmation)
})
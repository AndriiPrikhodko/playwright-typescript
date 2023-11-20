import { test, expect } from '@playwright/test'
import StateMachine from '@book/transitions/stateMachine'
import { fetchNumFromString } from '@utils/text-processor'
import {default as testData} 
    from '@test-data/generated/payment-details.ts.json'
import { ICartPage, IHomePage, IItemsPage } from '@myTypes/book'

const temperatureUpperBound = 19
const {default: paymentDetails} = testData
/**
 * Given customer on https://weathershopper.pythonanywhere.com/
 * When checks the temperature and it is below 19 degrees
 * Then shops for moisturizers
 * And proceeds to cart
 * And pays for goods
 * And sees the successful purchase page
 */
test('assert customer shop moisturizers', async ({ page }) => {
    const stateMachine = new StateMachine(page)
    const homePage = await stateMachine.initialize('home') as IHomePage
    await expect(page.url()).toEqual(stateMachine.getCurrentState())
    await homePage.initialize()

    const temperatureReading = await homePage.
        locators.temperatureBar.allInnerTexts()

    const [temperatureReadingNumber] = fetchNumFromString(temperatureReading)
    expect(temperatureReadingNumber).toBeLessThan(temperatureUpperBound)

    const moisturizerPage = await stateMachine.
        transition('home', 'moisturizer') as IItemsPage
    await expect(page.url()).toEqual(stateMachine.getCurrentState())
    await moisturizerPage.initialize()

    const [almond, aloe] = await Promise.all(['almond', 'aloe'].map(itemName =>
        moisturizerPage.cheapestItemSearchAddToCart(itemName)))

    await almond.addToCart.click()

    await aloe.addToCart.click()

    const cartPage = await stateMachine.
        transition('moisturizer', 'cart') as ICartPage
    await expect(page.url()).toEqual(stateMachine.getCurrentState())
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
        fill(paymentDetails.expirationDate)
    await paymentIframe.locators.CVC.fill(paymentDetails.CVC)

    // this could be a bug should be clarified with PO
    const isZipCodePresent = await paymentIframe.locators.zipCode.
        isVisible()

    // eslint-disable-next-line playwright/no-conditional-in-test
    if (isZipCodePresent) await paymentIframe.locators.zipCode
        .fill(paymentDetails.zipCode)

    await stateMachine.transition('cart', 'confirmation')
    await expect(page.url()).toEqual(stateMachine.getCurrentState())
})
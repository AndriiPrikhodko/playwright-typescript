import { test, expect } from '@playwright/test'
import  StateMachine from '@book/transitions/stateMachine'
import router from '@book/transitions/router'
import { fetchNumFromString } from '@utils/text-processor'
import * as data from '@test-data/generated/payment-details.ts.json'
import { 
    IHomePage,
    IItemsPage,
    ICartPage
 } from '@myTypes/book'

const paymentDetails = data.default.default
const temperatureLowerBound = 34
type sunscreen = ['SPF-50', 'SPF-30']

/**
 * Given customer on https://weathershopper.pythonanywhere.com/
 * When checks the temperature and it is above 34 degrees
 * Then shops for sunscreens
 * And proceeds to cart
 * And pays for goods
 * And sees the successful purchase page
 */
test('assert customer shoping sunscreens', async ({ page }) => {
    const stateMachine = new StateMachine(page)
    const homePage = await stateMachine.initialize('home') as IHomePage
    await homePage.initialize()

    const temperatureReading = await homePage.
        locators.temperatureBar.allInnerTexts()

    const [temperatureReadingNumber] = fetchNumFromString(temperatureReading)
    expect(temperatureReadingNumber).toBeGreaterThan(temperatureLowerBound)

    // transitioning to sunscreen page
    const sunscreenPage = await stateMachine.
        transition('home', 'sunscreens') as IItemsPage
    await expect(page.url()).toEqual(stateMachine.getCurrentState())
    await sunscreenPage.initialize()

    const [SPF50, SPF30] = await Promise.all((['SPF-50', 'SPF-30'] as sunscreen).
        map(itemName => sunscreenPage.cheapestItemSearchAddToCart(itemName)))

    await SPF50.addToCart.click()

    await SPF30.addToCart.click()

    // transitioning to cart page
    const cartPage = await stateMachine.
        transition('sunscreens', 'cart') as ICartPage
    await expect(page.url()).toEqual(stateMachine.getCurrentState())
    await cartPage.initialize()

    // check that cart contains two items + 1 for description
    expect(await cartPage.locators.itemRow.count()).toEqual(3)

    const [cartDataSPF50, cartDataSPF30] = await cartPage.parseCartItems()
    const [cartSPF50dName, cartSPF50Price] = cartDataSPF50
    const [cartSPF30Name, cartSPF30Price] = cartDataSPF30

    expect(cartSPF50dName.trim()).toEqual(SPF50.name)
    expect(cartSPF50Price).toEqual(SPF50.price)
    expect(cartSPF30Name.trim()).toEqual(SPF30.name)
    expect(cartSPF30Price).toEqual(SPF30.price)

    const total = SPF50.price + SPF30.price
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
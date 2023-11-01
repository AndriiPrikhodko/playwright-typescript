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
const temperatureLowerBound = 34

/**
 * Given customer on https://weathershopper.pythonanywhere.com/
 * When checks the temperature and it is above 34 degrees
 * Then shops for sunscreens
 * And proceeds to cart
 * And pays for goods
 * And sees the successful purchase page
 */
test('assert customer shop sunscreens', async ({ page }) => {
    await page.goto(router.home)
    await page.waitForURL(router.home)

    const homePage = new HomePage(page)
    await homePage.initialize()

    await homePage.locators.temperatureBar.waitFor()

    const temperatureReading = await homePage.
        locators.temperatureBar.allInnerTexts()

    const [temperatureReadingNumber] = fetchNumFromString(temperatureReading)
    expect(temperatureReadingNumber).toBeGreaterThan(temperatureLowerBound)

    // transitioning to sunscreen page
    await homePage.
        locators.sunscreenButton.click()
    await page.waitForURL(router.sunscreens)

    const itemsPage = new ItemListPage(page)
    await itemsPage.initialize()

    const [SPF50, SPF30] = await Promise.all(['SPF-50', 'SPF-30'].
        map(itemName => itemsPage.cheapestItemSearchAddToCart(itemName)))

    await SPF50.addToCart.click()

    await SPF30.addToCart.click()

    // transitioning to cart page
    await itemsPage.locators.cart.click()
    await page.waitForURL(router.cart)

    const cartPage = new CartPage(page)
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
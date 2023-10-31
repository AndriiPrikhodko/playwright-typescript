import { test, expect } from '@playwright/test'
import cheapestItemSearchAddToCart from '@actions/find-goods'
import ItemListPage from '@book/items-list.page'
import CartPage from "@book/cart.page"
import { IgetItem } from '@myTypes/actions'
import router from '@book/router'
import { fetchNumFromString } from '@utils/text-processor'
import HomePage from '@book/home.page'
import * as data from '@test-data/generated/payment-details.ts.json'

const paymentDetails = data.default.default
/**
 * Given customer on https://weathershopper.pythonanywhere.com/
 * When checks the temperature and it is below 19 degrees
 * Then Shop for moisturizers
 * And proceed to cart
 * And pays for goods
 * And see the successful purchase page
 */

const temperatureUpperBound = 19

test('assert customer shop moisturizers', async ({ page }) => {
    const addToCartByName: IgetItem = cheapestItemSearchAddToCart.bind(page)
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
        addToCartByName(itemName)))

    await almond.addToCart.click()

    await aloe.addToCart.click()

    // transitioning to cart page
    await itemsPage.locators.cart.click()
    await page.waitForURL(router.cart)

    const cartPage = new CartPage(page)
    await cartPage.initialize()

    // check that cart contains two items + 1 for description
    expect(await cartPage.locators.itemRow.count()).toEqual(3)

    const firstItem = cartPage.locators.itemRow.nth(1)
        .locator(cartPage.selectors.cell)

    const secondItem = cartPage.locators.itemRow
        .nth(2).locator(cartPage.selectors.cell)

    const [cartName1, cartPrice1] = await firstItem.allTextContents()
    const [cartName2, cartPrice2] = await secondItem.allTextContents()
    const [cartPrice1Number] = fetchNumFromString([cartPrice1])
    const [cartPrice2Number] = fetchNumFromString([cartPrice2])

    expect(cartName1.trim()).toEqual(almond.name)
    expect(cartPrice1Number).toEqual(almond.price)
    expect(cartName2.trim()).toEqual(aloe.name)
    expect(cartPrice2Number).toEqual(aloe.price)

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
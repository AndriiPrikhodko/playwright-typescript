import { Locator } from '@playwright/test'
import { selectors, locators } from '@myTypes/book'
import { fetchNumFromString } from '../utilities/text-processor'

/**
 * 
 * @returns promise of array of cart item name and price
 */
async function parseCartItems(): Promise<(string[] | number[])[]> {
    const locators: locators = this.locators
    const selectors: selectors = this.selectors
    const itemLocators: Locator [] = []
    const contentPricesInNum = []

    const count: number = await locators.itemRow.count()

    for (let i = 1; i < count; i++) {
        itemLocators[i - 1] = locators.itemRow.nth(i).locator(selectors.cell)
    }
    const contentByRCells  = await Promise.all(
        itemLocators.map(
            item => item.allTextContents()
        )
    )

    for(let i = 0; i < contentByRCells.length; i ++ ) {
        const [price] = fetchNumFromString([contentByRCells[i][1]])
        contentPricesInNum[i] = [contentByRCells[i][0], price]
    }
    return contentPricesInNum
}

export default parseCartItems
import { Locator } from '@playwright/test'
import { ICartSelectors, ICartLocators } from '@myTypes/book'
import { fetchNumFromString } from '../../../utilities/text-processor'

/**
 *
 * @returns promise of array of cart item name and price
 */
async function parseCartItems(): Promise<[string, number][]> {
    const locators: ICartLocators = this.locators
    const selectors: ICartSelectors = this.selectors
    const itemLocators: Locator [] = []
    const contentPricesInNum:[string, number][]= []

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
        // prices are stored in the second element of the embedded array
        const [price] = fetchNumFromString([contentByRCells[i][1]])

        contentPricesInNum[i] = [contentByRCells[i][0], price]
    }
    return contentPricesInNum
}

export default parseCartItems
import { type Page} from '@playwright/test'
import { fetchNumFromString } from '@utils/text-processor'
import { Iitem } from '@myTypes/actions'
import { IItemsPage } from '@myTypes/book'


/**
 *
 * @param numArr
 * @returns index of minimal element
 */
const minIndex = (numArr: number[]): number => numArr.
    reduce((minIndex, currentValue, currentIndex, array) => {
        return currentValue < array[minIndex] ? currentIndex : minIndex
    }, 0)

/**
 *
 * @param searchTerm
 * @param selector
 * @returns object cheapest searched item name, price, locator
 */
async function cheapestItemSearchAddToCart(
    searchTerm: string,
): Promise<Iitem>
{
    const selectors: IItemsPage['selectors'] = this.selectors
    const page = this.page as Page

    // get all items that contain searched term
    const items = page.locator(selectors.items, {hasText: searchTerm})

    // wait until at least first item is visible
    await items.first().waitFor()

    // fetch price fields from found items
    const prices = await items.locator(selectors.itemsPrice)
        .evaluateAll(
            items => items.map(element => element.textContent)
        )

    const priceNumbers = fetchNumFromString(prices)

    const minElement = minIndex(priceNumbers)

    const cheapestName = await items.nth(minElement).
        locator(selectors.itemsName).
        evaluate(itemName => itemName.textContent?.trim())

    return {
        name: cheapestName,
        price:  priceNumbers[minElement],
        addToCart: items.nth(minElement).
            locator(selectors.itemsAddToCart)
    }
}

export default cheapestItemSearchAddToCart
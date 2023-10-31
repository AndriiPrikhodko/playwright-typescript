import * as R from 'ramda'

const rNumber = /\d+/g

/**
 *
 * @param stringArray
 * @returns array of numbers fetched from strings
 */
export const fetchNumFromString = (stringArray: string[]): number [] => {
    const strNumArr = R.flatten(stringArray.
        map(price => price.match(rNumber))
    )
    const numArr = strNumArr.map(Number)
    return numArr
}

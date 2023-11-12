import * as R from 'ramda'

const rNumber = /\d+/g

/**
 *
 * @param
 * @returns array of numbers
 *
 * ***Usage***
 *
 * Parsing numbers from the string array
 *
 * @example
 *  ```ts
 * const numbers = fetchNumFromString(['something 1','*2','Percent .3'])
 * ```
 *
 * numbers = [1,2,3]
 */
export const fetchNumFromString = (stringArray: string[]): number [] => {
    const strNumArr = R.flatten(stringArray.
        map(price => price.match(rNumber))
    )
    const numArr = strNumArr.map(Number)
    return numArr
}

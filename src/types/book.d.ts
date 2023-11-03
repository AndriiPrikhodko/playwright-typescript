import type { Locator } from '@playwright/test'
import { Iitem } from './actions'

type State = 'home' | 'moisturizer' | 'sunscreens' | 'cart' | 'confirmation';

interface selectors {
    [key: string]: string
}

interface locators {
    [key: string]: Locator
}

export interface IBasePage {
    selectors: selectors;
    locators: locators;
    transition: {
        [key in State]?: () => Promise<void>
    }

    /**
     * initialize locators based on page's selectors
     */
    initialize(): Promise<void[]>
}

interface ICartSelectors extends selectors {
    itemRow: string,
    cell: string,
    total: string,
    paymentButton: string
}

interface IItemsSelectors extends selectors {
    title: string,
    cartButton: string,
    items: string,
    itemsName: string,
    itemsAddToCart: string,
    itemsPrice: string
}

interface IIFrameDetailsSelectors extends selectors {
    email: string,
    cardNumber: string,
    expDate: string,
    CVC: string,
    zipCode: string,
    payButton: string,
    close: string
}

interface IRouter {
    home: string,
    moisturizer: string,
    sunscreens: string,
    cart: string,
    confirmation: string
}

interface IConfirmSelectors extends selectors {
    title: string,
    message: string
}

type ICartLocators = {
    [K in keyof ICartSelectors]: Locator
  }

interface ICartPage extends IBasePage {
    selectors: {
        itemRow: string,
        cell: string,
        total: string,
        paymentButton: string
    }
    transition: {
        [key in State & 'confirmation']:
            () => Promise<void>
    }

    /**
     *
     * @returns promise of iframe as page with locators for
     *
     * ***IFrame locators***
     *
     * `email`, `cardNumber`, `expDate`, `CVC`, `zipCode`, `close`
     */
    getPaymentDetailsIframe(): Promise<IBasePage>

    /**
     *
     * @returns promise of array of cart items with name and price
     */
    parseCartItems:() => Promise<[string, number][]>
  }

  interface IHomePage extends IBasePage {
    selectors: {
        title: string,
        temperatureBar: string,
        moisturizerButton: string,
        sunscreenButton: string
    }

    transition: {
        [key in ('moisturizer' | 'sunscreens') & State]:
            () => Promise<void>
    }
  }

  interface IItemsPage extends IBasePage {
    selectors: IItemsSelectors
    /**
     * @key must be called as target state
     * @value async action required for transition
     */
    transition: {
        [key in 'cart' & State]:
            () => Promise<void>
    }

    /**
     *
     * @param searchTerm partial or full commodity name
     * @returns object {`name`,`price`,`locator`}
     */
    cheapestItemSearchAddToCart:(searchTerm: string) => Promise<Iitem>
  }

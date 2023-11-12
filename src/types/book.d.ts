import type { Locator } from '@playwright/test'
import { Iitem } from './actions'

type State = 'home' | 'moisturizer' | 'sunscreens' | 'cart' | 'confirmation';

interface selectors {
    [key: string]: string
}
type locators = Record<string, Locator>

export interface IBasePage {
    selectors: selectors;
    locators: locators
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

    locators: locators | {
        [key in keyof ICartPage['selectors']]: Locator
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
    getPaymentDetailsIframe(): Promise<IPaymentIframe>

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

    locators: locators | {
        [key in keyof IHomePage['selectors']]: Locator
    }

    transition: {
        [key in ('moisturizer' | 'sunscreens') & State]:
            () => Promise<void>
    }
  }

  interface IItemsPage extends IBasePage {
    selectors: {
        title: string,
        cartButton: string,
        items: string,
        itemsName: string,
        itemsAddToCart: string,
        itemsPrice: string
    }

    locators: locators | {
        [key in keyof IItemsPage['selectors']]: Locator
    }
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

  interface IPaymentIframe {
    selectors: {
        email: string,
        cardNumber: string,
        expDate: string,
        CVC: string,
        zipCode: string,
        payButton: string,
        close: string
    }

    locators: locators | {
            [key in keyof IPaymentIframe['selectors']]: Locator
        }


    initialize: () => Promise<void[]>
  }

import type { Locator } from '@playwright/test'
import { Iitem } from './actions'

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
        [key: string]: () => Promise<void>
    }
    initialize(): Promise<void[]>
}

interface ICartSelectors extends selectors {
    itemRow: string,
    cell: string,
    total: string,
    paymentButton: string
}

interface IHomeSelectors extends selectors {
    title: string,
    temperatureBar: string,
    moisturizerButton: string,
    sunscreenButton: string
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

interface IRouter extends selectors {
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
    selectors: ICartSelectors
    transition: {
        [key: string]: () => Promise<void>
    }
    getPaymentDetailsIframe(): Promise<IBasePage>
    parseCartItems:() => Promise<[string, number][]>
  }

  interface IHomePage extends IBasePage {
    selectors: IHomeSelectors
    transition: {
        [key: string]: () => Promise<void>
    }
  }

  interface IItemsPage extends IBasePage {
    selectors: IItemsSelectors
    transition: {
        [key: string]: () => Promise<void>
    }
    cheapestItemSearchAddToCart:(searchTerm: string) => Promise<Iitem>
  }

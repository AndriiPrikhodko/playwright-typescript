import type { Locator } from '@playwright/test'

interface selectors {
    [key: string]: string
}

interface locators {
    [key: string]: Locator
}

export interface IBasePage {
    selectors: selectors;
    locators: locators;
    initialize(): Promise<void>
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
    cart: string,
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
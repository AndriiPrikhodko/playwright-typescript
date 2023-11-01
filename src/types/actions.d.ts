import { Locator } from 'playwright/test'

export interface Iitem {
    name: string
    price: number
    addToCart: Locator
}

export interface IgetItem {
    (searchTerm : string): Promise<Iitem>
}
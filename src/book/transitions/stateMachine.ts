import { Page } from 'playwright/test'
import * as pages from '../book.facade'
import router from './router'
import { IHomePage, ICartPage, IItemsPage, IBasePage } from '@myTypes/book'

type State = 'home' | 'moisturizer' | 'sunscreens' | 'cart' | 'confirmation';
type currentState = string | undefined
type statePages = IHomePage | ICartPage | IItemsPage | IBasePage

interface IStates {
    home: typeof pages.HomePage,
    moisturizer: typeof pages.ItemListPage,
    sunscreens: typeof pages.ItemListPage,
    cart: typeof pages.CartPage,
    confirmation: typeof pages.confirmationPage
}

export default class StateMachine {
    public states: IStates = {
        home: pages.HomePage,
        moisturizer: pages.ItemListPage,
        sunscreens: pages.ItemListPage,
        cart: pages.CartPage,
        confirmation: pages.confirmationPage
    }

    private validTransitions = {
        home: ['moisturizer', 'sunscreens'],
        moisturizer: ['cart'],
        sunscreens: ['cart'],
        cart: ['confirmation'],
        confirmation: [],
    }

    private currentState: currentState = undefined
    protected readonly page: Page
    private routes = router
    private currentPage: statePages

    constructor(page: Page) {
        this.page = page
        return this
    }

    /**
     *
     * @param from state
     * @param to state
     * @returns true if transition is valid
     */
    private validateTransition(from: State, to: State): boolean {
        if (this.validTransitions[from].includes(to) &&
            this.currentState === this.routes[from]) {
            return true
        } else {
            throw new Error(`Invalid transition from ${from} to ${to}`)
        }
    }

    public getCurrentState () {
        return this.currentState
    }

    /**
     *
     * @param state accepts initial test state url
     * @returns current url
     */
    async initialize(state: string) {
        if(this.currentState === undefined &&
            Object(this.routes).hasOwnProperty(state)) {
            await this.page.goto(this.routes[state])
            this.currentState = this.page.url()
            this.currentPage = new this.states[state](this.page)
            return this.currentPage
        }
        else {
            if(this.currentState) {
                throw new Error('stateMachine has been already initialized')
            }
            throw new Error(`Property '${state}' does not exist on this.routes`)
        }
    }

    public async transition(from: State, to: State) {
        if(this.validateTransition(from, to)) {
            // LSP transition method invoked on different classes
            await this.currentPage.transition[to]()
            await this.page.waitForLoadState('domcontentloaded')
            this.currentState = this.page.url()
            this.currentPage = new this.states[to](this.page)
            return this.currentPage
        }
    }
}

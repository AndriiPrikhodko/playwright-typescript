import { Page } from 'playwright/test'
import * as pages from '../book.facade'
import router from './router'
import { IHomePage, ICartPage, IItemsPage, IBasePage, State }
    from '@myTypes/book'
import * as transitionDiagram from './valid-transition.diagram.json'

type statePages = IHomePage | ICartPage | IItemsPage | IBasePage

interface IStateMachine {
    states: {
        home: typeof pages.HomePage,
        moisturizer: typeof pages.ItemListPage,
        sunscreens: typeof pages.ItemListPage,
        cart: typeof pages.CartPage,
        confirmation: typeof pages.confirmationPage
    }

    /**
     *
     * @returns current state
     */
    getCurrentState: () => string

    /**
     *
     * @param state accepts initial test state url
     * @returns init state page
     */
    initialize:(state: string) => Promise<statePages>

    /**
     *
     * @param from current state
     * @param to target state
     * @returns target state page
     *
     * ***Usage***
     * ```ts
     * stateMachine.transition('a', 'b')
     * ```
     * validate that it is a valid transition for a defined state machine
     * and performs the transition
     */
    transition:(from: State, to: State) => Promise<statePages>
}

export default class StateMachine implements IStateMachine {
    private currentState: string | undefined = undefined
    private readonly routes = router
    private currentPage: statePages
    private validTransitions = transitionDiagram.default

    protected readonly page: Page

    public states: IStateMachine['states'] = {
        home: pages.HomePage,
        moisturizer: pages.ItemListPage,
        sunscreens: pages.ItemListPage,
        cart: pages.CartPage,
        confirmation: pages.confirmationPage
    }

    constructor(page: Page) {
        this.page = page
        return this
    }

    /**
     *
     * @param from state
     * @param to state
     * @returns true if transition is valid and error otherwise
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

    async initialize(state: string): Promise<statePages> {
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

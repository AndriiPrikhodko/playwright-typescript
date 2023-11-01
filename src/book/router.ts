import { IRouter } from "../types/book"

const baseUrl = 'https://weathershopper.pythonanywhere.com'

const routs: IRouter = {
    home: `${baseUrl}`,
    moisturizer: `${baseUrl}/moisturizer`,
    sunscreens: `${baseUrl}/sunscreen`,
    cart: `${baseUrl}/cart`,
    confirmation: `${baseUrl}/confirmation`
}

export default routs
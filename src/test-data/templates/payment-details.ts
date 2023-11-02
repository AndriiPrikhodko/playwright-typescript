import { faker } from '@faker-js/faker'
import * as moment from 'moment'

const userPayment = {
    cardIssuer: faker.finance.creditCardIssuer(),
    email: faker.internet.email(),
    creditCardNumber: faker.finance.creditCardNumber(),
    expirationDate: (moment(faker.date.
        between({from: 'now', to: '2030-01-01T00:00:00.000Z'}))).
        format('MMYY'),
    CVC: faker.finance.creditCardCVV(),
    zipCode: faker.location.zipCode(),
}

export default userPayment
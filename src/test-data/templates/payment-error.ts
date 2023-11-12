import { faker } from '@faker-js/faker'
import * as moment from 'moment'

const userPaymentCorrupted = {
    randomString: `${faker.string.sample({ min: 10, max: 15 })}`,
    wrongCardNumber: faker.finance.
        creditCardNumber({ issuer: '63[7-9]#-####-####-###L' }),
    oldExpirationDate: (moment(faker.date.
        past({ years: 5 }))).
        format('MMYY'),
    CVC: faker.number.int({ max: 99 }),
}

export default userPaymentCorrupted
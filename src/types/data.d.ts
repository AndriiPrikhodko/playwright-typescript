export type IDataPaymentValid =
    Record<'cardIssuer' | 'email' | 'creditCardNumber'|
     'expirationDate' | 'CVC' | 'zipCode', string>
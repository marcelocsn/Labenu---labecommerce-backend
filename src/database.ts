import { TUser, TProduct, TPurchase } from "./types"

export const users: TUser[] = [
    {
        id: '01',
        email: 'fulano@gmail.com',
        password: '12345',
    },
    {
        id: '02',
        email: 'fulana@gmail.com',
        password: '123456',
    }
]

export const products: TProduct[] = [
    {
        id: '031',
        name: 'arroz',
        price: 10,
        category: 'comida'
    },
    {
        id: '042',
        name: 'feijao',
        price: 15,
        category: 'comida'
    }
]

export const purchases: TPurchase[] = [
    {
        userId: '01',
        productId: '031',
        quantity: 3,
        totalPrice: 30
    },
    {
        userId: '02',
        productId: '042',
        quantity: 2,
        totalPrice: 30
    }
]
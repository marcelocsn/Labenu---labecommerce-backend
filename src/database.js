"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchases = exports.products = exports.users = void 0;
exports.users = [
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
];
exports.products = [
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
];
exports.purchases = [
    {
        userId: '01',
        productId: '031',
        quantity: 3,
        totalPrice: 30
    },
    {
        userId: '02',
        productId: '043',
        quantity: 2,
        totalPrice: 30
    }
];

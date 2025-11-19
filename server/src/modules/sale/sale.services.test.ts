import mongoose from 'mongoose';
import Sale from './sale.model';
import Product from '../product/product.model';
import saleServices from './sale.services';
import eventPublisher from '../event-bus/eventPublisher';

describe('SaleServices', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(eventPublisher, 'createSale');
    });

    it('should create sale and decrease product stock', async () => {
        const mockProduct = { _id: 'prod1', stock: 5 };
        const mockSale = { _id: 'sale1' };

        jest.spyOn(Product, 'findById').mockResolvedValue(mockProduct);
        jest.spyOn(Product, 'findByIdAndUpdate').mockResolvedValue(mockProduct);
        jest.spyOn(Sale, 'create').mockResolvedValue([mockSale]);
        jest.spyOn(mongoose, 'startSession').mockImplementation(() => ({
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        }));

        const payload = {
            product: 'prod1',
            productPrice: 10,
            quantity: 2,
        };
        const userId = 'user123';

        await saleServices.create(payload, userId);

        expect(Product.findById).toHaveBeenCalledWith(payload.product);
        expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(payload.product, { $inc: { stock: -payload.quantity } }, expect.any(Object));
        expect(Sale.create).toHaveBeenCalledWith([payload], expect.any(Object));
        expect(eventPublisher.createSale).toHaveBeenCalledWith({
            productId: payload.product,
            quantity: payload.quantity,
            totalPrice: payload.productPrice * payload.quantity,
        });
    });

    it('should throw error if insufficient stock', async () => {
        const mockProduct = { _id: 'prod1', stock: 2 };
        jest.spyOn(Product, 'findById').mockResolvedValue(mockProduct);

        const payload = {
            product: 'prod1',
            productPrice: 10,
            quantity: 3,
        };
        const userId = 'user123';

        await expect(saleServices.create(payload, userId)).rejects.toThrow('3 product are not available in stock!');
    });
});

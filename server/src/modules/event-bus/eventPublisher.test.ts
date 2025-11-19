import eventPublisher from './eventPublisher';
import eventBus from './eventBus';

describe('EventPublisher', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(eventBus, 'dispatchEvent');
    });

    it('should dispatch ProductSold event', async () => {
        const mockEvent = {
            productId: '123',
            quantity: 2,
            totalPrice: 100,
        };

        await eventPublisher.createSale(mockEvent);

        expect(eventBus.dispatchEvent).toHaveBeenCalledWith('ProductSold', mockEvent);
    });
});

import eventBus from './eventBus';

type ProductSoldEvent = {
    productId: string;
    quantity: number;
    totalPrice: number;
};

class EventPublisher {
    async createSale(event: ProductSoldEvent): Promise<void> {
        await eventBus.dispatchEvent('ProductSold', event);
    }
}

const eventPublisher = new EventPublisher();
export default eventPublisher;

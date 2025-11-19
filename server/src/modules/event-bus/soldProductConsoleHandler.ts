import eventBus from './eventBus';

type ProductSoldEvent = {
    productId: string;
    quantity: number;
    totalPrice: number;
};

class SoldProductConsoleHandler {
    constructor() {
        eventBus.registerHandler('ProductSold', this.handleProductSold.bind(this));
    }

    private async handleProductSold(event: ProductSoldEvent): Promise<void> {
        console.log(`[ProductSold] Product ${event.productId} sold ${event.quantity} units for $${event.totalPrice}`);
    }
}

export default new SoldProductConsoleHandler();

import { Types } from 'mongoose';

type EventHandler<T> = (event: T) => void | Promise<void>;

class EventBus {
    private handlers: Map<string, EventHandler<any>> = new Map();

    registerHandler(eventName: string, handler: EventHandler<any>): void {
        this.handlers.set(eventName, handler);
    }

    async dispatchEvent<T>(eventName: string, event: T): Promise<void> {
        const handler = this.handlers.get(eventName);
        if (handler) {
            await handler(event);
        }
    }
}

const eventBus = new EventBus();
export default eventBus;

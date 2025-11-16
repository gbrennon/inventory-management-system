// server/src/modules/seller/domain/value-objects/Email.ts

/**
 * Value Object for Email
 * Represents an immutable email address with validation
 */
export class Email {
    private readonly _value: string;

    constructor(email: string) {
        this.validate(email);
        this._value = email;
    }

    private validate(email: string): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }
    }

    get value(): string {
        return this._value;
    }
}

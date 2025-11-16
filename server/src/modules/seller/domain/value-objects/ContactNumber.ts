// server/src/modules/seller/domain/value-objects/ContactNumber.ts

/**
 * Value Object for Contact Number
 * Represents an immutable contact number with validation
 */
export class ContactNumber {
    private readonly _value: string;

    constructor(contactNumber: string) {
        this.validate(contactNumber);
        this._value = contactNumber;
    }

    private validate(contactNumber: string): void {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
        if (!phoneRegex.test(contactNumber)) {
            throw new Error('Invalid contact number format');
        }
    }

    get value(): string {
        return this._value;
    }
}

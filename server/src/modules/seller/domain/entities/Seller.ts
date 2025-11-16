// server/src/modules/seller/domain/entities/Seller.ts

import { Email } from '../value-objects/Email';
import { ContactNumber } from '../value-objects/ContactNumber';

/**
 * Entity representing a Seller
 */
export class Seller {
    private readonly id: string;
    private readonly userId: string;
    private readonly name: string;
    private readonly email: Email;
    private readonly contactNumber: ContactNumber;

    constructor(props: {
        id: string;
        userId: string;
        name: string;
        email: string;
        contactNumber: string;
    }) {
        this.id = props.id;
        this.userId = props.userId;
        this.name = props.name;
        this.email = new Email(props.email);
        this.contactNumber = new ContactNumber(props.contactNumber);
    }

    get id(): string {
        return this.id;
    }

    get userId(): string {
        return this.userId;
    }

    get name(): string {
        return this.name;
    }

    get email(): Email {
        return this.email;
    }

    get contactNumber(): ContactNumber {
        return this.contactNumber;
    }
}

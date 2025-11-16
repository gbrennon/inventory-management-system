# Domain Layer Implementation

## Summary of Changes

Implemented adjustments to the `Seller` entity based on feedback to improve domain model design:

### 1. Seller Entity Refactor
- Changed constructor parameters from primitive types to Value Objects (`Email` and `ContactNumber`)
- This ensures that the entity only works with validated, immutable value objects rather than raw strings

### 2. Factory Method Implementation
Added a static factory method `fromPrimitives` to the `Seller` class:
```typescript
static fromPrimitives(props: {
    id: string;
    userId: string;
    name: string;
    email: string;
    contactNumber: string;
}): Seller {
    return new Seller({
        id: props.id,
        userId: props.userId,
        name: props.name,
        email: new Email(props.email),
        contactNumber: new ContactNumber(props.contactNumber)
    });
}
```

#### Benefits of this Approach:
1. **Simplifies Entity Constructor**: The constructor now only accepts fully-validated objects, making the entity's invariant enforcement clearer
2. **Separation of Concerns**: 
   - Value Objects handle their own validation (`Email` and `ContactNumber`)
   - Factory method handles conversion from primitives to domain objects
3. **Preserves Immutability**: Both Value Objects and Entities remain immutable after creation
4. **Better Encapsulation**: External code interacts with the domain through a clean API (`fromPrimitives`) rather than directly constructing entities with raw data

### 3. Domain Purity Maintained
- No external dependencies (e.g., databases, APIs) are used in domain layer
- All business rules and data validation are encapsulated within:
  - Value Objects (`Email`, `ContactNumber`)
  - Entity (`Seller`)

This implementation follows Domain-Driven Design principles by:
- Using Value Objects to represent conceptual domains
- Keeping entities focused on identity and behavior
- Providing a clear, intentional API for object creation through factory methods

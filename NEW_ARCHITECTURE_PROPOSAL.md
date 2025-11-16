# New Architecture Proposal

## Layers Architecture Based on DDD and Clean Architecture

### 1. Application Layer
Located at: `server/src/modules/seller/application/`

This layer contains the business use cases and orchestrates interactions between the domain layer and infrastructure layer.

#### Structure:
```
application/
├── ports/
│   ├── inbound/
│   │   └── ISellerServicePort.ts
│   └── outbound/
│       └── ISellerRepositoryPort.ts
└── services/
    └── SellerService.ts
```

#### Definitions:
- **Inbound Ports**: Interfaces that define the input to the application layer. These are implemented by controllers or other use case initiators.
- **Outbound Ports**: Interfaces that define interactions with the domain or infrastructure layer. These are implemented by repositories or other outbound adapters.
- **Application Services**: Contain the business use cases. Each service will have a single method called `execute`. 
  - Input: DTO prefixed with the service name + `Request` (e.g., `CreateSellerRequest`)
  - Output: DTO prefixed with the service name + `Response` (e.g., `CreateSellerResponse`)

**Rules**:
- No external dependencies allowed (only dependencies on Domain Layer and Application Ports).
- All business logic should be coordinated here, not implemented here.

---

### 2. Domain Layer
Located at: `server/src/modules/seller/domain/`

This is the core business rules and models of the application.

#### Structure:
```
domain/
├── entities/
│   └── Seller.ts
└── value-objects/
    └── Email.ts
    └── ContactNumber.ts
```

#### Definitions:
- **Entities**: Represent objects with continuity and identity. Contain business logic related to the entity’s life cycle.
- **Value Objects (VO)**: Immutable objects that represent a concept that isn’t identified by a unique ID, but by the value it holds.

**Rules**:
- Must contain only pure business logic and domain models.
- No external dependencies allowed (not even other layers).
- Should not know about persistence, APIs, or any infrastructure concerns.

---

### 3. Infrastructure Layer
Located at: `server/src/modules/seller/infrastructure/`

This layer deals with technical concerns such as persistence, third-party services, and other external resources.

#### Structure:
```
infrastructure/
├── repositories/
│   └── SellerRepository.ts
├── mappers/
│   └── SellerMapper.ts
└── databases/
    └── SellerMongooseRepository.ts
```

#### Definitions:
- **Repositories**: Concrete implementations of outbound ports from the Application layer. They handle data access.
- **Mappers**: Convert between Domain Entities and Data Models (e.g., between `Seller` entity and Mongoose model).
- **Databases/External Services**: Implementations that interact with databases or external services.

**Rules**:
- Can contain external dependencies (e.g., mongoose, API clients).
- Should implement interfaces defined in the Application Layer’s outbound ports.
- Should not contain any business logic; only data transformation and access.

---

### 4. Presentation Layer
Located at: `server/src/modules/seller/presentation/`

This layer is responsible for handling HTTP requests, input validation and returning responses to the client. To maintain retro-compatibility, controller files will stay here.

#### Structure:
```
presentation/
├── controllers/
│   └── SellerController.ts
├── dtos/
│   ├── CreateSellerRequest.ts
│   ├── CreateSellerResponse.ts
│   ├── GetAllSellersRequest.ts
│   └── GetAllSellersResponse.ts
└── validators/
    └── SellerValidator.ts
```

#### Definitions:
- **Controllers**: Handle incoming HTTP requests, call Application Services, and format responses.
- **DTOS**: Data Transfer Objects used to pass data between layers, especially from inbound ports to application services and from application services to controllers.
- **Validators**: Contains request validation logic.

**Rules**:
- Should only orchestrate the flow of data — calling application services and returning responses.
- Must remain compatible with existing routes to ensure zero downtime during migration.
- Should not contain business logic.

---

## Migration Steps Overview
1. **Domain Layer First**: Implement entities and value objects without any dependencies.
2. **Application Layer**: Create inbound and outbound ports, then implement application services that use domain entities.
3. **Infrastructure Layer**: Implement repositories and mappers that interact with databases and map to/from domain entities.
4. **Presentation Layer**: Refactor controllers to use Application Service's `execute` method with proper DTOS and maintain existing routes.

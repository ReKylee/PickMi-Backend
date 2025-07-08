export abstract class DomainError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype); // Ensure correct prototype chain
    }

    public abstract serialize(): SerializedDomainError;
    public abstract getStatusCode(): number;
}

export interface SerializedDomainError {
    type: string;
    message: string;
    details?: any;
}

/**
 * Thrown when an entity is not found by ID or identifier
 */
export class NotFoundError extends DomainError {
    constructor(entity: string, id?: string | number) {
        super(
            id ? `${entity} with ID '${id}' not found` : `${entity} not found`,
        );
    }

    serialize(): SerializedDomainError {
        return {
            type: "NOT_FOUND",
            message: this.message,
        };
    }

    getStatusCode(): number {
        return 404;
    }
}

/**
 * Thrown when Zod or other validation logic fails
 */
export class ValidationError extends DomainError {
    constructor(
        private readonly issues: Array<{ path: string; message: string }>,
    ) {
        super("Validation failed");
    }

    serialize(): SerializedDomainError {
        return {
            type: "VALIDATION_ERROR",
            message: this.message,
            details: this.issues,
        };
    }

    getStatusCode(): number {
        return 400;
    }
}

/**
 * Thrown when a domain invariant or business rule is violated
 */
export class BusinessRuleViolationError extends DomainError {
    constructor(
        message: string,
        private readonly context?: Record<string, any>,
    ) {
        super(message);
    }

    serialize(): SerializedDomainError {
        return {
            type: "BUSINESS_RULE_VIOLATION",
            message: this.message,
            details: this.context,
        };
    }

    getStatusCode(): number {
        return 422;
    }
}

/**
 * Thrown when an unexpected/unhandled error occurs
 */
export class UnexpectedError extends DomainError {
    constructor(error: unknown) {
        const message =
            process.env.NODE_ENV === "production"
                ? "An unexpected error occurred."
                : error instanceof Error
                  ? `Unexpected error: ${error.message}`
                  : "Unexpected error of unknown type.";

        super(message);
    }

    serialize(): SerializedDomainError {
        return {
            type: "UNEXPECTED_ERROR",
            message: this.message,
        };
    }

    getStatusCode(): number {
        return 500;
    }
}

/**
 * Thrown when a user is unauthenticated
 */
export class AuthenticationError extends DomainError {
    constructor(message = "Authentication required") {
        super(message);
    }

    serialize(): SerializedDomainError {
        return {
            type: "AUTHENTICATION_ERROR",
            message: this.message,
        };
    }

    getStatusCode(): number {
        return 401;
    }
}

/**
 * Thrown when a user is authenticated but lacks permission
 */
export class ForbiddenError extends DomainError {
    constructor(message = "You do not have permission to perform this action") {
        super(message);
    }

    serialize(): SerializedDomainError {
        return {
            type: "FORBIDDEN_ERROR",
            message: this.message,
        };
    }

    getStatusCode(): number {
        return 403;
    }
}

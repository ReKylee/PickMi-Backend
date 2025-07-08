// import { IUserRepository } from "../../Domain/Users/IUserRepository.js";
// import { User } from "../../Domain/Users/User.js";
// import {
//     BusinessRuleViolationError,
//     ValidationError,
//     UnexpectedError,
// } from "../../Shared/Errors.js";
// import { z } from "zod";
// import bcrypt from "bcrypt";
// import {
//     Result,
//     ok,
//     err,
//     ResultAsync,
//     fromPromise,
//     errAsync,
//     okAsync,
// } from "neverthrow";
//
// const SignUpInputSchema = z.object({
//     email: z.string().email(),
//     password: z.string().min(8, "Password must be at least 8 characters long"),
// });
//
// type SignUpInput = z.infer<typeof SignUpInputSchema>;
// type SignUpResult = Result<
//     void,
//     ValidationError | BusinessRuleViolationError | UnexpectedError
// >;
//
// /**
//  * The SignUpUseCase is responsible for the specific application logic
//  * of registering a new user.
//  */
// export class SignUpUseCase {
//     constructor(private readonly userRepository: IUserRepository) {}
//
//     public async execute(input: SignUpInput): Promise<SignUpResult> {
//         return this.validateInput(input)
//             .andThen(this.checkEmailAvailability)
//             .andThen(this.hashPassword)
//             .andThen(this.createUserEntity)
//             .andThen(this.persistUser)
//             .map(() => undefined);
//     }
//
//     /**
//      * Step 1: Validates the raw input against the Zod schema.
//      */
//     private validateInput(
//         input: SignUpInput,
//     ): ResultAsync<SignUpInput, ValidationError> {
//         const validationResult = SignUpInputSchema.safeParse(input);
//         if (!validationResult.success) {
//             return errAsync(new ValidationError(validationResult.error));
//         }
//         return okAsync(validationResult.data);
//     }
//
//     /**
//      * Step 2: Checks if a user with the given email already exists in the database.
//      */
//     private checkEmailAvailability = (
//         validatedInput: SignUpInput,
//     ): ResultAsync<
//         SignUpInput,
//         BusinessRuleViolationError | UnexpectedError
//     > => {
//         return fromPromise(
//             this.userRepository.findByEmail(validatedInput.email),
//             (e) => new UnexpectedError(e),
//         ).andThen((existingUser: any) =>
//             existingUser
//                 ? err(new BusinessRuleViolationError("Email already exists."))
//                 : ok(validatedInput),
//         );
//     };
//
//     /**
//      * Step 3: Hashes the user's password.
//      */
//     private hashPassword = (
//         validatedInput: SignUpInput,
//     ): ResultAsync<
//         { email: string; hashedPassword: string },
//         UnexpectedError
//     > => {
//         return fromPromise(
//             bcrypt.hash(validatedInput.password, 10),
//             (e) => new UnexpectedError(e),
//         ).map((hashedPassword: any) => ({
//             email: validatedInput.email,
//             hashedPassword,
//         }));
//     };
//
//     /**
//      * Step 4: Creates a User domain entity instance.
//      */
//     private createUserEntity = (data: {
//         email: string;
//         hashedPassword: string;
//     }): ResultAsync<User, never> => {
//         const user = User.create({
//             email: data.email,
//             password: data.hashedPassword,
//         });
//         return okAsync(user);
//     };
//
//     /**
//      * Step 5: Saves the new User entity to the database.
//      */
//     private persistUser = (user: User): ResultAsync<User, UnexpectedError> => {
//         return fromPromise(
//             this.userRepository.save(user),
//             (e) => new UnexpectedError(e),
//         ).map(() => user);
//     };
// }

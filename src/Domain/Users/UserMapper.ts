import { Result } from 'neverthrow';
import { ValidationError } from '../../Shared/Errors.js';
import { UniqueEntityID } from '../ValueObjects/UniqueEntityID.js';
import { User } from './User.js';
import { Types } from 'mongoose';
import { UserDocument } from '../../Infrastructure/Database/Models/UserModel.js';
import { Email } from '../ValueObjects/Email.js';
import { Password } from '../ValueObjects/Password.js';

export class UserMapper {
    static toDomain(doc: UserDocument): Result<User, ValidationError> {
        const idResult = UniqueEntityID.from(doc._id.toString());
        const emailResult = Email.create(doc.email);

        return Result.combineWithAllErrors([emailResult, idResult])
            .mapErr((errs) => new ValidationError(...errs))
            .map(([email, id]) =>
                User.reconstitute(
                    {
                        email,
                        password: Password.fromHash(doc.password),
                        role: doc.role,
                    },
                    id,
                ),
            );
    }

    static toPersistence(user: User) {
        return {
            _id: new Types.ObjectId(user.id.toString()),
            email: user.email.value,
            password: user.password.value,
            role: user.role,
        };
    }
}

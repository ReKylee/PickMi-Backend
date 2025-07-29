import { MongooseUserRepository } from '../src/Infrastructure/Database/Repositories/MongooseUserRepository';
import { User } from '../src/Domain/Users/User';
import mongoose from 'mongoose';

export default async function handler(req: Request): Promise<Response> {
    const secret = req.headers.get('x-seed-secret');
    if (secret !== process.env.SEED_SECRET) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const mongoUri = process.env.MONGO_URL!;
        await mongoose.connect(mongoUri);

        const adminEmail = 'admin@test.com';
        const adminPassword = 'TestPassword123!';
        const userRepo = new MongooseUserRepository();

        const userOrError = await userRepo.findByEmail({
            value: adminEmail,
        } as any);
        if (userOrError.isOk()) {
            return new Response(
                JSON.stringify({ message: 'Admin already exists' }),
                {
                    status: 200,
                },
            );
        }

        const userResult = await User.create({
            email: adminEmail,
            password: adminPassword,
            role: 'admin',
        });

        if (userResult.isErr()) {
            return new Response(JSON.stringify({ error: userResult.error }), {
                status: 500,
            });
        }

        const saveResult = await userRepo.save(userResult.value);
        if (saveResult.isErr()) {
            return new Response(JSON.stringify({ error: saveResult.error }), {
                status: 500,
            });
        }

        return new Response(JSON.stringify({ message: 'Admin created' }), {
            status: 200,
        });
    } catch (e) {
        console.error(e);
        return new Response('Internal Server Error', { status: 500 });
    }
}

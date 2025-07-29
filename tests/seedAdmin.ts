import { configDotenv } from 'dotenv';
configDotenv();
import { MongooseUserRepository } from '../src/Infrastructure/Database/Repositories/MongooseUserRepository';
import { User } from '../src/Domain/Users/User';
import mongoose from 'mongoose';

const adminEmail = 'admin@test.com';
const adminPassword = 'TestPassword123!';

async function seedAdmin() {
    const mongoUri = process.env.MONGO_URI!;
    await mongoose.connect(mongoUri);

    const userRepo = new MongooseUserRepository();

    const userOrError = await userRepo.findByEmail({
        value: adminEmail,
    } as any);
    if (userOrError.isOk()) {
        console.log('Admin user already exists.');
        process.exit(0);
    }

    const userResult = await User.create({
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
    });

    if (userResult.isErr()) {
        console.error('Failed to create admin user:', userResult.error);
        process.exit(1);
    }

    const saveResult = await userRepo.save(userResult.value);
    if (saveResult.isErr()) {
        console.error('Failed to save admin user:', saveResult.error);
        process.exit(1);
    }

    console.log('Admin user seeded successfully!');
    process.exit(0);
}

seedAdmin().catch((err) => {
    console.error('Unexpected error:', err);
    process.exit(1);
});

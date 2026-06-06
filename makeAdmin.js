import mongoose from 'mongoose';
import { env } from './src/Config/Env.js';
import User from './src/Models/User.js';

const makeAdmin = async () => {
    try {
        await mongoose.connect(env.mongodb_url);
        console.log("Connected to MongoDB");
        
        const firstUser = await User.findOne();
        if (firstUser) {
            firstUser.role = 'admin';
            await firstUser.save();
            console.log(`User ${firstUser.username} is now an admin!`);
        } else {
            console.log("No users found in database.");
        }
        
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

makeAdmin();

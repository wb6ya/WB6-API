import mongoose from 'mongoose';
import { env } from './src/Config/Env.js';
import User from './src/Models/User.js';

const clearUsers = async () => {
    try {
        await mongoose.connect(env.mongodb_url);
        console.log("Connected to MongoDB");
        
        await User.deleteMany({});
        console.log("Cleared users");
        
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

clearUsers();

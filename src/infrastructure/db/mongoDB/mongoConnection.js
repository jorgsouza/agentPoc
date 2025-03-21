import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { validateEnvVars } from "../../../config/envValidator.js";

dotenv.config();

validateEnvVars(["MONGO_URI"]);

const { MONGO_URI } = process.env;

const options = {
  serverSelectionTimeoutMS: 60000, // Aumenta o tempo limite para seleção do servidor
  socketTimeoutMS: 60000,         // Aumenta o tempo limite do socket
  connectTimeoutMS: 60000,        // Aumenta o tempo limite de conexão
  maxPoolSize: 10                 // Limita o número de conexões simultâneas
};

export async function connectToMongo() {
  try {
    await mongoose.connect(MONGO_URI, options);
    // console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
  }
}

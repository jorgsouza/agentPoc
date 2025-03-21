import dotenv from "dotenv";

dotenv.config();

export function validateEnvVars(requiredVars) {
  const missingVars = requiredVars.filter((key) => !process.env[key]);
  if (missingVars.length > 0) {
    throw new Error(`❌ Missing required environment variables: ${missingVars.join(", ")}`);
  }
}

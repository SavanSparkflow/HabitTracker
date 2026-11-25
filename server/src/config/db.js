import mongoose from "mongoose";

/**
 * Connect to MongoDB using MONGODB_URI from environment variables.
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is missing in environment variables.");
  }

  mongoose.set("strictQuery", true);
  const conn = await mongoose.connect(uri);
  console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
}

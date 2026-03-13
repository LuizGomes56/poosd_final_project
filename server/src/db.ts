import mongoose from "mongoose";                                              
                                                                                
export async function connectDB() {                                           
  const url = process.env.MONGO_CONNECTION_URL;                               
  if (!url) {                                                                 
    throw new Error("MONGO_CONNECTION_URL is not defined");                   
  }                                                                           
                                                                              
  await mongoose.connect(url);                                                
  console.log("Connected to MongoDB");                                        
}   
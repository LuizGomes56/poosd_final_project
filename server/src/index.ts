import "dotenv/config";  // Load .env file                                    
import { connectDB } from "./db";                                             
import { User } from "./models/User";                                         
                                                                              
async function main() {                                                       
  await connectDB();                                                          
                                                                                                                              
}

main().catch(console.error);     
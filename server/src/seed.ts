import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./db";
import { User } from "./models/User";
import { createHash } from "crypto";

console.log("Seed script starting...");

// Configuration
const NUM_USERS = 10;

// Simple hash function for test data (insecure for production)
function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

// Generate random test users
function generateTestUsers(count: number) {
  const firstNames = [
    "John", "Jane", "Mike", "Sarah", "David",
    "Emily", "Chris", "Amanda", "James", "Jessica",
    "Alex", "Taylor", "Jordan", "Morgan", "Casey"
  ];

  const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones",
    "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"
  ];

  type UserInput = mongoose.InferSchemaType<typeof User.schema>;
  const users: UserInput[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;

    users.push({
      email,
      email_verified: Math.random() > 0.5,
      name,
      password_hash: hashPassword(`password${i}`),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)), // Random date within last 30 days
    });
  }

  return users;
}

async function seed() {
  console.log("Connecting to database...");
  await connectDB();
  console.log("Connection established, checking for existing users...");

  const existingUsers = await User.countDocuments();
  console.log(`Found ${existingUsers} existing users in database.`);
  if (existingUsers > 0) {
    throw new Error("Database is already seeded. Found " + existingUsers + " existing users.");
  }

  console.log(`Generating ${NUM_USERS} test users...`);
  const testUsers = generateTestUsers(NUM_USERS);

  console.log("Inserting test users...");
  const insertedUsers = await User.insertMany(testUsers);

  console.log("\n=== Seed Data Summary ===");
  console.log(`Users created: ${insertedUsers.length}`);
  console.log("\nSample users:");
  insertedUsers.slice(0, 3).forEach((user) => {
    console.log(`  - ${user.name} (${user.email}) - verified: ${user.email_verified}`);
  });

  console.log("\nTest credentials (password is 'password' + index):");
  console.log(`  Example: ${testUsers[0].email} / password0`);
}

seed()
  .then(() => {
    console.log("\nSeeding completed successfully!");
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    mongoose.connection.close();
    process.exit(1);
  });
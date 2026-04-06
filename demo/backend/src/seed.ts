import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const baseUrl = (process.env.CMS_BASE_URL || "http://localhost:3000").replace(/\/+$/, "");
const email = process.env.CMS_EMAIL;
const password = process.env.CMS_PASSWORD;
const fullName = process.env.CMS_FULL_NAME || "Demo User";

if (!email || !password) {
    console.error("CMS_EMAIL and CMS_PASSWORD must be set in .env");
    process.exit(1);
}

type ApiResponse<T> = {
    ok: boolean;
    status: number;
    message?: string;
    body?: T;
};

async function api<T>(
    path: string,
    init: RequestInit,
    token?: string
): Promise<T> {
    const headers = new Headers(init.headers);
    headers.set("Content-Type", "application/json");

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${baseUrl}/api/${path}`, {
        ...init,
        headers
    });

    const json = await response.json() as ApiResponse<T>;

    if (!json.ok) {
        throw new Error(json.message || `Request failed: ${path}`);
    }

    return json.body as T;
}

async function register() {
    console.log("Registering demo user...");
    try {
        await api("users/register", {
            method: "POST",
            body: JSON.stringify({
                full_name: fullName,
                email,
                password
            })
        });
        console.log("  User registered successfully");
    } catch (error) {
        if (error instanceof Error && error.message.includes("already")) {
            console.log("  User already exists, skipping registration");
        } else {
            throw error;
        }
    }
}

async function login(): Promise<string> {
    console.log("Logging in...");
    const result = await api<{ token: string }>("users/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
    });
    console.log("  Logged in successfully");
    return result.token;
}

async function createTopic(
    token: string,
    name: string,
    description: string
): Promise<string> {
    const result = await api<{ topic_id: string }>("topics/create", {
        method: "POST",
        body: JSON.stringify({ name, description })
    }, token);
    return result.topic_id;
}

type QuestionInput = {
    topic_ids: string[];
    prompt: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    hint?: string;
    explanation?: string;
    points?: number;
} & (
    | { type: "MCQ"; choice: { options: string[]; answers: { single?: string; multiple?: string[] } } }
    | { type: "TF"; choice: { answers: { single: "True" | "False" } } }
    | { type: "FRQ"; frq: { kind: "NUMBER"; accepted_numbers: number[]; tolerance?: number } | { kind: "TEXT"; accepted_texts: string[] } }
);

async function createQuestion(token: string, question: QuestionInput): Promise<string> {
    const result = await api<{ question_id: string }>("questions/create", {
        method: "POST",
        body: JSON.stringify(question)
    }, token);
    return result.question_id;
}

async function seed() {
    console.log(`\nSeeding demo data to ${baseUrl}\n`);

    await register();
    const token = await login();

    // Create topics
    console.log("Creating topics...");
    const topics: Record<string, string> = {};

    const topicData = [
        { name: "Mathematics", description: "Algebra, calculus, and numerical problems" },
        { name: "Science", description: "Physics, chemistry, and biology" },
        { name: "History", description: "World history and historical events" },
        { name: "Programming", description: "Computer science and coding concepts" }
    ];

    for (const topic of topicData) {
        const id = await createTopic(token, topic.name, topic.description);
        topics[topic.name] = id;
        console.log(`  Created topic: ${topic.name}`);
    }

    // Create questions
    console.log("Creating questions...");

    const questions: QuestionInput[] = [
        // Mathematics
        {
            topic_ids: [topics["Mathematics"]],
            type: "MCQ",
            prompt: "What is the value of x in the equation 2x + 5 = 15?",
            difficulty: "EASY",
            hint: "Isolate x by subtracting 5 from both sides first.",
            explanation: "2x + 5 = 15 → 2x = 10 → x = 5",
            points: 100,
            choice: {
                options: ["3", "5", "7", "10"],
                answers: { single: "5" }
            }
        },
        {
            topic_ids: [topics["Mathematics"]],
            type: "FRQ",
            prompt: "What is the square root of 144?",
            difficulty: "EASY",
            explanation: "√144 = 12 because 12 × 12 = 144",
            points: 100,
            frq: {
                kind: "NUMBER",
                accepted_numbers: [12],
                tolerance: 0
            }
        },
        {
            topic_ids: [topics["Mathematics"]],
            type: "MCQ",
            prompt: "Which of the following are prime numbers?",
            difficulty: "MEDIUM",
            hint: "A prime number is only divisible by 1 and itself.",
            explanation: "2, 3, 5, and 7 are prime. 4 = 2×2, 6 = 2×3, 9 = 3×3",
            points: 150,
            choice: {
                options: ["2", "3", "4", "5", "6", "7", "9"],
                answers: { multiple: ["2", "3", "5", "7"] }
            }
        },
        {
            topic_ids: [topics["Mathematics"]],
            type: "FRQ",
            prompt: "Calculate the derivative of f(x) = 3x² + 2x - 5 at x = 2",
            difficulty: "HARD",
            hint: "First find f'(x), then substitute x = 2.",
            explanation: "f'(x) = 6x + 2. At x = 2: f'(2) = 6(2) + 2 = 14",
            points: 200,
            frq: {
                kind: "NUMBER",
                accepted_numbers: [14],
                tolerance: 0
            }
        },

        // Science
        {
            topic_ids: [topics["Science"]],
            type: "MCQ",
            prompt: "What is the chemical symbol for water?",
            difficulty: "EASY",
            explanation: "Water consists of 2 hydrogen atoms and 1 oxygen atom: H₂O",
            points: 100,
            choice: {
                options: ["H2O", "CO2", "NaCl", "O2"],
                answers: { single: "H2O" }
            }
        },
        {
            topic_ids: [topics["Science"]],
            type: "TF",
            prompt: "The speed of light in a vacuum is approximately 300,000 km/s.",
            difficulty: "EASY",
            explanation: "The speed of light is approximately 299,792 km/s, which rounds to 300,000 km/s.",
            points: 100,
            choice: {
                answers: { single: "True" }
            }
        },
        {
            topic_ids: [topics["Science"]],
            type: "MCQ",
            prompt: "Which planet is known as the Red Planet?",
            difficulty: "EASY",
            hint: "It's named after the Roman god of war.",
            explanation: "Mars appears red due to iron oxide (rust) on its surface.",
            points: 100,
            choice: {
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                answers: { single: "Mars" }
            }
        },
        {
            topic_ids: [topics["Science"]],
            type: "FRQ",
            prompt: "How many bones are in the adult human body?",
            difficulty: "MEDIUM",
            hint: "It's more than 200.",
            explanation: "Adults have 206 bones. Babies are born with about 270, but many fuse together.",
            points: 150,
            frq: {
                kind: "NUMBER",
                accepted_numbers: [206],
                tolerance: 0
            }
        },

        // History
        {
            topic_ids: [topics["History"]],
            type: "MCQ",
            prompt: "In what year did World War II end?",
            difficulty: "EASY",
            explanation: "WWII ended in 1945 with the surrender of Japan on September 2nd.",
            points: 100,
            choice: {
                options: ["1943", "1944", "1945", "1946"],
                answers: { single: "1945" }
            }
        },
        {
            topic_ids: [topics["History"]],
            type: "TF",
            prompt: "The Great Wall of China is visible from space with the naked eye.",
            difficulty: "MEDIUM",
            explanation: "This is a common myth. The Great Wall is too narrow to be seen from space without aid.",
            points: 150,
            choice: {
                answers: { single: "False" }
            }
        },
        {
            topic_ids: [topics["History"]],
            type: "FRQ",
            prompt: "Who was the first President of the United States?",
            difficulty: "EASY",
            explanation: "George Washington served as the first President from 1789 to 1797.",
            points: 100,
            frq: {
                kind: "TEXT",
                accepted_texts: ["George Washington", "Washington", "george washington", "washington"]
            }
        },

        // Programming
        {
            topic_ids: [topics["Programming"]],
            type: "MCQ",
            prompt: "Which of the following is NOT a programming language?",
            difficulty: "EASY",
            explanation: "HTML is a markup language, not a programming language.",
            points: 100,
            choice: {
                options: ["Python", "JavaScript", "HTML", "Java"],
                answers: { single: "HTML" }
            }
        },
        {
            topic_ids: [topics["Programming"]],
            type: "TF",
            prompt: "In most programming languages, array indices start at 0.",
            difficulty: "EASY",
            explanation: "Most languages like C, Java, Python, and JavaScript use 0-based indexing.",
            points: 100,
            choice: {
                answers: { single: "True" }
            }
        },
        {
            topic_ids: [topics["Programming"]],
            type: "MCQ",
            prompt: "What does API stand for?",
            difficulty: "EASY",
            explanation: "API = Application Programming Interface",
            points: 100,
            choice: {
                options: [
                    "Application Programming Interface",
                    "Advanced Program Integration",
                    "Automated Process Implementation",
                    "Application Process Integration"
                ],
                answers: { single: "Application Programming Interface" }
            }
        },
        {
            topic_ids: [topics["Programming"]],
            type: "FRQ",
            prompt: "What is the time complexity of binary search?",
            difficulty: "MEDIUM",
            hint: "Think about how many times you can divide n by 2.",
            explanation: "Binary search has O(log n) time complexity because it halves the search space each iteration.",
            points: 150,
            frq: {
                kind: "TEXT",
                accepted_texts: ["O(log n)", "O(logn)", "log n", "logn", "O(log(n))", "logarithmic"]
            }
        },
        {
            topic_ids: [topics["Programming"]],
            type: "MCQ",
            prompt: "Which data structures use LIFO (Last In, First Out) ordering?",
            difficulty: "MEDIUM",
            explanation: "Stacks use LIFO ordering. Queues use FIFO (First In, First Out).",
            points: 150,
            choice: {
                options: ["Stack", "Queue", "Array", "Linked List"],
                answers: { single: "Stack" }
            }
        }
    ];

    for (const question of questions) {
        await createQuestion(token, question);
        console.log(`  Created: ${question.prompt.substring(0, 50)}...`);
    }

    console.log(`\nSeeding complete!`);
    console.log(`  Topics: ${Object.keys(topics).length}`);
    console.log(`  Questions: ${questions.length}`);
}

seed().catch((error) => {
    console.error("\nSeeding failed:", error.message);
    process.exit(1);
});

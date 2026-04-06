import { describe, expect, test } from "vitest";
import { api, token } from "./api";

function randomStr(n = 24) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < n; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const full_name = randomStr();
const email = `${randomStr(16)}@${randomStr(8)}.com`.toLowerCase();
const password = randomStr(32);

export async function login() {
    const r = await api("users/login", {
        email,
        password,
    });

    token.set(r.body?.token);

    return r;
}

describe(`Testing register route ("users/register")`, () => {
    test("Register as non-existent user", async () => {
        expect(await api(
            "users/register", {
            full_name,
            email,
            password,
        })).toEqual({
            ok: true,
            status: 200,
            message: "User registered successfully"
        })
    })

    test("Register as existent user", async () => {
        expect(await api(
            "users/register", {
            full_name,
            email,
            password,
        })).toEqual({
            ok: false,
            status: 500,
            message: "This email is already in use"
        })
    });
});

describe(`Testing login route ("users/login")`, () => {
    test("Login as existent user", async () => {
        expect(await login()).toMatchObject({
            ok: true,
            status: 200,
            message: "User logged in successfully",
            body: {
                _id: expect.any(String),
                email,
                email_verified: false,
                full_name,
            }
        })
    });

    test("Login as existent user with wrong password", async () => {
        expect(await api(
            "users/login", {
            email,
            password: "undefined",
        })).toEqual({
            ok: false,
            status: 401,
            message: "Password is incorrect"
        })
    });

    test("Login as non-existent user", async () => {
        expect(await api(
            "users/login", {
            email: "undefined@undefined.com",
            password: "undefined",
        })).toEqual({
            ok: false,
            status: 404,
            message: "User does not exist. Verify the provided email address"
        })
    });

    test("Login as non-existent with invalid email", async () => {
        expect(await api(
            "users/login", {
            email: "undefined",
            password: "undefined",
        })).toEqual({
            ok: false,
            status: 400,
            message: "Error: email - Invalid email"
        })
    });
});

describe(`Testing verify route ("users/verify")`, () => {
    test("Verify without providing a token", async () => {
        let prev = token.get();
        token.drop();

        expect(await api("users/verify")).toEqual({
            ok: false,
            status: 401,
            message: "Could not extract token from the request headers"
        });

        token.set(prev);
    });

    test("Verify user data (with a token)", async () => {
        expect(await api("users/verify")).toMatchObject({
            ok: true,
            status: 200,
            body: {
                email,
                email_verified: false,
                full_name,
                user_id: expect.any(String),
            },
        })
    });
});
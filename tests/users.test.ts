import { describe, expect, test } from "vitest";
import { api, token } from "./api";

export async function login() {
    const r = await api("users/login", {
        email: "test@gmail.com",
        password: "test",
    });

    token.set(r.body?.token);

    return r;
}

describe(`Testing login route ("users/login")`, () => {
    test("Login as existent user", async () => {
        expect(await login()).toMatchObject({
            ok: true,
            status: 200,
            message: "User logged in successfully",
            body: {
                _id: "69c2c12783b18c0ba5254884",
                email: "test@gmail.com",
                email_verified: false,
                full_name: "SomeName",
            }
        })
    });

    test("Login as existent user with wrong password", async () => {
        expect(await api(
            "users/login", {
            email: "test@gmail.com",
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

describe(`Testing register route ("users/register")`, () => {
    test("Register as existent user", async () => {
        expect(await api(
            "users/register", {
            full_name: "SomeName",
            email: "test@gmail.com",
            password: "test",
        })).toEqual({
            ok: false,
            status: 500,
            message: "This email is already in use"
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
                email: "test@gmail.com",
                email_verified: false,
                full_name: "SomeName",
                user_id: expect.any(String),
            },
        })
    });
});
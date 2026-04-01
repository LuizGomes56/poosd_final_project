import { describe, expect, test } from "vitest";
import { api } from "./api";
import { login } from "./users.test";

const getToken = async () => (await login()).body?.token;

describe("Testing topic creation route (\"topics/create\")", () => {
    test("Creating a new topic", async () => {
        const r = await api("topics/create", {
            name: "Test Generated Topic",
            description: "Generated through test"
        }, await getToken());
        expect(r).toMatchObject({
            ok: true,
            status: 200,
            body: {
                name: "Test Generated Topic",
                questions: [],
                user_id: expect.any(String),
                description: "Generated through test",
            }
        })
    });
});
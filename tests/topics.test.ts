import { assert, describe, expect, test } from "vitest";
import { api } from "./api";
import { login } from "./users.test";

let token: string | undefined;
(async () => {
    const data = await login();
    token = data.body?.token
})();

describe("Testing topic routes", () => {
    let topic_id: string | undefined;

    test("Testing topic create route (\"topics/create\")", async () => {
        const r = await api("topics/create", {
            name: "Test Generated Topic",
            description: "Generated through test"
        }, token);

        topic_id = r.body?.topic_id;

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

    describe("Testing topic update route (\"topics/update\")", () => {
        test("Updating a topic", async () => {
            if (!topic_id) {
                assert.fail("Topic id not found");
            }

            const v = await api("topics/update", { topic_id, name: "Updated Topic Name" }, token);
            expect(v).toMatchObject({
                ok: true,
                status: 200,
                body: expect.objectContaining({ name: "Updated Topic Name" })
            });
        });
    });

    test("Testing topic delete route (\"topics/delete\")", async () => {
        if (!topic_id) {
            assert.fail("Topic id not found");
        }

        const v = await api("topics/delete", { topic_id }, token);
        expect(v).toMatchObject({
            ok: true,
            status: 200,
            body: expect.objectContaining({ name: "Updated Topic Name" })
        });
    });
});
import { assert, describe, expect, test } from "vitest";
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

    describe('Testing topic creation route ("topics/create")', () => {
        test("Verifying and deleting the previously created topic", async () => {
            const r = await api("topics/all", await getToken());

            const len = r.body.length;

            assert(len > 0, "There should be at least one topic created for this user");
            expect(r).toMatchObject({
                ok: true,
                status: 200,
                body: expect.arrayContaining([
                    expect.objectContaining({ name: "Test Generated Topic" })
                ])
            });

            const topic = [...r.body].reverse().find((topic) => topic.name === "Test Generated Topic");
            const topic_id = topic?._id;
            assert(topic_id && typeof topic_id === "string", "Topic ID not found");

            const v = await api("topics/delete", { topic_id }, await getToken());

            expect(v).toMatchObject({
                ok: true,
                status: 200,
                body: expect.objectContaining({ name: "Test Generated Topic" })
            });
        });
    });
});
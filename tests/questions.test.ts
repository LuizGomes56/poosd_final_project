import { assert, describe, expect, test } from "vitest";
import { api } from "./api";
import { login } from "./users.test";

(async () => await login())();

describe("Creating question routes", () => {
    let topic_id: string | undefined;
    let question_id: string | undefined;

    test(`Create topic and later a FRQ question ("questions/create")`, async () => {
        const r = await api("topics/create", {
            name: "Test Generated Topic",
            description: "Generated through test"
        });

        if (!r.body) {
            assert.fail("Topic id could not be recovered");
        }

        topic_id = r.body.topic_id;

        const q = await api("questions/create", {
            type: "FRQ",
            difficulty: "EASY",
            prompt: "What is 1 + 1?",
            topic_ids: [topic_id],
            frq: {
                kind: "NUMBER",
                accepted_numbers: [2]
            }
        });

        const body = q.body;

        if (!body) {
            assert.fail("Question id could not be created. Check logs");
        }

        question_id = body.question_id;

        expect(body.points).toBe(100);
        expect(body.explanation).toBe("");
        expect(body.hint).toBe("");
        expect(body.topic_ids).toEqual([topic_id]);
        assert(question_id.length == 24);
    });

    test(`Update FRQ question ("questions/update")`, async () => {
        if (!question_id) {
            assert.fail("Question id not found");
        }

        const r = await api("questions/update", {
            question_id,
            points: 50,
            explanation: "Generated through test",
            hint: "Generated through test"
        });

        const body = r.body;

        if (!body) {
            assert.fail("Question id could not be created. Check logs");
        }

        expect(body.points).toBe(50);
        expect(body.explanation).toBe("Generated through test");
        expect(body.hint).toBe("Generated through test");
    });

    test(`Check FRQ answer ("questions/check")`, async () => {
        if (!question_id) {
            assert.fail("Question id not found");
        }

        const r = await api("questions/check", {
            question_id,
            answer: 2
        });

        expect(Boolean(r.body?.correct)).toBe(true);
    });

    async function deleteQuestion(question_id: string | undefined) {
        if (!question_id) {
            assert.fail("Question id not found");
        }

        const r = await api("questions/delete", {
            question_id
        });

        expect(r).toMatchObject(expect.objectContaining({
            ok: true,
            status: 200
        }));
    };

    test(`Delete FRQ question ("questions/delete")`, async () => {
        deleteQuestion(question_id);
    });

    test(`Create MCQ question with invalid data ("questions/create")`, async () => {
        const r = await api("questions/create", {
            type: "MCQ",
            difficulty: "EASY",
            prompt: "What is 1 + 1?",
            topic_ids: [topic_id!],
            choice: {
                answers: {
                    single: "2",
                    // There can't be multiple answers and 
                    // single answers at the same time
                    multiple: ["3", "4"]
                },
                options: ["1", "2", "3", "4"]
            }
        });

        expect(r).toMatchObject(expect.objectContaining({
            ok: false,
            status: 400,
            message: "Error: choice, answers, single - Define exactly one of answers.single or answers.multiple"
        }));
    });

    test(`Create MCQ question with multiple answers ("questions/create")`, async () => {
        const r = await api("questions/create", {
            type: "MCQ",
            difficulty: "EASY",
            prompt: "What is 2 * 4 is multiple of?",
            topic_ids: [topic_id!],
            choice: {
                answers: {
                    multiple: ["1", "2", "4", "8"]
                },
                options: ["1", "2", "4", "8", "11", "29", "35"]
            }
        });

        const body = r.body;

        if (!body) {
            assert.fail("Response did not return a body");
        }

        question_id = body.question_id;
    });

    test(`Check invalid MCQ answer ("questions/check")`, async () => {
        if (!question_id) {
            assert.fail("Question id not found");
        }

        const r = await api("questions/check", {
            question_id,
            answer: "4"
        });

        expect(r.ok).toBe(false);
        expect(r.message).toBe("This MCQ answer requires multiple answers");
    });

    test(`Check valid but wrong MCQ answer ("questions/check")`, async () => {
        if (!question_id) {
            assert.fail("Question id not found");
        }

        const r = await api("questions/check", {
            question_id,
            answer: ["4", "8"]
        });

        if (!r.body) {
            assert.fail("questions/check should have returned a body data");
        }

        expect(Boolean(r.body.correct)).toBe(false);
    });

    test(`Check valid and correct MCQ answer ("questions/check")`, async () => {
        if (!question_id) {
            assert.fail("Question id not found");
        }

        const r = await api("questions/check", {
            question_id,
            answer: ["1", "2", "4", "8"]
        });

        if (!r.body) {
            assert.fail("questions/check should have returned a body data");
        }

        expect(Boolean(r.body.correct)).toBe(true);
    });

    test(`Return all available questions ("questions/all")`, async () => {
        const r = await api("questions/all", { topic_id });

        expect(r).toMatchObject(expect.objectContaining({
            ok: true,
            status: 200,
            body: topic_id
                ? expect.arrayContaining([
                    expect.objectContaining({
                        topic_ids: expect.arrayContaining([topic_id]),
                        question_id
                    })
                ])
                : expect.any(Array)
        }));
    });

    test(`Get question by id ("questions/get")`, async () => {
        if (!question_id) {
            assert.fail("Question id not found");
        }

        const r = await api("questions/get", { question_id });

        expect(r).toMatchObject(expect.objectContaining({
            ok: true,
            status: 200,
            body: expect.objectContaining({
                choice: expect.objectContaining({
                    answers: expect.objectContaining({
                        multiple: expect.arrayContaining(["1", "2", "4", "8"])
                    })
                }),
                points: 100,
                prompt: "What is 2 * 4 is multiple of?",
                topic_ids: expect.arrayContaining([topic_id!])
            })
        }));
    });

    test(`Delete MCQ question ("questions/delete")`, async () => {
        deleteQuestion(question_id);
    });
});
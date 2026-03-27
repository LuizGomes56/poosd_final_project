import { describe, expect, test } from "@jest/globals"
const URL_LOGIN = "";
const URL_REGISTER = "";

export interface HttpResponse<T extends Record<string, any> = {}> {
    ok: boolean,
    status: number,
    message?: string,
    body: T
}

/*
The tests below are for the currently available routes, however the 
jsons may change so make sure that the returning json match a similar format
to the tests if you make a change
*/

async function login_request(user_body) {
    let token = null;

    const response = await fetch(URL_LOGIN,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user_body),
            credentials: 'include'
        }
    )

    const body = await response.json();
    if (response.headers['set-cookie'][0] != "") {
        token = response.headers['set-cookie'][0];
    }
    return [body, response.status]
}

async function register_request(user_body) {
    const response = await fetch(URL_REGISTER,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user_body),
        }
    )

    const body = await response.json();

    return [body, response.status]
}

describe("Testing user crendential functionality", () => {
    test("Loging in as non-existing user", () => {
        let login_body = {
            email: "test@test.com",
            password: "testpassword",
        }
        expect(
            login_request(login_body)
        ).toEqual([
            {
                ok: false,
                message: "user does not exist",
                body: {}
            },
            400,
            null
        ]);
    })

    test("Registering as new user", () => {
        let register_body = {
            full_name: "testing name",
            email: "testing@test.com",
            password: "testpassword",
        }

        expect(
            register_request(register_body)
        ).toEqual([
            {
                ok: true,
                message: "",
                body: {}
            },
            200,
            null
        ])
    })
    //most likely we should allow for multiple accounts with the same name
    //However we should not allow with the same email
    test("Registering as existing user", () => {
        let register_body = {
            full_name: "testing name",
            email: "testing@test.com",
            password: "testpassword",
        }
        expect(
            register_request(register_body)
        ).toEqual(
            [
                {
                    ok: false,
                    message: "existing user",
                    body: {}
                },
                409,
                null
            ]
        )
    })

    test("Registering with invalid input", () => {
        let register_body = {
            full_name: "#!()#&$*!",
            email: "There is no email",
            password: "\r\b\d\hafwqas",
        };
        expect(
            register_request(register_body)
        ).toEqual(
            [
                {
                    status: false,
                    message: "full name, email and password are invalid",
                    body: {}
                },
                400,
                null
            ]
        )
    })

    test("loging in with invalid input", () => {
        let login_body = {
            email: "2348091\e123\x00",
            password: "\x00\xffaskf39403\e31[41;<script>console.log(\"you've been injected\")</script>"
        }
        expect(
            login_request(login_body)
        ).toEqual(
            [
                {
                    ok: false,
                    message: "invalid email and password",
                    body: {}
                },
                400,
                null
            ]
        )
    })

    test("loging in as existing user", () => {
        let login_body = {
            email: "testing@test.com",
            password: "testpassword"
        };
        let result = login_request(login_body);

        expect(result[1]).toBe(200);

        expect(result[2]).not.toBe('');
        expect(result[0].status).toBe('ok');

    })
})
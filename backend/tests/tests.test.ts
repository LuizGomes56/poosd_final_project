import { describe, expect, test } from '@jest/globals'

async function login_request() {
    const response = await fetch(URL_LOGIN,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user_body),
        }
    )

    return response.body, response.status
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

    return response.body, response.status
}

describe('Testing user crendential functionality', () => {
    test('Testing login functionality', () => {
        expect(1).toBe(1);
    })
})
export const BACKEND_ROUTES = {
    "users/logout": "GET",
    "users/login": "POST",
    "users/register": "POST",
    "users/verify": "GET",
    "questions/create": "POST",
    "topics/create": "POST",
    "topics/all": "GET",
} as const;

export const BACKEND_PROTECTED_ROUTES = [
	"users/verify",
	"questions/create",
	"topics/create",
	"topics/all"
] as const;

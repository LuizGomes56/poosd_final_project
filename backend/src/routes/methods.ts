export const BACKEND_ROUTES = {
    "users/logout": "GET",
    "users/login": "POST",
    "users/register": "POST",
    "users/verify": "GET",
    "questions/create": "POST",
    "questions/all": "POST",
    "questions/update": "PATCH",
    "questions/delete": "DELETE",
    "questions/check": "POST",
    "questions/get": "POST",
    "topics/create": "POST",
    "topics/delete": "DELETE",
    "topics/update": "PUT",
    "topics/all": "GET",
} as const;

export const BACKEND_PROTECTED_ROUTES = [
	"users/verify",
	"questions/create",
	"questions/all",
	"questions/update",
	"questions/delete",
	"questions/check",
	"questions/get",
	"topics/create",
	"topics/delete",
	"topics/update",
	"topics/all"
] as const;

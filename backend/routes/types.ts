import { UsersController } from "../controllers/users_controller";

// Return type definition of our routes
export type UsersRoutes = {
    [K in keyof typeof UsersController]:
    Awaited<ReturnType<typeof UsersController[K]>>;
}

// @controllers/users_controller.ts/login
export interface LoginBody {
    email: string;
    password: string;
}

// @controllers/users_controller.ts/register
export interface RegisterBody {
    full_name: string;
    email: string;
    password: string;
}

export type RouteReturnTypes = {
    users: UsersRoutes
}

export type RouteInputTypes = {
    users: {
        login: LoginBody;
        register: RegisterBody;
        logout: {};
    }
}
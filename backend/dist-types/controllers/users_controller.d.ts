import { Request, Response } from "express";
import { HttpStatus } from "../utils/http";
export declare const UsersController: {
    login: (req: Request, res: Response) => Promise<{
        ok: boolean;
        status: HttpStatus;
        message: string;
        body?: undefined;
    } | {
        ok: boolean;
        status: HttpStatus;
        message: string;
        body: {
            token: string;
        };
    }>;
    logout: (req: Request, res: Response) => Promise<{
        ok: boolean;
        status: HttpStatus;
        message: string;
    }>;
    register: (req: Request) => Promise<{
        ok: boolean;
        status: HttpStatus;
        message: string;
    }>;
};

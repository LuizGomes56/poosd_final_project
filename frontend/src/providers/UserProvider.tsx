import type { JwtPayload, UserPayload } from "backend";
import { createContext, useState, useContext, type ReactNode, useEffect } from "react";
import type { SetState } from "../consts";

type UserContextType = {
    user: JwtPayload | null;
    setUser: SetState<UserPayload | null>;
    isAuthenticated: boolean;
    logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserContextType["user"] | null>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const isAuthenticated = Boolean(user);

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    /** Logout local apenas, eliminando o "user", e removendo o token */
    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <UserContext.Provider value={{ user, setUser, isAuthenticated, logout }}>
            {children ?? null}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
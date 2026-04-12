import type { JwtPayload, UserPayload } from "backend";
import { createContext, useState, useContext, type ReactNode } from "react";
import type { SetState } from "../consts";
import { useNavigate } from "react-router-dom";

type UserContextType = {
    user: JwtPayload | null;
    setUser: SetState<UserPayload | null>;
    isAuthenticated: boolean;
    logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserContextType["user"] | null>(null);
    const isAuthenticated = Boolean(user);
    const navigate = useNavigate();

    const logout = () => {
        setUser(null);
        navigate("/login");
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
import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import { useUser } from '../providers/UserProvider';
import { useNotification } from '../providers/NotificationProvider';
import { api } from '../utils/request';

const fetchData = async () => {
    const token = await cookieStore.get("token");

    if (!token?.value) {
        throw new Error("Authentication Token not found. You must log in again");
    }

    return await api("users/verify");
}

const RequireLogin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const { user, setUser, logout } = useUser();
    const { addNotification } = useNotification();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetchData();

                if (!response.ok && response.message) {
                    if ((response.message as any)?.includes("USER_DELETED")) {
                        logout();
                    }
                    throw new Error(response.message);
                }

                setUser(response.body!);
                setIsAuthenticated(true);
            } catch (e) {
                addNotification({
                    type: "error",
                    msg: `Error verifying authentication: ${e instanceof Error ? e.message : String(e)}`,
                    persist: true
                });
                setIsAuthenticated(false);
            }
        };
        if (!user) {
            checkAuth();
        }
        else {
            console.log("!user == false");
            setIsAuthenticated(true);
        }
    }, [user])

    if (isAuthenticated === null) {
        return <Loading />;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default RequireLogin;
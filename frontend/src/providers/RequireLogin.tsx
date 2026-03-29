import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import { useUser } from '../providers/UserProvider';
import { useNotification } from '../providers/NotificationProvider';
import { api } from '../utils/request';

const fetchData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Authentication Token not found. You must log in again");
    }

    return await api("users/register");
}

const RequireLogin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const { user, setUser } = useUser();
    const { addNotification } = useNotification();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetchData();

                console.log(response);

                if (!response.ok && response.message) {
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
            setIsAuthenticated(true);
        }
    }, [user])

    if (isAuthenticated === null) {
        return <Loading />;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default RequireLogin;
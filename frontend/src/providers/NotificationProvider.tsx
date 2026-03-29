import { createContext, useContext, useState, type ReactNode, type ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_NOTIFICATION_TIMEOUT, MAX_NOTIFICATIONS, type NotificationProps } from "../consts";
import { useSkip } from "../hooks";
import { NotificationTopCenter } from "../components/Notification";

type ComponentProps = NotificationProps & {
    id: string;
    destroy: () => void;
};

type ComponentPrototype = ComponentType<{ notifications: ComponentProps[] }>;

type NotificationContextType = {
    notifications: ComponentProps[];
    addNotification: (notify: NotificationProps, Component?: ComponentPrototype) => void;
}
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<ComponentProps[]>([]);
    const [NotificationComponent, setNotificationComponent] = useState<ComponentPrototype | null>(() => NotificationTopCenter);
    const navigate = useNavigate();

    useSkip(() => {
        notifications.forEach(e => {
            if (!e.persist) {
                e.destroy();
            }
        });
    }, [navigate])

    const addNotification = (notify: NotificationProps, Component?: ComponentPrototype) => {
        const id = Date.now().toString();
        const fadeOut = () => {
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isFading: true } : n))
            );
            const removeTimeout = setTimeout(() => {
                setNotifications((prev) => prev.filter((n) => n.id !== id));
            }, 300);
            return () => clearTimeout(removeTimeout);
        };
        const newNotification: ComponentProps = {
            ...notify,
            id,
            destroy: fadeOut,
            isFading: false,
            isVisible: false,
        };
        setNotifications((prev) => {
            if (prev.length >= MAX_NOTIFICATIONS) prev.shift();
            return [...prev, newNotification];
        });
        const showTimeout = setTimeout(() => {
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isVisible: true } : n))
            );
        }, 50);
        if (Component) {
            setNotificationComponent(() => Component);
        }
        let hideTimeout: number | NodeJS.Timeout;
        if (!(notify.vanishTimeout && notify.vanishTimeout === Infinity)) {
            hideTimeout = setTimeout(fadeOut, notify.vanishTimeout || DEFAULT_NOTIFICATION_TIMEOUT);
            return () => {
                clearTimeout(showTimeout);
                clearTimeout(hideTimeout);
            };
        }
        return () => clearTimeout(showTimeout);
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification }}>
            {children}
            {NotificationComponent && <NotificationComponent notifications={notifications} />}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be called inside a NotificationProvider");
    }
    return context;
};
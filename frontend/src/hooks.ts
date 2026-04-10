import { useEffect, useRef, useState } from "react";
import { useUser } from "./providers/UserProvider";
import type { NotificationProps } from "./consts";
import { api } from "./utils/request";

/**
 * Hook that triggers a callback when a click happens outside the referenced element.
 * @param callback Function to be called when the click happens outside the protected elements.
 * @param exceptions Refs that should not trigger this event.
 * @returns Main ref to be passed to the main element.
 */
export function useClickOut<T extends HTMLElement = any>(
    callback: () => void,
    exceptions: React.RefObject<HTMLElement | null>[] = []
) {
    const ref = useRef<T | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                ref.current &&
                !ref.current.contains(target) &&
                !exceptions.some((exception) => exception.current?.contains(target))
            ) {
                callback();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [callback, exceptions]);

    return ref;
};

export function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debounced;
}

/**
 * `useEffect` but Skips first component render 
 */
export function useSkip(fn: () => void, deps: any[] = []) {
    const isMounted = useRef(false);
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }
        fn();
    }, deps);
}

/**
 * This hook is not ready because a route to update the user's data does not exist
 */
export const useUpdateUser = () => {
    const { user, setUser } = useUser();

    const updateUser = async (value: any, id?: string, addNotification: (obj: NotificationProps) => void = () => { }) => {
        if (!id) {
            addNotification({ type: "error", msg: "Internal error (User Id not provided)" });
            return;
        }
        if (!user) {
            addNotification({ type: "error", msg: "Error finding user" });
            return;
        }
        if (user[id as keyof typeof user] == value || user.data[id] == value) {
            addNotification({ type: "info", msg: "No changes were made" });
            return;
        }
        const user_id = user.user_id;
        if (!user_id) {
            addNotification({ type: "error", msg: "Unable to identify the user" });
            return;
        }
        try {
            const response = await api("users/patch" as any, { [id]: value });
            if (response.body) {
                setUser((current) =>
                    current
                        ? {
                            ...current,
                            ...response.body,
                        }
                        : null
                );
                addNotification({ type: "success", msg: "Update successful" });
            }
        } catch (e) {
            addNotification({ type: "error", msg: e instanceof Error ? e.message : String(e) });
        }
    };

    return updateUser;
};
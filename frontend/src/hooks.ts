import { useEffect, useRef, useState } from "react";
import { useUser } from "./providers/UserProvider"; // Fixed path
import type { NotificationProps } from "./consts"; // Fixed path
import { api } from "./utils/request";

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
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [callback, exceptions]);

    return ref;
}

/**
 * Returns a value after a specified delay. 
 * Use this to prevent excessive API calls while typing.
 */
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

    const updateUser = async (
        value: any, 
        id?: string, 
        addNotification: (obj: NotificationProps) => void = () => { }
    ) => {
        if (!id) {
            addNotification({ type: "error", msg: "Internal error: Field ID missing" });
            return;
        }
        if (!user) {
            addNotification({ type: "error", msg: "Session expired. Please log in again." });
            return;
        }

        const currentValue = user[id as keyof typeof user];
        if (currentValue === value) return;

        try {
            const response = await api("users/patch" as any, { [id]: value });

            if (response.ok && response.body) {
                setUser((current: any) =>
                    current ? { ...current, ...response.body } : null
                );
                addNotification({ type: "success", msg: `${id.replace('_', ' ')} updated!` });
            } else {
                addNotification({ type: "error", msg: response.message ?? "Update failed" });
            }
        } catch (e) {
            addNotification({ 
                type: "error", 
                msg: e instanceof Error ? e.message : "Network error" 
            });
        }
    };

    return updateUser;
};
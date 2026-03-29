import { useEffect, useRef, useState } from "react";

/**
 * Hook that triggers a callback when a click happens outside the referenced element.
 * @param callback Function to be called when the click happens outside the protected elements.
 * @param exceptions Refs that should not trigger this event.
 * @returns Main ref to be passed to the main element.
 */
export function useClickOut<T extends HTMLElement = any>(
    callback: () => void,
    exceptions: React.RefObject<HTMLElement>[] = []
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
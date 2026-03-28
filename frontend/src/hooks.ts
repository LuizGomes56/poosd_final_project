import { useEffect, useRef, useState } from "react";

/**
 * Hook que dispara um callback quando um clique ocorre fora do elemento referenciado.
 * @param callback Função a ser chamada quando o clique for fora dos elementos protegidos.
 * @param exceptions Refs que não devem disparar o evento.
 * @returns Ref principal para ser atribuído ao elemento principal.
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
 * Skips first component render 
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
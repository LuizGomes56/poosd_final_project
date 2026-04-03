export const DEFAULT_NOTIFICATION_TIMEOUT = 5000;
export const MAX_NOTIFICATIONS = 7;

export interface NotificationProps {
    persist?: boolean;
    msg?: string;
    type: "success" | "error" | "warning" | "info";
    vanishTimeout?: number;
    isFading?: boolean;
    isVisible?: boolean;
};

export type NotificationFn = (obj: NotificationProps) => void;
export type SetState<T = any> = React.Dispatch<React.SetStateAction<T>>;
export type ActionFn = { id: string, mode: "VIEW" | "UPDATE" | "DELETE" } | null;

export const STYLES = {
    border: "dark:border-zinc-700 not-dark:border-zinc-300",
    borderLight: "not-dark:border-zinc-300",
    borderDark: "dark:border-zinc-700",
    focus: "focus:outline-none focus:ring-1 focus:border-emerald-500 focus:ring-inset focus:ring-emerald-500",
    focusWithin: "focus-within:outline-none focus-within:ring-1 focus-within:border-emerald-500 focus-within:ring-inset focus-within:ring-emerald-500"
} as const;

export type ComponentProps<T = any, U = string> = {
    title?: string,
    id?: string,
    className?: string,
    addNotification?: NotificationFn,
    value: T,
    setValue: SetState<T>,
    iterator?: Record<string, U>,
}

export const TW_COLORS = {
    blue: "dark:text-blue-100 dark:bg-blue-400 not-dark:text-blue-800 not-dark:bg-blue-600",
    cyan: "dark:text-cyan-100 dark:bg-cyan-400 not-dark:text-cyan-800 not-dark:bg-cyan-600",
    emerald: "dark:text-emerald-100 dark:bg-emerald-400 not-dark:text-emerald-800 not-dark:bg-emerald-600",
    fuchsia: "dark:text-fuchsia-100 dark:bg-fuchsia-400 not-dark:text-fuchsia-800 not-dark:bg-fuchsia-600",
    green: "dark:text-green-100 dark:bg-green-400 not-dark:text-green-800 not-dark:bg-green-600",
    indigo: "dark:text-indigo-100 dark:bg-indigo-400 not-dark:text-indigo-800 not-dark:bg-indigo-600",
    lime: "dark:text-lime-100 dark:bg-lime-400 not-dark:text-lime-800 not-dark:bg-lime-600",
    orange: "dark:text-orange-100 dark:bg-orange-400 not-dark:text-orange-800 not-dark:bg-orange-600",
    pink: "dark:text-pink-100 dark:bg-pink-400 not-dark:text-pink-800 not-dark:bg-pink-600",
    purple: "dark:text-purple-100 dark:bg-purple-400 not-dark:text-purple-800 not-dark:bg-purple-600",
    red: "dark:text-red-100 dark:bg-red-400 not-dark:text-red-800 not-dark:bg-red-600",
    rose: "dark:text-rose-100 dark:bg-rose-400 not-dark:text-rose-800 not-dark:bg-rose-600",
    sky: "dark:text-sky-100 dark:bg-sky-400 not-dark:text-sky-800 not-dark:bg-sky-600",
    teal: "dark:text-teal-100 dark:bg-teal-400 not-dark:text-teal-800 not-dark:bg-teal-600",
    violet: "dark:text-violet-100 dark:bg-violet-400 not-dark:text-violet-800 not-dark:bg-violet-600",
    yellow: "dark:text-yellow-100 dark:bg-yellow-400 not-dark:text-yellow-800 not-dark:bg-yellow-600",
} as const;

export function getLogicalColor(text: string, factor: number = 0) {
    const keys = Object.keys(TW_COLORS);
    let hash = factor;
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % keys.length;
    return keys[index] as keyof typeof TW_COLORS;
};

export const translate = (date: Date | string | number | undefined, language: string = "en-US"): string => {
    if (!date) return "N/A";

    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid Date";

    return new Intl.DateTimeFormat(language, {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(d);
}
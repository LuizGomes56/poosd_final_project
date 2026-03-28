
export const DEFAULT_NOTIFICATION_TIMEOUT = 5000;
export const MAX_NOTIFICATIONS = 7;

export interface NotificationProps {
    persist?: boolean,
    msg?: string,
    type: "success" | "error" | "warning" | "info",
    vanishTimeout?: number,
    isFading?: boolean,
    isVisible?: boolean
};
export type NotificationFn = (obj: NotificationProps) => void;
export type SetState<T = any> = React.Dispatch<React.SetStateAction<T>>;
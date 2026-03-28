import type { ReactNode } from "react";
import { UserProvider } from "./UserProvider";
import { NotificationProvider } from "./NotificationProvider";

const Providers = [
    UserProvider,
    NotificationProvider
];

const AppProvider = ({ children }: { children: ReactNode }) => {
    return Providers.reduce(
        (acc, Provider) => <Provider>{acc}</Provider>,
        children
    );
};

export default AppProvider;
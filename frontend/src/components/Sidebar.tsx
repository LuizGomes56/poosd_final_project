import { Navigate, NavLink, useParams } from "react-router-dom";
import { useUser } from "../providers/UserProvider";
import Photo from "./Photo";
import type { JSX } from "react";

type SidebarProps = {
    id: string,
    text: string,
    icon: JSX.Element
}

const SidebarButton = ({
    id,
    text,
    children
}: {
    id: string;
    text: string;
    children: React.ReactNode;
}) => (
    <NavLink
        to={`/settings/${id}`}
        className={({ isActive }) =>
            `flex items-center relative cursor-pointer transition-all duration-200 p-2.5 rounded-lg
            ${isActive
                ? "bg-purple-600 dark:bg-std-pink-700 text-white font-medium"
                : "dark:hover:bg-std-gray-600"
            }`
        }
    >
        <div className="flex items-center gap-3">
            {children ?? null}
            <span>{text}</span>
        </div>
    </NavLink>
);

const Sidebar = ({ pages }: { pages: SidebarProps[] }) => {
    const { tab } = useParams<{ tab?: string }>();
    const { user } = useUser();

    const full_name = user?.full_name || "Unknown";

    const menuItems = pages;
    if (!tab || !menuItems.some(({ id }) => id == tab)) {
        return <Navigate to="/settings/dashboard" replace />;
    }

    return (
        <div className="fixed w-64 z-0 hidden not-dark:bg-white dark:bg-std-gray-850 h-full dark:text-zinc-200 p-4 md:flex flex-col gap-2">
            <NavLink to="/settings/account" className="flex mt-2.5 mb-1.5 gap-4 ml-1">
                <Photo className="w-10 h-10" text={full_name} />
                <div className="flex flex-col overflow-hidden">
                    <span className="leading-4 dark:text-zinc-200 text-md font-medium truncate">{full_name}</span>
                    <span className="leading-7 truncate text-sm dark:text-zinc-400 text-zinc-600">
                        {user?.email || "Email not found"}
                    </span>
                </div>
            </NavLink>
            <div className="flex flex-col gap-2">
                {menuItems.map(({ id, text, icon }) => (
                    <SidebarButton
                        key={id}
                        id={id}
                        text={text}
                    >
                        {icon}
                    </SidebarButton>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
import type React from "react";
import Dashboard from "../components/Dashboard";
import AccountSettings from "./AccountSettings";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const componentMap: Record<string, React.ComponentType> = {
    dashboard: Dashboard,
    account: AccountSettings,
};

const App = () => {
    const { tab } = useParams<{ tab?: string }>();

    const activeTab = tab || "dashboard";
    const ActiveComponent = componentMap[activeTab] || Dashboard;

    const lazy = false;

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-1 bg-white dark:bg-transparent">
                <Sidebar />
                <div className="flex-1 p-4 sm:p-6 md:ml-64 overflow-hidden">
                    {lazy
                        ? <ActiveComponent key={ActiveComponent.name} />
                        : Object.entries(componentMap).map(([key, Component]) => (
                            <div key={Component.name} className={key === activeTab ? "" : "hidden"}>
                                <Component />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default App;
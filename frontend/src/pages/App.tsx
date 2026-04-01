import type React from "react";
import Dashboard from "../components/Dashboard";
import AccountSettings from "./AccountSettings";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { MdGridView } from "react-icons/md";
import { BsPersonCircle } from "react-icons/bs";
import QuestionsPage from "../components/QuestionsPage";
import TopicsPage from "../components/TopicsPage";

const componentMap: Record<string, React.ComponentType> = {
    dashboard: Dashboard,
    questions: QuestionsPage,
    topics: TopicsPage,
    account: AccountSettings,
};

const App = () => {
    const { tab } = useParams<{ tab?: string }>();

    const activeTab = tab || "dashboard";
    const ActiveComponent = componentMap[activeTab] || Dashboard;

    const lazy = false;
    
    //Im sure there is a way to do this more dynamically but it would be a waste to expend that effort here
    let webpages = [
                        { id: "dashboard", text: "Dashboard", icon: <MdGridView className="h-5 w-5" /> },
                        { id: "account", text: "My Account", icon: <BsPersonCircle className="h-5 w-5" /> },
                        {id: "questions", text: "My Questions", icon: <MdGridView className="h-5 w-5" />},
                        {id: "topics", text: "My Topics", icon: <MdGridView className="h-5 w-5" />}];

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-1 bg-white dark:bg-transparent">
                <Sidebar pages={webpages} />
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
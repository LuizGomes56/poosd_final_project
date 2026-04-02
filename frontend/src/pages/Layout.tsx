import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";


export default function Layout() {
    return (
        <div className="flex h-screen overflow-hidden bg-zinc-950">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
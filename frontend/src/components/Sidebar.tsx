import { BsQuestionCircle } from "react-icons/bs";
import { MdGridView, MdLogout, MdTopic } from "react-icons/md"; // Removed MdSettings
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../providers/UserProvider";
import { api } from "../utils/request";
import Photo from "./Photo";

const SidebarButton = ({ to, text, icon }: { to: string; text: string; icon: React.ReactNode }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm transition-all duration-200
            ${isActive
                ? "bg-emerald-500/10 text-emerald-400 font-medium shadow-sm shadow-emerald-500/5"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            }`
        }
    >
        <span className="text-lg">{icon}</span>
        <span>{text}</span>
    </NavLink>
);

export default function Sidebar() {
    const { user, logout } = useUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api("users/logout");
        } catch (e) {
            console.error("Logout request failed:", e);
        }
        logout();
        navigate("/login");
    };

    // Cleaned up: only show core management pages here
    const navItems = [
        { label: "Dashboard", path: "/dashboard", icon: <MdGridView /> },
        { label: "Questions", path: "/dashboard/questions", icon: <BsQuestionCircle /> },
        { label: "Topics", path: "/dashboard/topics", icon: <MdTopic /> },
    ];

    return (
        <aside className="w-64 flex-shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col h-screen fixed md:relative z-10">
            {/* Logo Section */}
            <div className="p-6 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20">
                        🎓
                    </div>
                    <div>
                        <p className="text-white text-sm font-bold leading-tight">EduCMS</p>
                        <p className="text-emerald-500 text-[10px] uppercase tracking-widest font-bold">
                            Instructor
                        </p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 overflow-y-auto">
                {navItems.map((item) => (
                    <SidebarButton 
                        key={item.path} 
                        to={item.path} 
                        text={item.label} 
                        icon={item.icon} 
                    />
                ))}
            </nav>

            <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
                <NavLink 
                    to="/settings/account"
                    className={({ isActive }) => 
                        `flex items-center gap-3 mb-4 p-2 rounded-xl transition-all duration-200 group
                        ${isActive 
                            ? "bg-zinc-800 ring-1 ring-emerald-500/30" 
                            : "hover:bg-zinc-800 hover:ring-1 hover:ring-zinc-700"
                        }`
                    }
                >
                    <Photo 
                        className="w-10 h-10 border border-zinc-700 group-hover:border-emerald-500/50 transition-colors" 
                        text={user?.full_name} 
                    />
                    <div className="overflow-hidden flex-1">
                        <p className="text-white text-xs font-bold truncate group-hover:text-emerald-400 transition-colors">
                            {user?.full_name ?? "Instructor"}
                        </p>
                        <p className="text-zinc-500 text-[10px] truncate">
                            Account Settings
                        </p>
                    </div>
                </NavLink>
                
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-zinc-500 hover:text-red-400 hover:bg-red-400/5 rounded-lg text-xs font-medium transition-all group"
                >
                    <MdLogout className="text-lg group-hover:-translate-x-1 transition-transform" />
                    <span>Sign out</span>
                </button>
            </div>
        </aside>
    );
}
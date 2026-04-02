import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../providers/UserProvider";
import Table from "../components/Table";
import { translate, type ActionFn } from "../consts";

export default function Dashboard() {
    const { user } = useUser();
    const [_action, setAction] = useState<ActionFn>(null);

    // Placeholder stats (Mocking some data for the UI)
    const stats = {
        topicsCount: 3,
        questionsCount: 168,
    };

    const firstName = user?.full_name?.split(" ")[0] ?? "Instructor";

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-white text-3xl font-bold">Dashboard</h1>
                <p className="text-zinc-500 text-sm">Welcome back, {firstName}</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-teal-400 text-xl font-bold">◈</span>
                        <span className="text-teal-400 text-[10px] uppercase tracking-wider bg-teal-400/10 px-2 py-0.5 rounded-full font-bold">
                            topics
                        </span>
                    </div>
                    <p className="text-white text-3xl font-bold">{stats.topicsCount}</p>
                    <p className="text-zinc-500 text-xs mt-1">Total Categories</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-emerald-400 text-xl font-bold">?</span>
                        <span className="text-emerald-400 text-[10px] uppercase tracking-wider bg-emerald-400/10 px-2 py-0.5 rounded-full font-bold">
                            bank
                        </span>
                    </div>
                    <p className="text-white text-3xl font-bold">{stats.questionsCount}</p>
                    <p className="text-zinc-500 text-xs mt-1">Total Questions</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 flex flex-col gap-4 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-800">
                        <h2 className="text-white text-sm font-bold">Recent Question Topics</h2>
                        <Link to="/dashboard/topics" className="text-emerald-400 text-xs hover:underline">
                            View all →
                        </Link>
                    </div>
                    <div className="p-2">
                        <Table
                            checkboxes
                            actions={setAction}
                            btnText="Edit"
                            cols={[
                                { size: "1fr" },
                                { size: "1fr" },
                                { size: "fit-content(100%)" }
                            ]}
                            pattern={{
                                header: [
                                    { name: "Topics", style: "pl-6 pr-4" },
                                    { name: "Questions" },
                                    { name: "Created" },
                                ],
                                body: [
                                    ["1", [
                                        { value: "Mathematics", style: "pl-6 pr-4 font-medium text-emerald-400" },
                                        { value: "52" },
                                        { value: translate(new Date(), "en-US") }
                                    ]],
                                    ["2", [
                                        { value: "Physics", style: "pl-6 pr-4 font-medium text-emerald-400" },
                                        { value: "22" },
                                        { value: translate(new Date(Date.now() - 86400000), "en-US") }
                                    ]],
                                ]
                            }}
                        />
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden h-fit">
                    <div className="px-6 py-4 border-b border-zinc-800">
                        <h2 className="text-white text-sm font-bold">Quick Actions</h2>
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                        {[
                            { label: "New Question", icon: "+", color: "text-emerald-400 bg-emerald-400/10", path: "/dashboard/questions/new" },
                            { label: "Manage Topics", icon: "◈", color: "text-teal-400 bg-teal-400/10", path: "/dashboard/topics" },
                            { label: "Question Bank", icon: "?", color: "text-amber-400 bg-amber-400/10", path: "/dashboard/questions" },
                        ].map((action) => (
                            <Link
                                key={action.label}
                                to={action.path}
                                className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-700 group"
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${action.color}`}>
                                    {action.icon}
                                </div>
                                <span className="text-white text-xs font-medium flex-1">{action.label}</span>
                                <span className="text-zinc-600 group-hover:text-white transition-colors">→</span>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
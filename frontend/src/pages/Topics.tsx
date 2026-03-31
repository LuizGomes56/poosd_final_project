import { useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import SearchInput from "../components/SearchInput";
import Button from "../components/Button";
import TopicCard, { type Topic } from "../components/TopicCard";
import { TopicFormModal, TopicDeleteModal } from "../components/TopicModals";
// import api

// mock data until API is fully ready
const MOCK_TOPICS: Topic[] = [
    { id: "1", title: "Mathematics",     description: "Algebra, geometry, calculus",        icon: "📐", questionCount: 18 },
    { id: "2", title: "History",         description: "World history from ancient to modern", icon: "🌍", questionCount: 14 },
    { id: "3", title: "Science",         description: "Biology, chemistry and physics",       icon: "🧪", questionCount: 21 },
    { id: "4", title: "Language Arts",   description: "Writing, grammar, literature",         icon: "✏️", questionCount: 11 },
    { id: "5", title: "Computer Science",description: "Programming and algorithms",           icon: "💻", questionCount: 24 },
];

export default function Topics() {
    const [topics, setTopics]           = useState<Topic[]>(MOCK_TOPICS);
    const [search, setSearch]           = useState("");

    // modal state
    const [editingTopic,   setEditingTopic]   = useState<Partial<Topic> | null>(null);
    const [deletingTopic,  setDeletingTopic]  = useState<Topic | null>(null);
    const [showCreate,     setShowCreate]     = useState(false);

    const filtered = topics.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
    );

    // Handlers

    const handleCreate = async (data: Pick<Topic, "title" | "description" | "icon">) => {
        // TODO: const res = await api("topics/create", data);
        const newTopic: Topic = { ...data, id: Date.now().toString(), questionCount: 0 };
        setTopics(prev => [...prev, newTopic]);
        setShowCreate(false);
    };

    const handleEdit = async (data: Pick<Topic, "title" | "description" | "icon">) => {
        if (!editingTopic?.id) return;
        // TODO: api
        setTopics(prev =>
            prev.map(t => t.id === editingTopic.id ? { ...t, ...data } : t)
        );
        setEditingTopic(null);
    };

    const handleDelete = async () => {
        if (!deletingTopic) return;
        // TODO: api
        setTopics(prev => prev.filter(t => t.id !== deletingTopic.id));
        setDeletingTopic(null);
    };

    // Render

    return (
        <div className="flex flex-col gap-6 p-6 md:p-8 min-h-screen dark:bg-std-gray-900 dark:text-zinc-200">

            {/* Page header */}
            <div className="flex flex-col gap-0.5">
                <p className="text-xs dark:text-zinc-500 text-zinc-400">
                    dashboard /{" "}
                    <span className="dark:text-zinc-300 text-zinc-600">topics</span>
                </p>
                <h1 className="text-2xl font-bold dark:text-white">Topics</h1>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <SearchInput
                    text="Search topics..."
                    search={search}
                    setSearch={setSearch}
                />
                <Button
                    text="+ New Topic"
                    onClick={() => setShowCreate(true)}
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.length === 0 && search ? (
                    <div className="col-span-full text-center py-16 dark:text-zinc-500 text-zinc-400">
                        No topics match &quot;{search}&quot;
                    </div>
                ) : (
                    <>
                        {filtered.map(topic => (
                            <div key={topic.id} className="group">
                                <TopicCard
                                    topic={topic}
                                    onEdit={setEditingTopic}
                                    onDelete={setDeletingTopic}
                                />
                            </div>
                        ))}

                        {/* New topic placeholder card — hidden while searching */}
                        {!search && (
                            <button
                                onClick={() => setShowCreate(true)}
                                className="
                                    flex flex-col items-center justify-center gap-2 p-5 rounded-xl
                                    border-2 border-dashed dark:border-std-gray-700 border-zinc-200
                                    dark:text-zinc-600 text-zinc-400
                                    dark:hover:border-purple-600 dark:hover:text-purple-400
                                    hover:border-purple-400 hover:text-purple-500
                                    transition-colors duration-200 min-h-[160px]
                                "
                            >
                                <IoAddOutline className="w-6 h-6" />
                                <span className="text-sm font-medium">New topic</span>
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* Modals */}
            {showCreate && (
                <TopicFormModal
                    topic={{}}
                    onClose={() => setShowCreate(false)}
                    onSave={handleCreate}
                />
            )}
            {editingTopic && (
                <TopicFormModal
                    topic={editingTopic}
                    onClose={() => setEditingTopic(null)}
                    onSave={handleEdit}
                />
            )}
            {deletingTopic && (
                <TopicDeleteModal
                    topic={deletingTopic}
                    onClose={() => setDeletingTopic(null)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
}

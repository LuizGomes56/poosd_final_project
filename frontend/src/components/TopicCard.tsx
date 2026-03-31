import {BiPencil, BiTrash } from "react-icons/bi";

export interface Topic {
    id: string;
    title: string;
    description: string;
    icon: string;
    questionCount: number;
}

const TopicCard = ({
    topic,
    onEdit,
    onDelete,
}: {
    topic: Topic;
    onEdit: (topic: Topic) => void;
    onDelete: (topic: Topic) => void;
}) => (
    <div className="
        relative flex flex-col gap-3 p-5 rounded-xl
        dark:bg-std-gray-800 border dark:border-transparent
        border-zinc-200 dark:hover:bg-std-gray-750
        transition-colors duration-200
    ">
        {/* On hover actions */}
        <div className="absolute top-3.5 right-3.5 flex gap-1.5 opacity-0 group-hover:opacity-100 [div:hover>div>&]:opacity-100 transition-opacity duration-150">
            <button
                onClick={() => onEdit(topic)}
                className="p-1.5 rounded-md dark:bg-std-gray-700 dark:hover:bg-std-gray-600 text-zinc-400 hover:text-white transition-colors duration-150"
                title="Edit"
            >
                <BiPencil className="w-3.5 h-3.5" />
            </button>
            <button
                onClick={() => onDelete(topic)}
                className="p-1.5 rounded-md dark:bg-std-gray-700 dark:hover:bg-red-900 text-zinc-400 hover:text-red-400 transition-colors duration-150"
                title="Delete"
            >
                <BiTrash className="w-3.5 h-3.5" />
            </button>
        </div>

        {/* Icon */}
        <div className="w-10 h-10 flex items-center justify-center rounded-lg dark:bg-std-gray-700 text-xl">
            {topic.icon}
        </div>

        {/* Title & description */}
        <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-white">{topic.title}</span>
            <span className="text-sm dark:text-zinc-400 text-zinc-500 leading-snug">
                {topic.description}
            </span>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mt-1">
            <div className="flex flex-col">
                <span className="text-lg font-bold text-blue-400">{topic.questionCount}</span>
                <span className="text-[11px] uppercase tracking-wide dark:text-zinc-500 text-zinc-400">
                    questions
                </span>
            </div>
        </div>
    </div>
);

export default TopicCard;

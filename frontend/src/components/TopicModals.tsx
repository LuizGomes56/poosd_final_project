import { useState, useEffect } from "react";
import { Field } from "../components/Form";
import Button from "../components/Button";
import type { Topic } from "./TopicCard";

// Overlay wrapper

const Overlay = ({ onClose, children }: { onClose: () => void; children: React.ReactNode }) => (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
    >
        <div
            className="w-full max-w-md rounded-xl dark:bg-std-gray-850 border dark:border-std-gray-700 border-zinc-200 p-6 flex flex-col gap-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    </div>
);

// Create edit modal 

export const TopicFormModal = ({
    topic,
    onClose,
    onSave,
}: {
    topic: Partial<Topic> | null;
    onClose: () => void;
    onSave: (data: Pick<Topic, "title" | "description" | "icon">) => void;
}) => {
    const isEdit = Boolean(topic?.id);

    const [title, setTitle] = useState(topic?.title ?? "");
    const [description, setDescription] = useState(topic?.description ?? "");
    const [icon, setIcon] = useState(topic?.icon ?? "📚");

    // resync
    useEffect(() => {
        setTitle(topic?.title ?? "");
        setDescription(topic?.description ?? "");
        setIcon(topic?.icon ?? "📚");
    }, [topic]);

    return (
        <Overlay onClose={onClose}>
            <h2 className="text-lg font-semibold dark:text-white">
                {isEdit ? "Edit Topic" : "New Topic"}
            </h2>

            <Field name="Icon (emoji)" value={icon} hook={setIcon} placeholder="e.g. 📐" />
            <Field name="Title" value={title} hook={setTitle} placeholder="Topic title" />
            <Field name="Description" value={description} hook={setDescription} placeholder="Short description" />

            <div className="flex justify-end gap-3 mt-1">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm rounded-lg dark:bg-std-gray-700 dark:hover:bg-std-gray-600 dark:text-zinc-300 transition-colors duration-150"
                >
                    Cancel
                </button>
                <Button
                    text={isEdit ? "Save Changes" : "Create Topic"}
                    disabled={!title.trim()}
                    onClick={() => onSave({ title, description, icon })}
                />
            </div>
        </Overlay>
    );
};

// Delete confirm modal

export const TopicDeleteModal = ({
    topic,
    onClose,
    onConfirm,
}: {
    topic: Topic;
    onClose: () => void;
    onConfirm: () => void;
}) => (
    <Overlay onClose={onClose}>
        <h2 className="text-lg font-semibold dark:text-white">Delete Topic</h2>
        <p className="text-sm dark:text-zinc-400 leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold dark:text-white">{topic.title}</span>?
            This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3 mt-1">
            <button
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-lg dark:bg-std-gray-700 dark:hover:bg-std-gray-600 dark:text-zinc-300 transition-colors duration-150"
            >
                Cancel
            </button>
            <button
                onClick={onConfirm}
                className="px-5 py-2 text-sm font-semibold rounded-lg bg-red-700 hover:bg-red-600 text-white transition-colors duration-150"
            >
                Delete
            </button>
        </div>
    </Overlay>
);

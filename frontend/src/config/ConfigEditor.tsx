import type { ComponentType } from "react";
import { useSkip, useUpdateUser } from "../hooks";
import { type ComponentProps } from "../consts";

type GenT<T = any> = ComponentProps<T>;

const ConfigEditor = <T,>({
    Component,
    ...props
}: GenT<T> & { Component: ComponentType<GenT<T>> }) => {
    const { id, value, title, addNotification } = props;
    const updateUser = useUpdateUser();

    useSkip(() => {
        const timeout = setTimeout(() => {
            updateUser(value, id, (addNotification ? addNotification : () => void 0));
        }, 500); 

        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <div className="w-full px-6 py-5 hover:bg-zinc-800/30 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                    <h2 className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-1">
                        {title}
                    </h2>
                    <div className="max-w-md">
                        <Component {...props} />
                    </div>
                </div>
                
                {/* Visual indicator that it saves automatically */}
                <div className="text-[10px] text-zinc-600 italic self-end sm:self-center">
                    Auto-saves on change
                </div>
            </div>
        </div>
    );
};

export default ConfigEditor;
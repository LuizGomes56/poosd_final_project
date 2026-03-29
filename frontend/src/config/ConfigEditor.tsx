import type { ComponentType } from "react";
import { useSkip, useUpdateUser } from "../hooks";
import { STYLES, type ComponentProps } from "../consts";

type GenT<T = any> = ComponentProps<T>;

const ConfigEditor = <T,>({
    Component,
    ...props
}: GenT<T> & { Component: ComponentType<GenT<T>> }) => {
    const { id, value, title, addNotification } = props;
    const updateUser = useUpdateUser();

    useSkip(() => {
        /**
         * TODO: Verify if this id is in fact suitable to find the user using mongodb
         * ? maybe it comes as `user._id` from the API?
         */
        updateUser(value, id, (addNotification ? addNotification : () => void 0));
    }, [value]);

    return (
        <div className={`w-full dark:text-zinc-200 border-b ${STYLES.border} pb-6`}>
            <div className="flex flex-col gap-2">
                <h2 className="dark:text-white h-10 content-center">{title}</h2>
                <Component {...props} />
            </div>
        </div>
    );
};

export default ConfigEditor;
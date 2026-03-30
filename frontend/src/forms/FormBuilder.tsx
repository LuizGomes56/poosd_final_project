import type { FormEvent, ReactNode } from "react";
import { FaTimes } from "react-icons/fa";
import { useClickOut } from "../hooks";
import type { SetState } from "../consts";

const FormBuilder = ({
    show,
    setShow,
    handleSubmit = () => { },
    handleReset,
    children,
    className = ""
}: {
    show: boolean,
    setShow: SetState<boolean>,
    handleSubmit?: (e: FormEvent) => void,
    handleReset?: (e: FormEvent) => void,
    children: ReactNode,
    className?: string
}) => {
    const formRef = useClickOut(() => setShow(false));
    return (
        <div className={`flex justify-center py-8 px-4 sm:px-0 items-center fixed top-0 left-0 w-full h-full bg-black/50 z-50 ${show ? "" : "hidden"}`}>
            <form
                onReset={handleReset || (() => {
                    setShow(false);
                })}
                onSubmit={handleSubmit}
                ref={formRef}
                className={`flex max-h-full overflow-y-auto relative flex-col w-full gap-6 p-8 bg-white dark:bg-std-gray-700 
                rounded-xl dark:shadow-std-neutral-700 ${className} ${!className.includes("max-w") ? "w-full max-w-xl" : ""}`}
            >
                <>
                    <FaTimes
                        className="h-5 w-5 absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                        onClick={() => setShow(false)}
                    />
                    {children}
                </>
            </form>
        </div>
    )
}

export default FormBuilder;
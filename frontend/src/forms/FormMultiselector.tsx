import { useRef, useState } from "react";
import { TbChevronDown } from "react-icons/tb";
import { useClickOut } from "../hooks";
import { STYLES, type SetState } from "../consts";

type EditFieldProps = {
    id: string,
    value: string[],
    setValue: SetState<string[]>,
    title?: string,
    iterator: Record<string, string>,
    text?: string
}

const FormMultiselector = ({ id, value, setValue, iterator, title, text = "Selected: " + value.length }: EditFieldProps) => {
    const [allowEdit, setAllowEdit] = useState<boolean>(false);

    const buttonRef = useRef(null);
    const dropdownRef = useClickOut(() => setAllowEdit(false), [buttonRef]);

    return (
        <div className="flex flex-col gap-2">
            {title && <h2 className="font-semibold dark:text-white">
                {title}
            </h2>}
            <div className={`
                relative w-full flex flex-col bg-transparent transition-colors duration-200
                border-b-2 focus:outline-none font-medium rounded-t-md
                dark:border-zinc-600 ${STYLES.borderLight}
                dark:text-zinc-400 not-dark:text-zinc-600 
                dark:focus-within:border-b-sky-400 not-dark:focus-within:border-b-sky-500
                dark:focus-within:text-sky-400 not-dark:focus-within:text-sky-500 
                ${allowEdit
                    ? `
                    dark:text-sky-500 not-dark:text-sky-500
                    dark:border-b-sky-500 not-dark:border-b-sky-500`
                    : `
                    dark:hover:text-emerald-400 not-dark:hover:text-emerald-500
                    dark:hover:border-b-emerald-400 not-dark:hover:border-b-emerald-400
                `}
            `}>
                <button
                    ref={buttonRef}
                    className="flex items-center focus:outline-none gap-3 flex-1 justify-between py-3 px-4 rounded-lg"
                    onClick={() => setAllowEdit(current => !current)}
                    type="button"
                >
                    <span>
                        {text}
                    </span>
                    <TbChevronDown className="h-5 w-5" />
                </button>
                {allowEdit && <div
                    ref={dropdownRef}
                    className={`
                        absolute z-10 top-14 w-full max-h-56 overflow-y-auto flex flex-col
                        dark:text-zinc-300 text-zinc-700 
                        not-dark:bg-white dark:bg-std-gray-850
                    `}>
                    {Object.entries(iterator).map(([key, val], index) => (
                        <label
                            key={index}
                            className="
                                dark:has-checked:bg-violet-700
                                not-dark:has-checked:text-white
                                has-checked:font-medium
                                relative py-1.5 px-5
                                not-dark:hover:bg-zinc-200
                                not-checked:dark:hover:bg-zinc-700
                                has-checked:dark:hover:bg-red-900
                                transition-colors duration-200
                            "
                        >
                            <input
                                defaultChecked={value.includes(key)}
                                type="checkbox"
                                name={id}
                                value={key}
                                onChange={() => {
                                    setValue((prev) => {
                                        if (!prev) return [key];
                                        if (prev.includes(key)) {
                                            return prev.filter(item => item !== key);
                                        }
                                        return [...prev, key];
                                    });
                                }}
                                className="appearance-none absolute"
                            />
                            <span>{val}</span>
                        </label>
                    ))}
                </div>}
            </div>
        </div>
    )
}

export default FormMultiselector;
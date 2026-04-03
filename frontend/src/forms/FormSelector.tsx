import { useRef, useState } from "react";
import { TbChevronDown } from "react-icons/tb";
import { useClickOut } from "../hooks";
import { STYLES, type SetState } from "../consts";

type EditFieldProps = {
    id: string,
    value: any,
    setValue: SetState<any>,
    title?: string,
    iterator: Record<string, string>
}

const FormSelector = ({ id, value, setValue, iterator, title }: EditFieldProps) => {
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
                        {iterator[value] || "Undefined"}
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
                            className="not-dark:has-checked:bg-violet-700 dark:has-checked:hover:bg-violet-700 
                            has-checked:text-white has-checked:font-medium relative py-1.5 px-5 
                            not-dark:hover:bg-zinc-200 dark:hover:bg-zinc-700 
                            transition-colors duration-200"
                        >
                            <input
                                defaultChecked={key === value}
                                type="radio"
                                name={id}
                                onChange={() => setValue(key)}
                                className="appearance-none absolute peer"
                            />
                            <span>{val}</span>
                        </label>
                    ))}
                </div>}
            </div>
        </div>
    )
}

export default FormSelector;
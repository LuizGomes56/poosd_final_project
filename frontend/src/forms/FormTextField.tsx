import { useRef } from "react";
import type { SetState } from "../consts";
//Honestly since I am passing so many style strings 
//Perhaps it may be better to change this to a style
//object rather than doing this individually
const FormTextField = ({
    id,
    title,
    placeholder = "",
    value,
    setValue,
    maxLength = 40,
    titleStyle,
    placeholderStyle,
    divStyle
}: {
    id: string,
    value: any,
    setValue: SetState<any>,
    title: React.ReactNode,
    placeholder?: string,
    maxLength?: number,
    titleStyle?: string,
    placeholderStyle?: string,
    divStyle?: string,
}) => {
    // placeholders once set, cannot be changed
    const readonlyPlaceholder = useRef(placeholder);
    return (
        <div className={divStyle || "flex flex-col gap-2"}>
            <label htmlFor={id} className={titleStyle || "font-semibold dark:text-white"}>
                {title}
            </label>
            <input
                id={id}
                type="text"
                maxLength={maxLength}
                value={value || ""}
                placeholder={readonlyPlaceholder.current}
                onChange={(e) => setValue(e.target.value)}
                className={placeholderStyle || `
                py-3 px-4 rounded-t-md bg-transparent transition-colors duration-200 font-medium
                border-b-2 border-zinc-600 focus:outline-none
                hover:border-b-emerald-400
                hover:placeholder:text-emerald-400
                hover:text-emerald-400
                text-zinc-400 
                focus:border-b-sky-400
                focus:text-sky-400 
                focus:placeholder:text-sky-400
                placeholder:text-zinc-400
            `}
            />
        </div>
    )
}

export default FormTextField
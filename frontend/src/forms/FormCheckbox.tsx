import { BiCheck } from "react-icons/bi";
import type { SetState } from "../consts";

export default function FormCheckbox({
    id,
    title,
    value,
    setValue,
    label,
    className = ""
}: {
    className?:
    string,
    id:
    string,
    value:
    boolean,
    setValue:
    SetState<boolean | null>,
    title:
    string,
    placeholder?: string, label: string
}) {
    return (
        <div className="flex flex-col gap-4 mb-2">
            <h2 className="font-semibold text-white">{title}</h2>
            <div className={`mx-4 ${className}`}>
                <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        name={id}
                        checked={value}
                        onChange={() => setValue(prev => !prev)}
                        className="hidden peer"
                    />
                    <div className="
                    aspect-square h-6 border-2 border-zinc-500 peer-checked:bg-violet-600 
                    rounded flex items-center justify-center peer-checked:border-violet-600
                ">
                        {value && <BiCheck className="text-white h-5 w-5" />}
                    </div>
                    <span className="text-zinc-400 peer-checked:text-white">{label}</span>
                </label>
            </div>
        </div>
    )
}
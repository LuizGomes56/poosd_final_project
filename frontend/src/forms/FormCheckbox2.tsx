import { BiCheck } from "react-icons/bi";
import type { SetState } from "../consts";

const FormCheckbox2 = ({
    id,
    title,
    value,
    setValue,
    iterator,
    className = ""
}: {
    className?: string,
    id: string,
    value: any,
    setValue: SetState<any[]>,
    title: string,
    placeholder?: string,
    iterator: Record<string, string>
}) => (
    <div className="flex flex-col gap-4 mb-2">
        <h2 className="font-semibold text-white">{title}</h2>
        <div className={`grid-cols-1 sm:grid-cols-2 gap-4 mx-4 ${className ? className : "grid"}`}>
            {Object.entries(iterator).map(([key,
                val],
                index) => (
                <label
                    key={index}
                    className="flex items-center gap-3 cursor-pointer select-none"
                >
                    <input
                        type="checkbox"
                        name={id}
                        checked={value.includes(key)}
                        onChange={() =>
                            setValue((prev) =>
                                prev.includes(key) ? prev.filter((v) => v !== key) : [...prev,
                                    key]
                            )
                        }
                        className="hidden peer"
                    />
                    <div className="aspect-square h-6 border-2 border-zinc-500 peer-checked:bg-violet-600 rounded flex items-center justify-center peer-checked:border-violet-600">
                        {value.includes(key) && <BiCheck className="text-white h-5 w-5" />}
                    </div>
                    <span className="text-zinc-400 peer-checked:text-white">{val}</span>
                </label>
            ))}
        </div>
    </div>
)
export default FormCheckbox2;
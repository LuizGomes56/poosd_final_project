type FieldProps = {
    key?: string,
    name: string,
    type?: string,
    value: string,
    placeholder?: string,
    textStyle?: string,
    spanStyle?: string,
    hook: (value: string) => void
}

export const Field = ({ name, value, placeholder, hook, type, textStyle, spanStyle, key }: FieldProps) => {
    return (
        <label key={key+"-label"} className="w-full flex flex-col gap-2">
            <span key={key+"-span"} className={spanStyle ? spanStyle : "font-medium text-lg border-b-2 pb-1 border-b-zinc-600"}>
            {name}
        </span><input
                key={key+"input"}
                type={type || "text"}
                value={value}
                placeholder={placeholder}
                className={textStyle ? textStyle : "py-2 border border-zinc-700 rounded-md px-4"}
                onChange={(e) => hook(e.target.value)} />
        </label>
    )
}
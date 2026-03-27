type FieldProps = {
    name: string,
    value: string,
    placeholder?: string,
    hook: (value: string) => void
}

export const Field = ({ name, value, placeholder, hook }: FieldProps) => {
    return (
        <label className="w-full flex flex-col gap-2">
            <span className="
                font-medium text-lg border-b-2 pb-1 
                border-b-zinc-600"
            >
                {name}
            </span>
            <input
                type="text"
                value={value}
                placeholder={placeholder}
                className="py-2 border border-zinc-700 rounded-md px-4"
                onChange={(e) => hook(e.target.value)}
            />
        </label>
    )
}
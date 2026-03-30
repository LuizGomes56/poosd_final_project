import type { FormEvent } from "react"
import Button from "../components/Button"

const FormButton = ({
    type,
    text,
    onClick,
    className = "",
    disabled = false
}: {
    disabled?: boolean,
    type: "button" | "submit" | "reset",
    text: string,
    className?: string,
    onClick?: (e: FormEvent) => void
}) => (
    <Button
        disabled={disabled}
        type={type}
        text={text}
        onClick={onClick}
        className={`w-full py-2! sm:w-28 ${className ? className : "bg-zinc-500 dark:bg-zinc-700 hover:bg-zinc-600 dark:hover:bg-zinc-600"}`}
    />
)

export default FormButton
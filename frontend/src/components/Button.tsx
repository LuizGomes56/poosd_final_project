import type { TW_COLORS } from "../consts"

const Button = ({
    disabled = false,
    type = "button",
    color = "purple",
    text,
    onClick,
    className = ""
}: {
    disabled?: boolean,
    type?: "button" | "submit" | "reset",
    className?: string, text: string, onClick?: (...args: any[]) => any
    color?: keyof typeof TW_COLORS
}) => (
    <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={`px-6 py-2.5 text-nowrap transition-colors duration-200 font-medium 
            text-white rounded-lg bg-${color}-700
            shadow not-dark:shadow-zinc-400 dark:shadow-zinc-900
            not-dark:dark:bg-${color}-700 dark:hover:bg-${color}-600 ${className}`}
    >
        <span className="dark:text-std-shadow-0.5 font-medium">
            {text}
        </span>
    </button>
)

export default Button
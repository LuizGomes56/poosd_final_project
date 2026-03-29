import { TW_COLORS } from "../consts"

const ColoredButton = ({
    disabled = false,
    color,
    children,
    onClick,
    className = ""
}: {
    disabled?: boolean,
    className?: string,
    onClick?: () => void,
    color: keyof typeof TW_COLORS,
    children?: React.ReactNode
}) => (
    <button
        disabled={disabled}
        type="button"
        onClick={onClick}
        className={`px-3 text-center py-1.5 w-full text-sm font-medium rounded-md truncate
        bg-opacity-20 dark:bg-opacity-20 ${TW_COLORS[color]} ${className}
    `}>
        {children ?? null}
    </button>
)

export default ColoredButton
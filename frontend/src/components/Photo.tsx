import { getLogicalColor, TW_COLORS } from "../consts";

const Photo = ({
    factor,
    className = "",
    text = "",
    onClick,
    color
}: {
    factor?: number,
    onClick?: () => void,
    className?: string,
    text?: string | null,
    color?: string
}) => {
    const getNameInitials = (name: string | null | undefined) => {
        if (!name) return "??";
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    const themeColor = color ? color : TW_COLORS[getLogicalColor(text || "Unknown", factor)];

    return (
        <div
            onClick={onClick}
            className={`
                rounded-full aspect-square flex items-center justify-center
                font-bold tracking-tighter select-none
                bg-opacity-20 transition-transform active:scale-95
                ${onClick ? "cursor-pointer" : ""}
                ${className}
                ${themeColor}
            `}
        >
            <span className="text-std-shadow-0.5">
                {getNameInitials(text)}
            </span>
        </div>
    );
};

export default Photo;
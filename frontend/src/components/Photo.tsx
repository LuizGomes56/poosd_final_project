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
    return (
        <div
            onClick={onClick}
            className={`
            rounded-full aspect-square content-center text-center shrink-0
            bg-opacity-20 overflow-hidden ${className}
            ${color ? color : TW_COLORS[getLogicalColor(text || "", factor)]}`}
        >
            {(text?.split(" ")?.[0]?.charAt(0).toUpperCase() || "&")
                + (text?.split(" ")?.[1]?.charAt(0).toUpperCase() || "")}
        </div>
    );
};

export default Photo;
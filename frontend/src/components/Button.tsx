type ButtonProps = {
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    className?: string;
    text: string;
    onClick?: (...args: any[]) => any;
    color?: "emerald" | "purple" | "zinc" | "red";
};

const Button = ({
    disabled = false,
    type = "button",
    text,
    onClick,
    className = "",
    color = "emerald"
}: ButtonProps) => {
    
    const colorVariants = {
        emerald: "bg-emerald-600 hover:bg-emerald-500 text-black shadow-emerald-950/20",
        purple: "bg-purple-700 hover:bg-purple-600 text-white shadow-purple-950/20",
        zinc: "bg-zinc-800 hover:bg-zinc-700 text-white shadow-black/20",
        red: "bg-red-600 hover:bg-red-500 text-white shadow-red-950/20"
    };

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`
                px-6 py-2.5 text-nowrap transition-all duration-200 
                font-bold rounded-lg shadow-lg
                disabled:opacity-50 disabled:cursor-not-allowed
                active:scale-[0.98]
                ${colorVariants[color]} 
                ${className}
            `}
        >
            <span className="flex items-center justify-center gap-2">
                {text}
            </span>
        </button>
    );
};

export default Button;
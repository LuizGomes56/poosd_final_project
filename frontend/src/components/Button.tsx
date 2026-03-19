export interface ButtonProps {
    color: string;
    text: string;
    id?: string;
    onClick?: () => void;
    extraClasses?: string;
}

export default function Button(props: ButtonProps) {
    const { color, text, id, onClick, extraClasses } = props;

    return (
        <button
            type="submit"
            id={id}
            className={`
                min-w-28 transition-all duration-300 
                hover:bg-${color}-400 hover:border-b-${color}-600 
                font-medium w-full p-2 text-white bg-${color}-500 
                border-b-4 border-b-${color}-700 rounded ${extraClasses}
            `}
            onClick={onClick}
        >
            {text}
        </button>
    );
};
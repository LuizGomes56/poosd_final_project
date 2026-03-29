const Checkbox = ({ onEvent, enabled }: { onEvent: () => void, enabled: boolean }) => {
    return (
        <button
            aria-label="checkbox"
            type="button"
            className={`relative h-6 flex items-center w-12 ${enabled ? "bg-emerald-700" : "bg-pink-800"} rounded-full cursor-pointer transition-colors duration-200`}
            onClick={onEvent}
        >
            <span
                className={`absolute left-0.5 w-5 bg-white h-5 ${enabled && "transform translate-x-6"} rounded-full transition-transform! duration-200 flex items-center justify-center`}
            >
                {enabled ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m5.179 9.104 5.16-5.16a.75.75 0 0 0-1.06-1.061L4.652 7.51 2.738 5.57c-.702-.713-1.77.34-1.068 1.053l2.446 2.48c.344.346.775.27 1.043.02a.785.785 0 0 0 .02-.019Z" fill="#047857"></path></svg>
                ) : <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.3 2.3a.75.75 0 011.06 0L6 4.94l2.64-2.64a.75.75 0 111.06 1.06L7.06 6l2.64 2.64a.75.75 0 11-1.06 1.06L6 7.06 3.36 9.7a.75.75 0 11-1.06-1.06L4.94 6 2.3 3.36a.75.75 0 010-1.06z" fill="#9d174d" />
                </svg>}
            </span>
        </button>
    );
};

export default Checkbox;
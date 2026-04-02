const Checkbox = ({ onEvent, enabled }: { onEvent: () => void, enabled: boolean }) => {
    return (
        <button
            aria-label="Toggle setting"
            type="button"
            className={`
                relative h-6 w-11 flex items-center rounded-full cursor-pointer 
                transition-all duration-300 ease-in-out
                ${enabled ? "bg-emerald-500 shadow-lg shadow-emerald-500/20" : "bg-zinc-700"}
            `}
            onClick={onEvent}
        >
            <span
                className={`
                    absolute left-0.5 w-5 h-5 bg-white rounded-full 
                    transition-transform duration-300 ease-in-out flex items-center justify-center
                    ${enabled ? "translate-x-5" : "translate-x-0"}
                    shadow-sm
                `}
            >
                {enabled ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path 
                            d="m5.179 9.104 5.16-5.16a.75.75 0 0 0-1.06-1.061L4.652 7.51 2.738 5.57c-.702-.713-1.77.34-1.068 1.053l2.446 2.48c.344.346.775.27 1.043.02a.785.785 0 0 0 .02-.019Z" 
                            fill="#10b981" 
                        />
                    </svg>
                ) : (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path 
                            d="M2.3 2.3a.75.75 0 011.06 0L6 4.94l2.64-2.64a.75.75 0 111.06 1.06L7.06 6l2.64 2.64a.75.75 0 11-1.06 1.06L6 7.06 3.36 9.7a.75.75 0 11-1.06-1.06L4.94 6 2.3 3.36a.75.75 0 010-1.06z" 
                            fill="#71717a" 
                        />
                    </svg>
                )}
            </span>
        </button>
    );
};

export default Checkbox;
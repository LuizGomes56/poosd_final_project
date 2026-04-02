import { useState } from "react";
import { type ComponentProps } from "../consts";

const CancelButton = ({ onClick }: { onClick: () => void }) => (
    <button
        onClick={onClick}
        type="button"
        className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
    >
        Cancel
    </button>
);

const SaveButton = ({ onClick }: { onClick: () => void }) => (
    <button
        onClick={onClick}
        type="button"
        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-lg transition-all active:scale-95"
    >
        Save Changes
    </button>
);

const EditButton = ({ onClick }: { onClick: () => void }) => (
    <button
        onClick={onClick}
        type="button"
        className="px-4 py-2 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white text-xs font-bold rounded-lg transition-all"
    >
        Edit
    </button>
);

const ConfigTextInput = ({ value, setValue }: ComponentProps<string>) => {
    const [allowEdit, setAllowEdit] = useState<boolean>(false);
    const [tempValue, setTempValue] = useState<string>(value);

    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                    {allowEdit ? (
                        <input
                            autoFocus
                            type="text"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.currentTarget.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setValue(tempValue);
                                    setAllowEdit(false);
                                }
                                if (e.key === "Escape") {
                                    setTempValue(value);
                                    setAllowEdit(false);
                                }
                            }}
                            className="w-full bg-zinc-800 border border-emerald-500/50 text-white text-sm px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
                        />
                    ) : (
                        <span className="text-zinc-300 text-sm font-medium">
                            {value || <span className="text-zinc-600 italic">Not set</span>}
                        </span>
                    )}
                </div>

                <div className="flex-shrink-0">
                    {allowEdit ? (
                        <div className="flex gap-1 items-center">
                            <CancelButton
                                onClick={() => {
                                    setTempValue(value);
                                    setAllowEdit(false);
                                }}
                            />
                            <SaveButton
                                onClick={() => {
                                    setValue(tempValue);
                                    setAllowEdit(false);
                                }}
                            />
                        </div>
                    ) : (
                        <EditButton onClick={() => setAllowEdit(true)} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConfigTextInput;
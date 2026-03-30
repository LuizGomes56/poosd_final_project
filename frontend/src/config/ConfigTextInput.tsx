import { useState } from "react";
import { STYLES, type ComponentProps } from "../consts";

const CancelButton = ({ onClick }: { onClick: () => void }) => (
    <button
        onClick={onClick}
        type="button"
        className={`px-6 ${STYLES.focus} py-2.5 border rounded-lg font-medium ${STYLES.border}`}
    >
        Cancelar
    </button>
);

const SaveButton = ({ onClick }: { onClick: () => void }) => (
    <button
        onClick={onClick}
        type="button"
        className={`px-6 ${STYLES.focus} py-2.5 border border-transparent dark:bg-purple-800 bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 font-medium rounded-lg`}
    >
        Salvar
    </button>
);

const EditButton = ({ onClick }: { onClick: () => void }) => (
    <button
        onClick={onClick}
        type="button"
        className={`px-6 ${STYLES.focus} py-2.5 border place-self-end rounded-lg ${STYLES.border}`}
    >
        Editar
    </button>
);

const ConfigTextInput = ({ value, setValue }: ComponentProps<string>) => {
    const [allowEdit, setAllowEdit] = useState<boolean>(false);
    const [tempValue, setTempValue] = useState<string>(value);

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <label
                className={`relative flex items-center ${STYLES.focusWithin} ${allowEdit ? `border w-full py-2.5 px-4 rounded-lg ${STYLES.border}` : ""}`}
            >
                <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.currentTarget.value)}
                    className={`focus:outline-none appearance-none w-full bg-transparent ${allowEdit ? "" : "hidden opacity-0 pointer-events-none"}`}
                />
                {!allowEdit && (
                    <span className="mx-4 border-l border-transparent dark:text-zinc-400 text-zinc-600">
                        {value}
                    </span>
                )}
            </label>
            {allowEdit ? (
                <div className="flex gap-2 items-center place-self-end">
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
    );
};

export default ConfigTextInput;
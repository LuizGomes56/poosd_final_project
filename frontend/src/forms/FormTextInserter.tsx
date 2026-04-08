import type { SetState } from "../consts";
import FormTextField from "./FormTextField";
import { useNotification } from "../providers/NotificationProvider";

const FormTextInserter = ({
    id,
    value,
    setValue,
    placeholder,
    title
}: {
    id: string,
    value: string[],
    setValue: SetState<string[]>,
    placeholder?: string,
    title: string
}) => {
    const { addNotification } = useNotification();

    return (
        <>
            {value.map((v, i) => (
                <FormTextField
                    key={i}
                    id={`${id}-${i}`}
                    value={v}
                    setValue={(newValue) => {
                        setValue((prev = []) => {
                            const newValues = [...prev];
                            newValues[i] = newValue;

                            if (new Set(newValues).size !== newValues.length) {
                                addNotification({
                                    msg: "Duplicate values in options are not allowed",
                                    type: "warning"
                                });
                            }

                            return newValues;
                        });
                    }}
                    title={
                        <div className="flex items-center gap-2 justify-between">
                            <span>{`${title} ${i + 1}`}</span>
                            {value.length > 1 && (
                                <button
                                    type="button"
                                    className="text-sm text-red-400 hover:underline"
                                    onClick={() => {
                                        setValue(prev => [...prev.slice(0, i), ...prev.slice(i + 1)]);
                                    }}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    }
                    placeholder={v || placeholder || "Undefined"}
                />
            ))}
            {value.length < 5 && <button
                type="button"
                onClick={() => setValue(prev => [...prev, ""])}
                className="my-2 font-semibold text-left dark:text-sky-400 not-dark:text-sky-500 hover:underline"
            >
                Add {title}
            </button>}
        </>
    )
}

export default FormTextInserter;
import Checkbox from "../components/Checkbox";
import { type SetState } from "../consts";
import { useUpdateUser } from "../hooks";

const ConfigTextField = ({
    title,
    description,
    checkbox
}: {
    title: string,
    description: string,
    checkbox?: { value: boolean, setValue: SetState<boolean>, id?: string }
}) => {
    const updateUser = useUpdateUser();

    const handleUpdate = async (value: boolean) => {
        if (checkbox?.id) {
            await updateUser(value, checkbox.id);
        }
    };

    return (
        <div className={`flex items-center justify-between p-6 transition-colors hover:bg-zinc-800/20 group`}>
            <div className="flex flex-col gap-1">
                <h2 className="text-zinc-400 text-xs uppercase tracking-widest font-bold">
                    {title}
                </h2>

                <p className="text-zinc-300 text-sm leading-relaxed max-w-md">
                    {description}
                </p>
            </div>

            {checkbox && (
                <div className="flex items-center pl-4">
                    <Checkbox
                        enabled={checkbox.value}
                        onEvent={() => {
                            const newValue = !checkbox.value;
                            checkbox.setValue(newValue);
                            handleUpdate(newValue);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default ConfigTextField;
import Checkbox from "../components/Checkbox";
import { STYLES, type SetState } from "../consts";
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
        await updateUser(value, checkbox?.id);
    };

    return (
        <div className={`flex dark:text-zinc-200 gap-2 gap-x-8 border-b min-h-28 ${STYLES.border} pb-6`}>
            <div className="flex flex-1 flex-col gap-4">
                <h2 className="dark:text-white h-10 content-center">{title}</h2>
                <p className="mx-4 dark:text-zinc-400 text-zinc-600">{description}</p>
            </div>
            {checkbox && (
                <div className="h-10 content-center">
                    <Checkbox enabled={checkbox.value} onEvent={() => {
                        const newValue = !checkbox.value;
                        checkbox.setValue(newValue);
                        if (checkbox.id) {
                            handleUpdate(newValue);
                        }
                    }} />
                </div>
            )}
        </div>
    )
}
export default ConfigTextField;
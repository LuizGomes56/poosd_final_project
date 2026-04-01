import type { useState } from "react";
import FormBuilder from "src/forms/FormBuilder";
import FormButton from "src/forms/FormButton";
import FormCheckbox from "src/forms/FormCheckbox";
import FormRadiobox from "src/forms/FormRadiobox";
import FormSelector from "src/forms/FormSelector";
import FormTextField from "src/forms/FormTextField";
import { useSkip } from "src/hooks";

const CreateItem = ({
    addNotification,
    setShow,
    show,
    refresh,
    price_list_id,
    company_id
}: {
    price_list_id: string,
    company_id: string,
    addNotification: Consts.NotificationFn,
    setShow: Consts.SetState<boolean>,
    show: boolean
    refresh: () => void
}) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [price, setPrice] = useState<number | null>(null);
    const [currency, setCurrency] = useState<Consts.Currencies | null>(null);
    const [type, setType] = useState<null | "PRODUCT" | "SERVICE">("SERVICE");
    const [duration, setDuration] = useState<number | null>(null);
    const [availability, setAvailability] = useState<("online" | "inPerson")[]>([]);
    const [isRecurring, setIsRecurring] = useState<boolean | null>(null);
    const [recurringInterval, setRecurringInterval] = useState<null | "WEEK" | "MONTH" | "QUARTER" | "SEMESTER" | "YEAR" | "CUSTOM">(null);
    const [customRecurringInterval, setCustomRecurringInterval] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (isSubmitting) return;
        try {
            await Consts.requestToAPI(
                "NeedXpress",
                "item/create",
                {
                    body: {
                        price_list_id,
                        company_id,
                        data: {
                            name,
                            description,
                            price,
                            currency,
                            type,
                            duration,
                            availability,
                            isRecurring,
                            recurringInterval,
                            customRecurringInterval
                        }
                    }
                }
            )
            addNotification({ type: "success", msg: "Item cadastrado com sucesso" });
            setShow(false);
            refresh();
        } catch (e) {
            addNotification({ type: "error", msg: e instanceof Error ? e.message : String(e) });
        }
    }

    useSkip(() => {
        setRecurringInterval(null);
        setAvailability([]);
        setIsRecurring(false);
        setCustomRecurringInterval(null);
    }, [type]);

    return (
        <FormBuilder
            show={show}
            setShow={setShow}
            handleSubmit={handleSubmit}
        >
            <h2 className="text-2xl font-medium leading-none dark:text-white">
                Cadastrar um item
            </h2>
            <h4 className="text-zinc-500 dark:text-zinc-400">
                Coloque nomes descritivos caso a lista seja pública.
            </h4>
            <FormRadiobox
                iterator={{
                    "SERVICE": "Serviço",
                    // "PRODUCT": "Produto"
                }}
                id="type"
                value={type}
                setValue={setType}
                title="Tipo de item a cadastrar"
            />
            <FormTextField
                id="name"
                value={name}
                setValue={setName}
                title="Nome"
                placeholder={`Nome do ${type === "PRODUCT" ? "produto" : "serviço"}`}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelector
                    id="currency"
                    value={currency}
                    setValue={setCurrency}
                    title="Moeda"
                    iterator={Object.fromEntries(Object.entries(Consts.CURRENCIES).map(([k, v]) => [k, `${k} \u00B7 ${v}`]))}
                />
                <FormTextField
                    id="price"
                    value={price}
                    setValue={setPrice}
                    title="Preço"
                    placeholder={`Preço do ${type === "PRODUCT" ? "produto" : "serviço"}`}
                />
            </div>
            <FormTextField
                id="description"
                value={description}
                setValue={setDescription}
                title="Descrição"
                placeholder={`Opcional \u00B7 Descrição do ${type === "PRODUCT" ? "produto" : "serviço"}`}
            />
            {type === "SERVICE" && (
                <>
                    <FormTextField
                        id="duration"
                        value={duration}
                        setValue={setDuration}
                        title="Duração"
                        placeholder="Duração em minutos"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormCheckbox
                            className="flex flex-col"
                            id="availability"
                            value={availability}
                            setValue={setAvailability}
                            iterator={{
                                "online": "Online",
                                "inPerson": "Presencial"
                            }}
                            title="Disponibilidade"
                        />
                        <FormBoolbox
                            id="isRecurring"
                            value={Boolean(isRecurring)}
                            setValue={setIsRecurring}
                            title="Cobranças"
                            label="Recorrência"
                        />
                    </div>
                    {isRecurring && <FormRadiobox
                        iterator={{
                            "WEEK": "Semanal",
                            "MONTH": "Mensal",
                            "QUARTER": "Trimestral",
                            "SEMESTER": "Semestral",
                            "YEAR": "Anual",
                            "CUSTOM": "Personalizado"
                        }}
                        id="recurring_interval"
                        value={recurringInterval}
                        setValue={setRecurringInterval}
                        title="Intervalo de recorrência"
                    />}
                    {recurringInterval === "CUSTOM" &&
                        <FormTextField
                            id="customRecurringInterval"
                            value={customRecurringInterval}
                            setValue={setCustomRecurringInterval}
                            title="Intervalo"
                            placeholder="Intervalo em dias"
                        />
                    }
                </>
            )}
            <div className="flex items-center gap-2 justify-center sm:justify-end">
                <FormButton
                    type="reset"
                    text="Cancelar"
                    disabled={isSubmitting}
                />
                <FormButton
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-violet-500 dark:bg-violet-700 hover:bg-violet-600 dark:hover:bg-violet-800"
                    text="Criar"
                />
            </div>
        </FormBuilder>
    )
}
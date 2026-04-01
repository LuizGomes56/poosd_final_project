import { useState } from "react";
import FormBuilder from "src/forms/FormBuilder";
import FormButton from "src/forms/FormButton";
import FormRadiobox from "src/forms/FormRadiobox";
import FormTextField from "src/forms/FormTextField";
import { useSkip } from "src/hooks";

const CreateProfessional = ({
    addNotification,
    setShow,
    show,
    refresh,
    company_id
}: {
    addNotification: Consts.NotificationFn,
    setShow: Consts.SetState<boolean>,
    show: boolean,
    refresh: () => void
    company_id: string
}) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [emails, setEmails] = useState<string[]>([""]);
    const [phones, setPhones] = useState<string[]>([""]);
    const [dob, setDob] = useState<string>("");
    const [gender, setGender] = useState<"M" | "F" | undefined>();
    const [experience, setExperience] = useState<string>("");

    useSkip(() => {
        if (emails.length < 1) {
            setEmails([""]);
            addNotification({ type: "info", msg: "É obrigatório informar pelo menos um email" });
        } else if (emails.length > 5) {
            addNotification({ type: "info", msg: "Limite de emails atingido" });
        }
    }, [emails.length]);

    useSkip(() => {
        if (phones.length < 1) {
            setPhones([""]);
            addNotification({ type: "info", msg: "É obrigatório informar pelo menos um telefone" });
        } else if (phones.length > 5) {
            addNotification({ type: "info", msg: "Limite de telefones atingido" });
        }
    }, [phones.length]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (isSubmitting) return;
        try {
            await Consts.requestToAPI(
                "NeedXpress",
                "professional/create",
                {
                    body: {
                        company_id,
                        name,
                        data: {
                            name,
                            emails,
                            phones,
                            dob,
                            gender,
                            experience,
                        }
                    }
                }
            )
            addNotification({ type: "success", msg: "Profissional criado com sucesso" });
            setShow(false);
            refresh();
        }
        catch (e) {
            addNotification({ type: "error", msg: e instanceof Error ? e.message : String(e) });
        }
    }

    return (
        <FormBuilder
            show={show}
            setShow={setShow}
            handleSubmit={handleSubmit}
        >
            <h2 className="text-2xl font-medium leading-none dark:text-white">
                Adicionar usuário
            </h2>
            <FormTextField
                id="name"
                value={name}
                setValue={setName}
                title="Nome da pessoa"
                placeholder="Nome"
            />
            {emails.map((email, i) => (
                <FormTextField
                    key={i}
                    id={`email-${i}`}
                    value={email}
                    setValue={(newValue: string) => {
                        setEmails(prev => {
                            const newEmails = [...prev];
                            newEmails[i] = newValue;
                            return newEmails;
                        });
                    }}
                    title={
                        <div className="flex items-center gap-2 justify-between">
                            <span>{`Email ${i + 1}`}</span>
                            {emails.length > 1 && (
                                <button
                                    type="button"
                                    className="text-sm text-red-400 hover:underline"
                                    onClick={() => {
                                        setEmails(prev => [...prev.slice(0, i), ...prev.slice(i + 1)]);
                                    }}
                                >
                                    Remover
                                </button>
                            )}
                        </div>
                    }
                    placeholder="nome@exemplo.com"
                />
            ))}
            {emails.length < 5 && <button
                type="button"
                onClick={() => setEmails(prev => [...prev, ""])}
                className="my-2 font-semibold text-left dark:text-sky-400 text-sky-500 hover:underline"
            >
                Adicionar email
            </button>}
            {phones.map((phone, i) => (
                <FormTextField
                    key={i}
                    id={`phone-${i}`}
                    value={phone}
                    setValue={(newValue: string) => {
                        setPhones(prev => {
                            const newphones = [...prev];
                            newphones[i] = newValue;
                            return newphones;
                        });
                    }}
                    title={
                        <div className="flex items-center gap-2 justify-between">
                            <span>{`Telefone ${i + 1}`}</span>
                            {phones.length > 1 && (
                                <button
                                    type="button"
                                    className="text-sm text-red-400 hover:underline"
                                    onClick={() => {
                                        setPhones(prev => [...prev.slice(0, i), ...prev.slice(i + 1)]);
                                    }}
                                >
                                    Remover
                                </button>
                            )}
                        </div>
                    }
                    placeholder="( ___ ) _____-____"
                />
            ))}
            {phones.length < 5 && <button
                type="button"
                onClick={() => setPhones(prev => [...prev, ""])}
                className="my-2 font-semibold text-left dark:text-sky-400 text-sky-500 hover:underline"
            >
                Adicionar Telefone
            </button>}
            <FormTextField
                id="birth_date"
                value={dob}
                setValue={setDob}
                title="Data de nascimento"
                placeholder="dd/mm/aaaa"
            />
            <FormRadiobox
                id="gender"
                value={gender}
                setValue={setGender}
                title="Sexo"
                iterator={{
                    M: "Masculino",
                    F: "Feminino"
                }}
            />
            <FormTextField
                id="experience"
                value={experience}
                setValue={setExperience}
                title="Experiência"
                placeholder="Especialidade A, Especialidade B, ..."
            />
            <div className="flex items-center gap-2 justify-center sm:justify-end">
                <FormButton
                    type="reset"
                    text="Cancelar"
                    disabled={isSubmitting}
                />
                <FormButton
                    type="submit"
                    className="bg-violet-500 dark:bg-violet-700 hover:bg-violet-600 dark:hover:bg-violet-800"
                    text="Salvar"
                    disabled={isSubmitting}
                />
            </div>
        </FormBuilder>
    )
}
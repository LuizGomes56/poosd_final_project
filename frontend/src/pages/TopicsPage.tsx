import type { ActionFn, NotificationFn, SetState } from "src/consts"
import Table from "../components/Table"
import { useState } from "react"
import { useSkip } from "../hooks"
import { useNotification } from "../providers/NotificationProvider"
import { api } from "../utils/request"

import FormTextField from "../forms/FormTextField"
import FormTextInserter from "../forms/FormTextInserter"
import FormButton from "../forms/FormButton"
import FormBuilder from "../forms/FormBuilder"
import FormView from "../forms/FormView"

const CreateCompany = ({
    setShow,
    show,
    refresh
}: {
    setShow: SetState<boolean>,
    show: boolean,
    refresh: () => void
}) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const { addNotification } = useNotification();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (isSubmitting) return;
        try {
            await api(
                "topics/create",
            )
            addNotification({ type: "success", msg: "Empresa criada com sucesso" });
            setShow(false);
            refresh();
        }
        catch (e) {
            addNotification({ type: "error", msg: e instanceof Error ? e.message : String(e) });
        }
        finally {
            setIsSubmitting(false);
        }
    }

    return (
        <FormBuilder
            show={show}
            setShow={setShow}
            handleSubmit={handleSubmit}
        >
            <h2 className="text-2xl font-medium leading-none dark:text-white">
                Criar uma empresa
            </h2>
            <FormTextField
                id="name"
                value={name}
                setValue={setName}
                title="Nome da empresa"
                placeholder="Nome"
            />
            <FormTextInserter
                id="emails"
                value={emails}
                setValue={setEmails}
                title="Email"
            />
            <FormTextInserter
                id="phones"
                value={phones}
                setValue={setPhones}
                placeholder="( ___ ) _____-____"
                title="Telefone"
            />
            <div className="flex items-center gap-2 justify-center sm:justify-end">
                <FormButton
                    type="reset"
                    text="Cancelar"
                    disabled={isSubmitting}
                />
                <FormButton
                    disabled={isSubmitting}
                    type="submit"
                    className="bg-violet-500 dark:bg-violet-700 hover:bg-violet-600 dark:hover:bg-violet-800"
                    text="Salvar"
                />
            </div>
        </FormBuilder>
    )
}

// let s = api("topics/create");

const ViewCompanyForm = ({
    info,
    setShow,
    addNotification
}: {
    addNotification: NotificationFn,
    setShow: SetState<ActionFn>,
    info?: NonNullable<ReturnType<typeof api<"topics/create", any>>>
}) => {
    if (!info) {
        addNotification({
            msg: "Não foi possível visualizar este profissional",
            type: "error"
        });
        return null;
    }
    return (
        <FormBuilder show={true} setShow={() => setShow(null)} handleSubmit={() => { }}>
            <h2 className="text-2xl font-medium leading-none dark:text-white">
                Visualizando <i className="text-xl dark:text-sky-300 text-sky-400">{info.name}</i>
            </h2>
            {/* <FormView title="Nome" value={info.name} />
            {info.data.emails && info.data.emails.map((t, i) => (
                <FormView title={`Email ${i + 1}`} value={t?.email || "Não informado"} key={i} />
            ))}
            {info.data.phones && info.data.phones.map((t, i) => (
                <FormView title={`Telefone ${i + 1}`} value={t?.number || "Não informado"} key={i} />
            ))}
            {info.data.addresses && info.data.addresses.map((t, i) => (
                <FormView title={`Endereço ${i + 1}`} value={[`${t.number} ${t.street}`, t.city, t.state, t.country].join(", ")} key={i} />
            ))} */}
        </FormBuilder>
    )
}

// const EditCompanyForm = ({
//     info,
//     setShow,
//     addNotification,
//     refresh,
//     company_id
// }: {
//     company_id: string,
//     addNotification: Consts.NotificationFn,
//     setShow: SetState<Consts.ActionFn>,
//     info?: NonNullable<NeedXpress["Routes"]["company/getAllByUserId"]>[number],
//     refresh: () => void
// }
// ) => {
//     const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//     const [name, setName] = useState<string>(info?.name ?? "");
//     const [emails, setEmails] = useState<string[]>(info?.data?.emails?.map(t => t?.email) ?? [""]);
//     const [phones, setPhones] = useState<string[]>(info?.data?.phones?.map(t => t?.number) ?? [""]);
//     const [addresses, setAddresses] = useState<string[]>(info?.data?.addresses?.map(t => [`${t.number} ${t.street}`, t.city, t.state, t.country].join(", ")) ?? [""]);
//     const [specialties, setSpecialties] = useState<string[]>(info?.data.specialties?.map(t => t?.name) ?? [""]);

//     useSkip(() => {
//         if (emails.length < 1) {
//             setEmails([""]);
//             addNotification({ type: "info", msg: "É obrigatório informar pelo menos um email" });
//         } else if (emails.length > 5) {
//             addNotification({ type: "info", msg: "Limite de emails atingido" });
//         }
//     }, [emails.length]);

//     useSkip(() => {
//         if (phones.length < 1) {
//             setPhones([""]);
//             addNotification({ type: "info", msg: "É obrigatório informar pelo menos um telefone" });
//         } else if (phones.length > 5) {
//             addNotification({ type: "info", msg: "Limite de telefones atingido" });
//         }
//     }, [phones.length]);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         if (isSubmitting) return;
//         try {
//             await Consts.requestToAPI(
//                 "NeedXpress",
//                 "company/update",
//                 {
//                     body: {
//                         company_id,
//                         data: {
//                             name,
//                             emails,
//                             phones,
//                             addresses,
//                             specialties
//                         }
//                     }
//                 }
//             )
//             addNotification({ type: "success", msg: "Edição concluída" });
//             setShow(null);
//             refresh();
//         }
//         catch (e) {
//             addNotification({ type: "error", msg: e instanceof Error ? e.message : String(e) });
//         }
//         finally {
//             setIsSubmitting(false);
//         }
//     }

//     return (
//         <FormBuilder
//             show={true}
//             setShow={() => setShow(null)}
//             handleSubmit={handleSubmit}
//         >
//             <h2 className="text-2xl font-medium leading-none dark:text-white">
//                 Editar <i className="text-xl dark:text-sky-300 text-sky-400">{info?.data.name}</i>
//             </h2>
//             <FormTextField
//                 id="name"
//                 value={name}
//                 setValue={setName}
//                 title="Nome da pessoa"
//                 placeholder={name}
//             />
//             <FormTextInserter
//                 id="emails"
//                 value={emails}
//                 setValue={setEmails}
//                 title="Email"
//             />
//             <FormTextInserter
//                 id="phones"
//                 value={phones}
//                 setValue={setPhones}
//                 title="Telefone"
//             />
//             <FormTextInserter
//                 id="addresses"
//                 value={addresses}
//                 setValue={setAddresses}
//                 title="Endereço"
//             />
//             <FormTextInserter
//                 id="specialties"
//                 value={specialties}
//                 setValue={setSpecialties}
//                 title="Especialidade"
//             />
//             <div className="flex items-center gap-2 justify-center sm:justify-end">
//                 <FormButton
//                     disabled={isSubmitting}
//                     type="reset"
//                     text="Cancelar"
//                 />
//                 <FormButton
//                     disabled={isSubmitting}
//                     type="submit"
//                     className="bg-violet-500 dark:bg-violet-700 hover:bg-violet-600 dark:hover:bg-violet-800"
//                     text="Salvar"
//                 />
//             </div>
//         </FormBuilder>
//     )
// }

// const DeleteCompanyForm = ({
//     setShow,
//     addNotification,
//     company_id,
//     refresh
// }: {
//     company_id: string,
//     addNotification: Consts.NotificationFn,
//     setShow: SetState<Consts.ActionFn>,
//     refresh: () => void
// }) => {
//     const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//     const handleDeletion = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         if (isSubmitting) return;
//         try {
//             await Consts.requestToAPI(
//                 "NeedXpress",
//                 "company/deactivate",
//                 {
//                     body: {
//                         company_id
//                     }
//                 }
//             )
//             addNotification({ type: "success", msg: "Profissional excluido com sucesso" });
//             setShow(null);
//             refresh();
//         }
//         catch (e) {
//             addNotification({ type: "error", msg: e instanceof Error ? e.message : String(e) });
//         }
//     }

//     return (
//         <FormBuilder
//             show={true}
//             setShow={() => setShow(null)}
//             handleSubmit={handleDeletion}
//         >
//             <h2 className="text-2xl font-medium leading-none dark:text-white">
//                 Excluir um item
//             </h2>
//             <h4 className="text-zinc-500 dark:text-zinc-400">
//                 Tem certeza que deseja excluir este item?
//             </h4>
//             <h4 className="text-zinc-500 dark:text-zinc-400">
//                 Ele deixará de ser exibido na tabela de profissionais.
//             </h4>
//             <div className="flex items-center gap-2 justify-center sm:justify-end">
//                 <FormButton
//                     type="reset"
//                     text="Cancelar"
//                     onClick={() => setShow(null)}
//                     disabled={isSubmitting}
//                 />
//                 <FormButton
//                     type="submit"
//                     onClick={handleDeletion}
//                     className="bg-red-500 dark:bg-red-700 hover:bg-red-600 dark:hover:bg-red-800"
//                     text="Excluir"
//                     disabled={isSubmitting}
//                 />
//             </div>
//         </FormBuilder>
//     )
// }

type TopicTableBody = [
    [id: string, [{ value: string, style?: string }, { value: string, style?: string }, { value: string, style?: string }]]
]

function getTopicTableBody() {
    return [
        ["a", [
            { value: "test1", style: "pl-6 pr-4" },
            { value: "72" },
            { value: "test" }
        ]
        ]
    ] as TopicTableBody
}

const TopicTable = ({ topics: topics, setAction }
    :
    {
        topics: TopicTableBody
        setAction: SetState<ActionFn>
    }
) => {
    //remember to change this back to 
    // questions === null
    // Maybe === is unnecessary
    if (topics === null) {
        return (
            <div className="content-center">
                <p className="text-pretty text-white text-4xl ">Nothing to see here folks</p>
            </div>
        )
    }
    else {
        return (
            <div className="flex flex-col flex-1 max-w-full gap-4 mt-4">
                <h2 className="text-xl mx-4 dark:text-white">Your Questions</h2>
                <Table
                    checkboxes
                    actions={setAction}
                    btnText="Edit"
                    cols={[
                        { size: "1fr" },
                        { size: "1fr" },
                        { size: "fit-content(100%)" }
                    ]}
                    pattern={{
                        header: [
                            { name: "Topic", style: "pl-6 pr-4" },
                            { name: "Number of Questions" },
                            { name: "Date of creation" },
                        ],
                        body: topics ? topics : [
                            ["a", [
                                { value: "test2", style: "pl-6 pr-4" },
                                { value: "72" },
                                { value: "test1" }
                            ]
                            ]
                        ]
                    }}
                />
            </div>
        )
    }
}

const TopicsPage = () => {
    const [_action, setAction] = useState<ActionFn>(null);
    const [viewTopic, setViewTopic] = useState(false);
    const [editTopic, setEditTopic] = useState(false);
    let topics = getTopicTableBody();
    return (
        <div>
            <TopicTable topics={topics} setAction={setAction} />
        </div>
    )
}

export default TopicsPage;
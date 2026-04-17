import { translate, type ActionFn, type NotificationFn, type SetState } from "../consts"
import Table from "../components/Table"
import { useEffect, useState } from "react"
import { useNotification } from "../providers/NotificationProvider"
import { api } from "../utils/request"
import { useDebounce } from "../hooks"
import FormTextField from "../forms/FormTextField"
import FormButton from "../forms/FormButton"
import FormBuilder from "../forms/FormBuilder"
import FormView from "../forms/FormView"
import Loading from "../components/Loading"

const CreateTopic = ({
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
                "topics/create", {
                name,
                description
            })
            addNotification({ type: "success", msg: "Topic created successfully" });
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
                title="Name of this topic"
                placeholder="Topic name"
            />
            <FormTextField
                id="description"
                value={description}
                setValue={setDescription}
                title="Description"
                placeholder="No description"
            />
            <div className="flex items-center gap-2 justify-center sm:justify-end">
                <FormButton
                    type="reset"
                    text="Cancel"
                    disabled={isSubmitting}
                />
                <FormButton
                    disabled={isSubmitting}
                    type="submit"
                    className="bg-violet-500 dark:bg-violet-700 hover:bg-violet-600 dark:hover:bg-violet-800"
                    text="Save"
                />
            </div>
        </FormBuilder>
    )
}

const ViewTopic = ({
    info,
    setShow,
    addNotification
}: {
    addNotification: NotificationFn,
    setShow: SetState<ActionFn>,
    info?: NonNullable<Awaited<ReturnType<typeof api<"topics/create", any>>>["body"]>
}) => {
    if (!info) {
        addNotification({
            msg: "Error fetching topic information",
            type: "error"
        });
        return null;
    }
    return (
        <FormBuilder show={true} setShow={() => setShow(null)} handleSubmit={() => { }}>
            <h2 className="text-2xl font-medium leading-none dark:text-white">
                Viewing <i className="text-xl dark:text-sky-300 text-sky-400">{info.name}</i>
            </h2>
            <FormView title="Topic title" value={info.name} />
            <FormView title="Topic description" value={info.description} />
            {/* Add table to see questions later */}


        </FormBuilder>
    )
}

const EditTopic = ({
    info,
    setShow,
    refresh,
    topic_id
}: {
    topic_id: string,
    setShow: SetState<ActionFn>,
    info?: Topics[number],
    refresh: () => void
}
) => {
    const [name, setName] = useState<string>(info?.name || "");
    const [description, setDescription] = useState<string>(info?.description || "");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { addNotification } = useNotification();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (isSubmitting) return;
        try {
            await api(
                "topics/update",
                {
                    name,
                    topic_id,
                    description
                }
            )
            addNotification({ type: "success", msg: "Edição concluída" });
            setShow(null);
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
            show={true}
            setShow={() => setShow(null)}
            handleSubmit={handleSubmit}
        >
            <h2 className="text-2xl font-medium leading-none dark:text-white">
                Editing <i className="text-xl dark:text-sky-300 text-sky-400">{info?.name}</i>
            </h2>
            <FormTextField
                id="name"
                value={name}
                setValue={setName}
                title="Topic's name"
                placeholder={name}
            />
            <FormTextField
                id="Description"
                value={description}
                setValue={setDescription}
                title="Topic's description"
                placeholder={description}
            />
            <div className="flex items-center gap-2 justify-center sm:justify-end">
                <FormButton
                    disabled={isSubmitting}
                    type="reset"
                    text="Cancel"
                />
                <FormButton
                    disabled={isSubmitting}
                    type="submit"
                    className="bg-violet-500 dark:bg-violet-700 hover:bg-violet-600 dark:hover:bg-violet-800"
                    text="Save"
                />
            </div>
        </FormBuilder>
    )
}

const DeleteTopic = ({
    setShow,
    topic_id,
    refresh
}: {
    topic_id: string,
    setShow: SetState<ActionFn>,
    refresh: () => void
}) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { addNotification } = useNotification();

    const handleDeletion = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (isSubmitting) return;
        try {
            await api(
                "topics/delete",
                { topic_id }
            )
            addNotification({ type: "success", msg: "Topic excluded successfully" });
            setShow(null);
            refresh();
        }
        catch (e) {
            addNotification({ type: "error", msg: e instanceof Error ? e.message : String(e) });
        }
    }

    return (
        <FormBuilder
            show={true}
            setShow={() => setShow(null)}
            handleSubmit={handleDeletion}
        >
            <h2 className="text-2xl font-medium leading-none dark:text-white">
                Exclude topic
            </h2>
            <h4 className="text-zinc-500 dark:text-zinc-400">
                Are you sure want want to delete this topic?
            </h4>
            <h4 className="text-zinc-500 dark:text-zinc-400">
                It will no longer be displayed inside the topics table.
            </h4>
            <div className="flex items-center gap-2 justify-center sm:justify-end">
                <FormButton
                    type="reset"
                    text="Cancel"
                    onClick={() => setShow(null)}
                    disabled={isSubmitting}
                />
                <FormButton
                    type="submit"
                    onClick={handleDeletion}
                    className="bg-red-500 dark:bg-red-700 hover:bg-red-600 dark:hover:bg-red-800"
                    text="Exclude"
                    disabled={isSubmitting}
                />
            </div>
        </FormBuilder>
    )
}

export type Topics = Awaited<ReturnType<typeof api<"topics/all", any>>>["body"];

const TopicsPage = () => {
    const [action, setAction] = useState<ActionFn>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [topicForm, setTopicForm] = useState<boolean>(false);
    const [topics, setTopics] = useState<Topics | null>(null);
    const [search, setSearch] = useState<string>("");
    const debouncedSearch = useDebounce(search, 300);
    const { addNotification } = useNotification();
    const getTopics = async () => {
        setLoading(true);
        try {
            const response = debouncedSearch.trim()
                ? await api("topics/search", { query: debouncedSearch.trim() })
                : await api("topics/all");

            if (!response.body) {
                throw new Error(response.message);
            }

            setTopics(response.body);
        } catch (e) {
            addNotification({
                type: "error",
                msg: e instanceof Error ? e.message : String(e),
            })
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getTopics();
    }, [debouncedSearch]);

    const targetTopic = topics?.find(t => t.topic_id === action?.id);

    return (
        <div className="flex flex-col gap-6">
            {loading && <Loading />}
            {topics && action && action.mode === "UPDATE" && <EditTopic
                topic_id={action.id}
                setShow={setAction}
                info={targetTopic}
                refresh={getTopics}
            />}
            {action && action.mode === "DELETE" && <DeleteTopic
                setShow={setAction}
                refresh={getTopics}
                topic_id={targetTopic!.topic_id}
            />}
            {action && action.mode === "VIEW" && <ViewTopic
                info={targetTopic}
                setShow={setAction}
                addNotification={addNotification}
            />}
            <CreateTopic
                setShow={setTopicForm}
                refresh={getTopics}
                show={topicForm}
            />
            <h1 className="text-2xl mb-2 sm:text-3xl font-medium dark:text-white"></h1>
            {topics ? (
                <Table
                    checkboxes
                    btnText="New Topic"
                    actions={setAction}
                    setItemForm={setTopicForm}
                    pattern={{
                        header: [
                            { name: "Name" },
                            { name: "Description" },
                            { name: "Number of questions" },
                            { name: "Creation date" },
                            { name: "Last Updated" }
                        ],
                        body: topics.map(t => {
                            return [t.topic_id, [
                                { value: t.name || "Unkown" },
                                { value: t.description },
                                { value: t.questions },
                                { value: translate(t.createdAt, "en-US") },
                                { value: translate(t.updatedAt, "en-US") },
                            ]]
                        })
                    }}
                    searchConfig={{
                        deepSearch: false,
                        search,
                        setSearch
                    }}
                    title="Topics"
                />
            ) : loading ? null : "Nothing was found"}
        </div>
    )
}

export default TopicsPage;

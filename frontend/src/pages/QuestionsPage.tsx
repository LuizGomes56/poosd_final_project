import { translate, type ActionFn, type NotificationFn, type SetState } from "../consts"
import Table from "../components/Table"
import { useEffect, useState } from "react"
import { useNotification } from "../providers/NotificationProvider"
import { api } from "../utils/request"
import { useDebounce } from "../hooks"
import FormTextField from "../forms/FormTextField"
import FormButton from "../forms/FormButton"
import FormBuilder from "../forms/FormBuilder"
// import FormView from "../forms/FormView"
import Loading from "../components/Loading"
import FormRadiobox from "../forms/FormRadiobox"
import type { Topics } from "./TopicsPage"
import FormTextInserter from "../forms/FormTextInserter"
import type { SwaggerDocs } from "backend";
import FormMultiselector from "../forms/FormMultiselector"
import FormView from "../forms/FormView"

const CreateQuestion = ({
    setShow,
    show,
    refresh,
    topics
}: {
    setShow: SetState<boolean>,
    show: boolean,
    refresh: () => void,
    topics: Topics
}) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [prompt, setPrompt] = useState<string>("");
    const [choiceOptions, setChoiceOptions] = useState<string[]>(["Example 1", "Example 2", "Example 3", "Example 4"]);
    const [choiceSingleAnswer, setChoiceSingleAnswer] = useState<"True" | "False">("True");
    const [choiceMultipleAnswers, setChoiceMultipleAnswers] = useState<string[]>(["Example 3"]);
    const [frqKind, setFrqKind] = useState<"NUMBER" | "TEXT">("NUMBER");
    const [frqTolerance, setFrqTolerance] = useState<number>(0);
    const [frqAcceptedNumbers, setFrqAcceptedNumbers] = useState<string[]>([]);
    const [frqAcceptedTexts, setFrqAcceptedTexts] = useState<string[]>([]);
    const [difficulty, setDifficulty] = useState<Questions[number]["difficulty"]>("EASY");
    const [points, setPoints] = useState<Questions[number]["points"]>(100);
    const [hint, setHint] = useState<Questions[number]["hint"]>("");
    const [explanation, setExplanation] = useState<Questions[number]["explanation"]>("");
    const [type, setType] = useState<Questions[number]["type"]>("FRQ");
    const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
    const { addNotification } = useNotification();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (isSubmitting) return;
        try {
            const body = (
                type === "FRQ"
                    ? {
                        type,
                        frq: frqKind === "NUMBER" ? {
                            kind: frqKind,
                            tolerance: frqTolerance,
                            accepted_numbers: frqAcceptedNumbers.map(Number),
                        } : {
                            kind: frqKind,
                            accepted_texts: frqAcceptedTexts,
                        },
                        difficulty,
                        points,
                        hint,
                        explanation,
                        prompt,
                        topic_ids: selectedTopicIds,
                    }
                    : type === "TF"
                        ? {
                            choice: {
                                answers: {
                                    single: choiceSingleAnswer,
                                },
                            },
                            type,
                            difficulty,
                            points,
                            hint,
                            explanation,
                            prompt,
                            topic_ids: selectedTopicIds,
                        }
                        : {
                            choice: {
                                answers: {
                                    multiple: choiceMultipleAnswers
                                },
                                options: choiceOptions
                            },
                            type,
                            difficulty,
                            points,
                            hint,
                            explanation,
                            prompt,
                            topic_ids: selectedTopicIds,
                        }
            ) satisfies SwaggerDocs["questions/create"]["input"];

            if (!body) {
                throw new Error("Body cannot be empty");
            }

            if (type === "MCQ" && new Set(choiceOptions).size !== choiceOptions.length) {
                throw new Error("MCQ options must be unique");
            }


            if (Object.keys(body).length === 0) {
                throw new Error("Body cannot be empty");
            }

            console.log(body);

            const response = await api(
                "questions/create",
                body as any
            );

            if (!response.body || !response.ok) {
                throw new Error(response.message);
            }

            addNotification({ type: "success", msg: "Question created successfully" });
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
    {/* Have to make another hook because the original setter hook would overide the original pulled list and make it a non array object */ }
    return (
        <FormBuilder
            show={show}
            setShow={setShow}
            handleSubmit={handleSubmit}
        >
            <h2 className="text-2xl font-medium leading-none dark:text-white">
                Create a question
            </h2>
            <FormMultiselector
                id="topics"
                value={selectedTopicIds}
                setValue={setSelectedTopicIds}
                iterator={Object.fromEntries(topics.map((topic) => [topic.topic_id, topic.name]))}
                title="Question's choices"
            />
            <FormTextField
                id="prompt"
                value={prompt}
                setValue={setPrompt}
                title="Question's prompt"
                placeholder="What is the result of 1 + 1?"
                maxLength={6000}
            />
            <FormRadiobox
                id="difficulty"
                value={difficulty}
                setValue={setDifficulty}
                title="Question's difficulty"
                iterator={{
                    EASY: "Easy",
                    MEDIUM: "Medium",
                    HARD: "Hard"
                }}
            />
            <FormTextField
                id="points"
                value={points}
                setValue={(v) => setPoints(Number(v))}
                title="Question's points"
                placeholder="100"
            />
            <FormTextField
                id="hint"
                value={hint}
                setValue={setHint}
                title="Question's hint"
                placeholder="Hint"
                maxLength={6000}
            />
            <FormTextField
                id="explanation"
                value={explanation}
                setValue={setExplanation}
                title="Question's explanation"
                placeholder="Explanation"
                maxLength={6000}
            />
            <FormRadiobox
                id="type"
                value={type}
                setValue={setType}
                title="Question's type"
                iterator={{
                    FRQ: "Free Response Question",
                    MCQ: "Multiple Choice",
                    TF: "True or False"
                }}
            />
            {type === "FRQ" && (
                <>
                    <FormRadiobox
                        id="kind"
                        value={frqKind}
                        setValue={setFrqKind}
                        title="Question's kind"
                        iterator={{
                            NUMBER: "Number",
                            TEXT: "Text"
                        }}
                    />
                    {frqKind === "NUMBER" ? (
                        <>
                            <FormTextField
                                id="tolerance"
                                value={frqTolerance}
                                setValue={(v) => setFrqTolerance(Number(v))}
                                title="Question's tolerance"
                                placeholder="Tolerance"
                            />
                            <FormTextInserter
                                id="answer"
                                value={frqAcceptedNumbers}
                                setValue={setFrqAcceptedNumbers}
                                title="Question's answer"
                                placeholder="Answer"
                            />
                        </>
                    ) :
                        <FormTextInserter
                            id="answer"
                            value={frqAcceptedTexts}
                            setValue={setFrqAcceptedTexts}
                            title="Question's answer"
                            placeholder="Answer"
                        />
                    }
                </>
            )}
            {type === "TF" && (
                <FormRadiobox
                    id="answer"
                    value={choiceSingleAnswer}
                    setValue={setChoiceSingleAnswer}
                    title="Question's answer"
                    iterator={{
                        True: "True",
                        False: "False"
                    }}
                />
            )}
            {type === "MCQ" && (
                <>
                    <FormTextInserter
                        id="choices"
                        value={choiceOptions}
                        setValue={setChoiceOptions}
                        title="Question's choices"
                        placeholder="Choice"
                    />
                    <FormMultiselector
                        id="answers"
                        value={choiceMultipleAnswers}
                        setValue={setChoiceMultipleAnswers}
                        iterator={Object.fromEntries(choiceOptions.map((choice, i) => [
                            choice,
                            `[${String.fromCharCode(65 + i)}] ${choice}`
                        ]))}
                        title="Question's answers"
                    />
                </>
            )}
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

type Question = NonNullable<Awaited<ReturnType<typeof api<"questions/all", any>>>["body"][number]>;

const ViewQuestion = ({
    info,
    setShow,
    addNotification,
    topics
}: {
    addNotification: NotificationFn,
    setShow: SetState<ActionFn>,
    info: Question,
    topics: Topics
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
                Viewing <i className="text-xl dark:text-sky-300 text-sky-400">{info.prompt}</i>
            </h2>
            {info.type == "MCQ"
                ? <>
                    <FormView title="Prompt" value={info.prompt} />
                    <FormView title={`Topics (${topics.length})`} value={topics.map(t => t.name).join(", ")} />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormView title="Type" value={info.type} />
                        <FormView title="Difficulty" value={info.difficulty} />
                        <FormView title="Points" value={info.points} />
                    </div>
                    <FormView title="Explanation" value={info.explanation} />
                    <FormView title="Hint" value={info.hint} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {info.choice?.answers?.multiple?.map((value, index) => (
                            <FormView title={"Answer #" + (index + 1)} value={value} />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {info.choice?.options.map((value, index) => (
                            <FormView title={"Options #" + (index + 1)} value={value} />
                        ))}
                    </div>
                </>
                : info.type === "FRQ"
                    ? <>
                        <FormView title="Prompt" value={info.prompt} />
                        <FormView title={`Topic (${topics.length})`} value={topics.map(t => t.name).join(", ")} />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <FormView title="Type" value={info.type} />
                            <FormView title="Difficulty" value={info.difficulty} />
                            <FormView title="Points" value={info.points} />
                        </div>
                        <FormView title="Explanation" value={info.explanation} />
                        <FormView title="Hint" value={info.hint} />
                        <FormView title="Answer" value={info.choice?.answers?.single || ""} />
                    </>
                    : <>
                        <FormView title="Prompt" value={info.prompt} />
                        <FormView title={`Topic (${topics.length})`} value={topics.map(t => t.name).join(", ")} />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <FormView title="Type" value={info.type} />
                            <FormView title="Difficulty" value={info.difficulty} />
                            <FormView title="Points" value={info.points} />
                        </div>
                        <FormView title="Explanation" value={info.explanation} />
                        <FormView title="Hint" value={info.hint} />
                        <FormView title="Answer" value={info.choice?.answers?.single || ""} />
                    </>}

            {/* <FormView title="Topic title" value={info.name} />
            <FormView title="Topic description" value={info.description} /> */}
            {/* Add table to see questions later */}


        </FormBuilder >
    )
}

const EditQuestion = ({
    setShow,
    refresh,
    info,
    question_id,
    topics
}: {
    setShow: SetState<ActionFn>,
    refresh: () => void,
    question_id: string,
    info: Question,
    topics: Topics
}) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [prompt, setPrompt] = useState<string>(info.prompt || "");
    const [choiceOptions, setChoiceOptions] = useState<string[]>(info.choice?.options || []);
    const [choiceSingleAnswer, setChoiceSingleAnswer] = useState<"True" | "False">(info.choice?.answers?.single as any || "True");
    const [choiceMultipleAnswers, setChoiceMultipleAnswers] = useState<string[]>(info.choice?.answers?.multiple || []);
    const [frqKind, setFrqKind] = useState<"NUMBER" | "TEXT">(info.frq?.kind || "NUMBER");
    const [frqTolerance, setFrqTolerance] = useState<number>(info.frq?.tolerance || 0);
    const [frqAcceptedNumbers, setFrqAcceptedNumbers] = useState<string[]>(info.frq?.accepted_numbers?.map(String) || []);
    const [frqAcceptedTexts, setFrqAcceptedTexts] = useState<string[]>(info.frq?.accepted_texts || []);
    const [difficulty, setDifficulty] = useState<Questions[number]["difficulty"]>(info.difficulty || "EASY");
    const [points, setPoints] = useState<Questions[number]["points"]>(info.points || 100);
    const [hint, setHint] = useState<Questions[number]["hint"]>(info.hint || "");
    const [explanation, setExplanation] = useState<Questions[number]["explanation"]>(info.explanation || "");
    const [type, setType] = useState<Questions[number]["type"]>(info.type);
    const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>(info.topic_ids || []);

    const { addNotification } = useNotification();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (isSubmitting) return;
        try {
            const body = (
                type === "FRQ"
                    ? {
                        question_id,
                        type,
                        frq: frqKind === "NUMBER" ? {
                            kind: frqKind,
                            tolerance: frqTolerance,
                            accepted_numbers: frqAcceptedNumbers.map(Number),
                        } : {
                            kind: frqKind,
                            accepted_texts: frqAcceptedTexts,
                        },
                        difficulty,
                        points,
                        hint,
                        explanation,
                        prompt,
                        topic_ids: selectedTopicIds,
                    }
                    : type === "TF"
                        ? {
                            question_id,
                            choice: {
                                answers: {
                                    single: choiceSingleAnswer,
                                },
                            },
                            type,
                            difficulty,
                            points,
                            hint,
                            explanation,
                            prompt,
                            topic_ids: selectedTopicIds,
                        }
                        : {
                            question_id,
                            choice: {
                                answers: {
                                    multiple: choiceMultipleAnswers
                                },
                                options: choiceOptions
                            },
                            type,
                            difficulty,
                            points,
                            hint,
                            explanation,
                            prompt,
                            topic_ids: selectedTopicIds,
                        }
            ) satisfies SwaggerDocs["questions/update"]["input"];;

            if (Object.keys(body).length === 0) {
                throw new Error("Body cannot be empty");
            }

            console.log(body);

            const response = await api(
                "questions/update",
                body as any
            );

            if (!response.body || !response.ok) {
                throw new Error(response.message);
            }

            addNotification({ type: "success", msg: "Question created successfully" });
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
                Create a question
            </h2>
            <FormMultiselector
                id="topics"
                value={selectedTopicIds}
                setValue={setSelectedTopicIds}
                iterator={Object.fromEntries(topics.map((topic) => [topic.topic_id, topic.name]))}
                title="Question's choices"
            />
            <FormTextField
                id="prompt"
                value={prompt}
                setValue={setPrompt}
                title="Question's prompt"
                placeholder="What is the result of 1 + 1?"
                maxLength={6000}
            />
            <FormRadiobox
                id="difficulty"
                value={difficulty}
                setValue={setDifficulty}
                title="Question's difficulty"
                iterator={{
                    EASY: "Easy",
                    MEDIUM: "Medium",
                    HARD: "Hard"
                }}
            />
            <FormTextField
                id="points"
                value={points}
                setValue={(v) => setPoints(Number(v))}
                title="Question's points"
                placeholder="100"
            />
            <FormTextField
                id="hint"
                value={hint}
                setValue={setHint}
                title="Question's hint"
                placeholder="Hint"
                maxLength={6000}
            />
            <FormTextField
                id="explanation"
                value={explanation}
                setValue={setExplanation}
                title="Question's explanation"
                placeholder="Explanation"
                maxLength={6000}
            />
            <FormRadiobox
                id="type"
                value={type}
                setValue={setType}
                title="Question's type"
                iterator={{
                    FRQ: "Free Response Question",
                    MCQ: "Multiple Choice",
                    TF: "True or False"
                }}
            />
            {type === "FRQ" && (
                <>
                    <FormRadiobox
                        id="kind"
                        value={frqKind}
                        setValue={setFrqKind}
                        title="Question's kind"
                        iterator={{
                            NUMBER: "Number",
                            TEXT: "Text"
                        }}
                    />
                    {frqKind === "NUMBER" ? (
                        <>
                            <FormTextField
                                id="tolerance"
                                value={frqTolerance}
                                setValue={(v) => setFrqTolerance(Number(v))}
                                title="Question's tolerance"
                                placeholder="Tolerance"
                            />
                            <FormTextInserter
                                id="answer"
                                value={frqAcceptedNumbers}
                                setValue={setFrqAcceptedNumbers}
                                title="Question's answer"
                                placeholder="Answer"
                            />
                        </>
                    ) :
                        <FormTextInserter
                            id="answer"
                            value={frqAcceptedTexts}
                            setValue={setFrqAcceptedTexts}
                            title="Question's answer"
                            placeholder="Answer"
                        />
                    }
                </>
            )}
            {type === "TF" && (
                <FormRadiobox
                    id="answer"
                    value={choiceSingleAnswer}
                    setValue={setChoiceSingleAnswer}
                    title="Question's answer"
                    iterator={{
                        True: "True",
                        False: "False"
                    }}
                />
            )}
            {type === "MCQ" && (
                <>
                    <FormTextInserter
                        id="choices"
                        value={choiceOptions}
                        setValue={setChoiceOptions}
                        title="Question's choices"
                        placeholder="Choice"
                    />
                    <FormMultiselector
                        id="answers"
                        value={choiceMultipleAnswers}
                        setValue={setChoiceMultipleAnswers}
                        iterator={Object.fromEntries(choiceOptions.map((choice, i) => [
                            choice,
                            `[${String.fromCharCode(65 + i)}] ${choice}`
                        ]))}
                        title="Question's answers"
                        text={`${choiceMultipleAnswers.length} / ${choiceOptions.length}`}
                    />
                </>
            )}
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

const DeleteQuestion = ({
    setShow,
    question_id,
    refresh
}: {
    question_id: string,
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
            const response = await api(
                "questions/delete",
                { question_id }
            );

            if (!response.ok) {
                throw new Error(response.message);
            }

            addNotification({ type: "success", msg: "Question excluded successfully" });
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

type Questions = Awaited<ReturnType<typeof api<"questions/all", any>>>["body"];

const QuestionsPage = () => {
    const [action, setAction] = useState<ActionFn>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [topicForm, setTopicForm] = useState<boolean>(false);
    const [questions, setQuestions] = useState<Questions | null>(null);
    const [search, setSearch] = useState<string>("");
    const debouncedSearch = useDebounce(search, 300);
    const { addNotification } = useNotification();
    const [topics, setTopics] = useState<Topics>([]);

    useEffect(() => {
        async function getTopics() {
            try {
                const response = await api("topics/all");
                if (!response.body) {
                    throw new Error(response.message);
                }
                setTopics(response.body);
            } catch (e) {
                addNotification({ type: "error", msg: e instanceof Error ? e.message : String(e) });
            }
        }

        getTopics();
    }, []);

    const getQuestions = async () => {
        setLoading(true);

        try {
            const response = debouncedSearch.trim()
                ? await api("questions/search", { query: debouncedSearch.trim() })
                : await api("questions/all", {});

            if (!response.body) {
                throw new Error(response.message);
            }

            setQuestions(response.body);
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
        getQuestions();
    }, [debouncedSearch]);

    const targetQuestion = questions?.find(t => t.question_id === action?.id);

    return (
        <div className="flex flex-col gap-6">
            {loading && <Loading />}
            {questions && targetQuestion && action && action.mode === "UPDATE" && <EditQuestion
                topics={topics}
                question_id={action.id}
                setShow={setAction}
                info={targetQuestion}
                refresh={getQuestions}
            />}
            {action && targetQuestion && action.mode === "DELETE" && <DeleteQuestion
                setShow={setAction}
                refresh={getQuestions}
                question_id={targetQuestion.question_id}
            />}
            {action && targetQuestion && action.mode === "VIEW" && <ViewQuestion
                topics={topics}
                info={targetQuestion}
                setShow={setAction}
                addNotification={addNotification}
            />}
            <CreateQuestion
                topics={topics}
                setShow={setTopicForm}
                refresh={getQuestions}
                show={topicForm}
            />
            <h1 className="text-2xl mb-2 sm:text-3xl font-medium dark:text-white"></h1>
            {questions ? (
                <Table
                    checkboxes
                    btnText="New Question"
                    actions={setAction}
                    setItemForm={setTopicForm}
                    pattern={{
                        header: [
                            { name: "Prompt" },
                            { name: "Type" },
                            { name: "Difficulty" },
                            { name: "Hint" },
                            { name: "Explanation" },
                            { name: "Points" },
                            { name: "Creation date" },
                            { name: "Last Updated" }
                        ],
                        body: questions.map(t => {
                            return [t.question_id, [
                                { value: t.prompt },
                                { value: t.type },
                                { value: t.difficulty },
                                { value: t.hint },
                                { value: t.explanation },
                                { value: t.points },
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
                    title="Questions"
                />
            ) : loading ? null : "Nothing was found"}
        </div>
    )
}

export default QuestionsPage;

import { useEffect, useState } from "react";
import Table from "./Table";
import { translate, type ActionFn, type SetState } from "../consts";
import { api } from "../utils/request";
import FormBuilder from "../forms/FormBuilder";
import FormTextField from "../forms/FormTextField";
import FormButton from "../forms/FormButton";
import { FaTimes } from "react-icons/fa";


type TableEntry = {
    value: string,
    style?: string
}
type QuestionTableBody = [
    [id: string, [TableEntry, TableEntry, TableEntry]]
]
type NullableQuestionTable = QuestionTableBody | null;

//Should maybe take in arguments to determine the
//Sorting order and text queries
function requestQuestions(){
    //api("") Query questions 
    return null as NullableQuestionTable
} 

function questionCrudOperations(id: any) {
    return {id: id, question: "Who are you?", answers: [{id: 0, answer: "testing one answer"}, {id: 1, answer: "testing two answers"}, {id: 2, answer: "testing three answers"}, {id: 3, answer: "testing four answers"},
        {id: 4, answer: "testing five answers"}
    ]
    }
}
//
const QuestionDisplay = ({questions, setAction}
    :
    {
        questions: NullableQuestionTable
        setAction: SetState<ActionFn>
    }
) => {
    //remember to change this back to 
    // questions === null
    // Maybe === is unnecessary
    if(questions != null) {
        return (
            <div className="content-center">
                <p className="text-pretty text-white text-4xl ">Nothing to see here folks</p>
            </div>
        )
    }
    else {
        return(
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
                        { name: "Question", style: "pl-6 pr-4" },
                        { name: "Type" },
                        { name: "Date of creation" },
                    ],
                    body: questions ? questions : [
                        ["a", [
                            {value: "test", style: "pl-6 pr-4"},
                            {value: "test"},
                            {value: "test"}
                        ]
                    ]
                    ]
                }}
            />
        </div>
    )
    }
}

const QuestionsPage = () => {
    let individualQuestion = questionCrudOperations("");
     const [_action, setAction] = useState<ActionFn>(null);
    const [show, setShow] = useState(false);
    const [question, setQuestion] = useState(individualQuestion.question);
    const [answers, setAnswers] = useState(individualQuestion.answers);
    const [showView, setView] = useState(false);
     console.log(_action)
    let questions = requestQuestions();
    // Delete button would need to be changed later
    useEffect(() => {
        console.log("Effect has been executed")
        if(_action?.mode == "UPDATE") {
            setShow(true);
        }
        else if(_action?.mode == "VIEW") {
            setView(true);
        }
    }, [_action])
    useEffect(() => {
        if(show == false) {
            setAction(null);
        }
        if(showView == false) {
            console.log("showView Disabled");
            setAction(null);
        }
    },[show, showView])

    answers.map((answer, index)=> {console.log(`answer: ${answer}, index: ${index}`)})
    // Need to change CSS Styling to re arrange the 
    return (
        <div>
            <div className="">
            <FormBuilder
            show={show}
            setShow={setShow}>
                <FormTextField id="Question" value={question} setValue={setQuestion} title="Question" titleStyle={"text-black"}/>
                <div className="overflow-y-scroll">
                {answers.map((answer, index) => (
                    <>
                    <FormTextField id={String(index)} value={answer.answer} setValue={(newValue) => {
                        let localAnswers = structuredClone(answers);
                        localAnswers[index].answer = newValue;
                        setAnswers(localAnswers);
                    }} title={"Answer #" + (index+1)} titleStyle={"text-black"}/>
                    <FormButton type="button" text="delete"/>
                    </>
                ))

                }
                </div>
                <FormButton type="submit" text="update"/>
                <FormButton type="button" text="Add Question"/>
            </FormBuilder>
            {/* Should add feature that removes window when clicking out of it though I have to research this or read mroe the formbuilder also fixed the icon at wrong pos
            Also Perhaps I should change this to another form object where it only contains text fields for consistency however that will be later */}
            <div className={`flex justify-center py-8 px-4  sm:px-0 items-center fixed top-0 left-0 w-full h-full bg-black/50 z-50 ${showView ? "" : "hidden"}`}>
            <div className="flex max-h-full overflow-y-auto  flex-col w-full gap-6 p-8 bg-white dark:bg-std-gray-700 
                rounded-xl dark:shadow-std-neutral-700">
                <FaTimes
                                    className="h-5 w-5 absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                                    onClick={() => setView(false)}
                                />
            
                <p>{question}</p>
                <div className="overflow-y-auto flex flex-col gap-6 p-8">
                {answers.map((answer, index) => (
                    <>
                        <h5>{"Answer #" + (index+1)}</h5>
                        <p>{answer.answer}</p>
                    </>
                ))}
                </div>
                </div>
            </div>
            
            {/* <Field name="Question" value={question} hook={setQuestion} textStyle="text-white" spanStyle="font-medium text-white text-lg border-b-2 pb-1 border-b-white"/>
            {answers.map((answer) => (
                <Field name="Answer" value={answer.answer} hook={(newValue) => { 
                    let localAnswers = structuredClone(answers);
                    localAnswers[answer.id].answer = newValue;
                    setAnswers(localAnswers);
                }} textStyle="text-white" spanStyle="font-medium text-white text-lg border-b-2 pb-1 border-b-white"/>
            ))} */}
        </div>
    )
            <QuestionDisplay questions={questions} setAction={setAction}/>
        </div>
    )
    
}

export default QuestionsPage;
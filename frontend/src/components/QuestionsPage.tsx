import { useEffect, useState } from "react";
import Table from "./Table";
import { translate, type ActionFn, type SetState } from "../consts";
import { api } from "../utils/request";
import FormBuilder from "../forms/FormBuilder";
import FormTextField from "../forms/FormTextField";
import FormButton from "../forms/FormButton";


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
            <h2 className="text-xl mx-4 dark:text-white">Your tests/quizzes</h2>
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
     console.log(_action)
    let questions = requestQuestions();
    useEffect(() => {
        console.log("Effect has been executed")
        if(_action?.mode == "UPDATE") {
            setShow(true);
        }
    })

    answers.map((answer, index)=> {console.log(`answer: ${answer}, index: ${index}`)})

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
                    }} title={"Question #" + (index+1)} titleStyle={"text-black"}/>
                    <FormButton type="button" text="delete"/>
                    </>
                ))

                }
                </div>
                <FormButton type="submit" text="update"/>
                <FormButton type="button" text="Add Question"/>
            </FormBuilder>

            
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
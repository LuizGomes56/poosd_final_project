import { useState } from "react";
import Table from "./Table";
import { translate, type ActionFn, type SetState } from "../consts";
import { api } from "../utils/request";
import QuestionEditPopup from "./QuestionEdit";
import QuestionEditPage from "./QuestionEdit";
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
     const [_action, setAction] = useState<ActionFn>(null);
     console.log(_action)
    let questions = requestQuestions();
    if(_action != null && _action.mode == "UPDATE") {
        return (
            <div>
                <QuestionEditPage id={_action.id}/>
            </div>
        )
    }
    else {
        return (
            <div>
                <QuestionDisplay questions={questions} setAction={setAction}/>
            </div>
        )
    }
}

export default QuestionsPage;
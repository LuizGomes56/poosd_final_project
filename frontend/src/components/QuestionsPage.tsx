import { useState } from "react";
import Table from "./Table";
import { translate, type ActionFn } from "../consts";
import { api } from "../utils/request";
type TableEntries = {
    value: string,
    style?: string
}
type QuestionTableBody = [
    [id: string, [TableEntries, ...TableEntries[]]]
]
function requestQuestions(){
    //api("") Query questions 
}

const QuestionsPage = () => {
     const [_action, setAction] = useState<ActionFn>(null);

    
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
                        { name: "Topics", style: "pl-6 pr-4" },
                        { name: "Questions" },
                        { name: "Date of creation" },
                    ],
                    body: [
                        ["a", [
                            { value: "Mathematics", style: "pl-6 pr-4" },
                            { value: "52" },
                            { value: translate(new Date(), "en-US") }
                        ]],
                        ["b", [
                            { value: "Physics", style: "pl-6 pr-4" },
                            { value: "22" },
                            { value: translate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24), "en-US") }
                        ]],
                        ["c", [
                            { value: "Chemistry", style: "pl-6 pr-4" },
                            { value: "94" },
                            { value: translate(new Date(new Date().getTime() - 63 * 1000 * 60 * 60 * 24), "en-US") }
                        ]],
                    ]
                }}
            />
        </div>
    )
}

export default QuestionsPage;
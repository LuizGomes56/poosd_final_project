import type { ActionFn, SetState } from "src/consts"
import Table from "./Table"
import { useState } from "react"

type TopicTableBody = [
    [id: string, [{value: string, style?: string}, {value: string, style?: string}, {value: string, style?: string}]]
]

function getTopicTableBody() {
    return [
                        ["a", [
                            {value: "test1", style: "pl-6 pr-4"},
                            {value: "72"},
                            {value: "test"}
                        ]
                    ]
                    ] as TopicTableBody
}

const TopicTable = ({topics: topics, setAction}
    :
    {
        topics: TopicTableBody
        setAction: SetState<ActionFn>
    }
) => {
    //remember to change this back to 
    // questions === null
    // Maybe === is unnecessary
    if(topics === null) {
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
                        { name: "Topic", style: "pl-6 pr-4" },
                        { name: "Number of Questions"},
                        { name: "Date of creation" },
                    ],
                    body: topics ? topics : [
                        ["a", [
                            {value: "test2", style: "pl-6 pr-4"},
                            {value: "72"},
                            {value: "test1"}
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
            <TopicTable topics={topics} setAction={setAction}/>
        </div>
    )
}

export default TopicsPage;
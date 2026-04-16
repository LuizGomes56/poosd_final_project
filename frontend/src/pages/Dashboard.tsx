import { useState, useEffect } from "react";
import Table from "../components/Table";
import { api } from "../utils/request";

// import Table from "../components/Table";
// import { translate, type ActionFn } from "../consts";

/*
Number of topics owned
Total number of questions
Questions created/updated in the past X days
Number of FRQ/MCQ/TF questions per topic (or average)
Total number of points per topic (each question has points, so it is just the sum of it)
*/
/*
inputs:
authorization token should be provided
email or user id must also be provided
outputs:
Number of topics owned
just int type
Questions created/updated in the past 7 days
just int type
Number of FRQ/MCQ/TF questions per topic (likely as a table )
an array of objects {topic: id, FRQs: int, TF: int, totalpoints: int}
Total number of points per topic
*/

const DashboardTable = (tableEntries: Data["topics"]) => {

    return (
        <>
            <Table
                btnText=""
                pattern={{
                    header: [
                        { name: "Topic Name", style: "pl-6" },
                        { name: "Total Points" },
                        { name: "# FRQs" },
                        { name: "# MCQ" },
                        { name: "# TF" }
                    ],
                    body: tableEntries.map(t => {
                        return [t.topic_id, [
                            { value: t.name, style: "pl-6" },
                            { value: t.total_points },
                            { value: t.questions.frq },
                            { value: t.questions.mcq },
                            { value: t.questions.tf }
                        ]]
                    })
                }}
                title="Questions"
            />
        </>
    )
}

type Data = Awaited<ReturnType<typeof api<"users/dashboard", any>>>["body"];

const Dashboard = () => {
    const [data, setData] = useState<Data>({
        number_of_topics: 0,
        questions_created_last_week: 0,
        topics: []
    });

    useEffect(() => {
        const getData = async () => {
            const response = await api("users/dashboard");
            setData(response.body);
        };

        getData();
    }, [])


    return (
        // <div className="flex flex-col gap-4 mb-48">
        //     <h1 className="text-3xl font-medium dark:text-white">Dashboard</h1>
        //     <div className="flex flex-wrap gap-4 dark:text-zinc-300">
        //         <div>
        //             <h5>Total Number Of Topics</h5>
        //             <p>
        //                 {data.number_of_topics}
        //             </p>
        //         </div>
        //         <div>
        //             <h5>Questions Created Last week</h5>
        //             <p>
        //                 {data.questions_created_last_week}
        //             </p>
        //         </div>
        //         <div>
        //         <DashboardTable tableEntries={data.topics}/>
        //         </div>
        //     </div>
        // </div>

        <div className="flex flex-col gap-8 mb-48 p-4">
            <h1 className="text-3xl font-semibold dark:text-white tracking-tight">Dashboard</h1>

            <div className="flex flex-wrap gap-6 items-start">
                {/* Stat Card 1 */}
                <div className="aspect-square w-full sm:w-64 flex flex-col items-center justify-center p-6 not-dark:bg-white dark:bg-zinc-900 border not-dark:border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm transition-hover hover:shadow-md">
                    <h5 className="not-dark:text-zinc-500 dark:text-zinc-400 text-sm font-medium uppercase tracking-wider text-center">
                        Total Topics
                    </h5>
                    <p className="text-5xl font-bold mt-2 dark:text-white">
                        {data.number_of_topics}
                    </p>
                </div>

                {/* Stat Card 2 */}
                <div className="aspect-square w-full sm:w-64 flex flex-col items-center justify-center p-6 not-dark:bg-white dark:bg-zinc-900 border not-dark:border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm transition-hover hover:shadow-md">
                    <h5 className="not-dark:text-zinc-500 dark:text-zinc-400 text-sm font-medium uppercase tracking-wider text-center px-4">
                        Questions <br /> Last Week
                    </h5>
                    <p className="text-5xl font-bold mt-2 not-dark:text-blue-600 dark:text-blue-400">
                        {data.questions_created_last_week}
                    </p>
                </div>

                {/* Table Container - Typically tables shouldn't be square, so this stays flexible */}
                <div className="flex-1 min-w-75 p-6 not-dark:bg-white dark:bg-zinc-900 border not-dark:border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
                    <h5 className="not-dark:text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-4 uppercase tracking-wider">
                        Topic Breakdown
                    </h5>
                    {DashboardTable(data.topics)}
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
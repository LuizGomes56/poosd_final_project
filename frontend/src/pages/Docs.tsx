import { useEffect, useState } from "react";

export default function Docs() {
    const [docs, setDocs] = useState("Loading...");

    useEffect(() => {
        async function getDocs() {
            const response = await fetch("/docs.txt");
            const data = await response.text();
            setDocs(data);
        }
        getDocs();
    }, []);

    return (
        <pre>
            <code
                className="whitespace-pre-wrap text-[#d4d4d4]"
                style={{ whiteSpace: "pre-wrap" }}
                dangerouslySetInnerHTML={{
                    __html: docs.replace(/\\n/g, "\n")
                        .replace(/\n/g, "<br/>")
                }}
            />
        </pre>
    )
}
import { useEffect, useState } from "react";
import { useSkip } from "../hooks";

export default function Docs() {
    const [docs, setDocs] = useState("");

    useEffect(() => {
        (window as any)?.hljs?.highlightAll();
    }, [])

    useSkip(() => {
        async function getDocs() {
            const response = await fetch("/docs.txt");
            const data = await response.text();

            if (data && typeof data === "string") {
                let hljs = (window as any)?.hljs;
                if (hljs) {
                    const code = hljs.highlight(data, { language: "typescript" }).value;
                    setDocs(code);
                }
            }
        }
        getDocs();
    }, []);

    return (
        <pre>
            <code
                className="language-typescript"
                dangerouslySetInnerHTML={{ __html: docs }}
            />
        </pre>
    )
}
import { useEffect, useState } from "react";
//import { api } from "../utils/request";

export default function Header() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    useEffect(() => {
        setName(localStorage.getItem("full_name") || "");
        setEmail(localStorage.getItem("email") || "");
    }, []);
    return (
        <header>
            <p>{name}</p>
            <p>{email}</p>
        </header>
    )

}
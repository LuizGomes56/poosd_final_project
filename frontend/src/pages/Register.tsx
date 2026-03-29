import { useState } from "react";
import { Field } from "../components/Form";
import Button from "../components/Button";
import { api } from "../utils/request";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [ErrorString, setErrorString] = useState("");
    const navigate = useNavigate();

    const register = async () => {
        const response = await api("users/register", { full_name: fullName, email: email, password: password });
        if (response.ok) {
            navigate('/login');

        }
        setErrorString(response.message);
    }

    return (
        <div className="
            place-self-center my-12 rounded-xl max-w-md
            w-full flex flex-col gap-4 p-6 bg-zinc-800 
            text-white
        ">
            <Field
                name="Full Name"
                value={fullName}
                hook={setFullName}
                placeholder="Your name"
            />
            <Field
                name="Email Address"
                value={email}
                hook={setEmail}
                placeholder="Your email address"
            />
            <Field
                name="Password"
                value={password}
                hook={setPassword}
                placeholder="Your password"
                type="password"
            />
            <Button
                color="emerald"
                text={"Register"}
                onClick={register}
            />
            <p>{ErrorString}</p>
        </div>

    )
}
import { useState } from "react";
import Button from "../components/Button";
import { Field } from "../components/Form";
import { api } from "../utils/request";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [ErrorText, setErrorText] = useState("");
    const navigate = useNavigate();

    const loginRequest = async () => {
        const response = await api("users/login", { email, password })
        if (response.ok && response.body != undefined) {
            const token = response.body.token;
            localStorage.setItem("token", token);
            localStorage.setItem("full_name", response.body.full_name);
            localStorage.setItem("email", response.body.email);
            navigate("/");
        }
        setErrorText(response.message);
    }

    return (
        <div className="
            place-self-center my-12 rounded-xl max-w-md
            w-full flex flex-col gap-4 p-6 bg-zinc-800 
            text-white
        ">
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
            />
            <Button
                extraClasses="place-self-end w-fit"
                color={"emerald"}
                text={"Submit"}
                onClick={loginRequest}
            />
            <p>{ErrorText}</p>
        </div>
    )
}

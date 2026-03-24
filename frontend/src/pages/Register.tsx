import { useState } from "react";
import { Field } from "../components/Form";
import Button from "../components/Button";

// const login_url = ""

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");

    // let register = async () => {
    //     const response = await fetch(login_url,
    //         method: "POST",
    //         body: {

    //     }
    //     }
    //     )
    // }

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
            />
            <Button
                color="emerald"
                text={"Register"}
            // onClick={register}
            />
        </div>
    )
}
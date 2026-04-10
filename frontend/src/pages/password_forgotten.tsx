import { useState } from "react";
import FormBuilder from "../forms/FormBuilder";
import FormTextField from "../forms/FormTextField";
import FormButton from "../forms/FormButton";
import { api } from "../utils/request";


function password_forgotten() {
    const [email, setEmail] = useState("");
    const submitEmail = async () => {
        const result = await api("")
    }
    return (
        <>
            <div>
                <h2>
                    Forgotten Password
                </h2>
                <h5>
                    Input your account email
                </h5>
                <FormBuilder show={true} setShow={() => { }} handleSubmit={ } >
                    <FormTextField id="a" value={email} setValue={setEmail} title="Email" />
                    <FormButton type="submit" text="Enter" />
                </FormBuilder>
            </div>
        </>
    )
}

export default password_forgotten;
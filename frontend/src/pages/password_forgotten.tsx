import { useState } from "react";
import FormBuilder from "../forms/FormBuilder";
import FormTextField from "../forms/FormTextField";
import FormButton from "../forms/FormButton";
import { api } from "../utils/request";
import { useNotification } from "../providers/NotificationProvider";


function PasswordForgotten() {
    const [email, setEmail] = useState("");
    const { addNotification } = useNotification();

    const submitEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await api("users/forgot_password", { email });
            addNotification({ type: result.ok ? "success" : "error", msg: result.message })
        }
        catch (e) {
            addNotification({ type: "error", msg: e as any })
        }
    }

    return (
        <FormBuilder show={true} setShow={() => { }} handleSubmit={submitEmail} >
            <FormTextField id="a" value={email} setValue={setEmail} title="Enter Email to reset password" />
            <FormButton type="submit" text="Enter" />
        </FormBuilder>
    )
}

export default PasswordForgotten;
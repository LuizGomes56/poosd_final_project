import { useState } from "react";
import FormBuilder from "../forms/FormBuilder";
import FormTextField from "../forms/FormTextField";
import FormButton from "../forms/FormButton";
import { useNotification } from "../providers/NotificationProvider";
import { api } from "../utils/request";

function PasswordReset() {
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const { addNotification } = useNotification();

    const submitCode = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api("users/reset_password", { code, password: newPassword });
            addNotification({ type: response.ok ? "success" : "error", msg: response.message })
        } catch (e) {
            addNotification({ type: "error", msg: e instanceof Error ? e.message : "Something went wrong" })
        }
    }

    return (
        <>
            <div>
                <FormBuilder show={true} setShow={() => { }} handleSubmit={submitCode}>
                    <FormTextField id="a" value={code} setValue={setCode} title="Input your password reset code" maxLength={6} />
                    <FormTextField id="b" value={newPassword} setValue={setNewPassword} title="Input your new password" type="password" />
                    <FormButton type="submit" text="Enter" />
                </FormBuilder>
            </div>
        </>
    )
}

export default PasswordReset;
import { useState } from "react";
import { useUser } from "../providers/UserProvider";
import { useNotification } from "../providers/NotificationProvider";
import ConfigEditor from "../config/ConfigEditor";
import ConfigTextInput from "../config/ConfigTextInput";
import ConfigTextField from "../config/ConfigTextField";
import { translate } from "../consts";

const AccountSettings = () => {
    const { user } = useUser();
    const [name, setName] = useState<string>(user?.full_name ?? "Undefined");
    const [email, setEmail] = useState<string>(user?.email ?? "Undefined");
    const { addNotification } = useNotification();

    return (
        <div className="flex flex-col gap-4 max-w-3xl mb-48">
            <h1 className="text-2xl sm:text-3xl font-medium dark:text-white">Your account</h1>
            <ConfigEditor
                id="name"
                title="Display name"
                value={name}
                setValue={setName}
                addNotification={addNotification}
                Component={ConfigTextInput}
            />
            <ConfigEditor
                id="email"
                title="Email"
                value={email}
                setValue={setEmail}
                Component={ConfigTextInput}
                addNotification={addNotification}
            />
            <ConfigTextField
                title="Email verified"
                description={user?.email_verified ? "Yes" : "No"}
            />
            <ConfigTextField
                title="Your account creation date"
                description={translate(user?.createdAt!, "en-US") || "Unknown"}
            />
        </div >
    )
}

export default AccountSettings;
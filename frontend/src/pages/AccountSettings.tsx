import { useState } from "react";
import { useUser } from "../providers/UserProvider";
import { useNotification } from "../providers/NotificationProvider";
import ConfigEditor from "../config/ConfigEditor";
import ConfigTextInput from "../config/ConfigTextInput";
import ConfigTextField from "../config/ConfigTextField";
import { translate, STYLES } from "../consts";
import Button from "../components/Button";
import { api } from "../utils/request";

const AccountSettings = () => {
    const { user } = useUser();
    const [name, setName] = useState<string>(user?.full_name ?? "Undefined");
    const [email, setEmail] = useState<string>(user?.email ?? "Undefined");
    const { addNotification } = useNotification();
    const [verifyingEmail, setVerifyingEmail] = useState<boolean>(false);
    const [emailCode, setEmailCode] = useState<string>("");

    return (
        <div className="flex flex-col gap-4 max-w-3xl mb-48">
            <h1 className="text-2xl sm:text-3xl font-medium dark:text-white">Your account</h1>
            <ConfigEditor
                id="full_name"
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
            <div className={`flex dark:text-zinc-200 gap-2 gap-x-8 border-b min-h-28 ${STYLES.border} pb-6`}>
                <div className="flex flex-1 flex-col gap-4">
                    <h2 className="dark:text-white h-10 content-center">Email Verified</h2>
                    <p className="mx-4 dark:text-zinc-400 text-zinc-600">{user?.email_verified ? "Yes" : "No"}</p>
                </div>
                {!user?.email_verified && (
                    verifyingEmail ? (
                        <div className="flex items-center gap-3">
                            <label
                                className={`
                    flex items-center justify-center
                    w-44 h-12 px-4
                    rounded-md border
                    bg-white/70 dark:bg-zinc-900/70
                    shadow-sm
                    ${STYLES.border}
                    ${STYLES.focusWithin}
                    transition-all duration-200
                `}
                            >
                                <input
                                    placeholder="000000"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={emailCode}
                                    onChange={async (e) => {
                                        let code = e.currentTarget.value.replace(/\D/g, "").slice(0, 6);
                                        setEmailCode(code);

                                        if (code.length == 6) {
                                            const result = await api("users/verify_email", { code });
                                            addNotification({ type: result.ok ? "success" : "error", msg: result.message });
                                            if (result.ok) {
                                                setVerifyingEmail(false);
                                            }
                                        }
                                    }}
                                    className="
                                        w-full bg-transparent text-center
                                        text-lg font-semibold tracking-[0.4em]
                                        text-zinc-800 dark:text-zinc-100
                                        placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                                        focus:outline-none
                                    "
                                />
                            </label>
                        </div>
                    ) : (
                        <Button
                            text="Verify email"
                            onClick={async () => {
                                setVerifyingEmail(true)
                                const result = await api("users/send_email_verification");
                                addNotification({ type: !result.ok ? "success" : "error", msg: result.message });
                            }}
                            color="emerald"
                            className="h-12 place-self-end"
                        />
                    )
                )}
            </div>
            <ConfigTextField
                title="Your account creation date"
                description={translate(user?.createdAt!, "en-US") || "Unknown"}
            />
        </div >
    )
}

export default AccountSettings;
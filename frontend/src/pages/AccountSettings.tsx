import { useState, useEffect } from "react";
import { useUser } from "../providers/UserProvider";
import { useNotification } from "../providers/NotificationProvider";
import ConfigEditor from "../config/ConfigEditor";
import ConfigTextInput from "../config/ConfigTextInput";
import ConfigTextField from "../config/ConfigTextField";
import { translate } from "../consts";

const AccountSettings = () => {
    const { user } = useUser();
    
    const [name, setName] = useState<string>(user?.full_name ?? "");
    const [email, setEmail] = useState<string>(user?.email ?? "");
    const { addNotification } = useNotification();

    useEffect(() => {
        if (user) {
            setName(user.full_name);
            setEmail(user.email);
        }
    }, [user]);

    return (
        <div className="flex flex-col gap-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-2">
                <h1 className="text-3xl font-bold text-white">Your Account</h1>
                <p className="text-zinc-500 text-sm mt-1">
                    Manage your public profile and account security settings.
                </p>
            </div>

            <div className="flex flex-col gap-1">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                    <ConfigEditor
                        id="name"
                        title="Display Name"
                        value={name}
                        setValue={setName}
                        addNotification={addNotification}
                        Component={ConfigTextInput}
                    />
                    <div className="border-t border-zinc-800/50" />
                    <ConfigEditor
                        id="email"
                        title="Email Address"
                        value={email}
                        setValue={setEmail}
                        Component={ConfigTextInput}
                        addNotification={addNotification}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-1">
                    <ConfigTextField
                        title="Email Verified"
                        description={user?.email_verified ? "✅ Verified" : "⚠️ Pending Verification"}
                    />
                </div>
                <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-1">
                    <ConfigTextField
                        title="Account Created"
                        description={user?.createdAt ? translate(user.createdAt, "en-US") : "Date not available"}
                    />
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800">
                <p className="text-zinc-600 text-[10px] uppercase tracking-tighter">
                    Internal User ID: <span className="font-mono">{user?.id || "not-found"}</span>
                </p>
            </div>
        </div>
    )
}

export default AccountSettings;
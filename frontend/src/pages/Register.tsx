import { useState } from "react";
import Button from "../components/Button";
import { Field } from "../components/Form";
import { api } from "../utils/request";
import { useNavigate, Link } from "react-router-dom";
import { useNotification } from "../providers/NotificationProvider";

export default function Register() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    const registerRequest = async () => {
        if (!fullName || !email || !password) {
            addNotification({ type: "error", msg: "Please fill in all fields" });
            return;
        }

        setIsLoading(true);
        try {
            const response = await api("users/register", { 
                full_name: fullName, 
                email: email, 
                password: password 
            });

            if (response.ok) {
                addNotification({
                    type: "success",
                    msg: "Account created! Please check your email and log in.",
                });
                navigate('/login');
            } else {
                addNotification({
                    type: "error",
                    msg: response.message ?? "Registration failed",
                    persist: true
                });
            }
        } catch (e) {
            addNotification({
                type: "error",
                msg: e instanceof Error ? e.message : "Something went wrong",
                persist: true
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") registerRequest();
    };

    return (
        <div className="place-self-center my-12 rounded-xl max-w-md w-full flex flex-col gap-4 p-8 bg-zinc-900 border border-zinc-800 text-white shadow-2xl">
            
            <div className="text-center mb-2">
                <h1 className="text-2xl font-bold">Create account</h1>
                <p className="text-zinc-500 text-sm">Join as an instructor</p>
            </div>

            <div onKeyDown={handleKeyDown} className="flex flex-col gap-4">
                <Field
                    name="Full Name"
                    value={fullName}
                    hook={setFullName}
                    placeholder="Name Lastname"
                />
                <Field
                    name="Email Address"
                    value={email}
                    hook={setEmail}
                    placeholder="you@email.com"
                />
                <Field
                    name="Password"
                    value={password}
                    hook={setPassword}
                    placeholder="Create a strong password"
                    type="password"
                />
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 my-2">
                <p className="text-blue-400 text-xs leading-relaxed">
                    ℹ️ A verification email will be sent. You must confirm it before logging in.
                </p>
            </div>

            <Button
                className="w-full"
                color="emerald"
                text={isLoading ? "Creating account..." : "Create Account"}
                onClick={registerRequest}
                disabled={isLoading}
            />

            <p className="text-center text-zinc-500 text-xs mt-2">
                Already have an account?{" "}
                <Link to="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                    Sign in
                </Link>
            </p>
        </div>
    )
}
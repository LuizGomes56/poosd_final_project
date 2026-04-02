import { useState } from "react";
import Button from "../components/Button";
import { Field } from "../components/Form";
import { api } from "../utils/request";
import { useNavigate, Link } from "react-router-dom";
import { useNotification } from "../providers/NotificationProvider";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    const loginRequest = async () => {
        // Validation check from Code 2
        if (!email || !password) {
            addNotification({ type: "error", msg: "Please fill in all fields" });
            return;
        }

        setIsLoading(true);
        try {
            const response = await api("users/login", { email, password });
            
            if (response.ok && response.body) {
                localStorage.setItem("token", response.body.token);
                localStorage.setItem("full_name", response.body.full_name ?? "");
                localStorage.setItem("email", response.body.email ?? "");
                return navigate("/dashboard");
            } else {
                addNotification({
                    type: "error",
                    msg: response.message ?? "Login failed",
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
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") loginRequest();
    };

    return (
        <div className="place-self-center my-20 rounded-xl max-w-md w-full flex flex-col gap-4 p-8 bg-zinc-900 border border-zinc-800 text-white shadow-2xl">
            
            <div className="text-center mb-4">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-zinc-500 text-sm">Sign in to your account</p>
            </div>

            <div onKeyDown={handleKeyDown}>
                <Field
                    name="Email Address"
                    value={email}
                    hook={setEmail}
                    placeholder="you@university.edu"
                />
                <div className="mt-4">
                    <Field
                        name="Password"
                        value={password}
                        hook={setPassword}
                        placeholder="••••••••"
                        type="password"
                    />
                </div>
            </div>

            <div className="flex justify-between items-center mt-2">
                <Link to="/register" className="text-emerald-500 text-xs hover:underline">
                    No account? Register
                </Link>
                <Link to="/forgot-password" className="text-zinc-500 text-xs hover:text-emerald-400">
                    Forgot password?
                </Link>
            </div>

            <Button
                className="w-full mt-2"
                color={"emerald"}
                text={isLoading ? "Signing in..." : "Sign In"}
                onClick={loginRequest}
                disabled={isLoading}
            />
        </div>
    );
}

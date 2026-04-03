import { useState } from "react";
import { Link } from "react-router-dom";
import { useNotification } from "../providers/NotificationProvider";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    const { addNotification } = useNotification();

    const handleSubmit = async () => {
        if (!email) {
            addNotification({ type: "error", msg: "Please enter your email address" });
            return;
        }

        // to do: backend needs a forgot-password endpoint
        // need to add: POST /api/users/forgot-password
        // it should generate a reset token and email it to the user using SendGrid/NodeMailer
        // for now we just simulate the flow so the UI works
        setSent(true);
        addNotification({
            type: "info",
            msg: "If that email exists, a reset link has been sent.",
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 w-full max-w-sm">
                <Link
                    to="/login"
                    className="flex items-center gap-1 text-zinc-500 text-xs hover:text-zinc-300 transition-colors mb-6 w-fit"
                >
                    ← Back to login
                </Link>

                {!sent ? (
                    <>
                        <h2 className="text-white text-lg font-bold mb-1">Reset password</h2>
                        <p className="text-zinc-500 text-sm mb-6">
                            Enter your email and we'll send you a reset link
                        </p>

                        <div className="mb-5">
                            <label className="text-zinc-400 text-xs block mb-1">Email address</label>
                            <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 focus-within:border-amber-500/50 transition-colors">
                                <span className="text-zinc-500 text-sm">✉</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                    placeholder="you@university.edu"
                                    className="flex-1 bg-transparent text-white text-sm outline-none placeholder-zinc-600"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 rounded-lg text-sm transition-colors"
                        >
                            Send Reset Link
                        </button>
                    </>
                ) : (
                    <div className="text-center py-4">
                        <div className="text-4xl mb-4">📧</div>
                        <h2 className="text-white font-bold mb-2">Check your email</h2>
                        <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                            If an account with that email exists, we've sent a password reset link.
                        </p>
                        <Link
                            to="/login"
                            className="text-green-400 hover:text-green-300 text-sm transition-colors"
                        >
                            ← Back to login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
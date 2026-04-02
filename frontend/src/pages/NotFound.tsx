import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-zinc-950 text-white p-4">
            <div className="mb-8 opacity-20 text-8xl">
                🚫
            </div>

            <h1 className="text-9xl font-black text-emerald-500/20 absolute select-none">
                404
            </h1>

            <div className="relative z-10 flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-2">Page not found</h2>
                <p className="text-zinc-500 text-center max-w-xs mb-8">
                    The page you are looking for doesn't exist or has been moved to another universe.
                </p>

                <Button
                    text="Go back to Dashboard"
                    onClick={() => navigate("/")}
                    color="emerald"
                    className="shadow-xl shadow-emerald-500/10"
                />
            </div>

            <p className="absolute bottom-8 text-zinc-700 text-xs tracking-widest uppercase font-bold">
                EduCMS Core
            </p>
        </div>
    );
};

export default NotFound;
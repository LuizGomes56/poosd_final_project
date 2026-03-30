import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center h-screen not-dark:bg-gray-100 dark:bg-std-gray-900 dark:text-white">
            <h1 className="text-9xl font-bold">404</h1>
            <p className="text-2xl mt-4">Page not found</p>
            <div className="mt-8">
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="px-6 py-3 text-lg font-semibold bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-all">
                    Go back to home page
                </button>
            </div>
        </div>
    );
};

export default NotFound;
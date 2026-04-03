import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./pages/Login.tsx"
import Register from "./pages/Register.tsx";
// import Dashboard from "./pages/Dashboard.tsx";
// import Questions from "./pages/Questions.tsx";
// import Topics from "./pages/Topics.tsx";
// import Layout from "./pages/Layout.tsx";
import NotFound from "./pages/NotFound.tsx";
// import AccountSettings from "./pages/AccountSettings.tsx";

import AppProvider from "./providers/AppProvider.tsx";
import RequireLogin from "./providers/RequireLogin.tsx";
import App from "./pages/App.tsx";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <AppProvider>
            <Routes>
                <Route element={<RequireLogin />}>
                    <Route path="/" element={<App />} />
                    <Route path="/settings/:tab" element={<App />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AppProvider>
    </BrowserRouter>
)
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Login from "./pages/Login.tsx"
import Register from "./pages/Register.tsx";
import Dashboard from "./pages/Dashboard.tsx";
// import Questions from "./pages/Questions.tsx";
// import Topics from "./pages/Topics.tsx";
import Layout from "./pages/Layout.tsx";
import NotFound from "./pages/NotFound.tsx";
import AccountSettings from "./pages/AccountSettings.tsx";

import AppProvider from "./providers/AppProvider.tsx";
import RequireLogin from "./providers/RequireLogin.tsx";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <AppProvider>
            <Routes>
                <Route element={<RequireLogin />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        
                        <Route path="/dashboard" element={<Dashboard />} />
                        {/* <Route path="/dashboard/questions" element={<Questions />} />
                        <Route path="/dashboard/topics" element={<Topics />} /> */}
                        
                        <Route path="/settings/:tab" element={<AccountSettings />} />
                    </Route>
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AppProvider>
    </BrowserRouter>
)
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css"
import Homepage from "./pages/Homepage.tsx"
import Login from "./pages/Login.tsx"
import Register from "./pages/Register.tsx";
import AppProvider from "./providers/AppProvider.tsx";
import RequireLogin from "./providers/RequireLogin.tsx";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <AppProvider>
            <Routes>
                <Route element={<RequireLogin />}>
                    <Route path="/" element={<Homepage />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </AppProvider>
    </BrowserRouter>
)

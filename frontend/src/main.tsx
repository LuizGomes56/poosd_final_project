import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css"
import Homepage from "./pages/Homepage.tsx"
import Login from "./pages/Login.tsx"
import Register from "./pages/Register.tsx";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    </BrowserRouter>
)

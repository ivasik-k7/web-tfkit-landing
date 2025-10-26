import App from "./App.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
            </Routes>
        </BrowserRouter>
    );
}
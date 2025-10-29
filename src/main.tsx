import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {App} from "./App";
import "./index.css";
import {BrowserRouter} from "react-router-dom";
import {AppRouter} from "./AppRouter.tsx";   // <-- this is crucial

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AppRouter />
    </StrictMode>,
)
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRouter } from "./AppRouter.tsx";

import './styles/imports.css';
import './styles/variables.css'
import "./styles/scrollbar.css";
// component related
import './styles/hero.css';
import './styles/features.css';
import './styles/visualization.css'
import './styles/footer.css'


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AppRouter />
    </StrictMode>,
)
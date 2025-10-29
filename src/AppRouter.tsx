
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { App } from './App.tsx';
import {Documentation} from "./pages/Documentation.tsx";
export function AppRouter() {
  return <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/docs" element={<Documentation />} />
      </Routes>
    </BrowserRouter>;
}
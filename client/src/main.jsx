import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 1. Import this
import App from "./App.jsx";
import "./index.css";
import { AuthContextProvider } from './context/AuthContext';

createRoot(document.getElementById("root")).render(

    <AuthContextProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </AuthContextProvider>
);

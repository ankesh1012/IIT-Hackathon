import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 1. Import this
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  // 2. Wrap your App component like this
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

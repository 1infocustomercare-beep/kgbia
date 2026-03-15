import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Performance: ensure root renders immediately
const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}

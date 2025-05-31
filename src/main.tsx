import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.tsx";
import LoginPage from "./pages/login-page.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="dashboard" element={<App />} />
        <Route path="login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

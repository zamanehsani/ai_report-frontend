import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.tsx";
import LoginPage from "./pages/login-page.tsx";
import { SectionCards } from "./components/section-cards.tsx";
import Analytic from "./components/analytic.tsx";
import NotFound from "./components/not-found.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="dashboard" element={<App />}>
          <Route index element={<Analytic />} />
          <Route path="clients" element={<SectionCards />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

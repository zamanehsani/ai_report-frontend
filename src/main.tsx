import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.tsx";
import LoginPage from "./pages/login-page.tsx";
import Analytic from "./components/analytic.tsx";
import NotFound from "./components/not-found.tsx";
import Clients from "./pages/clients.tsx";
import Personnels from "./pages/personnels.tsx";
import Reports from "./pages/reports.tsx";
import Sites from "./pages/sites.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="dashboard" element={<App />}>
          <Route index element={<Analytic />} />
          <Route path="personnels" element={<Personnels />} />
          <Route path="clients" element={<Clients />} />
          <Route path="sites" element={<Sites />} />
          <Route path="reports" element={<Reports />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

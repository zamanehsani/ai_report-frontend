import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.tsx";
import LoginPage from "./pages/login-page.tsx";
import AdminPage from "./components/admin-page.tsx";
import NotFound from "./components/not-found.tsx";
// import Clients from "./pages/clients.tsx";
// import Personnels from "./pages/personnels.tsx";
import Reports from "./pages/reports.tsx";
import Sites from "./pages/sites.tsx";
import PrivateRoute from "./private-routes.tsx";
import AddReports from "./pages/add_report.tsx";
import AddAdminUser from "./pages/add-admin-user.tsx";
import MyProfile from "./pages/profile.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="dashboard" element={<App />}>
            <Route index element={<Reports />} />
            <Route path="add-user" element={<AddAdminUser />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="add-report" element={<AddReports />} />
            {/* <Route path="personnels" element={<Personnels />} />
            <Route path="clients" element={<Clients />} /> */}
            <Route path="sites" element={<Sites />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

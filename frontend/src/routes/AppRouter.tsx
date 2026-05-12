import { BrowserRouter, Route, Routes } from "react-router-dom";

import { LoginPage } from "../pages/LoginPage";
import { RoleRedirectPage } from "../pages/RoleRedirectPage";
import { CompanyHomePage } from "../pages/CompanyHomePage";
import { ClientHomePage } from "../pages/ClientHomePage";
import { DashboardPage } from "../pages/DashboardPage";
import { TripsPage } from "../pages/TripsPage";

import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "../layouts/AppLayout";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<RoleRedirectPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/company" element={<CompanyHomePage />} />
            <Route path="/client" element={<ClientHomePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
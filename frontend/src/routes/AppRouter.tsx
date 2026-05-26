import { BrowserRouter, Route, Routes } from "react-router-dom";

import { LoginPage } from "../pages/LoginPage";
import { RoleRedirectPage } from "../pages/RoleRedirectPage";
import { CompanyHomePage } from "../pages/CompanyHomePage";
import { ClientHomePage } from "../pages/ClientHomePage";
import { DashboardPage } from "../pages/DashboardPage";
import { TripsPage } from "../pages/TripsPage";
import { TripDetailsPage } from "../pages/TripDetailsPage";
import { CreateTripPage } from "../pages/CreateTripPage";
import { ClientsPage } from "../pages/ClientsPage";

import { ProtectedRoute } from "./ProtectedRoute";
import { RoleRoute } from "./RoleRoute";
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
            <Route path="/trips/:id" element={<TripDetailsPage />} />

            <Route element={<RoleRoute allowedRoles={["CLIENT_USER"]} />}>
              <Route path="/trips/new" element={<CreateTripPage />} />
            </Route>

            <Route element={<RoleRoute allowedRoles={["COMPANY_ADMIN"]} />}>
              <Route path="/clients" element={<ClientsPage />} />
            </Route>

            <Route path="/company" element={<CompanyHomePage />} />
            <Route path="/client" element={<ClientHomePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
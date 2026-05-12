import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import { LoginPage } from "../pages/LoginPage";
import { RoleRedirectPage } from "../pages/RoleRedirectPage";
import { CompanyHomePage } from "../pages/CompanyHomePage";
import { ClientHomePage } from "../pages/ClientHomePage";

import { ProtectedRoute } from "./ProtectedRoute";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={<RoleRedirectPage />}
          />

          <Route
            path="/company"
            element={<CompanyHomePage />}
          />

          <Route
            path="/client"
            element={<ClientHomePage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
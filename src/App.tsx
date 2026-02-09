import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicRoute from "@/components/auth/PublicRoute";
import Dashboard from "@/pages/Dashboard";
import Zones from "@/pages/Zones";
import RoutesPage from "@/pages/Routes";
import Staff from "@/pages/Staff";
import Shops from "@/pages/Shops";
import Credit from "@/pages/Credit";
import Warehouses from "@/pages/Warehouses";
import Products from "@/pages/Products";
import Visits from "@/pages/Visits";
import Wallet from "@/pages/Wallet";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["distributor"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/zones" element={<Zones />} />
              <Route path="/routes" element={<RoutesPage />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/shops" element={<Shops />} />
              <Route path="/credit" element={<Credit />} />
              <Route path="/warehouses" element={<Warehouses />} />
              <Route path="/products" element={<Products />} />
              <Route path="/visits" element={<Visits />} />
              <Route path="/wallet" element={<Wallet />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

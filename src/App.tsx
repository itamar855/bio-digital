import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Auth from "./pages/Auth";
import { MpeDashboard } from "./pages/MpeDashboard";
import { PartnerDashboard } from "./pages/PartnerDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { RoleSwitcher } from "./components/RoleSwitcher";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RoleSwitcher />
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* MPE Routes */}
          <Route path="/mpe" element={<MpeDashboard />} />
          <Route path="/mpe/*" element={<MpeDashboard />} />
          
          {/* Partner Routes */}
          <Route path="/partner" element={<PartnerDashboard />} />
          <Route path="/partner/*" element={<PartnerDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
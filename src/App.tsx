import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Auth from "./pages/Auth";
import { MpeDashboard } from "./pages/MpeDashboard";
import { PartnerDashboard } from "./pages/PartnerDashboard";
import { RoleSwitcher } from "./components/RoleSwitcher";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* MPE Routes */}
          <Route path="/mpe" element={<MpeDashboard />} />
          <Route path="/mpe/*" element={<MpeDashboard />} />
          
          {/* Partner Routes */}
          <Route path="/partner" element={<PartnerDashboard />} />
          <Route path="/partner/*" element={<PartnerDashboard />} />

          {/* Admin Routes - placeholder */}
          <Route path="/admin" element={<div className="p-10 text-center font-bold">Admin Dashboard em Breve</div>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
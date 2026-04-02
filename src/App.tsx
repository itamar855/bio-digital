import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import Auth from "./pages/Auth";
import { MpeDashboard } from "./pages/MpeDashboard";
import { PartnerDashboard } from "./pages/PartnerDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { RoleSwitcher } from "./components/RoleSwitcher";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole?: string }) => {
  const { user, profile, loading } = useAuth();

  // Still loading auth session
  if (loading) return <div className="h-screen w-screen flex items-center justify-center font-bold text-primary">Carregando Ecossistema...</div>;

  // Not logged in at all
  if (!user) return <Navigate to="/auth" replace />;

  // User is logged in but profile not yet loaded — wait instead of redirecting
  if (allowedRole && !profile) return <div className="h-screen w-screen flex items-center justify-center font-bold text-primary">Carregando perfil...</div>;

  // Profile loaded but wrong role
  if (allowedRole && profile?.role !== allowedRole) return <Navigate to="/auth" replace />;

  return <>{children}</>;
};

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <RoleSwitcher />
            <Routes>
              <Route path="/" element={<Navigate to="/auth" replace />} />
              <Route path="/auth" element={<Auth />} />
              
              <Route path="/mpe/*" element={<ProtectedRoute allowedRole='mpe'><MpeDashboard /></ProtectedRoute>} />
              <Route path="/partner/*" element={<ProtectedRoute allowedRole='partner'><PartnerDashboard /></ProtectedRoute>} />
              <Route path="/admin/*" element={<ProtectedRoute allowedRole='admin'><AdminDashboard /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
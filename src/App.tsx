
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import { AdminLogin } from "./components/AdminLogin"; 
import DaftarRapatPeserta from "./pages/DaftarRapatPeserta";
import AttendancePage from "./pages/AttendancePage";
import MeetingDetailPage from "./pages/MeetingDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/meeting/:id" element={<MeetingDetailPage />} />
          <Route
            path="/admin-login"
            element={
              <AdminLogin
                onBack={() => window.history.back()}
                onLoginSuccess={() => window.location.replace("/admin")}
              />
            }
          />
          <Route path="/attendance" element={<DaftarRapatPeserta />} />
          <Route path="/attendance/:id" element={<AttendancePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

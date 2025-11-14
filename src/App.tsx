import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CasesList from "./pages/CasesList";
import CreateCase from "./pages/CreateCase";
import CaseDetail from "./pages/CaseDetail";
import Precedents from "./pages/Precedents";
import Presentation from "./pages/Presentation";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cases"
                element={
                  <ProtectedRoute>
                    <CasesList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cases/create"
                element={
                  <ProtectedRoute>
                    <CreateCase />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cases/:case_id"
                element={
                  <ProtectedRoute>
                    <CaseDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/precedents"
                element={
                  <ProtectedRoute>
                    <Precedents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/presentation"
                element={
                  <ProtectedRoute>
                    <Presentation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

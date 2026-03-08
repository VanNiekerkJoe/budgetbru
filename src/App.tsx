
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React, { useEffect, useState, lazy, Suspense } from "react";
import { BudgetProvider } from "./contexts/BudgetContext";
import { AuthProvider } from "./contexts/AuthContext";
import WelcomeAnimation from "./components/WelcomeAnimation";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "next-themes";
import { AnimatePresence } from "framer-motion";

// Eager load critical pages
import IndexPage from "./pages/Index";
import Expenses from "./pages/Expenses";

// Lazy load non-critical pages
const Income = lazy(() => import("./pages/Income"));
const Savings = lazy(() => import("./pages/Savings"));
const Insights = lazy(() => import("./pages/Insights"));
const Profile = lazy(() => import("./pages/Profile"));
const MapPage = lazy(() => import("./pages/Map"));
const NotFound = lazy(() => import("./pages/NotFound"));
const IOUPage = lazy(() => import("./pages/IOUPage"));
const TipsPage = lazy(() => import("./pages/TipsPage"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));
const EmergencyFund = lazy(() => import("./pages/EmergencyFund"));
const DigitalReceipt = lazy(() => import("./pages/DigitalReceipt"));
const VibesHubPage = lazy(() => import("./pages/VibesHubPage"));
const PlanningPage = lazy(() => import("./pages/PlanningPage"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const CouplesPage = lazy(() => import("./pages/CouplesPage"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<MainLayout><PageLoader /></MainLayout>}>
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute><MainLayout><IndexPage /></MainLayout></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><MainLayout><Expenses /></MainLayout></ProtectedRoute>} />
          <Route path="/income" element={<ProtectedRoute><MainLayout><Income /></MainLayout></ProtectedRoute>} />
          <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
          <Route path="/savings" element={<ProtectedRoute><MainLayout><Savings /></MainLayout></ProtectedRoute>} />
          <Route path="/insights" element={<ProtectedRoute><MainLayout><Insights /></MainLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>} />
          <Route path="/emergency-fund" element={<ProtectedRoute><MainLayout><EmergencyFund /></MainLayout></ProtectedRoute>} />
          <Route path="/receipts" element={<ProtectedRoute><MainLayout><DigitalReceipt /></MainLayout></ProtectedRoute>} />
          <Route path="/iou" element={<ProtectedRoute><MainLayout><IOUPage /></MainLayout></ProtectedRoute>} />
          <Route path="/tips" element={<ProtectedRoute><MainLayout><TipsPage /></MainLayout></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><MainLayout><CommunityPage /></MainLayout></ProtectedRoute>} />
          <Route path="/vibes" element={<ProtectedRoute><MainLayout><VibesHubPage /></MainLayout></ProtectedRoute>} />
          <Route path="/planning" element={<ProtectedRoute><MainLayout><PlanningPage /></MainLayout></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><MainLayout><Notifications /></MainLayout></ProtectedRoute>} />
          <Route path="/couples" element={<ProtectedRoute><MainLayout><CouplesPage /></MainLayout></ProtectedRoute>} />
          
          {/* Admin route */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><MainLayout><AdminPage /></MainLayout></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const App = () => {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const hasSeenAnimation = sessionStorage.getItem('hasSeenAnimation');
    if (hasSeenAnimation) {
      setShowAnimation(false);
    } else {
      sessionStorage.setItem('hasSeenAnimation', 'true');
    }
  }, []);

  return (
    <React.StrictMode>
      {showAnimation && <WelcomeAnimation />}
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <BudgetProvider>
                <TooltipProvider>
                  <div className="min-h-screen bg-background">
                    <Toaster />
                    <Sonner position="top-center" />
                    <AnimatedRoutes />
                  </div>
                </TooltipProvider>
              </BudgetProvider>
            </AuthProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </ThemeProvider>
    </React.StrictMode>
  );
};

export default App;

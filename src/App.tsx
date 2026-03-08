
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React, { useEffect, useState, lazy, Suspense } from "react";
import { BudgetProvider } from "./contexts/BudgetContext";
import WelcomeAnimation from "./components/WelcomeAnimation";
import MainLayout from "./components/layout/MainLayout";
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

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

// Route wrapper for animations
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<MainLayout><PageLoader /></MainLayout>}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<MainLayout><IndexPage /></MainLayout>} />
          <Route path="/expenses" element={<MainLayout><Expenses /></MainLayout>} />
          <Route path="/income" element={<MainLayout><Income /></MainLayout>} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/savings" element={<MainLayout><Savings /></MainLayout>} />
          <Route path="/insights" element={<MainLayout><Insights /></MainLayout>} />
          <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
          <Route path="/emergency-fund" element={<MainLayout><EmergencyFund /></MainLayout>} />
          <Route path="/receipts" element={<MainLayout><DigitalReceipt /></MainLayout>} />
          <Route path="/iou" element={<MainLayout><IOUPage /></MainLayout>} />
          <Route path="/tips" element={<MainLayout><TipsPage /></MainLayout>} />
          <Route path="/community" element={<MainLayout><CommunityPage /></MainLayout>} />
          <Route path="/vibes" element={<MainLayout><VibesHubPage /></MainLayout>} />
          <Route path="/planning" element={<MainLayout><PlanningPage /></MainLayout>} />
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
            <BudgetProvider>
              <TooltipProvider>
                <div className="min-h-screen bg-background">
                  <Toaster />
                  <Sonner position="top-center" />
                  <AnimatedRoutes />
                </div>
              </TooltipProvider>
            </BudgetProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </ThemeProvider>
    </React.StrictMode>
  );
};

export default App;

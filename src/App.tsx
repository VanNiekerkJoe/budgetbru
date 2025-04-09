
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { BudgetProvider } from "./contexts/BudgetContext";
import WelcomeAnimation from "./components/WelcomeAnimation";
import ParticleBackground from "./components/ParticleBackground";
import MainLayout from "./components/layout/MainLayout";

// Pages
import IndexPage from "./pages/Index";
import Expenses from "./pages/Expenses";
import Income from "./pages/Income";
import Savings from "./pages/Savings";
import Insights from "./pages/Insights";
import Profile from "./pages/Profile";
import MapPage from "./pages/Map";
import NotFound from "./pages/NotFound";
import IOUPage from "./pages/IOUPage";
import TipsPage from "./pages/TipsPage";
import CommunityPage from "./pages/CommunityPage";
import EmergencyFund from "./pages/EmergencyFund";
import DigitalReceipt from "./pages/DigitalReceipt";

const queryClient = new QueryClient();

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
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <BudgetProvider>
            <TooltipProvider>
              <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
                <Toaster />
                <Sonner position="top-center" />
                
                {/* Ambient background effects */}
                <div className="fixed inset-0 z-0">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(155,135,245,0.1),transparent_70%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,195,160,0.1),transparent_70%)]" />
                  <ParticleBackground count={20} className="opacity-20" />
                </div>
                
                <Routes>
                  <Route path="/" element={<MainLayout><IndexPage /></MainLayout>} />
                  <Route path="/expenses" element={<MainLayout><Expenses /></MainLayout>} />
                  <Route path="/income" element={<MainLayout><Income /></MainLayout>} />
                  <Route path="/map" element={<MainLayout><MapPage /></MainLayout>} />
                  <Route path="/savings" element={<MainLayout><Savings /></MainLayout>} />
                  <Route path="/insights" element={<MainLayout><Insights /></MainLayout>} />
                  <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
                  
                  <Route path="/emergency-fund" element={<MainLayout><EmergencyFund /></MainLayout>} />
                  <Route path="/receipts" element={<MainLayout><DigitalReceipt /></MainLayout>} />
                  
                  <Route path="/iou" element={<MainLayout><IOUPage /></MainLayout>} />
                  <Route path="/tips" element={<MainLayout><TipsPage /></MainLayout>} />
                  <Route path="/community" element={<MainLayout><CommunityPage /></MainLayout>} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </TooltipProvider>
          </BudgetProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;

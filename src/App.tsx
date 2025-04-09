
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { BudgetProvider } from "./contexts/BudgetContext";
import WelcomeAnimation from "./components/WelcomeAnimation";
import ParticleBackground from "./components/ParticleBackground";
import FloatingChatbot from "./components/FloatingChatbot";

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
              <div className="relative min-h-screen bg-gradient-to-br from-indigo-50/30 via-purple-50/30 to-pink-50/30 dark:from-gray-900/40 dark:via-indigo-950/30 dark:to-purple-950/40 overflow-hidden">
                {/* Enhanced particle background with more subtle effects */}
                <div className="fixed inset-0 z-0">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(155,135,245,0.1),transparent_70%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,195,160,0.1),transparent_70%)]" />
                  <ParticleBackground count={30} className="opacity-20" />
                </div>
                
                {/* Floating light orbs for ambient effect */}
                <div className="fixed top-1/4 right-1/4 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl" />
                <div className="fixed bottom-1/3 left-1/3 w-60 h-60 bg-blue-300/10 rounded-full blur-3xl" />
                <div className="fixed top-2/3 right-1/3 w-32 h-32 bg-pink-300/10 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                  <Toaster />
                  <Sonner position="top-center" />
                  <Routes>
                    <Route path="/" element={<IndexPage />} />
                    <Route path="/expenses" element={<Expenses />} />
                    <Route path="/income" element={<Income />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/savings" element={<Savings />} />
                    <Route path="/insights" element={<Insights />} />
                    <Route path="/profile" element={<Profile />} />
                    
                    <Route path="/emergency-fund" element={<EmergencyFund />} />
                    <Route path="/receipts" element={<DigitalReceipt />} />
                    
                    <Route path="/iou" element={<IOUPage />} />
                    <Route path="/tips" element={<TipsPage />} />
                    <Route path="/community" element={<CommunityPage />} />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  
                  {/* Add floating chatbot to all pages */}
                  <FloatingChatbot />
                </div>
              </div>
            </TooltipProvider>
          </BudgetProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;

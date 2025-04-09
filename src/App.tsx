
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
              <div className="relative min-h-screen bg-gradient-to-br from-white/20 to-purple-100/20 dark:from-gray-900/20 dark:to-indigo-950/20">
                {/* Enhanced global particle background for all pages */}
                <div className="fixed inset-0 z-0">
                  <ParticleBackground count={50} className="opacity-30" />
                </div>
                
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

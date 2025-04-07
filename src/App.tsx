
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { BudgetProvider } from "./contexts/BudgetContext";
import WelcomeAnimation from "./components/WelcomeAnimation";
import CursorParticleEffect from "./components/CursorParticleEffect";

// Pages
import Index from "./pages/Index";
import Expenses from "./pages/Expenses";
import Income from "./pages/Income";
import Savings from "./pages/Savings";
import Insights from "./pages/Insights";
import Profile from "./pages/Profile";
import Map from "./pages/Map";
import NotFound from "./pages/NotFound";
import IOUPage from "./pages/IOUPage";
import TipsPage from "./pages/TipsPage";
import PlanningPage from "./pages/PlanningPage";
import VibesHubPage from "./pages/VibesHubPage";
import CommunityPage from "./pages/CommunityPage";
import EmergencyFund from "./pages/EmergencyFund";
import DigitalReceipt from "./pages/DigitalReceipt";

const queryClient = new QueryClient();

const App = () => {
  const [showAnimation, setShowAnimation] = useState(true);
  const [showParticles, setShowParticles] = useState(true);

  // Check if this is the first load of the session
  useEffect(() => {
    const hasSeenAnimation = sessionStorage.getItem('hasSeenAnimation');
    if (hasSeenAnimation) {
      setShowAnimation(false);
    } else {
      sessionStorage.setItem('hasSeenAnimation', 'true');
    }
    
    // Check user preference for particles
    const particlesDisabled = localStorage.getItem('particlesDisabled');
    if (particlesDisabled === 'true') {
      setShowParticles(false);
    }
  }, []);

  return (
    <React.StrictMode>
      {showAnimation && <WelcomeAnimation />}
      {showParticles && <CursorParticleEffect 
        size={16} 
        colors={['#CA529A', '#106A94', '#304575', '#8B5CF6']} 
        glowIntensity={0.8}
        lifespan={45}
      />}
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <BudgetProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner position="top-center" />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/income" element={<Income />} />
                <Route path="/map" element={<Map />} />
                <Route path="/savings" element={<Savings />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/profile" element={<Profile />} />
                
                <Route path="/emergency-fund" element={<EmergencyFund />} />
                <Route path="/receipts" element={<DigitalReceipt />} />
                
                <Route path="/iou" element={<IOUPage />} />
                <Route path="/tips" element={<TipsPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/planning" element={<PlanningPage />} />
                <Route path="/vibes" element={<VibesHubPage />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </BudgetProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;

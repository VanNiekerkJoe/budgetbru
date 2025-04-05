
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import { BudgetProvider } from "./contexts/BudgetContext";

// Pages
import Index from "./pages/Index";
import Expenses from "./pages/Expenses";
import Savings from "./pages/Savings";
import Insights from "./pages/Insights";
import Profile from "./pages/Profile";
import Map from "./pages/Map";
import NotFound from "./pages/NotFound";
import IOUPage from "./pages/IOUPage";
import TipsPage from "./pages/TipsPage";

// Placeholder pages for new routes
const CommunityPage = () => <div className="p-4 pt-16">Community Chat Group coming soon</div>;
const PlanningPage = () => <div className="p-4 pt-16">Group Planning coming soon</div>;
const VibesHubPage = () => <div className="p-4 pt-16">Varsity Vibes Hub coming soon</div>;

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <BudgetProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner position="top-center" />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/map" element={<Map />} />
              <Route path="/savings" element={<Savings />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Updated Routes */}
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

export default App;

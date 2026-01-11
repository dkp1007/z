import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Horoscope from "./pages/Horoscope";
import Compatibility from "./pages/Compatibility";
import LuckMeter from "./pages/LuckMeter";
import Feed from "./pages/Feed";
import Upgrade from "./pages/Upgrade";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import WeeklyForecast from "./pages/WeeklyForecast";
import Subscription from "./pages/Subscription";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/horoscope" element={<Horoscope />} />
            <Route path="/compatibility" element={<Compatibility />} />
            <Route path="/luck-meter" element={<LuckMeter />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/upgrade" element={<Upgrade />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/weekly-forecast" element={<WeeklyForecast />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

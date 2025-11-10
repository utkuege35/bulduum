import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ProfileSetup from "@/pages/ProfileSetup";
import Categories from "@/pages/Categories";
import Providers from "@/pages/Providers";
import Seekers from "@/pages/Seekers";
import ProviderProfile from "@/pages/ProviderProfile";
import Messages from "@/pages/Messages";
import CreateListing from "@/pages/CreateListing";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/giris" component={Login} />
      <Route path="/kayit-ol" component={Register} />
      <Route path="/profil" component={ProfileSetup} />
      <Route path="/profil-olustur" component={ProfileSetup} />
      <Route path="/kategoriler" component={Categories} />
      <Route path="/hizmet-saglayicilar" component={Providers} />
      <Route path="/hizmet-arayanlar" component={Seekers} />
      <Route path="/profil/:userId" component={ProviderProfile} />
      <Route path="/mesajlar" component={Messages} />
      <Route path="/mesajlar/:userId" component={Messages} />
      <Route path="/ilan-olustur" component={CreateListing} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

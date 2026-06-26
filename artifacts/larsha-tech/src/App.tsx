import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import BookRepair from "@/pages/book-repair";
import Careers from "@/pages/careers";
import FreeDiagnosis from "@/pages/free-diagnosis";
import AdminPage from "@/pages/admin";

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
      >
        <Switch>
          <Route path="/">{() => <Home />}</Route>
          <Route path="/book-repair">{() => <BookRepair />}</Route>
          <Route path="/careers">{() => <Careers />}</Route>
          <Route path="/free-diagnosis">{() => <FreeDiagnosis />}</Route>
          <Route path="/admin">{() => <AdminPage />}</Route>
          <Route>{() => <NotFound />}</Route>
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

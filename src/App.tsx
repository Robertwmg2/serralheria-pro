import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Orcamentos from "./pages/Orcamentos";
import Materiais from "./pages/Materiais";
import Ferramentas from "./pages/Ferramentas";
import Agenda from "./pages/Agenda";
import Projetos from "./pages/Projetos";
import Portfolio from "./pages/Portfolio";
import Cortes from "./pages/Cortes";
import CAD from "./pages/CAD";
import Financeiro from "./pages/Financeiro";
import Simulador from "./pages/Simulador";
import IA from "./pages/IA";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/orcamentos" element={<Orcamentos />} />
          <Route path="/materiais" element={<Materiais />} />
          <Route path="/ferramentas" element={<Ferramentas />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/projetos" element={<Projetos />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/cortes" element={<Cortes />} />
          <Route path="/cad" element={<CAD />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/simulador" element={<Simulador />} />
          <Route path="/ia" element={<IA />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import Shop from "./pages/Shop.tsx";
import About from "./pages/About.tsx";
import History from "./pages/History.tsx";
import ProductPage from "./pages/Product.tsx";
import Cuidados from "./pages/Cuidados.tsx";
import Artigo from "./pages/Artigo.tsx";
import Auth from "./pages/Auth.tsx";
import Conta from "./pages/Conta.tsx";
import Pedidos from "./pages/Pedidos.tsx";
import Admin from "./pages/Admin.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminHome from "./pages/admin/AdminHome.tsx";
import AdminProducts from "./pages/admin/AdminProducts.tsx";
import AdminContent from "./pages/admin/AdminContent.tsx";
import { AdminArticles, AdminArticleEditor } from "./pages/admin/AdminArticles.tsx";
import AdminCustomers from "./pages/admin/AdminCustomers.tsx";
import AdminOrders from "./pages/admin/AdminOrders.tsx";
import AdminShop from "./pages/admin/AdminShop.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/loja" element={<Shop />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/historia" element={<History />} />
            <Route path="/product/:handle" element={<ProductPage />} />
            <Route path="/cuidados" element={<Cuidados />} />
            <Route path="/cuidados/:slug" element={<Artigo />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/conta" element={<ProtectedRoute><Conta /></ProtectedRoute>} />
            <Route path="/conta/pedidos" element={<ProtectedRoute><Pedidos /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminHome />} />
              <Route path="produtos" element={<AdminProducts />} />
              <Route path="conteudo" element={<AdminContent />} />
              <Route path="artigos" element={<AdminArticles />} />
              <Route path="artigos/novo" element={<AdminArticleEditor key="novo" />} />
              <Route path="artigos/:id" element={<AdminArticleEditor />} />
              <Route path="clientes" element={<AdminCustomers />} />
              <Route path="pedidos" element={<AdminOrders />} />
              <Route path="loja" element={<AdminShop />} />
            </Route>
            <Route path="/admin/legacy" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

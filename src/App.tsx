import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { trackPageView } from "@/hooks/useAnalytics";
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
import AdminBanners from "./pages/admin/AdminBanners.tsx";
import AdminProducts from "./pages/admin/AdminProducts.tsx";
import AdminContent from "./pages/admin/AdminContent.tsx";
import { AdminArticles, AdminArticleEditor } from "./pages/admin/AdminArticles.tsx";
import AdminCustomers from "./pages/admin/AdminCustomers.tsx";
import AdminOrders from "./pages/admin/AdminOrders.tsx";
import AdminShop from "./pages/admin/AdminShop.tsx";
import AdminMetrics from "./pages/admin/AdminMetrics.tsx";
import NotFound from "./pages/NotFound.tsx";

// Tracks page views on every route change
const AnalyticsTracker = () => {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);
  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<><AnalyticsTracker /><Index /></>} />
            <Route path="/loja" element={<><AnalyticsTracker /><Shop /></>} />
            <Route path="/sobre" element={<><AnalyticsTracker /><About /></>} />
            <Route path="/historia" element={<><AnalyticsTracker /><History /></>} />
            <Route path="/product/:handle" element={<><AnalyticsTracker /><ProductPage /></>} />
            <Route path="/cuidados" element={<><AnalyticsTracker /><Cuidados /></>} />
            <Route path="/cuidados/:slug" element={<><AnalyticsTracker /><Artigo /></>} />
            <Route path="/auth" element={<><AnalyticsTracker /><Auth /></>} />
            <Route path="/conta" element={<ProtectedRoute><><AnalyticsTracker /><Conta /></></ProtectedRoute>} />
            <Route path="/conta/pedidos" element={<ProtectedRoute><><AnalyticsTracker /><Pedidos /></></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminHome />} />
              <Route path="banners" element={<AdminBanners />} />
              <Route path="produtos" element={<AdminProducts />} />
              <Route path="conteudo" element={<AdminContent />} />
              <Route path="artigos" element={<AdminArticles />} />
              <Route path="artigos/novo" element={<AdminArticleEditor key="novo" />} />
              <Route path="artigos/:id" element={<AdminArticleEditor />} />
              <Route path="clientes" element={<AdminCustomers />} />
              <Route path="pedidos" element={<AdminOrders />} />
              <Route path="loja" element={<AdminShop />} />
              <Route path="metricas" element={<AdminMetrics />} />
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

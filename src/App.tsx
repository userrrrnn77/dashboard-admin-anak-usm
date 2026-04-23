import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

// Import Layout & Pages
import { MainLayout } from "./layouts/MainLayout";
import { useAuthStore } from "./store/authStore";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useThemeStore } from "./store/themeStore";
import { useEffect } from "react";
import RegisterUser from "./pages/RegisterUser";
import BaitulMaal from "./pages/BaitulMaal";
import UsersPage from "./pages/Users";
import Products from "./pages/Products";
import Gallery from "./pages/Gallery";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Carousel from "./pages/Carousel";

const queryClient = new QueryClient();

const App = () => {
  const isDarkMode = useThemeStore((s) => s.isDarkMode);
  const isAuthenticated = useAuthStore((state) => state.isauthenticated);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
          />
          <Route path="/123241674821658" element={<Register />} />

          {/* Private Routes (Semua yang butuh Sidebar & Navbar) */}
          <Route
            element={
              isAuthenticated ? <MainLayout /> : <Navigate to="/login" />
            }>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/register" element={<RegisterUser />} />
            <Route path="/baitul-maal" element={<BaitulMaal />} />
            <Route path="/products" element={<Products />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/carousel" element={<Carousel />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster richColors position="top-right" />
      </Router>
    </QueryClientProvider>
  );
};

export default App;

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

// Dummy Pages dulu biar kaga error pas di-import
const Dashboard = () => (
  <h1 className="text-2xl font-bold">Dashboard Dashboard-an</h1>
);
const Users = () => (
  <h1 className="text-2xl font-bold">Daftar User & Pendaftar</h1>
);

const queryClient = new QueryClient();

const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isauthenticated);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route
            path="/login"
            element={
              !isAuthenticated ? <Login /> : <Navigate to="/" />
            }
          />
          <Route
          path="/123241674821658" element={<Register />} 
          />

          {/* Private Routes (Semua yang butuh Sidebar & Navbar) */}
          <Route
            element={
              isAuthenticated ? <MainLayout /> : <Navigate to="/login" />
            }>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            {/* Tambahin route lain di sini nanti, Bre */}
          </Route>

          {/* 404 */}
          <Route path="*" element={<div>Nyasar lu, Bre!</div>} />
        </Routes>

        <Toaster richColors position="top-right" />
      </Router>
    </QueryClientProvider>
  );
};

export default App;

import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { clearToken, getToken, setToken } from "./api/apiClient.js";
import Navigation from "./components/Navigation.jsx";
import DishesPage from "./pages/DishesPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import BudgetsPage from "./pages/BudgetsPage.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import TransactionsPage from "./pages/TransactionsPage.jsx";
import { useState } from "react";

function ProtectedRoute({ isAuthenticated, loginPath = "/budget/login", children }) {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace state={{ returnPath: location.pathname }} />;
  }

  return children;
}

export default function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getToken()));

  function handleAuthenticated(token, returnPath = "/budget/dashboard") {
    setToken(token);
    setIsAuthenticated(true);
    navigate(returnPath);
  }

  function handleLogout() {
    clearToken();
    setIsAuthenticated(false);
    navigate("/budget/login");
  }

  return (
    <div className="app-shell">
      {isAuthenticated && <Navigation onLogout={handleLogout} />}
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} />} />
          <Route
            path="/dishes"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} loginPath="/dishes/login">
                <DishesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/budget/login"
            element={<LoginPage appName="BudgetFlow" registerPath="/budget/register" defaultReturnPath="/budget/dashboard" onAuthenticated={handleAuthenticated} />}
          />
          <Route
            path="/budget/register"
            element={<RegisterPage appName="BudgetFlow" loginPath="/budget/login" defaultReturnPath="/budget/dashboard" onAuthenticated={handleAuthenticated} />}
          />
          <Route
            path="/dishes/login"
            element={<LoginPage appName="Koch-Assistenz" registerPath="/dishes/register" defaultReturnPath="/dishes" onAuthenticated={handleAuthenticated} />}
          />
          <Route
            path="/dishes/register"
            element={<RegisterPage appName="Koch-Assistenz" loginPath="/dishes/login" defaultReturnPath="/dishes" onAuthenticated={handleAuthenticated} />}
          />
          <Route path="/login" element={<LoginPage appName="BudgetFlow" registerPath="/register" defaultReturnPath="/budget/dashboard" onAuthenticated={handleAuthenticated} />} />
          <Route path="/register" element={<RegisterPage appName="BudgetFlow" loginPath="/login" defaultReturnPath="/budget/dashboard" onAuthenticated={handleAuthenticated} />} />
          <Route
            path="/budget/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/budget/budgets"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <BudgetsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/budget/categories"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <CategoriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/budget/transactions"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <TransactionsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/dashboard" element={<Navigate to="/budget/dashboard" replace />} />
          <Route path="/budgets" element={<Navigate to="/budget/budgets" replace />} />
          <Route path="/categories" element={<Navigate to="/budget/categories" replace />} />
          <Route path="/transactions" element={<Navigate to="/budget/transactions" replace />} />
        </Routes>
      </main>
    </div>
  );
}

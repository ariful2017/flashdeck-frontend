import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Decks from "./pages/Decks";
import DeckDetail from "./pages/DeckDetail";
import Study from "./pages/Study";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route path="/decks" element={<Decks />} />

            <Route
              path="/decks/:deckId"
              element={<DeckDetail />}
            />

            <Route path="/study" element={<Study />} />
          </Route>

          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

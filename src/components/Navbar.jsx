import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="navbar">
      <Link to="/dashboard" className="brand">
        FlashDeck
      </Link>

      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/decks">Decks</Link>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
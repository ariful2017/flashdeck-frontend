import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Page not found</h1>
        <p className="muted">
          The page you requested does not exist.
        </p>
        <Link to="/dashboard">Return to dashboard</Link>
      </section>
    </main>
  );
}
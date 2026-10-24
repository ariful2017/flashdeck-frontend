import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import { getStats } from "../api/cards";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadStats() {
      try {
        const data = await getStats();

        if (active) {
          setStats(data);
        }
      } catch {
        if (active) {
          setError(
            "Could not load statistics. Check your Django server.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Navbar />

      <main className="page-container">
        <div className="page-heading">
          <div>
            <p className="eyebrow">YOUR LEARNING SPACE</p>
            <h1>Dashboard</h1>
            <p className="muted">
              Your study progress at a glance.
            </p>
          </div>

          <Link className="primary-link" to="/decks">
            View decks
          </Link>
        </div>

        {loading && <p>Loading statistics...</p>}

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {stats && !loading && (
          <>
            <section className="stats-grid">
              <Stat title="Due now" value={stats.due_now} />
              <Stat title="Total cards" value={stats.cards} />
              <Stat title="Mastered" value={stats.mastered} />
              <Stat title="Accuracy" value={`${stats.accuracy}%`} />
            </section>

            <section className="panel">
              <h2>Cards by box</h2>

              <div className="box-grid">
                {Object.entries(stats.boxes).map(
                  ([box, count]) => (
                    <div className="box-item" key={box}>
                      <span>Box {box}</span>
                      <strong>{count}</strong>
                    </div>
                  ),
                )}
              </div>

              <p className="muted">
                You have {stats.decks} deck(s) and reviewed{" "}
                {stats.reviewed_today} card(s) today.
              </p>
            </section>
          </>
        )}

        {!loading && !error && stats?.cards === 0 && (
          <section className="empty-state">
            <h2>Your first deck is waiting</h2>
            <p>
              Create a deck and add some cards to start studying.
            </p>
            <Link className="primary-link" to="/decks">
              Go to decks
            </Link>
          </section>
        )}
      </main>
    </>
  );
}

function Stat({ title, value }) {
  return (
    <article className="stat-card">
      <p className="muted">{title}</p>
      <strong>{value}</strong>
    </article>
  );
}
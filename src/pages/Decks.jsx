
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import DeckForm from "../components/DeckForm";

import {
  getDecks,
  createDeck,
  deleteDeck,
} from "../api/decks";

const subjects = [
  "PROGRAMMING",
  "LANGUAGE",
  "ACADEMIC",
  "INTERVIEW",
  "OTHER",
];

export default function Decks() {
  const [result, setResult] = useState({
    results: [],
    count: 0,
    next: null,
    previous: null,
  });

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [archived, setArchived] = useState("false");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadDecks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = { page };

      if (search.trim()) params.search = search.trim();
      if (subject) params.subject = subject;
      if (archived !== "") params.is_archived = archived;

      const data = await getDecks(params);

      // DRF pagination returns { count, next, previous, results }.
      setResult(
        Array.isArray(data)
          ? {
              results: data,
              count: data.length,
              next: null,
              previous: null,
            }
          : data,
      );
    } catch {
      setError("Could not load decks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, search, subject, archived]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDecks();
  }, [loadDecks]);

  async function handleCreate(deckData) {
    setSaving(true);

    try {
      await createDeck(deckData);
      setShowForm(false);
      setPage(1);
      setSearch("");
      setSubject("");
      setArchived("false");

      // Load the new deck immediately using default filters.
      const data = await getDecks({ is_archived: "false" });
      setResult(data);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await deleteDeck(deleteTarget.id);
      setDeleteTarget(null);
      await loadDecks();
    } catch {
      setError("Could not delete this deck. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="page-container">
        <div className="page-heading">
          <div>
            <p className="eyebrow">ORGANIZE YOUR KNOWLEDGE</p>
            <h1>My decks</h1>
            <p className="muted">
              Create a collection for each subject you study.
            </p>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={() => setShowForm(true)}
          >
            + New deck
          </button>
        </div>

        {showForm && (
          <section className="panel form-panel">
            <h2>Create a deck</h2>
            <DeckForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
              loading={saving}
            />
          </section>
        )}

        <section className="filter-bar">
          <input
            aria-label="Search decks"
            placeholder="Search by deck title..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />

          <select
            aria-label="Filter by subject"
            value={subject}
            onChange={(event) => {
              setSubject(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All subjects</option>
            {subjects.map((item) => (
              <option key={item} value={item}>
                {item.charAt(0) + item.slice(1).toLowerCase()}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by archive status"
            value={archived}
            onChange={(event) => {
              setArchived(event.target.value);
              setPage(1);
            }}
          >
            <option value="false">Active decks</option>
            <option value="true">Archived decks</option>
            <option value="">All decks</option>
          </select>
        </section>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <Loading text="Loading your decks..." />
        ) : result.results?.length ? (
          <>
            <section className="deck-grid">
              {result.results.map((deck) => (
                <article className="deck-card" key={deck.id}>
                  <div className="deck-card-top">
                    <span className="subject-tag">
                      {deck.subject}
                    </span>
                    {deck.is_archived && (
                      <span className="archived-tag">
                        Archived
                      </span>
                    )}
                  </div>

                  <h2>{deck.title}</h2>

                  <p className="muted deck-description">
                    {deck.description || "No description yet."}
                  </p>

                  <div className="deck-metrics">
                    <span>{deck.card_count ?? 0} cards</span>
                    <span>{deck.due_count ?? 0} due</span>
                  </div>

                  <div className="deck-actions">
                    <Link
                      className="primary-link"
                      to={`/decks/${deck.id}`}
                    >
                      Open deck
                    </Link>

                    <button
                      type="button"
                      className="text-danger"
                      onClick={() => setDeleteTarget(deck)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </section>

            <div className="pagination">
              <button
                type="button"
                className="secondary-button"
                disabled={!result.previous}
                onClick={() => setPage((current) => current - 1)}
              >
                Previous
              </button>

              <span>
                {result.count} deck(s) total · Page {page}
              </span>

              <button
                type="button"
                className="secondary-button"
                disabled={!result.next}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <EmptyState
            title="No decks found"
            message={
              search || subject || archived === "true"
                ? "Try changing your filters or search."
                : "Create your first deck to begin studying."
            }
            action={
              <button
                type="button"
                className="primary-button"
                onClick={() => setShowForm(true)}
              >
                Create your first deck
              </button>
            }
          />
        )}

        {deleteTarget && (
          <ConfirmDialog
            title="Delete this deck?"
            message={`"${deleteTarget.title}" and all its flashcards will be permanently deleted.`}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
            loading={deleting}
          />
        )}
      </main>
    </>
  );
}

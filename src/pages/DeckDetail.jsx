import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import DeckForm from "../components/DeckForm";
import CardForm from "../components/CardForm";

import {
  getDeck,
  updateDeck,
} from "../api/decks";

import {
  getCards,
  createCard,
  updateCard,
  deleteCard,
} from "../api/cards";

export default function DeckDetail() {
  const { deckId } = useParams();

  const [deck, setDeck] = useState(null);
  const [result, setResult] = useState({
    results: [],
    count: 0,
    next: null,
    previous: null,
  });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingDeck, setEditingDeck] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [deckData, cardsData] = await Promise.all([
        getDeck(deckId),
        getCards({
          deck: deckId,
          page,
          ...(search.trim() ? { search: search.trim() } : {}),
        }),
      ]);

      setDeck(deckData);
      setResult(
        Array.isArray(cardsData)
          ? {
              results: cardsData,
              count: cardsData.length,
              next: null,
              previous: null,
            }
          : cardsData,
      );
    } catch (err) {
      setError(
        err.response?.status === 404
          ? "This deck was not found or you do not have access to it."
          : "Could not load this deck. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [deckId, page, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  async function handleDeckUpdate(data) {
    setSaving(true);

    try {
      const updated = await updateDeck(deckId, data);
      setDeck(updated);
      setEditingDeck(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleCardSave(data) {
    setSaving(true);

    try {
      if (editingCard) {
        await updateCard(editingCard.id, data);
      } else {
        await createCard({
          ...data,
          deck: Number(deckId),
        });
      }

      setShowCardForm(false);
      setEditingCard(null);
      setPage(1);
      await loadData();
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCard() {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await deleteCard(deleteTarget.id);
      setDeleteTarget(null);
      await loadData();
    } catch {
      setError("Could not delete this card.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading && !deck) {
    return (
      <>
        <Navbar />
        <main className="page-container">
          <Loading text="Loading deck..." />
        </main>
      </>
    );
  }

  if (error && !deck) {
    return (
      <>
        <Navbar />
        <main className="page-container">
          <p className="error-message">{error}</p>
          <Link to="/decks">Back to decks</Link>
        </main>
      </>
    );
  }

  if (!deck) return null;

  return (
    <>
      <Navbar />

      <main className="page-container">
        <Link className="back-link" to="/decks">
          ← Back to decks
        </Link>

        <section className="deck-detail-header">
          <div>
            <span className="subject-tag">{deck.subject}</span>
            <h1>{deck.title}</h1>
            <p className="muted">
              {deck.description || "No description yet."}
            </p>
            <p className="muted">
              {deck.card_count ?? result.count} card(s) ·{" "}
              {deck.due_count ?? 0} due for review
            </p>
          </div>

          <div className="button-row">
            <Link
              className="primary-link"
              to={`/study?deck=${deck.id}`}
            >
              Study this deck
            </Link>

            <button
              type="button"
              className="secondary-button"
              onClick={() => setEditingDeck((value) => !value)}
            >
              Edit deck
            </button>
          </div>
        </section>

        {editingDeck && (
          <section className="panel form-panel">
            <h2>Edit deck</h2>
            <DeckForm
              initialData={deck}
              onSubmit={handleDeckUpdate}
              onCancel={() => setEditingDeck(false)}
              loading={saving}
            />
          </section>
        )}

        <div className="page-heading">
          <div>
            <h2>Flashcards</h2>
            <p className="muted">
              Create questions and answers for this deck.
            </p>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={() => {
              setEditingCard(null);
              setShowCardForm(true);
            }}
          >
            + Add card
          </button>
        </div>

        {(showCardForm || editingCard) && (
          <section className="panel form-panel">
            <h2>{editingCard ? "Edit card" : "New flashcard"}</h2>

            <CardForm
              key={editingCard?.id ?? "new"}
              initialData={editingCard}
              onSubmit={handleCardSave}
              onCancel={() => {
                setShowCardForm(false);
                setEditingCard(null);
              }}
              loading={saving}
            />
          </section>
        )}

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        <section className="filter-bar">
          <input
            aria-label="Search flashcards"
            placeholder="Search questions and answers..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </section>

        {loading ? (
          <Loading text="Loading flashcards..." />
        ) : result.results?.length ? (
          <>
            <section className="card-list">
              {result.results.map((card) => (
                <article className="flashcard-row" key={card.id}>
                  <div className="flashcard-content">
                    <p className="eyebrow">QUESTION</p>
                    <p className="card-front">{card.front}</p>

                    {card.hint && (
                      <p className="muted">
                        <strong>Hint:</strong> {card.hint}
                      </p>
                    )}

                    <details className="answer-details">
                      <summary>Show answer</summary>
                      <p>{card.back}</p>
                    </details>

                    <div className="card-metadata">
                      <span>Box {card.box}</span>
                      <span>
                        Reviews: {card.times_reviewed}
                      </span>
                    </div>
                  </div>

                  <div className="card-row-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => {
                        setShowCardForm(false);
                        setEditingCard(card);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="text-danger"
                      onClick={() => setDeleteTarget(card)}
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
                onClick={() => setPage((value) => value - 1)}
              >
                Previous
              </button>

              <span>{result.count} card(s) total · Page {page}</span>

              <button
                type="button"
                className="secondary-button"
                disabled={!result.next}
                onClick={() => setPage((value) => value + 1)}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <EmptyState
            title="No flashcards yet"
            message={
              search
                ? "No cards match your search."
                : "Add your first question and answer to this deck."
            }
            action={
              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  setEditingCard(null);
                  setShowCardForm(true);
                }}
              >
                Add first card
              </button>
            }
          />
        )}

        {deleteTarget && (
          <ConfirmDialog
            title="Delete this flashcard?"
            message="This card and its review history will be permanently deleted."
            onCancel={() => setDeleteTarget(null)}
            onConfirm={handleDeleteCard}
            loading={deleting}
          />
        )}
      </main>
    </>
  );
}

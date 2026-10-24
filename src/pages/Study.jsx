
import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import { getStudyCards, reviewCard } from "../api/cards";

export default function Study() {
  const [searchParams] = useSearchParams();
  const deckId = searchParams.get("deck");

  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const loadStudyCards = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getStudyCards(deckId);
      setCards(data.cards || []);
      setIndex(0);
      setRevealed(false);
      setCompleted(0);
      setCorrectCount(0);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Could not load your study session.",
      );
    } finally {
      setLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStudyCards();
  }, [loadStudyCards]);

  const currentCard = cards[index];

  async function handleAnswer(correct) {
    if (!currentCard || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      await reviewCard(currentCard.id, correct);

      setCompleted((value) => value + 1);

      if (correct) {
        setCorrectCount((value) => value + 1);
      }

      // Remove the reviewed card from this session queue.
      setCards((previous) =>
        previous.filter((card) => card.id !== currentCard.id),
      );

      // The next card now occupies the current index.
      setRevealed(false);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Could not save your review. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="page-container study-page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">FOCUS SESSION</p>
            <h1>Study time</h1>
            <p className="muted">
              Think of the answer before revealing it.
            </p>
          </div>

          <Link
            className="secondary-button link-button"
            to={deckId ? `/decks/${deckId}` : "/decks"}
          >
            Exit study
          </Link>
        </div>

        {loading && <Loading text="Preparing your study session..." />}

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && currentCard && (
          <section className="study-card">
            <div className="study-progress">
              <span>Card {completed + 1}</span>
              <span>{cards.length} remaining</span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${
                    completed + cards.length
                      ? (completed / (completed + cards.length)) * 100
                      : 0
                  }%`,
                }}
              />
            </div>

            <div className="study-card-meta">
              <span className="subject-tag">
                {currentCard.deck_title || "Flashcard"}
              </span>
              <span className="box-tag">
                Box {currentCard.box}
              </span>
            </div>

            <p className="eyebrow">QUESTION</p>
            <div className="study-question">
              {currentCard.front}
            </div>

            {currentCard.hint && !revealed && (
              <details className="hint-details">
                <summary>Need a hint?</summary>
                <p>{currentCard.hint}</p>
              </details>
            )}

            {revealed ? (
              <>
                <div className="study-answer">
                  <p className="eyebrow">ANSWER</p>
                  <p>{currentCard.back}</p>
                </div>

                <p className="muted answer-prompt">
                  How well did you remember it?
                </p>

                <div className="answer-actions">
                  <button
                    type="button"
                    className="danger-button answer-button"
                    disabled={submitting}
                    onClick={() => handleAnswer(false)}
                  >
                    {submitting ? "Saving..." : "Again"}
                  </button>

                  <button
                    type="button"
                    className="success-button answer-button"
                    disabled={submitting}
                    onClick={() => handleAnswer(true)}
                  >
                    {submitting ? "Saving..." : "Got it"}
                  </button>
                </div>
              </>
            ) : (
              <button
                type="button"
                className="primary-button reveal-button"
                onClick={() => setRevealed(true)}
              >
                Reveal answer
              </button>
            )}
          </section>
        )}

        {!loading && !error && !currentCard && (
          <section className="study-complete">
            <div className="empty-icon" aria-hidden="true">
              ✓
            </div>

            <p className="eyebrow">SESSION COMPLETE</p>
            <h1>Nice work!</h1>
            <p className="muted">
              You reviewed {completed} card(s) and marked{" "}
              {correctCount} as correct.
            </p>

            <div className="completion-actions">
              <button
                type="button"
                className="primary-button"
                onClick={loadStudyCards}
              >
                Check for more due cards
              </button>

              <Link
                className="secondary-button link-button"
                to={deckId ? `/decks/${deckId}` : "/decks"}
              >
                Back to decks
              </Link>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

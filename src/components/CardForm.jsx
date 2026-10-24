import { useState } from "react";

export default function CardForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [form, setForm] = useState({
    front: initialData?.front || "",
    back: initialData?.back || "",
    hint: initialData?.hint || "",
  });

  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.front.trim() || !form.back.trim()) {
      setError("Both the question and answer are required.");
      return;
    }

    try {
      await onSubmit({
        front: form.front.trim(),
        back: form.back.trim(),
        hint: form.hint.trim(),
      });
    } catch (err) {
      const data = err.response?.data;
      setError(
        data?.detail ||
        data?.front?.join(" ") ||
        data?.back?.join(" ") ||
        "Could not save the card. Please try again.",
      );
    }
  }

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      <label htmlFor="card-front">Question / Front</label>
      <textarea
        id="card-front"
        name="front"
        value={form.front}
        onChange={handleChange}
        rows={4}
        placeholder="Enter your question"
        required
      />

      <label htmlFor="card-back">Answer / Back</label>
      <textarea
        id="card-back"
        name="back"
        value={form.back}
        onChange={handleChange}
        rows={4}
        placeholder="Enter the answer"
        required
      />

      <label htmlFor="card-hint">Hint (optional)</label>
      <input
        id="card-hint"
        name="hint"
        maxLength={200}
        value={form.hint}
        onChange={handleChange}
        placeholder="A clue to help you remember"
      />

      <div className="form-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="primary-button"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save card"}
        </button>
      </div>
    </form>
  );
}

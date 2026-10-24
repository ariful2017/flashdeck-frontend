import { useState } from "react";

const subjects = [
  "PROGRAMMING",
  "LANGUAGE",
  "ACADEMIC",
  "INTERVIEW",
  "OTHER",
];

export default function DeckForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [form, setForm] = useState(() => ({
    title: initialData?.title || "",
    description: initialData?.description || "",
    subject: initialData?.subject || "OTHER",
    is_archived: Boolean(initialData?.is_archived),
  }));

  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Please enter a deck title.");
      return;
    }

    try {
      await onSubmit({
        ...form,
        title: form.title.trim(),
      });
    } catch (err) {
      const data = err.response?.data;
      setError(
        data?.title?.join(" ") ||
        data?.detail ||
        "Could not save the deck. Please try again.",
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

      <label htmlFor="deck-title">Deck title</label>
      <input
        id="deck-title"
        name="title"
        maxLength={120}
        value={form.title}
        onChange={handleChange}
        placeholder="e.g. Python Fundamentals"
        required
      />

      <label htmlFor="deck-description">Description</label>
      <textarea
        id="deck-description"
        name="description"
        value={form.description}
        onChange={handleChange}
        rows={3}
        placeholder="What will you learn?"
      />

      <label htmlFor="deck-subject">Subject</label>
      <select
        id="deck-subject"
        name="subject"
        value={form.subject}
        onChange={handleChange}
      >
        {subjects.map((subject) => (
          <option key={subject} value={subject}>
            {subject.charAt(0) +
              subject.slice(1).toLowerCase()}
          </option>
        ))}
      </select>

      {initialData && (
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="is_archived"
            checked={form.is_archived}
            onChange={handleChange}
          />
          Archive this deck
        </label>
      )}

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
          {loading ? "Saving..." : "Save deck"}
        </button>
      </div>
    </form>
  );
}

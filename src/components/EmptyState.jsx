export default function EmptyState({
  title,
  message,
  action,
}) {
  return (
    <section className="empty-state">
      <div className="empty-icon" aria-hidden="true">
        ✦
      </div>
      <h2>{title}</h2>
      <p className="muted">{message}</p>
      {action}
    </section>
  );
}

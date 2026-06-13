export default function SummaryCard({ label, value, testId }) {
  return (
    <section className="summary-card" data-testid={testId}>
      <span>{label}</span>
      <strong>{value}</strong>
    </section>
  );
}

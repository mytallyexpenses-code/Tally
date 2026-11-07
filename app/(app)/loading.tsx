export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="sk" style={{ width: 180, height: 28, marginBottom: 8 }} />
      <div className="sk" style={{ width: 120, height: 16, marginBottom: 24 }} />
      <div className="sk" style={{ height: 76, marginBottom: 20 }} />
      <div className="grid">
        <div className="sk" style={{ height: 170 }} />
        <div className="sk" style={{ height: 170 }} />
        <div className="sk" style={{ height: 170 }} />
      </div>
    </div>
  );
}

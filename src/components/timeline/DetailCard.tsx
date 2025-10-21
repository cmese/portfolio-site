// src/components/DetailCard.tsx
export default function DetailCard({ nodeId }: { nodeId: string }) {
  return (
    <div className="sticky top-10">
      <p className="text-sm opacity-60">Now viewing</p>
      <h2 className="text-2xl font-semibold break-all">{nodeId}</h2>
    </div>
  );
}

export default function SkeletonCard() {
  return (
    <div className="rounded-xl2 bg-white shadow-card overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-ajwa-softcream" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-ajwa-softcream rounded w-3/4" />
        <div className="h-3 bg-ajwa-softcream rounded w-1/2" />
      </div>
    </div>
  );
}

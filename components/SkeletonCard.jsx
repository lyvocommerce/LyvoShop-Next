import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SkeletonCard() {
  return (
    <div className="h-full flex flex-col rounded-2xl border border-[var(--border)] overflow-hidden bg-white">
      {/* Изображение */}
      <Skeleton height={160} borderRadius="0.5rem" />

      {/* Контент */}
      <div className="flex flex-col p-4 h-full">
        <Skeleton width="80%" height={16} style={{ marginBottom: 8 }} />
        <Skeleton width="60%" height={14} style={{ marginBottom: 12 }} />

        <div className="mt-auto flex items-center justify-between">
          <Skeleton width={50} height={20} />
          <Skeleton circle width={40} height={40} />
        </div>
      </div>
    </div>
  );
}
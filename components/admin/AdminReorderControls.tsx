"use client";

type AdminReorderControlsProps = {
  onMoveUp: () => void;
  onMoveDown: () => void;
  disableUp?: boolean;
  disableDown?: boolean;
};

export default function AdminReorderControls({
  onMoveUp,
  onMoveDown,
  disableUp,
  disableDown,
}: AdminReorderControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onMoveUp}
        disabled={disableUp}
        className="rounded border border-white/20 px-2 py-1 text-xs text-white disabled:opacity-30"
      >
        Up
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={disableDown}
        className="rounded border border-white/20 px-2 py-1 text-xs text-white disabled:opacity-30"
      >
        Down
      </button>
    </div>
  );
}

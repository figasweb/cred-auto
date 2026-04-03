const SHOW_PLACEHOLDERS = import.meta.env.DEV;

export default function AdPlaceholder({ label }: { label: string }) {
  if (!SHOW_PLACEHOLDERS) return null;

  return (
    <div className="w-full flex items-center justify-center py-3">
      <div className="w-full max-w-[728px] h-[90px] rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2">
        <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
    </div>
  );
}

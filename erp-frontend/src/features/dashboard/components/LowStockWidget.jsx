import SectionCard from "@/components/ui/SectionCard";
import { AlertTriangle } from "lucide-react";

export default function LowStockWidget({ count }) {
  return (
    <SectionCard>
      <div
        className="
          relative
          overflow-hidden
          rounded-2xl
          border
          border-slate-800
          bg-slate-900/60
          p-6
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-orange-500/40
          hover:shadow-[0_0_25px_rgba(251,146,60,0.12)]
        "
      >
        {/* glow background */}
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-400">Stock Alerts</p>

            <h2 className="mt-2 text-3xl font-bold text-white">{count ?? 0}</h2>

            <p className="mt-1 text-xs text-slate-500">
              Products below minimum stock
            </p>
          </div>

          <div className="rounded-xl bg-slate-800/60 p-2">
            <AlertTriangle size={18} className="text-orange-400" />
          </div>
        </div>

        {/* bottom accent line */}
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-orange-500/0 via-orange-500/40 to-orange-500/0" />
      </div>
    </SectionCard>
  );
}

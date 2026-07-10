import { useState, useRef, useEffect } from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
  FileDown,
  ChevronDown,
} from "lucide-react";

import api from "@/api/axios";

export default function ExportButton({
  endpoint,
  filters = {},
  filename = "report",
}) {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function download(format) {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value);
        }
      });

      params.append("export", format);

      const response = await api.get(`${endpoint}?${params.toString()}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;

      a.download = `${filename}.${format}`;

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);

      setOpen(false);
    } catch (error) {
      console.error("Export failed:", error);
    }
  }

  const options = [
    {
      label: "CSV",
      format: "csv",
      icon: FileText,
      color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    },
    {
      label: "PDF",
      format: "pdf",
      icon: FileDown,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
  ];

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          inline-flex items-center gap-2
          rounded-2xl
          border border-gray-700
          bg-gray-800
          px-4 py-2.5
          text-sm font-medium text-gray-200
          shadow-sm
          transition-all
          hover:bg-gray-700
          hover:border-gray-600
          hover:text-white
        "
      >
        <Download size={16} />
        Export
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="
            absolute right-0 mt-3 w-52
            overflow-hidden
            rounded-2xl
            border border-gray-700
            bg-gray-900
            shadow-2xl
            backdrop-blur-sm
            animate-in fade-in zoom-in-95
            z-50
          "
        >
          <div className="border-b border-gray-800 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Export Report
            </p>
          </div>

          <div className="p-2">
            {options.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.format}
                  onClick={() => download(item.format)}
                  className="
                    flex w-full items-center gap-3
                    rounded-xl
                    px-3 py-3
                    text-left
                    transition-all
                    hover:bg-gray-800
                  "
                >
                  <div
                    className={`
                      flex h-9 w-9 items-center justify-center
                      rounded-xl border
                      ${item.color}
                    `}
                  >
                    <Icon size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-100">
                      {item.label}
                    </p>

                    <p className="text-xs text-gray-500">
                      Download as {item.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

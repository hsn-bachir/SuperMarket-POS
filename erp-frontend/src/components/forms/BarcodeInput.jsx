import { useEffect, useRef } from "react";

export default function BarcodeInput({
  label,
  value,
  onChange,
  className = "",
}) {
  const inputRef = useRef(null);
  const bufferRef = useRef("");
  const timerRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(e) {
      const active = document.activeElement;

      // Don't interfere if user is typing in another input
      if (active && active.tagName === "INPUT" && active !== inputRef.current) {
        return;
      }

      if (e.key === "Enter") {
        if (bufferRef.current.length > 0) {
          updateBarcode(bufferRef.current);

          bufferRef.current = "";
        }

        return;
      }

      // Barcode scanners type very quickly
      if (e.key.length === 1) {
        bufferRef.current += e.key;

        clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
          bufferRef.current = "";
        }, 100);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timerRef.current);
    };
  }, []);

  function updateBarcode(barcode) {
    onChange({
      target: {
        name: "barcode",
        value: barcode,
      },
    });
  }

  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        name="barcode"
        value={value}
        onChange={onChange}
        className={`
          h-10
          w-full
          rounded-lg
          border
          border-black
          bg-white
          px-3
          text-sm
          outline-none
          transition-colors
          focus:border-gray-600
          focus:ring-2 focus:ring-gray-600/50
          ${className}
        `}
        placeholder="Scan barcode..."
      />
    </div>
  );
}

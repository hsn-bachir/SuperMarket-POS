import { useEffect, useRef } from "react";

export default function BarcodeInput({
  label,
  value,
  onChange,
  required = false,
  className = "",
}) {
  const inputRef = useRef(null);
  const bufferRef = useRef("");
  const timerRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(e) {
      const active = document.activeElement;

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
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <input
        ref={inputRef}
        name="barcode"
        value={value}
        onChange={onChange}
        required={required}
        className={`
    h-10
    w-full
    rounded-sm
    border
    border-gray-300
    bg-white
    px-3
    text-sm
    text-gray-900
    placeholder:text-gray-400
    outline-none
    transition-all
    focus:border-gray-600
    focus:ring-2
    focus:ring-gray-600/20
    disabled:cursor-not-allowed
    disabled:bg-gray-100
    disabled:text-gray-500
    disabled:opacity-100
    ${className}
  `}
        placeholder="Scan barcode..."
      />
    </div>
  );
}

"use client";

export function PrintReceiptButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-black transition-colors font-medium shadow-md"
    >
      Imprimir recibo
    </button>
  );
}

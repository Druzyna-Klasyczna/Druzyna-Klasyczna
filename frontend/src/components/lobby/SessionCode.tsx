import { useState } from "react";

interface SessionCodeProps {
  code: string;
}

export const SessionCode = ({ code }: SessionCodeProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1200);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="text-yellow-400 font-black text-2xl tracking-widest">
        {code}
      </div>

      <button
        onClick={handleCopy}
        className="relative w-10 h-10 flex items-center justify-center border-2 border-white/20 hover:border-yellow-400 transition-colors group"
        title="Kopiuj kod"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5 text-white group-hover:text-yellow-400 transition-colors"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 16h8M8 12h8m-6-8h6a2 2 0 012 2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z"
          />
        </svg>

        {copied && (
          <div className="absolute -top-7 text-xs font-black text-yellow-400">
            COPIED
          </div>
        )}
      </button>
    </div>
  );
};

import { useState } from "react";
import { Copy } from "lucide-react";

interface SessionCodeProps {
  code: string;
}

export const SessionCode = ({ code }: SessionCodeProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard unavailable (e.g. insecure context); intentionally silent.
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl font-black tracking-widest text-yellow-400">
        {code}
      </span>

      <button
        type="button"
        onClick={handleCopy}
        title="Kopiuj kod"
        className="group relative flex h-10 w-10 items-center justify-center border-2 border-white/20 transition-colors hover:border-yellow-400"
      >
        <Copy
          size={18}
          className="text-white transition-colors group-hover:text-yellow-400"
        />
        {copied && (
          <span className="absolute -top-7 text-xs font-black text-yellow-400">
            COPIED
          </span>
        )}
      </button>
    </div>
  );
};

import React from "react";

/**
 * Converts markup conventions in content strings to React nodes.
 *
 * Patterns (processed in order of specificity):
 *   **bold**    -> <strong className="font-semibold text-[#5C306C]">
 *   {{brand}}   -> <span className="font-semibold text-[#FF9966]">
 *   __medium__  -> <span className="font-medium text-[#5C306C]">
 *   {_context_} -> <span className="font-medium">  (inherits parent color)
 *   word--word  -> word\u2014word  (em-dash)
 */
export function renderRichText(text: string): React.ReactNode {
  // Split on all markup patterns, keeping delimiters
  const pattern = /(\*\*[^*]+\*\*|\{\{[^}]+\}\}|__[^_]+__|\{_[^}]+_\})/g;
  const parts = text.split(pattern);

  if (parts.length === 1) {
    // No markup — just convert em-dashes
    return text.replace(/--/g, "\u2014");
  }

  return parts.map((part, i) => {
    // **bold** -> font-semibold text-[#5C306C]
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-[#5C306C]">
          {part.slice(2, -2).replace(/--/g, "\u2014")}
        </strong>
      );
    }

    // {{brand}} -> font-semibold text-[#FF9966]
    if (part.startsWith("{{") && part.endsWith("}}")) {
      return (
        <span key={i} className="font-semibold text-[#FF9966]">
          {part.slice(2, -2)}
        </span>
      );
    }

    // __medium__ -> font-medium text-[#5C306C]
    if (part.startsWith("__") && part.endsWith("__")) {
      return (
        <span key={i} className="font-medium text-[#5C306C]">
          {part.slice(2, -2).replace(/--/g, "\u2014")}
        </span>
      );
    }

    // {_context_} -> font-medium (inherits parent color)
    if (part.startsWith("{_") && part.endsWith("_}")) {
      return (
        <span key={i} className="font-medium">
          {part.slice(2, -2).replace(/--/g, "\u2014")}
        </span>
      );
    }

    // Plain text — convert em-dashes
    return <React.Fragment key={i}>{part.replace(/--/g, "\u2014")}</React.Fragment>;
  });
}

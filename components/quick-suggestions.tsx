"use client"

interface QuickSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void
}

const suggestions = ["Trading Signals", "On-Chain Analytics", "Portfolio Insights"]

export function QuickSuggestions({ onSuggestionClick }: QuickSuggestionsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => onSuggestionClick(suggestion)}
          className="px-4 py-2 rounded-full border-2 border-[#00E6B8]/40 text-[#CFCFCF] text-sm font-medium hover:border-[#00E6B8] hover:text-white hover:bg-[#00E6B8]/10 hover:shadow-lg hover:shadow-[#00E6B8]/20 transition-all duration-300"
        >
          {suggestion}
        </button>
      ))}
    </div>
  )
}

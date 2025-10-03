export function ChatHeader() {
  return (
    <header className="sticky top-0 z-10 backdrop-blur-lg bg-[#0B0C10]/80 border-b border-[#00E6B8]/20">
      <div className="px-6 py-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00E6B8] to-[#009E86] flex items-center justify-center font-bold text-white shadow-lg shadow-[#00E6B8]/30">
          AX
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">ANDX AI Assistant</h1>
          <div className="h-0.5 w-32 bg-gradient-to-r from-[#00E6B8] to-transparent glow-effect rounded-full mt-1" />
        </div>
      </div>
    </header>
  )
}
